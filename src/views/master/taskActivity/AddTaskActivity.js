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

const AddTaskActivity = ({ close }) => {
  let api = useAxios()
  const [validated, setValidated] = useState(false)
  const [task, setTask] = useState('')
  const [activity, setActivity] = useState([{}])
  const [taskValues, setTaskValues] = useState([''])
  const formRef = useRef(null)
  const [errors, setErrors] = useState({ task: '', activity: [] })
  const [loadings, setLoadings] = useState(false)
  const [showAddButton, setShowAddButton] = useState([true])
  const [showAddButtonpre, setShowAddButtonpre] = useState([true])

  useEffect(() => {
    const newShowAddButton = Array.from({ length: taskValues.length }, () => true)
    setShowAddButtonpre(newShowAddButton)
  }, [taskValues])

  const onInputChange = (e) => {
    const { value } = e.target
    const regex = /^(?!^\s)[A-Za-z\s\-&/]*[A-Za-z][A-Za-z\s\-&/]*$/

    if (regex.test(value) || value === '') {
      setTask(value)
    }
  }
  useEffect(() => {}, [])
  //    useEffect(() => {
  //      window.addEventListener('keydown', handleKeyDown)
  //      return () => {
  //        window.removeEventListener('keydown', handleKeyDown)
  //      }
  //    }, [])
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
  //   const handleKeyDown = (event) => {
  //     if (event.key === 'r') {
  //       event.preventDefault()
  //       addActivity()
  //     }
  //   }
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

        const url = 'master/taskcategory/create'
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
          <h6 className="Add_draft-heading" style={{ marginTop: '29px' }}>
            Add Task Activity
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
                    Task Activity Master
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Add Task Activity
                  </span>
                ),
              },
            ]}
          />
          {/* </CCol>
      </CRow>

      <CRow> */}
          <CCol xs={8} className="" style={{ width: '100%' }}>
            <CForm
              className="mt-4  needs-validation"
              ref={formRef}
              validated={validated}
              onSubmit={handleSubmit}
            >
              <div className="activity_overflow">
                <CRow>
                  <CCol sm={3}>
                    <div className="label-field-container">
                      <CFormLabel className="form-label text-c" htmlFor="validationCustom01">
                        Group Name{' '}
                        <span className="red-text1" style={{ marginLeft: '5px' }}>
                          *
                        </span>
                      </CFormLabel>
                      <Input
                        style={{ marginTop: '10px', width: '90%' }}
                        variant={'borderless'}
                        maxLength={48}
                        className="border-0 time-border-bottom  "
                        placeholder="Enter Task"
                        value={task}
                        onChange={onInputChange}
                      ></Input>
                    </div>
                    <span className="text-danger nameflow-error">{errors.task}</span>{' '}
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
                            style={{ marginTop: '10px' }}
                            variant={'borderless'}
                            className="border-0 time-border-bottom  "
                            type="text"
                            maxLength={48}
                            id={`validationCustom${index + 1}`}
                            placeholder="Enter Activity"
                            value={taskValues[index]}
                            onChange={(event) => {
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
                      </CCol>
                      <CCol sm={1} className="my-4">
                        <div className="label-field-container">
                          {index !== 0 ? (
                            <div
                              style={{
                                display: 'flex',
                                width: '60px',
                                justifyContent: 'space-around',
                              }}
                            >
                              {' '}
                              {showAddButton[index] === false ? (
                                <>
                                  <button
                                    style={{ marginRight: '40px' }}
                                    className="text-decoration-none border-0  delete_svg"
                                    type="button"
                                    // className="text-decoration-none add-row float-end"
                                    onClick={() => removeActivity(index)}
                                  >
                                    <DeleteSvg
                                      width="15"
                                      height="15"
                                      viewBox="0 0 18 18"
                                      fill="#A5A1A1"
                                    />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="text-decoration-none border-0 plus_svg"
                                    onClick={() => addActivity(index)}
                                    type="button"
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
                                    className="text-decoration-none border-0  delete_svg"
                                    type="button"
                                    // className="text-decoration-none add-row float-end"
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
                                  className="text-decoration-none border-0 plus_svg"
                                  onClick={() => addActivity(index)}
                                  type="button"
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

AddTaskActivity.propTypes = {
  close: PropTypes.func,
}
export default AddTaskActivity
