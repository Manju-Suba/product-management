import React, { useState, useEffect, useRef } from 'react'
import { Select, Breadcrumb, DatePicker, Button, Skeleton } from 'antd'
import {
  CCol,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CRow,
} from '@coreui/react'
import { getHeaders, ImageUrl } from 'src/constant/Global'
import profileImage1 from '../../assets/images/avatars/wrapper.png'
import PropTypes from 'prop-types'
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs'
import useAxios from 'src/constant/UseAxios'
import { DownloadOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component'
import Downarrowimg from '../../assets/images/downarrow.png'
import { toPascalCase } from '../../constant/TimeUtils'
import { Link } from 'react-router-dom'
const { RangePicker } = DatePicker
const AllReport = ({ today, formatDate, status }) => {
  let api = useAxios()
  const [activeTab] = useState(status)
  const [supervisorId, setSupervisorId] = useState(0)
  const [supervisorName, setSupervisorName] = useState('')
  const [memberId, setMemberId] = useState(0)
  const [memberName, setMemberName] = useState('')
  const [timesheetData, setTimesheetData] = useState([])
  const [supervisorList, setsupervisorList] = useState([])
  const [memberList, setMemberList] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  const [loading, setLoading] = useState(false)
  // const [hasMore, setHasMore] = useState(true)
  const hasMoreRef = useRef(true)
  const pageRef = useRef(1)
  const supervisorIdRef = useRef(0)
  const dateWiseRef = useRef(today)
  // const companyIdRef = useRef(null)
  const memberIdRef = useRef(0)
  const rangePickerRef = useRef()
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const startDateRef = useRef(today)
  const endDateRef = useRef(today)
  const [abortController, setAbortController] = useState(new AbortController())
  const [abortControllerSupervisor, setAbortControllerSupervisor] = useState(new AbortController())
  const [suprLoader, setSuprLoader] = useState(false)
  const [memberLoader, setMemberLoader] = useState(false)
  const statusRef = useRef('all')
  const companyRef = useRef('')

  useEffect(() => {
    getAllReport(startDateRef.current, endDateRef.current)
    hasMoreRef.current = true
    setSuprLoader(true)
    getSupervisorList()
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
        if (supervisorIdRef.current !== 0 && memberIdRef.current === 0) {
          getReport(
            dayjs(startDateRef.current).format('YYYY-MM-DD'),
            dayjs(endDateRef.current).format('YYYY-MM-DD'),
            supervisorIdRef.current,
          )
        } else if (memberIdRef.current !== 0) {
          getMemberReport(
            dayjs(startDateRef.current).format('YYYY-MM-DD'),
            dayjs(endDateRef.current).format('YYYY-MM-DD'),
            memberId,
          )
        } else if (memberIdRef.current === 0 && supervisorIdRef.current === 0) {
          getAllReport(
            dayjs(startDateRef.current).format('YYYY-MM-DD'),
            dayjs(endDateRef.current).format('YYYY-MM-DD'),
          )
        }
      }
    }
  }

  const getSupervisorList = async (value) => {
    const url = value !== undefined ? `user/supervisorlist?company=${value}` : `user/supervisorlist`
    // const url = `user/supervisorlist?company=${value}`
    await api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const supervisor = response.data.data
        setsupervisorList(supervisor)
        setSuprLoader(false)
      })
      .catch((error) => {
        //console.error('Error fetching data:', error)
      })
  }

  const getMemberList = async (id) => {
    let newAbortController
    if (pageRef.current === 1) {
      setCommonLoader(true)
      setMemberList([])
      if (abortController) {
        abortController.abort()
      }
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    const url = `user/supervisor/${id}`
    await api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        const member = response.data.data
        setMemberList(member)
        setCommonLoader(false)
        setMemberLoader(false)
      })
      .catch((error) => {
        //console.error('Error fetching data:', error)
      })
  }

  //supervisor option
  const options = supervisorList.map((user) => ({
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
            {toPascalCase(user.name)}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))

  //member option
  const options1 = memberList.map((user) => ({
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
            {toPascalCase(user.name)}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))
  const getAllReport = async (start, end, company) => {
    let newAbortController
    if (pageRef.current === 1) {
      setCommonLoader(true)
      setTimesheetData([])
      if (abortController) {
        abortController.abort()
      }
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    let url =
      companyRef.current === ''
        ? `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/10`
        : `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/10?company=${companyRef.current}`

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data.content

      if (pageRef.current === 1) setTimesheetData(data)
      else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
      if (data.length < 10) {
        hasMoreRef.current = false
      }

      // Increment the page number for the next fetch
      pageRef.current = pageRef.current + 1
      setCommonLoader(false)
    } catch (error) {
      //console.error('Error fetching data:', error)
    }
  }

  //getallreports based on company
  const getAllReportbasedCompany = async (start, end, value) => {
    let newAbortController
    if (pageRef.current === 1) {
      setCommonLoader(true)
      setTimesheetData([])
      if (abortController) {
        abortController.abort()
      }
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    const url =
      value !== undefined
        ? `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/10?company=${value}`
        : `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/10`
    // let url = `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/10?company=${companyIdRef.current}`

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data.content

      if (pageRef.current === 1) setTimesheetData(data)
      else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
      if (data.length < 10) {
        hasMoreRef.current = false
      }

      // Increment the page number for the next fetch
      pageRef.current = pageRef.current + 1
      setCommonLoader(false)
    } catch (error) {
      //console.error('Error fetching data:', error)
    }
  }

  const handleSupervisorChange = (selectedOption) => {
    if (selectedOption) {
      pageRef.current = 1
      hasMoreRef.current = true
      setMemberName('')
      setMemberId(0)
      setTimesheetData([])
      setCommonLoader(true)
      setMemberList([])
      memberIdRef.current = 0
      const newValue = selectedOption
      const names = Number(supervisorList.find((user) => user.name === newValue)?.id || '')
      setSupervisorName(newValue)
      setSupervisorId(names)
      supervisorIdRef.current = names
      getReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        names,
      )
      setMemberLoader(true)
      getMemberList(names)
    } else {
      setSupervisorName('')
      setSupervisorId(0)
      setTimesheetData([])
      setCommonLoader(true)
      supervisorIdRef.current = 0
      hasMoreRef.current = true
      pageRef.current = 1
      setMemberList([])
      getAllReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
      )
    }
  }
  const getReport = async (start, end, id) => {
    let newAbortController
    if (pageRef.current === 1) {
      setCommonLoader(true)
      setTimesheetData([])
      if (abortControllerSupervisor) {
        abortControllerSupervisor.abort()
      }
      newAbortController = new AbortController()
      setAbortControllerSupervisor(newAbortController)
    }
    let url = `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/10?supervisorId=${id}`
    await api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        const data = response.data.data.content
        if (pageRef.current === 1) setTimesheetData(data)
        else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
        if (data.length < 10) {
          hasMoreRef.current = false
        }
        pageRef.current = pageRef.current + 1
        setCommonLoader(false)
      })
      .catch((error) => {
        //console.error('Error fetching data:', error)
      })
  }
  const handleMemberChange = (selectedOption) => {
    if (selectedOption) {
      const newValue = selectedOption
      const names = Number(memberList.find((user) => user.name === newValue)?.id || '')
      setMemberName(newValue)
      setMemberId(names)
      setTimesheetData([])
      setCommonLoader(true)
      pageRef.current = 1
      hasMoreRef.current = true
      memberIdRef.current = names
      getMemberReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        names,
      )
    } else {
      setMemberName('')
      setMemberId(0)
      setTimesheetData([])
      setCommonLoader(true)
      hasMoreRef.current = true
      memberIdRef.current = 0
      pageRef.current = 1
      getReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        supervisorId,
      )
    }
  }
  const getMemberReport = async (start, end, id) => {
    let newAbortController
    if (pageRef.current === 1) {
      setCommonLoader(true)
      setTimesheetData([])
      if (abortController) {
        abortController.abort()
      }
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    let url = `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/10?memberId=${id}`
    await api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        const data = response.data.data.content
        if (pageRef.current === 1) setTimesheetData(data)
        else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
        if (data.length < 10) {
          hasMoreRef.current = false
        }
        pageRef.current = pageRef.current + 1
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
  const handleDownload = async (status, date, supId, memId) => {
    setLoading(true)
    const from = dayjs(startDate).format('YYYY-MM-DD')
    const to = dayjs(endDate).format('YYYY-MM-DD')
    const url =
      companyRef.current === ''
        ? `GenerateReport/downloadExcel?fromDate=${from}&toDate=${to}&status=${statusRef.current}&supervisorid=${supId}&memberid=${memId}`
        : `GenerateReport/downloadExcel?fromDate=${from}&toDate=${to}&companyid=${companyRef.current}&status=${statusRef.current}&supervisorid=${supId}&memberid=${memId}`

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
      link.download = `${status}_details_${date}.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setLoading(false) // Set loading to false regardless of success or error
    } catch (error) {
      //console.error('Error fetching data:', error)
    }
  }

  const handleStartDateChange = (date) => {
    if (date) {
      pageRef.current = 1
      hasMoreRef.current = true
      supervisorIdRef.current = 0
      memberIdRef.current = 0
      setMemberName('')
      setMemberId(0)
      setSupervisorName('')
      setSupervisorId(0)
      setTimesheetData([])
      setCommonLoader(true)
      setMemberList([])
      setStartDate(date[0])
      setEndDate(date[1])
      startDateRef.current = date[0]
      endDateRef.current = date[1]
      getAllReport(dayjs(date[0]).format('YYYY-MM-DD'), dayjs(date[1]).format('YYYY-MM-DD'))
    }
  }

  const ranges = {
    'Past 1 Week': [dayjs().subtract(6, 'days'), dayjs()],
    'Past 2 Weeks': [dayjs().subtract(13, 'days'), dayjs()],
    'Past 1 Month': [dayjs().subtract(1, 'months'), dayjs()],
    'Custom Range': [null, null], // Placeholder for custom range
  }

  const handleStatusChange = (value) => {
    if (value === undefined) {
      statusRef.current = 'all'
    } else {
      statusRef.current = value
    }
    pageRef.current = 1
    hasMoreRef.current = true
    if (memberIdRef.current === 0 && supervisorIdRef.current === 0) {
      getAllReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
      )
    } else if (memberIdRef.current === 0 && supervisorIdRef.current !== 0) {
      getReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        supervisorIdRef.current,
      )
    } else if (memberIdRef.current !== 0 && supervisorIdRef.current !== 0) {
      getMemberReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        memberIdRef.current,
      )
    }
  }
  const handleCompanyChange = (value) => {
    getSupervisorList(value)
    companyRef.current = value
    pageRef.current = 1
    hasMoreRef.current = true
    if (memberIdRef.current === 0 && supervisorIdRef.current === 0) {
      getAllReportbasedCompany(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        value,
      )
    } else if (memberIdRef.current === 0 && supervisorIdRef.current !== 0) {
      getReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        supervisorIdRef.current,
      )
    } else if (memberIdRef.current !== 0 && supervisorIdRef.current !== 0) {
      getMemberReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        memberIdRef.current,
      )
    }
  }

  return (
    <>
      <CRow className="mt-3">
        <CCol sm={2} md={2} lg={2} xl={2}>
          <b style={{ paddingLeft: '30px' }}>{activeTab}</b>
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
                    All Report
                  </span>
                ),
              },
            ]}
          />
        </CCol>
        <CCol sm={2} md={2} lg={2} xl={2}>
          <RangePicker
            variant="borderless"
            ranges={ranges}
            style={{ width: '94%' }}
            ref={rangePickerRef}
            className="rangeField report_rangepicker"
            onChange={handleStartDateChange}
            defaultValue={[dayjs(startDate, 'YYYY-MM-DD'), dayjs(endDate, 'YYYY-MM-DD')]}
            calendar="date"
            format="DD MMM,YY"
            allowClear={false}
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </CCol>

        <CCol sm={2} md={1} lg={1} xl={1} style={{ padding: '0px' }}>
          <Select
            className="choose_mem_report "
            id="member-list"
            onChange={(value) => handleCompanyChange(value)}
            options={[
              {
                value: 'hepl',
                label: 'HEPL',
              },
              {
                value: 'citpl',
                label: 'CITPL',
              },
            ]}
            placeholder="Company"
            allowClear
            showSearch
            style={{ width: '-webkit-fill-available' }}
            suffixIcon={
              <img src={Downarrowimg} alt={Downarrowimg} style={{ width: '10px', height: '6px' }} />
            }
          />
        </CCol>

        <CCol sm={3} md={2} lg={1} xl={2}>
          <Select
            className="choose_mem_report "
            id="member-list"
            onChange={(value) => handleStatusChange(value)}
            options={[
              {
                value: 'entered',
                label: 'Entered',
              },
              {
                value: 'not entered',
                label: 'Not Entered',
              },
            ]}
            placeholder="Choose Status"
            allowClear
            showSearch
            style={{ width: '-webkit-fill-available' }}
            suffixIcon={
              <img src={Downarrowimg} alt={Downarrowimg} style={{ width: '10px', height: '6px' }} />
            }
          />
        </CCol>
        <CCol sm={2} md={2} lg={2} xl={2}>
          <Select
            className=" custom-select-report "
            id="supervisor-list"
            value={options.find((option) => option.value === supervisorName) || null}
            onChange={handleSupervisorChange}
            options={
              suprLoader
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
                : options
            }
            placeholder="Choose Supervisor"
            allowClear
            showSearch
            style={{ width: '-webkit-fill-available' }}
            suffixIcon={
              <img src={Downarrowimg} alt={Downarrowimg} style={{ width: '10px', height: '6px' }} />
            }
          />
        </CCol>

        {/* Member&rsquo;s */}
        <CCol sm={2} md={2} lg={2} xl={2}>
          <Select
            className="choose_mem_report "
            id="member-list"
            value={options1.find((option) => option.value === memberName) || null}
            onChange={handleMemberChange}
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
                : options1
            }
            placeholder="Choose Member"
            allowClear
            showSearch
            style={{ width: '-webkit-fill-available' }}
            suffixIcon={
              <img src={Downarrowimg} alt={Downarrowimg} style={{ width: '10px', height: '6px' }} />
            }
          />
        </CCol>
        <CCol sm={1} xl={1}>
          <Button
            className="submit-button-dow btn-sm save_changes down_excel_button"
            loading={loading}
            style={{
              cursor: timesheetData.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '11px',
              color: 'white',
              height: '42px',
              width: '20%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            type="button"
            title="Download as Excel"
            disabled={timesheetData.length === 0}
            onClick={() => handleDownload(activeTab, dateWiseRef.current, supervisorId, memberId)}
          >
            <DownloadOutlined />
          </Button>
        </CCol>
      </CRow>

      <div className="table-container table_scroll-report" style={{ border: 'none' }}>
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
          // loader={<h4>Loading...</h4>}
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
                <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="10%">
                  Activity Date
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="8%">
                  Branch
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="10%">
                  Member
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="10%">
                  Supervisor Name
                </CTableHeaderCell>

                <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="10%">
                  Supervisor Status
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-productlist text-c" scope="col" width="10%">
                  Tot.of.hrs
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
                      {formatDate(row.activity_date)}
                    </CTableDataCell>
                    <CTableDataCell className=" text-c pd-text1 grid-cell">
                      {row.branch}
                    </CTableDataCell>
                    <CTableDataCell className="text-c pd-text1 grid-cell">
                      {row.userName !== null ? toPascalCase(row.userName) : '-'}
                    </CTableDataCell>
                    <CTableDataCell className="text-c pd-text1 grid-cell">
                      {row.supervisorName !== null ? toPascalCase(row.supervisorName) : '-'}
                    </CTableDataCell>

                    <CTableDataCell
                      className={`text-c grid-cell ${
                        row.supervisorStatus === 'Approved'
                          ? 'green-text1 '
                          : row.supervisorStatus === 'Pending'
                          ? 'warning-text1 '
                          : row.supervisorStatus === 'Reject'
                          ? 'red-text1 '
                          : 'pd-text1'
                      }`}
                      width="10%"
                    >
                      <span>
                        {row.supervisorStatus === 'Approved' && (
                          <span style={{ fontSize: '16px' }}>&#8226;</span>
                        )}
                        {row.supervisorStatus === 'Pending' && (
                          <span style={{ fontSize: '16px' }}>&#8226;</span>
                        )}
                        {row.supervisorStatus === 'Reject' && (
                          <span style={{ fontSize: '16px' }}>&#8226;</span>
                        )}
                        <span style={{ marginLeft: '5px' }}>
                          {row.supervisorStatus ? row.supervisorStatus : '-'}
                        </span>
                      </span>
                    </CTableDataCell>
                    <CTableDataCell className="text-c pd-text1 grid-cell">
                      {formatTimeDuration(row.hours)}
                    </CTableDataCell>
                  </CTableRow>
                ))
              )}
            </CTableBody>
          </CTable>
          {(timesheetData === null && !commonLoader) ||
          (timesheetData.length === 0 && !commonLoader) ? (
            <div className="text-c text-center my-3 td-text">No Data Found</div>
          ) : commonLoader ? (
            <div className="text-c text-center my-3 td-text">
              <CSpinner color="danger" />
            </div>
          ) : (
            <div></div>
          )}
        </InfiniteScroll>
      </div>
    </>
  )
}

AllReport.propTypes = {
  today: PropTypes.string,
  formatDate: PropTypes.func,
  status: PropTypes.string,
}
export default AllReport
