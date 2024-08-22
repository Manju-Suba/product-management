import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
} from '@coreui/react'
import { getDecodeData, getSubPath } from 'src/constant/Global'
import PropTypes from 'prop-types'
import eventEmitter from 'src/constant/EventEmitter'
import RaiseRequestModal from '../modal/RaiseRequestModal'
import Calendarimg from '../../assets/images/calendar-image.png'
import FileSvg from '../svgImages/FileSvg'
import { Breadcrumb, Checkbox, Space, Select, DatePicker, TimePicker, Skeleton, Modal } from 'antd'
import { CaretDownOutlined, PlusOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import DeleteSvg from '../svgImages/DeleteSvg'
import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import { toast } from 'react-toastify'
import Downarrowimg from '../../assets/images/downarrow.png'
import { useDispatch, useSelector } from 'react-redux'
import {
  createAttendanceSheet,
  getExistsDates,
  getYesterdayCount,
  setPendingData,
  submitActivity,
} from 'src/redux/timesheet/action'
import { Link } from 'react-router-dom'

dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  weekStart: 1,
})

const Pending = ({ productList, today, taskList, loader, loadingActiveTask }) => {
  const dispatch = useDispatch()
  const yesterdayCount = useSelector((state) => state.timesheet && state.timesheet.yesterdayCount)
  const pendingData = useSelector((state) => state.timesheet && state.timesheet.pendingData)
  const user = getDecodeData()
  const joiningDate = user?.jod
  const [attendance, setAttendance] = useState('')
  const [raiseButton, setRaiseButton] = useState(false)
  const [visibleView, setVisibleView] = useState(false)
  const [disableContent, setDisableContent] = useState(false)
  const [dateWise, setDateWise] = useState(dayjs())
  const [raiseModal, setRaiseModal] = useState(false)
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false)
  const [isDraftButtonDisabled, setIsDraftButtonDisabled] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [headerLabel, setHeaderLabel] = useState('')
  const selectRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const monthRef = useRef(null)
  const yearRef = useRef(null)

  const handleDropdownVisibleChange = (visible) => {
    if (!visible && selectRef.current) {
      selectRef.current.blur()
    }
  }

  const [rows, setRows] = useState([
    {
      // activity_date: dateWise,
      isChecked: false,
      checkUser: '',
      product: '',
      task: '',
      hours: '',
      status: '',
      description: '',
    },
  ])
  const addRow = () => {
    setRows([
      ...rows,
      {
        // activity_date: dateWise,
        isChecked: false,
        checkUser: '',
        product: '',
        task: '',
        hours: '',
        status: '',
        description: '',
      },
    ])
  }

  const hasCheckedRow = rows.some((value) => value.isChecked)

  const existingDates = useSelector((state) => state.timesheet.existingDates)

  const closeModalView = () => {
    setVisibleView(false)
    setDisableContent(false)
    setAttendance('present')
  }

  const handleConfirm = (date, status) => {
    setDisableContent(true)
    handleAttendanceSheet(date, status)
  }

  const handleAttendanceSheet = async (date, status) => {
    dispatch(createAttendanceSheet(date, status))
      .then((response) => {
        const data = response.data.data
        handleApiResponse(response.status, data, date)
        setVisibleView(false)
      })
      .catch((error) => {})
  }

  const handleApiResponse = (status, data, date) => {
    if (status === 208) {
      handleStatus208(data)
    } else if (status === 201) {
      handleStatus201(data, date)
    }
  }

  const handleStatus208 = (data) => {
    toast.error('You applied for this date', { position: toast.POSITION.BOTTOM_RIGHT })
    setDisableContent(data.status === 'leave')
    setAttendance(data.status)
  }

  const handleStatus201 = (data, date) => {
    setAttendance(data.status)
    toast.success('Successfully applied leave', { position: toast.POSITION.BOTTOM_RIGHT })
    dispatch(getYesterdayCount(date))
    checkCondition(yesterdayCount, date)
  }

  const handleAttendance = (event) => {
    const selectedValue = event
    setAttendance(selectedValue)
    if (selectedValue === 'leave') {
      setVisibleView(true)
    } else if (selectedValue === 'present') {
      setDisableContent(false)
      // handleAttendanceSheet(dateWise, 'present')
    } else {
      setVisibleView(false)
    }
  }

  const handleDateChange = (event) => {
    const selectedDate = event
    if (selectedDate === today) {
      setDisableContent(false)
      setRaiseButton(false)
    }
    dispatch(getYesterdayCount(selectedDate))
    checkCondition(yesterdayCount, selectedDate)
    setDateWise(selectedDate)
  }

  const handleCheckboxChange = (index) => {
    const newRows = [...rows]
    const currentRow = newRows[index]

    const allFieldsFilled = areAllFieldsFilled(currentRow)

    currentRow.isChecked = allFieldsFilled ? !currentRow.isChecked : false
    setRows(newRows)

    let count = countCheckedItems(newRows)
    if (count >= 1) {
      if (count === rows.length && count === newRows.filter((row) => row.isChecked).length) {
        // All checkboxes are checked, update Select All checkbox
        setSelectAll(true)
        setHeaderLabel(`${count} rows selected`)
      } else {
        setSelectAll(false)
        setHeaderLabel(`${count} rows selected`)
      }
    } else {
      setSelectAll(false)
      setHeaderLabel('')
    }
  }

  const areAllFieldsFilled = (data) => {
    return (
      data.product !== 0 &&
      data.product !== '' &&
      data.task.trim() !== '' &&
      data.hours !== '' &&
      // data.status !== '' &&
      data.description.trim() !== ''
    )
  }

  // const handleInputChange = (index, fieldName, value) => {
  //   const newRows = [...rows]
  //   const currentRow = newRows[index]

  //   if (fieldName === 'hours') {
  //     currentRow.hours = value
  //   } else {
  //     currentRow[fieldName] = value
  //   }
  //   currentRow.isChecked = false
  //   const updatedRows = newRows.map((row, idx) => ({
  //     ...row,
  //     isChecked: false, // Update isChecked conditionally
  //   }))
  //   setSelectAll(false)
  //   setHeaderLabel('')
  //   setDisableContent(false)
  //   dispatch(setPendingData(updatedRows))
  //   setRows(updatedRows)
  // }

  const handleInputChange = (index, fieldName, value) => {
    // Create a new array with the existing rows
    const newRows = rows.map((row, idx) => {
      if (idx === index) {
        // Create a new object for the row being updated
        return {
          ...row,
          [fieldName]: value,
          isChecked: false,
        }
      }
      return {
        ...row,
        isChecked: false,
      }
    })
    const newRowDatas = rows.map((row, idx) => {
      if (idx === index) {
        let updatedValue = value

        // Check if fieldName is 'hours' and value is a Day.js object
        if (fieldName === 'hours') {
          if (dayjs.isDayjs(value)) {
            updatedValue = value.toISOString() // Convert Day.js object to ISO string
          } else if (value instanceof Date) {
            updatedValue = value.toISOString() // Convert Date object to ISO string
          }
        }

        return {
          ...row,
          [fieldName]: updatedValue,
          isChecked: false,
        }
      }

      return {
        ...row,
        isChecked: false,
      }
    })
    // Dispatch the action with the updated data
    setSelectAll(false)
    setHeaderLabel('')
    setDisableContent(false)
    dispatch(setPendingData(newRowDatas))
    setRows(newRows)
  }

  const deleteRow = (index) => {
    if (rows.length > 1) {
      const newRows = [...rows]
      newRows.splice(index, 1)
      setRows(newRows)
    } else {
      toast.error('Deleting last row  Restricted', { position: toast.POSITION.BOTTOM_RIGHT })
    }
  }

  const handleSubmit = async (e) => {
    setIsSubmitButtonDisabled(true)
    setIsDraftButtonDisabled(true)
    const remainingRows = rows.filter((value) => !value.isChecked)

    const formData = new FormData()
    let i = 0

    rows.forEach((value) => {
      if (value.isChecked) {
        formData.append(
          `commonTimeSheetActivities[${i}].activity_date`,
          dayjs(dateWise).format('YYYY-MM-DD'),
        )
        formData.append(`commonTimeSheetActivities[${i}].product`, value.product)
        formData.append(`commonTimeSheetActivities[${i}].task`, value.task)
        formData.append(
          `commonTimeSheetActivities[${i}].hours`,
          dayjs(value.hours.$d).format('HH:mm'),
        )
        // formData.append(`commonTimeSheetActivities[${i}].status`, value.status)
        formData.append(`commonTimeSheetActivities[${i}].description`, value.description)
        i++
      }
    })
    formData.append(`status`, 'Created')
    dispatch(submitActivity(formData))
      .then((response) => {
        toast.success(response.data.message, { position: toast.POSITION.BOTTOM_RIGHT })
        setIsSubmitButtonDisabled(false)
        setIsDraftButtonDisabled(false)
        setHeaderLabel('')
        setRows([])
        dispatch(setPendingData([]))
        setSelectAll(false)
        if (remainingRows.length === 0) {
          const datas = [
            {
              // activity_date: dateWise,
              isChecked: false,
              checkUser: '',
              product: '',
              task: '',
              hours: '',
              // status: 'Choose Status',
              description: '',
            },
          ]
          setRows(datas)
          dispatch(setPendingData(datas))
        } else {
          setRows(remainingRows)
          dispatch(setPendingData(remainingRows))
        }
      })
      .catch((error) => {
        setIsSubmitButtonDisabled(false)
        setIsDraftButtonDisabled(false)
        setSelectAll(false)
        const updatedRows = rows.map((row) => ({
          ...row,
          isChecked: false,
        }))
        setRows(updatedRows)
        setHeaderLabel('')
        const errors = error.response.data
        if (errors) {
          toast.error(errors.message, { position: toast.POSITION.BOTTOM_RIGHT })
        } else {
          toast.error(error.message, { position: toast.POSITION.BOTTOM_RIGHT })
        }
      })
  }

  const handleDraft = async () => {
    setIsSubmitButtonDisabled(true)
    setIsDraftButtonDisabled(true)
    // Filter out rows with isChecked set to true
    const remainingRows = rows.filter((value) => !value.isChecked)

    const formData = new FormData()
    let i = 0

    rows.forEach((value) => {
      if (value.isChecked) {
        formData.append(
          `commonTimeSheetActivities[${i}].activity_date`,
          dayjs(dateWise).format('YYYY-MM-DD'),
        )
        formData.append(`commonTimeSheetActivities[${i}].product`, value.product)
        formData.append(`commonTimeSheetActivities[${i}].task`, value.task)
        formData.append(
          `commonTimeSheetActivities[${i}].hours`,
          `${dayjs(value.hours.$d).format('HH:mm')}`,
        )
        // formData.append(`commonTimeSheetActivities[${i}].status`, value.status)
        formData.append(`commonTimeSheetActivities[${i}].description`, value.description)
        i++
      }
    })
    formData.append(`status`, 'Draft')
    dispatch(submitActivity(formData))
      .then((response) => {
        toast.success(response.data.message, { position: toast.POSITION.BOTTOM_RIGHT })
        setIsSubmitButtonDisabled(false)
        setIsDraftButtonDisabled(false)
        setHeaderLabel('')
        setSelectAll(false)
        if (remainingRows.length === 0) {
          setRows([
            {
              activity_date: dateWise,
              isChecked: false,
              product: '',
              task: '',
              hours: '',
              // status: '',
              description: '',
            },
          ])
        } else {
          setRows(remainingRows)
        }
        eventEmitter.emit('callDraft')
      })
      .catch((error) => {
        setIsSubmitButtonDisabled(false)
        setIsDraftButtonDisabled(false)
        setSelectAll(!selectAll)
        const updatedRows = rows.map((row) => ({
          ...row,
          isChecked: !selectAll,
        }))
        setRows(updatedRows)
        setHeaderLabel('')
        toast.error(error.message, { position: toast.POSITION.BOTTOM_RIGHT })
      })
  }

  //Product List
  const options = productList.map((product) => ({
    value: product.id,
    label: product.name,
    status: product.status,
    color: product.status === 'InActive' ? 'orange' : 'green',
  }))
  const activeOptions = options.filter((item) => item.status === 'Active')
  const inactiveOptions = options.filter((item) => item.status === 'InActive')

  // Task Activity list
  const taskOptions = taskList.map((task) => ({
    value: task,
    label: task,
  }))

  //

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll)
    const updatedRows = rows.map((row) => ({
      ...row,
      isChecked: !selectAll,
    }))
    setRows(updatedRows)
    let count = countCheckedItems(updatedRows)
    if (count >= 1) setHeaderLabel(`${count} rows selected`)
    else setHeaderLabel('')
  }
  function countCheckedItems(data) {
    let checkedCount = 0
    for (let item of data) {
      if (item.isChecked === true) {
        checkedCount++
      }
    }
    return checkedCount
  }

  const disabledTime = (current) => {
    const hour = current.hour()

    return {
      disabledHours: () => {
        const disabledHoursArray = []
        for (let i = 0; i < 24; i++) {
          if (i < 0 || i > 9) {
            disabledHoursArray.push(i)
          }
        }
        return disabledHoursArray
      },
      disabledMinutes: () => {
        if (hour === 9) {
          return [...Array(60).keys()].slice(1)
        } else if (hour === 0) {
          return [0]
        } else {
          return []
        }
      },
    }
  }

  const handleRaiseCloseModal = () => {
    setRaiseModal(false)
    dispatch(getYesterdayCount(dateWise))
    checkCondition(yesterdayCount, dateWise)
  }
  const warning = (id) => {
    Modal.warning({
      title: 'Delete Activity',
      content: 'Are you sure to delete this activity ?',
      onOk: () => deleteRow(id),
      closable: true,
      okCancel: true,
      autoFocusButton: true,
      centered: true,
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: { style: { background: '#f54550', borderColor: '#f54550', color: 'white' } },
    })
  }

  useEffect(() => {
    if (joiningDate === undefined) {
      window.localStorage.clear()
      localStorage.removeItem('userData')
      localStorage.removeItem('logout')
      localStorage.removeItem('Pm_tool')
      localStorage.removeItem('neram')
      localStorage.clear()
      window.location.href = getSubPath()
    }
    const currentMonthYear = dayjs(dateWise).format('YYYY-MM')
    monthRef.current = dayjs(dateWise).format('M')
    yearRef.current = dayjs(dateWise).format('YYYY')
    dispatch(getExistsDates(currentMonthYear))
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    const existDate = existingDates
    if (!existDate) {
      return null // Or handle it according to your use case
    }

    const raisedDates = existDate.RaisedRequestList || []
    const attendanceDates = existDate.AttendanceList || []
    const submittedDates = existDate.SubmittedList || []
    const PermissionDates = existDate.Permission || []

    const isRaised = raisedDates.includes(current.format('YYYY-MM-DD'))
    const isAttendance = attendanceDates.includes(current.format('YYYY-MM-DD'))
    const isSubmitted = submittedDates.includes(current.format('YYYY-MM-DD'))
    const isSelected = current.isSame(dateWise, 'day')
    const currentDate = dayjs() // Current date
    const isTodayOrAfter = current?.isAfter(currentDate, 'day')
    const isJoiningDateOrBefore = current?.isBefore(joiningDate, 'day')
    const isPermission = PermissionDates.includes(dayjs(current).format('YYYY-MM-DD'))

    // Check if the current date is included in any of the arrays
    const isDisabled =
      isRaised || isAttendance || isSubmitted || isTodayOrAfter || isJoiningDateOrBefore

    let fontWeights
    if (isDisabled) {
      fontWeights = 'normal'
    } else if (isSelected || isPermission) {
      fontWeights = 'bold'
    } else {
      fontWeights = 'normal'
    }
    let colorText
    if (isDisabled) {
      colorText = 'gray'
    } else if (isSelected) {
      colorText = 'white'
    } else if (isPermission) {
      colorText = 'black'
    } else {
      colorText = '#ffaa00'
    }
    const color = colorText
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

  const disabledDate = (current) => {
    const existDate = existingDates

    if (!existDate) {
      return false
    }

    const currentDate = dayjs()
    const raisedDates = existDate.RaisedRequestList || []
    const attendanceDates = existDate.AttendanceList || []
    const submittedDates = existDate.SubmittedList || []

    const isTodayOrAfter = current.isAfter(currentDate, 'day')
    const isRaised = raisedDates.includes(current.format('YYYY-MM-DD'))
    const isAttendance = attendanceDates.includes(current.format('YYYY-MM-DD'))
    const isSubmitted = submittedDates.includes(current.format('YYYY-MM-DD'))
    const isJoiningDateOrBefore = current?.isBefore(joiningDate, 'day')

    const currentYear = current.year()
    const currentMonth = current.month()

    // Check if the user's joining date month is May
    const joiningMonthIsMay = joiningDate && dayjs(joiningDate).month() === 4 // month is 0-indexed, so 4 is May

    // Check if the date is in May of the current year
    const isInMayOfCurrentYear = currentYear === currentDate.year() && currentMonth === 4

    // If the joining month is May, allow all dates in May of the current year
    if (joiningMonthIsMay && isInMayOfCurrentYear) {
      return false
    }

    // Disable the date based on existing conditions
    const isDisabled =
      isRaised || isAttendance || isSubmitted || isTodayOrAfter || isJoiningDateOrBefore
    return isDisabled
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

  useEffect(() => {
    dispatch(getYesterdayCount(dateWise))
    setRows(pendingData)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (yesterdayCount) {
      checkCondition(yesterdayCount, dateWise)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yesterdayCount])

  const checkCondition = (resData, date) => {
    const parsedDate = dayjs(date, 'DD MMM, YYYY')
    const formattedDate = parsedDate.format('YYYY-MM-DD')
    const { attendanceStatus, count, status } = resData

    if (attendanceStatus === 'leave') {
      setAttendance(attendanceStatus)
    } else {
      setAttendance('present')
    }

    if (formattedDate !== today && joiningDate !== today) {
      if (attendanceStatus === 'leave') {
        setDisableContent(true)
        setRaiseButton(false)
      } else if (status === 'Permission') {
        setDisableContent(false)
        setRaiseButton(false)
      } else if (
        count === 0 &&
        status === 'Pending' &&
        (attendanceStatus === 'present' || attendanceStatus === 'yet')
      ) {
        setDisableContent(true)
        setRaiseButton(false)
      } else if (
        count === 0 &&
        status === '' &&
        (attendanceStatus === 'present' || attendanceStatus === 'yet')
      ) {
        setDisableContent(true)
        setRaiseButton(true)
      } else if (
        count === 0 &&
        status === 'Approved' &&
        (attendanceStatus === 'present' || attendanceStatus === 'yet')
      ) {
        setDisableContent(false)
        setRaiseButton(false)
      } else if (status === 'Rejected') {
        setDisableContent(true)
        setRaiseButton(false)
      } else if (count !== 0) {
        setDisableContent(true)
        setRaiseButton(false)
        toast.error('Already Submitted the Timesheet', { position: toast.POSITION.BOTTOM_RIGHT })
      }
    } else {
      setDisableContent(false)
      setRaiseButton(false)
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12} sm={12} md={5}>
          <h6 className="timesheet-heading mt-3" style={{ marginLeft: '30px' }}>
            Pending - Time Sheet
          </h6>
          <Breadcrumb
            style={{ marginLeft: '30px' }}
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
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Pending Activity
                  </span>
                ),
              },
            ]}
          />
        </CCol>
        <CCol
          xs={9}
          sm={12}
          md={6}
          className="draft-sumbit-button "
          span={raiseButton ? 6 : undefined}
        >
          <CRow>
            <CCol className="draft_rightside_pend">
              <div>
                <DatePicker
                  variant={'borderless'}
                  id="date"
                  type="date"
                  name="fieldName"
                  placeholder="Choose Date"
                  className="form-input-draft input-lg date-picker  time-pend-cal date-header"
                  onChange={(date, dateString) => handleDateChange(date)}
                  suffixIcon={
                    <img
                      src={Calendarimg}
                      alt="Calendarimg"
                      style={{ width: '13px', height: '13px' }}
                    />
                  }
                  format="DD MMM, YYYY"
                  defaultValue={dayjs()}
                  max={today}
                  allowClear={false}
                  min={joiningDate}
                  onPanelChange={handlePanelChange}
                  cellRender={renderDateCell}
                  disabledDate={disabledDate}
                />
              </div>
              <Select
                className={`form-input-draft input-lg activity-date times-pen-select ${
                  attendance === 'present' ? 'present-color' : 'leave-color'
                }`}
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt={Downarrowimg}
                    style={{ width: '12px', height: '7px' }}
                  />
                }
                value={attendance}
                onChange={(value) => handleAttendance(value)}
              >
                <Select.Option value="present" style={{ color: '#00ab55', fontWeight: '600' }}>
                  Present
                </Select.Option>
                <Select.Option value="leave" style={{ color: '#e40e2d', fontWeight: '600' }}>
                  Leave
                </Select.Option>
              </Select>
            </CCol>
            {raiseButton && (
              <CCol xs={4} md={4} className="draft-sumbit-button ">
                <CButton
                  className="raise-button raise-timesheet raise_button_content"
                  type="button"
                  style={{ color: 'white' }}
                  onClick={() => setRaiseModal(true)}
                >
                  Raise Request
                </CButton>
              </CCol>
            )}
          </CRow>
        </CCol>
      </CRow>
      <div className="table-container-draft table_scroll-draft">
        <CTable>
          <CTableHead className="draft-head-row-ts">
            {!headerLabel ? (
              <CTableRow className={`my-3 ${disableContent ? 'disabled-content' : ''}`}>
                <CTableHeaderCell
                  className="table-head-draft text-c text-center"
                  scope="col"
                  width="4%"
                >
                  <Checkbox
                    className="checkbox_design"
                    id="selectAllCheckbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    disabled={disableContent || rows.some((row) => !areAllFieldsFilled(row))}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft text-c text-center"
                  scope="col"
                  width="4%"
                >
                  SI.No
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c " width="15%" scope="col">
                  Product
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c " scope="col" width="20%">
                  Task
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c" scope="col" width="10%">
                  No.of.Hours
                </CTableHeaderCell>
                {/* <CTableHeaderCell className="table-head-draft text-c" scope="col" width="10%">
                  Status
                </CTableHeaderCell> */}
                <CTableHeaderCell className="table-head-draft text-c " scope="col" width="30%">
                  Remarks
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft text-c text-center"
                  scope="col"
                  width="9%"
                >
                  <button
                    style={{ background: 'transparent' }}
                    type="button"
                    className="text-decoration-none  border-0  addrow_button "
                    onClick={addRow}
                  >
                    {' '}
                    <PlusOutlined
                      className="plus_icon "
                      style={{ width: '10px', margin: '2px' }}
                    />{' '}
                    <span className="row_lable"> Row</span>
                  </button>
                </CTableHeaderCell>
              </CTableRow>
            ) : (
              <CTableRow>
                <CTableHeaderCell
                  className="table-head-draft table-head-selected  text-c text-center pad_bt"
                  scope="col"
                  width="4.3%"
                >
                  <Checkbox
                    id="selectAllCheckbox"
                    className="checkbox_design"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    disabled={disableContent || rows.some((row) => !areAllFieldsFilled(row))}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-selected  text-c align_con_cen"
                  colSpan="4" // Span across all other columns
                >
                  <span style={{ color: '#f50505' }}>{headerLabel}</span>
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-selected "
                  colSpan="5"
                  style={{ textAlign: 'right' }}
                  width="39.1%"
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                  >
                    <button
                      className=" btn border-0  text-secondary save_draft_button"
                      disabled={!hasCheckedRow || isDraftButtonDisabled || disableContent}
                      onClick={() => handleDraft()}
                      type="button"
                    >
                      <FileSvg width="17" height="17" viewBox="0 0 18 18" fill="none" />
                      <span style={{ marginLeft: '5px', fontSize: '13px', fontWeight: '700' }}>
                        Save as Draft
                      </span>
                    </button>
                    <div
                      title={
                        !hasCheckedRow || isSubmitButtonDisabled
                          ? 'Please check a row before submitting'
                          : ''
                      }
                    >
                      <CButton
                        className="submit-button submit-timesheet "
                        // disabled={!hasCheckedRow || isSubmitButtonDisabled}
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={!hasCheckedRow || isSubmitButtonDisabled || disableContent}
                      >
                        {/* <CheckOutlined style={{ width: '16px' }} />*/} Submit
                      </CButton>
                    </div>
                  </div>
                </CTableHeaderCell>
              </CTableRow>
            )}
          </CTableHead>
          <CTableBody className={`my-3 ${disableContent ? 'disabled-content' : ''}`}>
            {rows?.map((data, index) => (
              <CTableRow key={index} className="my-3">
                <CTableDataCell
                  className="activity-text-radio activity-text-index text-center pad-bottom"
                  style={{
                    cursor: !areAllFieldsFilled(data) ? 'not-allowed' : 'default',
                    ...(areAllFieldsFilled(data)
                      ? {} // No hover effect for enabled checkboxes
                      : { ':hover': { cursor: 'not-allowed' } }), // Hover effect for disabled checkboxes
                  }}
                  width="4%"
                >
                  <Checkbox
                    className="checkbox_design"
                    id={`flexCheckDefault-${index}`}
                    checked={data.isChecked}
                    onChange={() => handleCheckboxChange(index)}
                    disabled={!areAllFieldsFilled(data)}
                  />
                </CTableDataCell>
                <CTableDataCell className="activity-text-index pad-bottom text-center  " width="4%">
                  {index + 1}
                </CTableDataCell>
                <CTableDataCell className="activity-text-draft pad-bottom" width="15%">
                  <Select
                    showSearch
                    placeholder="Choose Product"
                    variant={'borderless'}
                    ref={selectRef}
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    className="product-select"
                    loading
                    suffixIcon={
                      <img
                        src={Downarrowimg}
                        alt={Downarrowimg}
                        style={{ width: '12px', height: '7px' }}
                      />
                    }
                    dropdownStyle={{
                      border: '#ffff', // Setting border: 'none' here to remove border from the dropdown menu
                    }}
                    style={{ width: '100%', fontWeight: '600' }}
                    onChange={(selectedOption) =>
                      handleInputChange(index, 'product', selectedOption)
                    }
                    options={
                      loader
                        ? [
                            // If loading, show loader inside options
                            {
                              label: (
                                <div style={{ textAlign: 'center' }}>
                                  {/* <Spin /> Loading Options... */}
                                  <Skeleton
                                    title={false}
                                    paragraph={{
                                      rows: 5, // Adjust the number of rows here
                                      width: '100%', // Optional: Adjust the width of each line
                                    }}
                                  />
                                </div>
                              ),
                              value: 'loading',
                              disabled: true, // Make loader option disabled
                            },
                          ]
                        : [
                            {
                              label: 'Assigned Projects',
                              options: activeOptions,
                            },
                            {
                              label: 'Other Projects',
                              options: inactiveOptions,
                            },
                          ].map((group) => ({
                            label: group.label,
                            options: group.options.map((option) => ({
                              label: (
                                <Space>
                                  <span
                                    style={{
                                      backgroundColor: option.color,
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      display: 'inline-block',
                                      border: 'none',
                                    }}
                                  />
                                  <span style={{ fontWeight: '600' }}>{option.label}</span>{' '}
                                  {/* Removed color styling here */}
                                </Space>
                              ),
                              value: option.value,
                            })),
                          }))
                    }
                    value={data.product || null}
                    filterOption={(input, option) => {
                      const label = option.label?.props?.children?.[1]?.props?.children
                      return label && label.toLowerCase().includes(input.toLowerCase())
                    }}
                  />
                </CTableDataCell>
                <CTableDataCell className="activity-text-task pad-bottom" width="20%">
                  <Select
                    showSearch
                    suffixIcon={
                      <img
                        src={Downarrowimg}
                        alt={Downarrowimg}
                        style={{ width: '12px', height: '7px' }}
                      />
                    }
                    ref={selectRef}
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    className="draft-form-custom-selects choose_task_box"
                    id={`task-${index}`}
                    value={taskOptions.find((task) => task.value === data.task) || null} // Set value to null when no option is selected
                    onChange={(selectedOption) => handleInputChange(index, 'task', selectedOption)}
                    menuportaltarget={document.body}
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: '14px',

                        minWidth: '80px',
                        minHeight: '46px',
                        maxHeight: index <= 1 ? '120px' : '80px', // Set maxHeight based on the condition
                        zIndex: '1', // Adjust the zIndex as needed
                        border: 'none',
                        boxShadow: 'none',
                        fontWeight: 600,
                      }),
                      menu: (base) => ({
                        ...base,
                        fontSize: '14px',
                        maxHeight: index <= 1 ? '120px' : '80px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        fontWeight: 600,
                      }),
                      getOptionStyle: (provided, state) => ({
                        ...provided,
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 12px',
                      }),
                    }}
                    options={
                      loadingActiveTask
                        ? [
                            {
                              label: (
                                <div style={{ textAlign: 'center' }}>
                                  <Skeleton
                                    title={false}
                                    paragraph={{
                                      rows: 5, // Adjust the number of rows here
                                      width: '100%', // Optional: Adjust the width of each line
                                    }}
                                  />
                                </div>
                              ),
                              value: 'loading',
                              disabled: true,
                            },
                          ]
                        : taskOptions
                    }
                    placeholder="Choose Task"
                  />
                </CTableDataCell>
                <CTableDataCell
                  className="activity-text activity-text-time pad-bottom "
                  width="10%"
                >
                  <TimePicker
                    className="date_picker_box"
                    variant={'borderless'}
                    placeholder="HH:mm"
                    format="HH:mm"
                    value={data.hours || null}
                    style={{ border: 'none', fontWeight: 600, fontSize: '13px' }}
                    suffixIcon={<CaretDownOutlined className="caredown-icon" />}
                    disabledTime={disabledTime}
                    hideDisabledOptions
                    picker="time"
                    allowClear={false}
                    showNow={false}
                    onChange={(value) => handleInputChange(index, 'hours', value)}
                  />
                </CTableDataCell>
                <CTableDataCell
                  className="activity-text activity-text-description pad-bottom"
                  width="30%"
                >
                  <TextArea
                    id={`des-${index}`}
                    variant={'borderless'}
                    value={data.description}
                    className="description_textarea"
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    style={{ color: 'black', fontWeight: '600' }} // Adjust '100px' to your desired minimum height
                    placeholder="Enter Remarks..."
                    autoSize={{
                      minRows: 0,
                      maxRows: 1,
                    }}
                  />
                </CTableDataCell>
                <CTableDataCell className="text-c activity-text-status pad-bottom" width="9%">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* <Popconfirm
                        title="Delete confirm Modal"
                        description="Are you sure to delete this activity ?"
                        open={open === index}
                        onConfirm={() => deleteRow(index)}
                        okButtonProps={{
                          style: { background: '#f54550', borderColor: '#f54550', color: 'white' },
                          loading: confirmLoading,
                        }}
                        placement="left"
                        okText="Yes"
                        cancelText="No"
                        onCancel={handleDeleteCancel}
                      > */}
                    <button
                      type="button"
                      className="action-view cross-button"
                      // onClick={() => showPopconfirm(index)}
                      onClick={() => warning(index)}
                      disabled={rows[index].isChecked}
                      style={{ padding: '4px 8px' }}
                    >
                      <DeleteSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
                    </button>
                    {/* </Popconfirm> */}
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      {visibleView && (
        <CModal
          size="sm"
          backdrop="static"
          alignment="center"
          visible={visibleView}
          onClose={closeModalView}
          className={`right ${visibleView ? 'modal-visible' : 'modal-hidden'}`}
        >
          <CModalBody style={{ fontSize: '15px' }}>
            Are you sure you want to leave on <b>{dateWise.format('DD MMM YYYY')}</b> ?{' '}
          </CModalBody>
          <CModalFooter style={{ border: 'none' }}>
            <CButton className="edit-cancel-btn" onClick={closeModalView}>
              Cancel
            </CButton>
            <CButton
              color="primary  button-clr"
              style={{ fontSize: '15px', fontWeight: '500' }}
              onClick={() => handleConfirm(dateWise, 'leave')}
            >
              Confirm
            </CButton>
          </CModalFooter>
        </CModal>
      )}
      {raiseModal && (
        <RaiseRequestModal
          isOpen={raiseModal}
          closeModal={() => handleRaiseCloseModal()}
          dateWise={dayjs(dateWise, 'DD MMM, YYYY').format('YYYY-MM-DD')}
        />
      )}
    </>
  )
}

Pending.propTypes = {
  productList: PropTypes.array,
  today: PropTypes.string,
  taskList: PropTypes.array,
  loadingActiveTask: PropTypes.bool,
  loader: PropTypes.bool,
}
export default Pending
