import React, { useState, useRef, useEffect } from 'react'
import Chart from 'react-apexcharts'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'

const WorkingHoursbar = ({ data = [], heightValue }) => {
  const chartContainerRef = useRef(null)

  const scrollLeft = () => {
    if (chartContainerRef.current) {
      chartContainerRef.current.scrollLeft -= 100
    }
  }

  const scrollRight = () => {
    if (chartContainerRef.current) {
      chartContainerRef.current.scrollLeft += 100
    }
  }

  const convertHoursToDecimal = (hours) => {
    if (!hours) return 0
    const [h, m] = hours.split(':').map(Number)
    return h + m / 60
  }

  const [options, setOptions] = useState({
    chart: {
      type: 'bar',
      id: 'basic-bar',
      height: heightValue ? '150px' : '204px',
      width: '100%',
      zoom: {
        enabled: true,
      },
    },
    xaxis: {
      categories: [],
      labels: {
        rotate: -45,
      },
      title: {
        text: 'Date', // X-axis name
        style: {
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#8E8E93',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    tooltip: {
      enabled: false,
    },
    yaxis: {
      min: 0,
      max: 9,
      labels: {
        formatter: (value) => {
          const hours = Math.floor(value)
          return `${hours} `
        },
      },
      title: {
        text: 'Hours', // Y-axis name
        style: {
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#8E8E93',
        },
      },
    },
    colors: ['#00AB55B2', '#e90b20'],
    plotOptions: {
      bar: {
        borderRadiusApplication: 'end',
        columnWidth: '80%', // Adjust this value to decrease the space between bars
        colors: {
          backgroundBarOpacity: 0.3,
        },
        horizontal: false,
        borderRadius: 8,
        borderRadiusWhenStacked: 'last', // 'all', 'last'
        dataLabels: {
          // total: {
          //   enabled: true,
          //   style: {
          //     fontSize: '10px',
          //     fontWeight: 600,
          //   },
          //   background: {
          //     enabled: true,
          //     color: '#ff0000', // Change this to your desired background color
          //     opacity: 0.7,
          //   },
          // },
        },
      },
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      position: 'top',
      horizontalAlign: 'left',
      markers: {
        shape: 'circle',
        radius: 6,
        width: '9px',
        height: '9px',
      },
      customLegendItems: ['High', 'Low'],
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => {
        if (val !== 0) {
          const hours = Math.floor(val)
          const minutes = Math.round((val % 1) * 60)
          return `${hours}:${minutes === 0 ? '00' : minutes}`
        } else {
          return ''
        }
      },
      offsetY: 1,
      style: {
        colors: ['#f3f4f5'],
        fontSize: '12px',
        fontWeight: 'bold',
        backgroundColor: ['#0000'],
      },
      background: {
        enabled: false, // Disable background for a cleaner look
      },
    },
    grid: {
      padding: {
        left: 0,
        right: 0,
      },
    },
  })

  const [series, setSeries] = useState([])

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      // xaxis: {
      //   ...prevOptions.xaxis,
      //   categories: data.map((item) => dayjs(item.Date).format('D-MMM')),
      // },
      plotOptions: {
        bar: {
          ...prevOptions.plotOptions.bar,
          columnWidth: data.length === 1 ? '10%' : '40%', // Adjust column width to reduce space between bars
        },
      },
    }))

    setSeries([
      {
        name: 'Total Hours',
        data: data.map((item) => ({
          x: dayjs(item.Date).format('D-MMM'),
          y: convertHoursToDecimal(item.time),
          date: dayjs(item.Date).format('D-MMM'),
          hours: item.time,
          fillColor: item.color,
        })),
      },
    ])
  }, [data])

  const chartWidth = Math.max(600, data.length * 50) // Adjust width based on data length

  return (
    <div>
      <div
        className="MyTimesheetBarChart"
        ref={chartContainerRef}
        style={{
          overflowX: 'scroll',
          // display: 'flex',
          // justifyContent: 'center',
          height: heightValue ? '174px' : '341px',
        }}
      >
        <div className="row">
          <div
            className="mixed-chart"
            style={{
              marginTop: '20px',
              paddingRight: '20px',
              overflowX: 'auto', // Enable horizontal scrolling
              overflowY: 'hidden',
              minWidth: `${chartWidth}px`,
              height: heightValue ? '160px' : '312px',
            }}
          >
            <Chart
              options={options}
              series={series}
              type="bar"
              width={chartWidth}
              height={heightValue ? '150px' : '300px'}
            />
          </div>
        </div>
      </div>
      {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          style={{
            borderRadius: '80%',
            border: 'none',
            backgroundColor: '#d9d9d966',
          }}
          onClick={scrollLeft}
        >
          <IoIosArrowBack width="11px" />
        </button>
        <button
          style={{
            borderRadius: '80%',
            border: 'none',
            backgroundColor: '#d9d9d966',
          }}
          onClick={scrollRight}
        >
          <IoIosArrowForward />
        </button>
      </div> */}
    </div>
  )
}

WorkingHoursbar.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      Date: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ),
  heightValue: PropTypes.bool,
}

export default WorkingHoursbar
