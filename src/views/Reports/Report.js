import React, { useState, useEffect } from 'react'
import { CCard, CCol, CRow, CNavItem, CTabContent, CTabPane, CNav, CNavLink } from '@coreui/react'
import { getDecodeData } from 'src/constant/Global'
import AllReport from './AllReport'
import MyTeam from './MyTeam'
import MyReport from './MyReport'

const Reports = () => {
  const user = getDecodeData()
  const supervisor = user && user.superviser
  const [activeKey, setActiveKey] = useState()
  const [tabs, setTabs] = useState([])
  function getToday() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
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
    tabsActivity(user && user.designation, user && user.roleIntake, supervisor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tabsActivity = async (designation, roleIntake, supervisor) => {
    if (
      (designation === 'Technical Admin' || designation === 'Product Admin') &&
      !user?.designation?.includes('QA Admin') &&
      supervisor === 'false' &&
      roleIntake !== 'Contract'
    ) {
      setTabs(['All Report', 'My Report'])
      setActiveKey('All Report')
    }
    if (
      (designation === 'Technical Admin' || designation === 'Product Admin') &&
      supervisor === 'true' &&
      roleIntake !== 'Contract' &&
      !user?.designation?.includes('QA Admin')
    ) {
      setTabs(['All Report', 'My Report', 'My Team'])
      setActiveKey('All Report')
    }
    if (
      designation !== 'Technical Admin' &&
      designation !== 'Product Admin' &&
      supervisor === 'true' &&
      !user?.designation?.includes('QA Admin')
    ) {
      setTabs(['My Report', 'My Team'])
      setActiveKey('My Report')
    }
    if (
      designation !== 'Technical Admin' &&
      designation !== 'Product Admin' &&
      supervisor === 'false' &&
      !user?.designation?.includes('QA Admin')
    ) {
      setTabs(['My Report'])
      setActiveKey('My Report')
    }
    if (user?.designation?.includes('QA Admin')) {
      setTabs(['All Report'])
      setActiveKey('All Report')
    }
  }
  return (
    <>
      <CRow className="my-2">
        <CCol xs={12}>
          <CCard className="mt-4 timesheet-content-report">
            <div>
              {tabs.length > 1 && (
                <CNav variant="pills" role="tablist" className="report-navbar">
                  {tabs.map((tabId) => (
                    <CNavItem role="presentation" key={tabId}>
                      <CNavLink
                        active={activeKey === tabId}
                        component="button"
                        role="tab"
                        aria-controls="contact-tab-pane"
                        aria-selected={activeKey === tabId}
                        onClick={() => setActiveKey(tabId)}
                      >
                        {tabId}
                      </CNavLink>
                    </CNavItem>
                  ))}
                </CNav>
              )}

              <CTabContent>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="home-tab-pane"
                  visible={activeKey === 'All Report'}
                  className={`pendingactivity-card ${
                    tabs.length > 1 ? 'tab_height_report' : 'tab_height1'
                  }`}
                >
                  <CRow>
                    {activeKey === 'All Report' && (
                      <AllReport today={getToday()} formatDate={formatDate} status="All" />
                    )}
                  </CRow>
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="contact-tab-pane"
                  visible={activeKey === 'My Team'}
                  className={`pendingactivity-card ${
                    tabs.length > 1 ? 'tab_height' : 'tab_height1'
                  }`}
                >
                  <CRow>
                    {activeKey === 'My Team' && (
                      <MyTeam today={getToday()} formatDate={formatDate} />
                    )}
                  </CRow>
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="contact-tab-pane"
                  visible={activeKey === 'My Report'}
                  className={`pendingactivity-card ${
                    tabs.length > 1 ? 'tab_height' : 'tab_height1'
                  }`}
                >
                  <CRow>
                    {activeKey === 'My Report' && (
                      <MyReport today={getToday()} formatDate={formatDate} />
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

export default Reports
