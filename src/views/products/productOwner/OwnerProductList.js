import React, { useState, useEffect, useRef } from 'react'
import { Select, Breadcrumb, Tooltip, Card, Divider, Skeleton } from 'antd'
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
import profileImage1 from '../../../assets/images/avatars/wrapper.png'
import PropTypes from 'prop-types'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatAmountWithCommas } from 'src/constant/TimeUtils'
import EditSvg from '../../svgImages/EditSvg'
import PlusSvg from 'src/views/svgImages/PlusSvg'
import ViewProduct from '../ViewProduct'
import useAxios from 'src/constant/UseAxios'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Link } from 'react-router-dom'
import Downarrowimg from '../../../assets/images/downarrow.png'
const OwnerProductList = ({ FlowList, categories, techHeadList, prodHeadList, dataHeadList }) => {
  let api = useAxios()
  const [tableData, setTableData] = useState([])
  const [productId, setProductId] = useState(null)
  const [productNames, setProductNames] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  const [ViewProductShow, setViewProductShow] = useState(false)
  const [ViewProductData, setViewProductData] = useState({})
  const [ownerStatus, setOwnerStatus] = useState('OwnerCreate')
  const [abortController, setAbortController] = useState(new AbortController())
  // const [hasMore, setHasMore] = useState(true)
  const hasMoreRef = useRef(true)
  const pageRef = useRef(0)
  const searchRef = useRef(false)
  const productRef = useRef(0)
  const selectRef = useRef(null)
  const [pLoader, setPLoader] = useState(true)

  useEffect(() => {
    getProductNames()
    if (!ViewProductShow) {
      pageRef.current = 0
      hasMoreRef.current = true
      getProductList()
      const tableContainer = document.querySelector('.table-container')
      tableContainer.addEventListener('scroll', handleScroll)
      return () => {
        tableContainer.removeEventListener('scroll', handleScroll)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ViewProductShow])

  const handleScroll = () => {
    const tableContainer = document.querySelector('.table-container')
    if (tableContainer.scrollTop + tableContainer.clientHeight === tableContainer.scrollHeight) {
      if (hasMoreRef.current === true) {
        if (productRef.current !== 0) {
          pageRef.current = 0
        }
        getProductList()
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    let formattedDate = date.toLocaleDateString('en-GB', options)
    if (!formattedDate.includes(',')) {
      formattedDate = formattedDate.replace(/(\w{3}) (\d{4})/, '$1, $2')
    }
    return formattedDate
  }

  const getProductList = async () => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setTableData([])
      if (abortController) {
        abortController.abort()
      }
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    const url = `member/product-list?page=${pageRef.current}&size=10&search=${searchRef.current}&value=${productRef.current}`
    await api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        const data = response.data.data
        if (data !== null) {
          if (pageRef.current === 0) setTableData(data)
          else setTableData((prevUserData) => [...prevUserData, ...data])
          if (data.length < 10) {
            hasMoreRef.current = false
          }

          // Increment the page number for the next fetch
          pageRef.current = pageRef.current + 1
        } else {
          hasMoreRef.current = false
        }
        setCommonLoader(false)
      })
      .catch((error) => {})
  }

  const handleProduct = (value) => {
    selectRef.current.blur()
    if (value === undefined) {
      setProductId(null)
      searchRef.current = false
      productRef.current = 0
    } else {
      setProductId(value)
      searchRef.current = true
      productRef.current = value
    }
    pageRef.current = 0
    hasMoreRef.current = true
    getProductList()
  }

  const getProductNames = async () => {
    const url = `product/owner/serach`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        setProductNames(data)
        setPLoader(false)
      })
      .catch((error) => {})
  }

  const handleProductViewedit = async (id) => {
    setOwnerStatus('OwnerEdit')
    const url = `product/view/` + id
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        setViewProductData(data)
        setViewProductShow(true)
      })
      .catch((error) => {})
  }
  const handleProductView = async (id) => {
    setOwnerStatus('OwnerCreate')
    const url = `product/view/` + id
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        setViewProductData(data)
        setViewProductShow(true)
      })
      .catch((error) => {})
  }
  const closeViewProduct = () => {
    pageRef.current = 0
    productRef.current = 0
    searchRef.current = false
    setViewProductShow(false)
  }
  return (
    <>
      <ToastContainer />
      {ViewProductShow ? (
        <ViewProduct
          flowList={FlowList}
          close={closeViewProduct}
          techHeadList={techHeadList}
          prodHeadList={prodHeadList}
          dataHeadList={dataHeadList}
          categories={categories}
          ViewProductData={ViewProductData}
          viewStatus={ownerStatus}
          titleList="Product List"
          ownerOption={[]}
        />
      ) : (
        <>
          <CRow className="mt-3">
            <CCol sm={10}>
              <b style={{ marginLeft: '30px' }}>Product List</b>
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
                        Product List
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>

            <CCol sm={2}>
              <Select
                className="contract_members_activity_select custom_select_prd"
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt="Downarrowimg"
                    style={{ width: '10px', height: '6px' }}
                  />
                }
                variant={'borderless'}
                id="products"
                value={productId}
                onChange={(selectedOption) => handleProduct(selectedOption)}
                showSearch
                ref={selectRef}
                allowClear
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                dropdownRender={(menu) => (
                  <div style={{ overflow: 'auto' }} role="listbox">
                    {menu}
                  </div>
                )}
                options={
                  pLoader
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
                    : productNames.map((prod) => ({
                        value: prod.id,
                        label: prod.name,
                      }))
                }
                placeholder="Choose Product"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              />
            </CCol>
          </CRow>

          <div className="table-container table_scroll" style={{ border: 'none' }}>
            <InfiniteScroll
              dataLength={tableData.length}
              next={handleScroll}
              hasMore={hasMoreRef.current}
              loader={
                <div className="text-c text-center my-3 td-text">
                  <CSpinner color="danger" />
                </div>
              }
              endMessage={
                tableData.length !== 0 && (
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
                      Product Name
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Flow
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Product Head
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Technical Head
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Data Head
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Start Date
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      End Date
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      width="10%"
                      scope="col"
                    >
                      Approval Flow
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Budget Details
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="10%"
                    >
                      Business Category
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c text-center"
                      scope="col"
                      width="10%"
                    >
                      Action
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {!tableData ? (
                    <div></div>
                  ) : (
                    tableData.map((row, index) => (
                      <CTableRow key={index} className="tr-bg-color">
                        <CTableDataCell className="productflow-col-box text-c pad-bottom_flow td-product-text">
                          {index + 1}
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-name pad-bottom_flow td-product-text">
                          <Tooltip
                            placement="bottomLeft"
                            title={row.productName}
                            className="productflow-name-lable"
                          >
                            {row.productName}
                          </Tooltip>
                        </CTableDataCell>
                        <CTableDataCell className=" productflow-product-flow pad-bottom_flow td-product-text">
                          <Tooltip
                            placement="bottomLeft"
                            title={row.flowName ? row.flowName : ''}
                            className="flow-name-lable"
                          >
                            {row.flowName ? row.flowName : ''}
                          </Tooltip>
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-head pad-bottom_flow">
                          {row.prodHead ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src={
                                  row.prodHead.profilePic
                                    ? ImageUrl + row.prodHead.profilePic
                                    : profileImage1
                                }
                                alt="Profile"
                                className="head-td"
                              />
                              <div className="node1" style={{ marginTop: '6px' }}>
                                <p className="head-td-name" title={row.prodHead.name}>
                                  {row.prodHead.name}
                                </p>
                                <p className="head-td-role" title={row.prodHead.designation}>
                                  {row.prodHead.designation}
                                </p>
                              </div>
                            </div>
                          ) : (
                            '---'
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-head pad-bottom_flow">
                          {row.techHead ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src={
                                  row.techHead.profilePic
                                    ? ImageUrl + row.techHead.profilePic
                                    : profileImage1
                                }
                                alt="Profile"
                                className="head-td"
                              />
                              <div className="node1" style={{ marginTop: '6px' }}>
                                <p className="head-td-name" title={row.techHead.name}>
                                  {row.techHead.name}
                                </p>
                                <p className="head-td-role" title={row.techHead.designation}>
                                  {row.techHead.designation}
                                </p>
                              </div>
                            </div>
                          ) : (
                            '---'
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-head pad-bottom_flow">
                          {row.dataHead ? (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src={
                                  row.dataHead.profilePic
                                    ? ImageUrl + row.dataHead.profilePic
                                    : profileImage1
                                }
                                alt="Profile"
                                className="head-td"
                              />
                              <div className="node1" style={{ marginTop: '6px' }}>
                                <p className="head-td-name" title={row.dataHead.name}>
                                  {row.dataHead.name}
                                </p>
                                <p className="head-td-role" title={row.dataHead.designation}>
                                  {row.dataHead.designation}
                                </p>
                              </div>
                            </div>
                          ) : (
                            '---'
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-Startdate pad-bottom_flow td-product-text">
                          {formatDate(row.startDate)}
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-Enddate pad-bottom_flow td-product-text">
                          {row.endDate !== null ? formatDate(row.endDate) : '--'}
                        </CTableDataCell>
                        <CTableDataCell className="text-c flowlist-accesperson pad-bottom_flow">
                          <div className="table-cell-container">
                            <div className="image-background-accessperson">
                              {row.approvalFlow.slice(0, 3).map((member, index) => (
                                <div className="accessPerImg" key={index}>
                                  <div className="tooltip-container">
                                    <img
                                      src={
                                        member.profilePic
                                          ? ImageUrl + member.profilePic
                                          : profileImage1
                                      }
                                      className={member.profilePic ? 'first-image' : 'second-image'}
                                      alt="Access Person Images"
                                    />
                                  </div>
                                </div>
                              ))}
                              <div>
                                {row.approvalFlow.length > 3 && (
                                  <div className="accessPerImg text-center more-person-access rounded-circle">
                                    <span>+{row.approvalFlow.length - 3}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="card-list-person">
                              <Card
                                style={{ width: '250px', height: '120px', overflowY: 'auto' }}
                                className="Access-card"
                              >
                                {row.approvalFlow.map((member) => (
                                  <div key={member}>
                                    <div className=" access-person-tooltip  ">
                                      <div className="image-background">
                                        <img
                                          src={
                                            member.profilePic
                                              ? ImageUrl + member.profilePic
                                              : profileImage1
                                          }
                                          className={
                                            member.profilePic
                                              ? 'card-access-image'
                                              : 'card-approval-image'
                                          }
                                          alt={member.name}
                                        />
                                      </div>
                                      <div
                                        className="node1 access-person-hovercard"
                                        style={member.profilePic ? { marginLeft: '11px' } : {}}
                                      >
                                        <p className="member-user-name1"> {member.name}</p>
                                        <p className="member-role-text1">{member.designation}</p>
                                      </div>
                                    </div>
                                    <Divider />
                                  </div>
                                ))}
                              </Card>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-budget pad-bottom_flow td-product-text">
                          {row.budgetDetails !== 'undefined' &&
                          row.budgetDetails !== '' &&
                          row.budgetDetails !== null
                            ? formatAmountWithCommas(row.budgetDetails, row.currency)
                            : '---'}
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-Startdate pad-bottom_flow td-product-text">
                          {row.bussinessCategory}
                        </CTableDataCell>

                        <CTableDataCell className="productflow-product-Action pad-bottom_flow text-center td-product-text">
                          {row.member.length > 0 ? (
                            <button
                              type="button"
                              className="action-view  edit-button"
                              onClick={() => handleProductViewedit(row.id)}
                            >
                              <EditSvg
                                width="10"
                                height="10"
                                viewBox="0 0 18 18"
                                fill="none"
                                color="white"
                                clipH="18"
                                clipW="18"
                              />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="action-view cross-button"
                              onClick={() => {
                                handleProductView(row.id)
                              }}
                            >
                              <PlusSvg width="8" height="12" viewBox="0 0 18 18" fill="#A5A1A1" />
                            </button>
                          )}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
              {(tableData === null && !commonLoader) ||
              (tableData.length === 0 && !commonLoader) ? (
                <div className="text-c text-center my-3 td-text">No Data Found</div>
              ) : commonLoader && tableData.length === 0 ? (
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
OwnerProductList.propTypes = {
  FlowList: PropTypes.array,
  categories: PropTypes.array,
  techHeadList: PropTypes.array,
  prodHeadList: PropTypes.array,
  dataHeadList: PropTypes.array,
}
export default OwnerProductList
