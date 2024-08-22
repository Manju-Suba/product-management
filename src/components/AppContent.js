import React, { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CContainer } from '@coreui/react'

// routes config
import routes from '../routes'
import { getDecodeData } from 'src/constant/Global'

const AppContent = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getDecodeData()
  useEffect(() => {
    if (user === null) {
      navigate('/')
    }
  }, [user, navigate])

  const isPathMatched = routes.some((route) => route.path === location.pathname)

  return (
    <CContainer lg>
      <div id="append-report-alert"></div>
      <Suspense fallback={''}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          {!isPathMatched && user !== null && <Route path="*" element={<Navigate to="/404" />} />}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
