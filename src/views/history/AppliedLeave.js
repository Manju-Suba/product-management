import React, { useState, useEffect, useRef } from 'react'
import { Select, DatePicker, Breadcrumb, Skeleton } from 'antd'
import {
  CCol,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { getHeaders, ImageUrl } from 'src/constant/Global'
import profileImage1 from '../../assets/images/avatars/wrapper.png'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import useAxios from 'src/constant/UseAxios'
import Downarrowimg from '../../assets/images/downarrow.png'
import dayjs from 'dayjs'
import { toPascalCase } from '../../constant/TimeUtils'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Link } from 'react-router-dom'

const AppliedLeave = ({ formatDate, memberLists, memberLoader }) => {
  let api = useAxios()
  const leaveDateRef = useRef(null)
  const [leaveTable, setLeaveTable] = useState([])
  const [memberList, setMemberList] = useState([])
  const memberRef = useRef(0)
  const [abortController, setAbortController] = useState(new AbortController())
  const hasMoreRef = useRef(true)
  const pageRef = useRef(0)
  const [commonLoader, setCommonLoader] = useState(true)

  useEffect(() => {
    hasMoreRef.current = true
    getAppliedLeave(leaveDateRef.current)
    setMemberList(memberLists)
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
        getAppliedLeave(leaveDateRef.current)
      }
    }
  }

  const handleDateChange = (date, dateString) => {
    hasMoreRef.current = true
    const newDate = dayjs(date).format('YYYY-MM-DD')
    pageRef.current = 0
    setCommonLoader(true)
    setLeaveTable([])
    if (date === undefined || date === null) {
      leaveDateRef.current = null
      getAppliedLeave(leaveDateRef.current)
    } else {
      leaveDateRef.current = newDate
      getAppliedLeave(newDate)
    }
  }

  const getAppliedLeave = async (date) => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setLeaveTable([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    let url
    if ((date === null || date === undefined) && memberRef.current === 0) {
      url = `activity/attendanceSheet/bysupervisor?page=${pageRef.current}&size=10`
    } else if (date !== null && date !== undefined && memberRef.current !== 0) {
      url = `activity/attendanceSheet/bysupervisor?page=${pageRef.current}&size=10&userid=${memberRef.current}&date=${date}`
    } else if ((date === null || date === undefined) && memberRef.current !== 0) {
      url = `activity/attendanceSheet/bysupervisor?page=${pageRef.current}&size=10&userid=${memberRef.current}`
    } else if (date !== null && date !== undefined && memberRef.current === 0) {
      url = `activity/attendanceSheet/bysupervisor?page=${pageRef.current}&size=10&date=${date}`
    }
    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data
      if (pageRef.current === 0) {
        setLeaveTable(data.content)
      } else {
        setLeaveTable((prevUserData) => {
          return [...prevUserData, ...data.content]
        })
      }
      if (data.last === true) {
        hasMoreRef.current = false
      } else {
        hasMoreRef.current = true
      }
      pageRef.current = pageRef.current + 1
      setCommonLoader(false)
    } catch (error) {}
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

  const handleMember = (selectedProductId) => {
    if (selectedProductId === undefined) {
      memberRef.current = 0
    } else {
      memberRef.current = selectedProductId
    }
    hasMoreRef.current = true
    pageRef.current = 0
    setCommonLoader(true)
    setLeaveTable([])
    getAppliedLeave(leaveDateRef.current)
  }

  let content
  if (leaveTable === null && !commonLoader) {
    content = <div className="text-c text-center my-3 td-text">No Data Found</div>
  } else if (leaveTable.length === 0 && !commonLoader) {
    content = <div className="text-c text-center my-3 td-text">No Data Found</div>
  } else if (commonLoader) {
    content = (
      <div className="text-c text-center my-3 td-text">
        <CSpinner color="danger" />
      </div>
    )
  } else {
    content = <div></div>
  }

  return (
    <>
      <CRow className="mt-3">
        <CCol xs={12} sm={7} md={8}>
          <b style={{ paddingLeft: '30px' }}>Appiled Leave</b>
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
                    Appiled Leave
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
            className="filter-date datepicker_raised mem_selct"
            onChange={handleDateChange}
            placeholder="Choose Date"
            allowClear
            variant={'borderless'}
            format="DD MMM,YYYY"
          />
        </CCol>
        <CCol sm={5} md={2}>
          <Select
            style={{ width: '90%' }}
            className="members_activity_select custom-select-raised membr-rais-mem mem_selct"
            id="member-list"
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
          dataLength={leaveTable.length}
          next={handleScroll}
          hasMore={hasMoreRef.current}
          loader={
            <div className="text-c text-center my-3 td-text">
              <CSpinner color="danger" />
            </div>
          }
          endMessage={
            leaveTable.length !== 0 && (
              <p style={{ textAlign: 'center' }}>
                <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
              </p>
            )
          }
        >
          <CTable hover>
            <CTableHead className="head-row">
              <CTableRow>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header text-center"
                  scope="col"
                  width="3%"
                >
                  SI.No
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="5%"
                >
                  Activity Date
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="10%"
                >
                  Team member
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="20%"
                >
                  Member`s Remarks
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {leaveTable?.map((row, index) => (
                <CTableRow key={row.id}>
                  <CTableDataCell className="text-c text-center pd-text1 grid-cell" width="3%">
                    {index + 1}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={row.appliedDate}
                    width="5%"
                  >
                    {formatDate(row.appliedDate)}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={toPascalCase(row.userName)}
                    width="10%"
                  >
                    {toPascalCase(row.userName)}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={row.status}
                    width="20%"
                  >
                    {row.status}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          {content}
        </InfiniteScroll>
      </div>
    </>
  )
}

AppliedLeave.propTypes = {
  formatDate: PropTypes.func,
  memberLists: PropTypes.array,
  memberLoader: PropTypes.bool,
}
export default AppliedLeave
