import React, { useState, useEffect, useRef } from 'react'
import { Breadcrumb, Calendar, Select, Skeleton, Badge, Tooltip } from 'antd'
import { CRow, CCol } from '@coreui/react'
import { getHeaders, ImageUrl } from 'src/constant/Global'
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import useAxios from 'src/constant/UseAxios'
import 'react-datepicker/dist/react-datepicker.css'
import { Link } from 'react-router-dom'
import Downarrowimg from '../../assets/images/downarrow.png'
import moment from 'moment'
import PendingMemberActivity from './PendingMemberActivity'
import profileImage1 from '../../assets/images/avatars/wrapper.png'
import activityImage from '../../assets/images/activity-img.png'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import RaiseRequestList from './RaiseRequestList'

dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  weekStart: 1,
})

const ActivityCalendar = () => {
  let api = useAxios()
  const memberIdRef = useRef('')
  const memberNameRef = useRef('')
  const setCellTypeRef = useRef('')
  const [data, setData] = useState([])
  const pageRef = useRef(1)
  const [abortController, setAbortController] = useState(new AbortController())
  const [currentMonth, setCurrentMonth] = useState(moment().month() + 1) // Current month (0-indexed)
  const currentMonthRef = useRef(moment().month() + 1)
  const currentYearRef = useRef(moment().year())
  const [currentYear, setCurrentYear] = useState(moment().year()) // Current year
  const selectedDateRef = useRef(null)
  const selectedDateWithoutFormatRef = useRef(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [memberLoader, setMemberLoader] = useState(false)
  const [memberList, setMemberList] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  // const [hideLastRow, setHideLastRow] = useState(false);

  const onPanelChange = (value, mode) => {
    setCurrentMonth(value.month() + 1) // Month is 0-indexed, add 1 for human-readable format
    currentMonthRef.current = value.month() + 1
    currentYearRef.current = value.year()
    setCurrentYear(value.year())
    // setSelectedMember('')
    setData([])
    if (memberIdRef.current !== '' && memberIdRef.current !== 0) {
      getSelfActivityRecord(memberIdRef.current)
    }
  }

  // const onSelect = (date) => {
  //   if (memberIdRef.current !== '') {
  //     const dd = date.format('DDMMYYYY')
  //     const cellValue = document.getElementById(`cell_value_${dd}`).value
  //     if (cellValue != '') {
  //       setCellTypeRef.current = cellValue
  //     } else {
  //       setCellTypeRef.current = ''
  //     }
  //   }

  //   const formattedDate = date.format('YYYY-MM-DD')
  //   selectedDateRef.current = formattedDate
  //   selectedDateWithoutFormatRef.current = date
  //   setSelectedDate(formattedDate)
  // }

  const onSelect = (date) => {
    if (memberIdRef.current !== '') {
      const dd = date.format('DDMMYYYY')
      const cellElement = document.getElementById(`cell_value_${dd}`)

      if (cellElement) {
        // Element exists
        const cellValue = cellElement.value
        if (cellValue !== '') {
          setCellTypeRef.current = cellValue
        } else {
          setCellTypeRef.current = ''
        }
      } else {
        // Element does not exist
        setCellTypeRef.current = ''
      }
    }

    const formattedDate = date.format('YYYY-MM-DD')
    selectedDateRef.current = formattedDate
    selectedDateWithoutFormatRef.current = date
    setSelectedDate(formattedDate)
  }

  const customFullHeaderRender = ({ value, onChange }) => {
    const fullDayNames = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]

    // const [abortController, setAbortController] = useState(new AbortController())
    const month = value.month()

    const onMonthChange = (newMonth) => {
      const newValue = value.clone().month(newMonth)
      onChange(newValue)
    }

    const handleMember = (value) => {
      const ids = Number(memberList.find((user) => user.name === value)?.id || '')
      memberIdRef.current = ids
      memberNameRef.current = value
      if (ids !== '' && ids !== 0) {
        getSelfActivityRecord(ids)
      } else {
        setData([])
      }
      setSelectedMember(value)
    }

    // const getSelfActivityRecord = async (id) => {
    //   const url = `/activity/selfactivity?id=${id}&month=${currentMonth}&year=${currentYear}`
    //   await api
    //     .get(url, {
    //       headers: getHeaders('json'),
    //     })
    //     .then((response) => {
    //       const selfactivity = response.data.data
    //       setData(selfactivity)

    //       setMemberLoader(false)
    //     })
    //     .catch((error) => {})
    // }

    const formattedDate = value.format('MMMM YYYY')

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      setMemberLoader(true)
      getMemberList()
    }, [])

    const memberOptions = memberList.map((user) => ({
      value: user.name,
      label: (
        <div className="select-options select-options-bg">
          <img
            src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
            style={user.profile_pic ? { width: '29px' } : { width: '39px' }}
            alt={user.name}
            className="img-flag"
          />
          <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
            <p className="user-name1" title={user.name}>
              {user.name}
            </p>
            <p className="role-text1">{user.role}</p>
          </div>
        </div>
      ),
    }))

    const curMonth = new Date().getMonth()

    return (
      <div>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 10px 15px 0px' }}> */}
        <CRow style={{ paddingBottom: '15px' }}>
          <CCol md={8}>
            <LeftOutlined onClick={() => onMonthChange(month - 1)} /> &nbsp;&nbsp;
            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{formattedDate}</span>
            &nbsp;&nbsp;
            {/* <RightOutlined onClick={() => onMonthChange(month + 1)} /> */}
            {month !== curMonth ? (
              <RightOutlined onClick={() => onMonthChange(month + 1)} />
            ) : (
              <RightOutlined style={{ color: 'gray', cursor: 'not-allowed' }} />
            )}
          </CCol>
          <CCol md={4}>
            <Select
              style={{ width: '161px' }}
              className="calendar-select"
              id="member-list"
              onChange={handleMember}
              // value={selectedMember ? 'Select Member'}
              value={
                selectedMember
                  ? selectedMember
                  : { label: 'Select Member', value: 'Select Member', className: 'ant-label' }
              }
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
                  : memberOptions
              }
              placeholder="Select Member"
              allowClear
              showSearch
              // style={{ width: '100%',color: 'red' }}
              // style={{ width: '-webkit-fill-available' }}
              suffixIcon={
                <img
                  src={Downarrowimg}
                  alt={Downarrowimg}
                  style={{ width: '10px', height: '7px' }}
                />
              }
            />
          </CCol>
        </CRow>
        {/* </div> */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'left',
            fontSize: '12px',
            color: '#787a7c',
            paddingBottom: '15px',
            paddingTop: '15px',
            marginLeft: '4px',
          }}
        >
          {fullDayNames.map((day, index) => (
            <div key={index} style={{ width: '14.28%', textAlign: 'left', color: '#919EAB' }}>
              {day}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getSelfActivityRecord = async (id) => {
    const url = `/activity/selfactivity?id=${id}&month=${currentMonthRef.current}&year=${currentYearRef.current}`
    await api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const selfactivity = response.data.data
        setData(selfactivity)
        setMemberLoader(false)
      })
      .catch((error) => {})
  }

  function formatDates(value) {
    const day = value.format('D')
    const month = value.format('MMMM')

    const dayWithSuffix = getOrdinalSuffix(parseInt(day, 10))
    return `${dayWithSuffix} ${month}`
  }

  // Function to get the ordinal suffix
  function getOrdinalSuffix(day) {
    const j = day % 10,
      k = day % 100
    if (j === 1 && k !== 11) {
      return day + 'st'
    }
    if (j === 2 && k !== 12) {
      return day + 'nd'
    }
    if (j === 3 && k !== 13) {
      return day + 'rd'
    }
    return day + 'th'
  }

  const getListData = (value) => {
    const dateStr = value.format('DD-MM-YYYY')
    const listData = data.find((item) => item.date === dateStr)
    if (listData) {
      return [
        ...(listData.pending !== 0 ? [{ type: 'pending', count: listData.pending }] : []),
        ...(listData.approved !== 0 ? [{ type: 'approved', count: listData.approved }] : []),
        ...(listData.rejected !== 0 ? [{ type: 'rejected', count: listData.rejected }] : []),
        ...(listData.leave !== 0 ? [{ type: 'leave', count: listData.leave }] : []),
        ...(listData.notEntered !== 0 ? [{ type: 'notEntered', count: listData.notEntered }] : []),
        ...(listData.raisedrequest !== 0
          ? [{ type: 'raisedrequest', count: listData.raisedrequest }]
          : []),
      ]
    }
    return []
  }

  const dateCellRender = (value) => {
    const listData = getListData(value)
    const datewithclass = value.format('DDMMYYYY')

    const dateStr = value
    let divValue = ''
    const vDate = formatDates(dateStr)
    const tooltipContent = (
      <div>
        <div>{vDate}</div>
        <hr style={{ marginTop: '0px', marginBottom: '0px' }} />
        {listData.map((item, index) => {
          let status,
            text,
            className = ''
          if (item.type === 'pending') {
            status = 'warning'
            text = `Pending (${item.count})`
          } else if (item.type === 'approved') {
            status = 'success'
            text = `Approved (${item.count})`
          } else if (item.type === 'rejected') {
            status = 'error'
            text = `Rejected (${item.count})`
          } else if (item.type === 'leave') {
            status = 'default'
            className = 'default2'
            text = `Leave (${item.count})`
          } else if (item.type === 'notEntered') {
            status = 'default'
            text = `Not Entered (${item.count})`
          } else if (item.type === 'raisedrequest') {
            status = 'error'
            className = 'default2'
            text = `Raised Request (${item.count})`
          }

          return (
            <div key={index} title="">
              <Badge className={className} status={status} /> {text}
            </div>
          )
        })}
      </div>
    )

    return (
      <div>
        <Tooltip title={tooltipContent} placement="right" overlayClassName="custom-tooltip">
          <ul className="events-horizontal">
            {listData.map((item, index) => {
              let color,
                className = ''
              if (item.type === 'pending') {
                color = 'warning'
                divValue = 'pending'
              } else if (item.type === 'rejected') {
                color = 'error'
              } else if (item.type === 'approved') {
                color = 'success'
              } else if (item.type === 'leave') {
                color = 'default'
                className = 'default2'
                divValue = 'leave'
              } else if (item.type === 'notEntered') {
                color = 'default'
              } else if (item.type === 'raisedrequest') {
                color = 'error'
                className = 'default2'
                divValue = 'raisedrequest'
              }

              return (
                <li key={index} className="event-item-horizontal" style={{ width: '0px' }}>
                  <Badge className={className} status={color} />
                  <input type="hidden" id={`cell_value_${datewithclass}`} value={divValue} />
                </li>
              )
            })}
          </ul>
        </Tooltip>
      </div>
    )
  }

  const getMemberList = async () => {
    let newAbortController
    if (pageRef.current === 0) {
      setMemberList([])
      if (abortController) {
        abortController.abort()
      }
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    const url = `GenerateReport/contractmembers?roletype=all`
    await api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        const members = response.data.data
        setMemberList(members)
        setMemberLoader(false)
      })
      .catch((error) => {
        //console.error('Error fetching data:', error)
      })
  }

  const resetComponent = () => {
    getSelfActivityRecord(memberIdRef.current)
  }

  useEffect(() => {
    const removeTitleAttributes = () => {
      const tds = document.querySelectorAll('.ant-picker-cell[title]')
      tds.forEach((td) => {
        td.removeAttribute('title')
      })
    }

    // Call the function initially and on every re-render
    removeTitleAttributes()

    // Add a mutation observer to watch for changes in the calendar and remove titles dynamically
    const observer = new MutationObserver(removeTitleAttributes)
    const calendarElement = document.querySelector('.ant-picker-panel')
    if (calendarElement) {
      observer.observe(calendarElement, { childList: true, subtree: true })
    }

    // Cleanup observer on component unmount
    return () => {
      if (calendarElement) {
        observer.disconnect()
      }
    }
  }, [])

  const disabledDate = (current) => {
    return current && (current > moment().endOf('month') || current > moment())
  }

  return (
    <>
      <style>{`
            .ant-picker-calendar.ant-picker-calendar-full .ant-picker-calendar-date-content {
                height : 50px;
            }
            .right-align {
                display: flex;
                justify-content: flex-end;
            }
            .ant-picker-cell-range-start .ant-picker-cell-inner, .ant-picker-cell-range-end .ant-picker-cell-inner, .ant-picker-cell-selected .ant-picker-cell-inner {
                background-color: #e9a3ad1f !important;
            }
            .ant-picker-cell-selected .ant-picker-cell-inner.ant-picker-calendar-date{
                border-radius: 11px !important;
                border: 1px solid red !important;
            }
            .ant-picker-calendar.ant-picker-calendar-full .ant-picker-calendar-date {
                border: 0;
                // border: 1px solid rgba(5, 5, 5, 0.06);
            }
            .ant-picker-calendar.ant-picker-calendar-full .ant-picker-calendar-date-today {
                background-color: #c6cbca26 !important;
            }
            .ant-picker-calendar tbody{
                border: 1px solid #d5cdcd94;
            }
            .ant-picker-calendar.ant-picker-calendar-full .ant-picker-panel {
                text-align: left !important;
            }
            .ant-picker-content thead{
                display:none;
            }

            .events-horizontal {
                list-style: none;
                padding: 0;
                margin: 0;
                display: flex;
            }

            .event-item-horizontal {
              margin-right: 10px; /* Adjust the margin as needed for spacing */
            }

            .event-item-horizontal:last-child {
             margin-right: 0; /* Remove margin for the last item */
            }

            .ant-picker-calendar .ant-picker-calendar-header {
                display: block !important;
            }

            .custom-tooltip .ant-tooltip-inner {
              background-color: white;
              color: black; /* Optional: Change text color if needed */
              box-shadow: 0 0 10px rgb(32 18 18 / 50%); /* Grey shadow */
              font-size: 10px;
            }

            .custom-tooltip .ant-tooltip-arrow-content {
              background-color: white;
            }

            .fontSize-10px{
              font-size: 13px;
              color: rgb(145, 158, 171);
            }

            .fontSize-10px .ant-badge.ant-badge-status .ant-badge-status-dot{
              width: 8px;
              height: 8px;
            }

            .ant-badge.ant-badge-status.default2 .ant-badge-status-default {
                background-color: rgb(117 24 205 / 70%);
            }

            .ant-badge.ant-badge-status.default2 .ant-badge-status-error {
              background-color: rgb(24 124 205 / 94%);
            }

            .ant-picker-calendar.ant-picker-calendar-full .ant-picker-cell-selected .ant-picker-calendar-date .ant-picker-calendar-date-value, :where(.css-dev-only-do-not-override-djtmh8).ant-picker-calendar.ant-picker-calendar-full .ant-picker-cell-selected:hover .ant-picker-calendar-date .ant-picker-calendar-date-value, :where(.css-dev-only-do-not-override-djtmh8).ant-picker-calendar.ant-picker-calendar-full .ant-picker-cell-selected .ant-picker-calendar-date-today .ant-picker-calendar-date-value, :where(.css-dev-only-do-not-override-djtmh8).ant-picker-calendar.ant-picker-calendar-full .ant-picker-cell-selected:hover .ant-picker-calendar-date-today .ant-picker-calendar-date-value {
                color: red;
            }

        `}</style>

      <CRow className="mt-3">
        <CCol sm={9}>
          <b style={{ marginLeft: '30px' }}>Self Activity</b>
          <br />
          <Breadcrumb
            style={{ marginLeft: '30px' }}
            className="bread-tab"
            separator={<span className="breadcrumb-separator">|</span>}
            items={[
              {
                title: (
                  <Link
                    to={'/dashboard'}
                    className="bread-items text-decoration-none text-secondary"
                  >
                    Dashboard
                  </Link>
                ),
              },
              {
                title: (
                  <span className="text-secondary " style={{ cursor: 'default' }}>
                    Self Activity
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-secondary " style={{ cursor: 'default' }}>
                    Detail View
                  </span>
                ),
              },
            ]}
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol sm={6} style={{ padding: '20px 40px' }}>
          <CRow className="mb-4">
            <div style={{ height: '80%' }}>
              <Calendar
                cellRender={dateCellRender}
                onPanelChange={onPanelChange}
                headerRender={customFullHeaderRender}
                disabledDate={disabledDate}
                onSelect={onSelect}
              />
              <div
                className="fontSize-10px"
                style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
              >
                <div style={{ flex: 0.9 }}>
                  <Badge status="warning" /> &nbsp;Pending
                </div>
                <div style={{ flex: 1.0 }}>
                  <Badge status="success" /> &nbsp;Approved
                </div>
                <div style={{ flex: 0.9 }}>
                  <Badge status="error" /> &nbsp;Rejected
                </div>
                <div style={{ flex: 1.3 }}>
                  <Badge className="default2" status="error" /> &nbsp;Raised Request
                </div>
                <div style={{ flex: 1.1 }}>
                  <Badge status="default" /> &nbsp;Not Entered
                </div>
                <div style={{ flex: 0.5 }}>
                  <Badge className="default2" status="default" /> &nbsp;Leave
                </div>
              </div>
            </div>
          </CRow>
        </CCol>
        <CCol sm={6} style={{ padding: '20px 50px' }}>
          {selectedDate !== null &&
          memberIdRef.current !== '' &&
          setCellTypeRef.current === 'pending' ? (
            <PendingMemberActivity
              startDate={selectedDateRef.current}
              endDate={selectedDateRef.current}
              memberId={memberIdRef.current}
              memberName={memberNameRef.current}
              resetComponent={resetComponent}
              date={formatDates(selectedDateWithoutFormatRef.current)}
            />
          ) : selectedDate !== null &&
            memberIdRef.current !== '' &&
            setCellTypeRef.current === 'raisedrequest' ? (
            <RaiseRequestList
              startDate={selectedDateRef.current}
              endDate={selectedDateRef.current}
              memberId={memberIdRef.current}
              memberName={memberNameRef.current}
              resetComponent={resetComponent}
              date={formatDates(selectedDateWithoutFormatRef.current)}
            />
          ) : (
            <div style={{ marginTop: '98px' }}>
              <CRow>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span className="caln-text">Select a member & date to view their activity</span>
                </div>
              </CRow>
              <CRow>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <img src={activityImage} alt="img1" style={{ width: '250px', height: '250px' }} />
                </div>
              </CRow>
              <CRow>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <span className="caln-text">Nothing is selected</span>
                </div>
              </CRow>
            </div>
          )}
        </CCol>
      </CRow>
    </>
  )
}

export default ActivityCalendar
