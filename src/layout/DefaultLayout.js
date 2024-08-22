import React from 'react'
import { AppContent, AppHeader, AppSidebar } from '../components/index'
import AppHeaderImage from '../components/header/LayoutImage'

const DefaultLayout = () => {
  const renderContent = () => {
    return (
      <div>
        <AppSidebar />

        <div className="wrapper d-flex flex-column login-page-main ">
          <div className="Appheader_img">
            <AppHeader />
          </div>

          <div className="AppHeadersec_img">
            <AppHeaderImage />
          </div>

          <div className="card-body Appheader_img2 AppContent_body">
            <AppContent />
          </div>
        </div>
      </div>
    )
  }

  return renderContent()
}

export default DefaultLayout
