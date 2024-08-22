import React, { useState, useEffect } from 'react'
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
import profileImage1 from '../../assets/images/avatars/avatar1.png'
import line from '../../assets/images/Approval Flow Line.png'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ImageUrl, getHeaders } from '../../constant/Global'
import { Breadcrumb, Card, Divider, Tooltip, Modal } from 'antd'
import DeleteSvg from '../svgImages/DeleteSvg'
import EditSvg from '../svgImages/EditSvg'
import AddFlow from './AddFlow'
import EditFlow from './EditFlow'
import eventEmitter from 'src/constant/EventEmitter'
import useAxios from 'src/constant/UseAxios'
import { textWrap, toPascalCase } from '../../constant/TimeUtils'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
const { confirm } = Modal
const SuperAdmin = () => {
  let api = useAxios()
  const [visible, setVisible] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [userList, setUserList] = useState([])
  const [prodList, setProdList] = useState([])
  const [techList, setTechList] = useState([])
  const [dataList, setDataList] = useState([])
  const [tableData, setTableData] = useState([])
  const [viewFlowData, setViewFlowData] = useState(null)
  const [commonLoader, setCommonLoader] = useState(true)

  const openModal = () => {
    setVisible(true)
  }

  useEffect(() => {
    fetchData()
    eventEmitter.on('callFlowList', callBackFlowList)
    return () => {
      eventEmitter.off('callFlowList', callBackFlowList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      const [userListRes, prodListRes, techListRes, dataListRes, flowListRes] = await Promise.all([
        api.get('user/approval-user/list', { headers: getHeaders('json') }),
        api.get('common/prod_head', { headers: getHeaders('json') }),
        api.get('common/tech_head', { headers: getHeaders('json') }),
        api.get('common/data_head', { headers: getHeaders('json') }),
        api.get('flow/list', { headers: getHeaders('json') }),
      ])

      setUserList(userListRes.data.data)
      setProdList(prodListRes.data.data)
      setTechList(techListRes.data.data)
      setDataList(dataListRes.data.data)
      setTableData(flowListRes.data.data)
      setCommonLoader(false)
    } catch (error) {
      // console.error('Error fetching data:', error)
      // Handle error gracefully
    }
  }

  const callBackFlowList = () => {
    fetchData()
  }

  let accessPersonList
  if (Array.isArray(techList) && Array.isArray(prodList) && Array.isArray(dataList)) {
    accessPersonList = [...techList, ...prodList, ...dataList]
  } else {
    accessPersonList = []
  }

  const handleEditClick = async (id) => {
    const url = `flow/view/` + id
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        setViewFlowData(data)
        setVisibleEdit(true)
      })
      .catch((error) => {})
  }

  const handleDeleteClick = async (id) => {
    const url = `flow/delete/` + id
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        api
          .delete(url, {
            headers: getHeaders('json'),
          })
          .then((response) => {
            fetchData()
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }, 1000)
    })
  }

  const closeAddFlow = () => {
    setVisible(false)
    fetchData()
  }

  const closeEditFlow = () => {
    setVisibleEdit(false)
    fetchData()
  }

  const warning = (id) => {
    confirm({
      title: 'Delete Flow',
      content: 'Are you sure to delete this Flow ?',
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
          await handleDeleteClick(id)
          toast.success('Flow Deleted Successfully', {
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
    })
  }

  return (
    <>
      <ToastContainer />
      <CRow>
        {visible ? (
          <AddFlow userData={userList} prodList={accessPersonList} close={closeAddFlow} />
        ) : visibleEdit ? (
          <EditFlow
            userData={userList}
            prodList={accessPersonList}
            close={closeEditFlow}
            viewFlowData={viewFlowData}
          />
        ) : (
          <CCol
            xs={12}
            className="card flowlist-main-card product-card_flow"
            style={{ border: '0px', padding: '0px' }}
          >
            <div style={{ background: 'white', borderRadius: '5px' }}>
              <CRow className="flowlist-card-header">
                <CCol xs={8} sm={9} md={9} lg={10} className="flow-grid">
                  <h6 className="flowlist-heading">Flow List</h6>
                  <Breadcrumb
                    className="bread-tab"
                    separator={<span className="breadcrumb-separator">|</span>}
                    items={[
                      {
                        title: (
                          <Link
                            rel="Dashboard"
                            to={'/dashboard'}
                            style={{ marginLeft: '17px' }}
                            className="bread-items text-decoration-none text-secondary "
                          >
                            Dashboard
                          </Link>
                        ),
                      },
                      {
                        title: (
                          <span
                            className="text-secondary second-subheading"
                            style={{ cursor: 'default' }}
                          >
                            Flow List
                          </span>
                        ),
                      },
                    ]}
                  />
                </CCol>
                <CCol xs={4} sm={3} md={3} lg={2} className="flowlist-create-button ">
                  <button
                    className="createflow-button-create button-clr"
                    onClick={openModal}
                    style={{ fontWeight: '700' }}
                  >
                    <span className="plus-lable">+</span> Create Flow
                  </button>
                </CCol>
              </CRow>
              <div className="table-container table_scroll_flowlist  lap-table mt-4">
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
                        className="table-head table-head-flowlist    text-c"
                        width="10%"
                        scope="col"
                      >
                        Name of the Flow
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
                        width="4%"
                      >
                        Action
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {!tableData ? (
                      <div></div>
                    ) : (
                      tableData.map((flow, index) => (
                        <CTableRow key={index}>
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
                                {flow.access.slice(0, 3).map((member, memberindex) => (
                                  <div className="accessPerImg" key={memberindex}>
                                    <Tooltip placement="bottom" title={member.name}>
                                      <div className="tooltip-container">
                                        <img
                                          src={
                                            member.profile_pic
                                              ? ImageUrl + member.profile_pic
                                              : profileImage1
                                          }
                                          className={
                                            member.profile_pic ? 'first-image' : 'second-image'
                                          }
                                          alt="Access Person Images"
                                        />
                                      </div>
                                    </Tooltip>
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
                                    style={{ width: '220px', height: '208px', overflowY: 'auto' }}
                                    className="Access-card"
                                  >
                                    {flow.access.map((member, indexmember) => (
                                      <div key={indexmember}>
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
                                            <p className="member-user-name1">
                                              {toPascalCase(member.name)}{' '}
                                            </p>
                                            {/* <p className="member-user-name1"> {member.name}</p> */}
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
                                      <div className="image-backgrounds">
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
                                        <p
                                          className="user-name-table  "
                                          title={toPascalCase(approver.name)}
                                        >
                                          {toPascalCase(approver.name)}
                                        </p>
                                        <p
                                          className="role-text1 approver-role-text1"
                                          title={approver.role}
                                        >
                                          {approver.role}
                                        </p>
                                      </div>
                                    </div>
                                    {approverIndex < 4 &&
                                      approverIndex < flow.approvals.length - 1 && (
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
                                      +{flow.approvals.length - 5} <div>more</div>
                                    </p>
                                  )}
                                </div>
                              </div>
                              {flow.approvals.length > 5 && (
                                <div className="card-list-flow">
                                  <Card style={{ width: '220px' }} className="flow-card">
                                    {flow.approvals.map((approver, approverflowIndex) => (
                                      <div key={approverflowIndex}>
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
                                            style={
                                              approver.profile_pic ? { marginLeft: '11px' } : {}
                                            }
                                          >
                                            <p className="approver-user-name1">{approver.name}</p>
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
                                className="action-view edit-button"
                                onClick={() => handleEditClick(flow.id)}
                              >
                                <EditSvg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  color="white"
                                  clipH="18"
                                  clipW="18"
                                />
                              </button>
                              <button
                                type="button"
                                className="action-view cross-button"
                                onClick={() => warning(flow.id)}
                              >
                                <DeleteSvg
                                  width="16 "
                                  height="16"
                                  viewBox="0 0 18 18"
                                  fill="#A5A1A1"
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
              </div>
            </div>
          </CCol>
        )}
      </CRow>
    </>
  )
}

export default SuperAdmin
