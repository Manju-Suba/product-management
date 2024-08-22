import React, { useEffect, useRef } from 'react'
import { Card, Tabs, Typography } from 'antd'
import { CCard, CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import briefcase from '../../../assets/images/briefcase.png'
import multipersonIcon from '../../../assets/images/MultipersonIcon.png'
import personIcon from '../../../assets/images/personIcon.png'
import groupicon from '../../../assets/images/groupicon.png'
import PieChartIcon from '../DashboardSVG/PiechartSVG'
import BarChartSVG from '../DashboardSVG/BarChartSVG'
import NextArrowSVG from '../DashboardSVG/NextArrowSVG'
import { PieChart } from '@mui/x-charts/PieChart'

const SidebarPieChart = ({ data, total }) => {
  useEffect(() => {}, [data])
  return (
    <CRow style={{ position: 'relative' }}>
      <CCol xs={6} className="sidebar_pie_chart" style={{ position: 'relative' }}>
        <div className="pie">
          <PieChart
            series={[
              {
                innerRadius: 45,
                paddingAngle: 0,
                cornerRadius: 1,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 45, additionalRadius: -1 },
                data: data,
              },
            ]}
            width={224}
            height={200}
          />
        </div>
        <div
          // className="pieChart_text"
          style={{
            position: 'absolute',
            top: '46%',
            left: '54%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 1,
            fontSize: '16px',
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: `<b>${total}</b>`,
            }}
          />
        </div>
      </CCol>
      <CCol xs={6} style={{ display: 'flex', alignItems: 'center' }} className="legend">
        <div className="legend-container">
          {data.map((item, index) => (
            <div key={index + 1} className="legend-item">
              <div className="legend-color_sidebar" style={{ backgroundColor: item.color }} />
              <span
                title={item.label}
                className="legend-label"
                style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.87)', paddingLeft: '10px' }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CCol>
    </CRow>
  )
}

const SideBarChart = ({ title }) => {
  const activeTab = useRef(`tab-active-1`)
  const totalcount = useRef()
  const mapDataRef = useRef([])

  if (title === 'Flows') {
    mapDataRef.current = [
      { key: 'A', value: 5, label: 'Active Flow', color: '#FF2B0E' },
      { key: 'B', value: 1, label: 'InActive Flow', color: '#0B6BCD' },
    ]
    totalcount.current = 6
  } else if (title === 'Overall Members') {
    mapDataRef.current = [
      { key: 'A', value: 220, label: 'Active Members', color: '#FF2B0E' },
      { key: 'B', value: 10, label: 'InActive Members', color: '#0B6BCD' },
    ]
    totalcount.current = 230
  } else if (title === 'Designation Members') {
    mapDataRef.current = [
      { key: 'A', value: 40, label: 'Employee', color: '#33BC77' },
      { key: 'B', value: 20, label: 'Approver', color: '#46A2E1' },
      { key: 'c', value: 10, label: 'Owner', color: '#ED3D57' },
      { key: 'd', value: 5, label: 'Head', color: '#FFA657' },
    ]
    totalcount.current = 75
  } else if (
    title === 'Sumbit Activity Status' ||
    title === "Team Member's Activity" ||
    title === 'Total Products' ||
    title === 'My Product Count' ||
    title === 'Second Level Approval Status'
  ) {
    mapDataRef.current = [
      { key: 'A', value: 40, label: 'Pending', color: '#FFA657' },
      { key: 'B', value: 20, label: 'Approved', color: '#33BC77' },
      { key: 'C', value: 10, label: 'Rejected', color: '#ED3D57' },
    ]
    totalcount.current = 70
  } else if (title === 'Flow Access') {
    mapDataRef.current = [
      { key: 'A', value: 3, label: 'Assigned Flow', color: '#FFA657' },
      { key: 'B', value: 4, label: 'Unassigned Flow', color: '#33BC77' },
    ]
    totalcount.current = 7
  } else if (title === 'My Products') {
    mapDataRef.current = [
      { key: 'A', value: 180, label: 'Assigned Product', color: '#FFA657' },
      { key: 'B', value: 20, label: 'Unassigned Product', color: '#33BC77' },
    ]
    totalcount.current = 200
  } else if (title === 'Team Members') {
    mapDataRef.current = [
      { key: 'A', value: 200, label: 'Members', color: '#FFA657' },
      { key: 'B', value: 30, label: 'Contract Members', color: '#33BC77' },
    ]
    totalcount.current = 230
  } else if (title === 'Product Assigned') {
    mapDataRef.current = [
      { key: 'A', value: 40, label: 'Owner 1', color: '#46A2E1' },
      { key: 'B', value: 25, label: 'Owner 2', color: '#33BC77' },
      { key: 'B', value: 5, label: 'Owner 3', color: '#FFA657' },
    ]
    totalcount.current = 230
  }
  const getTitle = (title, maxLength = 10) => {
    if (title === 'Total Timesheet Entry' || title === "Master's Overview") {
      maxLength = 100
    }
    const titlesMap = {
      'Designation Members': 'Members',
      'My Product Count': 'My Products',
      'Total Timesheet Entry': 'Time Sheet Summary',
      'Sumbit Activity Status': 'Submit Activity Status',
    }
    const modifiedTitle = titlesMap[title] || title
    return modifiedTitle.length > maxLength
      ? `${modifiedTitle.substring(0, maxLength)}...`
      : modifiedTitle
  }

  const getTitleNames = (title) => {
    let modifiedTitle
    if (title === 'Designation Members') {
      modifiedTitle = 'Members'
    } else if (title === 'My Product Count') {
      modifiedTitle = 'My Products'
    } else if (title === 'Sumbit Activity Status') {
      modifiedTitle = 'Submit Activity Status'
    } else {
      modifiedTitle = title
    }
    return modifiedTitle
  }

  const mastersData = [
    {
      icon: multipersonIcon,
      label: 'Members',
      number: 250,
      BGcolor: '#1F65CE0D',
      iconbgcolor: '#1F65CE1A',
    },
    {
      icon: briefcase,
      label: 'Business Category',
      number: 3,
      BGcolor: '#00AB550D',
      iconbgcolor: '#00AB551A',
    },
    {
      icon: personIcon,
      label: 'Designation',
      number: 25,
      BGcolor: '#FFA6570D',
      iconbgcolor: '#FFA6571A',
    },
    {
      icon: groupicon,
      label: 'Task Groups',
      number: 30,
      BGcolor: '#1F65CE0D',
      iconbgcolor: '#E524481A',
    },
  ]

  const items = [
    {
      key: `tab-active-1`,
      label: 'Pie Chart',
      children: <SidebarPieChart data={mapDataRef.current} total={totalcount.current} />,
    },
    {
      key: `tab-active-2`,
      label: 'Bar Chart',
    },
  ]

  const renderContent = (title, mastersData, activeTab, items) => {
    if (title === "Master's Overview") {
      return (
        <CRow>
          {mastersData.map((item, index) => (
            <CCol sm={6} key={index + 1}>
              <Card
                className="inside_card mt-2"
                style={{
                  height: '60px',
                  backgroundColor: item.BGcolor,
                }}
              >
                <CRow>
                  <CCol className="d-flex justify-content-end">
                    <div
                      className="d-flex justify-content-center align-items-center"
                      style={{
                        height: '20px',
                        width: '20px',
                        backgroundColor: item.iconbgcolor,
                        borderRadius: '5px',
                      }}
                    >
                      <img src={item.icon} alt="icon" style={{ width: '10px', height: '10px' }} />
                    </div>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <div
                      style={{ color: '#5F5F5F', fontWeight: 600, fontSize: '7px' }}
                      title={getTitleNames(item.label)}
                    >
                      {getTitle(item.label)}
                    </div>
                    <div style={{ color: '#000000', fontWeight: 700, fontSize: '9px' }}>
                      {item.number}
                    </div>
                  </CCol>
                </CRow>
              </Card>
            </CCol>
          ))}
        </CRow>
      )
    } else {
      return (
        <CRow>
          <CCol className="Dashboard_Tab">
            <Tabs defaultActiveKey={`tab-active--1`} activeKey={activeTab.current} items={items} />
          </CCol>
        </CRow>
      )
    }
  }

  return (
    <div style={{ paddingTop: '5px', padding: '20px', paddingBottom: '0px' }}>
      <CCard
        style={{
          backgroundColor: 'white',
          height: '184px',
          padding: '15px',
          paddingBottom: '0px',
          borderRadius: '10px',
          border: 'none',
        }}
      >
        <CRow>
          <CCol
            xs={7}
            md={title !== 'Total Timesheet Entry' || title !== "Master's Overview" ? 6 : 12}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography className="sideBar_title" title={getTitleNames(title)}>
              {getTitle(title)}
            </Typography>
          </CCol>
          {title !== 'Total Timesheet Entry' && title !== "Master's Overview" ? (
            <CCol xs={5} md={6}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className={`tab border-0 ${
                    activeTab.current === `tab-active-1` ? 'DGroup_icon-s' : 'DGroup_img'
                  }`}
                >
                  <PieChartIcon
                    width="10"
                    height="12"
                    viewBox="0 0 18 18"
                    fill={activeTab.current === `tab-active-1` ? '#F91414' : '#AAAAAA'}
                    stopColor={activeTab.current === `tab-active-1` ? '#F91414' : '#AAAAAA'}
                  />
                </button>
                <button
                  className={`tab ${
                    activeTab.current === `tab-active-2` ? 'DChart_img' : 'DChart_icon-side'
                  }`}
                >
                  <BarChartSVG
                    width="10"
                    height="12"
                    viewBox="0 0 18 18"
                    fill={activeTab.current === `tab-active-2` ? '#FF2D2D' : '#AAAAAA'}
                    stopColor={activeTab.current === `tab-active-2` ? '#FF2D2D' : '#AAAAAA'}
                  />
                </button>
                <div className="DArrow_icon_side">
                  <NextArrowSVG
                    fill="#AAAAAA"
                    viewBox="0 0 18 18"
                    width="11"
                    height="12"
                    stopColor="none"
                  />
                </div>
              </div>
            </CCol>
          ) : (
            title === 'Total Timesheet Entry' && <></>
          )}
        </CRow>
        {title === 'Total Timesheet Entry' ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '10px',
                fontWeight: '600',
              }}
            >
              <Typography style={{ fontSize: '14px' }}>15 Days</Typography>
            </div>
            <div>
              <Typography
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#8E8E93',
                  fontSize: '10px',
                  fontWeight: '600',
                  marginTop: '5px',
                }}
              >
                Total TimeSheet Entry
              </Typography>
            </div>
            <div style={{ height: '92px', overflowY: 'auto' }}>
              <Card
                className="Dashboard_Card"
                style={{
                  backgroundColor: '#ffff',
                  height: '45px',
                  marginTop: '11px',
                  border: '1px solid #F2F2F7',
                  boxShadow: ' 0px 4px 30px 0px #0000000D',
                }}
              >
                <CRow>
                  <CCol>
                    <Typography style={{ color: '#8E8E93', fontSize: '11px', fontWeight: '500' }}>
                      Total Leave
                    </Typography>
                  </CCol>
                  <CCol>
                    <Typography
                      style={{
                        display: 'flex',
                        justifyContent: 'end',
                        color: '#1C1C1E',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      4 days
                    </Typography>
                  </CCol>
                </CRow>
              </Card>
              <Card
                className="Dashboard_Card"
                style={{
                  backgroundColor: '#ffff',
                  height: '45px',
                  marginTop: '10px',
                  border: '1px solid #F2F2F7',
                  boxShadow: ' 0px 4px 30px 0px #0000000D',
                }}
              >
                <CRow>
                  <CCol>
                    <Typography style={{ color: '#8E8E93', fontSize: '11px', fontWeight: '500' }}>
                      Not Entered
                    </Typography>
                  </CCol>
                  <CCol>
                    <Typography
                      style={{
                        display: 'flex',
                        justifyContent: 'end',
                        color: '#1C1C1E',
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      12 days
                    </Typography>
                  </CCol>
                </CRow>
              </Card>
            </div>
          </>
        ) : (
          renderContent(title, mastersData, activeTab, items)
        )}
      </CCard>
    </div>
  )
}

SideBarChart.propTypes = {
  title: PropTypes.string.isRequired,
}

SidebarPieChart.propTypes = {
  data: PropTypes.array.isRequired,
  total: PropTypes.number,
}

// const SideBarChart = ({ title }) => <SideBarChartStyle title={title} />

// SideBarChart.propTypes = {
//   title: PropTypes.string.isRequired,
// }

export default SideBarChart
