import React, { useState, useEffect } from 'react'
import { CCard, CCol, CRow, CNavItem, CTabContent, CTabPane, CNav, CNavLink } from '@coreui/react'
import { getHeaders, getDecodeData } from 'src/constant/Global'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PendingActivity from './PendingActivity'
import RequestList from './RequestList'
import useAxios from 'src/constant/UseAxios'
import SwipeDetails from './SwipeDetails'

const MembersActivity = () => {
  let api = useAxios()
  const user = getDecodeData()
  const [productList, setProductList] = useState([])
  const [memberList, setMemberList] = useState([])
  const [activeKey, setActiveKey] = useState(1)
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
                <CNavItem role="presentation6">
                  <CNavLink
                    className="nav-link-lable pen-activity"
                    active={activeKey === 1}
                    component="button"
                    role="tab"
                    aria-controls="home-tab-pane"
                    aria-selected={activeKey === 1}
                    onClick={() => setActiveKey(1)}
                  >
                    Pending Activity
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation3">
                  <CNavLink
                    active={activeKey === 4}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 4}
                    onClick={() => setActiveKey(4)}
                  >
                    Request List
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation4">
                  <CNavLink
                    active={activeKey === 5}
                    component="button"
                    role="tab"
                    aria-controls="contact-tab-pane"
                    aria-selected={activeKey === 5}
                    onClick={() => setActiveKey(5)}
                  >
                    Swipe Details
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent className={`${activeKey === 5 ? 'swp_tab_height' : ''}`}>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="home-tab-pane"
                  visible={activeKey === 1}
                  className="pendingactivity-card tab_height"
                >
                  <CRow>
                    {activeKey === 1 && (
                      <PendingActivity
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
                  visible={activeKey === 4}
                  className="pendingactivity-card tab_height"
                >
                  <CRow>
                    {activeKey === 4 && (
                      <RequestList
                        today={getToday()}
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
                  visible={activeKey === 5}
                  className="pendingactivity-card swp_height"
                >
                  <CRow>{activeKey === 5 && <SwipeDetails memberLists={memberList} />}</CRow>
                </CTabPane>
              </CTabContent>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default MembersActivity
