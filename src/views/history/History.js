import React, { useState, useEffect } from 'react'
import { CCard, CCol, CRow, CNavItem, CTabContent, CTabPane, CNav, CNavLink } from '@coreui/react'
import { getHeaders, getDecodeData } from 'src/constant/Global'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ApprovedActivity from './ApprovedActivity'
import RejectedActivity from './RejectedActivity'
import RaisedRequest from './RaisedRequest'
import AppliedLeave from './AppliedLeave'
import useAxios from 'src/constant/UseAxios'

const History = () => {
  let api = useAxios()
  const user = getDecodeData()
  const [productList, setProductList] = useState([])
  const [memberList, setMemberList] = useState([])
  const [activeKey, setActiveKey] = useState(2)
  const [memberLoader, setMemberLoader] = useState(true)
  const [prodLoader, setProdLoader] = useState(true)

  function getToday() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  useEffect(() => {
    getproductList()
    getMemberList(user?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //member List
  const getMemberList = async (id) => {
    const url = `user/supervisor/${id}`
    await api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const member = response.data.data
        setMemberList(member)
        setMemberLoader(false)
      })
      .catch((error) => {})
  }

  const getproductList = async () => {
    const url = `product/approvedlist`
    await api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const product = response.data.data
        setProductList(product)
        setProdLoader(false)
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
        <CCol xs={12}>
          <CCard className="mt-4 memberact_content">
            <div>
              <CNav variant="pills" role="tablist">
                <CNavItem role="presentation5">
                  <CNavLink
                    active={activeKey === 2}
                    component="button"
                    role="tab"
                    aria-controls="profile-tab-pane"
                    aria-selected={activeKey === 2}
                    onClick={() => setActiveKey(2)}
                  >
                    Approved Activity
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation4">
                  <CNavLink
                    active={activeKey === 3}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 3}
                    onClick={() => setActiveKey(3)}
                  >
                    Rejected Activity
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation2">
                  <CNavLink
                    active={activeKey === 5}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 5}
                    onClick={() => setActiveKey(5)}
                  >
                    Raised Request
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation1">
                  <CNavLink
                    active={activeKey === 6}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 6}
                    onClick={() => setActiveKey(6)}
                  >
                    Applied Leave
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="profile-tab-pane"
                  visible={activeKey === 2}
                  className="pendingactivity-card tab_height"
                >
                  <CRow>
                    {activeKey === 2 && (
                      <ApprovedActivity
                        today={getToday()}
                        formatDate={formatDate}
                        productLists={productList}
                        memberLists={memberList}
                        memberLoader={memberLoader}
                        prodLoader={prodLoader}
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
                      <RejectedActivity
                        formatDate={formatDate}
                        productLists={productList}
                        memberLists={memberList}
                        memberLoader={memberLoader}
                        prodLoader={prodLoader}
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
                      <RaisedRequest
                        formatDate={formatDate}
                        memberLists={memberList}
                        memberLoader={memberLoader}
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
                      <AppliedLeave
                        formatDate={formatDate}
                        memberLists={memberList}
                        memberLoader={memberLoader}
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

export default History
