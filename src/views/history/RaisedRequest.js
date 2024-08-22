import React, { useState, useEffect, useMemo, useRef } from 'react'
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

const RaisedRequest = ({ formatDate, memberLists, memberLoader }) => {
  let api = useAxios()
  const [memberTable, setMemberTable] = useState([])
  const [memberList, setMemberList] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  const dateRef = useRef(null)
  const pageRef = useRef(0)
  const memberIdRef = useRef(0)
  const filterRef = useRef(false)
  const statusRef = useRef('')
  const hasMoreRef = useRef(true)
  const [abortController, setAbortController] = useState(new AbortController())

  useEffect(() => {
    setMemberList(memberLists)
    hasMoreRef.current = true
    getMemberRequestall()
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
        getMemberRequestall()
      }
    }
  }

  let loaderContent
  if (memberTable === null && !commonLoader) {
    loaderContent = <div className="text-c text-center my-3 td-text">No Data Found</div>
  } else if (memberTable.length === 0 && !commonLoader) {
    loaderContent = <div className="text-c text-center my-3 td-text">No Data Found</div>
  } else if (commonLoader) {
    loaderContent = (
      <div className="text-c text-center my-3 td-text">
        <CSpinner color="danger" />
      </div>
    )
  } else {
    loaderContent = <div></div>
  }

  const handleDateChange = (date, dateString) => {
    pageRef.current = 0
    hasMoreRef.current = true
    if (date !== null) {
      filterRef.current = true
      const parsedDate = dayjs(date, 'DD MMM, YYYY')
      const formattedDate = parsedDate.format('YYYY-MM-DD')
      dateRef.current = formattedDate
    } else if (memberIdRef.current !== 0 || statusRef.current !== '') {
      dateRef.current = null
      filterRef.current = true
    } else {
      filterRef.current = false
      dateRef.current = null
    }
    setCommonLoader(true)
    setMemberTable([])
    getMemberRequestall()
  }

  const getUrl = () => {
    let url
    if (filterRef.current === false)
      url = `activity/raisedRequest/tosupervisor/status?page=${pageRef.current}&size=10&filter=${filterRef.current}`
    else if (dateRef.current !== null && memberIdRef.current !== 0 && statusRef.current !== '')
      url = `activity/raisedRequest/tosupervisor/status?page=${pageRef.current}&size=10&filter=${filterRef.current}&date=${dateRef.current}&memberId=${memberIdRef.current}&status=${statusRef.current}`
    else if (dateRef.current !== null && memberIdRef.current === 0 && statusRef.current === '')
      url = `activity/raisedRequest/tosupervisor/status?page=${pageRef.current}&size=10&filter=${filterRef.current}&date=${dateRef.current}`
    else if (dateRef.current === null && memberIdRef.current !== 0 && statusRef.current === '')
      url = `activity/raisedRequest/tosupervisor/status?page=${pageRef.current}&size=10&filter=${filterRef.current}&memberId=${memberIdRef.current}`
    else if (dateRef.current === null && memberIdRef.current === 0 && statusRef.current !== '')
      url = `activity/raisedRequest/tosupervisor/status?page=${pageRef.current}&size=10&filter=${filterRef.current}&status=${statusRef.current}`
    else if (dateRef.current === null && memberIdRef.current !== 0 && statusRef.current !== '')
      url = `activity/raisedRequest/tosupervisor/status?page=${pageRef.current}&size=10&filter=${filterRef.current}&memberId=${memberIdRef.current}&status=${statusRef.current}`
    else if (dateRef.current !== null && memberIdRef.current === 0 && statusRef.current !== '')
      url = `activity/raisedRequest/tosupervisor/status?page=${pageRef.current}&size=10&filter=${filterRef.current}&date=${dateRef.current}&status=${statusRef.current}`
    else if (dateRef.current !== null && memberIdRef.current !== 0 && statusRef.current === '')
      url = `activity/raisedRequest/tosupervisor/status?page=${pageRef.current}&size=10&filter=${filterRef.current}&date=${dateRef.current}&memberId=${memberIdRef.current}`
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
    } else if (dateRef.current !== null || statusRef.current !== '') {
      memberIdRef.current = 0
      filterRef.current = true
    } else {
      filterRef.current = false
      memberIdRef.current = 0
    }
    setCommonLoader(true)
    setMemberTable([])
    getMemberRequestall()
  }

  const handleStatus = (status) => {
    pageRef.current = 0
    hasMoreRef.current = true
    if (status !== undefined) {
      statusRef.current = status
      filterRef.current = true
    } else if (dateRef.current !== null || memberIdRef.current !== 0) {
      statusRef.current = ''
      filterRef.current = true
    } else {
      filterRef.current = false
      statusRef.current = ''
    }
    setCommonLoader(true)
    setMemberTable([])
    getMemberRequestall()
  }
  return (
    <>
      <CRow className="mt-3">
        <CCol xs={12} sm={7} md={6}>
          <b style={{ paddingLeft: '30px' }}>Raised Request</b>
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
                    Raised Request
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
        <CCol sm={5} md={2}>
          <Select
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            className="members_activity_select member-custom-select membr-rais-status mem_selct"
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
            ]}
            onChange={(value) => handleStatus(value)}
          />
        </CCol>
      </CRow>
      <div className="table-container table_scroll mt-2" style={{ border: 'none' }}>
        <InfiniteScroll
          dataLength={memberTable.length}
          next={handleScroll}
          hasMore={hasMoreRef.current}
          loader={
            <div className="text-c text-center my-3 td-text">
              <CSpinner color="danger" />
            </div>
          }
          endMessage={
            memberTable.length !== 0 && (
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
                  Description
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="7%"
                >
                  Approver Status
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="20%"
                >
                  Approver Remarks
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {memberTable?.map((row, index) => (
                <CTableRow key={row.id}>
                  <CTableDataCell className="text-c text-center pd-text1 grid-cell" width="3%">
                    {index + 1}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={row.requestDate}
                    width="5%"
                  >
                    {formatDate(row.requestDate)}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={toPascalCase(row.teamName)}
                    width="10%"
                  >
                    {toPascalCase(row.teamName)}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={row.reason}
                    width="20%"
                  >
                    {row.reason}
                  </CTableDataCell>
                  <CTableDataCell
                    className={`text-c grid-cell ${
                      row.status === 'Approved'
                        ? 'green-text1 '
                        : row.status === 'Pending'
                        ? 'warning-text1 '
                        : row.status === 'Rejected'
                        ? 'red-text1 '
                        : ''
                    }`}
                    width="6%"
                  >
                    {row.status === 'Approved' && (
                      <span style={{ fontSize: '20px' }}>&#8226; </span>
                    )}
                    {row.status === 'Pending' && <span style={{ fontSize: '20px' }}>&#8226; </span>}
                    {row.status === 'Rejected' && (
                      <span style={{ fontSize: '20px' }}>&#8226; </span>
                    )}
                    {row.status}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={row.remarks}
                    width="20%"
                  >
                    {row.remarks ? row.remarks : '---'}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          {loaderContent}
        </InfiniteScroll>
      </div>
    </>
  )
}

RaisedRequest.propTypes = {
  formatDate: PropTypes.func,
  memberLists: PropTypes.array,
  memberLoader: PropTypes.bool,
}
export default RaisedRequest
