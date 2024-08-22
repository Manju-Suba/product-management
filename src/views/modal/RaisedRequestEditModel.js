import React, { useState, useEffect, useRef } from 'react'
import { getHeaders, getDecodeData, hour, minute } from 'src/constant/Global'
import { CCol, CRow, CForm, CFormLabel, CButton } from '@coreui/react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Breadcrumb, Select, TimePicker, Input, DatePicker, Skeleton } from 'antd'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import BackArrowSvg from '../svgImages/BackArrowSvg'
import useAxios from 'src/constant/UseAxios'
import Calendarimg from '../../assets/images/calendar-image.png'
import updateLocale from 'dayjs/plugin/updateLocale'
import { useDispatch, useSelector } from 'react-redux'
import { getExistsDates, getYesterdayCount } from 'src/redux/timesheet/action'
const { TextArea } = Input

dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
    weekStart: 1,
})

const RaisedRequestEditModel = ({ isOpen, closeModal, viewActivity }) => {
    let api = useAxios()
    const dispatch = useDispatch()
    const [reason, setReason] = useState(viewActivity.reason)
    const [date, setDate] = useState(viewActivity.requestDate)
    const formRef = useRef(null)
    const user = getDecodeData()
    const joiningDate = user?.jod
    const [dateWise, setDateWise] = useState(viewActivity.requestDate)
    const [validated, setValidated] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [formErrors, setFormErrors] = useState({
        date: '',
        reason: ''
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

    }, [viewActivity])

    const renderDateCell = (current) => {
        const month = parseInt(monthRef.current)
        const year = parseInt(yearRef.current)
        console.log(month)

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

        const chosenDate = dayjs(date)
        // const raisedApprovedDates = existDate.ApprovedRequestList || []
        // const isChosenDate = current.isSame(chosenDate, 'day')

        const raisedDates = existDate.RaisedRequestList || []
        const attendanceDates = existDate.AttendanceList || []
        const submittedDate = existDate.SubmittedList || []
        const PermissionDate = existDate.Permission || []
        const pendingRequestDate = existDate.PendingRequestList || []

        const isTodayOrAfter = current.isAfter(dayjs(), 'day')
        const isRaised = raisedDates.includes(current.format('YYYY-MM-DD'))
        const isAttendance = attendanceDates.includes(current.format('YYYY-MM-DD'))
        const isSubmitted = submittedDate.includes(current.format('YYYY-MM-DD'))
        const isPermission = PermissionDate.includes(current.format('YYYY-MM-DD'))
        const isPending = pendingRequestDate.includes(current.format('YYYY-MM-DD'))

        const raisedApprovedDates = existDate.ApprovedRequestList || []
        const isChosenDate = current.isSame(chosenDate, 'day')
        const isRaisedApproved = raisedApprovedDates.includes(current.format('YYYY-MM-DD'))

        const isDisabled = isRaisedApproved || isPending || isAttendance || isSubmitted || isTodayOrAfter || isPermission

        let fontWeights
        let colorText
        if (isChosenDate) {
            fontWeights = 'bold'
        } else if (isRaisedApproved) {
            fontWeights = 'bold'
        } else {
            fontWeights = 'normal'
        }

        if (isDisabled) {
            colorText = 'gray'
        } else if (isChosenDate) {
            colorText = 'white'
        } else if (isPermission) {
            colorText = 'black'
        } else {
            colorText = '#ffaa00'
        }

        const color = colorText
        const fontWeight = fontWeights
        const backgroundColor = isChosenDate ? '#e40e2d' : 'transparent'
        const borderRadius = isChosenDate ? '50%' : '0%'
        const minWidth = isChosenDate ? '24px' : 'auto'
        const height = isChosenDate ? '24px' : 'auto'
        const display = isChosenDate ? 'inline-block' : 'initial'
        const lineHeight = isChosenDate ? '24px' : 'initial'

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
        const chosenDate = dayjs(viewActivity.requestDate) // Currently chosen date

        if (!existDate) {
            return false
        }

        const raisedDates = existDate.RaisedRequestList || []
        const attendanceDates = existDate.AttendanceList || []
        const submittedDate = existDate.SubmittedList || []
        const PermissionDate = existDate.Permission || []
        const pendingRequestDate = existDate.PendingRequestList || []

        const isTodayOrAfter = current.isAfter(dayjs(), 'day')
        const isRaised = raisedDates.includes(current.format('YYYY-MM-DD'))
        const isAttendance = attendanceDates.includes(current.format('YYYY-MM-DD'))
        const isSubmitted = submittedDate.includes(current.format('YYYY-MM-DD'))
        const isPermission = PermissionDate.includes(current.format('YYYY-MM-DD'))
        const isPending = pendingRequestDate.includes(current.format('YYYY-MM-DD'))
        // const isSelected = current.isSame(dateWise, 'day')

        const raisedApprovedDates = existDate.ApprovedRequestList || []
        const isChosenDate = current.isSame(chosenDate, 'day')
        const isRaisedApproved = raisedApprovedDates.includes(current.format('YYYY-MM-DD'))

         // Disable the date based on existing conditions
        const isDisabled = isRaisedApproved || isPending || isAttendance || isSubmitted || isTodayOrAfter || isPermission
        return isDisabled

        // return !(isChosenDate || isRaisedApproved)
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
        const errors = {
            date: '',
            reason: ''
        }

        // Validate the requested date
        if (!viewActivity.requestDate || dayjs(viewActivity.requestDate).isAfter(dayjs())) {
            errors.date = 'Please select a valid date.'
        }

        // Validate the reason
        if (!viewActivity.reason || viewActivity.reason.trim() === '') {
            errors.reason = 'Please enter a reason.'
        }

        setFormErrors(errors)

        // Check if there are any errors
        const hasErrors = errors.date !== '' || errors.reason !== ''
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
    }, [dispatch, dateWise])


    const handleSubmit = async (event) => {
        event.preventDefault()
        const isFormValid = validateForm()
        if (!isFormValid) {
            setValidated(true)
            return
        }
        setButtonDisabled(true)

         // Extract and format the date as a LocalDate (yyyy-MM-dd)
        const formattedDate = dayjs(date).format('YYYY-MM-DD')
        
        const url = `activity/raisedRequest/update/${viewActivity.id}`
        const payload = {
            date: formattedDate,  // Passing the formatted date
            reason: reason,
        }

        try {
            const response = await api.put(url, null, {
                params: payload,  // Send date and reason as query parameters
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

    const handleDateChange = (event) => {
        const selectedDate = event
        setDate(selectedDate)
    }

    const handleTextAreaChange = (e) => {
        const value = e.target.value
        setReason(value)
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
                        Edit Rejected Raised Request
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
                                        Raised Request
                                    </span>
                                ),
                            },
                            {
                                title: (
                                    <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                                        Edit Rejected Raised Request
                                    </span>
                                ),
                            },
                        ]}
                    />
                </CCol>
                <CCol xs={2} sm={2} className="draft-sumbit-button ">
                    <CRow>
                        <CCol className="draft-rightside-header draft-rs-datepicker submit_datepicker">

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
                        <CRow className="mb-3">
                            <CCol sm={2}>
                                <div className="label-field-container">
                                    <CFormLabel className="form-label text-c" >
                                        Requested Date <span className="red-text1">*</span>
                                    </CFormLabel>
                                    <DatePicker
                                        variant={'borderless'}
                                        id="date"
                                        type="date"
                                        name="fieldName"
                                        placeholder="Choose Date"
                                        className="input-lg date-picker raised_selectbox"
                                        onChange={(date, dateString) => handleDateChange(date)}
                                        format="DD MMM, YYYY"
                                        defaultValue={dayjs(date)}
                                        suffixIcon={
                                            <img
                                                src={Calendarimg}
                                                alt="Calendarimg"
                                                style={{ width: '13px', height: '13px' }}
                                            />
                                        }
                                        onPanelChange={handlePanelChange}
                                        max={dayjs()}
                                        allowClear={false}
                                        min={joiningDate}
                                        cellRender={renderDateCell}
                                        disabledDate={disabledDate}
                                        style={{ height: '32px', color: 'black'}}
                                    />
                                </div>
                                <span className="text-danger nameflow-error ">{formErrors.date}</span>
                            </CCol>
                            <CCol sm={5}>
                                <div className="label-field-container">
                                    <CFormLabel className="form-label text-c" >
                                        Reason <span className="red-text1">*</span>
                                    </CFormLabel>
                                    <TextArea
                                        id='reason'
                                        variant={'borderless'}
                                        // defaultValue={viewActivity.reason}
                                        onChange={handleTextAreaChange}
                                        value={reason}
                                        className="des-boder-input"
                                        style={{ color: 'black', padding: '0px ' }}
                                        placeholder="Enter Reason..."
                                        autoSize={{ minRows: 0, maxRows: 2 }}
                                    />
                                </div>
                                <span className="text-danger nameflow-error ">
                                    {formErrors.reason}
                                </span>
                            </CCol>
                        </CRow>

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

RaisedRequestEditModel.propTypes = {
    isOpen: PropTypes.bool,
    closeModal: PropTypes.func,
    viewActivity: PropTypes.array,
}
export default RaisedRequestEditModel
