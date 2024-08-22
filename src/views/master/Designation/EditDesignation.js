import React, { useRef, useState, useEffect } from 'react'
import { getHeaders } from 'src/constant/Global'
import { CCol, CRow, CForm, CFormLabel, CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Breadcrumb, Input, Button } from 'antd'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import { Link } from 'react-router-dom'
import useAxios from 'src/constant/UseAxios'
import eventEmitter from 'src/constant/EventEmitter'

const EditDesignation = ({ close, viewDesignation }) => {
  let api = useAxios()
  const [designation, setDesignation] = useState(viewDesignation.name)
  const formRef = useRef(null)
  const [validated, setValidated] = useState(false)
  const [loadings, setLoadings] = useState(false)
  const [formErrors, setFormErrors] = useState({
    designation: '',
  })
  const onInputChange = (e) => {
    const { value } = e.target
    const regex = /^(?!^\s)[A-Za-z\s-]*[A-Za-z][A-Za-z\s-]*$/ // Regex to allow alphabets, hyphen, and space

    if (regex.test(value) || value === '') {
      setDesignation(value)
    }
  }

  useEffect(() => {}, [])

  const resetComponent = () => {
    eventEmitter.emit('callDesignationList')
    close()
  }
  const validateForm = () => {
    const errors = {
      designation: '',
    }
    if (designation === '') {
      errors.designation = 'Please Enter Designation'
    }
    setFormErrors(errors)

    // Check for any errors in the validation
    const hasErrors = errors.designation !== ''
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
        setLoadings(true)
        const formData = new FormData()
        formData.append('name', designation)

        const url = 'master/role/update/' + viewDesignation.id
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
            Edit Designation
          </h6>
          <Breadcrumb
            // style={{ marginLeft: '12px' }}
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
                    Desigination Master
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Edit Designation
                  </span>
                ),
              },
            ]}
          />
          {/* </CCol>
      </CRow>
      <CRow> */}
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
                      Designation <span className="red-text1">*</span>
                    </CFormLabel>
                    <Input
                      variant={'borderless'}
                      maxLength={48}
                      type="text"
                      className="border-0 time-border-bottom user-input  "
                      placeholder="Enter Designation"
                      value={designation}
                      onChange={onInputChange}
                    ></Input>
                  </div>
                  <span className="text-danger nameflow-error ">{formErrors.designation}</span>
                </CCol>
              </CRow>

              {/* </CCardBody>
          </CCard> */}
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
                      {' '}
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

EditDesignation.propTypes = {
  close: PropTypes.func,
  viewDesignation: PropTypes.object,
}
export default EditDesignation
