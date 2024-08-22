import React, { useRef, useState, useEffect } from 'react'
import { getHeaders } from 'src/constant/Global'
import { CCol, CRow, CButton, CForm, CFormLabel } from '@coreui/react'
import PropTypes from 'prop-types'
import { Breadcrumb, Button, Input } from 'antd'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import useAxios from 'src/constant/UseAxios'
import { Link } from 'react-router-dom'

const AddBusiness = ({ close }) => {
  let api = useAxios()
  const [validated, setValidated] = useState(false)
  const [business, setBusiness] = useState('')
  const [loadings, setLoadings] = useState(false)
  const formRef = useRef(null)
  const [formErrors, setFormErrors] = useState({
    business: '',
  })
  const onInputChange = (e) => {
    const { value } = e.target
    const regex = /^(?!^\s)[A-Za-z\s-]*[A-Za-z][A-Za-z\s-]*$/ // Regex to allow alphabets, hyphen, and space

    if (regex.test(value) || value === '') {
      setBusiness(value)
    }
  }
  useEffect(() => {}, [])
  const validateForm = () => {
    const errors = {
      business: '',
    }
    if (business === '') {
      errors.business = 'Please Enter Business'
    }
    setFormErrors(errors)
    const hasErrors = errors.business !== ''
    return !hasErrors
  }
  const handleSubmit = async (event, values) => {
    event.preventDefault()
    const form = event.currentTarget
    const isFormValid = validateForm()
    if (isFormValid) {
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        setValidated(true)
      } else {
        const formData = new FormData()
        formData.append('name', business)
        setLoadings(true)
        const url = 'master/bussiness/create'
        await api
          .post(url, formData, {
            headers: getHeaders('multi'),
          })
          .then((response) => {
            setLoadings(false)
            if (response.status === 208) {
              toast.error(response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
              })
            } else {
              toast.success(response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
              })
              if (formRef.current) {
                formRef.current.reset()
              }
              resetComponent()
            }
          })
          .catch((error) => {
            setLoadings(false)
            const errorMesssage = error.response.data
            if (errorMesssage) {
              toast.error(errorMesssage.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
              })
            } else {
              toast.error(error, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 3000,
              })
            }
          })
      }
    }
  }
  const resetComponent = () => {
    setBusiness('')
    close()
  }

  return (
    <>
      <CRow>
        <CCol sm={1} style={{ width: '20px' }} className="cancle-arrow-content">
          <span style={{ cursor: 'pointer', marginRight: '2px' }} onClick={close}>
            <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
          </span>
        </CCol>
        <CCol>
          <h6 className="draft-heading" style={{ marginTop: '29px' }}>
            Add Business
          </h6>
          <Breadcrumb
            className="bread-tab"
            separator={<span className="breadcrumb-separator">|</span>}
            items={[
              {
                title: (
                  <Link
                    rel="Dashboard"
                    to={'/dashboard'}
                    style={{ marginLeft: '17px' }}
                    className="bread-items text-decoration-none text-secondary "
                  >
                    Dashboard
                  </Link>
                ),
              },
              {
                title: (
                  <span
                    className="bread-items text-secondary second-subheading"
                    style={{ cursor: 'pointer' }}
                    onClick={resetComponent}
                  >
                    Business Master
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Add Business
                  </span>
                ),
              },
            ]}
          />
          {/* </CCol>
      </CRow> */}
          {/* <CRow> */}
          <CCol xs={12} className="" style={{ marginLeft: '22px', width: '100%' }}>
            <CForm
              className="mt-4  needs-validation"
              ref={formRef}
              validated={validated}
              onSubmit={handleSubmit}
            >
              <CRow gutter={16}>
                <CCol sm={3} span={6}>
                  <div className="label-field-container">
                    <CFormLabel className="form-label text-c" htmlFor="validationCustom01">
                      Business{' '}
                      <span className="red-text1" style={{ marginLeft: '5px' }}>
                        *
                      </span>
                    </CFormLabel>
                    <Input
                      style={{ marginTop: '10px' }}
                      variant={'borderless'}
                      maxLength={48}
                      className="border-0 time-border-bottom  des-box  "
                      placeholder="Enter Business"
                      value={business}
                      onChange={onInputChange}
                    ></Input>
                  </div>
                  <span className="text-danger nameflow-error ">{formErrors.business}</span>
                </CCol>
              </CRow>
              <div style={{ position: 'absolute', left: 0, right: '17px' }}>
                <CRow className="m-3">
                  <CCol sm={6}></CCol>
                  <CCol sm={6} className="d-flex justify-content-end align-items-center">
                    <CButton className="cancel-btn text-c" onClick={close}>
                      Cancel
                    </CButton>
                    <Button
                      className=" Edit_save_changes"
                      style={{ fontSize: '13px', color: 'white' }}
                      htmlType="submit"
                      loading={loadings}
                    >
                      Submit
                    </Button>
                  </CCol>
                </CRow>
              </div>
            </CForm>
          </CCol>
        </CCol>
      </CRow>
    </>
  )
}

AddBusiness.propTypes = {
  close: PropTypes.func,
}
export default AddBusiness
