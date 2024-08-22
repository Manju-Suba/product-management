import React, { useState, useEffect, useRef } from 'react'
import { Select, Breadcrumb, Tooltip, Card, Divider, Checkbox, Skeleton } from 'antd'
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
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatAmountWithCommas } from 'src/constant/TimeUtils'
import CheckSvg from '../../svgImages/CheckSvg'
import CrossSvg from '../../svgImages/CrossSvg'
import RejectConfirmModal from '../../modal/RejectConfirmModal'
import ViewProduct from '../ViewProduct'
import useAxios from 'src/constant/UseAxios'
import EyeSvg from '../../svgImages/EyeSvg'
import InfiniteScroll from 'react-infinite-scroll-component'
import ApprovedConfirmModal from '../../modal/ApprovedConfirmModel'
import Downarrowimg from '../../../assets/images/downarrow.png'
import { Link } from 'react-router-dom'
const CustomDropdownRender = (menu) => {
  return (
    <div style={{ overflow: 'auto' }} role="listbox">
      {menu}
    </div>
  )
}

export { CustomDropdownRender }
const ProductList = ({ FlowList, categories, techHeadList, prodHeadList, dataHeadList }) => {
  let api = useAxios()
  const [productId, setProductId] = useState()
  const [tableData, setTableData] = useState([])
  const [productNames, setProductNames] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [headerLabel, setHeaderLabel] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewProductShow, setViewProductShow] = useState(false)
  const [openSelectAll, setOpenSelectAll] = useState(false)
  const [approvedStatusAll, setApprovedStatusAll] = useState('')
  const [openSelectRejectAll, setOpenSelectRejectAll] = useState(false)
  const [viewProductData, setViewProductData] = useState({})
  const [singleApprovedId, setSingleApprovedId] = useState('')
  const [approvedStatus, setApprovedStatus] = useState('')
  const [abortController, setAbortController] = useState(new AbortController())
  const [open, setOpen] = useState(false)
  const [singleId, setSingleId] = useState()
  const pageRef = useRef(0)
  // const [hasMore, setHasMore] = useState(true)
  const hasMoreRef = useRef(true)
  const statusRef = useRef('Pending')
  const searchRef = useRef(false)
  const productRef = useRef(0)
  const selectRef = useRef(null)
  const [pLoader, setPLoader] = useState(true)

  const showPopconfirm = (status, rowId) => {
    setOpen(true)
    setSingleApprovedId(rowId)
    setApprovedStatus(status)
  }
  const handleApproveCancel = () => {
    setOpen(false)
  }
  const showPopconfirmAll = (status) => {
    if (status === 'Approved') {
      setOpenSelectAll(true)
      setApprovedStatusAll('Approved')
    } else if (status === 'Rejected') {
      setOpenSelectRejectAll(true)
      setApprovedStatusAll('Rejected')
    }
  }
  const handleApproveCancelAll = () => {
    setOpenSelectAll(false)
  }

  useEffect(() => {
    getProductNames()
    if (!viewProductShow) {
      hasMoreRef.current = true
      getProductList()
      const tableContainer = document.querySelector('.table-container')
      tableContainer.addEventListener('scroll', handleScroll)
      return () => {
        tableContainer.removeEventListener('scroll', handleScroll)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewProductShow])

  const handleScroll = () => {
    const tableContainer = document.querySelector('.table-container')
    if (tableContainer.scrollTop + tableContainer.clientHeight === tableContainer.scrollHeight) {
      if (hasMoreRef.current === true) {
        getProductList()
      }
    }
  }

  const handleHeaderCheck = (isChecked) => {
    if (isChecked) {
      const allRowIds = tableData.map((row) => row.id)
      setSelectedRows(allRowIds)
      setHeaderLabel(`${allRowIds.length} Selected`)
    } else {
      setSelectedRows([])
      setHeaderLabel('')
    }
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
    const url = `approval/product/list?page=${pageRef.current}&size=10&search=${searchRef.current}&status=${statusRef.current}&value=${productRef.current}`
    await api
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

  const handleButtonClick = async (status, id, remarksValue) => {
    if (approvedStatusAll === 'Rejected' && remarksValue === '') {
      toast.error('Please Enter Remarks!..', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
    } else {
      return await statuschange(approvedStatusAll, selectedRows, remarksValue)
    }
  }
  const statuschange = async (statusValue, id, remarks) => {
    const postData = {
      status: statusValue,
      remarks: remarks,
    }

    const url = `approval/product/approve/` + id
    try {
      const response = await api.put(url, postData, {
        headers: getHeaders('json'),
      })
      if (response?.data) {
        const message = `Product ${statusValue} Successfully`
        toast.success(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000,
        })
        return response.data
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
      throw error // Rethrow the error so it can be caught by the caller
    }
  }

  const resetFormValues = () => {
    setIsModalOpen(false)
    setOpen(false)
    setOpenSelectAll(false)
    setOpenSelectRejectAll(false)
    setSelectedRows([])
    setHeaderLabel('')
    pageRef.current = 0
    productRef.current = 0
    searchRef.current = false
    statusRef.current = 'Pending'
    getProductList()
  }
  const showModal = (id) => {
    setIsModalOpen(true)
    setSingleId(id)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const handleRejectProduct = async (status, id, remarks) => {
    return await statuschange(status, id, remarks)
  }

  const handleApproved = async (status, singleApprovedId, remarks) => {
    return await statuschange(approvedStatus, singleApprovedId, remarks)
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
    const url = `/approval/product/search?status=${statusRef.current}`
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
  const handleRejectCancelAll = () => {
    setOpenSelectRejectAll(false)
  }

  const displayContent = commonLoader ? (
    <div className="text-c text-center my-3 td-text">
      <CSpinner color="danger" />
    </div>
  ) : (
    <div></div>
  )

  return (
    <>
      <ToastContainer />
      {viewProductShow ? (
        <ViewProduct
          flowList={FlowList}
          close={closeViewProduct}
          techHeadList={techHeadList}
          prodHeadList={prodHeadList}
          dataHeadList={dataHeadList}
          categories={categories}
          viewProductData={viewProductData}
          viewStatus="View"
          titleList="Pending List"
          ownerOption={[]}
        />
      ) : (
        <>
          <CRow className="mt-3">
            <CCol md={10}>
              <b style={{ paddingLeft: '30px' }}>Pending List</b>
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
                        Pending List
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>

            <CCol sm={2}>
              <Select
                ref={selectRef}
                className="contract_members_activity_select custom_prod_pend"
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
                dropdownRender={CustomDropdownRender}
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

          <div className="table-container  table_scroll" style={{ border: 'none' }}>
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
              <CTable className="flowlist-fulltable" hover>
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
                          checked={selectedRows.length === tableData.length && tableData.length}
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
                        className="table-head-productlist text-c text-center"
                        scope="col"
                        width="10%"
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
                          checked={selectedRows.length === tableData.length && tableData.length}
                          onChange={(e) => handleHeaderCheck(e.target.checked)}
                        />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="table-head-selected  text-c " colSpan="7">
                        <span style={{ color: '#f50505' }}>{headerLabel}</span>
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="table-head-selected "
                        colSpan="7"
                        style={{ textAlign: 'right' }}
                      >
                        <div
                          className="action-request"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            marginRight: '36px',
                          }}
                        >
                          {/* <TextArea
                            id="Description"
                            bordered={false}
                            value={remarksValue}
                            onChange={handleRemarksChange}
                            style={{ color: 'black' }}
                            placeholder="Enter Remarks..."
                            autoSize={{
                              minRows: 0,
                              maxRows: 1,
                            }}
                          /> */}
                          <button
                            className="btn border-0 text-c text-secondary "
                            style={{ fontSize: '12px' }}
                            type="button"
                            onClick={() => showPopconfirmAll('Approved')}
                          >
                            <CheckSvg width="11" height="9" viewBox="0 0 14 10" fill="#00ab55" />
                          </button>
                          <button
                            className="btn border-0 text-c text-secondary "
                            style={{ fontSize: '12px', padding: '2px' }}
                            onClick={() => {
                              showPopconfirmAll('Rejected')
                            }}
                          >
                            <CrossSvg width="9" height="11" viewBox="0 0 14 10" fill="#e40e2d" />
                          </button>
                        </div>
                      </CTableHeaderCell>
                    </CTableRow>
                  )}
                </CTableHead>
                <CTableBody>
                  {!tableData ? (
                    <div></div>
                  ) : (
                    tableData.map((row, index) => (
                      <CTableRow key={row.id} className="tr-bg-color">
                        <CTableDataCell
                          className={`text-c text-center pd-text1 grid-cell ${
                            selectedRows.includes(row.id) ? 'checked-table-row' : ''
                          }`}
                          width="6%"
                        >
                          <Checkbox
                            className="checkbox_design"
                            id={`flexCheckDefault-${index}`}
                            value={row.id}
                            checked={selectedRows.includes(row.id)}
                            onChange={(e) => {
                              handleMemberCheck(row.id, e.target.checked)
                            }}
                          />
                        </CTableDataCell>
                        <CTableDataCell
                          className="productflow-col-box text-c pad-bottom_flow td-product-text"
                          width="5%"
                        >
                          {index + 1}
                        </CTableDataCell>
                        <CTableDataCell
                          className="productflow-product-name pad-bottom_flow td-product-text"
                          width="10%"
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
                          width="10%"
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
                          width="10%"
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
                          width="10%"
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
                          width="10%"
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
                          width="10%"
                        >
                          {formatDate(row.startDate)}
                        </CTableDataCell>
                        <CTableDataCell
                          className="productflow-product-Enddate pad-bottom_flow td-product-text"
                          width="10%"
                        >
                          {row.endDate !== null ? formatDate(row.endDate) : '--'}
                        </CTableDataCell>
                        <CTableDataCell
                          className="text-c flowlist-accesperson pad-bottom_flow"
                          width="10%"
                        >
                          <div className="table-cell-container">
                            <div className="image-background-accessperson">
                              {row.approvalFlow.slice(0, 3).map((member, index) => (
                                <div className="accessPerImg" key={row.id}>
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
                          width="10%"
                        >
                          {row.budgetDetails !== 'undefined' &&
                          row.budgetDetails !== '' &&
                          row.budgetDetails !== null
                            ? formatAmountWithCommas(row.budgetDetails, row.currency)
                            : '---'}
                        </CTableDataCell>

                        <CTableDataCell
                          className="productflow-product-Action pad-bottom_flow text-center td-product-text"
                          width="10%"
                        >
                          <button
                            className="btn border-0 text-c text-secondary check-button"
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                            disabled={selectedRows.includes(row.id)}
                            // onClick={() => handleApproved('Approved', row.id)}
                            onClick={() => showPopconfirm('Approved', row.id)}
                          >
                            <CheckSvg width="11" height="9" viewBox="0 0 14 10" fill="#A5A1A1" />
                          </button>
                          <button
                            className="btn border-0 text-c text-secondary cross-button"
                            style={{ fontSize: '12px', padding: '4px 8px' }}
                            onClick={() => showModal(row.id)}
                            disabled={selectedRows.includes(row.id)}
                          >
                            <CrossSvg width="9" height="11" viewBox="0 0 14 10" fill="#A5A1A1" />
                          </button>
                          <button
                            type="button"
                            className="btn border-0 text-c text-secondary cross-button"
                            style={{ fontSize: '13px', padding: '4px 8px' }}
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
              ) : (
                displayContent
              )}
            </InfiniteScroll>
          </div>
          {isModalOpen && (
            <RejectConfirmModal
              isModalOpen={isModalOpen}
              handleCancel={handleCancel}
              handleApprove={handleRejectProduct}
              id={singleId}
              headContent="Product"
              resetFunc={resetFormValues}
            />
          )}
          {open && (
            <ApprovedConfirmModal
              isModalOpen={open}
              handleCancel={handleApproveCancel}
              handleApprove={handleApproved}
              id={singleApprovedId}
              headContent="Product"
              resetFunc={resetFormValues}
            />
          )}
        </>
      )}
      {openSelectAll && (
        <ApprovedConfirmModal
          isModalOpen={openSelectAll}
          handleCancel={handleApproveCancelAll}
          handleApprove={handleButtonClick}
          headContent="Product"
          resetFunc={resetFormValues}
        />
      )}
      {openSelectRejectAll && (
        <RejectConfirmModal
          isModalOpen={openSelectRejectAll}
          handleCancel={handleRejectCancelAll}
          handleApprove={handleButtonClick}
          headContent="Product"
          resetFunc={resetFormValues}
        />
      )}
    </>
  )
}

ProductList.propTypes = {
  FlowList: PropTypes.array,
  categories: PropTypes.array,
  techHeadList: PropTypes.array,
  prodHeadList: PropTypes.array,
  dataHeadList: PropTypes.array,
}
export default ProductList
