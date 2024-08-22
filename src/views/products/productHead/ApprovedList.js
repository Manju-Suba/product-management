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
import { getDecodeData, getHeaders, ImageUrl } from 'src/constant/Global'
import profileImage1 from '../../../assets/images/avatars/wrapper.png'
import PropTypes from 'prop-types'
import { CaretDownOutlined } from '@ant-design/icons'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatAmountWithCommas } from 'src/constant/TimeUtils'
import EditSvg from '../../svgImages/EditSvg'
import ViewProduct from '../ViewProduct'
import useAxios from 'src/constant/UseAxios'
import EyeSvg from '../../svgImages/EyeSvg'
import InfiniteScroll from 'react-infinite-scroll-component'
import Downarrowimg from '../../../assets/images/downarrow.png'
import CrossSvg from '../../svgImages/CrossSvg'
import { Link } from 'react-router-dom'

const ApprovedList = ({
  formatDate,
  FlowList,
  prodOwnerList,
  techOwnerList,
  dataOwnerList,
  categories,
  techHeadList,
  prodHeadList,
  dataHeadList,
}) => {
  let api = useAxios()
  const user = getDecodeData()
  const branch = user && user.branch
  const [productId, setProductId] = useState()
  const [tableData, setTableData] = useState([])
  const [productNames, setProductNames] = useState([])
  const [ViewProductData, setViewProductData] = useState([])
  const [ViewProductShow, setViewProductShow] = useState(false)
  const [commonLoader, setCommonLoader] = useState(true)
  const [abortController, setAbortController] = useState(new AbortController())
  const selectRef = useRef(null)
  // const [hasMore, setHasMore] = useState(true)
  const hasMoreRef = useRef(true)
  const pageRef = useRef(0)
  const searchRef = useRef(false)
  const productRef = useRef(0)
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
        getProductList()
      }
    }
  }

  const getProductList = async () => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setTableData([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    const url = `product/list?page=${pageRef.current}&size=10&search=${searchRef.current}&status=Approved&value=${productRef.current}`
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

  const techOwnerOptions = techOwnerList.map((user) => ({
    value: user.name,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px', borderRadius: '14px' } : { width: '39px' }}
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
  const prodOwnerOptions = prodOwnerList.map((user) => ({
    value: user.name,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px', borderRadius: '14px' } : { width: '39px' }}
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
  const dataOwnerOptions = dataOwnerList.map((user) => ({
    value: user.name,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px', borderRadius: '14px' } : { width: '39px' }}
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
  const [showCardLists, setShowCardLists] = useState({})
  const [assignCard, setAssignCard] = useState({})
  const handleEditClick = (rowId) => {
    setAssignCard({})
    setShowCardLists((prevState) => ({
      ...prevState,
      [rowId]: !prevState[rowId], // Toggle the visibility for the specific row
    }))
  }
  const handleClose = () => {
    setShowCardLists({})
  }
  const handleClose1 = () => {
    setAssignCard({})
  }
  const handleEditClick1 = (rowId) => {
    setShowCardLists({})
    setAssignCard((prevState) => ({
      ...prevState,
      [rowId]: !prevState[rowId], // Toggle the visibility for the specific row
    }))
  }
  const handleAccessChange = async (selectedOptions, id) => {
    let ownerId
    if (selectedOptions && selectedOptions.length > 0) {
      const selectedowners = selectedOptions.map((option) => ({
        id:
          user?.designation === 'Technical Head'
            ? Number(techOwnerList.find((user) => user.name === option.value)?.id || '')
            : user?.designation === 'Product Head'
            ? Number(prodOwnerList.find((user) => user.name === option.value)?.id || '')
            : Number(dataOwnerList.find((user) => user.name === option.value)?.id || ''),
        name: option.value,
      }))
      ownerId = selectedowners.map((option) => option.id)
    } else {
      ownerId = []
    }
    let prod_id, owner, tech_id, data_id
    if (user?.designation === 'Technical Head') {
      owner = 'technical'
      prod_id = null
      tech_id = ownerId
      data_id = null
    } else if (user?.designation === 'Product Head') {
      owner = 'product'
      prod_id = ownerId
      data_id = null
      tech_id = null
    } else {
      owner = 'data'
      prod_id = null
      tech_id = null
      data_id = ownerId
    }

    // const postData = {
    //   prodOwner: prod_id,
    //   techOwner: tech_id,
    // }
    const formData = new FormData()
    formData.append('prodOwner', prod_id)
    formData.append('techOwner', tech_id)
    formData.append('dataOwner', data_id)
    const url = `product/assign/${id}?owner=${owner}`
    await api
      .put(url, formData, {
        headers: getHeaders('multi'),
      })
      .then((res) => {
        pageRef.current = 0
        searchRef.current = false
        productRef.current = 0
        getProductList()
      })
      .catch((error) => {
        toast.error(error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
      })
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
  const closeViewProduct = () => {
    setViewProductShow(false)
  }
  const getProductNames = async () => {
    const url = `product/head/search?status=Approved`
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
      {ViewProductShow ? (
        <ViewProduct
          flowList={FlowList}
          close={closeViewProduct}
          techHeadList={techHeadList}
          prodHeadList={prodHeadList}
          dataHeadList={dataHeadList}
          categories={categories}
          ViewProductData={ViewProductData}
          viewStatus="Head"
          titleList="Approved List"
          ownerOption={
            branch === 'Technical'
              ? techOwnerOptions
              : branch === 'Product'
              ? prodOwnerOptions
              : dataOwnerOptions
          }
        />
      ) : (
        <>
          <CRow className="mt-3">
            <CCol xs={9} sm={9} md={10}>
              <b style={{ marginLeft: '30px' }}>Approved List</b>
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
                        Approved List
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>

            <CCol xs={3} sm={3} md={2}>
              <Select
                ref={selectRef}
                className="contract_members_activity_select custom-select_appr appr-sel"
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
                      width="8%"
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
                      width="25%"
                    >
                      {user?.designation === 'Technical Head'
                        ? 'Technical Owners'
                        : user?.designation === 'Product Head'
                        ? 'Product Owners'
                        : 'Data Owners'}
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="table-head-productlist text-c"
                      scope="col"
                      width="5%"
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
                        <CTableDataCell className="productflow-product-head pad-bottom_flow">
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
                        <CTableDataCell className="productflow-product-head pad-bottom_flow">
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
                                style={{ width: '230px', height: '120px', overflowY: 'auto' }}
                                className="Access-card"
                              >
                                {row.approvalFlow.map((member) => (
                                  <div key={member.id}>
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
                        <CTableDataCell
                          className="text-c  pad-bottom_flow  "
                          style={{ border: '1px solid #f1f1f1' }}
                        >
                          {user &&
                          ((user.designation === 'Technical Head' &&
                            row.technicalOwners.length > 0) ||
                            (user.designation === 'Product Head' && row.productOwners.length > 0) ||
                            (user.designation === 'Data Head' && row.dataOwners.length > 0)) ? (
                            <div className="table-cell-container d-flex table-cell-container-border-less">
                              <div className="image-background-accessperson">
                                {(user?.designation === 'Technical Head'
                                  ? row.technicalOwners
                                  : user?.designation === 'Product Head'
                                  ? row.productOwners
                                  : row.dataOwners
                                )
                                  .slice(0, 3)
                                  .map((member, index) => (
                                    <div className="accessPerImg" key={index}>
                                      <div className="tooltip-container">
                                        <img
                                          src={
                                            member.profilePic
                                              ? ImageUrl + member.profilePic
                                              : profileImage1
                                          }
                                          className={
                                            member.profilePic ? 'first-image' : 'second-image'
                                          }
                                          alt="Access Person Images"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                <div>
                                  {(user?.designation === 'Technical Head'
                                    ? row.technicalOwners
                                    : user?.designation === 'Product Head'
                                    ? row.productOwners
                                    : row.dataOwners
                                  ).length > 3 && (
                                    <div className="accessPerImg text-center more-person-access rounded-circle">
                                      <span>
                                        {' '}
                                        +
                                        {(user?.designation === 'Technical Head'
                                          ? row.technicalOwners
                                          : user?.designation === 'Product Head'
                                          ? row.productOwners
                                          : row.dataOwners
                                        ).length - 3}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="card-list-person_owners">
                                  <Card
                                    style={{ width: '230px', height: '250px', overflowY: 'auto' }}
                                    className="Access-card"
                                  >
                                    {(user?.designation === 'Technical Head'
                                      ? row.technicalOwners
                                      : user?.designation === 'Product Head'
                                      ? row.productOwners
                                      : row.dataOwners
                                    )
                                      // .slice(0, 3)
                                      .map((member) => (
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
                                              style={
                                                member.profilePic ? { marginLeft: '11px' } : {}
                                              }
                                            >
                                              <p className="member-user-name1"> {member.name}</p>
                                              <p className="member-role-text1">
                                                {member.designation}
                                              </p>
                                            </div>
                                          </div>
                                          <Divider />
                                        </div>
                                      ))}
                                  </Card>
                                </div>
                              </div>
                              <div
                                style={{ marginLeft: 'auto' }}
                                className="edit_techow"
                                onClick={() => handleEditClick(row.id)}
                              >
                                <button
                                  type="button"
                                  className="action-view  edit-button "
                                  // onClick={() => handleUserEditClick(row.id)}
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
                                {showCardLists[row.id] && (
                                  <div
                                    className="card-list-person_owners_add"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Card style={{ width: '517px' }} className="Access-card">
                                      <button
                                        className="btn border-0 text-c text-secondary cross-button"
                                        style={{ position: 'absolute', top: 0, right: 0 }}
                                        onClick={() => handleClose()}
                                      >
                                        <CrossSvg
                                          width="12"
                                          height="11"
                                          viewBox="0 0 14 10"
                                          fill="#A5A1A1"
                                        />
                                      </button>
                                      <Select
                                        onClick={(e) => e.stopPropagation()}
                                        className="form-custom-selects access-input-box_owner"
                                        value={
                                          row.technicalOwners
                                            ? user?.designation === 'Technical Head'
                                              ? techOwnerOptions.filter((option) =>
                                                  row.technicalOwners.some(
                                                    (selected) => selected.name === option.value,
                                                  ),
                                                )
                                              : user?.designation === 'Product Head'
                                              ? prodOwnerOptions.filter((option) =>
                                                  row.productOwners.some(
                                                    (selected) => selected.name === option.value,
                                                  ),
                                                )
                                              : dataOwnerOptions.filter((option) =>
                                                  row.dataOwners.some(
                                                    (selected) => selected.name === option.value,
                                                  ),
                                                )
                                            : null
                                        }
                                        options={
                                          user?.designation === 'Technical Head'
                                            ? techOwnerOptions
                                            : user?.designation === 'Product Head'
                                            ? prodOwnerOptions
                                            : dataOwnerOptions
                                        }
                                        onChange={(selectedOptions) =>
                                          handleAccessChange(selectedOptions, row.id)
                                        }
                                        required
                                        showSearch
                                        placeholder="Choose Access"
                                        allowClear
                                        mode="multiple"
                                        variant={'borderless'}
                                        suffixIcon={<CaretDownOutlined className="caretdownicon" />}
                                        labelInValue={(option) => (
                                          <div className="select-options select-options-approval">
                                            <img
                                              src={
                                                option.profile_pic
                                                  ? ImageUrl + option.profile_pic
                                                  : profileImage1
                                              }
                                              style={
                                                option.profile_pic
                                                  ? { width: '29px', borderRadius: '14px' }
                                                  : { width: '39px' }
                                              }
                                              alt={option.value}
                                              className="img-flag"
                                            />
                                            <div
                                              className="node1"
                                              style={
                                                option.profile_pic ? { marginLeft: '11px' } : {}
                                              }
                                            >
                                              <p className="user-name1">{option.value}</p>
                                              <p className="role-text1">{option.label.role}</p>
                                            </div>
                                          </div>
                                        )}
                                      />
                                    </Card>
                                  </div>
                                )}
                              </div>

                              {/* <div className="card-list-person_owners">
                              <Card style={{ width: '250px' }} className="Access-card">
                                {row.technicalOwners.slice(0, 3).map((member) => (
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
                            </div> */}
                            </div>
                          ) : (
                            <div>
                              <p
                                className="text-danger"
                                onClick={() => handleEditClick1(row.id)}
                                style={{ fontSize: '13px', cursor: 'pointer' }}
                              >
                                Assign
                              </p>
                              {assignCard[row.id] && (
                                <div
                                  className="card-list-person_owners_add_default"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Card style={{ width: '517px' }} className="Access-card_add">
                                    <button
                                      className="btn border-0 text-c text-secondary cross-button"
                                      style={{ position: 'absolute', top: 0, right: 0 }}
                                      onClick={() => handleClose1()}
                                    >
                                      <CrossSvg
                                        width="12"
                                        height="11"
                                        viewBox="0 0 14 10"
                                        fill="#A5A1A1"
                                      />
                                    </button>
                                    <Select
                                      onClick={(e) => e.stopPropagation()}
                                      className="form-custom-selects access-input-box_owner test"
                                      value={
                                        row.technicalOwners
                                          ? user && user.designation === 'Technical Head'
                                            ? techOwnerOptions.filter((option) =>
                                                row.technicalOwners.some(
                                                  (selected) => selected.name === option.value,
                                                ),
                                              )
                                            : prodOwnerOptions.filter((option) =>
                                                row.technicalOwners.some(
                                                  (selected) => selected.name === option.value,
                                                ),
                                              )
                                          : null
                                      }
                                      options={
                                        user && user.designation === 'Technical Head'
                                          ? techOwnerOptions
                                          : prodOwnerOptions
                                      }
                                      onChange={(selectedOptions) =>
                                        handleAccessChange(selectedOptions, row.id)
                                      }
                                      required
                                      showSearch
                                      placeholder="Choose Access"
                                      allowClear
                                      mode="multiple"
                                      // bordered={false}
                                      suffixIcon={<CaretDownOutlined className="caretdownicon" />}
                                      labelInValue={(option) => (
                                        <div className="select-options select-options-approval">
                                          <img
                                            src={
                                              option.profile_pic
                                                ? ImageUrl + option.profile_pic
                                                : profileImage1
                                            }
                                            style={
                                              option.profile_pic
                                                ? { width: '29px', borderRadius: '14px' }
                                                : { width: '39px' }
                                            }
                                            alt={option.value}
                                            className="img-flag"
                                          />
                                          <div
                                            className="node1"
                                            style={option.profile_pic ? { marginLeft: '11px' } : {}}
                                          >
                                            <p className="user-name1">{option.value}</p>
                                            <p className="role-text1">{option.label.role}</p>
                                          </div>
                                        </div>
                                      )}
                                    />
                                  </Card>
                                </div>
                              )}
                            </div>
                          )}
                        </CTableDataCell>
                        <CTableDataCell className="productflow-product-Action pad-bottom_flow text-center td-product-text">
                          <button
                            type="button"
                            className="btn border-0 text-c text-secondary cross-button"
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                            onClick={() => handleProductView(row.id)}
                          >
                            <EyeSvg width="13" height="13" viewBox="0 0 20 16" fill="#A5A1A1" />
                          </button>
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

ApprovedList.propTypes = {
  formatDate: PropTypes.func,
  FlowList: PropTypes.array,
  prodOwnerList: PropTypes.array,
  techOwnerList: PropTypes.array,
  dataOwnerList: PropTypes.array,
  categories: PropTypes.array,
  techHeadList: PropTypes.array,
  prodHeadList: PropTypes.array,
  dataHeadList: PropTypes.array,
}
export default ApprovedList
