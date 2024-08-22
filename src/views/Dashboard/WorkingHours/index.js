import React, { useEffect, useRef, useState } from 'react'
import { DatePicker, Typography } from 'antd'
import { CCard, CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import 'react-toastify/dist/ReactToastify.css'
import WorkingHoursbar from './barChart'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getMyWorkingHours } from 'src/redux/Dashboard/action'

dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)

const WorkingHours = ({ widgetLength, widgetTableData, title }) => {
  const [heightValue, setHeightValue] = useState(false)
  const startWeek = useRef(null)
  const endWeek = useRef(null)
  const weekFormat = 'MM/DD'
  const dataRef = useRef([])
  const dispatch = useDispatch()
  const weeklyTimesheetHours = useSelector((state) => state.dashboard?.weeklyTimesheetHours)
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)
  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
      .endOf('week')
      .format(weekFormat)}`

  useEffect(() => {
    if (widgetLength > 2 && widgetTableData === title) {
      setHeightValue(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleWeek = (date, dateString) => {
    if (date) {
      const startOfWeek = date.startOf('isoWeek').format('YYYY-MM-DD')
      const endOfWeek = date.endOf('isoWeek').format('YYYY-MM-DD')
      startWeek.current = startOfWeek
      endWeek.current = endOfWeek
      dispatch(getMyWorkingHours(startOfWeek, endOfWeek))
    }
  }

  useEffect(() => {
    const startOfWeek = dayjs().startOf('isoWeek').format('YYYY-MM-DD')
    const endOfWeek = dayjs().endOf('isoWeek').format('YYYY-MM-DD')
    startWeek.current = startOfWeek
    endWeek.current = endOfWeek
    if (!weeklyTimesheetHours || weeklyTimesheetHours.length === 0) {
      dispatch(getMyWorkingHours(startOfWeek, endOfWeek))
    } else {
      dataRef.current = weeklyTimesheetHours
    }
  }, [dispatch, weeklyTimesheetHours])

  return (
    <div>
      <CCard
        style={{
          height: widgetLength > 2 && widgetTableData === title ? '270px' : '440px',
          border: 'none',
          marginBottom: '10px',
          padding: '15px',
          paddingTop: '24px',
          paddingLeft: '15px',
        }}
      >
        <CRow>
          <CCol xs={12} md={7} style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Typography
                style={{ fontSize: '14px', color: '#161C24', fontWeight: '600' }}
                className="dB_timesheet_lable"
              >
                Working Hours
              </Typography>
            </div>
          </CCol>
          <CCol xs={12} md={5} style={{ display: 'flex', justifyContent: 'end' }}>
            <DatePicker
              defaultValue={dayjs()}
              format={customWeekStartEndFormat}
              onChange={handleWeek}
              picker="week"
              allowClear={false}
              style={{ width: '58%' }}
              disabled={sidebarShow === true}
              disabledDate={(current) => current && current > dayjs().endOf('week')}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol className="Dashboard_Tab">
            {/* Uncomment and use if needed */}
            <WorkingHoursbar data={weeklyTimesheetHours} heightValue={heightValue} />
          </CCol>
        </CRow>
      </CCard>
    </div>
  )
}

WorkingHours.propTypes = {
  title: PropTypes.string.isRequired,
  widgetLength: PropTypes.number.isRequired,
  widgetTableData: PropTypes.array.isRequired,
}

export default WorkingHours
