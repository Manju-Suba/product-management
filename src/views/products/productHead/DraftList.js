import React, { useState, useEffect, useRef } from 'react'
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
import profileImage1 from '../../../assets/images/avatars/wrapper.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import { Breadcrumb, Checkbox, Card, Divider, Tooltip, Modal } from 'antd'
import DeleteSvg from '../../svgImages/DeleteSvg'
import EditProduct from './EditProduct'
import { formatAmountWithCommas } from 'src/constant/TimeUtils'
import useAxios from 'src/constant/UseAxios'
import EditSvg from '../../svgImages/EditSvg'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
const { confirm } = Modal
const DraftList = ({
  formatDate,
  FlowList,
  categories,
  techHeadList,
  prodHeadList,
  dataHeadList,
}) => {
  let api = useAxios()
  const [DraftTable, setDraftTable] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [headerLabel, setHeaderLabel] = useState('')
  const [EditProductShow, setEditProductShow] = useState(false)
  const [EditProductData, setEditProductData] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  // const [hasMore, setHasMore] = useState(true)
  const hasMoreRef = useRef(true)
  const pageRef = useRef(0)
  const searchRef = useRef(false)

  useEffect(() => {
    if (!EditProductShow) {
      pageRef.current = 0
      hasMoreRef.current = true
      getDraftList()
      const tableContainer = document.querySelector('.table-container')
      tableContainer.addEventListener('scroll', handleScroll)
      return () => {
        tableContainer.removeEventListener('scroll', handleScroll)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EditProductShow])

  const handleScroll = () => {
    const tableContainer = document.querySelector('.table-container')
    if (tableContainer.scrollTop + tableContainer.clientHeight === tableContainer.scrollHeight) {
      if (hasMoreRef.current === true) {
        getDraftList()
      }
    }
  }

  const getDraftList = async () => {
    const url = `product/list?page=${pageRef.current}&size=10&search=${searchRef.current}&status=Draft&value=0`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        if (pageRef.current === 0) setDraftTable(data)
        else setDraftTable((prevUserData) => [...prevUserData, ...data])
        if (data.length < 10) {
          hasMoreRef.current = false
        }

        pageRef.current = pageRef.current + 1
        setCommonLoader(false)
      })
      .catch((error) => {})
  }

  const handleHeaderCheck = (isChecked) => {
    if (isChecked) {
      const allRowIds = DraftTable.map((row) => row.id)
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

    const newSelectedRows = isChecked
      ? [...selectedRows, rowId]
      : selectedRows.filter((selectedId) => selectedId !== rowId)
    const newSelectedRowCount = newSelectedRows.length

    if (newSelectedRowCount < 1) {
      setHeaderLabel('')
    } else {
      setHeaderLabel(`${newSelectedRowCount} Selected`)
    }
  }

  const openEditProduct = (id) => {
    handleEdit(id)
    setEditProductShow(true)
  }

  const closeEditProduct = () => {
    setEditProductShow(false)
  }

  const handleEdit = async (id) => {
    const url = `product/view/` + id
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

  const deletefun = (id) => {
    const url = `product/delete/` + id
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        api
          .delete(url, {
            headers: getHeaders('json'),
          })
          .then((response) => {
            callDraftLists()
            setSelectedRows([])
            setHeaderLabel('')
            setEditProductShow(false)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }, 1000)
    })
  }

  const resetValues = () => {
    setSelectedRows([])
    setHeaderLabel('')
  }

  const callDraftList = () => {
    closeEditProduct()
    searchRef.current = false
    pageRef.current = 0
    // getDraftList()
  }

  const callDraftLists = () => {
    closeEditProduct()
    searchRef.current = false
    pageRef.current = 0
    getDraftList()
  }

  const warning = (id) => {
    confirm({
      title: 'Delete Draft product',
      content: 'Are you sure to delete this Draft product ?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelButtonProps: {
        style: { borderColor: '#f54550', color: 'black' },
      },
      closable: true,
      okButtonProps: {
        style: { borderColor: '#f54550', color: 'white', backgroundColor: '#f54550' },
      },
      cancelText: 'No',
      async onOk() {
        try {
          await deletefun(id)
          toast.success('Product Deleted Successfully', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
        } catch (error) {
          toast.error('Deletion failed', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
        }
      },
      onCancel() {
        resetValues()
      },
    })
  }

  return (
    <>
      <ToastContainer />
      {EditProductShow ? (
        <EditProduct
          flowList={FlowList}
          techHeadList={techHeadList}
          prodHeadList={prodHeadList}
          dataHeadList={dataHeadList}
          categories={categories}
          EditProductData={EditProductData}
          callBackFunc={callDraftList}
          title="Draft List"
        />
      ) : (
        <>
          <CRow className="m-3">
            <CCol md={4}>
              <b>Draft List</b>
              <br />
              <Breadcrumb
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
                        Draft List
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>
          </CRow>

          <div className="table-container table_scroll" style={{ border: 'none' }}>
            <InfiniteScroll
              dataLength={DraftTable.length}
              next={handleScroll}
              hasMore={hasMoreRef.current}
              loader={
                <div className="text-c text-center my-3 td-text">
                  <CSpinner color="danger" />
                </div>
              }
              endMessage={
                DraftTable.length !== 0 && (
                  <p style={{ textAlign: 'center' }}>
                    <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
                  </p>
                )
              }
            >
              <CTable className="flowlist-fulltable" hover>
                <CTableHead className="head-row">
                  {!headerLabel ? (
                    <CTableRow>
                      {DraftTable === null || DraftTable.length === 0 ? (
                        <CTableHeaderCell
                          className="table-head-draft  text-c text-center grid-cell-header check_box_position"
                          scope="col"
                          width="4%"
                        >
                          <Checkbox
                            id="flexCheckDefault"
                            onChange={(e) => handleHeaderCheck(e.target.checked)}
                            disabled={true}
                          />
                        </CTableHeaderCell>
                      ) : (
                        <CTableHeaderCell
                          className="table-head-draft text-center text-c grid-cell-header"
                          scope="col"
                          width="4%"
                          style={{ position: 'sticky', top: '0', zIndex: '12' }}
                        >
                          <Checkbox
                            id="flexCheckDefault"
                            className="checkbox_design"
                            checked={selectedRows.length === DraftTable.length && DraftTable.length}
                            onChange={(e) => handleHeaderCheck(e.target.checked)}
                          />
                        </CTableHeaderCell>
                      )}
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
                        width="5%"
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
                          checked={selectedRows.length === DraftTable.length && DraftTable.length}
                          onChange={(e) => handleHeaderCheck(e.target.checked)}
                        />
                      </CTableHeaderCell>
                      <CTableHeaderCell className="table-head-selected  text-c " colSpan="7">
                        <span style={{ color: '#f50505' }}>{headerLabel}</span>
                      </CTableHeaderCell>
                      <CTableHeaderCell
                        className="table-head-selected "
                        colSpan="5"
                        style={{ textAlign: 'right' }}
                      >
                        <div
                          className="action-request"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            marginRight: '10px',
                          }}
                        >
                          <button
                            className="border-0 bg-none"
                            style={{
                              cursor: 'pointer',
                              background: 'none',
                            }}
                            onClick={() => warning(selectedRows)}
                          >
                            <DeleteSvg width="16" height="15" viewBox="0 0 18 18" fill="#EF1B39" />
                          </button>
                        </div>
                      </CTableHeaderCell>
                    </CTableRow>
                  )}
                </CTableHead>
                <CTableBody>
                  {DraftTable &&
                    DraftTable.map((row, index) => (
                      <CTableRow key={index} className="tr-bg-color">
                        <CTableDataCell
                          className={`text-c text-center pd-text1 grid-cell pad-bottom_flow td-product-text ${
                            selectedRows.includes(row.id) ? 'checked-table-row' : ''
                          }`}
                          width="4%"
                        >
                          <Checkbox
                            className="checkbox_design"
                            id={`flexCheckDefault-${index}`}
                            value={row.id}
                            disabled={
                              row.status === 'Approved' ||
                              row.status === 'Rejected' ||
                              row.approved === true
                            }
                            checked={selectedRows.includes(row.id)}
                            onChange={(e) => {
                              handleMemberCheck(row.id, e.target.checked)
                            }}
                          />
                        </CTableDataCell>
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
                        <CTableDataCell
                          className={`text-c pd-text1 text-center grid-cell pad-bottom_flow td-product-text ${
                            selectedRows.includes(row.id) ? 'checked-table-row' : ''
                          }`}
                          width="8%"
                        >
                          <button
                            type="button"
                            className="action-view edit-button "
                            onClick={() => openEditProduct(row.id)}
                            style={{ padding: '4px 8px' }}
                          >
                            <EditSvg
                              width="13"
                              height="13"
                              viewBox="0 0 18 18"
                              fill="none"
                              color="white"
                              clipH="18"
                              clipW="18"
                            />
                          </button>
                          <button
                            className="border-0 bg-none cross-button"
                            style={{
                              cursor: 'pointer',
                              background: 'none',
                              borderRadius: '8px',
                            }}
                            onClick={() => warning(row.id)}
                            disabled={selectedRows.includes(row.id)}
                          >
                            <DeleteSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
                          </button>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
              {(DraftTable === null && !commonLoader) ||
              (DraftTable.length === 0 && !commonLoader) ? (
                <div className="text-c text-center my-3 td-text">No Data Found</div>
              ) : commonLoader && DraftTable.length === 0 ? (
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

DraftList.propTypes = {
  formatDate: PropTypes.func,
  FlowList: PropTypes.array,
  categories: PropTypes.array,
  techHeadList: PropTypes.array,
  prodHeadList: PropTypes.array,
  dataHeadList: PropTypes.array,
}
export default DraftList
