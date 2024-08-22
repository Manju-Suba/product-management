import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Checkbox, Select, DatePicker, Breadcrumb, Skeleton, Table } from 'antd'
import { CCol, CRow, CSpinner } from '@coreui/react'
import { getHeaders, ImageUrl } from 'src/constant/Global'
import profileImage1 from '../../assets/images/avatars/wrapper.png'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import CrossSvg from '../svgImages/CrossSvg'
import CheckSvg from '../svgImages/CheckSvg'
import RejectConfirmModal from '../modal/RejectConfirmModal'
import useAxios from 'src/constant/UseAxios'
import dayjs from 'dayjs'
import Downarrowimg from '../../assets/images/downarrow.png'
import { toPascalCase } from '../../constant/TimeUtils'
import ApprovedConfirmModal from '../modal/ApprovedConfirmModel'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'

const RequestList = ({ formatDate, memberLists, memberLoader }) => {
  let api = useAxios()
  const [memberTable, setMemberTable] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [memberList, setMemberList] = useState([])
  const [headerLabel, setHeaderLabel] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [singleId, setSingleId] = useState()
  const [commonLoader, setCommonLoader] = useState()
  const [open, setOpen] = useState(null)
  const [openSelectAll, setOpenSelectAll] = useState(false)
  const [singleApprovedId, setSingleApprovedId] = useState('')
  const [approvedStatus, setApprovedStatus] = useState('')
  const [approvedStatusAll, setApprovedStatusAll] = useState('')
  const [openSelectRejectAll, setOpenSelectRejectAll] = useState(false)
  const dateRef = useRef(null)
  const pageRef = useRef(0)
  const memberIdRef = useRef(0)
  const filterRef = useRef(false)
  const hasMoreRef = useRef(true)
  const [abortController, setAbortController] = useState(new AbortController())
  const tableBodyRef = useRef(null)
  const [isNorMore, setIsNorMore] = useState(false)
  const totalCountRef = useRef('')

  const showPopconfirm = (status, rowId) => {
    setOpen(true)
    setSingleApprovedId(rowId)
    setApprovedStatus(status)
  }

  const showPopconfirmAll = (status) => {
    if (status === 'Approved') {
      setOpenSelectAll(true)
      setApprovedStatusAll('Approved')
    } else if (status === 'Rejected') {
      setOpenSelectRejectAll(true)
      setApprovedStatusAll('Rejected')
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

  useEffect(() => {
    setMemberList(memberLists)
    hasMoreRef.current = true
    getMemberRequestall()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDateChange = (date, dateString) => {
    pageRef.current = 0
    hasMoreRef.current = true
    if (date !== null) {
      const parsedDate = dayjs(date, 'DD MMM, YYYY')
      const formattedDate = parsedDate.format('YYYY-MM-DD')
      dateRef.current = formattedDate
      filterRef.current = true
    } else if (memberIdRef.current !== 0) {
      filterRef.current = true
      dateRef.current = null
    } else {
      filterRef.current = false
      dateRef.current = null
    }
    setCommonLoader(true)
    setMemberTable([])
    getMemberRequestall()
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

  const getUrl = () => {
    let url
    if (filterRef.current === false)
      url = `activity/raisedRequest/tosupervisor?page=${pageRef.current}&size=10&filter=${filterRef.current}&userid=${memberIdRef.current}`
    else if (dateRef.current !== null && memberIdRef.current !== 0)
      url = `activity/raisedRequest/tosupervisor?page=${pageRef.current}&size=10&filter=${filterRef.current}&date=${dateRef.current}&userid=${memberIdRef.current}`
    else if (dateRef.current !== null && memberIdRef.current === 0)
      url = `activity/raisedRequest/tosupervisor?page=${pageRef.current}&size=10&filter=${filterRef.current}&date=${dateRef.current}`
    else if (dateRef.current === null && memberIdRef.current !== 0)
      url = `activity/raisedRequest/tosupervisor?page=${pageRef.current}&size=10&filter=${filterRef.current}&userid=${memberIdRef.current}`
    return url
  }

  const getMemberRequestall = async () => {
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
      const data = response.data.data.dataList
      totalCountRef.current = response.data.data.totalCount
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

  const handleBulkApproval = async (status, id, remarksValue) => {
    if (approvedStatusAll === 'Rejected' && remarksValue === '') {
      toast.error('Please Enter Remarks!..', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
    } else {
      const url = `activity/approve?ids=${selectedRows}`
      const postData = {
        status: approvedStatusAll,
        remarks: remarksValue,
      }
      try {
        const response = await api.put(url, postData, {
          headers: getHeaders('json'),
        })
        if (response?.data) {
          toast.success(response.data.message, {
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
  }
  const handleApproved = async (status, singleApprovedId, remarks) => {
    return await handleRaiseApprove(approvedStatus, singleApprovedId, remarks)
  }

  const handleRaiseApprove = async (status, id, remarks) => {
    const url = 'activity/approve/' + id
    const postData = {
      status: status,
      remarks: remarks,
    }
    try {
      const response = await api.put(url, postData, {
        headers: getHeaders('json'),
      })

      if (response?.data) {
        const message = `Request ${status} Successfully`
        toast.success(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000,
        })
        return response.data
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message
      toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
      throw error
    }
  }

  const resetFormValues = () => {
    setOpen(false)
    setOpenSelectAll(false)
    setOpenSelectRejectAll(false)
    setSelectedRows([])
    setHeaderLabel('')
    pageRef.current = 0
    hasMoreRef.current = true
    filterRef.current = false
    getMemberRequestall()
    setIsModalOpen(false)
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
    if (member !== undefined) {
      memberIdRef.current = member
      filterRef.current = true
    } else if (member === undefined && dateRef.current !== null) {
      filterRef.current = true
      memberIdRef.current = 0
    } else {
      filterRef.current = false
      memberIdRef.current = 0
    }
    setCommonLoader(true)
    setMemberTable([])
    getMemberRequestall()
  }

  const showModal = (id) => {
    setIsModalOpen(true)
    setSingleId(id)
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
          width: '3%',
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
          width: '4%',
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
          dataIndex: 'requestDate',
          key: 'requestDate',
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
          dataIndex: 'teamName',
          key: 'teamName',
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
          title: 'Description',
          dataIndex: 'reason',
          key: 'reason',
          width: '25%',
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
                  colSpan: 6, // Adjust this number based on the total number of columns to span
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
          width: '3%',
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
            <span
              style={{ color: '#f50505', fontSize: '11px', fontWeight: '600', display: 'flex' }}
            >
              {headerLabel}{' '}
              <span style={{ marginLeft: 35 }}> Total Data : {totalCountRef.current}</span>
            </span>
          ),
          dataIndex: 'index',
          key: 'index',
          width: '4%',
          align: 'center',
          colSpan: 2,
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
          dataIndex: 'requestDate',
          key: 'requestDate',
          width: '8%',
          colSpan: 0,
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
          dataIndex: 'teamName',
          key: 'teamName',
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
          dataIndex: 'reason',
          key: 'reason',
          width: '25%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: (
                  <div style={{ textAlign: 'center' }}>
                    <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
                  </div>
                ),
                props: {
                  colSpan: 6, // Adjust this number based on the total number of columns to span
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
      requestDate: row.requestDate,
      reason: row.reason,
      teamName: row.teamName,
    })),
  ]

  // Append the "No more Data to load" message as the last row if noMoreData is true
  if (!hasMoreRef.current && displayData.length !== 0 && displayData.length > 10) {
    displayData.push({
      key: 'noMoreData',
      index: '',
      reason: 'No more Data to load',
      teamName: '',
      action: '',
    })
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      getMemberRequestall()
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
        <CCol xs={12} sm={10} md={8}>
          <b style={{ paddingLeft: '30px' }}>Request List</b>
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
                    Request List
                  </span>
                ),
              },
            ]}
          />
        </CCol>
        <CCol sm={5} md={2}>
          <DatePicker
            style={{
              borderBottom: '1px solid #f1f1f1',
              borderRadius: '0',
              width: '90%',

              marginTop: '1px',
            }}
            className="filter-date membr-req-date mem_selct"
            onChange={handleDateChange}
            placeholder="Choose Date"
            allowClear={true}
            variant={'borderless'}
            format="DD MMM,YYYY"
          />
        </CCol>
        <CCol sm={5} md={2}>
          <Select
            className="members_activity_select membr-req-mem mem_selct"
            id="member-list"
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
            variant={'borderless'}
            placeholder="Choose Member"
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            allowClear
            popupMatchSelectWidth={false}
            filterOption={(input, option) => {
              const teamNameArray = option.label.props.children[1].props.children[0].props.children
              const teamName = teamNameArray[1]
              const lowerCaseInput = input.toLowerCase()
              const lowerCaseteamName = teamName.toLowerCase()
              return lowerCaseteamName.includes(lowerCaseInput)
            }}
            popupClassName="custom-dropdown"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </CCol>
        {/* <CCol sm={5} md={2}>
          <Select
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            className="members_activity_select member-custom-select mem_selct"
            allowClear
            placeholder="Choose Status"
            options={[
              {
                value: 'Approved',
                label: 'Approved',
              },
              {
                value: 'Rejected',
                label: 'Rejected',
              },
              {
                value: 'Pending',
                label: 'Pending',
              },
            ]}
            onChange={(value) => setStatusValue(value)}
          />
        </CCol> */}
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
          rowKey="id"
          className={`${isNorMore ? 'last-row-table' : ''}`}
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
          handleApprove={handleRaiseApprove}
          id={singleId}
          headContent="request"
          resetFunc={resetFormValues}
        />
      )}
      {open && (
        <ApprovedConfirmModal
          isModalOpen={open}
          handleCancel={handleApproveCancel}
          handleApprove={handleApproved}
          id={singleApprovedId}
          headContent="request"
          resetFunc={resetFormValues}
        />
      )}
      {openSelectAll && (
        <ApprovedConfirmModal
          isModalOpen={openSelectAll}
          handleCancel={handleApproveCancelAll}
          handleApprove={handleBulkApproval}
          headContent="Activity"
          resetFunc={resetFormValues}
        />
      )}
      {openSelectRejectAll && (
        <RejectConfirmModal
          isModalOpen={openSelectRejectAll}
          handleCancel={handleRejectCancelAll}
          handleApprove={handleBulkApproval}
          headContent="Activity"
          resetFunc={resetFormValues}
        />
      )}
    </>
  )
}

RequestList.propTypes = {
  formatDate: PropTypes.func,
  memberLists: PropTypes.array,
  memberLoader: PropTypes.bool,
}
export default RequestList
