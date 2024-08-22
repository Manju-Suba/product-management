import React, { useState, useEffect, useRef } from 'react'
import { Select, Skeleton, Breadcrumb } from 'antd'
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
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import useAxios from 'src/constant/UseAxios'
import { Link } from 'react-router-dom'
import Downarrowimg from '../../assets/images/downarrow.png'
import { toPascalCase, formatTimeDuration } from '../../constant/TimeUtils'
import InfiniteScroll from 'react-infinite-scroll-component'
const RejectedActivity = ({ memberLoader, formatDate, productLists, memberLists, prodLoader }) => {
  let api = useAxios()
  const [memberTable, setMemberTable] = useState([])
  const [productList, setProductList] = useState([])
  const [memberList, setMemberList] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  const selectRef = useRef(null)
  const pageRef = useRef(0)
  const productIdRef = useRef(0)
  const memberIdRef = useRef(0)
  const filterRef = useRef('approveddefault')
  const hasMoreRef = useRef(true)
  const [abortController, setAbortController] = useState(new AbortController())

  useEffect(() => {
    setMemberList(memberLists)
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

  const getUrl = () => {
    let url
    switch (filterRef.current) {
      case 'approveddefault':
        url = `common/timesheet/activity/superviserlistall?page=${pageRef.current}&size=10&category=${filterRef.current}&status=Reject`
        break
      case 'approvedall':
        url = `common/timesheet/activity/superviserlistall?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}&memberId=${memberIdRef.current}&status=Reject`
        break
      case 'approvedproduct':
        url = `common/timesheet/activity/superviserlistall?page=${pageRef.current}&size=10&category=${filterRef.current}&productId=${productIdRef.current}&status=Reject`
        break
      case 'approvedmember':
        url = `common/timesheet/activity/superviserlistall?page=${pageRef.current}&size=10&category=${filterRef.current}&memberId=${memberIdRef.current}&status=Reject`
        break
      default:
        break
    }
    return url
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
    try {
      const response = await api.get(getUrl(), {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data.dataList
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
  const handleProduct = (value) => {
    selectRef.current.blur()
    pageRef.current = 0
    hasMoreRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (value !== undefined && memberIdRef.current === 0) {
      productIdRef.current = value
      filterRef.current = 'approvedproduct'
    } else if (value !== undefined && memberIdRef.current !== 0) {
      filterRef.current = 'approvedall'
      productIdRef.current = value
    } else if (memberIdRef.current !== 0 && value === undefined) {
      filterRef.current = 'approvedmember'
      productIdRef.current = 0
    } else {
      filterRef.current = 'approveddefault'
      productIdRef.current = 0
    }
    getMemberActivityall()
  }
  const handleMember = (value) => {
    selectRef.current.blur()
    pageRef.current = 0
    hasMoreRef.current = true
    setMemberTable([])
    setCommonLoader(true)
    if (value !== undefined && productIdRef.current === 0) {
      memberIdRef.current = value
      filterRef.current = 'approvedmember'
    } else if (value !== undefined && productIdRef.current !== 0) {
      filterRef.current = 'approvedall'
      memberIdRef.current = value
    } else if (productIdRef.current !== 0 && value === undefined) {
      filterRef.current = 'approvedproduct'
      memberIdRef.current = 0
    } else {
      filterRef.current = 'approveddefault'
      memberIdRef.current = 0
    }
    getMemberActivityall()
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

  return (
    <>
      <CRow className="mt-3 ">
        <CCol xs={12} sm={7} md={8}>
          <b style={{ paddingLeft: '30px' }}>Rejected Member&rsquo;s Activity</b>
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
                    Rejected Member&rsquo;s Activity
                  </span>
                ),
              },
            ]}
          />
        </CCol>

        <CCol sm={5} md={2}>
          <Select
            className="members_activity_select approved-custom-select mem_selct "
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            variant={'borderless'}
            id="products"
            value={options.find((option) => option.value === productIdRef.current) || undefined} // Ant Design uses undefined for no selection
            onChange={(value) => handleProduct(value)}
            showSearch // Enable search functionality
            allowClear
            ref={selectRef}
            filterOption={(input, option) =>
              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
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
            getPopupContainer={(triggerNode) => triggerNode.parentNode} // Adjust menu placement
          />
        </CCol>

        <CCol sm={6} md={2}>
          <Select
            className="members_activity_select member-custom-select mem_selct"
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
            ref={selectRef}
            variant={'borderless'}
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            placeholder="Choose Member"
            allowClear
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
                User Status
              </CTableHeaderCell> */}
                <CTableHeaderCell
                  className="table-head-draft  text-c grid-cell-header"
                  scope="col"
                  width="10%"
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
                    title={row.userName}
                    width="12%"
                  >
                    {toPascalCase(row.userName)}
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
                    title={formatTimeDuration(row.hours)}
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
                      row.supervisorStatus === 'Approved'
                        ? 'green-text1 '
                        : row.supervisorStatus === 'Reject'
                        ? 'red-text1 '
                        : ''
                    }`}
                    width="10%"
                  >
                    {row.supervisorStatus === 'Approved' && (
                      <span>
                        <span style={{ fontSize: '20px' }}>&#8226;</span>
                        <span style={{ marginLeft: '5px' }}>Approved</span>
                      </span>
                    )}
                    {row.supervisorStatus === 'Reject' && (
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

RejectedActivity.propTypes = {
  memberLoader: PropTypes.bool,
  formatDate: PropTypes.func,
  productLists: PropTypes.array,
  memberLists: PropTypes.array,
  prodLoader: PropTypes.bool,
}
export default RejectedActivity
