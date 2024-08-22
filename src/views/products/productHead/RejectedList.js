import React, { useState, useEffect, useRef } from 'react'
import { Select, Breadcrumb, Tooltip, Card, Divider, Row, Skeleton } from 'antd'
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
import { formatAmountWithCommas } from '../../../constant/TimeUtils'
import 'react-toastify/dist/ReactToastify.css'
import ViewProduct from '../ViewProduct'
import infoIcon from '../../../assets/images/info-icon.png'
import stage from '../../../assets/images/form/stage.png'
import stage1 from '../../../assets/images/form/stage-p.png'
import stage2 from '../../../assets/images/form/stage-a.png'
import stage3 from '../../../assets/images/form/stage-r.png'
import useAxios from 'src/constant/UseAxios'
import EditSvg from '../../svgImages/EditSvg'
import EditRejectedProduct from './EditRejectedProduct'
import EyeSvg from '../../svgImages/EyeSvg'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ToastContainer } from 'react-toastify'
import Downarrowimg from '../../../assets/images/downarrow.png'
import { Link } from 'react-router-dom'

const RejectedList = ({
  formatDate,
  FlowList,
  categories,
  techHeadList,
  prodHeadList,
  dataHeadList,
}) => {
  let api = useAxios()
  const [productId, setProductId] = useState()
  const [tableData, setTableData] = useState([])
  const [productNames, setProductNames] = useState([])
  const [ViewProductData, setViewProductData] = useState([])
  const [ViewProductShow, setViewProductShow] = useState(false)
  const [commonLoader, setCommonLoader] = useState(true)
  const [EditProductData, setEditProductData] = useState([])
  const [EditProductShow, setEditProductShow] = useState(false)
  const [abortController, setAbortController] = useState(new AbortController())
  const hasMoreRef = useRef(true)
  const pageRef = useRef(0)
  const searchRef = useRef(false)
  const productRef = useRef(0)
  const selectRef = useRef(null)
  const [pLoader, setPLoader] = useState(true)

  useEffect(() => {
    if (!ViewProductShow && !EditProductShow) {
      pageRef.current = 0
      hasMoreRef.current = true
      getProductList()
      getProductNames()
      const tableContainer = document.querySelector('.table-container')
      tableContainer.addEventListener('scroll', handleScroll)
      return () => {
        tableContainer.removeEventListener('scroll', handleScroll)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ViewProductShow, EditProductShow])

  const handleScroll = () => {
    const tableContainer = document.querySelector('.table-container')
    if (tableContainer.scrollTop + tableContainer.clientHeight === tableContainer.scrollHeight) {
      if (hasMoreRef.current === true) {
        getProductList()
      }
    }
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
    const url = `product/list?page=${pageRef.current}&size=10&search=${searchRef.current}&status=Rejected&value=${productRef.current}`
    api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        const data = response.data.data
        if (pageRef.current === 0) setTableData(data)
        else setTableData((prevUserData) => [...prevUserData, ...data])
        if (data.length < 10) {
          hasMoreRef.current = false
        }

        // Increment the page number for the next fetch
        pageRef.current = pageRef.current + 1
        setCommonLoader(false)
      })
      .catch((error) => {})
  }

  const handleProductView = async (id) => {
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

  const handleProduct = (value) => {
    if (value === undefined) {
      setProductId()
      searchRef.current = false
      productRef.current = 0
    } else {
      setProductId(value)
      searchRef.current = true
      productRef.current = value
    }
    selectRef.current.blur()
    pageRef.current = 0
    hasMoreRef.current = true
    getProductList()
  }

  const closeViewProduct = () => {
    setViewProductShow(false)
  }

  const openEditProduct = (id) => {
    handleEdit(id)
    setEditProductShow(true)
  }

  const closeEditProduct = () => {
    setEditProductShow(false)
  }

  const handleEdit = async (id) => {
    const url = `approval/product/reject/` + id
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        setEditProductData(data)
      })
      .catch((error) => {})
  }

  const getProductNames = async () => {
    const url = `product/head/search?status=Rejected`
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

  return (
    <>
      <ToastContainer />
      {EditProductShow ? (
        <EditRejectedProduct
          flowList={FlowList}
          close={closeEditProduct}
          techHeadList={techHeadList}
          prodHeadList={prodHeadList}
          dataHeadList={dataHeadList}
          categories={categories}
          EditProductData={EditProductData}
        />
      ) : ViewProductShow ? (
        <ViewProduct
          flowList={FlowList}
          close={closeViewProduct}
          techHeadList={techHeadList}
          prodHeadList={prodHeadList}
          dataHeadList={dataHeadList}
          categories={categories}
          ViewProductData={ViewProductData}
          viewStatus="View"
          titleList="Rejected List"
          ownerOption={[]}
        />
      ) : (
        <>
          <CRow className="mt-3">
            <CCol xs={9} sm={9} md={10}>
              <b style={{ marginLeft: '30px' }}>Rejected List</b>
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
                        Rejected List
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>

            <CCol xs={3} sm={3} md={2}>
              <Select
                style={{ width: '90%' }}
                ref={selectRef}
                className="contract_members_activity_select custom-select_rej rej-sel"
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt="Downarrowimg"
                    style={{ width: '10px', height: '6px' }}
                  />
                }
                id="products"
                value={productId}
                onChange={(value) => handleProduct(value)}
                showSearch
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
                      width="8%"
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
                      Approver Status
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c text-center"
                      scope="col"
                      width="15%"
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
                      <CTableRow key={index}>
                        <CTableDataCell className="productflow-col-box text-c pad-bottom_flow td-product-text">
                          {index + 1}
                        </CTableDataCell>
                        <CTableDataCell
                          className="productflow-product-name pad-bottom_flow td-product-text"
                          onClick={() => handleProductView(row.id)}
                        >
                          <Tooltip
                            placement="bottomLeft"
                            title={row.productName}
                            className="productflow-name-lable"
                          >
                            {row.productName}
                          </Tooltip>
                        </CTableDataCell>
                        <CTableDataCell
                          className=" productflow-product-flow pad-bottom_flow td-product-text"
                          onClick={() => handleProductView(row.id)}
                        >
                          <Tooltip
                            placement="bottomLeft"
                            title={row.flowName ? row.flowName : ''}
                            className="flow-name-lable"
                          >
                            {row.flowName ? row.flowName : ''}
                          </Tooltip>
                        </CTableDataCell>
                        <CTableDataCell
                          className="productflow-product-head pad-bottom_flow"
                          onClick={() => handleProductView(row.id)}
                        >
                          {row.prodHead.length !== 0
                            ? row.prodHead.map((data) => {
                                return (
                                  <div
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    key={data.id}
                                  >
                                    <img
                                      src={
                                        data.profilePic ? ImageUrl + data.profilePic : profileImage1
                                      }
                                      alt="Profile"
                                      className="head-td"
                                    />
                                    <div className="node1" style={{ marginTop: '7px' }}>
                                      <p className="head-td-name" title={data.name}>
                                        {data.name}
                                      </p>
                                      <p className="head-td-role" title={data.designation}>
                                        {data.designation}
                                      </p>
                                    </div>
                                  </div>
                                )
                              })
                            : '---'}
                        </CTableDataCell>
                        <CTableDataCell
                          className="productflow-product-head pad-bottom_flow"
                          onClick={() => handleProductView(row.id)}
                        >
                          {row.techHead.length !== 0
                            ? row.techHead.map((data) => {
                                return (
                                  <div
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    key={data.id}
                                  >
                                    <img
                                      src={
                                        data.profilePic ? ImageUrl + data.profilePic : profileImage1
                                      }
                                      alt="Profile"
                                      className="head-td"
                                    />
                                    <div className="node1" style={{ marginTop: '7px' }}>
                                      <p className="head-td-name" title={data.name}>
                                        {data.name}
                                      </p>
                                      <p className="head-td-role" title={data.designation}>
                                        {data.designation}
                                      </p>
                                    </div>
                                  </div>
                                )
                              })
                            : '---'}
                        </CTableDataCell>
                        <CTableDataCell
                          className="productflow-product-head pad-bottom_flow"
                          onClick={() => handleProductView(row.id)}
                        >
                          {row.dataHead.length !== 0
                            ? row.dataHead.map((data) => {
                                return (
                                  <div
                                    style={{ display: 'flex', alignItems: 'center' }}
                                    key={data.id}
                                  >
                                    <img
                                      src={
                                        data.profilePic ? ImageUrl + data.profilePic : profileImage1
                                      }
                                      alt="Profile"
                                      className="head-td"
                                    />
                                    <div className="node1" style={{ marginTop: '7px' }}>
                                      <p className="head-td-name" title={data.name}>
                                        {data.name}
                                      </p>
                                      <p className="head-td-role" title={data.designation}>
                                        {data.designation}
                                      </p>
                                    </div>
                                  </div>
                                )
                              })
                            : '---'}
                        </CTableDataCell>
                        <CTableDataCell
                          className="productflow-product-Startdate pad-bottom_flow td-product-text"
                          onClick={() => handleProductView(row.id)}
                        >
                          {formatDate(row.startDate)}
                        </CTableDataCell>
                        <CTableDataCell
                          className="productflow-product-Enddate pad-bottom_flow td-product-text"
                          onClick={() => handleProductView(row.id)}
                        >
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
                        <CTableDataCell
                          className="productflow-product-budget pad-bottom_flow td-product-text"
                          onClick={() => handleProductView(row.id)}
                        >
                          {row.budgetDetails !== 'undefined' &&
                          row.budgetDetails !== '' &&
                          row.budgetDetails !== null
                            ? formatAmountWithCommas(row.budgetDetails, row.currency)
                            : '---'}
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-technical pad-bottom_flow">
                          <div className="approver-status-td">
                            <button className="rejected-status" style={{ cursor: 'pointer' }}>
                              <span>{row.approvalStatus}</span>
                            </button>
                            <div className="tooltip-trigger">
                              <img
                                src={infoIcon}
                                style={{ width: '17px', height: '17px', cursor: 'pointer' }}
                                alt="info"
                              />
                              <div className="tooltip-container-approvals">
                                <div
                                  style={{ width: '200px', minHeight: '85px', borderRadius: '7px' }}
                                  className="flow-card"
                                >
                                  {row.approvalFlow.slice(0, 3).map((approver, approverIndex) => (
                                    <div key={approverIndex}>
                                      <Row
                                        className="align-items-center"
                                        style={{ margin: '16px' }}
                                      >
                                        {/* Stage Image */}
                                        <div className="col-md-1">
                                          <img
                                            alt="stages"
                                            style={{ width: '12px' }}
                                            className="content-img appr_img"
                                            src={
                                              approver.approvalStatus === 'Pending'
                                                ? stage1
                                                : approver.approvalStatus === 'Approved'
                                                ? stage2
                                                : approver.approvalStatus === 'Rejected'
                                                ? stage3
                                                : stage
                                            }
                                          />
                                        </div>

                                        {/* Vertical Line */}
                                        <div className="col-md-1">
                                          <div className="vertical-line-appr"></div>
                                        </div>

                                        {/* Profile details */}
                                        <div className="col-md-2">
                                          <img
                                            alt="profile"
                                            className="appr-img-td"
                                            src={
                                              approver.profilePic
                                                ? ImageUrl + approver.profilePic
                                                : profileImage1
                                            }
                                          />
                                        </div>
                                        <div
                                          className="col-md-8 name_role"
                                          style={{ paddingLeft: '10px' }}
                                        >
                                          <p
                                            className="head-td-name"
                                            style={{ marginTop: '21px' }}
                                            title={approver.name}
                                          >
                                            {approver.name}
                                          </p>
                                          <p className="head-td-role" title={approver.designation}>
                                            {approver.designation}
                                          </p>
                                        </div>
                                      </Row>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-technical text-center pad-bottom_flow">
                          <div className="action_table_product">
                            <button
                              type="button"
                              className="btn border-0 text-c text-secondary cross-button view_icon_rej"
                              style={{ fontSize: '12px', padding: '4px 8px' }}
                              onClick={() => handleProductView(row.id)}
                            >
                              <EyeSvg width="13" height="13" viewBox="0 0 20 16" fill="#A5A1A1" />
                            </button>
                            <button
                              type="button"
                              className="action-view  edit-button edit_svg_product"
                              style={{ marginTop: '10px' }}
                              onClick={() => openEditProduct(row.id)}
                            >
                              <EditSvg
                                width="15"
                                height="15"
                                viewBox="0 0 18 18"
                                fill="none"
                                color="white"
                                clipH="18"
                                clipW="18"
                              />
                            </button>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
              {(tableData === null && !commonLoader) ||
              (tableData.length === 0 && !commonLoader) ? (
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
      )}
    </>
  )
}

RejectedList.propTypes = {
  formatDate: PropTypes.func,
  FlowList: PropTypes.array,
  categories: PropTypes.array,
  techHeadList: PropTypes.array,
  prodHeadList: PropTypes.array,
  dataHeadList: PropTypes.array,
}
export default RejectedList
