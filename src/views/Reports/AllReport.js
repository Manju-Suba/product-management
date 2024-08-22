import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Select, Breadcrumb, DatePicker, Button, Skeleton, Table } from 'antd'
import { CCol, CSpinner, CRow } from '@coreui/react'
import { getDecodeData, getHeaders, ImageUrl } from 'src/constant/Global'
import profileImage1 from '../../assets/images/avatars/wrapper.png'
import PropTypes from 'prop-types'
import 'react-toastify/dist/ReactToastify.css'
import dayjs from 'dayjs'
import useAxios from 'src/constant/UseAxios'
import { DownloadOutlined, EyeFilled } from '@ant-design/icons'
import Downarrowimg from '../../assets/images/downarrow.png'
import { toPascalCase } from '../../constant/TimeUtils'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'
import ViewReport from './ViewReport'
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
  const companyRef = useRef(null)
  const roleRef = useRef(null)
  const [isNorMore, setIsNorMore] = useState(false)
  const tableBodyRef = useRef(null)
  const user = getDecodeData()
  const roleIntake = user?.roleIntake
  const [reportVisble, setReportVisible] = useState(false)
  const [ids, setIds] = useState(0)
  const [names, setNames] = useState('')
  const designation = user?.designation

  useEffect(() => {
    if (!reportVisble) {
      getAllReport(startDateRef.current, endDateRef.current)
      hasMoreRef.current = true
      pageRef.current = 1
      setSuprLoader(true)
      getSupervisorList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportVisble])

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
      companyRef.current === null
        ? `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12`
        : `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12?company=${companyRef.current}`

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data.content

      if (pageRef.current === 1) setTimesheetData(data)
      else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
      if (data.length < 12) {
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
        ? `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12?company=${value}`
        : `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12`
    // let url = `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12?company=${companyIdRef.current}`

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data.content

      if (pageRef.current === 1) setTimesheetData(data)
      else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
      if (data.length < 12) {
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
  const getAllReportbasedRole = async (start, end, value) => {
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
        ? `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12?roletype=${value}`
        : `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12`
    // let url = `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12?company=${companyIdRef.current}`

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data.content

      if (pageRef.current === 1) setTimesheetData(data)
      else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
      if (data.length < 12) {
        hasMoreRef.current = false
      }

      // Increment the page number for the next fetch
      pageRef.current = pageRef.current + 1
      setCommonLoader(false)
    } catch (error) {
      //console.error('Error fetching data:', error)
    }
  }

  const getAllReportbasedRoleAndCompany = async (start, end, value) => {
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
      value !== undefined && companyRef.current !== null
        ? `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12?roletype=${value}&company=${companyRef.current}`
        : `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12`
    // let url = `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12?company=${companyIdRef.current}`

    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data.content

      if (pageRef.current === 1) setTimesheetData(data)
      else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
      if (data.length < 12) {
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
      companyRef.current = null
      roleRef.current = null
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
    let url = `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12?supervisorId=${id}`
    await api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        const data = response.data.data.content
        if (pageRef.current === 1) setTimesheetData(data)
        else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
        if (data.length < 12) {
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
      companyRef.current = null
      roleRef.current = null
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
    let url = `user/supervisorid/all/${start}/${end}/${statusRef.current}/${pageRef.current}/12?memberId=${id}`
    await api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        let data
        if (response.data.data !== null) {
          data = response.data.data?.content
        } else {
          data = []
        }

        if (pageRef.current === 1) setTimesheetData(data)
        else setTimesheetData((prevTimesheetData) => [...prevTimesheetData, ...data])
        if (data.length < 12) {
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
      companyRef.current === null && roleRef.current === null
        ? `GenerateReport/downloadExcel?fromDate=${from}&toDate=${to}&status=${statusRef.current}&supervisorid=${supId}&memberid=${memId}`
        : companyRef.current !== null && roleRef.current === null
        ? `GenerateReport/downloadExcel?fromDate=${from}&toDate=${to}&companyid=${companyRef.current}&status=${statusRef.current}&supervisorid=${supId}&memberid=${memId}`
        : companyRef.current === null && roleRef.current !== null
        ? `GenerateReport/downloadExcel?fromDate=${from}&toDate=${to}&roleType=${roleRef.current}&status=${statusRef.current}&supervisorid=${supId}&memberid=${memId}`
        : `GenerateReport/downloadExcel?fromDate=${from}&toDate=${to}&companyid=${companyRef.current}&roleType=${roleRef.current}&status=${statusRef.current}&supervisorid=${supId}&memberid=${memId}`

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
    pageRef.current = 1
    hasMoreRef.current = true
    if (value !== undefined) {
      companyRef.current = value
    } else {
      companyRef.current = null
    }
    supervisorIdRef.current = 0
    memberIdRef.current = 0
    setSupervisorName('')
    setSupervisorId(0)
    setMemberName('')
    setMemberId(0)
    setTimesheetData([])
    setCommonLoader(true)
    if (
      memberIdRef.current === 0 &&
      supervisorIdRef.current === 0 &&
      roleRef.current === null &&
      value !== undefined
    ) {
      getAllReportbasedCompany(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        value,
      )
    } else if (
      memberIdRef.current === 0 &&
      supervisorIdRef.current !== 0 &&
      roleRef.current === null &&
      value === undefined
    ) {
      getReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        supervisorIdRef.current,
      )
    } else if (
      memberIdRef.current !== 0 &&
      supervisorIdRef.current !== 0 &&
      roleRef.current === null &&
      value === undefined
    ) {
      getMemberReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        memberIdRef.current,
      )
    } else if (
      memberIdRef.current === 0 &&
      supervisorIdRef.current === 0 &&
      roleRef.current !== null &&
      value === undefined
    ) {
      getAllReportbasedRole(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        roleRef.current,
      )
    } else if (
      memberIdRef.current === 0 &&
      supervisorIdRef.current === 0 &&
      roleRef.current !== null &&
      value !== undefined
    ) {
      getAllReportbasedRoleAndCompany(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        roleRef.current,
      )
    }
  }
  const handleRoleChange = (value) => {
    pageRef.current = 1
    hasMoreRef.current = true
    if (value !== undefined) {
      roleRef.current = value
    } else {
      roleRef.current = null
    }
    supervisorIdRef.current = 0
    memberIdRef.current = 0
    setSupervisorName('')
    setSupervisorId(0)
    setMemberName('')
    setMemberId(0)
    setTimesheetData([])
    setCommonLoader(true)
    if (memberIdRef.current === 0 && supervisorIdRef.current === 0 && companyRef.current === null) {
      getAllReportbasedRole(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        value,
      )
    } else if (
      memberIdRef.current === 0 &&
      supervisorIdRef.current === 0 &&
      companyRef.current !== null &&
      value !== undefined
    ) {
      getAllReportbasedRoleAndCompany(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        value,
      )
    } else if (
      memberIdRef.current === 0 &&
      supervisorIdRef.current === 0 &&
      companyRef.current !== null &&
      value === undefined
    ) {
      getAllReportbasedCompany(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
        companyRef.current,
      )
    } else if (
      memberIdRef.current === 0 &&
      supervisorIdRef.current === 0 &&
      companyRef.current === null &&
      value === undefined
    ) {
      getAllReport(
        dayjs(startDateRef.current).format('YYYY-MM-DD'),
        dayjs(endDateRef.current).format('YYYY-MM-DD'),
      )
    }
  }
  const columns = [
    {
      title: 'SI.No',
      dataIndex: 'index',
      key: 'index',
      width: '3%',
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
      width: '5%',
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
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: '5%',
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
        return text
      },
    },
    {
      title: 'Member',
      dataIndex: 'userName',
      key: 'userName',
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
        return text !== null ? toPascalCase(text) : '-'
      },
    },
    {
      title: 'Supervisor Name',
      dataIndex: 'supervisorName',
      key: 'supervisorName',
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
        return text !== null ? toPascalCase(text) : '-'
      },
    },
    {
      title: 'Supervisor Status',
      dataIndex: 'supervisorStatus',
      key: 'supervisorStatus',
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
            {text ? <span style={{ fontSize: '16px' }}>&#8226;</span> : <></>}
            {text === 'Reject' ? 'Rejected' : text ? text : '-'}
          </div>
        )
      },
    },

    {
      title: 'Final Approver Name',
      dataIndex: 'finalName',
      key: 'finalName',
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
        return text !== null ? toPascalCase(text) : '-'
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
        switch (text) {
          case 'Approved':
            className = 'green-text1'
            break
          case 'Reject':
          case 'Rejected':
            className = 'red-text1'
            break
          case 'Not Yet':
          case 'Supervisor Not Approved':
            className = 'info-text1'
            break
          case 'Pending':
          case 'TL Approved':
          case 'Supervisor Approved':
            className = 'warning-text1'
            break
          default:
            className = 'not-text1'
            break
        }
        return (
          <div className={` ${className}`}>
            <span>
              {text === 'Approved' && <span style={{ fontSize: '16px' }}>&#8226;</span>}
              {(text === 'Pending' || text === 'Supervisor Approved' || text === 'TL Approved') && (
                <span style={{ fontSize: '16px' }}>&#8226;</span>
              )}
              {(text === 'Not Yet' || text === 'Supervisor Not Approved') && (
                <span style={{ fontSize: '16px' }}>&#8226;</span>
              )}
              {text === 'Reject' && <span style={{ fontSize: '16px' }}>&#8226;</span>}
              <span style={{ marginLeft: '5px' }}>
                {text === 'Supervisor Approved' || text === 'TL Approved'
                  ? 'Pending'
                  : text === 'Supervisor Not Approved'
                  ? 'Not Yet'
                  : text
                  ? text
                  : '-'}
              </span>
            </span>
          </div>
        )
      },
    },
    {
      title: 'Tot.of.hrs',
      dataIndex: 'hours',
      key: 'hours',
      width: '5%',
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
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '4%',
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
        action = (
          <button
            className="btn border-0 text-c text-secondary cross-button"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            onClick={() => {
              setIds(record.id)
              setNames(record.userName)
              setReportVisible(true)
            }}
          >
            <EyeFilled />
          </button>
        )
        return action
      },
    },
  ]
  const resetComponent = () => {
    roleRef.current = null
    companyRef.current = null
    setReportVisible(false)
  }
  const displayData = [
    ...timesheetData.map((row, index) => ({
      key: row.id,
      id: row.id,
      index: index + 1,
      activity_date: row.activity_date,
      branch: row.branch,
      userName: row.userName,
      supervisorName: row.supervisorName,
      supervisorStatus: row.supervisorStatus,
      finalApproveStatus: row.finalApproveStatus,
      ownerStatus: row.ownerStatus,
      finalName: row.finalName,
      hours: row.hours,
    })),
  ]

  // Append the "No more Data to load" message as the last row if noMoreData is true
  if (!hasMoreRef.current && displayData.length !== 0 && displayData.length > 12) {
    displayData.push({
      key: 'noMoreData',
      index: '',
      branch: 'No more Data to load',
      activity_date: '',
      hours: '',
      userName: '',
      supervisorName: '',
      supervisorStatus: '',
      finalApproveStatus: '',
      ownerStatus: '',
      finalName: '',
    })
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      if (
        supervisorIdRef.current !== 0 &&
        memberIdRef.current === 0 &&
        companyRef.current === null &&
        roleRef.current === null
      ) {
        getReport(
          dayjs(startDateRef.current).format('YYYY-MM-DD'),
          dayjs(endDateRef.current).format('YYYY-MM-DD'),
          supervisorIdRef.current,
        )
      } else if (
        memberIdRef.current !== 0 &&
        companyRef.current === null &&
        roleRef.current === null
      ) {
        getMemberReport(
          dayjs(startDateRef.current).format('YYYY-MM-DD'),
          dayjs(endDateRef.current).format('YYYY-MM-DD'),
          memberId,
        )
      } else if (
        memberIdRef.current === 0 &&
        supervisorIdRef.current === 0 &&
        companyRef.current === null &&
        roleRef.current === null
      ) {
        getAllReport(
          dayjs(startDateRef.current).format('YYYY-MM-DD'),
          dayjs(endDateRef.current).format('YYYY-MM-DD'),
        )
      } else if (
        memberIdRef.current === 0 &&
        supervisorIdRef.current === 0 &&
        companyRef.current !== null &&
        roleRef.current === null
      ) {
        getAllReportbasedCompany(
          dayjs(startDateRef.current).format('YYYY-MM-DD'),
          dayjs(endDateRef.current).format('YYYY-MM-DD'),
          companyRef.current,
        )
      } else if (
        memberIdRef.current === 0 &&
        supervisorIdRef.current === 0 &&
        companyRef.current !== null &&
        roleRef.current !== null
      ) {
        getAllReportbasedRoleAndCompany(
          dayjs(startDateRef.current).format('YYYY-MM-DD'),
          dayjs(endDateRef.current).format('YYYY-MM-DD'),
          roleRef.current,
        )
      } else if (
        memberIdRef.current === 0 &&
        supervisorIdRef.current === 0 &&
        companyRef.current === null &&
        roleRef.current !== null
      ) {
        getAllReportbasedRole(
          dayjs(startDateRef.current).format('YYYY-MM-DD'),
          dayjs(endDateRef.current).format('YYYY-MM-DD'),
          roleRef.current,
        )
      }
    }
  }

  const handleScroll = useCallback(
    debounce(() => {
      if (!tableBodyRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current
      if (scrollTop + clientHeight >= scrollHeight - 12) {
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
            <CCol sm={5} md={5} lg={5} xl={5}>
              <b style={{ paddingLeft: '30px' }}>
                {activeTab === 'All' ? 'All Report' : activeTab}
              </b>
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
                style={{ width: '100%' }}
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
            <CCol sm={2} md={2} lg={2} xl={2}>
              <Select
                className="choose_mem_report "
                id="member-list"
                onChange={(value) => handleRoleChange(value)}
                value={roleRef.current}
                options={[
                  {
                    value: 'Contract',
                    label: 'Contract',
                  },
                  {
                    value: 'On Role',
                    label: 'On Role',
                  },
                ]}
                placeholder="Role Type"
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
            <CCol sm={2} md={2} lg={2} xl={2}>
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
                value={companyRef.current}
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

            <CCol sm={1} xl={1}>
              <Button
                className="submit-button-dow btn-sm save_changes down_excel_button"
                loading={loading}
                style={{
                  cursor: timesheetData.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '11px',
                  color: 'white',
                  height: '32px',
                  width: '20%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                type="button"
                title="Download as Excel"
                disabled={timesheetData.length === 0}
                onClick={() =>
                  handleDownload(activeTab, dateWiseRef.current, supervisorId, memberId)
                }
              >
                <DownloadOutlined />
              </Button>
            </CCol>
          </CRow>
          {!user?.designation?.includes('QA Admin') && (
            <CRow>
              <CCol sm={5} md={5} lg={5} xl={5}></CCol>
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
                    <img
                      src={Downarrowimg}
                      alt={Downarrowimg}
                      style={{ width: '10px', height: '6px' }}
                    />
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
                    <img
                      src={Downarrowimg}
                      alt={Downarrowimg}
                      style={{ width: '10px', height: '6px' }}
                    />
                  }
                />
              </CCol>
              <CCol sm={3} md={2} lg={2} xl={2}>
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
                    <img
                      src={Downarrowimg}
                      alt={Downarrowimg}
                      style={{ width: '10px', height: '6px' }}
                    />
                  }
                />
              </CCol>
            </CRow>
          )}
          <div className="mt-3 design_table">
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
              scroll={{ y: 460 }}
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

AllReport.propTypes = {
  today: PropTypes.string,
  formatDate: PropTypes.func,
  status: PropTypes.string,
}
export default AllReport
