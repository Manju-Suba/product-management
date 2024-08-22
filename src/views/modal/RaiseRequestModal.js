import React, { useState, useEffect, useRef } from 'react'
import { getDecodeData, getHeaders } from 'src/constant/Global'
import PropTypes from 'prop-types'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
import { Modal, Form, Input, Row, Col, Button, DatePicker, Skeleton } from 'antd'
import dayjs from 'dayjs'
import useAxios from 'src/constant/UseAxios'

const { TextArea } = Input

const RaiseRequestModal = ({ isOpen, closeModal, dateWise }) => {
  let api = useAxios()
  const user = getDecodeData()
  const joiningDate = user?.jod
  const [textareaValue, setTextareaValue] = useState('')
  const [formErrors, setFormErrors] = useState({
    dates: '',
    reason: '',
  })
  const [selectedDates, setSelectedDates] = useState(dayjs(dateWise))
  const [loadings, setLoadings] = useState(false)
  const disabledDatesRef = useRef([])
  const [loading, setLoading] = useState(true)
  const monthRef = useRef(null)
  const yearRef = useRef(null)

  const modalClose = () => {
    setTextareaValue('')
    closeModal()
  }
  const validateForm = () => {
    const errors = {
      dates: '',
      reason: '',
    }
    if (!textareaValue.trim()) {
      errors.reason = 'Please Enter Reason to Raise'
    }
    if (!selectedDates) {
      errors.dates = 'Please Select Date'
    }

    setFormErrors(errors)

    const hasErrors = errors.reason !== '' || errors.dates !== ''

    return !hasErrors
  }
  useEffect(() => {
    const currentMonthYear = dayjs(dateWise).format('YYYY-MM')
    monthRef.current = dayjs(dateWise).format('M')
    yearRef.current = dayjs(dateWise).format('YYYY')
    getExistsDates(currentMonthYear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getExistsDates = async (currentMonthYear) => {
    const year = dayjs(currentMonthYear).format('YYYY')
    const month = dayjs(currentMonthYear).format('MM')
    const url = `activity/timeSheet/status?month=${month}&year=${year}`
    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
      })
      const data = response.data.data
      if (data) {
        disabledDatesRef.current = data
      }
      setLoading(false)
    } catch (error) {
      const errors = error.response
      setLoading(false)
      if (errors.status === 422) {
        toast.error(errors.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
      }
    }
  }

  const disabledDate = (current) => {
    const existDate = disabledDatesRef.current
    if (!existDate) {
      return false // Or handle it according to your use case
    }

    const raisedDates = existDate.RaisedRequestList || []
    const attendanceDates = existDate.AttendanceList || []
    const submittedDates = existDate.SubmittedList || []
    const PermissionDates = existDate.Permission || []

    const isRaised = raisedDates.includes(dayjs(current).format('YYYY-MM-DD'))
    const isAttendance = attendanceDates.includes(dayjs(current).format('YYYY-MM-DD'))
    const isSubmitted = submittedDates.includes(dayjs(current).format('YYYY-MM-DD'))
    const isPermission = PermissionDates.includes(dayjs(current).format('YYYY-MM-DD'))
    const currentDate = dayjs() // Current date
    const isTodayOrAfter =
      current && (current.isSame(currentDate, 'day') || current.isAfter(currentDate, 'day'))
    const isJoiningDateOrBefore = current?.isBefore(joiningDate, 'day')
    const isDisabled =
      isPermission ||
      isRaised ||
      isAttendance ||
      isSubmitted ||
      isTodayOrAfter ||
      isJoiningDateOrBefore

    return isDisabled
  }

  const handleTextareaChange = (value) => {
    const regex = /^[^\s][\s\S]*$/
    if (regex.test(value) || value === '') {
      setTextareaValue(value)
    }
  }

  const changeDateFormat = (date) => {
    const parsedDate = dayjs(date, 'DD MMM, YYYY')
    const formattedDate = parsedDate.format('YYYY-MM-DD')
    return formattedDate
  }

  const handleRaiseRequest = async () => {
    const isFormValid = validateForm()
    if (isFormValid) {
      setLoadings(true)
      let requestDate
      const date = selectedDates
      if (date !== changeDateFormat(dateWise)) {
        requestDate = dayjs(date).format('YYYY-MM-DD')
      } else {
        requestDate = date
      }
      const url = `activity/request`
      const postData = {
        reason: textareaValue,
        requestDate: requestDate,
      }
      try {
        const response = await api.post(url, postData, {
          headers: getHeaders('json'),
        })
        setLoadings(false)
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
        modalClose()
      } catch (error) {
        const errors = error.response
        setLoadings(false)
        if (errors.status === 422) {
          toast.error(errors.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
        } else {
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
        }
      }
    }
  }

  const onChange = (date, dateString) => {
    setSelectedDates(dateString)
  }
  const handlePanelChange = async (value, mode) => {
    if (mode === 'date') {
      setLoading(true)
      const currentMonthYear = dayjs(value).format('YYYY-MM')
      monthRef.current = dayjs(value).format('M')
      yearRef.current = dayjs(dateWise).format('YYYY')
      await getExistsDates(currentMonthYear)
    }
  }
  const renderDateCell = (current) => {
    const month = parseInt(monthRef.current)
    const year = parseInt(yearRef.current)
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
    const existDate = disabledDatesRef.current
    if (!existDate) {
      return null // Or handle it according to your use case
    }

    const raisedDates = existDate.RaisedRequestList || []
    const attendanceDates = existDate.AttendanceList || []
    const submittedDates = existDate.SubmittedList || []
    const permissionDates = existDate.Permission || []

    const isRaised = raisedDates.includes(current.format('YYYY-MM-DD'))
    const isAttendance = attendanceDates.includes(current.format('YYYY-MM-DD'))
    const isSubmitted = submittedDates.includes(current.format('YYYY-MM-DD'))
    const isPermission = permissionDates.includes(current.format('YYYY-MM-DD'))
    const isSelected = current.isSame(selectedDates, 'day')
    const currentDate = dayjs() // Current date
    const isTodayOrAfter =
      current?.isSame(currentDate, 'day') ?? current?.isBefore(joiningDate, 'day')
    const isJoiningDateOrBefore = current?.isBefore(joiningDate, 'day')

    // Check if the current date is included in any of the arrays
    const isDisabled =
      isRaised || isAttendance || isSubmitted || isTodayOrAfter || isJoiningDateOrBefore
    let textColor
    if (isDisabled || isPermission || isTodayOrAfter) {
      textColor = 'gray'
    } else if (isSelected) {
      textColor = 'white'
    } else {
      textColor = '#ffaa00'
    }
    let fontWeights
    if (isDisabled) {
      fontWeights = 'normal'
    } else if (isSelected) {
      fontWeights = 'bold'
    } else {
      fontWeights = 'normal'
    }
    const color = textColor
    const fontWeight = fontWeights
    const backgroundColor = isSelected ? '#e40e2d' : 'transparent'
    const borderRadius = isSelected ? '50%' : '0%'
    const minWidth = isSelected ? '24px' : 'auto'
    const height = isSelected ? '24px' : 'auto'
    const display = isSelected ? 'inline-block' : 'initial'
    const lineHeight = isSelected ? '24px' : 'initial'
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

  return (
    <Modal
      open={isOpen}
      onCancel={modalClose}
      footer={null}
      top
      className={`right ${isOpen ? 'modal-visible' : 'modal-hidden'}`}
    >
      <h4>Raise Request</h4>
      <Form
        onFinish={handleRaiseRequest}
        validateTrigger="onSubmit"
        requiredMark={true}
        style={{ marginTop: '20px' }}
      >
        <Row gutter={16}>
          <Col span={12} sm={7}>
            <DatePicker
              variant={'borderless'}
              style={{
                height: '31px',
                fontSize: '12px',
                paddingLeft: '8px',
                border: 'none',
                borderBottom: '1px solid #f1f1f1',
                borderRadius: '0',
                width: '100%',
              }}
              onPanelChange={handlePanelChange}
              active
              onChange={onChange}
              className="multi-dates"
              allowClear={false}
              disabledDate={disabledDate}
              cellRender={renderDateCell}
              defaultValue={selectedDates}
              size="small"
            />

            <span className="text-danger nameflow-error ">{formErrors.dates}</span>
          </Col>
          <Col span={16}>
            <TextArea
              id="Description"
              variant={'borderless'}
              value={textareaValue}
              onChange={(e) => handleTextareaChange(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1px solid #f1f1f1',
                borderRadius: '0',
                paddingLeft: '0px',
              }}
              placeholder="Enter Reason..."
              autoSize={{
                minRows: 0,
                maxRows: 1,
              }}
            />
            <span className="text-danger nameflow-error ">{formErrors.reason}</span>
          </Col>
        </Row>

        <Row justify="end" style={{ marginTop: '1rem' }}>
          <Col>
            <Button
              className="sub-cancel-btn"
              onClick={modalClose}
              style={{ marginRight: '1rem', marginTop: '1px' }}
            >
              Cancel
            </Button>
          </Col>
          <Col>
            <Button
              className="raise-button raise-timesheet"
              style={{ fontSize: '13px' }}
              type="primary"
              htmlType="submit"
              loading={loadings}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

RaiseRequestModal.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
  dateWise: PropTypes.string,
}
export default RaiseRequestModal
