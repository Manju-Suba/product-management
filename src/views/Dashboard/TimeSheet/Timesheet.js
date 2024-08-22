import React, { useEffect, useRef, useState } from 'react'
import { Button, DatePicker, Select, Skeleton, Tabs, Typography } from 'antd'
import { CButton, CCard, CCol, CModal, CModalBody, CModalFooter, CRow } from '@coreui/react'
import Calendarimg from '../../../assets/images/calendar-image.png'
import Downarrowimg from '../../../assets/images/downarrow.png'
import MyTimesheetbarchart from './barChart'
import TimeSheetTable from '../TimeSheet/TimeSheetTable'
import BarChartSVG from '../DashboardSVG/BarChartSVG'
import NextArrowSVG from '../DashboardSVG/TableSVG'
import { useDispatch, useSelector } from 'react-redux'
import {
  createAttendanceSheet,
  getExistsDates,
  getTaskActivityList,
  getYesterdayCount,
  getproductList,
} from 'src/redux/timesheet/action'
import dayjs from 'dayjs'
import { getDecodeData } from 'src/constant/Global'
import { getToday } from 'src/TimeUtils'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FileAddFilled } from '@ant-design/icons'
import PropTypes from 'prop-types'
import { getMyTimesheetDetails } from 'src/redux/Dashboard/action'
import RaiseRequestModal from 'src/views/modal/RaiseRequestModal'

