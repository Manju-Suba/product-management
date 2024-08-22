import React, { useRef, useState, useEffect } from 'react'
import { getHeaders } from 'src/constant/Global'
import { CCol, CRow, CForm, CFormLabel, CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Breadcrumb, Input, Button } from 'antd'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import useAxios from 'src/constant/UseAxios'
import { Link } from 'react-router-dom'

const EditBusiness = ({ close, viewBusiness }) => {
  let api = useAxios()
  const [business, setBusiness] = useState(viewBusiness.name)
  const [loadings, setLoadings] = useState(false)
  const formRef = useRef(null)
  const [validated, setValidated] = useState(false)
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

  const resetComponent = () => {
    close()
  }
  const validateForm = () => {
    const errors = {
      business: '',
    }
    if (business === '') {
      errors.business = 'Please Enter Designation'
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
        const url = 'master/bussiness/update/' + viewBusiness.id
        await api
          .put(url, formData, {
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
            const errors = error.response
            if (errors) {
              if (errors) {
                toast.error(errors.data.message, {
                  position: toast.POSITION.BOTTOM_RIGHT,
                  autoClose: 3000,
                })
              } else {
                toast.error(error, {
                  position: toast.POSITION.BOTTOM_RIGHT,
                  autoClose: 3000,
                })
              }
            }
          })
      }
    }
  }

  return (
    <>
      <CRow>
        <CCol
          sm={2}
          style={{ width: '26px', display: 'flex', marginLeft: '17px', marginTop: '40px' }}
        >
          <span style={{ cursor: 'pointer' }} onClick={close}>
            <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
          </span>
        </CCol>
        <CCol>
          <h6 className="draft-heading" style={{ marginTop: '29px' }}>
            Edit Business
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
                    className="bread-items text-decoration-none text-secondary first-subheading"
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
                    Edit Business
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
                      Business
                      <span className="red-text1" style={{ marginLeft: '5px' }}>
                        *
                      </span>
                    </CFormLabel>
                    <Input
                      variant={'borderless'}
                      maxLength={48}
                      type="text"
                      className="border-0 time-border-bottom  des-box  "
                      placeholder="Enter Designation"
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
                      className="Edit_update_changes "
                      style={{ fontSize: '13px', color: 'white' }}
                      htmlType="submit"
                      loading={loadings}
                    >
                      Update
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

EditBusiness.propTypes = {
  close: PropTypes.func,
  viewBusiness: PropTypes.object,
}
export default EditBusiness
