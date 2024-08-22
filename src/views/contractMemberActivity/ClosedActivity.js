import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Select, DatePicker, Breadcrumb, Skeleton, Table } from 'antd'
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
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import { formatDate, formatTimeDuration } from '../../constant/TimeUtils'
import useAxios from 'src/constant/UseAxios'
import Downarrowimg from '../../assets/images/downarrow.png'
import { toPascalCase } from 'src/constant/TimeUtils'
import InfiniteScroll from 'react-infinite-scroll-component'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'

const ClosedActivity = ({ productLists, memberLists, memberLoader, prodLoader }) => {
  let api = useAxios()
  const [memberTable, setMemberTable] = useState([])
  const [productList, setProductList] = useState([])
  const [memberList, setMemberList] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  const selectRef = useRef(null)
  const dateRef = useRef(null)
  const statusRef = useRef('')
  const pageRef = useRef(0)
  const productIdRef = useRef(0)
  const memberIdRef = useRef(0)
  const filterRef = useRef('default')
  const hasMoreRef = useRef(true)
  const [abortController, setAbortController] = useState(new AbortController())
  const tableBodyRef = useRef(null)
  const [isNorMore, setIsNorMore] = useState(false)

  useEffect(() => {
    setMemberList(memberLists)
    setProductList(productLists)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productLists])

  useEffect(() => {
    hasMoreRef.current = true
    getMemberActivityall()
    const tableContainer = document.querySelector('.table-container')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getUrl = () => {
    let url
    switch (filterRef.current) {
      case 'default':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}`
        break
      case 'dateandproductandmember':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}&memberId=${memberIdRef.current}&date=${dateRef.current}`
        break
      case 'product':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}`
        break
      case 'member':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&memberId=${memberIdRef.current}`
        break
      case 'date':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&date=${dateRef.current}`
        break
      case 'dateandproduct':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}&date=${dateRef.current}`
        break
      case 'dateandmember':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&memberId=${memberIdRef.current}&date=${dateRef.current}`
        break
      case 'memberandproduct':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&memberId=${memberIdRef.current}&productId=${productIdRef.current}`
        break
      case 'status':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&status=${statusRef.current}`
        break
      case 'dateandstatus':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&status=${statusRef.current}&date=${dateRef.current}`
        break
      case 'productandstatus':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&status=${statusRef.current}&productId=${productIdRef.current}`
        break
      case 'memberandstatus':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&status=${statusRef.current}&memberId=${memberIdRef.current}`
        break
      case 'all':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&status=${statusRef.current}&memberId=${memberIdRef.current}&productId=${productIdRef.current}&date=${dateRef.current}`
        break
      case 'productandmemberandstatus':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&status=${statusRef.current}&memberId=${memberIdRef.current}&productId=${productIdRef.current}`
        break
      case 'dateandmemberandstatus':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&status=${statusRef.current}&memberId=${memberIdRef.current}&date=${dateRef.current}`
        break
      case 'dateandproductandstatus':
        url = `common/timesheet/activity/final-approve-list/approved?page=${pageRef.current}&size=10&category=${filterRef.current}&status=${statusRef.current}&productId=${productIdRef.current}&date=${dateRef.current}`
        break
      default:
        break
    }
    return url
  }
  const getMemberActivityall = async () => {
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

  //Product List
  const options = productList.map((product) => ({
    value: product.id,
    label: product.name,
  }))
  const handleProduct = (product) => {
    selectRef.current.blur()
    pageRef.current = 0
    hasMoreRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (product !== undefined) {
      productIdRef.current = product
      if (dateRef.current === null && memberIdRef.current === 0 && statusRef.current === '') {
        filterRef.current = 'product'
      } else if (
        dateRef.current === null &&
        memberIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'memberandproduct'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current === 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'dateandproduct'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'dateandproductandmember'
      } else if (
        dateRef.current === null &&
        memberIdRef.current === 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'productandstatus'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current === 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'dateandproductandstatus'
      } else if (
        dateRef.current === null &&
        memberIdRef.current !== 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'productandmemberandstatus'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current !== 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'all'
      }
    } else {
      productIdRef.current = 0

      if (dateRef.current === null && memberIdRef.current === 0 && statusRef.current === '') {
        filterRef.current = 'default'
      } else if (
        dateRef.current === null &&
        memberIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'member'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current === 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'date'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'dateandmember'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current !== 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'dateandmemberandstatus'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current === 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'dateandstatus'
      } else if (
        dateRef.current === null &&
        memberIdRef.current === 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'status'
      } else if (
        dateRef.current === null &&
        memberIdRef.current !== 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'memberandstatus'
      }
    }
    getMemberActivityall()
  }
  const handleMember = (member) => {
    pageRef.current = 0
    hasMoreRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (member !== undefined) {
      memberIdRef.current = member
      if (dateRef.current === null && productIdRef.current === 0 && statusRef.current === '') {
        filterRef.current = 'member'
      } else if (
        dateRef.current === null &&
        productIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'memberandproduct'
      } else if (
        dateRef.current !== null &&
        productIdRef.current === 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'dateandmember'
      } else if (
        dateRef.current !== null &&
        productIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'dateandproductandmember'
      } else if (
        dateRef.current !== null &&
        productIdRef.current === 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'dateandmemberandstatus'
      } else if (
        dateRef.current === null &&
        productIdRef.current === 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'memberandstatus'
      } else if (
        dateRef.current !== null &&
        productIdRef.current !== 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'all'
      } else if (
        dateRef.current === null &&
        productIdRef.current !== 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'productandmemberandstatus'
      }
    } else {
      memberIdRef.current = 0
      if (dateRef.current === null && productIdRef.current === 0 && statusRef.current === '') {
        filterRef.current = 'default'
      } else if (
        dateRef.current === null &&
        productIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'product'
      } else if (
        dateRef.current !== null &&
        productIdRef.current === 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'date'
      } else if (
        dateRef.current === null &&
        productIdRef.current === 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'status'
      } else if (
        dateRef.current !== null &&
        productIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'dateandproduct'
      } else if (
        dateRef.current !== null &&
        productIdRef.current === 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'dateandstatus'
      } else if (
        dateRef.current === null &&
        productIdRef.current !== 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'productandstatus'
      } else if (
        dateRef.current !== null &&
        productIdRef.current !== 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'dateandproductandstatus'
      }
    }
    selectRef.current.blur()
    getMemberActivityall()
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

  const handleDateChange = (date, dateString) => {
    pageRef.current = 0
    hasMoreRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (date !== null) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD')
      dateRef.current = formattedDate
      if (productIdRef.current !== 0 && memberIdRef.current === 0 && statusRef.current === '') {
        filterRef.current = 'dateandproduct'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'dateandmember'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current === 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'date'
      } else if (
        productIdRef.current !== 0 &&
        statusRef.current !== '' &&
        memberIdRef.current !== 0
      ) {
        filterRef.current = 'all'
      } else if (
        statusRef.current !== '' &&
        memberIdRef.current !== 0 &&
        productIdRef.current === 0
      ) {
        filterRef.current = 'dateandmemberandstatus'
      } else if (
        statusRef.current !== '' &&
        memberIdRef.current === 0 &&
        productIdRef.current !== 0
      ) {
        filterRef.current = 'dateandproductandstatus'
      } else if (
        statusRef.current !== '' &&
        memberIdRef.current === 0 &&
        productIdRef.current === 0
      ) {
        filterRef.current = 'dateandstatus'
      } else if (
        statusRef.current === '' &&
        memberIdRef.current !== 0 &&
        productIdRef.current !== 0
      ) {
        filterRef.current = 'dateandproductandmember'
      }
    } else {
      dateRef.current = null
      if (productIdRef.current !== 0 && memberIdRef.current === 0 && statusRef.current === '') {
        filterRef.current = 'product'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'member'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current === 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'default'
      } else if (
        productIdRef.current !== 0 &&
        memberIdRef.current !== 0 &&
        statusRef.current === ''
      ) {
        filterRef.current = 'memberandproduct'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current !== 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'memberandstatus'
      } else if (
        productIdRef.current !== 0 &&
        memberIdRef.current === 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'productandstatus'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current === 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'status'
      } else if (
        productIdRef.current !== 0 &&
        memberIdRef.current !== 0 &&
        statusRef.current !== ''
      ) {
        filterRef.current = 'productandmemberandstatus'
      }
    }
    getMemberActivityall()
  }

  const handleStatus = (status) => {
    pageRef.current = 0
    hasMoreRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (status !== undefined) {
      statusRef.current = status
      if (productIdRef.current !== 0 && memberIdRef.current === 0 && dateRef.current === null) {
        filterRef.current = 'productandstatus'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current !== 0 &&
        dateRef.current === null
      ) {
        filterRef.current = 'memberandstatus'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current === 0 &&
        dateRef.current === null
      ) {
        filterRef.current = 'status'
      } else if (
        productIdRef.current !== 0 &&
        dateRef.current !== null &&
        memberIdRef.current !== 0
      ) {
        filterRef.current = 'all'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current !== 0 &&
        productIdRef.current === 0
      ) {
        filterRef.current = 'dateandmemberandstatus'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current === 0 &&
        productIdRef.current !== 0
      ) {
        filterRef.current = 'dateandproductandstatus'
      } else if (
        dateRef.current !== null &&
        memberIdRef.current === 0 &&
        productIdRef.current === 0
      ) {
        filterRef.current = 'dateandstatus'
      } else if (
        dateRef.current === null &&
        memberIdRef.current !== 0 &&
        productIdRef.current !== 0
      ) {
        filterRef.current = 'productandmemberandstatus'
      }
    } else {
      statusRef.current = ''
      if (productIdRef.current !== 0 && memberIdRef.current === 0 && dateRef.current === null) {
        filterRef.current = 'product'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current !== 0 &&
        dateRef.current === null
      ) {
        filterRef.current = 'member'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current === 0 &&
        dateRef.current === null
      ) {
        filterRef.current = 'default'
      } else if (
        productIdRef.current !== 0 &&
        memberIdRef.current !== 0 &&
        dateRef.current === null
      ) {
        filterRef.current = 'memberandproduct'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current !== 0 &&
        dateRef.current !== null
      ) {
        filterRef.current = 'dateandmember'
      } else if (
        productIdRef.current !== 0 &&
        memberIdRef.current === 0 &&
        dateRef.current !== null
      ) {
        filterRef.current = 'dateandproduct'
      } else if (
        productIdRef.current === 0 &&
        memberIdRef.current === 0 &&
        dateRef.current !== null
      ) {
        filterRef.current = 'date'
      } else if (
        productIdRef.current !== 0 &&
        memberIdRef.current !== 0 &&
        dateRef.current !== null
      ) {
        filterRef.current = 'dateandproductandmember'
      }
    }
    getMemberActivityall()
  }
  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }

  const columns = [
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
      width: '10%',
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
            <span style={{ marginLeft: '5px' }}>{truncateString(record.productName, 15)}</span>
          </span>
        )
      },
    },
    {
      title: 'Task',
      dataIndex: 'taskName',
      key: 'taskName',
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
      title: 'No.of.Hours',
      dataIndex: 'hours',
      key: 'hours',
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
        return <div title={text}> {truncateString(text, 35)}</div>
      },
    },
    {
      title: 'Approver Status',
      dataIndex: 'finalApproveStatus',
      key: 'finalApproveStatus',
      width: '10%',
      render: (text, row) => {
        if (row.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        let className = ''
        if (text === 'Approved') {
          className = 'font-green'
        } else if (text === 'Reject' || text === 'Rejected') {
          className = 'font-red'
        } else if (text === 'Pending') {
          className = 'font-warning'
        } else if (text === 'Resubmit') {
          className = 'font-info'
        }
        return (
          <div className={` ${className}`}>
            <span style={{ fontSize: '16px' }}>&#8226;</span>{' '}
            {text === 'Reject' ? 'Rejected' : text}
          </div>
        )
      },
    },
    {
      title: 'Approval Remarks',
      dataIndex: 'finalApproverRemarks',
      key: 'finalApproverRemarks',
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
        return <div title={text}> {text ? truncateString(text, 15) : '---'}</div>
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
      finalApproveStatus: row.finalApproveStatus,
      finalApproverRemarks: row.finalApproverRemarks,
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
      assignedStatus: '',
      finalApproverRemarks: '',
      finalApproveStatus: '',
    })
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      getMemberActivityall()
    }
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
        <CCol xs={12} sm={12} md={4}>
          <b style={{ paddingLeft: '30px' }}>Closed Activity</b>
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
                    Closed Activity
                  </span>
                ),
              },
            ]}
          />
        </CCol>
        <CCol sm={5} md={2}>
          <DatePicker
            style={{ width: '90%' }}
            variant={'borderless'}
            className=" datefield_closed_cont con-cls-status"
            onChange={handleDateChange}
            placeholder="Choose Date "
            allowClear
            format="DD MMM,YYYY"
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </CCol>
        <CCol sm={5} md={2}>
          <Select
            className="contract_members_activity_select custom-select_closeact con-cls-status"
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            variant={'borderless'}
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
            ref={selectRef}
            options={
              prodLoader
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
            placeholder="Choose Product"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </CCol>
        <CCol sm={5} md={2}>
          <Select
            className="contract_members_activity_select custom-select_closeact con-cls-status"
            variant={'borderless'}
            id="member-list"
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            value={memberOption.find((option) => option.value === memberIdRef.current) || undefined}
            onChange={(value) => handleMember(value)}
            options={
              memberLoader
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
            placeholder="Choose Member"
            allowClear
            ref={selectRef}
            popupMatchSelectWidth={false}
            filterOption={(input, option) => {
              const userNameArray = option.label.props.children[1].props.children[0].props.children
              const userName = userNameArray
              const lowerCaseInput = input.toLowerCase()
              const lowerCaseUserName = userName.toLowerCase()
              return lowerCaseUserName.includes(lowerCaseInput)
            }}
            popupClassName="custom-dropdown"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </CCol>
        <CCol sm={5} md={2}>
          <Select
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            className="contract_members_activity_select custom-select_closeact con-cls-status"
            allowClear
            placeholder="Choose Status"
            options={[
              {
                value: 'Approved',
                label: 'Approved',
              },
              {
                value: 'Reject',
                label: 'Rejected',
              },
            ]}
            onChange={(value) => handleStatus(value)}
          />
        </CCol>
      </CRow>
      <div className="mt-2 design_table">
        <style>
          {`
        .design_table .ant-table-body::-webkit-scrollbar {
          display: none !important;
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
        />
      </div>
    </>
  )
}

ClosedActivity.propTypes = {
  productLists: PropTypes.array,
  memberLists: PropTypes.array,
  prodLoader: PropTypes.bool,
  memberLoader: PropTypes.bool,
}
export default ClosedActivity
