import React, { useState, useEffect, useRef, useCallback } from 'react'
import CrossSvg from '../svgImages/CrossSvg'
import CheckSvg from '../svgImages/CheckSvg'
import RejectConfirmModal from '../modal/RejectConfirmModal'
import dayjs from 'dayjs'
import {
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { getHeaders, ImageUrl } from 'src/constant/Global'
import profileImage1 from '../../assets/images/avatars/wrapper.png'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import { DatePicker, Breadcrumb, Checkbox, Select, Skeleton, Table } from 'antd'
import Downarrowimg from '../../assets/images/downarrow.png'
import useAxios from 'src/constant/UseAxios'
import { toPascalCase, formatTimeDuration } from '../../constant/TimeUtils'
import ApprovedConfirmModal from '../modal/ApprovedConfirmModel'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'
const { RangePicker } = DatePicker

const PendingActivity = ({
  today,
  formatDate,
  productLists,
  memberLists,
  memberLoader,
  prodLoader,
}) => {
  let api = useAxios()
  const [memberTable, setMemberTable] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [productList, setProductList] = useState([])
  const [memberList, setMemberList] = useState([])
  const [headerLabel, setHeaderLabel] = useState('')
  const rangePickerRef = useRef()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [singleId, setSingleId] = useState()
  const [commonLoader, setCommonLoader] = useState(true)
  const [rejectStatus, setRejectStatus] = useState('')
  const [openSelectAll, setOpenSelectAll] = useState(false)
  const [singleApprovedId, setSingleApprovedId] = useState('')
  const [approvedStatusAll, setApprovedStatusAll] = useState('')
  const [openSelectRejectAll, setOpenSelectRejectAll] = useState(false)
  const [approvedStatus, setApprovedStatus] = useState('')
  const [open, setOpen] = useState(false)
  const selectRef = useRef(null)
  const [mLoader, setMLoader] = useState(false)
  const [pLoader, setPLoader] = useState(false)
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)
  const pageRef = useRef(0)
  const productIdRef = useRef(0)
  const memberIdRef = useRef(0)
  const filterRef = useRef('default')
  const hasMoreRef = useRef(true)
  const [abortController, setAbortController] = useState(new AbortController())
  const tableBodyRef = useRef(null)
  const [isNorMore, setIsNorMore] = useState(false)

  const showPopconfirm = (status, rowId) => {
    setOpen(true)
    setSingleApprovedId(rowId)
    setApprovedStatus(status)
  }

  const showPopconfirmAll = (status) => {
    if (status === 'Approved') {
      setOpenSelectAll(true)
      setApprovedStatusAll('Approved')
    } else if (status === 'Reject') {
      setOpenSelectRejectAll(true)
      setApprovedStatusAll('Reject')
    }
  }

  const handleApproveCancel = () => {
    setOpen(false)
  }

  const handleApproveCancelAll = () => {
    setOpenSelectAll(false)
    setSelectedRows([])
    setHeaderLabel('')
  }

  const handleStartDateChange = (date) => {
    pageRef.current = 0
    hasMoreRef.current = true
    setProductList([])
    setMemberList([])
    setCommonLoader(true)
    setPLoader(true)
    setMLoader(true)
    if (date !== null) {
      const formattedFromDate = dayjs(date[0]).format('YYYY-MM-DD')
      const formattedToDate = dayjs(date[1]).format('YYYY-MM-DD')
      startDateRef.current = formattedFromDate
      endDateRef.current = formattedToDate
      getContractMemberActivitywithdatewise(formattedFromDate, formattedToDate)
      if (productIdRef.current !== 0 && memberIdRef.current === 0) {
        filterRef.current = 'dateandproduct'
      } else if (productIdRef.current === 0 && memberIdRef.current !== 0) {
        filterRef.current = 'dateandmember'
      } else if (productIdRef.current === 0 && memberIdRef.current === 0) {
        filterRef.current = 'date'
      } else {
        filterRef.current = 'dateandproductandmember'
      }
    } else {
      startDateRef.current = null
      endDateRef.current = null
      if (productIdRef.current !== 0 && memberIdRef.current === 0) {
        filterRef.current = 'product'
      } else if (productIdRef.current === 0 && memberIdRef.current !== 0) {
        filterRef.current = 'member'
      } else if (productIdRef.current === 0 && memberIdRef.current === 0) {
        filterRef.current = 'default'
      } else {
        filterRef.current = 'memberandproduct'
      }
      setProductList(productLists)
      setMemberList(memberLists)
      setMLoader(false)
      setPLoader(false)
    }
    getContractActivityall()
  }

  useEffect(() => {
    setMemberList(memberLists)
    setProductList(productLists)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productLists])

  useEffect(() => {
    hasMoreRef.current = true
    getContractActivityall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleHeaderCheck = (isChecked) => {
    if (isChecked) {
      const allRowIds = memberTable.map((row) => row.id)
      setSelectedRows(allRowIds)
      setHeaderLabel(`${allRowIds.length} Selected`)
    } else {
      setSelectedRows([])
      setHeaderLabel('')
    }
  }

  const handleMemberCheck = (rowId, isChecked) => {
    if (isChecked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, rowId])
    } else {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((selectedId) => selectedId !== rowId),
      )
    }

    // Calculate the new number of selected rows
    const newSelectedRows = isChecked
      ? [...selectedRows, rowId]
      : selectedRows.filter((selectedId) => selectedId !== rowId)
    const newSelectedRowCount = newSelectedRows.length

    // Update the header label
    if (newSelectedRowCount < 1) {
      setHeaderLabel('')
    } else {
      setHeaderLabel(`${newSelectedRowCount} Selected`)
    }
  }

  const handleButtonClick = async (status, id, remarksValue) => {
    if (approvedStatusAll === 'Reject' && remarksValue === '') {
      toast.error('Please Enter Remarks!..', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
    } else {
      return await statuschange(approvedStatusAll, selectedRows, remarksValue)
    }
  }

  const getContractMemberActivitywithdatewise = async (formDate, todate) => {
    const url = `common/timesheet/activity/final-approve-list/daterange/${formDate}/${todate}`

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
      })
      const products = response.data.data.productNames
      const member = response.data.data.memberNames
      setProductList(products)
      setMemberList(member)
      setPLoader(false)
      setMLoader(false)
    } catch (error) {}
  }
  const getUrl = () => {
    let url
    switch (filterRef.current) {
      case 'default':
        url = `common/timesheet/activity/final-approve-list?page=${pageRef.current}&size=10&category=${filterRef.current}`
        break
      case 'dateandproductandmember':
        url = `common/timesheet/activity/final-approve-list?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}&memberId=${memberIdRef.current}&startDate=${startDateRef.current}&endDate=${endDateRef.current}`
        break
      case 'product':
        url = `common/timesheet/activity/final-approve-list?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}`
        break
      case 'member':
        url = `common/timesheet/activity/final-approve-list?page=${pageRef.current}&size=10&category=${filterRef.current}&memberId=${memberIdRef.current}`
        break
      case 'date':
        url = `common/timesheet/activity/final-approve-list?page=${pageRef.current}&size=10&category=${filterRef.current}&startDate=${startDateRef.current}&endDate=${endDateRef.current}`
        break
      case 'dateandproduct':
        url = `common/timesheet/activity/final-approve-list?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}&startDate=${startDateRef.current}&endDate=${endDateRef.current}`
        break
      case 'dateandmember':
        url = `common/timesheet/activity/final-approve-list?page=${pageRef.current}&size=10&category=${filterRef.current}&memberId=${memberIdRef.current}&startDate=${startDateRef.current}&endDate=${endDateRef.current}`
        break
      case 'memberandproduct':
        url = `common/timesheet/activity/final-approve-list?page=${pageRef.current}&size=10&category=${filterRef.current}&memberId=${memberIdRef.current}&productId=${productIdRef.current}`
        break
      default:
        break
    }
    return url
  }

  const getContractActivityall = async () => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setMemberTable([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }

    try {
      const response = await api.get(getUrl(), {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data
      if (pageRef.current === 0) {
        setMemberTable(data)
      } else {
        setMemberTable((prevUserData) => {
          const uniqueSet = new Set(prevUserData.map((user) => user.id))
          const newData = data.filter((user) => !uniqueSet.has(user.id))
          return [...prevUserData, ...newData]
        })
      }
      if (data.length < 10) {
        hasMoreRef.current = false
      } else {
        hasMoreRef.current = true
      }
      pageRef.current = pageRef.current + 1
      setCommonLoader(false)
    } catch (error) {}
  }

  const statuschange = async (statusValue, id, remarks) => {
    const url = `common/timesheet/approval/common/final-approved`
    const formData = new FormData()
    formData.append('status', statusValue)
    formData.append('remarks', remarks)
    formData.append('id', id)

    try {
      const response = await api.put(url, formData, {
        headers: getHeaders('multi'),
      })
      if (response?.data) {
        const message = `Activity ${statusValue} Successfully`
        toast.success(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
        return response.data
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
      throw error
    }
  }

  const handleApproveActivity = async (status, id, remarks) => {
    return await statuschange(rejectStatus, id, remarks)
  }

  const handleApproved = async (status, singleApprovedId, remarks) => {
    return await statuschange(approvedStatus, singleApprovedId, remarks)
  }

  const resetFormValues = () => {
    setOpen(false)
    setOpenSelectAll(false)
    setOpenSelectRejectAll(false)
    setSelectedRows([])
    setIsModalOpen(false)
    setHeaderLabel('')
    setCommonLoader(true)
    pageRef.current = 0
    hasMoreRef.current = true
    filterRef.current = 'default'
    setMemberList(memberLists)
    setProductList(productLists)
    getContractActivityall()
  }

  //Product List
  const options = productList.map((product) => ({
    value: product.id,
    label: product.name,
  }))

  const handleProductList = async (value) => {
    const url = `common/timesheet/activity/final-approve-list/daterangeuser/${startDateRef.current}/${endDateRef.current}/${value}`

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
      })
      const member = response.data.data.userNames
      // Set the table data
      setMemberList(member)
      setMLoader(false)
    } catch (error) {}
  }

  const handleProduct = (product) => {
    pageRef.current = 0
    hasMoreRef.current = true
    setMLoader(true)
    setCommonLoader(true)
    setMemberList([])
    if (product !== undefined) {
      productIdRef.current = product
      if (startDateRef.current !== null && endDateRef.current !== null) {
        handleProductList(product)
        memberIdRef.current = 0
      } else setMemberList(memberLists)
      setMLoader(false)
      if (
        startDateRef.current === null &&
        endDateRef.current === null &&
        memberIdRef.current === 0
      ) {
        filterRef.current = 'product'
      } else if (
        startDateRef.current === null &&
        endDateRef.current === null &&
        memberIdRef.current !== 0
      ) {
        filterRef.current = 'memberandproduct'
      } else if (
        startDateRef.current !== null &&
        endDateRef.current !== null &&
        memberIdRef.current === 0
      ) {
        filterRef.current = 'dateandproduct'
      } else {
        filterRef.current = 'dateandproductandmember'
      }
    } else {
      productIdRef.current = 0

      if (
        startDateRef.current === null &&
        endDateRef.current === null &&
        memberIdRef.current === 0
      ) {
        filterRef.current = 'default'
      } else if (
        startDateRef.current === null &&
        endDateRef.current === null &&
        memberIdRef.current !== 0
      ) {
        filterRef.current = 'member'
      } else if (
        startDateRef.current !== null &&
        endDateRef.current !== null &&
        memberIdRef.current === 0
      ) {
        filterRef.current = 'date'
      } else {
        filterRef.current = 'dateandmember'
      }
      setMLoader(false)
      if (startDateRef.current !== null && endDateRef.current !== null) {
        setPLoader(true)
        setProductList([])
        getContractMemberActivitywithdatewise(startDateRef.current, endDateRef.current)
      } else {
        setMemberList(memberLists)
      }
    }
    selectRef.current.blur()
    getContractActivityall()
  }

  // Member List
  const memberOption = memberList.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options1">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {toPascalCase(user.name)}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))

  const handleMember = (member) => {
    pageRef.current = 0
    hasMoreRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (member !== undefined) {
      memberIdRef.current = member
      if (
        startDateRef.current === null &&
        endDateRef.current === null &&
        productIdRef.current === 0
      ) {
        filterRef.current = 'member'
      } else if (
        startDateRef.current === null &&
        endDateRef.current === null &&
        productIdRef.current !== 0
      ) {
        filterRef.current = 'memberandproduct'
      } else if (
        startDateRef.current !== null &&
        endDateRef.current !== null &&
        productIdRef.current === 0
      ) {
        filterRef.current = 'dateandmember'
      } else {
        filterRef.current = 'dateandproductandmember'
      }
    } else {
      memberIdRef.current = 0
      if (
        startDateRef.current === null &&
        endDateRef.current === null &&
        productIdRef.current === 0
      ) {
        filterRef.current = 'default'
      } else if (
        startDateRef.current === null &&
        endDateRef.current === null &&
        productIdRef.current !== 0
      ) {
        filterRef.current = 'product'
      } else if (
        startDateRef.current !== null &&
        endDateRef.current !== null &&
        productIdRef.current === 0
      ) {
        filterRef.current = 'date'
      } else {
        filterRef.current = 'dateandproduct'
      }
    }
    selectRef.current.blur()
    getContractActivityall()
  }
  const showModal = (id, status) => {
    setIsModalOpen(true)
    setSingleId(id)
    setRejectStatus(status)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleRejectCancelAll = () => {
    setOpenSelectRejectAll(false)
  }

  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }

  const columns = !headerLabel
    ? [
        {
          title: (() => {
            if (memberTable === null || memberTable.length === 0) {
              return (
                <Checkbox onChange={(e) => handleHeaderCheck(e.target.checked)} disabled={true} />
              )
            } else {
              return (
                <Checkbox
                  id="flexCheckDefault"
                  className="checkbox_design"
                  checked={selectedRows.length === memberTable.length && memberTable.length}
                  onChange={(e) => handleHeaderCheck(e.target.checked)}
                />
              )
            }
          })(),
          dataIndex: 'checkbox',
          key: 'checkbox',
          width: '4%',
          align: 'center',
          render: (_, record) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: { colSpan: 0 },
              }
            }
            return (
              <Checkbox
                className="checkbox_design"
                value={record.id}
                disabled={['Approved', 'Rejected'].includes(record.status) || record.approved}
                checked={selectedRows.includes(record.id)}
                onChange={(e) => handleMemberCheck(record.id, e.target.checked)}
              />
            )
          },
        },
        {
          title: 'SI.No',
          dataIndex: 'index',
          key: 'index',
          width: '5%',
          align: 'center',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return index + 1
          },
        },
        {
          title: 'Activity Date',
          dataIndex: 'activity_date',
          key: 'activity_date',
          width: '8%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return formatDate(text)
          },
        },
        {
          title: 'Team member',
          dataIndex: 'userName',
          key: 'userName',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {truncateString(text, 15)}</div>
          },
        },
        {
          title: 'Product',
          dataIndex: 'productName',
          key: 'productName',
          width: '15%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              setIsNorMore(true)
              return {
                children: (
                  <div style={{ textAlign: 'center' }}>
                    <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
                  </div>
                ),
                props: {
                  colSpan: 9, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return (
              <span className="" title={record.productName}>
                {record.assignedStatus === true && (
                  <span style={{ fontSize: '16px', color: '#00ab55' }}>&#8226;</span>
                )}
                {record.assignedStatus === false && (
                  <span style={{ fontSize: '16px', color: '#ffaa00' }}>&#8226;</span>
                )}
                <span style={{ marginLeft: '5px' }}>{truncateString(record.productName, 25)}</span>
              </span>
            )
          },
        },
        {
          title: 'Task',
          dataIndex: 'taskName',
          key: 'taskName',
          width: '15%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {truncateString(text, 25)}</div>
          },
        },
        {
          title: 'No.of.Hours',
          dataIndex: 'hours',
          key: 'hours',
          width: '7%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return formatTimeDuration(record.hours)
          },
        },
        {
          title: 'Remarks',
          dataIndex: 'description',
          key: 'description',
          width: '20%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {truncateString(text, 40)}</div>
          },
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          width: '5%',
          align: 'center',
          render: (_, record) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  className="btn border-0 text-c text-secondary check-button"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                  disabled={selectedRows.includes(record.id)}
                  onClick={() => showPopconfirm('Approved', record.id)}
                >
                  <CheckSvg width="11" height="9" viewBox="0 0 14 10" fill="#A5A1A1" />
                </button>
                {/* </Popconfirm> */}
                <button
                  className="btn border-0 text-c text-secondary cross-button"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                  onClick={() => showModal(record.id, 'Reject')}
                  disabled={selectedRows.includes(record.id)}
                >
                  <CrossSvg width="9" height="11" viewBox="0 0 14 10" fill="#A5A1A1" />
                </button>
              </div>
            )
          },
        },
      ]
    : [
        {
          title: (
            <Checkbox
              id="flexCheckDefault"
              className="checkbox_design"
              checked={selectedRows.length === memberTable.length && memberTable.length}
              onChange={(e) => handleHeaderCheck(e.target.checked)}
            />
          ),
          dataIndex: 'checkbox',
          key: 'checkbox',
          width: '4%',
          align: 'center',
          render: (_, record) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: { colSpan: 0 },
              }
            }
            return (
              <Checkbox
                className="checkbox_design"
                checked={selectedRows.includes(record.id)}
                onChange={(e) => handleMemberCheck(record.id, e.target.checked)}
              />
            )
          },
        },
        {
          title: (
            <span style={{ color: '#f50505', fontSize: '11px', fontWeight: '600' }}>
              {headerLabel}
            </span>
          ),
          dataIndex: 'index',
          key: 'index',
          width: '5%',
          align: 'center',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return index + 1
          },
        },
        {
          title: '',
          dataIndex: 'activity_date',
          key: 'activity_date',
          width: '8%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return formatDate(text)
          },
        },
        {
          title: '',
          dataIndex: 'userName',
          key: 'userName',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {truncateString(text, 15)}</div>
          },
        },
        {
          title: '',
          dataIndex: 'productName',
          key: 'productName',
          width: '15%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              setIsNorMore(true)
              return {
                children: (
                  <div style={{ textAlign: 'center' }}>
                    <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
                  </div>
                ),
                props: {
                  colSpan: 9, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return (
              <span className="" title={record.productName}>
                {record.assignedStatus === true && (
                  <span style={{ fontSize: '16px', color: '#00ab55' }}>&#8226;</span>
                )}
                {record.assignedStatus === false && (
                  <span style={{ fontSize: '16px', color: '#ffaa00' }}>&#8226;</span>
                )}
                <span style={{ marginLeft: '5px' }}>{truncateString(record.productName, 13)}</span>
              </span>
            )
          },
        },
        {
          title: '',
          dataIndex: 'taskName',
          key: 'taskName',
          width: '15%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {truncateString(text, 15)}</div>
          },
        },
        {
          title: '',
          dataIndex: 'hours',
          key: 'hours',
          width: '7%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return formatTimeDuration(record.hours)
          },
        },
        {
          title: '',
          dataIndex: 'description',
          key: 'description',
          width: '20%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {truncateString(text, 30)}</div>
          },
        },
        {
          title: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                className="btn border-0 text-c text-secondary check-button"
                style={{ fontSize: '12px', padding: '4px 8px' }}
                type="button"
                onClick={() => showPopconfirmAll('Approved')}
              >
                <CheckSvg width="11" height="9" viewBox="0 0 14 10" fill="#00ab55" />
              </button>
              {/* </Popconfirm> */}
              <button
                className="btn border-0 text-c text-secondary cross-button"
                style={{ fontSize: '12px', padding: '4px 8px' }}
                onClick={() => {
                  showPopconfirmAll('Reject')
                }}
              >
                <CrossSvg width="9" height="11" viewBox="0 0 14 10" fill="#e40e2d" />
              </button>
            </div>
          ),
          dataIndex: 'action',
          key: 'action',
          width: '5%',
          align: 'center',
          render: (_, record) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  className="btn border-0 text-c text-secondary check-button"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                  disabled={selectedRows.includes(record.id)}
                  onClick={() => showPopconfirm('Approved', record.id)}
                >
                  <CheckSvg width="11" height="9" viewBox="0 0 14 10" fill="#A5A1A1" />
                </button>
                {/* </Popconfirm> */}
                <button
                  className="btn border-0 text-c text-secondary cross-button"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                  onClick={() => showModal(record.id, 'Reject')}
                  disabled={selectedRows.includes(record.id)}
                >
                  <CrossSvg width="9" height="11" viewBox="0 0 14 10" fill="#A5A1A1" />
                </button>
              </div>
            )
          },
        },
      ]

  const displayData = [
    ...memberTable.map((row, index) => ({
      key: row.id,
      id: row.id,
      index: index + 1,
      activity_date: row.activity_date,
      productName: row.productName,
      taskName: row.taskName,
      hours: row.hours,
      description: row.description,
      userName: row.userName,
      assignedStatus: row.assignedStatus,
    })),
  ]

  // Append the "No more Data to load" message as the last row if noMoreData is true
  if (!hasMoreRef.current && displayData.length !== 0 && displayData.length > 10) {
    displayData.push({
      key: 'noMoreData',
      index: '',
      productName: 'No more Data to load',
      taskName: '',
      hours: '',
      description: '',
      userName: '',
      action: '',
      assignedStatus: '',
    })
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      getContractActivityall()
    }
  }

  const rowClassName = (record) => {
    return selectedRows.includes(record.id) ? 'checked-table-row' : ''
  }

  const handleScroll = useCallback(
    debounce(() => {
      if (!tableBodyRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (hasMoreRef.current && !commonLoader) {
          setCommonLoader(true)
          fetchMoreData()
        }
      }
    }, 100),
    [hasMoreRef.current, commonLoader],
  )

  useEffect(() => {
    const tableBody = document.querySelector('.design_table .ant-table-body')
    if (tableBody) {
      tableBodyRef.current = tableBody
      tableBody.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (tableBody) {
        tableBody.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <>
      <CRow className="mt-3">
        <CCol xs={12} sm={7} md={5}>
          <b style={{ paddingLeft: '30px' }}>Pending Activity</b>
          <br />
          <Breadcrumb
            style={{ paddingLeft: '30px' }}
            className="bread-tab"
            separator={<span className="breadcrumb-separator">|</span>}
            items={[
              {
                title: (
                  <Link
                    rel="Dashboard"
                    to={'/dashboard'}
                    className="bread-items text-decoration-none text-secondary "
                  >
                    Dashboard
                  </Link>
                ),
              },
              {
                title: (
                  <span className="text-secondary " style={{ cursor: 'default' }}>
                    Pending Activity
                  </span>
                ),
              },
            ]}
          />
        </CCol>
        {/* <CCol sm={1} style={{ marginLeft: '30px' }}></CCol> */}

        <CCol sm={5} md={3}>
          <RangePicker
            variant={'borderless'}
            ref={rangePickerRef}
            style={{ width: '90%' }}
            onChange={handleStartDateChange}
            className="rangeField rangepicker_cont_pend"
            format="DD MMM, YYYY"
            // format="YYYY/MM/DD"
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </CCol>
        <CCol sm={5} md={2}>
          <Select
            className="members_activity_select custom-select_cont_pend "
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            id="products"
            value={options.find((option) => option.value === productIdRef.current) || undefined}
            onChange={(value) => handleProduct(value)}
            showSearch
            allowClear
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            dropdownRender={(menu) => (
              <div style={{ maxHeight: '120px', overflow: 'auto' }} role="listbox">
                {menu}
              </div>
            )}
            options={
              prodLoader || pLoader
                ? [
                    {
                      label: (
                        <div style={{ textAlign: 'center' }}>
                          {Array.from({ length: 5 }, (_, index) => (
                            <Skeleton
                              key={index}
                              title={false}
                              paragraph={{
                                rows: 1,
                                width: '100%',
                                height: '10px',
                                style: { height: '10px !important' },
                              }}
                            />
                          ))}
                        </div>
                      ),
                      value: 'loading',
                      disabled: true,
                    },
                  ]
                : options
            }
            ref={selectRef}
            placeholder="Choose Product"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </CCol>
        {/* <CCol sm={2}>
          <Select
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            className="members_activity_select custom-select con-mem-act-pro"
            allowClear
            placeholder="Choose Status"
            options={[
              {
                value: 'Pending',
                label: 'Pending',
              },
              {
                value: 'Completed',
                label: 'Completed',
              },
            ]}
            onChange={(value) => setStatusValue(value)}
          />
        </CCol> */}
        <CCol sm={5} md={2}>
          <Select
            className="members_activity_select custom-select_cont_pend"
            id="member-list"
            value={memberOption.find((option) => option.value === memberIdRef.current) || undefined}
            onChange={(value) => handleMember(value)}
            options={
              memberLoader || mLoader
                ? [
                    {
                      label: (
                        <div style={{ textAlign: 'center' }}>
                          {Array.from({ length: 5 }, (_, index) => (
                            <Skeleton
                              key={index}
                              title={false}
                              avatar={{
                                size: '20',
                              }} // Adjust the width and height here
                              paragraph={{
                                rows: 2,
                                height: '10px',
                                style: { height: '10px !important' },
                              }}
                            />
                          ))}
                        </div>
                      ),
                      value: 'loading',
                      disabled: true,
                    },
                  ]
                : memberOption
            }
            showSearch
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            placeholder="Choose Member"
            allowClear
            ref={selectRef}
            filterOption={(input, option) => {
              const userNameArray = option.label.props.children[1].props.children[0].props.children
              const userName = userNameArray
              const lowerCaseInput = input.toLowerCase()
              const lowerCaseUserName = userName.toLowerCase()
              return lowerCaseUserName.includes(lowerCaseInput)
            }}
            popupMatchSelectWidth={false}
            popupClassName="custom-dropdown"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </CCol>
      </CRow>
      <div className="mt-2 design_table">
        <style>
          {`
        .design_table .ant-table-body::-webkit-scrollbar {
          display: none !important;
        }
        .design_table .ant-table-wrapper .ant-table-thead > tr > th {
          background-color: ${headerLabel ? '#ffa5b240 !important' : ''};
        }
      `}
        </style>
        <Table
          columns={columns}
          size={'middle'}
          dataSource={displayData}
          className={`${isNorMore ? 'last-row-table' : ''} db_table_content custom-table`}
          rowKey="id"
          pagination={false}
          scroll={{ y: 490 }}
          loading={{
            spinning: commonLoader,
            indicator: <CSpinner color="danger" />,
          }}
          rowClassName={rowClassName}
        />
      </div>
      {isModalOpen && (
        <RejectConfirmModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          handleApprove={handleApproveActivity}
          id={singleId}
          headContent="Activity"
          resetFunc={resetFormValues}
        />
      )}
      {open && (
        <ApprovedConfirmModal
          isModalOpen={open}
          handleCancel={handleApproveCancel}
          handleApprove={handleApproved}
          id={singleApprovedId}
          headContent="Activity"
          resetFunc={resetFormValues}
        />
      )}
      {openSelectAll && (
        <ApprovedConfirmModal
          isModalOpen={openSelectAll}
          handleCancel={handleApproveCancelAll}
          handleApprove={handleButtonClick}
          headContent="Activity"
          resetFunc={resetFormValues}
        />
      )}
      {openSelectRejectAll && (
        <RejectConfirmModal
          isModalOpen={openSelectRejectAll}
          handleCancel={handleRejectCancelAll}
          handleApprove={handleButtonClick}
          headContent="Activity"
          resetFunc={resetFormValues}
        />
      )}
    </>
  )
}

PendingActivity.propTypes = {
  today: PropTypes.string,
  formatDate: PropTypes.func,
  productLists: PropTypes.array,
  memberLists: PropTypes.array,
  prodLoader: PropTypes.bool,
  memberLoader: PropTypes.bool,
}
export default PendingActivity
