import React, { useState, useEffect, useRef } from 'react'
import { Select, DatePicker, Breadcrumb, Skeleton } from 'antd'
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
import { getHeaders } from 'src/constant/Global'
// import profileImage1 from '../../assets/images/avatars/wrapper.png'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import useAxios from 'src/constant/UseAxios'
import Downarrowimg from '../../assets/images/downarrow.png'
import { toPascalCase, formatTimeDuration } from '../../constant/TimeUtils'
import InfiniteScroll from 'react-infinite-scroll-component'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

const ClosedActivity = ({ formatDate, productLists, prodLoader }) => {
  let api = useAxios()
  const [memberTable, setMemberTable] = useState([])
  const [productList, setProductList] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  const selectRef = useRef(null)
  const dateRef = useRef(null)
  const statusRef = useRef('all')
  const pageRef = useRef(0)
  const productIdRef = useRef(0)
  const memberIdRef = useRef(0)
  const filterRef = useRef('default')
  const hasMoreRef = useRef(true)
  const [abortController, setAbortController] = useState(new AbortController())

  useEffect(() => {
    setProductList(productLists)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productLists])

  useEffect(() => {
    hasMoreRef.current = true
    getMemberActivityall()
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
        getMemberActivityall()
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

  const getMemberActivityall = async () => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setMemberTable([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    let url
    if (dateRef.current !== null) {
      url = `common/timesheet/approval/owner/status?page=${pageRef.current}&size=10&category=${filterRef.current}&status=${statusRef.current}&productId=${productIdRef.current}&memberId=${memberIdRef.current}&date=${dateRef.current}`
    } else {
      url = `common/timesheet/approval/owner/status?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}&memberId=${memberIdRef.current}&status=${statusRef.current}`
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

  //Product List
  const options = productList.map((product) => ({
    value: product.id,
    label: product.name,
  }))
  const handleProduct = (product) => {
    selectRef.current.blur()
    pageRef.current = 0
    hasMoreRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (product !== undefined) {
      productIdRef.current = product
      if (dateRef.current === null && memberIdRef.current === 0) {
        filterRef.current = 'product'
      } else if (dateRef.current === null && memberIdRef.current !== 0) {
        filterRef.current = 'memberandproduct'
      } else if (dateRef.current !== null && memberIdRef.current === 0) {
        filterRef.current = 'dateandproduct'
      } else if (dateRef.current !== null && memberIdRef.current !== 0) {
        filterRef.current = 'all'
      }
    } else {
      productIdRef.current = 0
      if (dateRef.current === null && memberIdRef.current === 0) {
        filterRef.current = 'default'
      } else if (dateRef.current === null && memberIdRef.current !== 0) {
        filterRef.current = 'member'
      } else if (dateRef.current !== null && memberIdRef.current === 0) {
        filterRef.current = 'date'
      } else if (dateRef.current !== null && memberIdRef.current !== 0) {
        filterRef.current = 'dateandmember'
      }
    }
    getMemberActivityall()
  }

  const handleDateChange = (date, dateString) => {
    pageRef.current = 0
    hasMoreRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (date !== null) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD')
      dateRef.current = formattedDate
      if (productIdRef.current !== 0 && memberIdRef.current === 0) {
        filterRef.current = 'dateandproduct'
      } else if (productIdRef.current === 0 && memberIdRef.current !== 0) {
        filterRef.current = 'dateandmember'
      } else if (productIdRef.current === 0 && memberIdRef.current === 0) {
        filterRef.current = 'date'
      } else if (productIdRef.current !== 0 && statusRef.current !== '') {
        filterRef.current = 'all'
      }
    } else {
      dateRef.current = null
      if (productIdRef.current !== 0 && memberIdRef.current === 0) {
        filterRef.current = 'product'
      } else if (productIdRef.current === 0 && memberIdRef.current !== 0) {
        filterRef.current = 'member'
      } else if (productIdRef.current === 0 && memberIdRef.current === 0) {
        filterRef.current = 'default'
      } else if (productIdRef.current !== 0 && memberIdRef.current !== 0) {
        filterRef.current = 'memberandproduct'
      }
    }
    getMemberActivityall()
  }

  const handleStatus = (value) => {
    pageRef.current = 0
    hasMoreRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (value !== undefined) {
      statusRef.current = value
    } else {
      statusRef.current = 'all'
    }
    getMemberActivityall()
  }
  return (
    <>
      <CRow className="mt-3">
        <CCol sm={6}>
          <b style={{ marginLeft: '30px' }}>Closed Activity</b>
          <br />
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
                  <span className="text-secondary " style={{ cursor: 'default' }}>
                    Closed Activity
                  </span>
                ),
              },
            ]}
          />
        </CCol>

        <CCol sm={2}>
          <DatePicker
            variant={'borderless'}
            className="dateField_close date_picker_clo "
            onChange={handleDateChange}
            placeholder="Choose Date"
            allowClear
            format="DD MMM,YYYY"
          />
        </CCol>
        <CCol sm={2}>
          <Select
            className="contract_members_activity_select custom-select_pend mem-act-select"
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            variant={'borderless'}
            id="products"
            value={options.find((option) => option.value === productIdRef.current) || undefined}
            onChange={(value) => handleProduct(value)}
            showSearch
            allowClear
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            dropdownRender={(menu) => (
              <div style={{ maxHeight: '120px', overflow: 'auto' }} role="listbox">
                {menu}
              </div>
            )}
            ref={selectRef}
            options={
              prodLoader
                ? [
                    {
                      label: (
                        <div style={{ textAlign: 'center' }}>
                          {Array.from({ length: 5 }, (_, index) => (
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
                      ),
                      value: 'loading',
                      disabled: true,
                    },
                  ]
                : options
            }
            placeholder="Choose Product"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </CCol>
        {/* <CCol sm={2}>
          <Select
            variant={'borderless'}
            className="contract_members_activity_select custom-select_pend mem-act-select"
            id="member-list"
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
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
            placeholder="Choose Member"
            allowClear
            ref={selectRef}
            popupMatchSelectWidth={false}
            filterOption={(input, option) => {
              const userNameArray = option.label.props.children[1].props.children[0].props.children
              const userName = userNameArray
              const lowerCaseInput = input.toLowerCase()
              const lowerCaseUserName = userName.toLowerCase()
              return lowerCaseUserName.includes(lowerCaseInput)
            }}
            popupClassName="custom-dropdown"
            getPopupContainer={(triggerNode) => triggerNode.parentNode}
          />
        </CCol> */}
        <CCol sm={2}>
          <Select
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            className="contract_members_activity_select custom-select_pend mem-act-select"
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
          <CTable>
            <CTableHead className="head-row">
              <CTableRow>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header text-center"
                  scope="col"
                  width="4%"
                >
                  SI.No
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="10%"
                >
                  Activity Date
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="12%"
                >
                  Team member
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="15%"
                >
                  Product
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="10%"
                >
                  Task
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="5%"
                >
                  No.of.Hours
                </CTableHeaderCell>
                {/* <CTableHeaderCell
                className="table-head-draft  text-c grid-cell-header"
                scope="col"
                width="10%"
              >
                Status
              </CTableHeaderCell> */}
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="12%"
                >
                  Approver Status
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="15%"
                >
                  Remarks
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {memberTable?.map((row, index) => (
                <CTableRow key={row.id}>
                  <CTableDataCell className="text-c pd-text1 grid-cell text-center" width="4%">
                    {index + 1}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={row.activity_date}
                    width="10%"
                  >
                    {formatDate(row.activity_date)}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={toPascalCase(row.task_user_name)}
                    width="12%"
                  >
                    {toPascalCase(row.task_user_name)}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={row.productName}
                    width="15%"
                  >
                    <span>
                      {row.assignedStatus === true && (
                        <span style={{ fontSize: '16px', color: '#00ab55' }}>&#8226;</span>
                      )}
                      {row.assignedStatus === false && (
                        <span style={{ fontSize: '16px', color: '#ffaa00' }}>&#8226;</span>
                      )}
                      <span style={{ marginLeft: '5px' }}>{row.productName}</span>
                    </span>
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1 grid-cell"
                    title={row.taskName}
                    width="10%"
                  >
                    {row.taskName}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c pd-text1  text-center grid-cell"
                    title={row.hours}
                    width="5%"
                  >
                    {formatTimeDuration(row.hours)}
                  </CTableDataCell>
                  {/* <CTableDataCell
                    className={`text-c grid-cell ${
                      row.status === 'Approved'
                        ? 'green-text1 '
                        : row.status === 'Pending'
                        ? 'warning-text1 '
                        : row.status === 'Completed'
                        ? 'green-text1 '
                        : ''
                    }`}
                    width="10%"
                  >
                    <span>
                      {row.status === 'Approved' && (
                        <span style={{ fontSize: '20px' }}>&#8226;</span>
                      )}
                      {row.status === 'Pending' && (
                        <span style={{ fontSize: '20px' }}>&#8226;</span>
                      )}
                      {row.status === 'Completed' && (
                        <span style={{ fontSize: '20px' }}>&#8226;</span>
                      )}
                    </span>
                    <span style={{ marginLeft: '5px' }}>{row.status}</span>
                  </CTableDataCell> */}
                  <CTableDataCell
                    className={`text-c grid-cell ${
                      row.supervisor_approved === 'Approved'
                        ? 'green-text1 '
                        : row.supervisor_approved === 'Reject'
                        ? 'red-text1 '
                        : ''
                    }`}
                    width="10%"
                  >
                    {row.supervisor_approved === 'Approved' && (
                      <span>
                        <span style={{ fontSize: '20px' }}>&#8226;</span>
                        <span style={{ marginLeft: '5px' }}>Approved</span>
                      </span>
                    )}
                    {row.supervisor_approved === 'Reject' && (
                      <span>
                        <span style={{ fontSize: '20px' }}>&#8226;</span>
                        <span style={{ marginLeft: '5px' }}>Rejected</span>
                      </span>
                    )}
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c grid-cell pd-text1"
                    title={row.description}
                    width="15%"
                  >
                    {row.description}
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

ClosedActivity.propTypes = {
  formatDate: PropTypes.func,
  productLists: PropTypes.array,
  prodLoader: PropTypes.bool,
}
export default ClosedActivity
