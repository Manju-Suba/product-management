import React, { useRef, useState, useEffect } from 'react'
import { getHeaders } from 'src/constant/Global'
import { CCol, CRow, CButton, CForm, CFormLabel } from '@coreui/react'
import PropTypes from 'prop-types'
import { Breadcrumb, Button, Select } from 'antd'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import { Link } from 'react-router-dom'
import useAxios from 'src/constant/UseAxios'
import Downarrowimg from '../../../assets/images/downarrow.png'
const DesignationMapping = ({ close, viewDesignation, viewTask }) => {
  let api = useAxios()
  const formRef = useRef(null)
  const [selectedDesignation, setSelectedDesignation] = useState([])
  const [loadings, setLoadings] = useState(false)
  const [errors, setErrors] = useState({ designationError: '' })
  useEffect(() => {
    if (viewTask) {
      const value = viewTask.designations
      if (value) {
        const designation = value.map((data) => ({
          value: data,
          label: viewDesignation.find((role) => role.id === data)?.name || '',
        }))
        setSelectedDesignation(designation)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewTask])
  const validateForm = () => {
    const errors = {
      designationError: '',
    }
    if (selectedDesignation.length === 0) {
      errors.designationError = 'Please Select Designation'
    }
    setErrors(errors)

    // Check if any errors exist
    const hasErrors = errors.designationError !== ''
    return !hasErrors
  }
  const resetComponent = () => {
    close()
  }
  const options1 = [
    // Include an empty option
    ...viewDesignation.map((roles) => ({
      value: roles.id,
      label: roles.name,
    })),
  ]

  const handleDesignation = (selectedValues) => {
    setSelectedDesignation(selectedValues)
  }

  const handleSubmit = async () => {
    // const idsString = selectedDesignation.map((item) => item.value).join(',')
    const isFormValid = validateForm()
    if (isFormValid) {
      setLoadings(true)
      const url = `master/taskcategory/map/designation?groupId=${viewTask.id}&roleId=${selectedDesignation}`
      api
        .post(url, null, {
          headers: getHeaders('json'),
        })
        .then((response) => {
          // setViewtaskData(response.data.data)
          // setTaskVisibleView(true)
          if (response.data.status === true) {
            toast.success('Designation Mapped SuccesFully', {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 3000,
            })
            setLoadings(false)
            resetComponent()
          }
        })
        .catch((error) => {
          setLoadings(false)
          toast.error('Error fetching data', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
        })
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
            Designation Mapping
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
                    Task Activity Master
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Designation Mapping
                  </span>
                ),
              },
            ]}
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12} className="" style={{ marginLeft: '63px', width: '100%' }}>
          <CForm className="mt-4  needs-validation" ref={formRef} onSubmit={handleSubmit}>
            <div className="activity_overflow">
              <CRow gutter={16}>
                <CCol sm={3} span={6}>
                  <div className="label-field-container">
                    <CFormLabel className="form-label text-c" htmlFor="validationCustom01">
                      Designation
                    </CFormLabel>
                    <Select
                      suffixIcon={
                        <img
                          src={Downarrowimg}
                          alt="Downarrowimg"
                          style={{ width: '12px', height: '7px' }}
                        />
                      }
                      className="form-custom-selects"
                      value={selectedDesignation}
                      onChange={handleDesignation}
                      showSearch
                      placeholder="Choose Designation"
                      mode="multiple"
                      allowClear
                      options={options1}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    />
                  </div>
                  <span className="text-danger nameflow-error">{errors.designationError}</span>
                </CCol>
              </CRow>
            </div>
            <div style={{ position: 'absolute', left: 0, right: '17px' }}>
              <CRow className="m-3">
                <CCol sm={6}></CCol>
                <CCol sm={6} className="d-flex justify-content-end align-items-center">
                  <CButton className="cancel-btn text-c" onClick={close}>
                    Cancel
                  </CButton>
                  <Button
                    className="Edit_save_changes"
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
      </CRow>
    </>
  )
}

DesignationMapping.propTypes = {
  close: PropTypes.func,
  viewDesignation: PropTypes.array,
  viewTask: PropTypes.object,
}
export default DesignationMapping
