import React, { useState, useEffect, useRef } from 'react'
import { getHeaders, getDecodeData, hour, minute } from 'src/constant/Global'
import { CCol, CRow, CForm, CFormLabel, CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Breadcrumb, Select, TimePicker, Input, DatePicker, Skeleton } from 'antd'
import { Link } from 'react-router-dom'
import { CaretDownOutlined, PlusOutlined } from '@ant-design/icons'
import DeleteSvg from '../svgImages/DeleteSvg'
import dayjs from 'dayjs'
import BackArrowSvg from '../svgImages/BackArrowSvg'
import useAxios from 'src/constant/UseAxios'
import Calendarimg from '../../assets/images/calendar-image.png'
import updateLocale from 'dayjs/plugin/updateLocale'
import { useDispatch, useSelector } from 'react-redux'
import { getExistsDates, getYesterdayCount } from 'src/redux/timesheet/action'

dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  weekStart: 1,
})

const { TextArea } = Input
const EditActivityModal = ({ isOpen, closeModal, viewActivity, taskList, productList, today }) => {
  let api = useAxios()
  const dispatch = useDispatch()
  const [description, setDescription] = useState(viewActivity.description)
  const [taskOptions, setTaskOptions] = useState([])
  const [product, setProduct] = useState(viewActivity.productId)
  const [task, setTask] = useState(viewActivity.taskName)
  const [hours, setHours] = useState()
  const formRef = useRef(null)
  const [fields, setFields] = useState([
    { product: product, task: task, hours: hours, description: description },
  ])
  const user = getDecodeData()
  const joiningDate = user?.jod
  const [dateWise, setDateWise] = useState(dayjs())
  const [validated, setValidated] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [formErrors, setFormErrors] = useState({
    product: '',
    tasks: '', // Change from array to object
    hrs: '',
    description: '',
  })
  const [loading, setLoading] = useState(true)
  const monthRef = useRef(null)
  const yearRef = useRef(null)
  const existingDates = useSelector((state) => state.timesheet.existingDates)

  useEffect(() => {
    const currentMonthYear = dayjs(dateWise).format('YYYY-MM')
    monthRef.current = dayjs(dateWise).format('M')
    yearRef.current = dayjs(dateWise).format('YYYY')
    dispatch(getExistsDates(currentMonthYear))
    setLoading(false)

    const hoursValue = viewActivity.hours
    const [hours1, minutes] = hoursValue.split(':').map(Number)
    const dateTime = dayjs().set('hour', hours1).set('minute', minutes)
    setHours(dateTime)
    setFields([{ product: product, task: task, hours: dateTime, description: description }])

    const newTaskOptions = new Set(taskOptions.map((option) => option.value))
    if (!newTaskOptions.has(viewActivity.taskName)) {
      newTaskOptions.add(viewActivity.taskName)
    }

    taskList.forEach((task) => {
      if (!newTaskOptions.has(task)) {
        newTaskOptions.add(task)
      }
    })

    const uniqueTaskOptions = Array.from(newTaskOptions).map((task) => ({
      value: task,
      label: task,
    }))
    setTaskOptions(uniqueTaskOptions)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewActivity])

  const renderDateCell = (current) => {
    const month = parseInt(monthRef.current)
    const year = parseInt(yearRef.current)
    const chosenDate = dayjs(viewActivity.activity_date) // Currently chosen date

    if (loading) {
      return (
        <div style={{ textAlign: 'center' }}>
          {Array.from({ length: 1 }, (_, index) => (
            <Skeleton
              key={index}
              title={false}
              paragraph={{
                rows: 1,
                width: '100%',
                height: '10px',
                style: { height: '10px !important' },
              }}
            />
          ))}
        </div>
      )
    }

    const existDate = existingDates
    if (!existDate) {
      return null // Or handle it according to your use case
    }

    const raisedApprovedDates = existDate.ApprovedRequestList || []
    const isChosenDate = current.isSame(chosenDate, 'day')
    const isRaisedApproved = raisedApprovedDates.includes(current.format('YYYY-MM-DD'))

    let fontWeights
    let colorText
    const backgroundColor = isChosenDate ? '#e40e2d' : 'transparent'
    const borderRadius = isChosenDate ? '50%' : '0%'
    const minWidth = isChosenDate ? '24px' : 'auto'
    const height = isChosenDate ? '24px' : 'auto'
    const display = isChosenDate ? 'inline-block' : 'initial'
    const lineHeight = isChosenDate ? '24px' : 'initial'

    if (isChosenDate) {
      fontWeights = 'bold'
      colorText = 'white'
    } else if (isRaisedApproved) {
      fontWeights = 'normal'
      colorText = 'black'
    } else {
      fontWeights = 'normal'
      colorText = 'gray'
    }

    const color = colorText
    const fontWeight = fontWeights

    if (current.month() + 1 === month && current.year() === year) {
      return (
        <div
          style={{
            color,
            fontWeight,
            backgroundColor,
            borderRadius,
            minWidth,
            height,
            display,
            lineHeight,
          }}
        >
          {current.date()}
        </div>
      )
    } else {
      return <div>{current.date()}</div>
    }
  }

  const disabledDate = (current) => {
    const existDate = existingDates
    const chosenDate = dayjs(viewActivity.activity_date) // Currently chosen date

    if (!existDate) {
      return false
    }

    const raisedApprovedDates = existDate.ApprovedRequestList || []
    const isChosenDate = current.isSame(chosenDate, 'day')
    const isRaisedApproved = raisedApprovedDates.includes(current.format('YYYY-MM-DD'))

    return !(isChosenDate || isRaisedApproved)
  }

  const handlePanelChange = async (value, mode) => {
    if (mode === 'date') {
      setLoading(true)

      const currentMonthYear = dayjs(value).format('YYYY-MM')
      monthRef.current = dayjs(value).format('M')
      yearRef.current = dayjs(value).format('YYYY')

      try {
        await dispatch(getExistsDates(currentMonthYear))
      } catch (error) {
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }
  }

  const resetModal = () => {
    closeModal()
  }
  const validateForm = () => {
    const errors = fields.map((field) => ({
      product: '',
      tasks: '',
      hrs: '',
      description: '',
    }))
    // const errors = {
    //   product: '',
    //   tasks: '', // Change from array to object
    //   hrs: '',
    //   description: '',
    // }
    // if (product === 0 || product === undefined) {
    //   errors.product = 'Please Select Product Name'
    // }
    // if (task === undefined) {
    //   errors.tasks = 'Please Select Task Name'
    // }
    // if (hours === null) {
    //   errors.hrs = 'Please Enter Hours'
    // }
    // if (description === '') {
    //   errors.description = 'Please Enter Description'
    // }

    fields.forEach((field, index) => {
      if (!field.product) {
        errors[index].product = 'Please Select Product Name'
      }
      if (!field.task) {
        errors[index].tasks = 'Please Select Task Name'
      }
      if (!field.hours) {
        errors[index].hrs = 'Please Enter Hours'
      }
      if (!field.description) {
        errors[index].description = 'Please Enter Description'
      }
    })

    setFormErrors(errors)

    // Check for any errors in the validation
    // const hasErrors =
    //   errors.tasks !== '' || errors.product !== '' || errors.hrs !== '' || errors.description !== ''
    const hasErrors = errors.some(
      (error) =>
        error.product !== '' || error.tasks !== '' || error.hrs !== '' || error.description !== '',
    )
    return !hasErrors
  }

  useEffect(() => {
    const checkTimeAndExecuteTasks = () => {
      const now = dayjs()
      if (now.hour() === hour && now.minute() === minute) {
        const currentMonthYear = now.format('YYYY-MM')
        dispatch(getExistsDates(currentMonthYear))
        dispatch(getYesterdayCount(dateWise))
      }
    }

    // Initial check in case the page is loaded exactly at 11:00 AM
    checkTimeAndExecuteTasks()

    // Schedule the checkTimeAndExecuteTasks function to run every minute
    const intervalId = setInterval(checkTimeAndExecuteTasks, 60000)

    return () => {
      clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, hour, minute, dateWise])

  //Product List
  const options = productList
    .map((product) => ({
      value: product.id,
      label: product.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const isFormValid = validateForm()
    if (isFormValid) {
      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
        setValidated(true)
      } else {
        setButtonDisabled(true)

        // const activities = fields.map(field => ({
        const activities = fields.map((field, index) => ({
          id: index === 0 ? viewActivity.id : 0,
          product: field.product,
          task: field.task,
          activity_date: viewActivity.activity_date,
          description: field.description,
          hours: dayjs(field.hours.$d).format('HH:mm'),
        }))

        const url = 'common/timesheet/activity/update/' + viewActivity.id

        try {
          const response = await api.put(url, activities, {
            headers: getHeaders('json'),
          })

          setButtonDisabled(false)
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
            resetModal()
          }
        } catch (error) {
          const errors = error.response.data
          setButtonDisabled(false)
          if (errors) {
            toast.error(errors.message, { position: toast.POSITION.BOTTOM_RIGHT })
          } else {
            toast.error(error.message, { position: toast.POSITION.BOTTOM_RIGHT })
          }
        }
      }
    }
  }

  const disabledHours = () => {
    const disabledHoursArray = []
    for (let i = 0; i < 24; i++) {
      if (i < 0 || i > 9) {
        disabledHoursArray.push(i)
      }
    }
    return disabledHoursArray
  }

  const disabledMinutes = (selectedHour) => {
    if (selectedHour === 9) {
      return [...Array(60).keys()].slice(1) // Disable all minutes when the hour is 16
    } else if (selectedHour === 0) {
      return [0] // Disable all minutes when the hour is 00
    } else {
      return []
    }
  }

  const handleAddRow = () => {
    setFields([...fields, { product: '', task: '', hours: '', description: '' }])
  }

  const handleRemoveRow = (index) => {
    const newFields = [...fields]
    newFields.splice(index, 1)
    setFields(newFields)
  }
  const handleFieldChange = (index, field, value) => {
    const newFields = [...fields]
    newFields[index][field] = value
    setFields(newFields)
  }

  return (
    <>
      <style>{`
        .tab_height_submit{
          height: auto !important;
          padding-bottom: 125px !important;
        } 
      `}</style>
      <CRow>
        <CCol sm={1} style={{ width: '20px' }} className="cancle-arrow-content">
          <span style={{ cursor: 'pointer', marginRight: '2px' }} onClick={closeModal}>
            <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
          </span>
        </CCol>
        <CCol xs={12} sm={8} md={9}>
          <h6 className="draft-heading-edit" style={{ marginTop: '29px' }}>
            Edit Rejected Activity - Time Sheet
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
                    className="bread-items text-decoration-none text-secondary first-subheading-edit"
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
                    Submitted - Time Sheet
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Edit Rejected Activity - Time Sheet
                  </span>
                ),
              },
            ]}
          />
        </CCol>
        <CCol xs={2} sm={2} className="draft-sumbit-button ">
          <CRow>
            <CCol className="draft-rightside-header draft-rs-datepicker submit_datepicker">
              <DatePicker
                variant={'borderless'}
                id="date"
                type="date"
                name="fieldName"
                placeholder="Choose Date"
                className="form-input-draft input-lg date-picker activity-date "
                // onChange={handleDateChange}
                format="DD MMM, YYYY"
                defaultValue={dayjs(viewActivity.activity_date)}
                suffixIcon={
                  <img
                    src={Calendarimg}
                    alt="Calendarimg"
                    style={{ width: '13px', height: '13px' }}
                  />
                }
                onPanelChange={handlePanelChange}
                max={today}
                allowClear={true}
                min={joiningDate}
                cellRender={renderDateCell}
                disabledDate={disabledDate}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <CRow className="mx-4">
        <div style={{ marginLeft: '13px' }}>
          <CForm
            className="mt-4 mx-2 needs-validation"
            ref={formRef}
            validated={validated}
            onSubmit={handleSubmit}
          >
            {fields.map((field, index) => (
              <CRow key={index} className="mb-3">
                <CCol sm={3}>
                  <div className="label-field-container">
                    <CFormLabel className="form-label text-c" htmlFor={`product-${index}`}>
                      Product <span className="red-text1">*</span>
                    </CFormLabel>
                    <Select
                      className="custom-select_submitted"
                      placeholder="Choose Product"
                      suffixIcon={<CaretDownOutlined className="caretdownicon" />}
                      id={`product-${index}`}
                      value={field.product}
                      onChange={(value) => handleFieldChange(index, 'product', value)}
                      showSearch
                      allowClear
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      dropdownRender={(menu) => (
                        <div style={{ maxHeight: '120px', overflow: 'auto' }} role="listbox">
                          {menu}
                        </div>
                      )}
                      options={options} // Replace with your options
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                  </div>
                  <span className="text-danger nameflow-error ">{formErrors[index]?.product}</span>
                </CCol>
                <CCol sm={3}>
                  <div className="label-field-container">
                    <CFormLabel className="form-label text-c" htmlFor={`task-${index}`}>
                      Task <span className="red-text1">*</span>
                    </CFormLabel>
                    <Select
                      className="custom-select_submitted"
                      suffixIcon={<CaretDownOutlined className="caretdownicon" />}
                      id={`task-${index}`}
                      value={field.task}
                      onChange={(value) => handleFieldChange(index, 'task', value)}
                      showSearch
                      allowClear
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      dropdownRender={(menu) => (
                        <div style={{ maxHeight: '120px', overflow: 'auto' }} role="listbox">
                          {menu}
                        </div>
                      )}
                      options={taskOptions} // Replace with your options
                      placeholder="Choose Task"
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    />
                  </div>
                  <span className="text-danger nameflow-error ">{formErrors[index]?.tasks}</span>
                </CCol>
                <CCol sm={2}>
                  <div className="label-field-container">
                    <CFormLabel className="form-label text-c" htmlFor={`hours-${index}`}>
                      Hours <span className="red-text1">*</span>
                    </CFormLabel>
                    <TimePicker
                      variant={'borderless'}
                      placeholder="HH:mm"
                      format="HH:mm"
                      className="border-0  time-border-bottom"
                      suffixIcon={<CaretDownOutlined className="caretdownicon" />}
                      value={field.hours || null}
                      style={{ width: '90%', marginTop: '9px' }}
                      showNow={false}
                      disabledHours={disabledHours}
                      disabledMinutes={disabledMinutes}
                      hideDisabledOptions
                      allowClear={false}
                      onChange={(value) => handleFieldChange(index, 'hours', value)}
                    />
                  </div>
                  <span className="text-danger nameflow-error ">{formErrors[index]?.hrs}</span>
                </CCol>
                <CCol sm={3}>
                  <div className="label-field-container">
                    <CFormLabel className="form-label text-c" htmlFor={`description-${index}`}>
                      Description <span className="red-text1">*</span>
                    </CFormLabel>
                    <TextArea
                      id={`description-${index}`}
                      variant={'borderless'}
                      value={field.description}
                      className="des-boder-input"
                      onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                      style={{ color: 'black', padding: '0px ' }}
                      placeholder="Enter Descriptions..."
                      autoSize={{ minRows: 0, maxRows: 2 }}
                    />
                  </div>
                  <span className="text-danger nameflow-error ">
                    {formErrors[index]?.description}
                  </span>
                </CCol>
                <CCol sm={1} className="d-flex align-items-end">
                  {index === 0 && (
                    <button
                      style={{ background: 'transparent' }}
                      type="button"
                      className="text-decoration-none border-0 addrow_button"
                      onClick={handleAddRow}
                    >
                      <PlusOutlined
                        className="plus_icon"
                        style={{ width: '10px', margin: '2px' }}
                      />
                      <span className="row_label"> Row</span>
                    </button>
                  )}
                  {index > 0 && (
                    <button
                      style={{ background: 'transparent' }}
                      type="button"
                      className="cross-button text-decoration-none border-0 addrow_button"
                      onClick={() => handleRemoveRow(index)}
                    >
                      <DeleteSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
                    </button>
                  )}

                  <span className="text-danger nameflow-error ">{formErrors.hrs}</span>
                </CCol>
              </CRow>
            ))}

            <div style={{ position: 'absolute', left: 0, right: 0 }}>
              <CRow className="m-3">
                <CCol sm={6}></CCol>
                <CCol sm={6} className="d-flex justify-content-end align-items-center">
                  <CButton className="cancel-btn text-c" onClick={closeModal}>
                    Cancel
                  </CButton>
                  <CButton
                    className="submit-button submit-timesheet "
                    style={{ fontSize: '13px', color: 'white' }}
                    type="submit"
                    disabled={buttonDisabled}
                  >
                    Update
                  </CButton>
                </CCol>
              </CRow>
            </div>
          </CForm>
        </div>
      </CRow>
    </>
  )
}

EditActivityModal.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  viewActivity: PropTypes.array,
  productList: PropTypes.array,
  taskList: PropTypes.array,
  statusApprove: PropTypes.string,
  today: PropTypes.string,
}
export default EditActivityModal
