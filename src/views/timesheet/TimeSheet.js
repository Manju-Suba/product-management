import React, { useState, useEffect } from 'react'
import { CCard, CCol, CRow, CNavItem, CTabContent, CTabPane, CNav, CNavLink } from '@coreui/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Pending from './Pending'
import Draft from './Draft'
import RaiseList from './RaisedRequest'
import SubmitActivity from './SubmitActivity'
import LeaveHistory from './LeaveHistory'
import { useDispatch, useSelector } from 'react-redux'
import { getTaskActivityList, getproductList } from '../../redux/timesheet/action'
import { formatDate, getToday } from 'src/TimeUtils'
import SwipeDetails from './SwipeDetails'
import { useLocation } from 'react-router-dom'

const TimeSheet = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [activeKey, setActiveKey] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingActiveTask, setLoadingActiveTask] = useState(true)
  const productList = useSelector((state) => state.timesheet.approvedProductList)
  const taskList = useSelector((state) => state.timesheet.taskList)

  useEffect(() => {
    dispatch(getproductList())
    dispatch(getTaskActivityList())
    setLoading(false)
    setLoadingActiveTask(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')
    if (tab) {
      setActiveKey(parseInt(tab, 10))
    }
  }, [location])

  return (
    <>
      <ToastContainer />
      <CRow className="my-2">
        <CCol xs={12}>
          <CCard className="mt-4 timesheet-content">
            <div className="timesheetfull-card">
              <CNav className="navbar-list nav_bar_scroll " variant="pills" role="tablist">
                <CNavItem role="presentation5">
                  <CNavLink
                    className="nav-link-lable time-sheert-navbar"
                    active={activeKey === 1}
                    aria-selected={activeKey === 1}
                    onClick={() => setActiveKey(1)}
                    component="button"
                    role="tab"
                    aria-controls="home-tab-pane"
                  >
                    Pending Activity
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation4">
                  <CNavLink
                    active={activeKey === 2}
                    component="button"
                    role="tab"
                    aria-controls="profile-tab-pane"
                    aria-selected={activeKey === 2}
                    onClick={() => setActiveKey(2)}
                  >
                    Draft Activity
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation3">
                  <CNavLink
                    active={activeKey === 3}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 3}
                    onClick={() => setActiveKey(3)}
                  >
                    Submitted Activity
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation2">
                  <CNavLink
                    active={activeKey === 4}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 4}
                    onClick={() => setActiveKey(4)}
                  >
                    Raised Request
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation1">
                  <CNavLink
                    active={activeKey === 5}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 5}
                    onClick={() => setActiveKey(5)}
                  >
                    Leave History
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation6">
                  <CNavLink
                    active={activeKey === 6}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 6}
                    onClick={() => setActiveKey(6)}
                  >
                    Swipe Details
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent className={`${activeKey === 6 ? 'swp_tab_height' : ''}`}>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="profile-tab-pane"
                  visible={activeKey === 1}
                  className="tab-content-overflow  tab_height_submit"
                >
                  {/* {activeKey === 1 && ( */}
                  <Pending
                    productList={productList}
                    taskList={taskList}
                    today={getToday()}
                    loader={loading}
                    loadingActiveTask={loadingActiveTask}
                  />
                  {/* )} */}
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="profile-tab-pane"
                  visible={activeKey === 2}
                  className="tab-content-overflow tab_height_submit"
                >
                  {activeKey === 2 && (
                    <Draft
                      productList={productList}
                      taskList={taskList}
                      loader={loading}
                      loadingActiveTask={loadingActiveTask}
                      today={getToday()}
                    />
                  )}
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="contact-tab-pane"
                  visible={activeKey === 3}
                  className="tab-content-overflow tab_height_submit"
                >
                  {activeKey === 3 && (
                    <SubmitActivity
                      today={getToday()}
                      productList={productList}
                      taskList={taskList}
                      className="tab-content-overflow"
                    />
                  )}
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="contact-tab-pane"
                  visible={activeKey === 4}
                  className="tab-content-overflow tab_height_raised"
                >
                  {activeKey === 4 && <RaiseList formatDate={formatDate} />}
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="contact-tab-pane"
                  visible={activeKey === 5}
                  className="tab-content-overflow tab_height_raised"
                >
                  {activeKey === 5 && <LeaveHistory formatDate={formatDate} />}
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="contact-tab-pane"
                  visible={activeKey === 6}
                  className="tab-content-overflow tab_height_raised"
                >
                  {activeKey === 6 && <SwipeDetails formatDate={formatDate} />}
                </CTabPane>
              </CTabContent>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default TimeSheet
