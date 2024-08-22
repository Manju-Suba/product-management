import React, { useRef, useEffect, useState } from 'react'
import {
  CCol,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import PropTypes from 'prop-types'
import { getDecodeData, getHeaders } from '../../constant/Global'
import { Breadcrumb, Col, Row, Button, DatePicker } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import { Link } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import useAxios from 'src/constant/UseAxios'
import dayjs from 'dayjs'
const { RangePicker } = DatePicker

const ViewReport = ({
  close,
  name,
  id,
  titleList,
  today,
  formatDate,
  startDateValue,
  endDateValue,
}) => {
  let api = useAxios()
  const rangePickerRef = useRef()
  const [commonLoader, setCommonLoader] = useState(true)
  const [startDate, setStartDate] = useState(startDateValue)
  const [timesheetData, setTimesheetData] = useState([])
  const [endDate, setEndDate] = useState(endDateValue)
  const [loading, setLoading] = useState(false)
  const user = getDecodeData()
  const designation = user?.designation

  useEffect(() => {
    if (startDateValue && endDateValue) {
      getMyReport(
        dayjs(startDateValue).format('YYYY-MM-DD'),
        dayjs(endDateValue).format('YYYY-MM-DD'),
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDateValue, endDateValue])

  const handleStartDateChange = (date) => {
    setCommonLoader(true)
    setTimesheetData([])
    if (date) {
      setStartDate(date[0])
      setEndDate(date[1])
      getMyReport(dayjs(date[0]).format('YYYY-MM-DD'), dayjs(date[1]).format('YYYY-MM-DD'))
    }
  }

  const getMyReport = async (start, end) => {
    const url = `GenerateReport/id/${id}/date/${start}/${end}`

    await api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        // setTimesheetData(data)
        const groupedData = data.reduce((acc, curr) => {
          const activityDate = curr[0].activity_date // Assuming each inner array contains at least one record
          if (!acc[activityDate]) {
            acc[activityDate] = []
          }
          acc[activityDate].push(...curr)
          return acc
        }, {})
        setTimesheetData(groupedData)

        setCommonLoader(false)
      })
      .catch((error) => {
        //console.error('Error fetching data:', error)
      })
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

  const handleDownloadPDF = async () => {
    setLoading(true)
    const startDateConv = dayjs(startDate).format('YYYY-MM-DD')
    const endDateConv = dayjs(endDate).format('YYYY-MM-DD')
    const url = `GenerateReport/pdf/${id}/${startDateConv}/${endDateConv}`

    try {
      const response = await api.get(url, {
        headers: {
          'Content-Type': 'application/pdf',
        },
        responseType: 'arraybuffer',
      })
      // Create a Blob object from the binary data
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      // Create a link element and trigger the download
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = `Report_${startDate}_${endDate}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setLoading(false)
    } catch (error) {
      //console.error('Error fetching data:', error)
    }
  }

  // Check if timesheetData has any records from the current month
  const isCurrentOrPendingPreviousMonthData = () => {
    const currentMonth = dayjs().month()
    const currentYear = dayjs().year()

    let hasCurrentMonthData = false
    let hasPendingPreviousMonthData = false

    for (let date in timesheetData) {
      // const recordDate = dayjs(date)
      // if (recordDate.month() === currentMonth && recordDate.year() === currentYear) {
      //   hasCurrentMonthData = true
      // }
      if (timesheetData[date].some((record) => record.approveStatus === 'Pending')) {
        hasPendingPreviousMonthData = true
      } else if (timesheetData[date].some((record) => record.finalApprove === 'Pending')) {
        hasPendingPreviousMonthData = true
      } else if (timesheetData[date].some((record) => record.finalApprove === 'TL Approved')) {
        hasPendingPreviousMonthData = true
      } else if (
        timesheetData[date].some((record) => record.finalApprove === 'Supervisor Approved')
      ) {
        hasPendingPreviousMonthData = true
      } else if (
        timesheetData[date].some((record) => record.finalApprove === 'Supervisor Not Approved')
      ) {
        hasPendingPreviousMonthData = true
      } else if (
        timesheetData[date].some(
          (record) => record.finalApprove === 'Reject' || record.finalApprove === 'Rejected',
        ) ||
        timesheetData[date].some(
          (record) => record.approveStatus === 'Reject' || record.approveStatus === 'Rejected',
        )
      ) {
        hasPendingPreviousMonthData = true
      }
      if (designation?.includes('QA Admin')) {
        hasPendingPreviousMonthData = false
      }
    }
    return hasPendingPreviousMonthData
  }

  const ranges = {
    'Past 1 Week': [dayjs().subtract(6, 'days'), dayjs()],
    'Past 2 Weeks': [dayjs().subtract(13, 'days'), dayjs()],
    'Past 1 Month': [dayjs().subtract(1, 'months'), dayjs()],
    'Custom Range': [null, null], // Placeholder for custom range
  }

  // Function to convert time string to minutes
  const timeStringToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Function to convert minutes to time string
  const minutesToTimeString = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
  }

  return (
    <>
      <Row className="mt-3" gutter={16}>
        <Col sm={12}>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '35px' }}>
              <span
                className=""
                onClick={close}
                style={{ cursor: 'pointer', marginLeft: '15px', marginTop: '15px' }}
              >
                <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
              </span>
            </div>
            <CCol>
              <h6 className="product-heading" style={{ marginTop: '2%' }}>
                View <span style={{ color: '#E01B38' }}>{name}</span>
              </h6>
              <Breadcrumb
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
                        className="bread-items text-secondary second-subheading"
                        style={{ cursor: 'pointer' }}
                        onClick={close}
                      >
                        Report List
                      </span>
                    ),
                  },
                  {
                    title: (
                      <span
                        className="text-secondary second-subheading"
                        style={{ cursor: 'default' }}
                      >
                        Detail View
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>
          </div>
        </Col>
        <Col sm={2}></Col>
        <Col sm={6}>
          <RangePicker
            variant={'borderless'}
            style={{ width: '90%', marginTop: '15px' }}
            className="rangeField range-file-view report_datepicker"
            ranges={ranges}
            ref={rangePickerRef}
            defaultValue={[dayjs(startDate, 'YYYY-MM-DD'), dayjs(endDate, 'YYYY-MM-DD')]}
            onChange={handleStartDateChange}
            format="DD MMM,YYYY"
            allowClear={false}
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </Col>
        <Col sm={3}>
          <Button
            className=" submit-button-view save_changes"
            loading={loading}
            style={{
              cursor:
                Object.keys(timesheetData).length === 0 || isCurrentOrPendingPreviousMonthData()
                  ? 'not-allowed'
                  : 'pointer',
              fontSize: '13px',
              marginTop: '7px',
              width: '100%',
              color: 'white',
            }}
            type="button"
            disabled={
              Object.keys(timesheetData).length === 0 || isCurrentOrPendingPreviousMonthData()
            }
            onClick={() => handleDownloadPDF()}
          >
            <DownloadOutlined />
            Download
          </Button>
        </Col>
      </Row>
      <div className="table-container table_scroll" style={{ border: 'none', marginTop: '20px' }}>
        <CTable hover>
          <CTableHead className="head-row draft-head-row-ts">
            <CTableRow>
              <CTableHeaderCell
                className="table-head-productlist text-c text-center "
                scope="col"
                width="4%"
              >
                SI.No
              </CTableHeaderCell>
              <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="8%">
                Product
              </CTableHeaderCell>
              <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="8%">
                Task
              </CTableHeaderCell>
              <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="8%">
                No.of.Hours
              </CTableHeaderCell>
              <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="9%">
                Remarks
              </CTableHeaderCell>
              <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="9%">
                Supervisor
              </CTableHeaderCell>
              <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="10%">
                Supervisor Status
              </CTableHeaderCell>
              <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="11%">
                Supervisor Remarks
              </CTableHeaderCell>
              <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="9%">
                Final Approver
              </CTableHeaderCell>
              <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="12%">
                Final Approver Status
              </CTableHeaderCell>
              <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="8%">
                Final Remarks
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {!timesheetData ? (
              <div></div>
            ) : (
              Object.entries(timesheetData).map(([date, records], index) => {
                // Calculate subtotal minutes for each date
                const subtotalMinutes = records.reduce(
                  (sum, row) => sum + (row.hours ? timeStringToMinutes(row.hours) : 0),
                  0,
                )
                const subtotalTimeString = minutesToTimeString(subtotalMinutes)

                return (
                  <React.Fragment key={index}>
                    {/* Thick line row with activity_date */}
                    <CTableRow>
                      <CTableDataCell colSpan={11} className="height_date grid-cell">
                        <span
                          style={{
                            marginLeft: '12px',
                            color: 'grey',
                            fontSize: '12px',
                            letterSpacing: '0.3px',
                          }}
                        >
                          {formatDate(date)} - Subtotal Hours:{' '}
                          <span style={{ color: 'black', fontWeight: '700' }}>
                            {subtotalTimeString}
                          </span>
                        </span>
                      </CTableDataCell>
                    </CTableRow>
                    {/* Records for current activity_date */}
                    {records.map((row, rowIndex) => (
                      <CTableRow key={rowIndex}>
                        {/* Render your table data cells for each record */}
                        <CTableDataCell className="text-c text-center pd-text1 grid-cell">
                          {rowIndex + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.productName}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.task}
                        </CTableDataCell>
                        {/* Render other table data cells as needed */}
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.hours ? formatTimeDuration(row.hours) : '-'}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.description !== null ? row.description : '-'}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.approverName !== null ? row.approverName : '-'}
                        </CTableDataCell>
                        <CTableDataCell
                          className={`text-c grid-cell ${
                            row.approveStatus === 'Approved'
                              ? 'green-text1 '
                              : row.approveStatus === 'Pending'
                              ? 'warning-text1 '
                              : row.approveStatus === 'Not yet'
                              ? 'warning-text1 '
                              : row.approveStatus === 'Reject'
                              ? 'red-text1 '
                              : 'pd-text1'
                          }`}
                          width="10%"
                        >
                          <span>
                            {row.approveStatus === 'Approved' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {row.approveStatus === 'Pending' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {row.approveStatus === 'Not yet' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {row.approveStatus === 'Reject' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            <span style={{ marginLeft: '5px' }}>
                              {row.approveStatus === 'Reject'
                                ? 'Rejected'
                                : row.approveStatus
                                ? row.approveStatus
                                : '-'}
                            </span>
                          </span>
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.remarks ? row.remarks : '-'}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.finalName !== null ? row.finalName : '-'}
                        </CTableDataCell>
                        <CTableDataCell
                          className={`text-c grid-cell ${
                            row.finalApprove === 'Approved'
                              ? 'green-text1 '
                              : row.finalApprove === 'Pending' ||
                                row.finalApprove === 'Supervisor Approved' ||
                                row.finalApprove === 'TL Approved'
                              ? 'warning-text1 '
                              : row.finalApprove === 'Not Yet' ||
                                row.finalApprove === 'Supervisor Not Approved'
                              ? 'info-text1 '
                              : row.finalApprove === 'Reject'
                              ? 'red-text1 '
                              : 'pd-text1'
                          }`}
                          width="10%"
                        >
                          <span>
                            {row.finalApprove === 'Approved' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {(row.finalApprove === 'Pending' ||
                              row.finalApprove === 'Supervisor Approved' ||
                              row.finalApprove === 'TL Approved') && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {(row.finalApprove === 'Not Yet' ||
                              row.finalApprove === 'Supervisor Not Approved') && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {row.finalApprove === 'Reject' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            <span style={{ marginLeft: '5px' }}>
                              {row.finalApprove === 'Supervisor Approved' ||
                              row.finalApprove === 'TL Approved'
                                ? 'Pending'
                                : row.finalApprove === 'Supervisor Not Approved'
                                ? 'Not Yet'
                                : row.finalApprove
                                ? row.finalApprove
                                : '-'}
                            </span>
                          </span>
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell">
                          {row.remarks ? row.remarks : '-'}
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </React.Fragment>
                )
              })
            )}
          </CTableBody>
        </CTable>

        {(Object.keys(timesheetData).length === 0 && !commonLoader) ||
        (timesheetData === undefined && !commonLoader) ||
        (timesheetData.length === 0 && !commonLoader) ? (
          <div className="text-c text-center my-3 td-text">No Data Found</div>
        ) : commonLoader ? (
          <div className="text-c text-center my-3 td-text">
            <CSpinner color="danger" />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  )
}
ViewReport.propTypes = {
  close: PropTypes.func,
  name: PropTypes.string,
  id: PropTypes.number,
  titleList: PropTypes.string,
  today: PropTypes.string,
  formatDate: PropTypes.func,
  startDateValue: PropTypes.any,
  endDateValue: PropTypes.any,
}
export default ViewReport
