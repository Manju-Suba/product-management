import React, { useRef, useState, useEffect } from 'react'
import { getHeaders } from 'src/constant/Global'
import { CCol, CRow, CButton, CForm, CFormLabel } from '@coreui/react'
import PropTypes from 'prop-types'
import { Breadcrumb, Input, Button } from 'antd'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import useAxios from 'src/constant/UseAxios'
import { Link } from 'react-router-dom'

const AddDesignation = ({ close }) => {
  let api = useAxios()
  const [validated, setValidated] = useState(false)
  const [designation, setDesignation] = useState('')
  const [loadings, setLoadings] = useState(false)
  const formRef = useRef(null)
  const [formErrors, setFormErrors] = useState({
    designation: '',
  })
  const handleInputChange = (e) => {
    const { value } = e.target
    const regex = /^(?!^\s)[A-Za-z\s-]*[A-Za-z][A-Za-z\s-]*$/

    if (regex.test(value) || value === '') {
      setDesignation(value)
    }
  }

  useEffect(() => {}, [])
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

        const url = 'master/role/create'
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
    setDesignation('')
    // eventEmitter.emit('callDesignationList')
    close()
  }

  return (
    <>
      <CRow>
        <CCol sm={2} style={{ width: '26px', display: 'flex' }}>
          <span
            style={{ cursor: 'pointer', marginLeft: '17px', marginTop: '40px' }}
            onClick={close}
          >
            <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
          </span>
        </CCol>
        <CCol style={{ marginLeft: '12px' }}>
          <h6 className="draft-heading" style={{ marginTop: '29px' }}>
            Add Designation
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
                    Designation Master
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Add Designation
                  </span>
                ),
              },
            ]}
          />
          {/* </CCol>
      </CRow> */}
          {/* <CRow> */}
          {/* <CCol xs={12} className="" style={{ marginLeft: '39px', width: '100%' }}> */}
          <CForm
            className="mt-4  needs-validation"
            ref={formRef}
            validated={validated}
            onSubmit={handleSubmit}
            style={{ marginLeft: '24px', width: '100%' }}
          >
            <CRow gutter={16}>
              <CCol sm={3} span={6}>
                <div className="label-field-container">
                  <CFormLabel className="form-label text-c" htmlFor="validationCustom01">
                    Designation
                    <span className="red-text1" style={{ marginLeft: '5px' }}>
                      *
                    </span>
                  </CFormLabel>
                  <Input
                    style={{ marginTop: '10px' }}
                    variant={'borderless'}
                    maxLength={48}
                    className="border-0 time-border-bottom des-box "
                    placeholder="Enter Designation"
                    value={designation}
                    onChange={handleInputChange}
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
          {/* </CCol> */}
        </CCol>
      </CRow>
    </>
  )
}

AddDesignation.propTypes = {
  close: PropTypes.func,
}
export default AddDesignation
