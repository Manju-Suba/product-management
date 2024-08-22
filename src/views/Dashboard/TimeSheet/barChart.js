import React, { useState, useRef, useEffect } from 'react'
import Chart from 'react-apexcharts'
import PropTypes from 'prop-types'

const MyTimesheetBarChart = ({ data = [], heightValue }) => {
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
    const [h, m] = hours.split(':').map(Number)
    return h + m / 60
  }
  // 320
  const [options, setOptions] = useState({
    chart: {
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
        text: 'Tasks', // X-axis name
        style: {
          fontSize: '10px',
          fontWeight: 'bold',
          color: '#8E8E93',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 9,
      labels: {
        formatter: (value) => {
          const hours = Math.floor(value)
          const minutes = Math.round((value % 1) * 60)
          return `${hours}:${minutes === 0 ? '00' : minutes}`
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
        columnWidth: '80%',
        colors: {
          backgroundBarOpacity: 0.3,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex]
        return `<div style="padding: 10px;">
          <div style="font-weight: bold; color: #00AB55B2; box-shadow: 1px 2px 2px -2px gray; padding-bottom: 5px;">Details</div><br/>
          <table style="width: 100%; border-spacing: 0 10px;">
              <tr>
                  <td style="font-weight: bold;">Product</td>
                  <td>: ${data.product}</td>
              </tr>
              <tr>
                  <td style="font-weight: bold;">Task</td>
                  <td>: ${data.task}</td>
              </tr>
              <tr>
                  <td style="font-weight: bold;">Hours</td>
                  <td>: ${data.hours}</td>
              </tr>
              <tr>
                  <td style="font-weight: bold;">Description</td>
                  <td>: ${data.description}</td>
              </tr>
          </table>
        </div>`
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

  const getDescription = (value, maxLength = 20) => {
    const modifiedTitle = value
    return modifiedTitle.length > maxLength
      ? `${modifiedTitle.substring(0, maxLength)}...`
      : modifiedTitle
  }

  const getTask = (value, maxLength = 10) => {
    const modifiedTitle = value
    return modifiedTitle.length > maxLength
      ? `${modifiedTitle.substring(0, maxLength)}...`
      : modifiedTitle
  }

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: data?.map((item) => getTask(item.task)),
      },
      plotOptions: {
        bar: {
          ...prevOptions.plotOptions.bar,
          columnWidth: data?.length === 1 ? '10%' : '40%', // Adjust column width based on data length
        },
      },
    }))
    setSeries([
      {
        name: 'Completed',
        data: data?.map((item) => ({
          x: getTask(item.task),
          y: convertHoursToDecimal(item.hours),
          product: item.product,
          task: getTask(item.task),
          hours: item.hours,
          description: getDescription(item.description),
        })),
      },
    ])
  }, [data])

  const chartWidth = Math.max(600, data?.length * 50)

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
              // width={chartWidth}
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
            // padding: '5px',
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
            // padding: '5px',
          }}
          onClick={scrollRight}
        >
          <IoIosArrowForward />
        </button>
      </div> */}
    </div>
  )
}

MyTimesheetBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      product: PropTypes.string.isRequired,
      hours: PropTypes.string.isRequired,
      task: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ),
  heightValue: PropTypes.bool,
}

export default MyTimesheetBarChart
