import React, { useState, useEffect, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { isMobile } from 'react-device-detect'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/auth/login/Login'))
const Page404 = React.lazy(() => import('./views/auth/page404/Page404'))

const App = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768) // Adjust the breakpoint as needed
    }

    // Initial check
    handleResize()

    // Listen to window resize events
    window.addEventListener('resize', handleResize)

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (isMobile || isSmallScreen) {
    return (
      <div style={{ textAlign: 'center', padding: '20px', fontSize: '20px' }}>
        Mobile device detected. This app is not supported on mobile.
      </div>
    )
  }

  return (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/" name="Login Page" element={<Login />} />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
