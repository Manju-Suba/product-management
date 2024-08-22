import React, { useState, useEffect, useRef } from 'react'
import { Breadcrumb, DatePicker } from 'antd'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CRow,
  CCol,
} from '@coreui/react'
import { getHeaders } from 'src/constant/Global'
import PropTypes from 'prop-types'
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs'
import useAxios from 'src/constant/UseAxios'
import 'react-datepicker/dist/react-datepicker.css'
import { EyeFilled } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import ViewReport from './ViewReport'
import { Link } from 'react-router-dom'

const { RangePicker } = DatePicker
const MyReport = ({ today, formatDate }) => {
  let api = useAxios()
  const rangePickerRef = useRef()
  const [timesheetData, setTimesheetData] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  // const [hasMore, setHasMore] = useState(true)
  const hasMoreRef = useRef(true)
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)

  const pageRef = useRef(1)
  const startDateRef = useRef(today)
  const [reportVisble, setReportVisible] = useState(false)
  const [ids, setIds] = useState(0)
  const [names, setNames] = useState('')
  const endDateRef = useRef(today)
  const [abortController, setAbortController] = useState(new AbortController())

  useEffect(() => {
    if (!reportVisble) {
      getAllReport()
      hasMoreRef.current = true
      const tableContainer = document.querySelector('.table-container')
      tableContainer.addEventListener('scroll', handleScroll)
      return () => {
        tableContainer.removeEventListener('scroll', handleScroll)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportVisble])
  const handleScroll = () => {
    const tableContainer = document.querySelector('.table-container')
    if (tableContainer.scrollTop + tableContainer.clientHeight === tableContainer.scrollHeight) {
      if (hasMoreRef.current === true) {
        getAllReport()
      }
    }
  }
  const handleStartDateChange = (date) => {
    if (date) {
      setStartDate(date[0])
      setEndDate(date[1])
      startDateRef.current = dayjs(date[0]).format('YYYY-MM-DD')
      endDateRef.current = dayjs(date[1]).format('YYYY-MM-DD')
      pageRef.current = 1
      hasMoreRef.current = true
      getAllReport(dayjs(date[0]).format('YYYY-MM-DD'), dayjs(date[1]).format('YYYY-MM-DD'))
    }
  }

  const getAllReport = async () => {
    let newAbortController
    if (pageRef.current === 1) {
      setCommonLoader(true)
      setTimesheetData([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    let url = `GenerateReport/contract/${startDateRef.current}/${endDateRef.current}/${pageRef.current}/20`

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data

      if (pageRef.current === 1) setTimesheetData(data)
      else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
      if (data.length < 10) {
        hasMoreRef.current = false
      }

      // Increment the page number for the next fetch
      pageRef.current = pageRef.current + 1
      setCommonLoader(false)
    } catch (error) {
      // console.error('Error fetching data:', error)
      // Handle error, if any
    }
  }
  const formatTimeDuration = (timeString) => {
    if (timeString !== '' && timeString !== null) {
      const [hours, minutes] = timeString.split(':').map(Number)
      let formattedTime = ''
      if (hours > 0) {
        formattedTime += `${hours} hrs`
      }
      if (minutes > 0) {
        formattedTime += ` ${minutes} mins`
      }
      return formattedTime.trim()
    } else {
      return '-'
    }
  }
  const resetComponent = () => {
    setReportVisible(false)
  }
  const ranges = {
    'Past 1 Week': [dayjs().subtract(6, 'days'), dayjs()],
    'Past 2 Weeks': [dayjs().subtract(13, 'days'), dayjs()],
    'Past 1 Month': [dayjs().subtract(1, 'months'), dayjs()],
    'Custom Range': [null, null], // Placeholder for custom range
  }
  return (
    <>
      {reportVisble ? (
        <ViewReport
          id={ids}
          name={names}
          titleList="Detail View"
          today={today}
          close={resetComponent}
          formatDate={formatDate}
          startDateValue={startDate}
          endDateValue={endDate}
        />
      ) : (
        <>
          <CRow className="mt-3">
            <CCol sm={9}>
              <b style={{ marginLeft: '30px' }}>My Report</b>
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
                        My Report
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>
            <CCol sm={3}>
              <RangePicker
                style={{ width: '80%' }}
                ranges={ranges}
                className="rangeField rangepicker_cont_pend"
                ref={rangePickerRef}
                defaultValue={[dayjs(startDate, 'YYYY-MM-DD'), dayjs(endDate, 'YYYY-MM-DD')]}
                onChange={handleStartDateChange}
                allowClear={false}
                format="DD MMM,YYYY"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </CCol>
          </CRow>

          <div className="table-container table_scroll_report" style={{ border: 'none' }}>
            <InfiniteScroll
              dataLength={timesheetData.length}
              next={handleScroll}
              hasMore={hasMoreRef.current}
              loader={
                <div className="text-c text-center my-3 td-text">
                  <CSpinner color="danger" />
                </div>
              }
              endMessage={
                timesheetData.length !== 0 && (
                  <p style={{ textAlign: 'center' }}>
                    <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
                  </p>
                )
              }
            >
              <CTable hover>
                <CTableHead className="head-row draft-head-row-ts">
                  <CTableRow>
                    <CTableHeaderCell
                      className="table-head-productlist text-c text-center"
                      scope="col"
                      width="4%"
                    >
                      SI.No
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Activity Date
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Branch
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="8%"
                    >
                      Supervisor Name
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Username
                    </CTableHeaderCell>
                    {/* <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Date of Joining
                    </CTableHeaderCell> */}
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Tot.of.Hrs
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Approver Status
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Final Approver Status
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Action
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {!timesheetData ? (
                    <div></div>
                  ) : (
                    timesheetData.map((row, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="text-c text-center pd-text1 grid-cell">
                          {index + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.activityDate !== null ? formatDate(row.activityDate) : '-'}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.branch}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.supervisor_name !== null ? row.supervisor_name : '-'}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.name !== null ? row.name : '-'}
                        </CTableDataCell>
                        {/* <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.date_of_joining !== null ? formatDate(row.date_of_joining) : '-'}
                        </CTableDataCell> */}
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.hours === null ? '-' : formatTimeDuration(row.hours)}
                        </CTableDataCell>
                        <CTableDataCell
                          className={`text-c grid-cell ${
                            row.supervisorStatus === 'Approved'
                              ? 'green-text1 '
                              : row.supervisorStatus === 'Rejected' ||
                                row.supervisorStatus === 'Reject'
                              ? 'red-text1 '
                              : row.supervisorStatus === 'Pending'
                              ? 'warning-text1'
                              : 'pd-text1'
                          }`}
                          width="10%"
                        >
                          <span>
                            {row.supervisorStatus === 'Approved' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {(row.supervisorStatus === 'Rejected' ||
                              row.supervisorStatus === 'Reject') && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {row.supervisorStatus === 'Pending' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            <span style={{ marginLeft: '5px' }}>
                              {row.supervisorStatus === 'Reject'
                                ? 'Rejected'
                                : row.supervisorStatus
                                ? row.supervisorStatus
                                : '-'}
                            </span>
                          </span>
                        </CTableDataCell>
                        <CTableDataCell
                          className={`text-c grid-cell ${
                            row.final_Approve === 'Approved'
                              ? 'green-text1 '
                              : row.final_Approve === 'Rejected'
                              ? 'red-text1 '
                              : row.final_Approve === 'Not yet'
                              ? 'warning-text1'
                              : 'pd-text1'
                          }`}
                          width="10%"
                        >
                          <span>
                            {row.final_Approve === 'Approved' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {row.final_Approve === 'Rejected' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {row.final_Approve === 'Not yet' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            <span style={{ marginLeft: '5px' }}>
                              {row.final_Approve ? row.final_Approve : '-'}
                            </span>
                          </span>
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          <button
                            className="btn border-0 text-c text-secondary cross-button"
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                            onClick={() => {
                              setIds(row.id)
                              setNames(row.name)
                              setReportVisible(true)
                            }}
                          >
                            <EyeFilled />
                          </button>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>

              {(timesheetData === null && !commonLoader) ||
              (timesheetData.length === 0 && !commonLoader) ? (
                <div className="text-c text-center my-3 td-text">No Data Found</div>
              ) : commonLoader && timesheetData.length === 0 ? (
                <div className="text-c text-center my-3 td-text">
                  <CSpinner color="danger" />
                </div>
              ) : (
                <div></div>
              )}
            </InfiniteScroll>
          </div>
        </>
      )}
    </>
  )
}

MyReport.propTypes = {
  today: PropTypes.string,
  formatDate: PropTypes.func,
}
export default MyReport
