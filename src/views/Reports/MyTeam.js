import React, { useState, useEffect, useRef } from 'react'
import { Select, Breadcrumb, DatePicker, Checkbox, Popconfirm, Skeleton } from 'antd'
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
import { getHeaders, ImageUrl } from 'src/constant/Global'
import profileImage1 from '../../assets/images/avatars/wrapper.png'
import PropTypes from 'prop-types'
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs'
import useAxios from 'src/constant/UseAxios'
import DownloadSvg from '../svgImages/DownloadSvg'
import 'react-datepicker/dist/react-datepicker.css'
import { DownloadOutlined, EyeFilled } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import ViewReport from './ViewReport'
import { Link } from 'react-router-dom'
import Downarrowimg from '../../assets/images/downarrow.png'
import { toPascalCase } from '../../constant/TimeUtils'

const { RangePicker } = DatePicker

const MyTeam = ({ today, formatDate }) => {
  let api = useAxios()
  const rangePickerRef = useRef()
  const [commonLoader, setCommonLoader] = useState(true)
  const [headerLabel, setHeaderLabel] = useState('')
  const hasMoreRef = useRef(true)
  const [timesheetData, setTimesheetData] = useState([])
  const pageRef = useRef(0)
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const startDateRef = useRef(today)
  const endDateRef = useRef(today)
  const [memberList, setMemberList] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [ids, setIds] = useState(0)
  const [names, setNames] = useState('')
  const [reportVisble, setReportVisible] = useState(false)
  const [abortController, setAbortController] = useState(new AbortController())
  const [memberLoader, setMemberLoader] = useState(false)
  const rolestatus = useRef('all')
  const memberIdRef = useRef(0)
  const sizeRef = useRef(1)

  useEffect(() => {
    // if (!reportVisble) {
    hasMoreRef.current = true
    getAllReport(startDateRef.current, endDateRef.current)
    setMemberLoader(true)
    getMemberList()
    const tableContainer = document.querySelector('.table-container')
    tableContainer.addEventListener('scroll', handleScroll)
    return () => {
      tableContainer.removeEventListener('scroll', handleScroll)
    }
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleStartDateChange = (date) => {
    pageRef.current = 0
    hasMoreRef.current = true
    if (date) {
      setStartDate(date[0])
      setEndDate(date[1])
      startDateRef.current = dayjs(date[0]).format('YYYY-MM-DD')
      endDateRef.current = dayjs(date[1]).format('YYYY-MM-DD')
      getAllReport(dayjs(date[0]).format('YYYY-MM-DD'), dayjs(date[1]).format('YYYY-MM-DD'))
    }
  }

  const handleroletypeChange = (value) => {
    if (value === undefined) {
      rolestatus.current = 'all'
    } else {
      rolestatus.current = value
    }
    getMemberList()
    pageRef.current = 0
    sizeRef.current = 1
    getAllReport(startDateRef.current, endDateRef.current)
  }

  const getMemberList = async () => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setMemberList([])
      if (abortController) {
        abortController.abort()
      }
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    const url = `GenerateReport/contractmembers?roletype=${rolestatus.current}`
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
            {' '}
            {user.name}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))
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

  const getAllReport = async (start, end) => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setTimesheetData([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    const url = `GenerateReport/Supervisorcontract/daterange/${start}/${end}/${pageRef.current}/${sizeRef.current}?userid=${memberIdRef.current}&roletype=${rolestatus.current}`

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data

      if (pageRef.current === 0) setTimesheetData(data)
      else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
      if (data.length < 10) {
        hasMoreRef.current = false
      }

      // Increment the page number for the next fetch
      pageRef.current = pageRef.current + 1
      setCommonLoader(false)
    } catch (error) {
      //console.error('Error fetching data:', error)
      // Handle error, if any
    }
  }
  const handleScroll = () => {
    const tableContainer = document.querySelector('.table-container')
    if (tableContainer.scrollTop + tableContainer.clientHeight === tableContainer.scrollHeight) {
      if (hasMoreRef.current === true) {
        getAllReport(startDateRef.current, endDateRef.current)
      }
    }
  }
  const handleHeaderCheck = (isChecked) => {
    if (isChecked) {
      const approvedRowIds = timesheetData
        .filter((row) => row.finalApprove === 'Approved')
        .map((row) => row.id)
      if (approvedRowIds.length !== 0) {
        setHeaderLabel(`${approvedRowIds.length} Selected`)
        setSelectedRows(approvedRowIds)
      }
    } else {
      setSelectedRows([])
      setHeaderLabel('')
    }
  }
  const handleMember = (value) => {
    if (value) sizeRef.current = 20
    else sizeRef.current = 1
    const ids = Number(memberList.find((user) => user.name === value)?.id || '')
    pageRef.current = 0
    hasMoreRef.current = true
    memberIdRef.current = ids
    getAllReport(startDateRef.current, endDateRef.current)
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
  const ranges = {
    'Past 1 Week': [dayjs().subtract(6, 'days'), dayjs()],
    'Past 2 Weeks': [dayjs().subtract(13, 'days'), dayjs()],
    'Past 1 Month': [dayjs().subtract(1, 'months'), dayjs()],
    'Custom Range': [null, null], // Placeholder for custom range
  }
  const handleDownloadExcel = async (id, date) => {
    const url = `GenerateReport/generate/${id}/${date}`

    try {
      const response = await api.get(url, {
        headers: {
          'Content-Type': 'application/octet-stream',
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
      link.download = `Report_${date}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      //console.error('Error fetching data:', error)
    }
  }
  const handleDownloadPDF = async (id, date) => {
    const url = `GenerateReport/pdf/${id}/${date}`

    try {
      const response = await api.get(url, {
        headers: {
          'Content-Type': 'application/octet-stream',
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
      link.download = `Report_${date}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      //console.error('Error fetching data:', error)
    }
  }
  const handleDownloadPDFAll = async () => {
    const startDateConv = dayjs(startDate).format('YYYY-MM-DD')
    const endDateConv = dayjs(endDate).format('YYYY-MM-DD')
    // http://localhost:8080/api/GenerateReport/contractpdf/111,112/2024-02-01/2024-02-02
    const url = `GenerateReport/contractpdf/${selectedRows}/${startDateConv}/${endDateConv}`

    try {
      const response = await api.get(url, {
        headers: {
          'Content-Type': 'application/octet-stream',
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
    } catch (error) {
      //console.error('Error fetching data:', error)
    }
  }
  const resetComponent = () => {
    setReportVisible(false)
    memberIdRef.current = 0
    sizeRef.current = 1
    pageRef.current = 0
    getAllReport(startDateRef.current, endDateRef.current)
  }
  // const member
  return (
    <>
      {reportVisble ? (
        <ViewReport
          id={ids}
          name={names}
          titleList="Detail View"
          today={today}
          startDateValue={startDate}
          endDateValue={endDate}
          close={resetComponent}
          formatDate={formatDate}
        />
      ) : (
        <>
          <CRow className="mt-3">
            <CCol xs={7} sm={5} md={6}>
              <b style={{ paddingLeft: '30px' }}>My Team</b>
              <br />
              <Breadcrumb
                style={{ paddingLeft: '30px' }}
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
                        My Team
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>
            <CCol className="report_myTeam" xs={12} sm={4} md={3}>
              {/* <RangePicker
                style={{ width: '94%' }}
                className="rangeField"
                ref={rangePickerRef}
                defaultValue={[dayjs(startDate, 'YYYY-MM-DD'), dayjs(endDate, 'YYYY-MM-DD')]}
                onChange={handleStartDateChange}
                format="DD MMM,YYYY"
                allowClear={false}
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              /> */}
              <RangePicker
                variant={'borderless'}
                ranges={ranges}
                style={{ width: '90%' }}
                ref={rangePickerRef}
                className="rangeField_report  report_datepicker_myteam "
                onChange={handleStartDateChange}
                defaultValue={[dayjs(startDate, 'YYYY-MM-DD'), dayjs(endDate, 'YYYY-MM-DD')]}
                calendar="date"
                format="DD MMM,YYYY"
                allowClear={false}
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </CCol>

            <CCol xs={12} sm={2} md={1} className="report_myTeam">
              <Select
                className="choose_mem_report "
                id="member-list"
                onChange={(value) => handleroletypeChange(value)}
                options={[
                  {
                    value: 'ON Role',
                    label: 'ON Role',
                  },
                  {
                    value: 'Contract',
                    label: 'Contract',
                  },
                ]}
                placeholder="Choose Role Type"
                allowClear
                showSearch
                style={{ width: '-webkit-fill-available' }}
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt={Downarrowimg}
                    style={{ width: '10px', height: '6px' }}
                  />
                }
              />
            </CCol>

            {/* Member&rsquo;s */}
            <CCol xs={12} sm={2} md={2} className="report_myTeam">
              <Select
                className=" custom-select_report"
                id="member-list"
                // value={memberOptions.find((option) => option.value === memberName) || null}
                onChange={handleMember}
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
                placeholder="Choose Member"
                allowClear
                showSearch
                style={{ width: '-webkit-fill-available' }}
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt={Downarrowimg}
                    style={{ width: '12px', height: '7px' }}
                  />
                }
              />
            </CCol>
          </CRow>

          <div className="table-container table_scroll_report" style={{ border: 'none' }}>
            <InfiniteScroll
              dataLength={timesheetData.length}
              next={handleScroll} // Function to call when reaching the end of the list
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
                  {!headerLabel ? (
                    <CTableRow>
                      <CTableHeaderCell
                        className="table-head-draft text-center text-c grid-cell-header"
                        scope="col"
                        width="4%"
                        style={{ position: 'sticky', top: '0', zIndex: '12' }}
                      >
                        <Checkbox
                          id="flexCheckDefault"
                          className="checkbox_design"
                          checked={
                            selectedRows.length === timesheetData.length && timesheetData.length
                          }
                          onChange={(e) => handleHeaderCheck(e.target.checked)}
                        />
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="table-head-productlist text-c text-center "
                        scope="col"
                        width="4%"
                      >
                        SI.No
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="table-head-productlist text-c "
                        scope="col"
                        width="7%"
                      >
                        Branch
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="table-head-productlist text-c"
                        scope="col"
                        width="8%"
                      >
                        Activity Date
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="table-head-productlist text-c"
                        scope="col"
                        width="10%"
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
                      <CTableHeaderCell
                        className="table-head-productlist text-c"
                        scope="col"
                        width="10%"
                      >
                        Date of Joining
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="table-head-productlist text-c"
                        scope="col"
                        width="8%"
                      >
                        Tot.of.hrs
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
                        width="5%"
                      >
                        Action
                      </CTableHeaderCell>
                    </CTableRow>
                  ) : (
                    <CTableRow>
                      <CTableHeaderCell
                        className="table-head-selected text-center  text-c "
                        width="4%"
                      >
                        <Checkbox
                          id="flexCheckDefault"
                          className="checkbox_design"
                          checked={
                            selectedRows.length === timesheetData.length && timesheetData.length
                          }
                          onChange={(e) => handleHeaderCheck(e.target.checked)}
                        />
                      </CTableHeaderCell>
                      <CTableDataCell className="table-head-selected" colSpan={8}>
                        <span style={{ color: '#f50505' }}>{headerLabel}</span>
                      </CTableDataCell>
                      <CTableDataCell className="table-head-selected">
                        <button
                          className="btn border-0 text-c text-secondary cross-button"
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                          onClick={handleDownloadPDFAll}
                        >
                          <DownloadSvg height="18" width="18" viewBox="0 0 18 18" fill="#f50505" />
                        </button>
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableHead>
                <CTableBody>
                  {!timesheetData ? (
                    <div></div>
                  ) : (
                    timesheetData.map((row, index) => (
                      <CTableRow key={index}>
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
                            disabled={row.final_Approve !== 'Approved'}
                            checked={
                              selectedRows.includes(row.id) && row.final_Approve === 'Approved'
                            }
                            onChange={(e) => {
                              handleMemberCheck(row.id, e.target.checked)
                            }}
                          />
                        </CTableDataCell>
                        <CTableDataCell
                          className="text-c text-center pd-text1 grid-cell"
                          width="4%"
                        >
                          {index + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell" width="7%">
                          {row.branch}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell" width="8%">
                          {formatDate(row.activityDate)}
                        </CTableDataCell>
                        <CTableDataCell className=" text-c pd-text1 grid-cell" width="10%">
                          {row.supervisor_name !== null ? toPascalCase(row.supervisor_name) : '-'}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell" width="10%">
                          {toPascalCase(row.name)}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell" width="10%">
                          {formatDate(row.date_of_joining)}
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell" width="8%">
                          {row.hours ? formatTimeDuration(row.hours) : '-'}
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
                          width="10%"
                          className={`text-c grid-cell ${
                            row.final_Approve === 'Approved'
                              ? 'green-text1 '
                              : row.final_Approve === 'Pending'
                              ? 'warning-text1 '
                              : row.final_Approve === 'Not yet'
                              ? 'warning-text1 '
                              : row.final_Approve === 'Reject'
                              ? 'red-text1 '
                              : 'pd-text1'
                          }`}
                          // width="10%"
                        >
                          <span>
                            {row.final_Approve === 'Approved' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {row.final_Approve === 'Pending' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {row.final_Approve === 'Not yet' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            {row.final_Approve === 'Reject' && (
                              <span style={{ fontSize: '16px' }}>&#8226;</span>
                            )}
                            <span style={{ marginLeft: '5px' }}>
                              {row.final_Approve ? row.final_Approve : '-'}
                            </span>
                          </span>
                        </CTableDataCell>
                        <CTableDataCell className="text-c pd-text1 grid-cell" width="8%">
                          <Popconfirm
                            title="Choose download format:"
                            okText="Excel"
                            cancelText="PDF"
                            placement="left"
                            onConfirm={() => handleDownloadExcel(row.id, row.activityDate)}
                            onCancel={() => handleDownloadPDF(row.id, row.activityDate)}
                            disabled={row.final_Approve !== 'Approved'}
                          >
                            <button
                              className={`btn border-0 text-c text-secondary cross-button ${
                                row.final_Approve !== 'Approved' ? 'cursor_imp' : ''
                              }`}
                              style={{
                                fontSize: '12px',
                                padding: '4px 8px',
                                cursor:
                                  row.final_Approve !== 'Approved' ? 'not-allowed' : 'pointer',
                              }}
                              onClick={() => {
                                // handleButtonClick('Reject')
                              }}
                            >
                              <DownloadOutlined />
                            </button>
                          </Popconfirm>
                          <button
                            className="btn border-0 text-c text-secondary cross-button"
                            style={{
                              fontSize: '12px',
                              padding: '4px 8px',
                            }}
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

MyTeam.propTypes = {
  today: PropTypes.string,
  formatDate: PropTypes.func,
}
export default MyTeam
