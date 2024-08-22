import React, { useState, useEffect } from 'react'
import { CCard, CCol, CRow, CNavItem, CTabContent, CTabPane, CNav, CNavLink } from '@coreui/react'
import { getHeaders, getDecodeData } from 'src/constant/Global'
import ApprovedList from './productHead/ApprovedList'
import DraftList from './productHead/DraftList'
import FlowList from './productHead/FlowList'
import PendingList from './productHead/ProductPendingList'
import OwnerProductList from './productOwner/OwnerProductList'
import ApproverProductList from './productApprover/ApproverProductList'
import ApproverCloseList from './productApprover/ApproverClosedList'
import RejectedList from './productHead/RejectedList'
import useAxios from 'src/constant/UseAxios'
import { useLocation } from 'react-router-dom'

const Products = () => {
  let api = useAxios()
  const user = getDecodeData()
  const [activeKey, setActiveKey] = useState()
  const [tableData, setTableData] = useState([])
  const [prodOwnerList, setProdOwnerList] = useState([])
  const [techOwnerList, setTechOwnerList] = useState([])
  const [dataOwnerList, setDataOwnerList] = useState([])
  const [categories, setCategory] = useState([])
  const [prodHeadList, setProdHeadList] = useState([])
  const [techHeadList, setTechHeadList] = useState([])
  const [dataHeadList, setDataHeadList] = useState([])
  const designation = user?.designation
  const location = useLocation()

  useEffect(() => {
    getFlowList()
    getProdOwner()
    getTechOwner()
    getDataOwner()
    getCategory()
    getTechHead()
    getDataHead()
    getProdHead()
    if (designation.includes('Head')) {
      setActiveKey(3)
    } else if (designation.includes('Approver')) {
      setActiveKey(4)
    } else if (designation.includes('Owner')) {
      setActiveKey(6)
    }

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

  const getFlowList = async () => {
    const url = `flow/list/producthead`
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

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    if (tab) {
      setActiveKey(parseInt(tab, 10))
    }
  }, [location])

  return (
    <CRow className="my-2 ">
      <CCol xs={12}>
        <CCard xs={12} className="mt-4 timesheet-content-product " style={{ height: '100%' }}>
          <div>
            <CNav variant="pills" role="tablist" className="nav_bar_product flow-navbar">
              {designation?.includes('Head') && (
                <>
                  <CNavItem role="presentation1">
                    <CNavLink
                      active={activeKey === 3}
                      component="button"
                      role="tab"
                      aria-controls="contact-tab-pane"
                      aria-selected={activeKey === 3}
                      onClick={() => setActiveKey(3)}
                    >
                      Flow List
                    </CNavLink>
                  </CNavItem>
                  <CNavItem role="presentation2">
                    <CNavLink
                      className="nav-link-lable"
                      active={activeKey === 7}
                      component="button"
                      role="tab"
                      aria-controls="home-tab-pane"
                      aria-selected={activeKey === 7}
                      onClick={() => setActiveKey(7)}
                    >
                      Product List
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
                      Draft List
                    </CNavLink>
                  </CNavItem>
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
                      Approved List
                    </CNavLink>
                  </CNavItem>
                  <CNavItem role="presentation5">
                    <CNavLink
                      className="nav-link-lable"
                      active={activeKey === 8}
                      component="button"
                      role="tab"
                      aria-controls="home-tab-pane"
                      aria-selected={activeKey === 8}
                      onClick={() => setActiveKey(8)}
                    >
                      Rejected List
                    </CNavLink>
                  </CNavItem>
                </>
              )}
              {designation?.includes('Approver') && (
                <>
                  <CNavItem role="presentation6">
                    <CNavLink
                      active={activeKey === 4}
                      component="button"
                      role="tab"
                      aria-controls="contact-tab-pane"
                      aria-selected={activeKey === 4}
                      onClick={() => setActiveKey(4)}
                    >
                      Pending List
                    </CNavLink>
                  </CNavItem>
                  <CNavItem role="presentation7">
                    <CNavLink
                      active={activeKey === 5}
                      component="button"
                      role="tab"
                      aria-controls="contact-tab-pane"
                      aria-selected={activeKey === 5}
                      onClick={() => setActiveKey(5)}
                    >
                      Closed List
                    </CNavLink>
                  </CNavItem>
                </>
              )}
              {designation?.includes('Owner') && (
                <CNavItem role="presentation8">
                  <CNavLink
                    active={activeKey === 6}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 6}
                    onClick={() => setActiveKey(6)}
                  >
                    Product List
                  </CNavLink>
                </CNavItem>
              )}
            </CNav>
            <CTabContent>
              <CTabPane
                role="tabpanel"
                aria-labelledby="home-tab-pane"
                visible={activeKey === 1}
                className="pendingactivity-card tab_height"
              >
                <CRow>
                  {activeKey === 1 && (
                    <ApprovedList
                      formatDate={formatDate}
                      FlowList={tableData}
                      prodOwnerList={prodOwnerList}
                      techOwnerList={techOwnerList}
                      dataOwnerList={dataOwnerList}
                      categories={categories}
                      techHeadList={techHeadList}
                      prodHeadList={prodHeadList}
                      dataHeadList={dataHeadList}
                    />
                  )}
                </CRow>
              </CTabPane>
              <CTabPane
                role="tabpanel"
                aria-labelledby="profile-tab-pane"
                visible={activeKey === 2}
                className="pendingactivity-card tab_height"
              >
                <CRow>
                  {activeKey === 2 && (
                    <DraftList
                      formatDate={formatDate}
                      FlowList={tableData}
                      categories={categories}
                      techHeadList={techHeadList}
                      prodHeadList={prodHeadList}
                      dataHeadList={dataHeadList}
                    />
                  )}
                </CRow>
              </CTabPane>
              <CTabPane
                role="tabpanel"
                aria-labelledby="contact-tab-pane"
                visible={activeKey === 3}
                className="pendingactivity-card tab_height"
              >
                <CRow>
                  {activeKey === 3 && (
                    <FlowList
                      categories={categories}
                      techHeadList={techHeadList}
                      prodHeadList={prodHeadList}
                      dataHeadList={dataHeadList}
                    />
                  )}
                </CRow>
              </CTabPane>
              <CTabPane
                role="tabpanel"
                aria-labelledby="contact-tab-pane"
                visible={activeKey === 4}
                className="pendingactivity-card tab_height"
              >
                <CRow>
                  {activeKey === 4 && (
                    <ApproverProductList
                      FlowList={tableData}
                      categories={categories}
                      techHeadList={techHeadList}
                      prodHeadList={prodHeadList}
                      dataHeadList={dataHeadList}
                    />
                  )}
                </CRow>
              </CTabPane>
              <CTabPane
                role="tabpanel"
                aria-labelledby="contact-tab-pane"
                visible={activeKey === 5}
                className="pendingactivity-card tab_height"
              >
                <CRow>
                  {activeKey === 5 && (
                    <ApproverCloseList
                      FlowList={tableData}
                      categories={categories}
                      techHeadList={techHeadList}
                      prodHeadList={prodHeadList}
                      dataHeadList={dataHeadList}
                    />
                  )}
                </CRow>
              </CTabPane>
              <CTabPane
                role="tabpanel"
                aria-labelledby="contact-tab-pane"
                visible={activeKey === 6}
                className="pendingactivity-card tab_height"
              >
                <CRow>
                  {activeKey === 6 && (
                    <OwnerProductList
                      FlowList={tableData}
                      categories={categories}
                      techHeadList={techHeadList}
                      prodHeadList={prodHeadList}
                      dataHeadList={dataHeadList}
                    />
                  )}
                </CRow>
              </CTabPane>
              <CTabPane
                role="tabpanel"
                aria-labelledby="home-tab-pane"
                visible={activeKey === 7}
                className="pendingactivity-card tab_height"
              >
                <CRow>
                  {activeKey === 7 && (
                    <PendingList
                      formatDate={formatDate}
                      FlowList={tableData}
                      categories={categories}
                      techHeadList={techHeadList}
                      prodHeadList={prodHeadList}
                      dataHeadList={dataHeadList}
                    />
                  )}
                </CRow>
              </CTabPane>
              <CTabPane
                role="tabpanel"
                aria-labelledby="home-tab-pane"
                visible={activeKey === 8}
                className="pendingactivity-card tab_height"
              >
                <CRow>
                  {activeKey === 8 && (
                    <RejectedList
                      formatDate={formatDate}
                      FlowList={tableData}
                      categories={categories}
                      techHeadList={techHeadList}
                      prodHeadList={prodHeadList}
                      dataHeadList={dataHeadList}
                    />
                  )}
                </CRow>
              </CTabPane>
            </CTabContent>
          </div>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Products
