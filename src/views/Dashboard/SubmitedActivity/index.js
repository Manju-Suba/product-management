import { CCard, CCol, CRow } from '@coreui/react'
import { Typography, DatePicker, Skeleton } from 'antd'
import { React, useRef, useState, useEffect } from 'react'
import Calendarimg from '../../../assets/images/calendar-image.png'
import dayjs from 'dayjs'
import { getToday } from 'src/TimeUtils'
import { useDispatch, useSelector } from 'react-redux'
import SubmittedActivityTable from './SubmittedActivityTable'
import { getExistsDates } from 'src/redux/timesheet/action'
import PropTypes from 'prop-types'
import NextArrowSVG from '../DashboardSVG/NextArrowSVG'
import { Link } from 'react-router-dom'

function SubmitedActivity({ widgetLength, widgetTableData, title }) {
  const dispatch = useDispatch()
  const today = getToday()
  const dateRef = useRef()
  const pageRef = useRef(0)
  const filterRef = useRef(false)
  const [dateWise, setDateWise] = useState(dayjs())
  const [loading, setLoading] = useState(true)
  const existingDates = useSelector((state) => state.timesheet.existingDates)
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)
  const heightRef = useRef(false)

  const handleDateChange = (date, dateString) => {
    if (date !== null) {
      const parsedDate = dayjs(date, 'DD MMM, YYYY')
      const formattedDate = parsedDate.format('YYYY-MM-DD')
      dateRef.current = formattedDate
      filterRef.current = true
    } else {
      dateRef.current = null
      filterRef.current = false
    }
    setDateWise(date)
    pageRef.current = 0
  }

  useEffect(() => {
    if (widgetLength > 2 && widgetTableData === title) {
      heightRef.current = true
    }
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePanelChange = async (value, mode) => {
    if (mode === 'date') {
      setLoading(true)
      const currentMonthYear = dayjs(value).format('YYYY-MM')
      dispatch(getExistsDates(currentMonthYear))
      setLoading(false)
    }
  }

  const renderDateCell = (current) => {
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

    const submittedDates = existDate.SubmittedList || []

    const isSubmitted = submittedDates.includes(current.format('YYYY-MM-DD'))
    const isSelected = current.isSame(dateWise, 'day')

    const color = isSelected ? 'white' : isSubmitted ? 'green' : 'black'
    const fontWeight = isSelected ? 'normal' : isSubmitted ? 'bold' : 'normal'

    const backgroundColor = isSelected ? '#e40e2d' : 'transparent'
    const borderRadius = isSelected ? '50%' : '0%'
    const minWidth = isSelected ? '24px' : 'auto'
    const height = isSelected ? '24px' : 'auto'
    const display = isSelected ? 'inline-block' : 'initial'
    const lineHeight = isSelected ? '24px' : 'initial'
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
  }

  const disabledDate = (current) => {
    const existDate = existingDates
    if (!existDate) {
      return true // Or handle it according to your use case
    }

    const submittedDates = existDate.SubmittedList || []

    const isSubmitted = submittedDates.includes(current.format('YYYY-MM-DD'))

    return !isSubmitted
  }

  return (
    <div>
      {' '}
      <CCard
        style={{
          height: widgetLength > 2 && widgetTableData === title ? '270px' : '440px',
          border: 'none',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            padding: '10px 30px 0px',
          }}
        >
          <CRow>
            <CCol xs={7} sm={12} md={7} style={{ display: 'flex', alignItems: 'end' }}>
              <div>
                <Typography
                  style={{
                    fontSize: '13px',
                    color: '#161C24',
                    fontWeight: '600',
                    paddingLeft: '5px',
                  }}
                  className="DB_ts_lable"
                >
                  Submitted Activity
                </Typography>
              </div>
            </CCol>
            <CCol xs={4} sm={6} md={4} style={{ paddingRight: '0px' }}>
              <DatePicker
                variant={'borderless'}
                id="date"
                type="date"
                name="fieldName"
                placeholder="Choose Date"
                style={{
                  overflow: 'hidden',
                  color: '#000000',
                  width: '90%',
                  textOverflow: 'ellipsis',
                  fontSize: '13px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  border: '1px solid #F1F1F1',
                }}
                // className="form-input-draft input-lg date-picker activity-date"
                onChange={handleDateChange}
                suffixIcon={
                  <img
                    src={Calendarimg}
                    alt="Calendarimg"
                    style={{ width: '13px', height: '13px' }}
                  />
                }
                format="DD MMM, YYYY"
                // defaultValue={dayjs()}
                max={today}
                active
                allowClear={false}
                // min={joiningDate}
                onPanelChange={handlePanelChange}
                cellRender={renderDateCell}
                disabledDate={disabledDate}
                disabled={sidebarShow === true}
              />
            </CCol>
            <CCol xs={1} sm={6} md={1} style={{ paddingLeft: '0px' }}>
              <div className="DArrow_icon">
                <Link
                  className={` ${sidebarShow === true ? 'disabled-content' : ''}`}
                  to="/timesheet?tab=3"
                >
                  <NextArrowSVG
                    fill="#AAAAAA"
                    viewBox="0 0 16 10"
                    width="15"
                    height="9"
                    stopColor="none"
                  />
                </Link>
              </div>
            </CCol>
          </CRow>
        </div>

        <CRow>
          <CCol style={{ marginTop: '20px' }}>
            <SubmittedActivityTable
              selectedDate={dateRef.current}
              heightValue={heightRef.current}
            />
          </CCol>
        </CRow>
      </CCard>
    </div>
  )
}
SubmitedActivity.propTypes = {
  widgetLength: PropTypes.number.isRequired,
  widgetTableData: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
export default SubmitedActivity
