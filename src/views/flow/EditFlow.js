import React, { useState, useRef, useEffect } from 'react'
import { CCol, CRow, CButton, CForm, CFormLabel, CFormInput } from '@coreui/react'
import PropTypes from 'prop-types'
import { ImageUrl, getDecodeData, getHeaders } from '../../constant/Global'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import profileImage1 from '../../assets/images/avatars/man1.png'
import trashIcon from '../../assets/images/form/trash-icon.png'
import { Breadcrumb, Button, Select } from 'antd'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import useAxios from 'src/constant/UseAxios'
import Downarrowimg from '../../assets/images/downarrow.png'
import { toPascalCase } from '../../constant/TimeUtils'
import { Link } from 'react-router-dom'

const EditFlow = ({ userData, prodList, close, viewFlowData }) => {
  let api = useAxios()
  const user = getDecodeData()
  const [selectedApprovals, setSelectedApprovals] = useState([])
  const [formErrors, setFormErrors] = useState({
    accessTo: '',
    approvalBy: [], // Change from array to object
    flow: '',
  })
  const [hiddenId, setHiddenId] = useState()
  const [approvalFlows, setApprovalFlows] = useState([])
  const [selectedValues, setSelectedValues] = useState([])
  const formRef = useRef(null)
  const [flowName, setFlowName] = useState('')
  const [selectedAccessValue, setSelectedAccessValue] = useState([])
  const [loadings, setLoadings] = useState(false)
  const options = userData.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options select-options-approval">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px', borderRadius: '14px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {toPascalCase(user.name)}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))

  const options1 = prodList.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options select-options-approval">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px', borderRadius: '14px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {toPascalCase(user.name)}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))

  const handleAccessChange = (selectedOptions) => {
    setSelectedAccessValue((prevSelectedAccessValue) => {
      if (selectedOptions && selectedOptions.length > 0) {
        const newValues = selectedOptions.map((option) => ({
          id: Number(option.value),
          name: prodList.find((user) => user.id === option.value)?.name || '',
        }))
        return newValues
      } else {
        return []
      }
    })
  }

  const removeApprovalFlow = (index) => {
    if (index !== 0) {
      setFormErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        if (newErrors.approvalBy && newErrors.approvalBy[index]) {
          newErrors.approvalBy[index] = ''
        }
        return newErrors
      })
      setApprovalFlows((prevApprovalFlows) => {
        const updatedFlows = [...prevApprovalFlows]
        updatedFlows.splice(index, 1)
        return updatedFlows
      })

      setSelectedApprovals((prevSelectedApprovals) => {
        const updatedApprovals = [...prevSelectedApprovals]
        updatedApprovals.splice(index, 1)
        return updatedApprovals
      })

      setSelectedValues((prevSelectedApprovals) => {
        const updatedApprovals = [...prevSelectedApprovals]
        updatedApprovals.splice(index, 1)
        return updatedApprovals
      })
    }
  }

  const handleApprovalSelectChange = (selectedOption, index) => {
    if (selectedOption) {
      const newValue = selectedOption
      setSelectedApprovals((prevSelectedApprovals) => {
        const updatedApprovals = [...prevSelectedApprovals]
        updatedApprovals[index] = {
          id: Number(newValue),
          name: userData.find((user) => user.id === newValue)?.name || '',
        }
        return updatedApprovals
      })
    } else {
      // Handle the case when the selection is cleared
      setSelectedApprovals((prevSelectedApprovals) => {
        const updatedApprovals = [...prevSelectedApprovals]
        updatedApprovals[index] = null
        return updatedApprovals
      })
    }
  }

  const addApprovalFlow = () => {
    setApprovalFlows([...approvalFlows, {}])
    setSelectedValues([...selectedValues, null])
  }

  const validateForm = () => {
    const errors = {
      accessTo: '',
      approvalBy: [],
      flow: '',
    }

    // Validate Flow Name
    if (!flowName.trim()) {
      errors.flow = 'Please Enter Flow Name'
    }

    // Validate Access To (multi-select)
    if (!selectedAccessValue || selectedAccessValue.length === 0) {
      errors.accessTo = 'Please Select at Least One Option'
    }

    // Validate Approval Flows
    if (approvalFlows.length !== 0) {
      approvalFlows.forEach((data, index) => {
        if (selectedApprovals[index] === undefined || selectedApprovals[index] === null) {
          // Push the error message to the array
          errors.approvalBy[index] = 'Please Select an Approval'
        }
      })
    }

    setFormErrors(errors)

    // Check for any errors in the validation
    const hasErrors =
      errors.flow !== '' ||
      errors.accessTo !== '' ||
      errors.approvalBy.some((error) => error !== '')

    return !hasErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const isFormValid = validateForm()
    if (isFormValid) {
      setLoadings(true)
      const userId = user.id
      const postData = {
        name: flowName,
        access_to: selectedAccessValue,
        approval_by: selectedApprovals,
        created_by: userId,
      }
      const url = `flow/update/${hiddenId}`
      await api
        .put(url, postData, {
          headers: getHeaders('json'),
        })
        .then((response) => {
          toast.success(response.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
          setLoadings(false)
          resetModal()
        })
        .catch((error) => {
          const errors = error.response
          setLoadings(false)
          // if (errors.status === 409 && errors.status === 400) {
          toast.error(errors.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
          // } else {
          //   toast.error(error.message, {
          //     position: toast.POSITION.BOTTOM_RIGHT,
          //     autoClose: 3000,
          //   })
          // }
        })
    }
  }

  const resetModal = () => {
    setSelectedAccessValue([])
    setApprovalFlows([{}])
    setSelectedApprovals([])
    setSelectedValues([null])
    setFlowName('')
    if (formRef.current) {
      formRef.current.reset()
    }
    const errors = {
      accessTo: '',
      approvalBy: [],
      flow: '',
    }
    setFormErrors(errors)
    close()
  }

  const onInputChange = (e) => {
    const { value } = e.target

    const re = /^[A-Za-z0-9\s-]*$/

    if (re.test(value)) {
      setFlowName(value)
    }
  }

  useEffect(() => {
    if (viewFlowData) {
      setFlowName(viewFlowData.name)
      setHiddenId(viewFlowData.id)
      setSelectedAccessValue(viewFlowData.access)
      setApprovalFlows(viewFlowData.approvals.map((approval) => ({})))
      setSelectedValues(viewFlowData.approvals.map((approval) => approval.id))
      setSelectedApprovals(
        viewFlowData.approvals.map((approval) => ({
          id: approval.id,
          name: approval.name,
        })),
      )
    }
  }, [viewFlowData])

  return (
    <CCol xs={12} className="card flowlist-main-card product_card_flow">
      <CRow>
        <CCol sm={1} style={{ width: '20px' }} className="backarrow_content">
          <span style={{ cursor: 'pointer', marginRight: '2px' }} onClick={close}>
            <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
          </span>
        </CCol>
        <CCol style={{ marginLeft: '20px' }}>
          <div style={{ display: 'flex' }}>
            <h6 className="draft-heading-flow" style={{ marginTop: '3%' }}>
              Edit{' '}
            </h6>
            <div style={{ marginTop: '3%', marginLeft: '10px' }}>
              <h6>
                <span style={{ color: '#E01B38', fontWeight: '700' }} className="  user_pic_name">
                  {viewFlowData.name}
                </span>
              </h6>
            </div>
          </div>
          <Breadcrumb
            className="bread-tab"
            separator={<span className="breadcrumb-separator">|</span>}
            items={[
              {
                title: (
                  <Link
                    rel="Dashboard"
                    to={'/dashboard'}
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
                    onClick={resetModal}
                  >
                    Flow list
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Edit Flow
                  </span>
                ),
              },
            ]}
          />
          {/* </CCol>

        <CCol xs={12} className="edit_flow_body" style={{ marginLeft: '34px', width: '99%' }}> */}
          <CForm className="mt-3 needs-validation" noValidate onSubmit={handleSubmit} ref={formRef}>
            <CRow>
              <CCol sm={3}>
                <div className="label-field-container">
                  <CFormLabel className="approval-title" htmlFor="validationCustom01">
                    Name of the Flow <span className="red-text1 ">*</span>
                  </CFormLabel>
                  <CFormInput
                    className="form-input flow-name-input"
                    type="text"
                    maxLength={48}
                    id="validationCustom01"
                    placeholder="Enter Flow Name"
                    feedbackInvalid="Please provide a Flow Name."
                    required
                    value={flowName}
                    onChange={onInputChange}
                  />
                </div>
                <span className="text-danger nameflow-error  ">{formErrors.flow}</span>
              </CCol>
              <CCol sm={9} span={6}>
                <div className="label-field-container">
                  <CFormLabel className="approval-title-acc" htmlFor="validationCustom01">
                    Access Persons <span className="red-text1">*</span>
                  </CFormLabel>
                  <Select
                    suffixIcon={
                      <img
                        src={Downarrowimg}
                        alt="Downarrowimg"
                        style={{ width: '10px', height: '6px' }}
                      />
                    }
                    className="form-custom-selects access-input-box approval_select "
                    value={
                      selectedAccessValue
                        ? options1.filter((option) =>
                            selectedAccessValue.some((selected) => selected.id === option.value),
                          )
                        : null
                    }
                    options={options1}
                    onChange={handleAccessChange}
                    required
                    showSearch
                    placeholder="Choose Access"
                    allowClear
                    mode="multiple"
                    maxTagCount="responsive"
                    variant={'borderless'}
                    filterOption={(input, option) => {
                      const userName =
                        option.label.props.children[1].props.children[0].props.children
                      const lowerCaseInput = input.toLowerCase()
                      const lowerCaseUserName = userName.toLowerCase()
                      return lowerCaseUserName.includes(lowerCaseInput)
                    }}
                    labelInValue={(option) => (
                      <div className="select-options select-options-approval">
                        <img
                          src={option.profile_pic ? ImageUrl + option.profile_pic : profileImage1}
                          style={
                            option.profile_pic
                              ? { width: '29px', borderRadius: '14px' }
                              : { width: '39px' }
                          }
                          alt={option.value}
                          className="img-flag"
                        />
                        <div
                          className="node1"
                          style={option.profile_pic ? { marginLeft: '11px' } : {}}
                        >
                          <p className="user-name1">{option.value}</p>
                          <p className="role-text1">{option.label.role}</p>
                        </div>
                      </div>
                    )}
                  />
                </div>
                <span className="text-danger nameflow-error ">{formErrors.accessTo}</span>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm={9} className="approval-title" style={{ marginTop: '40px' }}>
                Approval Flow <span className="red-text1">*</span>
              </CCol>
            </CRow>
            <CRow gutter={12} className="approval-body">
              {approvalFlows.map((flow, index) => {
                const filteredOptions = options.filter(
                  (option) => !selectedValues.includes(option.value),
                )
                const filteredApprovalOptions = filteredOptions.filter(
                  (option) =>
                    !selectedAccessValue ||
                    !selectedAccessValue.some((selected) => selected.id === option.value),
                )

                return (
                  <CCol
                    sm={6}
                    md={3}
                    className="Edit_approval_selct"
                    style={{ marginTop: '15px' }}
                    key={index}
                  >
                    <div className="approval-flow-list-input">
                      <CFormLabel
                        className="form-label text-c approval-title-inputbox"
                        htmlFor={`approvalSelect-${index}`}
                      >
                        Approval {index + 1}
                      </CFormLabel>
                      <div className="select-approval-flow">
                        <Select
                          className="form-custom-selects approval-input-box approval_select"
                          value={
                            selectedValues[index] !== undefined
                              ? options.find((option) => option.value === selectedValues[index]) ||
                                null
                              : null
                          }
                          variant={'borderless'}
                          suffixIcon={
                            <img
                              src={Downarrowimg}
                              alt="Downarrowimg"
                              style={{ width: '10px', height: '6px' }}
                            />
                          }
                          placeholder="Choose Approval"
                          onChange={(selectedValue) => {
                            const updatedValues = [...selectedValues]
                            updatedValues[index] = selectedValue
                            setSelectedValues(updatedValues)

                            handleApprovalSelectChange(selectedValue, index)
                          }}
                          required
                          showSearch
                          filterOption={(input, option) => {
                            const userNameArray =
                              option &&
                              option.children.props.children[1].props.children[0].props.children
                            const userName = userNameArray
                            const lowerCaseInput = input.toLowerCase()
                            const lowerCaseUserName = userName.toLowerCase()
                            return lowerCaseUserName.includes(lowerCaseInput)
                          }}
                          allowClear
                        >
                          {filteredApprovalOptions.map((option) => (
                            <Select.Option key={option.value} value={option.value}>
                              {option.label}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                      {formErrors.approvalBy[index] && (
                        <span className="text-danger approval-error-msg mx-1">
                          {formErrors.approvalBy[index]}
                        </span>
                      )}
                      {index !== 0 && (
                        <button
                          className="text-decoration-none mt-2 border-0 bg-none add-row float-end delete-apporval-field"
                          onClick={() => removeApprovalFlow(index)}
                        >
                          <div className="delete_image">
                            <img
                              src={trashIcon}
                              alt="trash"
                              style={{ width: '12px', height: '13px' }}
                            />
                          </div>
                        </button>
                      )}
                    </div>
                  </CCol>
                )
              })}
              <CCol sm={3}>
                <button
                  className="text-decoration-none border-0 add-row d-flex  add-row-flowlist"
                  onClick={addApprovalFlow}
                  type="button"
                >
                  <span style={{ fontSize: '15px', marginRight: '2px' }}> </span> Add Approval
                </button>
              </CCol>
            </CRow>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: '17px' }}>
              <CRow className="m-3">
                <CCol sm={6}></CCol>
                <CCol sm={6} className="d-flex justify-content-end align-items-center">
                  <CButton className="cancel-btn text-c  " onClick={close}>
                    Cancel
                  </CButton>
                  <Button
                    className="crt-submit-button flow-btn save_changes "
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
      </CRow>
    </CCol>
  )
}
EditFlow.propTypes = {
  userData: PropTypes.array.isRequired,
  prodList: PropTypes.array.isRequired,
  close: PropTypes.func,
  viewFlowData: PropTypes.object,
}
export default EditFlow
