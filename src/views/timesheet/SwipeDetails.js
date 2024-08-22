import React, { useState, useRef, useEffect } from 'react'
import { DatePicker, Breadcrumb, Select } from 'antd'
import { CCol, CRow, CSpinner } from '@coreui/react'
import { getHeaders } from 'src/constant/Global'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import useAxios from 'src/constant/UseAxios'
import dayjs from 'dayjs'
import Downarrowimg from '../../assets/images/downarrow.png'
import Calendarimg from '../../assets/images/calendar.svg'
import Chart from 'react-apexcharts'
import arrow from '../../assets/images/arrows.png'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
const { MonthPicker } = DatePicker
const parseThreshold = (threshold) => {
  if (typeof threshold === 'string') {
    if (threshold.includes(':')) {
      const [hours, minutes] = threshold.split(':')
      return parseInt(hours) + parseInt(minutes) / 60
    } else {
      return parseInt(threshold)
    }
  }
  return threshold
}

const processData = (item, threshold) => {
  if (item.attendance !== null && item.attendance !== 'Leave' && item.attendance !== 'leave') {
    const attendance = item.attendance
    const baseObject = {
      x: item.date,
      fillColor: '',
      name: attendance.username,
      date: dayjs(item.date).format('DD-MM-YYYY'),
      employeeID: attendance.employeeID,
      signIn: attendance.signIn,
      signOut: attendance.signOut,
      totalWorkHours: attendance.totalWorkHours,
      actualWorkHours: attendance.acutalWorkHours,
      shortfallHours: attendance.shortfallHours,
      excessHours: attendance.excessHours,
      timesheetEnteredHours: attendance.timesheetHours,
      borderRadius: 5,
    }

    let actualWorkHrs
    const [hours, minutes] = attendance.acutalWorkHours.split(':')
    actualWorkHrs = parseInt(hours) + parseInt(minutes) / 60

    const parsedThreshold = parseThreshold(threshold)
    // const excessHours = actualWorkHrs > parsedThreshold ? actualWorkHrs - parsedThreshold : 0
    const baseHours = actualWorkHrs > parsedThreshold ? parsedThreshold : actualWorkHrs

    baseObject.y = baseHours

    if (attendance.shortfallHours !== '00:00') {
      baseObject.fillColor = '#ff4c4c'
    } else if (attendance.regularizationStatus === true) {
      baseObject.fillColor = '#FFA657'
    } else {
      baseObject.fillColor = '#357AF6'
    }

    return baseObject
  } else if (item.attendance === 'Leave' || item.attendance === 'leave') {
    return {
      x: item.date,
      y: 12,
      columnWidth: '25%',
      fillColor: '#FF7D90',
    }
  } else {
    return {
      x: item.date,
      y: 12,
      columnWidth: '25%',
      fillColor: '#e1e1e1',
    }
  }
}

const excessData = (item, threshold) => {
  if (item.attendance !== null && item.attendance !== 'Leave' && item.attendance !== 'leave') {
    const attendance = item.attendance

    const baseObject = {
      x: item.date,
      fillColor: '',
      name: attendance.username,
      date: dayjs(item.date).format('DD-MM-YYYY'),
      employeeID: attendance.employeeID,
      signIn: attendance.signIn,
      signOut: attendance.signOut,
      totalWorkHours: attendance.totalWorkHours,
      actualWorkHours: attendance.acutalWorkHours,
      shortfallHours: attendance.shortfallHours,
      excessHours: attendance.excessHours,
      timesheetEnteredHours: attendance.timesheetHours,
    }

    let actualWorkHrs
    let shortfallhrs
    let totalhrs
    const [hours, minutes] = attendance.acutalWorkHours.split(':')
    actualWorkHrs = parseInt(hours) + parseInt(minutes) / 60

    // const [hoursts, minutests] = 9
    totalhrs = parseInt(9) + parseInt(0) / 60

    const [hours1, minutes1] = attendance.shortfallHours.split(':')
    shortfallhrs = parseInt(hours1) + parseInt(minutes1) / 60

    const parsedThreshold = parseThreshold(threshold)
    const excessHours = actualWorkHrs > parsedThreshold ? actualWorkHrs - parsedThreshold : 0

    if (shortfallhrs !== 0) {
      baseObject.actualWorkHours = attendance.acutalWorkHours
      const shortfallReduced = totalhrs - actualWorkHrs
      const excessObject = {
        ...baseObject,
        y: shortfallReduced,
        fillColor: '#e1e1e1',
      }
      return excessObject
    } else if (excessHours > 0) {
      baseObject.actualWorkHours = attendance.acutalWorkHours
      const excessObject = {
        ...baseObject,
        y: excessHours,
        fillColor: '#1E3A8A',
      }
      return excessObject
    } else {
      return {
        x: item.date,
        y: null,
      }
    }
  } else {
    return {
      x: item.date,
      y: null,
    }
  }
}