const DashboardTimesheet = ({ widgetLength, widgetTableData, title }) => {
  const [activeTab, setActiveTab] = useState('1')
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [attendance, setAttendance] = useState(null)
  const [raiseButton, setRaiseButton] = useState(false)
  const [visibleView, setVisibleView] = useState(false)
  const [dateWise, setDateWise] = useState(dayjs())
  const [raiseModal, setRaiseModal] = useState(false)
  const dispatch = useDispatch()
  const yesterdayCount = useSelector((state) => state.timesheet?.yesterdayCount)
  const existingDates = useSelector((state) => state.timesheet.existingDates)
  const [loading, setLoading] = useState(true)
  const [loadingActiveTask, setLoadingActiveTask] = useState(true)
  const user = getDecodeData()
  const joiningDate = user?.jod
  const monthRef = useRef(null)
  const yearRef = useRef(null)
  const filter = useRef(0)
  const [disableContent, setDisableContent] = useState(false)
  const heightRef = useRef(false)
  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab)
  }
  const today = getToday()
  const productList = useSelector((state) => state.timesheet?.approvedProductList)
  const taskList = useSelector((state) => state.timesheet?.taskList)
  const myTimesheetDetails = useSelector((state) => state.dashboard?.myTimesheetDetails)
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)

  useEffect(() => {
    dispatch(getproductList())
    dispatch(getTaskActivityList())
    setLoading(false)
    setLoadingActiveTask(false)
    if (widgetLength > 2 && widgetTableData === title) {
      heightRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {}, [disableContent])
  const handleDateChange = (event) => {
    const selectedDate = event
    if (selectedDate === today) {
      setRaiseButton(false)
    }
    if (activeTab === '1') {
      dispatch(getMyTimesheetDetails(filter.current, selectedDate))
    } else {
      dispatch(getYesterdayCount(selectedDate))
      checkCondition(yesterdayCount, selectedDate)
    }
    setSelectedDate(selectedDate)
  }

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

  const renderDateCell = (current) => {
    const month = parseInt(monthRef.current)
    const year = parseInt(yearRef.current)
    const currentDate = dayjs() // Current date

    if (loading) {
      return (
        <div style={{ textAlign: 'center' }}>
          <Skeleton
            title={false}
            paragraph={{
              rows: 1,
              width: '100%',
              height: '10px',
              style: { height: '10px !important' },
            }}
          />
        </div>
      )
    }

    const existDate = existingDates
    if (!existDate) return null // Handle according to your use case

    const isCurrentDate = (date) => current.isSame(date, 'day')
    const formatDate = (date) => current.format('YYYY-MM-DD')

    const getCommonStyles = (isSelected) => ({
      backgroundColor: isSelected ? '#e40e2d' : 'transparent',
      borderRadius: isSelected ? '50%' : '0%',
      minWidth: isSelected ? '24px' : 'auto',
      height: isSelected ? '24px' : 'auto',
      display: isSelected ? 'inline-block' : 'initial',
      lineHeight: isSelected ? '24px' : 'initial',
    })

    if (activeTab === '1') {
      const submittedDates = existDate.SubmittedList || []
      const isSubmitted = submittedDates.includes(formatDate(current))
      const isSelected = isCurrentDate(selectedDate)

      const styles = {
        color: isSelected ? 'white' : isSubmitted ? 'green' : 'black',
        fontWeight: isSelected ? 'normal' : isSubmitted ? 'bold' : 'normal',
        ...getCommonStyles(isSelected),
      }

      return <div style={styles}>{current.date()}</div>
    } else {
      const {
        RaisedRequestList = [],
        AttendanceList = [],
        SubmittedList = [],
        Permission = [],
      } = existDate

      const isRaised = RaisedRequestList.includes(formatDate(current))
      const isAttendance = AttendanceList.includes(formatDate(current))
      const isSubmitted = SubmittedList.includes(formatDate(current))
      const isPermission = Permission.includes(formatDate(current))
      const isSelected = isCurrentDate(selectedDate)
      const isTodayOrAfter = current.isAfter(currentDate, 'day')
      const isJoiningDateOrBefore = current.isBefore(joiningDate, 'day')

      const isDisabled =
        isRaised || isAttendance || isSubmitted || isTodayOrAfter || isJoiningDateOrBefore

      const styles = {
        color: isDisabled ? 'gray' : isSelected ? 'white' : isPermission ? 'black' : '#ffaa00',
        fontWeight: isDisabled ? 'normal' : isSelected || isPermission ? 'bold' : 'normal',
        ...getCommonStyles(isSelected),
      }

      if (current.month() + 1 === month && current.year() === year) {
        return <div style={styles}>{current.date()}</div>
      } else {
        return <div>{current.date()}</div>
      }
    }
  }

  const disabledDate = (current) => {
    const existDate = existingDates
    if (!existDate) return false

    const formatDate = (date) => date.format('YYYY-MM-DD')
    const currentDate = dayjs()

    const checkDates = (datesArray) => datesArray.includes(formatDate(current))

    if (activeTab === '1') {
      const submittedDates = existDate.SubmittedList || []
      return !checkDates(submittedDates)
    } else {
      const { RaisedRequestList = [], AttendanceList = [], SubmittedList = [] } = existDate

      const isTodayOrAfter = current.isAfter(currentDate, 'day')
      const isRaised = checkDates(RaisedRequestList)
      const isAttendance = checkDates(AttendanceList)
      const isSubmitted = checkDates(SubmittedList)
      const isJoiningDateOrBefore = current.isBefore(joiningDate, 'day')

      return isRaised || isAttendance || isSubmitted || isTodayOrAfter || isJoiningDateOrBefore
    }
  }

  const handleDisableContent = (value) => {
    setDisableContent(value)
  }
  // const barData = [
  //   {
  //     product: 'Trove Portal - Phase 1',
  //     hours: '00:10',
  //     task: 'Development',
  //     description: 'Aggregation pipeline  top hashtag',
  //   },
  //   {
  //     product: 'SwipeDetails',
  //     hours: '04:00',
  //     task: 'Testing',
  //     description: 'Swipe details',
  //   },
  //   {
  //     product: 'SwipeDetails',
  //     hours: '07:00',
  //     task: 'DB Designing',
  //     description: 'Swipe details',
  //   },
  //   {
  //     product: 'SwipeDetails',
  //     hours: '01:00',
  //     task: 'Team Discussion',
  //     description: 'Swipe details',
  //   },
  //   {
  //     product: 'SwipeDetails',
  //     hours: '03:00',
  //     task: 'IIY',
  //     description: 'Swipe details',
  //   },
  //   {
  //     product: 'SwipeDetails',
  //     hours: '04:00',
  //     task: 'Meeting',
  //     description: 'Swipe details',
  //   },
  //   {
  //     product: 'SwipeDetails',
  //     hours: '04:00',
  //     task: 'Team Coordination and Task Validation',
  //     description: 'Swipe details',
  //   },
  // ]
  const items = [
    {
      key: '1',
      label: 'My Timesheet Bar Chart',
      children: <MyTimesheetbarchart data={myTimesheetDetails} heightValue={heightRef.current} />,
    },
    {
      key: '2',
      label: 'Time Sheet Table',
      children: (
        <TimeSheetTable
          productList={productList}
          taskList={taskList}
          loader={loading}
          selectedDate={selectedDate}
          loadingActiveTask={loadingActiveTask}
          handleDisableContent={handleDisableContent}
          disableContents={disableContent}
          heightValue={heightRef.current}
        />
      ),
    },
  ]
  const handlePanelChange = async (value, mode) => {
    if (mode === 'date') {
      setLoading(true)
      const currentMonthYear = dayjs(value).format('YYYY-MM')
      monthRef.current = dayjs(value).format('M')
      yearRef.current = dayjs(selectedDate).format('YYYY')
      dispatch(getExistsDates(currentMonthYear))
      setLoading(false)
    }
  }

  const options = productList.map((product) => ({
    value: product.id,
    label: product.name,
  }))

  useEffect(() => {
    const currentMonthYear = dayjs(selectedDate).format('YYYY-MM')
    monthRef.current = dayjs(selectedDate).format('M')
    yearRef.current = dayjs(selectedDate).format('YYYY')
    dispatch(getExistsDates(currentMonthYear))
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    dispatch(getYesterdayCount(selectedDate))
    dispatch(getMyTimesheetDetails(filter.current, selectedDate))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (yesterdayCount) {
      checkCondition(yesterdayCount, selectedDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yesterdayCount])
  const handleProduct = (value) => {
    if (value === undefined) {
      filter.current = 0
    } else {
      filter.current = value
    }
    dispatch(getMyTimesheetDetails(filter.current, selectedDate))
  }

  //leave
  const closeModalView = () => {
    setVisibleView(false)
    setDisableContent(false)
    setAttendance('present')
  }
  const handleAttendance = (event) => {
    const selectedValue = event
    setAttendance(selectedValue)
    if (selectedValue === 'leave') {
      setVisibleView(true)
    } else if (selectedValue === 'present') {
      setDisableContent(false)
      handleAttendanceSheet(dateWise, 'present')
    } else {
      setVisibleView(false)
    }
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
  const handleRaiseCloseModal = () => {
    setRaiseModal(false)
    dispatch(getYesterdayCount(dateWise))
    checkCondition(yesterdayCount, dateWise)
  }
  return (
    <div>
      <CCard
        style={{
          height: widgetLength > 2 && widgetTableData === title ? '270px' : '440px',
          border: 'none',
          marginBottom: '10px',
          padding: '15px',
          paddingTop: '24px',
          paddingLeft: '18px',
        }}
      >
        <CRow>
          <CCol
            xs={6}
            sm={sidebarShow === true ? 6 : 6}
            md={sidebarShow === true ? 6 : 4}
            lg={sidebarShow === true ? 7 : 3}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div>
              <Typography
                style={{
                  fontSize: '14px',
                  color: '#161C24',
                  fontWeight: '600',
                }}
                className="dB_timesheet_lable"
              >
                {title}
              </Typography>
            </div>
          </CCol>
          <CCol
            xs={6}
            md={sidebarShow === true ? 6 : 6}
            lg={sidebarShow === true ? 5 : 2}
            style={{ paddingRight: '0px' }}
          >
            <div style={{ width: '95%', marginRight: '10px' }}>
              <Select
                className="bordered "
                style={{
                  width: '100%',
                  border: '0.5px solid #F3F3F3',
                  padding: '10px',
                  backgroundColor: '#FBFBFB',
                  borderRadius: '5px',
                  height: '33px',
                }}
                disabled={activeTab === '2' || sidebarShow === true}
                variant="outlined"
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt="Downarrowimg"
                    style={{ width: '10px', height: '6px', marginRight: '4px' }}
                  />
                }
                dropdownStyle={{
                  border: '#ffff',
                  width: '100%',
                }}
                id="products"
                value={options.find((option) => option.value === filter.current) || undefined}
                onChange={(value) => handleProduct(value)}
                showSearch={true}
                allowClear={true}
                filterOption={(input, option) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                options={
                  loading
                    ? [
                        {
                          label: (
                            <div style={{ textAlign: 'center' }}>
                              {Array.from({ length: 5 }, (_, index) => (
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
                          ),
                          value: 'loading',
                          disabled: true,
                        },
                      ]
                    : options
                }
                // ref={selectRef}
                placeholder="Product Filter"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              />
            </div>
          </CCol>
          <CCol
            xs={6}
            // sm={raiseButton && activeTab === '2' ? 6 : 6}
            md={raiseButton && activeTab === '2' ? 6 : 6}
            lg={sidebarShow ? (raiseButton && activeTab === '2' ? 4 : 6) : 4}
            style={{ paddingRight: '0px', paddingLeft: '0px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  border: '1px solid rgb(221 221 221)',
                  borderRadius: '5px',
                  width: '90%',
                  alignItems: 'center',
                  height: '33px',
                }}
              >
                <DatePicker
                  variant={'borderless'}
                  id="date"
                  type="date"
                  name="fieldName"
                  size="small"
                  placeholder="Choose Date"
                  className="form-input-draft input-lg date-picker  time-pend-cal date-header date-size"
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
                  disabled={sidebarShow === true}
                />
                <Select
                  className={`form-input-draft input-lg times-pen-select ${
                    attendance === 'present' ? 'present-color' : 'leave-color'
                  }`}
                  style={{ marginLeft: '-33px' }}
                  suffixIcon={
                    <img
                      src={Downarrowimg}
                      alt="Downarrow"
                      style={{ width: '10px', height: '5px', marginRight: '6px' }}
                    />
                  }
                  value={attendance}
                  dropdownStyle={{
                    border: '#ffff',
                    width: '10%',
                  }}
                  onChange={(value) => handleAttendance(value)}
                  disabled={sidebarShow === true}
                >
                  <Select.Option value="present" style={{ color: '#00ab55', fontWeight: '600' }}>
                    Present
                  </Select.Option>
                  <Select.Option value="leave" style={{ color: '#e40e2d', fontWeight: '600' }}>
                    Leave
                  </Select.Option>
                </Select>
              </div>
            </div>
          </CCol>
          <CCol
            xs={6}
            md={sidebarShow ? (raiseButton && activeTab === '2' ? 4 : 6) : 6}
            lg={sidebarShow ? (raiseButton && activeTab === '2' ? 4 : 6) : 3}
            // lg={raiseButton && activeTab === '2' ? 3 : 2}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'end',
                marginTop: '2px',
                marginLeft: raiseButton ? '' : '5px',
              }}
            >
              {raiseButton && activeTab === '2' && (
                <Button
                  className="raise-timesheet mx-2 "
                  type="button"
                  style={{
                    color: 'white',
                    height: '28px',
                    marginTop: '1px',
                    width: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => setRaiseModal(true)}
                >
                  <FileAddFilled />
                </Button>
              )}
              <button
                className={`tab ${activeTab === '1' ? 'DGroup_icon' : 'DGroup_img'}`}
                onClick={() => toggleTab('1')}
                disabled={sidebarShow === true}
              >
                {activeTab === '1' ? (
                  <BarChartSVG
                    width="15"
                    height="15"
                    viewBox="0 0 18 18"
                    fill="#FF2D2D"
                    stopColor="#FF2D2D"
                  />
                ) : (
                  <BarChartSVG
                    width="16"
                    height="15"
                    viewBox="0 0 18 18"
                    fill="#AAAAAA"
                    stopColor="#AAAAAA"
                  />
                )}
              </button>

              <button
                className={`tab ${activeTab === '2' ? 'DChart_img' : 'DChart_icon'}`}
                onClick={() => toggleTab('2')}
                disabled={sidebarShow === true}
              >
                {activeTab === '2' ? (
                  <NextArrowSVG
                    fill="#FF2D2D"
                    viewBox="0 0 16 10"
                    width="16"
                    height="19"
                    stopColor="#FF2D2D"
                  />
                ) : (
                  <NextArrowSVG
                    fill="#AAAAAA"
                    viewBox="0 0 16 10"
                    width="16"
                    height="19"
                    stopColor="#AAAAAA"
                  />
                )}
              </button>
            </div>
          </CCol>
        </CRow>
        <CRow>
          <CCol className="Dashboard_Tab mt-3" style={{ padding: activeTab === '2' ? '0px' : '' }}>
            <Tabs activeKey={activeTab} onChange={toggleTab} items={items} />
          </CCol>
        </CRow>
      </CCard>
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
          dateWise={selectedDate.format('YYYY-MM-DD')}
        />
      )}
    </div>
  )
}

DashboardTimesheet.propTypes = {
  title: PropTypes.string.isRequired,
  widgetLength: PropTypes.number.isRequired,
  widgetTableData: PropTypes.array.isRequired,
}

export default DashboardTimesheet
