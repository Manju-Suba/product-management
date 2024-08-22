import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Select, DatePicker, Breadcrumb, Table } from 'antd'
import { CCol, CRow, CSpinner } from '@coreui/react'
import { getHeaders } from 'src/constant/Global'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import useAxios from 'src/constant/UseAxios'
import Calendarimg from '../../assets/images/calendar-image.png'
import dayjs from 'dayjs'
import Downarrowimg from '../../assets/images/downarrow.png'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'
import EditSvg from '../svgImages/EditSvg'
import { EditRaisedRequest } from 'src/redux/timesheet/action'
import { useDispatch } from 'react-redux'
import RaisedRequestEditModel from '../modal/RaisedRequestEditModel'


const RaisedRequest = ({ formatDate }) => {
  let api = useAxios()
  const dispatch = useDispatch()
  const [memberTable, setMemberTable] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  const dateRef = useRef(null)
  const pageRef = useRef(0)
  const filterRef = useRef(false)
  const hasMoreRef = useRef(true)
  const statusRef = useRef(null)
  const [abortController, setAbortController] = useState(new AbortController())
  const tableBodyRef = useRef(null)
  const [isNorMore, setIsNorMore] = useState(false)
  const [visibleSubmit, setVisibleSubmit] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [viewActivity, setViewActivity] = useState(null)

  useEffect(() => {
    hasMoreRef.current = true
    getMemberRequestall()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDateChange = (date, dateString) => {
    pageRef.current = 0
    hasMoreRef.current = true
    filterRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (date === '' && statusRef.current === null) {
      dateRef.current = null
      filterRef.current = false
    } else if (date === '' && statusRef.current !== null) {
      dateRef.current = null
      filterRef.current = true
    } else if (statusRef.current !== null || date !== '') {
      filterRef.current = true
      const parsedDate = dayjs(date, 'DD MMM, YYYY')
      const formattedDate = parsedDate.format('YYYY-MM-DD')
      dateRef.current = formattedDate
    }
    getMemberRequestall()
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
    let url
    if (filterRef.current === false) {
      url = `activity/raisedRequest/byuser?page=${pageRef.current}&size=10&filter=${filterRef.current}`
    } else if (
      filterRef.current === true &&
      statusRef.current === null &&
      dateRef.current !== null
    ) {
      url = `activity/raisedRequest/byuser?page=${pageRef.current}&size=10&date=${dateRef.current}&filter=${filterRef.current}`
    } else if (
      filterRef.current === true &&
      statusRef.current !== null &&
      dateRef.current !== null
    ) {
      url = `activity/raisedRequest/byuser?page=${pageRef.current}&size=10&date=${dateRef.current}&filter=${filterRef.current}&status=${statusRef.current}`
    } else {
      url = `activity/raisedRequest/byuser?page=${pageRef.current}&size=10&filter=${filterRef.current}&status=${statusRef.current}`
    }

    try {
      const response = await api.get(url, {
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

  const handleStatusFilter = (status) => {
    pageRef.current = 0
    hasMoreRef.current = true
    filterRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (status === undefined && dateRef.current === null) {
      statusRef.current = null
      filterRef.current = false
    } else if (dateRef.current !== null && status !== undefined) {
      filterRef.current = true
      statusRef.current = status
    } else if (dateRef.current !== null && status === undefined) {
      filterRef.current = true
      statusRef.current = null
    } else {
      filterRef.current = true
      statusRef.current = status
    }
    getMemberRequestall()
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
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
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
      title: 'Reason',
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
        return text
      },
    },
    {
      title: 'Approver Status',
      dataIndex: 'status',
      key: 'status',
      width: '8%',
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
      title: 'Approver Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: '25%',
      render: (text, record, index) => {
        if (record.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return text ? text : '---'
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
        let action
        if (
          record.status === 'Reject' || record.status === 'Rejected'
        ) {
          action = (
            <button
              type="button"
              className="action-view edit-button "
              onClick={() => handleEdit(record.id)}
              style={{ padding: '4px 8px' }}
            >
              <EditSvg
                width="13"
                height="13"
                viewBox="0 0 18 18"
                fill="none"
                color="white"
                clipH="18"
                clipW="18"
              />
            </button>
          )
        } else {
          action = '--'
        }
        return action
      },
    }
  ]

  const handleEdit = async (id) => {
    dispatch(EditRaisedRequest(id))
      .then((response) => {
        const data = response.data.data
        console.log(data)
        setViewActivity(data)
        setVisibleSubmit(true)
        setEditModal(true)
      })
      .catch((error) => {})
  }

  const handleEditPage = () => {
    setVisibleSubmit(false)
    setEditModal(false)
    hasMoreRef.current = true
    filterRef.current = false
    pageRef.current = 0
    getMemberRequestall()
  }

  const displayData = [
    ...memberTable.map((row, index) => ({
      key: row.id,
      id: row.id,
      index: index + 1,
      requestDate: row.requestDate,
      teamName: row.teamName,
      reason: row.reason,
      status: row.status,
      remarks: row.remarks,
    })),
  ]

  if (!hasMoreRef.current && displayData.length !== 0 && displayData.length > 10) {
    displayData.push({
      key: 'noMoreData',
      index: '',
      reason: 'No more Data to load',
      requestDate: '',
      teamName: '',
      status: '',
      remarks: '',
    })
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      getMemberRequestall()
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
      {visibleSubmit ? (
        <>
          {' '}
          {editModal && (
            <RaisedRequestEditModel
              isOpen={editModal}
              closeModal={handleEditPage}
              viewActivity={viewActivity}
            />
          )}
        </>
      ) : (
        <>
          <CRow>
            <CCol xs={12} sm={6} md={8}>
              <h6 className="timesheet-heading mt-3" style={{ marginLeft: '30px' }}>
                Raised Request - Time Sheet
              </h6>
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
                      <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                        Raised Request
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>
            <CCol xs={6} sm={3} md={2}>
              <div>
                <DatePicker
                  style={{ marginLeft: '30px' }}
                  variant={'borderless'}
                  id="date"
                  type="date"
                  name="fieldName"
                  placeholder="Choose Date"
                  className="form-input-draft input-lg date-picker  raised_selectbox"
                  suffixIcon={
                    <img
                      src={Calendarimg}
                      alt="Calendarimg"
                      style={{ width: '13px', height: '13px' }}
                    />
                  }
                  onChange={(date, dateString) => handleDateChange(dateString)}
                  format="DD MMM, YYYY"
                  allowClear={true}
                  max={dayjs()}
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </div>
            </CCol>
            <CCol xs={6} sm={3} md={2}>
              <Select
                suffixIcon={
                  <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '12px', height: '7px' }} />
                }
                placeholder="Choose Status"
                className={`form-input-draft input-lg  raised_selectbox ${
                  statusRef.current === 'Approved'
                    ? 'present-color'
                    : statusRef.current === 'Rejected'
                    ? 'leave-color'
                    : 'warnings-color'
                }`}
                value={statusRef.current}
                allowClear={true}
                onChange={handleStatusFilter}
              >
                <Select.Option value="Approved" style={{ color: '#00ab55', fontWeight: '600' }}>
                  Approved
                </Select.Option>
                <Select.Option value="Rejected" style={{ color: '#e40e2d', fontWeight: '600' }}>
                  Rejected
                </Select.Option>
                <Select.Option value="Pending" style={{ color: '#ffaa00', fontWeight: '600' }}>
                  Pending
                </Select.Option>
              </Select>
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
              dataSource={displayData}
              pagination={false}
              size={'middle'}
              className={`${isNorMore ? 'last-row-table' : ''}`}
              scroll={{ y: 490 }}
              loading={{
                spinning: commonLoader,
                indicator: <CSpinner color="danger" />,
              }}
            />
          </div>
        </>
      )}
    </>
  )
}

RaisedRequest.propTypes = {
  formatDate: PropTypes.func,
}
export default RaisedRequest
