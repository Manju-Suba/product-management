import React, { useState, useEffect, useRef } from 'react'
import { formatTimeDuration, toPascalCase } from '../../constant/TimeUtils'
import CrossSvg from '../svgImages/CrossSvg'
import CheckSvg from '../svgImages/CheckSvg'
import RejectConfirmModal from '../modal/RejectConfirmModal'
import {
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
} from '@coreui/react'
import dayjs from 'dayjs'
import { getHeaders, ImageUrl } from 'src/constant/Global'
import profileImage1 from '../../assets/images/avatars/wrapper.png'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import { DatePicker, Breadcrumb, Checkbox, Select, Skeleton } from 'antd'
import useAxios from 'src/constant/UseAxios'
import Downarrowimg from '../../assets/images/downarrow.png'
import ApprovedConfirmModal from '../modal/ApprovedConfirmModel'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Link } from 'react-router-dom'
const { RangePicker } = DatePicker

const PendingActivity = ({ formatDate, productLists, prodLoader }) => {
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
  const [approvedStatusAll, setApprovedStatusAll] = useState('')
  const [openSelectRejectAll, setOpenSelectRejectAll] = useState(false)
  const [singleApprovedId, setSingleApprovedId] = useState('')
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
      getProductMemberActivitywithdatewise(formattedFromDate, formattedToDate)
      if (productIdRef.current !== 0 && memberIdRef.current === 0) {
        filterRef.current = 'dateandproduct'
      } else if (productIdRef.current === 0 && memberIdRef.current !== 0) {
        filterRef.current = 'dateandmember'
      } else if (productIdRef.current === 0 && memberIdRef.current === 0) {
        filterRef.current = 'date'
      } else {
        filterRef.current = 'all'
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
      setPLoader(false)
      setMLoader(false)
      setMemberList([])
    }
    getProductActivityall()
  }

  useEffect(() => {
    setProductList(productLists)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productLists])

  useEffect(() => {
    hasMoreRef.current = true
    getProductActivityall()
    const tableContainer = document.querySelector('.table-container')
    tableContainer.addEventListener('scroll', handleScroll)
    return () => {
      tableContainer.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleScroll = () => {
    const tableContainer = document.querySelector('.table-container')
    if (tableContainer.scrollTop + tableContainer.clientHeight === tableContainer.scrollHeight) {
      if (hasMoreRef.current === true) {
        getProductActivityall()
      }
    }
  }

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

  const getProductMemberActivitywithdatewise = async (formDate, todate) => {
    const formattedFromDate = dayjs(formDate).format('YYYY-MM-DD')
    const formattedToDate = dayjs(todate).format('YYYY-MM-DD')
    setCommonLoader(true)
    const url = `common/timesheet/activity/ownerlist/daterange/all?fromdate=${formattedFromDate}&todate=${formattedToDate}`
    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
      })
      const members = response.data.data.memberNames
      const products = response.data.data.productNames
      setCommonLoader(false)
      setProductList(products)
      setPLoader(false)
      setMLoader(false)
      setMemberList(members)
    } catch (error) {}
  }

  const getUrl = () => {
    let url
    switch (filterRef.current) {
      case 'default':
        url = `common/timesheet/activity/owner/list?page=${pageRef.current}&size=10&category=${filterRef.current}`
        break
      case 'all':
        url = `common/timesheet/activity/owner/list?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}&memberId=${memberIdRef.current}&startDate=${startDateRef.current}&endDate=${endDateRef.current}`
        break
      case 'product':
        url = `common/timesheet/activity/owner/list?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}`
        break
      case 'member':
        url = `common/timesheet/activity/owner/list?page=${pageRef.current}&size=10&category=${filterRef.current}&memberId=${memberIdRef.current}`
        break
      case 'date':
        url = `common/timesheet/activity/owner/list?page=${pageRef.current}&size=10&category=${filterRef.current}&startDate=${startDateRef.current}&endDate=${endDateRef.current}`
        break
      case 'dateandproduct':
        url = `common/timesheet/activity/owner/list?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}&startDate=${startDateRef.current}&endDate=${endDateRef.current}`
        break
      case 'dateandmember':
        url = `common/timesheet/activity/owner/list?page=${pageRef.current}&size=10&category=${filterRef.current}&memberId=${memberIdRef.current}&startDate=${startDateRef.current}&endDate=${endDateRef.current}`
        break
      case 'memberandproduct':
        url = `common/timesheet/activity/owner/list?page=${pageRef.current}&size=10&category=${filterRef.current}&memberId=${memberIdRef.current}&productId=${productIdRef.current}`
        break
      default:
        break
    }
    return url
  }

  const getProductActivityall = async () => {
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

  let loaderContent
  if (memberTable === null && !commonLoader) {
    loaderContent = <div className="text-c text-center my-3 td-text">No Data Found</div>
  } else if (memberTable.length === 0 && !commonLoader) {
    loaderContent = <div className="text-c text-center my-3 td-text">No Data Found</div>
  } else if (commonLoader) {
    loaderContent = (
      <div className="text-c text-center my-3 td-text">
        <CSpinner color="danger" />
      </div>
    )
  } else {
    loaderContent = <div></div>
  }

  const statuschange = async (statusValue, id, remarks) => {
    const url = `common/timesheet/approval/owner/update`
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
    setSelectedRows([])
    setOpen(false)
    setOpenSelectAll(false)
    setOpenSelectRejectAll(false)
    setIsModalOpen(false)
    setHeaderLabel('')
    setCommonLoader(true)
    pageRef.current = 0
    hasMoreRef.current = true
    filterRef.current = 'default'
    setMemberList([])
    setProductList(productLists)
    getProductActivityall()
  }

  //Product List
  const options = productList.map((product) => ({
    value: product.id,
    label: product.name,
  }))

  const handleProductList = async (value) => {
    if (value !== 0) {
      const url = `common/timesheet/activity/ownerlist/daterange/all?fromdate=${startDateRef.current}&todate=${endDateRef.current}&productid=${value}`
      try {
        const response = await api.get(url, {
          headers: getHeaders('json'),
        })
        const member = response.data.data.memberNames
        setMemberList(member)
        setMLoader(false)
      } catch (error) {}
    }
  }

  const handleProduct = (product) => {
    pageRef.current = 0
    hasMoreRef.current = true
    setMLoader(true)
    setCommonLoader(true)
    setMemberList([])
    if (product !== undefined) {
      productIdRef.current = product
      if (startDateRef.current !== null && endDateRef.current !== null) handleProductList(product)
      else setMemberList([])
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
        filterRef.current = 'all'
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
        getProductMemberActivitywithdatewise(startDateRef.current, endDateRef.current)
      }
      setMemberList([])
    }
    selectRef.current.blur()
    getProductActivityall()
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
        filterRef.current = 'all'
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
    getProductActivityall()
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

  return (
    <>
      <CRow className="mt-3">
        <CCol sm={5}>
          <b style={{ marginLeft: '30px' }}>Pending Member&rsquo;s Activity</b>
          <br />
          <Breadcrumb
            style={{ marginLeft: '30px' }}
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
                  <span className="text-secondary breadcrumb_lable " style={{ cursor: 'default' }}>
                    Pending Member&rsquo;s Activity
                  </span>
                ),
              },
            ]}
          />
        </CCol>
        {/* <CCol sm={1} style={{ marginLeft: '50px' }}></CCol> */}
        <CCol sm={3}>
          <RangePicker
            variant={'borderless'}
            ref={rangePickerRef}
            style={{ width: '90%', marginRight: '5px' }}
            onChange={handleStartDateChange}
            disabledDate={(current) => current && current > dayjs().endOf('day')}
            className="rangeField rangepicker_cont_pend"
            format="DD MMM,YYYY"
            // format="YYYY/MM/DD"
          />
        </CCol>
        <CCol sm={2}>
          <Select
            className="members_activity_select  custom-select_pend mem-act-select"
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

        <CCol sm={2}>
          <Select
            className="members_activity_select custom-select_pend mem-act-select"
            id="member-list"
            value={memberOption.find((option) => option.value === memberIdRef.current) || undefined}
            onChange={(value) => handleMember(value)}
            options={
              mLoader
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
            ref={selectRef}
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            placeholder="Choose Member"
            allowClear
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
      <div className="table-container table_scroll mt-2" style={{ border: 'none' }}>
        <InfiniteScroll
          dataLength={memberTable.length}
          next={handleScroll}
          hasMore={hasMoreRef.current}
          loader={
            <div className="text-c text-center my-3 td-text">
              <CSpinner color="danger" />
            </div>
          }
          endMessage={
            memberTable.length !== 0 && (
              <p style={{ textAlign: 'center' }}>
                <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
              </p>
            )
          }
        >
          <CTable>
            <CTableHead className="head-row">
              {!headerLabel ? (
                <CTableRow>
                  {memberTable === null || memberTable.length === 0 ? (
                    <CTableHeaderCell
                      className="table-head-draft  text-c text-center grid-cell-header check_box_position"
                      scope="col"
                      width="4%"
                    >
                      <Checkbox
                        id="flexCheckDefault"
                        onChange={(e) => handleHeaderCheck(e.target.checked)}
                        disabled={true}
                      />
                    </CTableHeaderCell>
                  ) : (
                    <CTableHeaderCell
                      className="table-head-draft text-center text-c grid-cell-header"
                      scope="col"
                      width="4%"
                      style={{ position: 'sticky', top: '0', zIndex: '12' }}
                    >
                      <Checkbox
                        id="flexCheckDefault"
                        className="checkbox_design"
                        checked={selectedRows.length === memberTable.length && memberTable.length}
                        onChange={(e) => handleHeaderCheck(e.target.checked)}
                      />
                    </CTableHeaderCell>
                  )}

                  <CTableHeaderCell
                    className="table-head-draft  text-c grid-cell-header text-center"
                    scope="col"
                    width="4%"
                  >
                    SI.No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="table-head-draft  text-c grid-cell-header"
                    scope="col"
                    width="10%"
                  >
                    Activity Date
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="table-head-draft  text-c grid-cell-header"
                    scope="col"
                    width="12%"
                  >
                    Team member
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="table-head-draft  text-c grid-cell-header"
                    scope="col"
                    width="15%"
                  >
                    Product
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="table-head-draft  text-c grid-cell-header"
                    scope="col"
                    width="10%"
                  >
                    Task
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="table-head-draft  text-c grid-cell-header"
                    scope="col"
                    width="5%"
                  >
                    No.of.Hours
                  </CTableHeaderCell>
                  {/* <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="10%"
                >
                  Status
                </CTableHeaderCell> */}
                  <CTableHeaderCell
                    className="table-head-draft  text-c grid-cell-header"
                    scope="col"
                    width="15%"
                  >
                    Remarks
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="table-head-draft  text-c grid-cell-header text-center"
                    scope="col"
                    width="7%"
                  >
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              ) : (
                <CTableRow>
                  <CTableHeaderCell className="table-head-selected text-center  text-c " width="4%">
                    <Checkbox
                      id="flexCheckDefault"
                      className="checkbox_design"
                      checked={selectedRows.length === memberTable.length && memberTable.length}
                      onChange={(e) => handleHeaderCheck(e.target.checked)}
                    />
                  </CTableHeaderCell>
                  <CTableHeaderCell className="table-head-selected  text-c " colSpan="7">
                    <span style={{ color: '#f50505' }}>{headerLabel}</span>
                  </CTableHeaderCell>
                  <CTableHeaderCell className="table-head-selected " style={{ textAlign: 'right' }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {/* <Popconfirm
                      title="Approve confirm Modal"
                      description="Are you sure to approve this activity ?"
                      open={openSelectAll}
                      onConfirm={() => handleButtonClick('Approved')}
                      okButtonProps={{
                        style: { background: '#f54550', borderColor: '#f54550', color: 'white' },
                        loading: confirmLoading,
                      }}
                      placement="left"
                      okText="Yes"
                      cancelText="No"
                      onCancel={handleApproveCancelAll}
                    > */}
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
                        onClick={() => showPopconfirmAll('Reject')}
                      >
                        <CrossSvg width="9" height="11" viewBox="0 0 14 10" fill="#e40e2d" />
                      </button>
                    </div>
                  </CTableHeaderCell>
                </CTableRow>
              )}
            </CTableHead>
            <CTableBody>
              {memberTable?.map((row, index) => (
                <CTableRow key={row.id}>
                  <CTableDataCell
                    className={`text-c text-center pd-text1 grid-cell ${
                      selectedRows.includes(row.id) ? 'checked-table-row' : ''
                    }`}
                    width="4%"
                  >
                    <Checkbox
                      className="checkbox_design"
                      id={`flexCheckDefault-${index}`}
                      value={row.id}
                      disabled={
                        row.status === 'Approved' ||
                        row.status === 'Rejected' ||
                        row.approved === true
                      }
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => {
                        handleMemberCheck(row.id, e.target.checked)
                      }}
                    />
                  </CTableDataCell>
                  <CTableDataCell
                    className={`text-c text-center pd-text1 grid-cell ${
                      selectedRows.includes(row.id) ? 'checked-table-row' : ''
                    }`}
                    width="4%"
                  >
                    {index + 1}
                  </CTableDataCell>
                  <CTableDataCell
                    className={`text-c pd-text1 grid-cell ${
                      selectedRows.includes(row.id) ? 'checked-table-row' : ''
                    }`}
                    title={row.activity_date}
                    width="10%"
                  >
                    {formatDate(row.activity_date)}
                  </CTableDataCell>
                  <CTableDataCell
                    className={`text-c pd-text1 grid-cell ${
                      selectedRows.includes(row.id) ? 'checked-table-row' : ''
                    }`}
                    title={toPascalCase(row.userName)}
                    width="12%"
                  >
                    {toPascalCase(row.userName)}
                  </CTableDataCell>
                  <CTableDataCell
                    className={`text-c pd-text1 grid-cell ${
                      selectedRows.includes(row.id) ? 'checked-table-row' : ''
                    }`}
                    title={row.productName}
                    width="15%"
                  >
                    <span>
                      {row.assignedStatus === true && (
                        <span style={{ fontSize: '16px', color: '#00ab55' }}>&#8226;</span>
                      )}
                      {row.assignedStatus === false && (
                        <span style={{ fontSize: '16px', color: '#ffaa00' }}>&#8226;</span>
                      )}
                      <span style={{ marginLeft: '5px' }}>{row.productName}</span>
                    </span>
                  </CTableDataCell>
                  <CTableDataCell
                    className={`text-c pd-text1 grid-cell ${
                      selectedRows.includes(row.id) ? 'checked-table-row' : ''
                    }`}
                    title={row.taskName}
                    width="10%"
                  >
                    {row.taskName}
                  </CTableDataCell>
                  <CTableDataCell
                    className={`text-c pd-text1 text-center grid-cell ${
                      selectedRows.includes(row.id) ? 'checked-table-row' : ''
                    }`}
                    title={formatTimeDuration(row.hours)}
                    width="5%"
                  >
                    {formatTimeDuration(row.hours)}
                  </CTableDataCell>
                  {/* <CTableDataCell
                    className={`text-c grid-cell ${
                      row.status === 'Approved'
                        ? 'green-text1 '
                        : row.status === 'Pending'
                        ? 'warning-text1 '
                        : row.status === 'Completed'
                        ? 'green-text1 '
                        : ''
                    }${selectedRows.includes(row.id) ? 'checked-table-row' : ''}`}
                    width="10%"
                  >
                    <span>
                      {row.status === 'Approved' && (
                        <span style={{ fontSize: '20px' }}>&#8226;</span>
                      )}
                      {row.status === 'Pending' && (
                        <span style={{ fontSize: '20px' }}>&#8226;</span>
                      )}
                      {row.status === 'Completed' && (
                        <span style={{ fontSize: '20px' }}>&#8226;</span>
                      )}
                      <span style={{ marginLeft: '5px' }}>{row.status}</span>
                    </span>
                  </CTableDataCell> */}
                  <CTableDataCell
                    className={`text-c pd-text1 grid-cell ${
                      selectedRows.includes(row.id) ? 'checked-table-row' : ''
                    }`}
                    title={row.description}
                    width="15%"
                  >
                    {row.description}
                  </CTableDataCell>
                  <CTableDataCell
                    className={`text-c pd-text1 text-center grid-cell ${
                      selectedRows.includes(row.id) ? 'checked-table-row' : ''
                    }`}
                    width="7%"
                  >
                    {/* <Popconfirm
                      title="Approve confirm Modal"
                      description="Are you sure to approve this activity ?"
                      open={open === row.id}
                      onConfirm={() => handleApproved('Approved', row.id)}
                      okButtonProps={{
                        style: { background: '#f54550', borderColor: '#f54550', color: 'white' },
                        loading: confirmLoading,
                      }}
                      placement="left"
                      okText="Yes"
                      cancelText="No"
                      onCancel={handleApproveCancel}
                    > */}
                    <button
                      className="btn border-0 text-c text-secondary check-button"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                      disabled={selectedRows.includes(row.id)}
                      onClick={() => showPopconfirm('Approved', row.id)}
                    >
                      <CheckSvg width="11" height="9" viewBox="0 0 14 10" fill="#A5A1A1" />
                    </button>
                    {/* </Popconfirm> */}

                    <button
                      className="btn border-0 text-c text-secondary cross-button"
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                      onClick={() => showModal(row.id, 'Reject')}
                      disabled={selectedRows.includes(row.id)}
                    >
                      <CrossSvg width="9" height="11" viewBox="0 0 14 10" fill="#A5A1A1" />
                    </button>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          {loaderContent}
        </InfiniteScroll>
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
  formatDate: PropTypes.func,
  productLists: PropTypes.array,
  prodLoader: PropTypes.bool,
}
export default PendingActivity
