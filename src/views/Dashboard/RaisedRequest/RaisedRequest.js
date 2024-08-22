import { CCard, CCol, CRow } from '@coreui/react'
import { DatePicker, Select, Typography } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import Downarrowimg from '../../../assets/images/downarrow.png'
import Calendarimg from '../../../assets/images/calendar-image.png'
import NextArrowSVG from '../DashboardSVG/NextArrowSVG'
import RaisedRequestTable from './RaisedRequestTable'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RaisedRequest = ({ widgetLength, widgetTableData, title }) => {
  const statusRef = useRef(null)
  const dateRef = useRef(null)
  const filterRef = useRef(false)
  const [status, setStatus] = useState(null)
  const [heightValue, setHeightValue] = useState(false)
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)
  const [states, setstates] = useState(null)

  const handleStatusFilter = (value) => {
    setStatus(value)
    if (value === undefined && dateRef.current === null) {
      statusRef.current = null
      filterRef.current = false
    } else if (dateRef.current !== null && value !== undefined) {
      filterRef.current = true
      statusRef.current = value
    } else if (dateRef.current !== null && value === undefined) {
      filterRef.current = true
      statusRef.current = null
    } else {
      filterRef.current = true
      statusRef.current = value
    }
  }

  useEffect(() => {
    if (widgetLength > 2 && widgetTableData === title) {
      setHeightValue(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDateChange = (date, dateString) => {
    if (date !== null) {
      filterRef.current = true
      const parsedDate = dayjs(date, 'DD MMM, YYYY')
      const formattedDate = parsedDate.format('YYYY-MM-DD')
      dateRef.current = formattedDate
      setstates(formattedDate)
    } else if (statusRef.current !== '' && statusRef.current !== null) {
      dateRef.current = null
      filterRef.current = true
      setstates(null)
      alert(2)
    } else {
      filterRef.current = false
      dateRef.current = null
      setstates(null)
      alert(2)
    }
  }

  return (
    <div>
      <CCard
        style={{
          height: widgetLength > 2 && widgetTableData === title ? '270px' : '440px',
          border: 'none',
          marginBottom: '10px',
        }}
      >
        <div style={{ padding: '30px', paddingBottom: '9px', paddingTop: '12px' }}>
          <CRow>
            <CCol xs={12} md={5} lg={6} style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Typography
                  style={{ fontSize: '13px', color: '#161C24', fontWeight: '600' }}
                  className="DB_ts_lable"
                >
                  Raised Request
                </Typography>
              </div>
            </CCol>
            <CCol
              xs={10}
              md={6}
              lg={5}
              style={{
                border: '1px solid #F1F1F1',
                borderRadius: '5px',
                height: '30px',
              }}
            >
              <CRow>
                <CCol xs={7} lg={6} style={{ paddingRight: '0px', paddingLeft: '0px' }}>
                  <DatePicker
                    style={{
                      borderRadius: '0',
                      width: '100%',
                      marginTop: '1px',
                    }}
                    // className=" datepicker_raised mem_selct"
                    onChange={handleDateChange}
                    placeholder="Choose Date"
                    allowClear
                    variant={'borderless'}
                    suffixIcon={
                      <img
                        src={Calendarimg}
                        alt="calendar icon"
                        style={{ width: '12px', height: '12px' }}
                      />
                    }
                    disabledDate={(current) => current && current > dayjs().endOf('day')}
                    format="DD MMM,YYYY"
                    disabled={sidebarShow === true}
                  />
                </CCol>
                <CCol xs={5} lg={6} style={{ paddingRight: '5px', paddingLeft: '0px' }}>
                  <Select
                    suffixIcon={
                      <img
                        src={Downarrowimg}
                        alt="Downarrowimg"
                        style={{ width: '9px', height: '6px' }}
                      />
                    }
                    placeholder="Choose Status"
                    className={`input_lg_select ${
                      statusRef.current === 'Approved'
                        ? 'present-color'
                        : status === 'Rejected'
                        ? 'leave-color'
                        : 'warnings-color'
                    }`}
                    value={statusRef.current}
                    allowClear={true}
                    onChange={handleStatusFilter}
                    disabled={sidebarShow === true}
                  >
                    <Select.Option value="Approved" style={{ color: '#00ab55', fontWeight: '600' }}>
                      Approved
                    </Select.Option>
                    <Select.Option value="Rejected" style={{ color: '#e40e2d', fontWeight: '600' }}>
                      Rejected
                    </Select.Option>
                    <Select.Option value="Pending" style={{ color: '#ffaa00', fontWeight: '600' }}>
                      Pending
                    </Select.Option>
                  </Select>
                </CCol>
              </CRow>
            </CCol>
            <CCol
              xs={1}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end',
                paddingRight: '0px',
                paddingLeft: '3px',
              }}
            >
              <Link
                className={`DArrow_icon ${sidebarShow === true ? 'disabled-content' : ''}`}
                to="/timesheet?tab=4"
              >
                <NextArrowSVG
                  fill="#AAAAAA"
                  viewBox="0 0 16 10"
                  width="15"
                  height="9"
                  stopColor="none"
                />
              </Link>
            </CCol>
          </CRow>
        </div>

        <CRow>
          <CCol style={{ marginTop: '20px' }}>
            <RaisedRequestTable
              selectedStatus={statusRef.current}
              filterType={filterRef.current}
              selectedDate={states}
              heightValue={heightValue}
            />
          </CCol>
        </CRow>
      </CCard>
    </div>
  )
}

RaisedRequest.propTypes = {
  widgetLength: PropTypes.number.isRequired,
  widgetTableData: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default RaisedRequest
