import React from 'react'
import { CContainer, CRow } from '@coreui/react'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

const Page404 = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center text-center">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ color: '#e40e2d' }}
          >
            <h2 className="mx-2 mt-3">404</h2>
            <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
          </div>
          <p style={{ color: 'rgb(207 87 104)' }}>The page you are looking for was not found.</p>
          <Button
            className="btn-sm col-sm-1"
            style={{ background: '#e40e2d', color: 'white', borderColor: '#e40e2d' }}
            onClick={() => navigate(-2)}
          >
            Go Back
          </Button>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page404
