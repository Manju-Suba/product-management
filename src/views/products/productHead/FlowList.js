import React, { useState, useEffect, useMemo } from 'react'
import { Breadcrumb, Input, Tooltip, Card, Divider } from 'antd'
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
import { ImageUrl, getHeaders } from 'src/constant/Global'
import profileImage1 from '../../../assets/images/avatars/wrapper.png'
import 'react-toastify/dist/ReactToastify.css'
import line from '../../../assets/images/Approval Flow Line.png'
import AddProduct from './AddProduct'
import PropTypes from 'prop-types'
import { ToastContainer } from 'react-toastify'
import useAxios from 'src/constant/UseAxios'
import searchicon from '../../../assets/images/form/search-Icon.png'
import { textWrap } from 'src/constant/TimeUtils'
import { Link } from 'react-router-dom'

const FlowList = ({ categories, techHeadList, prodHeadList, dataHeadList }) => {
  let api = useAxios()
  const [tableData, setTableData] = useState()
  const [searchValue, setSearchValue] = useState('')
  const [AddProductShow, setAddProductShow] = useState(false)
  const [FlowId, setFlowId] = useState()
  const [CommonLoader, setCommonLoader] = useState(true)

  const getFlowList = async () => {
    const url = `flow/list/producthead`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setTableData(response.data.data)
        setCommonLoader(false)
      })
      .catch((error) => {})
  }
  useEffect(() => {
    getFlowList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (value) => {
    setSearchValue(value)
  }
  const filterFlowTable = useMemo(() => {
    if (!tableData) {
      return [] // Return an empty array if tableData is undefined
    }

    const filterTable = tableData.filter((data) => {
      const flow = data.name || ''
      const flowMatch = !searchValue || flow.toLowerCase().includes(searchValue.toLowerCase())
      return flowMatch
    })
    return filterTable
  }, [searchValue, tableData])

  const openAddProduct = (id) => {
    setAddProductShow(true)
    setFlowId(id)
  }

  const closeAddProduct = (id) => {
    setAddProductShow(false)
    setFlowId()
    getFlowList()
  }

  return (
    <>
      <ToastContainer />
      {AddProductShow ? (
        <AddProduct
          flow={FlowId}
          flowList={tableData}
          close={closeAddProduct}
          techHeadList={techHeadList}
          prodHeadList={prodHeadList}
          dataHeadList={dataHeadList}
          titleList="Flow List"
          categories={categories}
          callBackFunc={closeAddProduct}
        />
      ) : (
        <>
          <CRow className="mt-3">
            <CCol xs={8} sm={9} md={10}>
              <b style={{ marginLeft: '30px' }}>Flow List</b>
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
                        Flow List
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>

            <CCol xs={4} sm={3} md={2} style={{ marginTop: '-5px' }}>
              {' '}
              <Input
                style={{ width: '90%' }}
                placeholder="Search"
                className="border-0 user-border-bottom "
                onChange={(e) => handleSearch(e.target.value)}
                variant={'borderless'}
                prefix={
                  <img
                    src={searchicon}
                    alt={searchicon}
                    style={{ width: '14px', height: '14px' }}
                    className="search-icon"
                  />
                }
              />
            </CCol>
          </CRow>
          <div
            className="table-container table_scroll_flowlist lap-table"
            style={{ marginTop: '20px' }}
          >
            <CTable className="flowlist-fulltable" hover>
              <CTableHead className="head-row flowlist-table">
                <CTableRow>
                  <CTableHeaderCell
                    className="table-head-flowlist text-c text-center"
                    scope="col"
                    width="4%"
                  >
                    SI.No
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="table-head table-head-flowlist text-c"
                    width="10%"
                    scope="col"
                  >
                    Name of the flow
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="table-head table-head-flowlist text-c"
                    scope="col"
                    width="10%"
                  >
                    Access Persons
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="table-head table-head-flowlist text-c "
                    scope="col"
                    width="60%"
                  >
                    Approval Flow
                  </CTableHeaderCell>
                  <CTableHeaderCell
                    className="table-head table-head-flowlist-active text-c text-center"
                    scope="col"
                    width="10%"
                  >
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {!filterFlowTable ? (
                  <CSpinner color="danger" />
                ) : (
                  filterFlowTable.map((flow, index) => (
                    <CTableRow key={flow.id}>
                      <CTableDataCell
                        className="activity-text-index td-text flowlist-name text-center pad-bottom_flow"
                        width="4%"
                      >
                        {index + 1}
                      </CTableDataCell>

                      <CTableDataCell
                        className="td-text text-c flowlist-name pad-bottom_flow"
                        width="8%"
                      >
                        <Tooltip
                          placement="bottomLeft"
                          title={flow.name}
                          // className="flowlist-name-lable"
                        >
                          {textWrap(flow.name, 15)}
                        </Tooltip>
                      </CTableDataCell>

                      <CTableDataCell
                        className="td-text flowlist-accesperson pad-bottom_flow"
                        width="5%"
                      >
                        <div className="table-cell-container">
                          <div className="image-background-accessperson">
                            {flow.access.slice(0, 3).map((member, index) => (
                              <div className="accessPerImg" key={index}>
                                <div className="tooltip-container">
                                  <img
                                    src={
                                      member.profile_pic
                                        ? ImageUrl + member.profile_pic
                                        : profileImage1
                                    }
                                    className={member.profile_pic ? 'first-image' : 'second-image'}
                                    alt="Access Person Images"
                                  />
                                </div>
                              </div>
                            ))}
                            <div>
                              {flow.access.length > 3 && (
                                <div className="accessPerImg text-center more-person-access rounded-circle">
                                  <span>+{flow.access.length - 3}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {flow.access.length > 3 && (
                            <div className="card-list-person">
                              <Card
                                style={{ width: '250px', overflowY: 'auto', height: '200px' }}
                                className="Access-card"
                              >
                                {flow.access.map((member) => (
                                  <div key={member}>
                                    <div className=" access-person-tooltip  ">
                                      <div className="image-background">
                                        <img
                                          src={
                                            member.profile_pic
                                              ? ImageUrl + member.profile_pic
                                              : profileImage1
                                          }
                                          className={
                                            member.profile_pic
                                              ? 'card-access-image'
                                              : 'card-approval-image'
                                          }
                                          alt={member.name}
                                        />
                                      </div>
                                      <div
                                        className="node1 access-person-hovercard"
                                        style={member.profile_pic ? { marginLeft: '11px' } : {}}
                                      >
                                        <p className="member-user-name1"> {member.name}</p>
                                        <p className="member-role-text1">{member.role}</p>
                                      </div>
                                    </div>
                                    <Divider />
                                  </div>
                                ))}
                              </Card>
                            </div>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell
                        className="td-text flowlist-approvalflow pad-bottom_flow"
                        width="50%"
                      >
                        <div className="table-cell-container-flow">
                          <div className="flow-chart Approval-flow-chart  mt-3">
                            {flow.approvals.slice(0, 5).map((approver, approverIndex) => (
                              <React.Fragment key={approverIndex}>
                                <div className=" approval-lable-content">
                                  <div className="image-background">
                                    <img
                                      src={
                                        approver.profile_pic
                                          ? ImageUrl + approver.profile_pic
                                          : profileImage1
                                      }
                                      alt="Access Person Images"
                                      className={
                                        approver.profile_pic
                                          ? 'first-image-approval'
                                          : 'second-image'
                                      }
                                    />
                                  </div>
                                  <div className="approval-flow">
                                    <p className="user-name-table " title={approver.name}>
                                      {approver.name}
                                    </p>
                                    <p
                                      className="role-text1 approver-role-text1"
                                      title={approver.role}
                                    >
                                      {approver.role}
                                    </p>
                                  </div>
                                </div>
                                {approverIndex < 4 && approverIndex < flow.approvals.length - 1 && (
                                  <div className="connector access-line-img">
                                    <img src={line} alt="Access Person Images" width="22px" />
                                  </div>
                                )}
                              </React.Fragment>
                            ))}
                            <div>
                              {flow.approvals.length > 5 && (
                                <p
                                  style={{
                                    fontSize: '11px',
                                    color: '#989696',
                                    marginTop: '-20px',
                                    marginLeft: '15px',
                                  }}
                                >
                                  +{flow.approvals.length - 5}
                                  <div> more</div>
                                </p>
                              )}
                            </div>
                          </div>
                          {flow.approvals.length > 5 && (
                            <div className="card-list-flow">
                              <Card style={{ width: '220px' }} className="flow-card">
                                {flow.approvals.map((approver, approverIndex) => (
                                  <div key={approverIndex}>
                                    <div className=" access-person-tooltip ">
                                      <img
                                        src={
                                          approver.profile_pic
                                            ? ImageUrl + approver.profile_pic
                                            : profileImage1
                                        }
                                        className={
                                          approver.profile_pic
                                            ? 'card-approval-image'
                                            : 'card-approval-image'
                                        }
                                        alt={approver.name}
                                      />
                                      <div
                                        className="node1 access-person-hovercard"
                                        style={approver.profile_pic ? { marginLeft: '11px' } : {}}
                                      >
                                        <p className="approver-user-name1"> {approver.name}</p>
                                        <p className="approver-role-text12">{approver.role}</p>
                                      </div>
                                    </div>
                                    <Divider />
                                  </div>
                                ))}
                              </Card>
                            </div>
                          )}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell
                        className="td-text flowlist-Action pad-bottom_flow"
                        width="4%"
                      >
                        <div className="action-items">
                          <button
                            type="button"
                            className="action-view-product"
                            onClick={() => openAddProduct(flow.id)}
                          >
                            Create Product
                          </button>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
            {(filterFlowTable === null && !CommonLoader) ||
            (filterFlowTable.length === 0 && !CommonLoader) ? (
              <div className="text-c text-center my-3 td-text">No Data Found</div>
            ) : CommonLoader ? (
              <div className="text-c text-center my-3 td-text">
                <CSpinner color="danger" />
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div style={{ height: '50px' }}></div>
        </>
      )}
    </>
  )
}

FlowList.propTypes = {
  categories: PropTypes.array,
  techHeadList: PropTypes.array,
  prodHeadList: PropTypes.array,
  dataHeadList: PropTypes.array,
}
export default FlowList
