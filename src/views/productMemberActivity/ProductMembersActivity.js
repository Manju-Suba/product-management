import React, { useState, useEffect } from 'react'
import { CCard, CCol, CRow, CNavItem, CTabContent, CTabPane, CNav, CNavLink } from '@coreui/react'
import { getHeaders } from 'src/constant/Global'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PendingActivity from './PendingActivity'
import ClosedActivity from './ClosedActivity'
import useAxios from 'src/constant/UseAxios'

const ContractMembersActivity = () => {
  let api = useAxios()
  const [productList, setProductList] = useState([])
  const [activeKey, setActiveKey] = useState(1)
  const [prodLoader, setProdLoader] = useState(true)

  useEffect(() => {
    getproductList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          <CCard className="mt-4 memberActivity-content">
            <div>
              <CNav variant="pills" role="tablist">
                <CNavItem role="presentation2">
                  <CNavLink
                    className="nav-link-lable"
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
                <CNavItem role="presentation1">
                  <CNavLink
                    active={activeKey === 2}
                    component="button"
                    role="tab"
                    aria-controls="profile-tab-pane"
                    aria-selected={activeKey === 2}
                    onClick={() => setActiveKey(2)}
                  >
                    Closed activity
                  </CNavLink>
                </CNavItem>
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
                      <PendingActivity
                        formatDate={formatDate}
                        productLists={productList}
                        prodLoader={prodLoader}
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
                      <ClosedActivity
                        formatDate={formatDate}
                        productLists={productList}
                        prodLoader={prodLoader}
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

export default ContractMembersActivity
