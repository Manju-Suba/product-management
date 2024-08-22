import React, { useRef, useState, useEffect } from 'react'
import { getHeaders } from 'src/constant/Global'
import { CCol, CRow, CButton, CForm, CFormLabel } from '@coreui/react'
import PropTypes from 'prop-types'
import { Breadcrumb, Button, Input } from 'antd'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import { Link } from 'react-router-dom'
import PlusSvg from 'src/views/svgImages/PlusSvg'
import DeleteSvg from 'src/views/svgImages/DeleteSvg'
import useAxios from 'src/constant/UseAxios'

const EditTaskActivity = ({ close, viewTask }) => {
  let api = useAxios()
  const [validated, setValidated] = useState(false)
  const [task, setTask] = useState(viewTask.groupName)
  const [activity, setActivity] = useState(viewTask.categories)
  const [taskValues, setTaskValues] = useState(viewTask.categories)
  const formRef = useRef(null)
  const [errors, setErrors] = useState({ task: '', activity: [] }) // State for managing errors
  const [loadings, setLoadings] = useState(false)
  const [showAddButton, setShowAddButton] = useState([false])
  const [showAddButtonpre, setShowAddButtonpre] = useState([true])

  useEffect(() => {
    const newShowAddButton = Array.from({ length: taskValues.length }, () => true)
    const newShowAddButtonArray = Array.from({ length: taskValues.length }, () => false)
    setShowAddButtonpre(newShowAddButton)
    if (taskValues.length > 0) {
      newShowAddButtonArray[taskValues.length - 1] = true
    }
    setShowAddButton(newShowAddButtonArray)
  }, [taskValues])

  const onInputChange = (e) => {
    const { value } = e.target
    const regex = /^(?!^\s)[A-Za-z\s\-&/]*[A-Za-z][A-Za-z\s\-&/]*$/ // Regex to allow alphabets, hyphen, and space

    if (regex.test(value) || value === '') {
      setTask(value)
    }
  }
  useEffect(() => {}, [])

  const validateForm = () => {
    const errors = {
      task: '',
      activity: Array.from({ length: activity.length }, () => ''),
    }

    if (task === '') {
      errors.task = 'Please Enter Task'
    }
    taskValues.forEach((value, index) => {
      if (value === '') {
        errors.activity[index] = 'Please Enter Activity'
      }
    })
    setErrors(errors)

    // Check if any errors exist
    const hasErrors =
      Object.values(errors.activity).some((value) => value !== '') || errors.task !== ''
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
        formData.append('groupName', task)
        formData.append('category', taskValues)
        setLoadings(true)

        const url = 'master/taskcategory/update/' + viewTask.id
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
  const resetComponent = () => {
    setTask('')
    setTaskValues([''])
    close()
  }
  const addActivity = (index) => {
    setActivity([...activity, {}])
    setTaskValues([...taskValues, ''])
    setErrors((prevErrors) => ({ ...prevErrors, activity: [...prevErrors.activity, ''] }))
    setShowAddButton(() => {
      const newShowAddButton = showAddButtonpre.map((value, i) => (i === index ? false : false))
      return newShowAddButton
    })
  }
  const removeActivity = (index) => {
    if (index !== 0) {
      setActivity((prevActivity) => {
        const updatedActivity = [...prevActivity]
        updatedActivity.splice(index, 1)
        return updatedActivity
      })

      setTaskValues((prevTaskValues) => {
        const updatedTaskValues = [...prevTaskValues]
        updatedTaskValues.splice(index, 1)
        return updatedTaskValues
      })
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors }
        updatedErrors.activity.splice(index, 1)
        return updatedErrors
      })
    }
    setShowAddButton((prevShowAddButton) => {
      const newShowAddButton = [...prevShowAddButton] // Make a copy of the original array
      newShowAddButton[index - 1] = true // Set the last index to true
      return newShowAddButton
    })
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
            Edit Task Activity
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
                    Edit Task Activity
                  </span>
                ),
              },
            ]}
          />

          <CCol xs={12} className="" style={{ marginLeft: '22px', width: '100%' }}>
            <CForm
              className="mt-4  needs-validation"
              ref={formRef}
              validated={validated}
              onSubmit={handleSubmit}
            >
              <div className="activity_overflow">
                <CRow gutter={16}>
                  <CCol sm={3} span={6}>
                    <div className="label-field-container">
                      <CFormLabel className="form-label text-c" htmlFor="validationCustom01">
                        GroupName{' '}
                        <span className="red-text1" style={{ marginLeft: '5px' }}>
                          *
                        </span>
                      </CFormLabel>
                      <Input
                        style={{ width: '95%' }}
                        variant={'borderless'}
                        maxLength={48}
                        className="border-0 time-border-bottom"
                        placeholder="Enter Task"
                        value={task}
                        onChange={onInputChange}
                      ></Input>
                    </div>
                    <span className="text-danger nameflow-error">{errors.task}</span>{' '}
                    {/* Display task error */}
                  </CCol>
                  {activity.map((flow, index) => (
                    <React.Fragment key={index}>
                      <CCol sm={2}>
                        <div className="label-field-container">
                          <CFormLabel className="form-label text-c" htmlFor="validationCustom01">
                            Activity{' '}
                            <span className="red-text1" style={{ marginLeft: '5px' }}>
                              *
                            </span>
                          </CFormLabel>

                          <Input
                            variant={'borderless'}
                            className="border-0 time-border-bottom"
                            type="text"
                            maxLength={48}
                            id={`validationCustom${index + 1}`}
                            placeholder="Enter Activity"
                            value={taskValues[index]}
                            onChange={(event) => {
                              // const selectedValue = event ? event.target.value : ''
                              // const re = /^[A-Za-z\s]*$/ // Allow alphabetical characters and whitespace

                              // if (re.test(selectedValue)) {
                              //   const updatedValues = [...taskValues]
                              //   updatedValues[index] = selectedValue
                              //   setTaskValues(updatedValues)
                              // }
                              const selectedValue = event ? event.target.value : ''
                              const regex = /^(?!^\s)[A-Za-z\s\-&/]*[A-Za-z][A-Za-z\s\-&/]*$/ // Regex to allow alphabets, hyphen, and space

                              if (regex.test(selectedValue) || selectedValue === '') {
                                const updatedValues = [...taskValues]
                                updatedValues[index] = selectedValue
                                setTaskValues(updatedValues)
                              }
                            }}
                          />
                        </div>
                        <span className="text-danger nameflow-error">{errors.activity[index]}</span>{' '}
                        {/* Display activity error */}
                      </CCol>
                      <CCol sm={1} className="my-4">
                        <div className="label-field-container">
                          {index !== 0 ? (
                            <div style={{ display: 'flex', width: '20px' }}>
                              {' '}
                              {showAddButton[index] === false ? (
                                <>
                                  <button
                                    className="text-decoration-none border-0  d-flex delete_svg"
                                    type="button"
                                    onClick={() => removeActivity(index)}
                                  >
                                    <DeleteSvg
                                      width="12"
                                      height="15"
                                      viewBox="0 0 18 18"
                                      fill="#A5A1A1"
                                    />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="text-decoration-none border-0  d-flex plus_svg"
                                    type="button"
                                    onClick={() => addActivity(index)}
                                  >
                                    {' '}
                                    <PlusSvg
                                      width="8"
                                      height="12"
                                      viewBox="0 0 18 18"
                                      fill="#A5A1A1"
                                    />
                                  </button>
                                  <button
                                    className="text-decoration-none border-0  d-flex delete_svg"
                                    type="button"
                                    onClick={() => removeActivity(index)}
                                  >
                                    <DeleteSvg
                                      width="12"
                                      height="15"
                                      viewBox="0 0 18 18"
                                      fill="#A5A1A1"
                                    />
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            <>
                              {showAddButton[0] ? (
                                <button
                                  className="text-decoration-none border-0  d-flex plus_svg"
                                  type="button"
                                  onClick={() => addActivity(index)}
                                >
                                  {' '}
                                  <PlusSvg
                                    width="8"
                                    height="12"
                                    viewBox="0 0 18 18"
                                    fill="#A5A1A1"
                                  />
                                </button>
                              ) : (
                                ''
                              )}
                            </>
                          )}
                        </div>
                      </CCol>
                    </React.Fragment>
                  ))}
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
                      className=" Edit_save_changes"
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

EditTaskActivity.propTypes = {
  close: PropTypes.func,
  viewTask: PropTypes.object,
}
export default EditTaskActivity
