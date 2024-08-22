import React from 'react'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import PropTypes from 'prop-types'

const DashboardBarChart = ({ chartData, title }) => {
  const generateChartData = () => {
    let productKeys
    if (title === 'Product Assigned') {
      productKeys = Object.keys(chartData).filter((key) => !key.includes('total'))
    }
    switch (title) {
      case 'Flows':
      case 'Overall Members':
        return {
          values: [chartData.activeCount, chartData.inactiveCount],
          labels:
            title === 'Flows'
              ? ['Active Work Flow', 'Inactive Work Flow']
              : ['Active Members', 'Inactive Members'],
          color: ['#FF2B0E', '#0B6BCD'],
        }
      case 'Designation Members':
        return {
          values: [
            chartData.employeeCount,
            chartData.approverCount,
            chartData.ownerCount,
            chartData.headCount,
          ],
          labels: ['Employee', 'Approver', 'Owner', 'Head'],
          color: ['#33BC77', '#46A2E1', '#ED3D57', '#FFA657'],
        }
      case 'Product Assigned':
        return {
          values: productKeys.map((key) => chartData[key]),
          labels: productKeys,
          color: ['#46A2E1', '#33BC77', '#FFA657', '#ED3D57'],
        }
      case "Team Member's Activity":
      case 'Second Level Approval Status':
      case 'Sumbit Activity Status':
      case 'Total Products':
      case 'My Product Count':
        return {
          values: [chartData.pendingCount, chartData.approvedCount, chartData.rejectedCount],
          labels: ['Pending ', 'Approved ', 'Rejected '],
          color: ['#FFA657', '#33BC77', '#ED3D57'],
        }
      case 'My Products':
        return {
          values: [chartData.assignedCount, chartData.unassignedCount],
          labels: ['Assigned Product', 'Unassigned Product'],
          color: ['#FFA657', '#33BC77'],
        }
      case 'Team Members':
        return {
          values: [chartData.onroleMemberCount, chartData.contractMemberCount],
          labels: ['Members', 'Contract Members'],
          color: ['#FFA657', '#33BC77'],
        }
      case 'Flow Access':
        return {
          values: [chartData.assignedCount, chartData.unassignedCount],
          labels: ['Assigned Flow', 'Unassigned Flow'],
          color: ['#FFA657', '#33BC77'],
        }
      default:
        return { values: [], labels: [], color: [] }
    }
  }

  const { values, labels, color } = generateChartData()

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: color,
      },
    ],
  }

  const options = {
    indexAxis: 'y',
    plugins: {
      tooltip: {
        enabled: true, // Disable tooltips
      },
      legend: {
        display: false, // Disable legend
      },
    },
    responsive: true,
    scales: {
      y: {
        barPercentage: 0.75,
        grid: {
          display: false,
          drawTicks: true,
          drawOnChartArea: false,
        },
        ticks: {
          fontColor: '#555759',
          fontFamily: 'Lato',
          fontSize: 11,
        },
      },
      x: {
        grid: {
          display: false,
          drawTicks: false,
          tickMarkLength: 5,
          drawBorder: false,
        },
        ticks: {
          padding: 5,
          beginAtZero: true,
          fontColor: '#555759',
          fontFamily: 'Lato',
          fontSize: 11,
          callback: function (label) {
            return label * 1
          },
        },
        scaleLabel: {
          display: true,
          padding: 10,
          fontFamily: 'Lato',
          fontColor: '#555759',
          fontSize: 16,
          fontStyle: 'bold',
          labelString: 'Scale Label',
        },
      },
    },
  }

  return (
    <div>
      <Bar data={data} options={options} className="barchart-container" />
    </div>
  )
}

DashboardBarChart.propTypes = {
  chartData: PropTypes.any,
  title: PropTypes.string,
}

export default DashboardBarChart
