import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CRow, CCol, CSpinner, CButton } from '@coreui/react'
import { getHeaders, getDecodeData } from 'src/constant/Global'
import PropTypes from 'prop-types'
import EditActivityModal from '../modal/EditActivityModal'
import { DatePicker, Breadcrumb, Skeleton, Table, Select } from 'antd'
import dayjs from 'dayjs'
import { formatDate, formatTimeDuration } from '../../constant/TimeUtils'
import useAxios from 'src/constant/UseAxios'
import EditSvg from '../svgImages/EditSvg'
import Calendarimg from '../../assets/images/calendar-image.png'
import { EditSubmittedActivity, getExistsDates } from 'src/redux/timesheet/action'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import debounce from 'lodash.debounce'
import Downarrowimg from '../../assets/images/downarrow.png'

const SubmitActivity = ({ today, taskList, productList }) => {
  let api = useAxios()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [dateWise, setDateWise] = useState(dayjs())
  const [showActivityData, setShowActivityData] = useState([])
  const [viewActivity, setViewActivity] = useState(null)
  const [status, setStatus] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [visibleSubmit, setVisibleSubmit] = useState(false)
  const user = getDecodeData()
  const roleIntake = user?.roleIntake
  const [commonLoader, setCommonLoader] = useState(true)
  const [loading, setLoading] = useState(true)
  const dateRef = useRef(null)
  const pageRef = useRef(0)
  const filterRef = useRef(false)
  const statusRef = useRef(null)
  const levelRef = useRef(null)
  const hasMoreRef = useRef(true)
  const enable = useRef(false)
  const [abortController, setAbortController] = useState(new AbortController())
  const existingDates = useSelector((state) => state.timesheet.existingDates)
  const location = useLocation()
  const idRef = useRef(null)
  const tableBodyRef = useRef(null)
  const [isNorMore, setIsNorMore] = useState(false)
  const [isLevel, setIsLevel] = useState(false)
  const [isStatus, setIsStatus] = useState(false)

  const handleDateChange = (date, dateString) => {
    console.log(date, ' date')
    console.log(levelRef.current, ' level')
    console.log(statusRef.current, ' status')
    setCommonLoader(true)
    setShowActivityData([])
    setDateWise(date)
    pageRef.current = 0
    if (date !== null) {
      const parsedDate = dayjs(date, 'DD MMM, YYYY')
      const formattedDate = parsedDate.format('YYYY-MM-DD')
      dateRef.current = formattedDate
      filterRef.current = true
      getActivityList()
    } else {
      dateRef.current = null
      if (levelRef.current !== null && statusRef.current !== null) {
        alert(1)
        filterRef.current = true
        getActivityList()
      } else if (levelRef.current !== null && statusRef.current === null) {
        filterRef.current = true
      } else if (levelRef.current === null && statusRef.current !== null) {
        filterRef.current = true
      } else {
        filterRef.current = false
        getActivityList()
      }
    }
  }

  useEffect(() => {
    hasMoreRef.current = true
    const params = new URLSearchParams(location.search)
    const id = params.get('id')
    if (id) {
      idRef.current = id
      enable.current = true
      setCommonLoader(false)
      getActivityById(id)
    } else {
      enable.current = false
      getActivityList()
    }
    const currentMonthYear = dayjs(dateWise).format('YYYY-MM')
    dispatch(getExistsDates(currentMonthYear))
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getActivityList = async () => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setShowActivityData([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    // approverType

    let url = `common/timesheet/activity/submit-list?page=${pageRef.current}&size=10&filter=${filterRef.current}`
    if (filterRef.current === true) {
      if (dateRef.current !== null) {
        url += `&date=${dateRef.current}`
      }
      // Add level if it's not null or undefined
      if (
        levelRef.current !== null &&
        levelRef.current !== undefined &&
        statusRef.current !== null
      ) {
        url += `&approverType=${levelRef.current}&status=${statusRef.current}`
      }
    }

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data
      if (pageRef.current === 0) {
        setShowActivityData(data)
      } else {
        setShowActivityData((prevUserData) => {
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

  const getActivityById = async (id) => {
    const url = `common/timesheet/taskActivitydata?id=${id}`
    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
      })
      const data = response.data.data
      setShowActivityData(data)
      setCommonLoader(false)
    } catch (error) {}
  }

  const handleEdit = async (id) => {
    dispatch(EditSubmittedActivity(id))
      .then((response) => {
        const data = response.data.data
        setViewActivity(data)
        if (data.approvedStatus === 'Reject') {
          setStatus('supervisor')
        } else if (data.finalApproveStatus === 'Reject') {
          setStatus('final_approver')
        }
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
    setShowActivityData([])
    if (enable.current === true) {
      getActivityById(idRef.current)
    } else {
      getActivityList()
    }
  }
  const handlePanelChange = async (value, mode) => {
    if (mode === 'date') {
      setLoading(true)
      const currentMonthYear = dayjs(value).format('YYYY-MM')
      try {
        await dispatch(getExistsDates(currentMonthYear))
      } catch (error) {
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }
  }

  const handleLevel = (level) => {
    pageRef.current = 0
    hasMoreRef.current = true
    filterRef.current = true
    setShowActivityData([])
    setCommonLoader(true)
    if (level !== undefined) {
      levelRef.current = level
    } else {
      levelRef.current = null
    }
    if (statusRef.current === null && level !== undefined) {
      setIsStatus(true)
    } else if (statusRef.current !== null && level === undefined) {
      setIsLevel(true)
    } else {
      setIsLevel(false)
      setIsStatus(false)
    }
    if (level === undefined && dateRef.current === null && statusRef.current === null) {
      filterRef.current = false
      getActivityList()
    } else if (dateRef.current !== null && statusRef.current !== null && level !== undefined) {
      filterRef.current = true
      getActivityList()
    } else if (dateRef.current !== null && statusRef.current === null && level !== undefined) {
      filterRef.current = true
    } else if (dateRef.current !== null && statusRef.current !== null && level === undefined) {
      filterRef.current = true
    } else if (dateRef.current === null && statusRef.current !== null && level !== undefined) {
      filterRef.current = true
      getActivityList()
    }
  }

  const handleStatus = (status) => {
    pageRef.current = 0
    hasMoreRef.current = true
    filterRef.current = true
    setShowActivityData([])
    setCommonLoader(true)
    if (status !== undefined) {
      statusRef.current = status
    } else {
      statusRef.current = null
    }
    if (levelRef.current === null && status !== undefined) {
      setIsLevel(true)
    } else if (levelRef.current !== null && status === undefined) {
      setIsStatus(true)
    } else {
      setIsLevel(false)
      setIsStatus(false)
    }
    if (status === undefined && dateRef.current === null && levelRef.current === null) {
      filterRef.current = false
      getActivityList()
    } else if (dateRef.current !== null && levelRef.current !== null && status !== undefined) {
      filterRef.current = true
      getActivityList()
    } else if (dateRef.current !== null && levelRef.current === null && status !== undefined) {
      filterRef.current = true
    } else if (dateRef.current !== null && levelRef.current !== null && status === undefined) {
      filterRef.current = true
    } else if (dateRef.current === null && levelRef.current !== null && status !== undefined) {
      filterRef.current = true
      getActivityList()
    }
  }

  const renderDateCell = (current) => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center' }}>
          {Array.from({ length: 1 }, (_, index) => (
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
      )
    }
    const existDate = existingDates
    if (!existDate) {
      return null // Or handle it according to your use case
    }

    const submittedDates = existDate.SubmittedList || []

    const isSubmitted = submittedDates.includes(current.format('YYYY-MM-DD'))
    const isSelected = current.isSame(dateWise, 'day')

    const color = isSelected ? 'white' : isSubmitted ? 'green' : 'black'
    const fontWeight = isSelected ? 'normal' : isSubmitted ? 'bold' : 'normal'

    const backgroundColor = isSelected ? '#e40e2d' : 'transparent'
    const borderRadius = isSelected ? '50%' : '0%'
    const minWidth = isSelected ? '24px' : 'auto'
    const height = isSelected ? '24px' : 'auto'
    const display = isSelected ? 'inline-block' : 'initial'
    const lineHeight = isSelected ? '24px' : 'initial'
    return (
      <div
        style={{
          color,
          fontWeight,
          backgroundColor,
          borderRadius,
          minWidth,
          height,
          display,
          lineHeight,
        }}
      >
        {current.date()}
      </div>
    )
  }

  const disabledDate = (current) => {
    const existDate = existingDates
    if (!existDate) {
      return true // Or handle it according to your use case
    }

    const submittedDates = existDate.SubmittedList || []

    const isSubmitted = submittedDates.includes(current.format('YYYY-MM-DD'))

    return !isSubmitted
  }

  const handleClear = () => {
    navigate('/timesheet')
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
      title: 'Activity Date',
      dataIndex: 'activity_date',
      key: 'activity_date',
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
            <span style={{ marginLeft: '5px' }}>{truncateString(record.productName, 13)}</span>
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
      title: 'Approver Status',
      dataIndex: 'approvedStatus',
      key: 'approvedStatus',
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
      title: 'Final Status',
      dataIndex: roleIntake === 'Contract' ? 'finalApproveStatus' : 'ownerStatus',
      key: roleIntake === 'Contract' ? 'finalApproveStatus' : 'ownerStatus',
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
        if (roleIntake === 'Contract') {
          switch (text) {
            case 'Approved':
              className = 'green-text1'
              break
            case 'Reject':
            case 'Rejected':
              className = 'red-text1'
              break
            case 'Not Yet':
              className = 'info-text1'
              break
            case 'TL Approved':
            case 'Pending':
              className = 'warning-text1'
              break
            default:
              className = 'not-text1'
              break
          }
        } else {
          switch (text) {
            case 'Approved':
              className = 'green-text1'
              break
            case 'Reject':
            case 'Rejected':
              className = 'red-text1'
              break
            case 'Not Yet':
              className = 'info-text1'
              break
            case 'Supervisor Not Approved':
              className = 'info-text1'
              break
            case 'Pending':
              className = 'warning-text1'
              break
            default:
              className = 'not-text1'
              break
          }
        }
        return (
          <div className={` ${className}`}>
            {text !== null && <span style={{ fontSize: '16px' }}>&#8226;</span>}{' '}
            {text === 'Reject' ? 'Rejected' : text === null ? '--' : text}
          </div>
        )
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'description',
      key: 'description',
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
        return <div title={text}> {truncateString(text, 30)}</div>
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
          record.approvedStatus === 'Reject' ||
          record.finalApproveStatus === 'Reject' ||
          record.ownerStatus === 'Reject'
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
    },
  ]

  const displayData = [
    ...showActivityData.map((row, index) => ({
      key: row.id,
      id: row.id,
      index: index + 1,
      activity_date: row.activity_date,
      productName: row.productName,
      taskName: row.taskName,
      hours: row.hours,
      description: row.description,
      finalApproveStatus: row.finalApproveStatus,
      approvedStatus: row.approvedStatus,
      ownerStatus: row.ownerStatus,
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
      action: '',
      finalApproveStatus: '',
      approvedStatus: '',
      ownerStatus: '',
      assignedStatus: '',
    })
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      getActivityList()
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
            <EditActivityModal
              isOpen={editModal}
              closeModal={handleEditPage}
              viewActivity={viewActivity}
              taskList={taskList}
              statusApprove={status}
              today={today}
              productList={productList}
            />
          )}
        </>
      ) : (
        <>
          {/* <CRow>
            <CCol xs={12} sm={5} md={enable.current ? 5 : 6}>
              <h6 className="timesheet-heading mt-3" style={{ marginLeft: '30px' }}>
                Submitted - Time Sheet
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
                      <span
                        className="text-secondary second-subheading"
                        style={{ cursor: 'default' }}
                      >
                        Submitted Activity
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>

            <CCol sm={2} md={2} style={{ marginTop: '2%' }}>
              <Select
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt="Downarrowimg"
                    style={{ width: '10px', height: '6px' }}
                  />
                }
                className="members_activity_select member-custom-select membr-rais-status mem_selct"
                allowClear
                placeholder="Choose Level"
                options={[
                  {
                    value: 'Level1',
                    label: 'Level 1',
                  },
                  {
                    value: 'Level2',
                    label: 'Level 2',
                  },
                ]}
                onChange={(value) => handleLevel(value)}
              />
            </CCol>

            <CCol sm={2} md={2} style={{ marginTop: '2%' }}>
              <Select
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt="Downarrowimg"
                    style={{ width: '10px', height: '6px' }}
                  />
                }
                className="members_activity_select member-custom-select membr-rais-status mem_selct"
                allowClear
                placeholder="Choose Status"
                options={[
                  {
                    value: 'Pending',
                    label: 'Pending',
                  },
                  {
                    value: 'Approved',
                    label: 'Approved',
                  },
                  {
                    value: 'Rejected',
                    label: 'Rejected',
                  },
                ]}
                onChange={(value) => handleStatus(value)}
              />
            </CCol>

            <CCol xs={2} sm={2} md={2} className="draft-sumbit-button ">
              <DatePicker
                variant={'bordered'}
                id="date"
                type="date"
                name="fieldName"
                placeholder="Choose Date"
                className="form-input-draft input-lg date-picker activity-date "
                onChange={handleDateChange}
                format="DD MMM, YYYY"
                suffixIcon={
                  <img
                    src={Calendarimg}
                    alt="Calendarimg"
                    style={{ width: '13px', height: '13px' }}
                  />
                }
                onPanelChange={handlePanelChange}
                max={today}
                active
                allowClear={true}
                cellRender={renderDateCell}
                disabled={enable.current}
                disabledDate={disabledDate}
              />
            </CCol>

            {enable.current && (
              <CCol xs={3} sm={1}>
                <div style={{ marginTop: '33%' }}>
                  <CButton
                    className="submit-button submit-timesheet-share "
                    style={{ fontSize: '13px', color: 'white' }}
                    type="button"
                    onClick={handleClear}
                  >
                    Clear
                  </CButton>
                </div>
              </CCol>
            )}
          </CRow> */}
          <CRow>
            <CCol xs={12} sm={6} md={enable.current ? 5 : 6}>
              <h6 className="timesheet-heading mt-3" style={{ marginLeft: '30px' }}>
                Submitted - Time Sheet
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
                      <span
                        className="text-secondary second-subheading"
                        style={{ cursor: 'default' }}
                      >
                        Submitted Activity
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>
            <CCol xs={6} sm={3} md={2} style={{ marginTop: '1%' }}>
              <Select
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt="Downarrowimg"
                    style={{ width: '12px', height: '7px' }}
                  />
                }
                placeholder="Choose Level"
                className="members_activity_select member-custom-select membr-rais-status mem_selct"
                options={[
                  {
                    value: 'level1',
                    label: 'Approver Status',
                  },
                  {
                    value: 'level2',
                    label: 'Final Status',
                  },
                ]}
                allowClear={true}
                onChange={(value) => handleLevel(value)}
              />
              {isLevel && (
                <span className="text-danger" style={{ fontSize: 11 }}>
                  Please choose level
                </span>
              )}
            </CCol>
            <CCol xs={6} sm={3} md={2} style={{ marginTop: '1%' }}>
              <Select
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt="Downarrowimg"
                    style={{ width: '12px', height: '7px' }}
                  />
                }
                placeholder="Choose Status"
                className={`members_activity_select member-custom-select membr-rais-status mem_selct ${
                  statusRef.current === 'Approved'
                    ? 'present-color'
                    : statusRef.current === 'Rejected'
                    ? 'leave-color'
                    : 'warnings-color'
                }`}
                allowClear={true}
                onChange={(value) => handleStatus(value)}
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
              {isStatus && (
                <span className="text-danger" style={{ fontSize: 11 }}>
                  Please choose status
                </span>
              )}
            </CCol>
            <CCol xs={6} sm={3} md={2}>
              <div>
                <DatePicker
                  variant={'bordered'}
                  id="date"
                  type="date"
                  name="fieldName"
                  placeholder="Choose Date"
                  className="form-input-draft input-lg date-picker raised_selectbox"
                  onChange={handleDateChange}
                  format="DD MMM, YYYY"
                  suffixIcon={
                    <img
                      src={Calendarimg}
                      alt="Calendarimg"
                      style={{ width: '13px', height: '13px' }}
                    />
                  }
                  onPanelChange={handlePanelChange}
                  max={today}
                  active
                  allowClear={true}
                  cellRender={renderDateCell}
                  disabled={enable.current}
                  disabledDate={disabledDate}
                />
              </div>
            </CCol>
            {enable.current && (
              <CCol xs={3} sm={1}>
                <div style={{ marginTop: '15%' }}>
                  <CButton
                    className="submit-button submit-timesheet-share "
                    style={{ fontSize: '13px', color: 'white' }}
                    type="button"
                    onClick={handleClear}
                  >
                    Clear
                  </CButton>
                </div>
              </CCol>
            )}
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
              size={'middle'}
              className={`${isNorMore ? 'last-row-table' : ''}`}
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
      )}
    </>
  )
}

SubmitActivity.propTypes = {
  today: PropTypes.string,
  productList: PropTypes.array,
  taskList: PropTypes.array,
}
export default SubmitActivity
