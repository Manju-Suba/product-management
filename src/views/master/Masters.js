import React, { useState, useEffect } from 'react'
import { CCard, CCol, CRow, CNavItem, CTabContent, CTabPane, CNav, CNavLink } from '@coreui/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Designation from './Designation/Designation'
import Business from './Business/Business'
import TaskActivity from './taskActivity/TaskActivity'
import User from './User/User'
import { getDecodeData, getHeaders } from 'src/constant/Global'
import Product from './Product/Product'
import useAxios from 'src/constant/UseAxios'

const Masters = () => {
  const [activeKey, setActiveKey] = useState(1)
  let api = useAxios()
  const user = getDecodeData()
  const [tableData, setTableData] = useState([])
  const [prodOwnerList, setProdOwnerList] = useState([])
  const [techOwnerList, setTechOwnerList] = useState([])
  const [dataOwnerList, setDataOwnerList] = useState([])
  const [howOwnerList, setHowOwnerList] = useState([])
  const [category, setCategory] = useState([])
  const [prodHeadList, setProdHeadList] = useState([])
  const [techHeadList, setTechHeadList] = useState([])
  const [dataHeadList, setDataHeadList] = useState([])
  const [howHeadList, setHowHeadList] = useState([])
  const designation = user?.designation
  const empId = user?.employee_id

  useEffect(() => {
    getFlowList()
    getProdOwner()
    getTechOwner()
    getDataOwner()
    getHowOwner()
    getDataHead()
    getHowHead()
    getCategory()
    getTechHead()
    getProdHead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProdOwner = async () => {
    const url = `common/prod_owner`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setProdOwnerList(response.data.data)
      })
      .catch((error) => {})
  }

  const getTechOwner = async () => {
    const url = `common/tech_owner`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setTechOwnerList(response.data.data)
      })
      .catch((error) => {})
  }

  const getDataOwner = async () => {
    const url = `common/data_owner`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setDataOwnerList(response.data.data)
      })
      .catch((error) => {})
  }

  const getHowOwner = async () => {
    const url = `common/how_owner`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setHowOwnerList(response.data.data)
      })
      .catch((error) => {})
  }

  const getTechHead = async () => {
    const url = `common/tech_head`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setTechHeadList(response.data.data)
      })
      .catch((error) => {})
  }

  const getProdHead = async () => {
    const url = `common/prod_head`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setProdHeadList(response.data.data)
      })
      .catch((error) => {})
  }
  const getDataHead = async () => {
    const url = `common/data_head`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setDataHeadList(response.data.data)
      })
      .catch((error) => {})
  }

  const getHowHead = async () => {
    const url = `common/how_head`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setHowHeadList(response.data.data)
      })
      .catch((error) => {})
  }

  const getFlowList = async () => {
    const url = `flow/list/producthead?status=Admin`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setTableData(response.data.data)
      })
      .catch((error) => {})
  }

  const getCategory = async () => {
    const url = `product/categories`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setCategory(response.data.data)
      })
      .catch((error) => {})
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

  return (
    <>
      <ToastContainer />
      <CRow className="my-2">
        <CCol xs={12} lg={6}>
          <CCard className="mt-4 timesheet-content-user">
            <div>
              <CNav variant="pills" role="tablist" className="master-navbar-list ">
                <CNavItem role="presentation4">
                  <CNavLink
                    className="nav-link-lable"
                    active={activeKey === 1}
                    component="button"
                    role="tab"
                    aria-controls="home-tab-pane"
                    aria-selected={activeKey === 1}
                    onClick={() => setActiveKey(1)}
                  >
                    User Master
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation3">
                  <CNavLink
                    active={activeKey === 2}
                    component="button"
                    role="tab"
                    aria-controls="profile-tab-pane"
                    aria-selected={activeKey === 2}
                    onClick={() => setActiveKey(2)}
                  >
                    Designation Master
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation2">
                  <CNavLink
                    active={activeKey === 3}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 3}
                    onClick={() => setActiveKey(3)}
                  >
                    Business Master
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation1">
                  <CNavLink
                    active={activeKey === 4}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 4}
                    onClick={() => setActiveKey(4)}
                  >
                    Task Activity Master
                  </CNavLink>
                </CNavItem>
                {(designation?.includes('Internal Admin') || empId === '120034') && (
                  <CNavItem role="presentation5">
                    <CNavLink
                      active={activeKey === 5}
                      component="button"
                      role="tab"
                      aria-controls="contact-tab-pane"
                      aria-selected={activeKey === 5}
                      onClick={() => setActiveKey(5)}
                    >
                      Product / Project Creation Master
                    </CNavLink>
                  </CNavItem>
                )}
              </CNav>
              <CTabContent className="master-tab-content ">
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="home-tab-pane"
                  visible={activeKey === 1}
                  className="master_card tab_height_master"
                >
                  {' '}
                  <CRow>{activeKey === 1 && <User />}</CRow>
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="profile-tab-pane"
                  visible={activeKey === 2}
                  className="master_card tab_height_master"
                >
                  <CRow>{activeKey === 2 && <Designation />}</CRow>
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="contact-tab-pane"
                  visible={activeKey === 3}
                  className="master_card tab_height_master"
                >
                  <CRow>{activeKey === 3 && <Business />}</CRow>
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="contact-tab-pane"
                  visible={activeKey === 4}
                  className="master_card tab_height_master"
                >
                  <CRow>{activeKey === 4 && <TaskActivity />}</CRow>
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="contact-tab-pane"
                  visible={activeKey === 5}
                  className="master_card tab_height_master"
                >
                  <CRow>
                    {activeKey === 5 && (
                      <Product
                        formatDate={formatDate}
                        FlowList={tableData}
                        prodOwnerList={prodOwnerList}
                        techOwnerList={techOwnerList}
                        dataOwnerList={dataOwnerList}
                        howOwnerList={howOwnerList}
                        categories={category}
                        techHeadList={techHeadList}
                        prodHeadList={prodHeadList}
                        dataHeadList={dataHeadList}
                        howHeadList={howHeadList}
                      />
                    )}
                  </CRow>
                </CTabPane>
              </CTabContent>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Masters