const SwipeDetails = ({ formatDate }) => {
  let api = useAxios()
  const dateRef = useRef()
  const shortfall = useRef(false)
  const excess = useRef(false)
  const page = useRef(0)
  const size = useRef(10)
  const monthRef = useRef(dayjs().format('MM'))
  const yearRef = useRef(dayjs().format('YYYY'))
  const [selectedMonth, setSelectedMonth] = useState(dayjs())
  const [selectedDate, setSelectedDate] = useState(null)
  const [data, setData] = useState([])
  const [chartSeries, setChartSeries] = useState([])
  const [loader, setLoader] = useState(true)
  const hasMore = useRef(true)
  // const user = getDecodeData()
  // const company = user?.company
  // const navigate = useNavigate()
  const [threshold, setThreshold] = useState('9')

  useEffect(() => {
    getSwipeDetails(selectedDate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getSwipeDetails = async (date) => {
    let url
    if (date !== null) {
      url = `userbased?month=${monthRef.current}&year=${yearRef.current}&checkShortfallHours=${shortfall.current}&excesshours=${excess.current}&size=${size.current}&page=${page.current}&date=${date}`
    } else {
      url = `userbased?month=${monthRef.current}&year=${yearRef.current}&checkShortfallHours=${shortfall.current}&excesshours=${excess.current}&size=${size.current}&page=${page.current}`
    }
    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
      })
      const data = response.data.data
      setData(data.data)

      if (data.data.length < size.current) {
        hasMore.current = false
      } else if (page.current === data.totalPages - 1) {
        hasMore.current = false
      }
      setLoader(false)
    } catch (error) {}
  }

  const handleDateChange = (date, dateString) => {
    setLoader(true)
    hasMore.current = true
    page.current = 0
    if (date !== null) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD')
      dateRef.current = formattedDate
      monthRef.current = dayjs(date).format('MM')
      yearRef.current = dayjs(date).format('YYYY')
      getSwipeDetails(formattedDate)
      setSelectedMonth(dayjs(date))
      setSelectedDate(formattedDate) // Store the selected date
    } else {
      setSelectedDate(null)
      getSwipeDetails(null)
    }
  }
  const [options, setOptions] = useState({})
  useEffect(() => {
    setOptions({
      chart: {
        type: 'bar',
        height: 350,
        width: 300,
        toolbar: {
          show: false,
        },
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '25%',
          barGap: '50%',
          // endingShape: 'flat',
          // borderRadius: 8,
          // borderRadiusWhenStacked: 'all',
          // borderRadiusApplication: 'end',
          dataLabels: {
            position: 'top',
          },
          // rangeBarOverlap: true,
          width: '20%',
        },
      },
      states: {
        hover: {
          filter: {
            type: 'none',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        position: 'top',
        horizontalAlign: 'right',
        markers: {
          shape: 'circle',
          radius: 6,
          width: '9px',
          height: '9px',
        },
        customLegendItems: [
          'Shortfall',
          'Leave',
          'Actual Work Hours',
          'TimeSheet Entered',
          'Regularization',
        ],
        onItemClick: {
          toggleDataSeries: true,
        },
        onItemHover: {
          highlightDataSeries: true,
        },
      },
      colors: ['#ff4c4c', '#FF7D90', '#357AF6', '#5CC8BE', '#FFA657'],
      stroke: {
        show: true,
        width: 1,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [],
        style: {
          width: '50px',
          color: '#5C5C5C',
          fontWeight: 600,
          fontSize: '13px',
        },
        title: {
          text: 'Date & Day',
          style: {
            color: '#6D6D6D',
            fontWeight: 600,
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        min: 0,
        max: 12,
        title: {
          text: 'Hours',
          style: {
            color: '#6D6D6D',
            fontWeight: 600,
            fontSize: '12px',
          },
        },
        // tickAmount: 6, // Adjust according to your needs
        forceNiceScale: true,
        labels: {
          formatter: function (value) {
            return value === 9 ? '9 hrs' : value
          },
        },
      },
      annotations: {
        yaxis: [
          {
            x: 0,
            y: 9,
            borderColor: '#9b9191',
            strokeDashArray: 5, // Dotted line
            yAxisIndex: 0,
            label: {
              text: threshold === '9' ? '9 Hrs' : '8:30 hrs',
              offsetX: -30, // Set a reasonable offset
              offsetY: 8, // Align label vertically with the line
              style: {
                color: '#9b9191',
                background: '#e0e0e0',
              },
              textAnchor: 'start',
              position: 'left',
            },
          },
        ],
      },
      fill: {
        colors: ['#4CAF50', '#FF7D90', '#FFC107', '#F44336'], // Example colors
      },
      tooltip: {
        style: {
          background: 'none',
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex]
          if (
            !data ||
            data.signIn === undefined ||
            data.signOut === undefined ||
            data.shortfallHours === undefined ||
            data.excessHours === undefined
          ) {
            return ''
          } else {
            return `<div style="width: 275px;">
          <div style="font-weight: bold; color: #505050; box-shadow: 0px 4.41px 48.5px 0px #0000001A; padding: 10px;height:45px;background:#FFFFFF">${data.name} <span style="font-size:11px;color:#A7A7A7;margin-left:5px">${data.date}</span></div><br/>
          <div style="padding-left:15px">
          <div class="row">
          <div class="col-sm-6">
          <span style="font-size:11px;color:#505050;">Swipe in</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;color:#909090;padding-left:5px;padding-top:5px;">${data.signIn}</span></div></br>
          </div>
          <div class="col-sm-6"><span style="font-size:11px;color:#505050;">Swipe out</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.signOut}</span></div></br>
          </div>
          </div>
          <div class="row">
          <div class="col-sm-6">
          <span style="font-size:11px;color:#505050;">Total Work Hrs</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.totalWorkHours}</span></div></br>
          </div>
          <div class="col-sm-6"><span style="font-size:11px;color:#505050;">Actual Work Hrs</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.actualWorkHours}</span></div></br>
          </div>
          </div>
          <div class="row">
          <div class="col-sm-6">
          <span style="font-size:11px;color:#505050;">Shortfall Hrs</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.shortfallHours}</span></div></br>
          </div>
          <div class="col-sm-6"><span style="font-size:11px;color:#505050;">Excess Hrs</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.excessHours}</span></div></br>
          </div>
          </div>
          <div class="row">
          <div class="col-sm-6">
          <span style="font-size:11px;color:#505050;">Timesheet Entered Hrs</span></br>
          <div style="height: 25px;width: 100px;background: #F4F4F4;"><span style="font-size:15px;padding-left:5px;padding-top:5px;color:#909090;">${data.timesheetEnteredHours}</span></div></br>
          </div>
          </div>
          </div>
          </div>`
          }
        },
      },
    })
  }, [threshold])

  useEffect(() => {
    const categories = data?.map((item) => {
      const date = dayjs(item.date)
      const dayOfWeek = date.format('ddd')
      const formattedDate = date.format('D MMM')
      return { formattedDate, dayOfWeek }
    })

    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: categories.map((c) => `${c.formattedDate}\n${c.dayOfWeek}`),
        labels: {
          style: {
            colors: [], // Optionally customize the color of the labels
            fontSize: '12px', // Customize the font size
          },
        },
      },
      plotOptions: {
        bar: {
          ...prevOptions.plotOptions.bar,
          columnWidth:
            data?.length === 1
              ? '2.95%'
              : data?.length === 2
              ? '5%'
              : data?.length === 3
              ? '7%'
              : data?.length === 4
              ? '9%'
              : data?.length === 5
              ? '11%'
              : data?.length === 6
              ? '13%'
              : data?.length === 7
              ? '15%'
              : data?.length === 8
              ? '17%'
              : data?.length === 9
              ? '19%'
              : '25%',
          barGap: '10%', // Adjust the gap between bars
          horizontal: false,
          endingShape: 'rounded',
          // borderRadiusWhenStacked: 'end',
          borderRadiusApplication: 'end',
          // borderRadius: 3, // Default border radius

          // Dynamic border radius adjustment
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          const { seriesIndex, dataPointIndex, w } = opts
          const dataPoint = w.config.series[seriesIndex].data[dataPointIndex]

          // Determine which value to display based on series name
          if (seriesIndex === 0) {
            if (dataPoint.actualWorkHours) {
              const formattedWorkHours = dataPoint.actualWorkHours.replace(/^0/, '')

              if (formattedWorkHours <= '9:15') {
                return formattedWorkHours || '' // For the 'Shortfall/Actual Work Hours' series
              }
            }
            // if (dataPoint.actualWorkHours <= '09:15') {
            //   return dataPoint.actualWorkHours || '' // For the 'Shortfall/Actual Work Hours' series
            // }
          } else if (seriesIndex === 2) {
            if (dataPoint.actualWorkHours === 'undefined') {
              return ''
            } else if (dataPoint.actualWorkHours > '09:15') {
              const formattedWorkHours = dataPoint.actualWorkHours.replace(/^0/, '')
              return formattedWorkHours // For the 'Shortfall/Actual Work Hours' series
            }
          } else if (seriesIndex === 1) {
            const timesheetHours = dataPoint.timesheetEnteredHours
            const time = timesheetHours ? String(timesheetHours).replace(' Hrs', '') : '' // For the 'Timesheet Entered' series
            const formattedWorkHours = time.replace(/^0/, '')
            return formattedWorkHours // For the 'Shortfall/Actual Work Hours' series
          } else {
            return '' // Default case, should not occur
          }
        },
        offsetY: -20, // Adjust the position above the bar
        offsetX: 2,
        style: {
          fontSize: '8px',
          colors: ['#304758'],
        },
      },
    }))
    setChartSeries([
      {
        name: 'Shortfall/Actual Work Hours',
        data: data?.map((item) => {
          const processedItem = processData(item, threshold)
          return {
            ...processedItem,
            borderRadius: processedItem.actualWorkHours <= '09:00' ? 0 : 8,
          }
        }),
        group: 'A',
      },
      {
        name: 'Timesheet Entered',
        data: data?.map((item) => {
          if (
            item.attendance !== null &&
            item.attendance !== 'Leave' &&
            item.attendance !== 'leave'
          ) {
            const attendance = item.attendance
            let timesheetHours = null
            if (attendance?.timesheetHours !== '00:00 Hrs') {
              const [hours, minutes] = attendance.timesheetHours.split(':')
              timesheetHours = parseInt(hours) + parseInt(minutes) / 60
            }
            return {
              x: item.date,
              y: timesheetHours,
              fillColor: '#5CC8BE',
              name: attendance?.username,
              date: dayjs(item.date).format('DD-MM-YYYY'),
              employeeID: attendance?.employeeID,
              signIn: attendance?.signIn,
              signOut: attendance?.signOut,
              totalWorkHours: attendance?.totalWorkHours,
              actualWorkHours: attendance?.acutalWorkHours,
              shortfallHours: attendance?.shortfallHours,
              excessHours: attendance?.excessHours,
              timesheetEnteredHours: attendance?.timesheetHours,
              borderRadius: 8,
            }
          } else {
            return {
              x: item.date,
              y: null,
              borderRadius: 0, // Default for leave
            }
          }
        }),
        group: 'B',
      },
      {
        name: 'Excess',
        data: data?.map((item) => {
          const excessItem = excessData(item, threshold)
          return {
            ...excessItem,
            borderRadius:
              excessItem.actualWorkHours === undefined || excessItem.actualWorkHours > '09:00'
                ? 8
                : 0,
          }
        }),
        group: 'A',
      },
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const scrollRight = () => {
    page.current = page.current + 1
    hasMore.current = true
    setLoader(true)
    getSwipeDetails(selectedDate)
  }

  const scrollLeft = () => {
    page.current = page.current - 1
    hasMore.current = true
    setLoader(true)
    getSwipeDetails(selectedDate)
  }

  return (
    <>
      <CRow className="mt-3">
        <CCol xs={12} sm={6} md={8}>
          <h6 className="timesheet-heading mt-4" style={{ marginLeft: '30px' }}>
            Swipe Details for{' '}
            <MonthPicker
              style={{ width: '10%' }}
              variant="borderless"
              defaultValue={dayjs()}
              value={selectedMonth}
              format="MMM"
              allowClear={false}
              disabled={loader}
              className="swipe-month"
              minDate={dayjs('2024-06-01')}
              maxDate={dayjs()}
              suffixIcon={<img src={arrow} alt="Calendarimg" />}
              onChange={(value) => {
                page.current = 0
                hasMore.current = true
                monthRef.current = value.format('MM')
                yearRef.current = value.format('YYYY')
                setSelectedMonth(value)
                setLoader(true)
                getSwipeDetails(selectedDate)
              }}
            />
          </h6>
          <Breadcrumb
            style={{ marginLeft: '30px' }}
            className="bread-tab"
            separator={<span className="breadcrumb-separator">|</span>}
            items={[
              {
                title: (
                  <span
                    className="text-secondary text-decoration-none"
                    style={{ cursor: 'default' }}
                  >
                    Dashboard
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Swipe Details
                  </span>
                ),
              },
            ]}
          />
        </CCol>
        <CCol xs={6} sm={3} md={2}>
          <DatePicker
            id="date"
            type="date"
            name="fieldName"
            className="form-input-draft input-lg date-picker swipe-date  raised_selectbox"
            onChange={handleDateChange}
            placeholder="Choose Date"
            allowClear={true}
            disabled={loader}
            maxDate={dayjs()}
            minDate={dayjs('2024-06-01')}
            variant={'borderless'}
            suffixIcon={
              <img src={Calendarimg} alt="Calendarimg" style={{ width: '13px', height: '13px' }} />
            }
            format="DD-MM-YYYY"
          />
        </CCol>
        <CCol sm={6} md={2}>
          <Select
            suffixIcon={
              <img src={Downarrowimg} alt="Downarrowimg" style={{ width: '10px', height: '6px' }} />
            }
            allowClear
            className="form-input-draft input-lg swipe-select  raised_selectbox"
            style={{ borderBottom: '1px solid #ced4da', width: '100px' }}
            placeholder="Choose: Shortfall or Excess"
            options={[
              {
                value: 'Shortfall',
                label: 'Shortfall',
              },
              {
                value: 'Excess',
                label: 'Excess',
              },
            ]}
            disabled={loader}
            onChange={(value) => {
              if (value !== undefined && value === 'Shortfall') {
                shortfall.current = true
                excess.current = false
              } else if (value !== undefined && value === 'Excess') {
                excess.current = true
                shortfall.current = false
              } else {
                excess.current = false
                shortfall.current = false
              }
              page.current = 0
              hasMore.current = true
              setLoader(true)
              getSwipeDetails(selectedDate)
            }}
          />
        </CCol>
      </CRow>
      <CRow className="mt-1">
        {!loader && (
          <div>
            {data.length !== 0 ? (
              <>
                <div style={{ marginLeft: '6px' }}>
                  <Chart type="bar" options={options} series={chartSeries} height={450} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: `${page.current === 0 ? 'end' : 'space-between'}`,
                    alignItems: 'center',
                  }}
                >
                  {page.current !== 0 && (
                    <button
                      style={{
                        borderRadius: '80%',
                        border: 'none',
                        backgroundColor: '#FFFFFF',
                        boxShadow: ' 0px 4px 10px 0px #0000001A',
                        marginLeft: '55px',
                      }}
                      disabled={page.current === 0}
                      onClick={scrollLeft}
                    >
                      <IoIosArrowBack width="11px" />
                    </button>
                  )}
                  {hasMore.current !== false && (
                    <button
                      style={{
                        borderRadius: '80%',
                        border: 'none',
                        backgroundColor: '#FFFFFF',
                        boxShadow: ' 0px 4px 10px 0px #0000001A',
                        marginRight: '37px',
                      }}
                      disabled={hasMore.current === false}
                      onClick={scrollRight}
                    >
                      <IoIosArrowForward />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
                <b style={{ color: '#e40e2d', fontSize: '14px' }}>No data found</b>
              </div>
            )}
          </div>
        )}
        {loader && (
          <div className="text-c text-center my-3 td-text">
            <CSpinner color="danger" />
          </div>
        )}
      </CRow>
    </>
  )
}

SwipeDetails.propTypes = {
  formatDate: PropTypes.func,
}

export default SwipeDetails
