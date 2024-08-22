import { CCard, CCol, CRow } from '@coreui/react'
import { DatePicker, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Calendarimg from '../../../assets/images/calendar-image.png'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import LeaveHistoryTable from './LeaveTable'
import { useSelector } from 'react-redux'

const LeaveHistory = ({ widgetLength, widgetTableData, title }) => {
  const dateRef = useRef(null)
  const [date, setDate] = useState(null)
  const heightRef = useRef(false)
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)

  const handleDateChange = (date, dateString) => {
    if (date) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD')
      dateRef.current = formattedDate
      setDate(date)
    } else {
      dateRef.current = null
      setDate(null)
    }
  }

  useEffect(() => {
    if (widgetLength > 2 && widgetTableData === title) {
      heightRef.current = true
    }
  }, [widgetLength, widgetTableData, title])

  return (
    <div>
      <CCard
        style={{
          height: widgetLength > 2 && widgetTableData === title ? '270px' : '440px',
          border: 'none',
          marginBottom: '10px',
        }}
      >
        <div style={{ padding: '30px', paddingTop: '10px', paddingBottom: '10px' }}>
          <CRow>
            <CCol xs={12} md={9} style={{ display: 'flex', alignItems: 'end' }}>
              <Typography
                style={{ fontSize: '13px', color: '#161C24', fontWeight: '600' }}
                className="DB_ts_label"
              >
                Leave History
              </Typography>
            </CCol>
            <CCol
              xs={12}
              md={3}
              style={{
                display: 'flex',
                border: '1px solid #F1F1F1',
                alignItems: 'center',
                borderRadius: '5px',
              }}
            >
              <DatePicker
                variant="borderless"
                placeholder="Choose Date"
                onChange={handleDateChange}
                allowClear
                suffixIcon={
                  <img
                    src={Calendarimg}
                    alt="Calendarimg"
                    style={{ width: '13px', height: '13px' }}
                  />
                }
                disabled={sidebarShow === true}
                format="DD MMM, YYYY"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </CCol>
          </CRow>
        </div>
        <CRow>
          <CCol style={{ marginTop: '1px' }}>
            <LeaveHistoryTable selectedDate={dateRef.current} heightValue={heightRef.current} />
          </CCol>
        </CRow>
      </CCard>
    </div>
  )
}

LeaveHistory.propTypes = {
  widgetLength: PropTypes.number.isRequired,
  widgetTableData: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default LeaveHistory
