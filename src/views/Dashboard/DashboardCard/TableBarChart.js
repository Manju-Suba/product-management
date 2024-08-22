import { Card, Typography } from 'antd'
import React, { useRef, useState } from 'react'
import Chart from 'react-apexcharts'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import PropTypes from 'prop-types'

const TableBarChart = ({ title }) => {
  const chartRef = useRef(null)

  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: 'basic-bar',
      width: '50%',
      height: '200px',
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ['1', '2', '3', '4', '5', '6'],
      labels: {
        style: {
          fontSize: '12px',
        },
      },
      title: {
        text: 'Date', // X-axis name
        style: {
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#8E8E93',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 12,
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
    colors: ['#00AB55B2'],
    plotOptions: {
      bar: {
        borderRadius: 5,
        borderRadiusApplication: 'end',
        columnWidth: '20%', // Adjust this value to decrease the space between bars
        colors: {
          backgroundBarOpacity: 0.3,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
      shared: false, // if you want tooltip to be shared across all series
      x: {
        show: false,
      },
      y: {
        formatter: function (value) {
          // Your custom formatter for y-axis tooltip
          return value + ' hours'
        },
      },
    },
  })

  const [series, setSeries] = useState([
    {
      name: 'series-1',
      data: [3, 4, 6, 2, 10, 5],
    },
  ])

  const scrollLeft = () => {
    if (chartRef.current) {
      chartRef.current.scrollLeft -= 100
    }
  }

  const scrollRight = () => {
    if (chartRef.current) {
      chartRef.current.scrollLeft += 100
    }
  }

  return (
    <div>
      <Card
        className="sidebar_timesheet_c mt-3"
        style={{ marginLeft: '19px', height: '184px', marginRight: '19px' }}
      >
        <div>
          <Typography
            style={{
              color: 'rgb(76, 76, 76)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'default',
            }}
          >
            {title}
          </Typography>
        </div>
        <div className="row" ref={chartRef} style={{ width: '160px', overflowX: 'scroll' }}>
          <div style={{ width: '1200px', transform: 'translate(-15px, -16px)' }}>
            <Chart options={chartOptions} series={series} type="bar" width="1200" height="100%" />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',

            alignItems: 'center',
            marginBottom: '10px',
            transform: 'translate(-3px, -28px)',
          }}
        >
          <button
            style={{
              width: '20px',
              height: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#d9d9d966',
            }}
            onClick={scrollLeft}
          >
            <IoIosArrowBack size="20px" />
          </button>
          <button
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',

              justifyContent: 'center',
              alignItems: 'center',
              border: 'none',
              backgroundColor: '#d9d9d966',
            }}
            onClick={scrollRight}
          >
            <IoIosArrowForward size="20px" />
          </button>
        </div>
      </Card>
    </div>
  )
}
TableBarChart.propTypes = {
  title: PropTypes.string.isRequired,
}
export default TableBarChart
