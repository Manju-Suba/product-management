import React, { useEffect, useRef, useState } from 'react'
import { Card, DatePicker, Tabs, Typography } from 'antd'
import { CCard, CCol, CRow } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import briefcase from '../../../assets/images/briefcase.png'
import multipersonIcon from '../../../assets/images/MultipersonIcon.png'
import personIcon from '../../../assets/images/personIcon.png'
import groupicon from '../../../assets/images/groupicon.png'
import DashboardPieChart from './DashboardPieChart'
import DashboardBarChart from './DashboardBarChart'
import PieChartIcon from '../DashboardSVG/PiechartSVG'
import BarChartSVG from '../DashboardSVG/BarChartSVG'
import NextArrowSVG from '../DashboardSVG/NextArrowSVG'
import {
  getFlowAccess,
  getFlowsCount,
  getMastersCount,
  getMembersActivityBySup,
  getMembersActivityBySupAndSecLvl,
  getMembersAll,
  getMembersByDesignation,
  getMyActivityCount,
  getProductAssigned,
  getProductAssignedByOwner,
  getProductByHead,
  getProductCountByApprover,
  getTeamMemberCount,
  getTimesheetSummary,
} from 'src/redux/Dashboard/action'
import { useNavigate } from 'react-router-dom'

const { MonthPicker } = DatePicker

const DashboardCardStyle = ({ index, title, widgetLength }) => {
  const length = widgetLength
  const [activeTab, setActiveTab] = useState(`tab-active-${index}-1`)
  const dispatch = useDispatch()
  const chartData = useRef({})
  const monthRef = useRef(dayjs().format('MM'))
  const yearRef = useRef(dayjs().format('YYYY'))
  const navigate = useNavigate()
  const [mapData, setMapData] = useState({})

  const flowData = useSelector((state) => state.dashboard.flowCountData)
  const designationMember = useSelector((state) => state.dashboard.designationMember)
  const membersAll = useSelector((state) => state.dashboard.membersAll)
  const productByHead = useSelector((state) => state.dashboard.productByHead)
  const productAssigned = useSelector((state) => state.dashboard.productAssigned)
  const flowAccess = useSelector((state) => state.dashboard.flowAccess)
  const assignedByOwner = useSelector((state) => state.dashboard.assignedByOwner)
  const teamMembersCount = useSelector((state) => state.dashboard.teamMembersCount)
  const membersActivityCount = useSelector((state) => state.dashboard.membersActivityCount)
  const membersActivitySecLvlCount = useSelector(
    (state) => state.dashboard.membersActivitySecLvlCount,
  )
  const productCountByApprover = useSelector((state) => state.dashboard.productCountByApprover)
  const myActivityCount = useSelector((state) => state.dashboard.myActivityCount)
  const timesheetDaysCount = useSelector((state) => state.dashboard.timesheetDaysCount)
  const mastersCount = useSelector((state) => state.dashboard.mastersCount)
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)
  // const isFirstLoad = useRef(true)

  useEffect(() => {
    // if (title === 'Sumbit Activity Status' && isFirstLoad.current) {
    // isFirstLoad.current = false
    //   dispatch(getMyActivityCount())
    // }

    switch (title) {
      case 'Flows':
        dispatch(getFlowsCount())
        break
      case 'Designation Members':
        dispatch(getMembersByDesignation())
        break
      case 'Overall Members':
        dispatch(getMembersAll())
        break
      case 'Total Products':
        dispatch(getProductByHead())
        break
      case 'Product Assigned':
        dispatch(getProductAssigned())
        break
      case 'Flow Access':
        dispatch(getFlowAccess())
        break
      case 'My Products':
        dispatch(getProductAssignedByOwner())
        break
      case "Team Member's Activity":
        dispatch(getMembersActivityBySup())
        break
      case 'Second Level Approval Status':
        dispatch(getMembersActivityBySupAndSecLvl())
        break
      case 'Team Members':
        dispatch(getTeamMemberCount())
        break
      case 'My Product Count':
        dispatch(getProductCountByApprover())
        break
      case 'Sumbit Activity Status':
        dispatch(getMyActivityCount())
        break
      case 'Total Timesheet Entry':
        dispatch(getTimesheetSummary(monthRef.current, yearRef.current))
        break
      case "Master's Overview":
        dispatch(getMastersCount())
        break
      default:
        break
    }
  }, [dispatch, title])

  useEffect(() => {
    switch (title) {
      case 'Flows':
        if (!flowData || flowData.length === 0) {
          dispatch(getFlowsCount())
        } else {
          chartData.current = flowData
          setMapData(flowData)
        }
        break
      case 'Designation Members':
        if (!designationMember || designationMember.length === 0) {
          dispatch(getMembersByDesignation())
        } else {
          chartData.current = designationMember
          setMapData(designationMember)
        }
        break
      case 'Overall Members':
        if (!membersAll || membersAll.length === 0) {
          dispatch(getMembersAll())
        } else {
          chartData.current = membersAll
          setMapData(membersAll)
        }
        break
      case 'Total Products':
        if (!productByHead || productByHead.length === 0) {
          dispatch(getProductByHead())
        } else {
          chartData.current = productByHead
          setMapData(productByHead)
        }
        break
      case 'Product Assigned':
        if (!productAssigned || productAssigned.length === 0) {
          dispatch(getProductAssigned())
        } else {
          chartData.current = productAssigned
          setMapData(productAssigned)
        }
        break
      case 'Flow Access':
        if (!flowAccess || flowAccess.length === 0) {
          dispatch(getFlowAccess())
        } else {
          chartData.current = flowAccess
          setMapData(flowAccess)
        }
        break
      case 'My Products':
        if (!assignedByOwner || assignedByOwner.length === 0) {
          dispatch(getProductAssignedByOwner())
        } else {
          chartData.current = assignedByOwner
          setMapData(assignedByOwner)
        }
        break
      case "Team Member's Activity":
        if (!membersActivityCount || membersActivityCount.length === 0) {
          dispatch(getMembersActivityBySup())
        } else {
          chartData.current = membersActivityCount
          setMapData(membersActivityCount)
        }
        break
      case 'Second Level Approval Status':
        if (!membersActivitySecLvlCount || membersActivitySecLvlCount.length === 0) {
          dispatch(getMembersActivityBySupAndSecLvl())
        } else {
          chartData.current = membersActivitySecLvlCount
          setMapData(membersActivitySecLvlCount)
        }
        break
      case 'Team Members':
        if (!teamMembersCount || teamMembersCount.length === 0) {
          dispatch(getTeamMemberCount())
        } else {
          chartData.current = teamMembersCount
          setMapData(teamMembersCount)
        }
        break
      case 'My Product Count':
        if (!productCountByApprover || productCountByApprover.length === 0) {
          dispatch(getProductCountByApprover())
        } else {
          chartData.current = productCountByApprover
          setMapData(productCountByApprover)
        }
        break
      case 'Sumbit Activity Status':
        if (!myActivityCount || myActivityCount.length === 0) {
          dispatch(getMyActivityCount())
        } else {
          chartData.current = myActivityCount
          setMapData(myActivityCount)
        }
        break
      case 'Total Timesheet Entry':
        if (!timesheetDaysCount || timesheetDaysCount.length === 0) {
          dispatch(getTimesheetSummary(monthRef.current, yearRef.current))
        } else {
          chartData.current = timesheetDaysCount
          setMapData(timesheetDaysCount)
        }
        break
      case "Master's Overview":
        if (!mastersCount || mastersCount.length === 0) {
          dispatch(getMastersCount())
        }
        break
      default:
        break
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    flowData,
    designationMember,
    membersAll,
    productByHead,
    productAssigned,
    flowAccess,
    assignedByOwner,
    membersActivitySecLvlCount,
    membersActivityCount,
    teamMembersCount,
    productCountByApprover,
    myActivityCount,
    timesheetDaysCount,
    mastersCount,
  ])

  const toggleTab = (tabKey) => {
    setActiveTab(tabKey)
  }

  const getTitle = (title, maxLength = 25) => {
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
  const items = [
    {
      key: `tab-active-${index}-1`,
      label: 'Pie Chart',
      children: <DashboardPieChart chartData={mapData} title={title} widgetLength={length} />,
    },
    {
      key: `tab-active-${index}-2`,
      label: 'Bar Chart',
      children: <DashboardBarChart chartData={mapData} title={title} />,
    },
  ]

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
      number: mastersCount?.userCount,
      BGcolor: '#1F65CE0D',
      iconbgcolor: '#1F65CE1A',
    },
    {
      icon: briefcase,
      label: 'Business Category',
      number: mastersCount?.bussinessCount,
      BGcolor: '#00AB550D',
      iconbgcolor: '#00AB551A',
    },
    {
      icon: personIcon,
      label: 'Designation',
      number: mastersCount?.roleCount,
      BGcolor: '#FFA6570D',
      iconbgcolor: '#FFA6571A',
    },
    {
      icon: groupicon,
      label: 'Task Groups',
      number: mastersCount?.taskcategoryCount,
      BGcolor: '#1F65CE0D',
      iconbgcolor: '#E524481A',
    },
  ]
  const nextArrow = (title) => {
    if (title === 'Flows') {
      navigate('/flow')
    } else if (title === 'Designation Members' || title === 'Overall Members') {
      navigate('/master')
    } else if (title === 'My Product Count' || title === 'Flow Access' || title === 'My Products') {
      navigate('/product/list')
    } else if (title === 'Total Products') {
      navigate('/product/list?tab=7')
    } else if (title === 'Product Assigned') {
      navigate('/product/list?tab=1')
    } else if (
      title === `Team Member's Activity` ||
      title === 'Second Level Approval Status' ||
      title === 'Team Members'
    ) {
      navigate('/members-activity')
    } else if (title === 'Sumbit Activity Status') {
      navigate('/timesheet?tab=3')
    }
  }
  return (
    <div>
      <CCard
        style={{
          backgroundColor: 'white',
          height: widgetLength === 3 ? '250px' : '270px',
          padding: '20px',
          marginBottom: '10px',
          paddingBottom: '0px',
          borderRadius: '10px',
          border: 'none',
        }}
      >
        <CRow>
          <CCol
            xs={7}
            md={title !== 'Total Timesheet Entry' ? 6 : 8}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography
              className="Title_Card_lable"
              // style={{ color: '#4C4C4C', fontSize: '13px', fontWeight: 700, cursor: 'default' }}
              title={getTitleNames(title)}
            >
              {getTitle(title)}
            </Typography>
          </CCol>
          {title !== 'Total Timesheet Entry' && title !== "Master's Overview" ? (
            <CCol xs={5} md={6}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className={`tab border-0 ${
                    activeTab === `tab-active-${index}-1` ? 'DGroup_icon' : 'DGroup_img'
                  }`}
                  onClick={() => toggleTab(`tab-active-${index}-1`)}
                  disabled={sidebarShow === true}
                >
                  <PieChartIcon
                    width="16"
                    height="19"
                    viewBox="0 0 18 18"
                    fill={activeTab === `tab-active-${index}-1` ? '#F91414' : '#AAAAAA'}
                    stopColor=""
                  />
                </button>
                <button
                  className={`tab ${
                    activeTab === `tab-active-${index}-2` ? 'DChart_img' : 'DChart_icon'
                  }`}
                  onClick={() => toggleTab(`tab-active-${index}-2`)}
                  disabled={sidebarShow === true}
                >
                  <BarChartSVG
                    width="16"
                    height="19"
                    viewBox="0 0 18 18"
                    fill={activeTab === `tab-active-${index}-2` ? '#FF2D2D' : '#AAAAAA'}
                    stopColor={activeTab === `tab-active-${index}-2` ? '#FF2D2D' : '#AAAAAA'}
                  />
                </button>
                <button
                  className="DArrow_icon"
                  onClick={() => nextArrow(title)}
                  style={{ border: 'none' }}
                  disabled={sidebarShow === true}
                >
                  <NextArrowSVG
                    fill="#AAAAAA"
                    viewBox="0 0 16 10"
                    width="15"
                    height="9"
                    stopColor="none"
                  />
                </button>
              </div>
            </CCol>
          ) : (
            title === 'Total Timesheet Entry' && (
              <CCol xs={5} md={4} style={{ display: 'flex' }}>
                <MonthPicker
                  style={{ fontSize: '11px' }}
                  placeholder="This month"
                  defaultValue={dayjs()}
                  format="MMM"
                  onChange={(value) => {
                    monthRef.current = value.format('MM')
                    yearRef.current = value.format('YYYY')
                    dispatch(getTimesheetSummary(monthRef.current, yearRef.current))
                  }}
                  allowClear={false}
                  disabledDate={(current) => current && current > dayjs().endOf('month')}
                  disabled={sidebarShow === true}
                />
              </CCol>
            )
          )}
        </CRow>
        {title === 'Total Timesheet Entry' ? (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '25px',
                fontWeight: '600',
              }}
            >
              <Typography style={{ fontSize: '25px' }}>
                {timesheetDaysCount?.totalDays || 0} Days
              </Typography>
            </div>
            <div>
              <Typography
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#8E8E93',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginTop: '5px',
                }}
              >
                Total TimeSheet Entry
              </Typography>
            </div>
            <div style={{ height: '92px', overflowY: 'auto', marginTop: '11px' }}>
              <Card
                className="Dashboard_Card"
                style={{
                  backgroundColor: '#ffff',
                  height: '64px',
                  marginTop: '20px',
                  border: '1px solid #F2F2F7',
                  boxShadow: ' 0px 4px 30px 0px #0000000D',
                }}
              >
                <CRow>
                  <CCol>
                    <Typography style={{ color: '#8E8E93', fontSize: '13px', fontWeight: '500' }}>
                      Total Leave
                    </Typography>
                  </CCol>
                  <CCol>
                    <Typography
                      style={{
                        display: 'flex',
                        justifyContent: 'end',
                        color: '#1C1C1E',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}
                    >
                      {timesheetDaysCount?.leaveCount || 0} days
                    </Typography>
                  </CCol>
                </CRow>
              </Card>
              <Card
                className="Dashboard_Card"
                style={{
                  backgroundColor: '#ffff',
                  height: '64px',
                  marginTop: '10px',
                  border: '1px solid #F2F2F7',
                  boxShadow: ' 0px 4px 30px 0px #0000000D',
                }}
              >
                <CRow>
                  <CCol>
                    <Typography style={{ color: '#8E8E93', fontSize: '13px', fontWeight: '500' }}>
                      Not Entered
                    </Typography>
                  </CCol>
                  <CCol>
                    <Typography
                      style={{
                        display: 'flex',
                        justifyContent: 'end',
                        color: '#1C1C1E',
                        fontSize: '13px',
                        fontWeight: '600',
                      }}
                    >
                      {timesheetDaysCount?.notEnteredCount || 0} days
                    </Typography>
                  </CCol>
                </CRow>
              </Card>
            </div>
          </div>
        ) : title === "Master's Overview" ? (
          <CRow>
            {mastersData.map((item, index) => (
              <CCol sm={6} key={index}>
                <Card
                  className="inside_card mt-2"
                  style={{
                    height: '85px',
                    backgroundColor: item.BGcolor,
                  }}
                >
                  <CRow>
                    <CCol className="d-flex justify-content-end">
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          height: '30px',
                          width: '30px',
                          backgroundColor: item.iconbgcolor,
                          borderRadius: '5px',
                        }}
                      >
                        <img src={item.icon} alt="icon" style={{ width: '15px', height: '15px' }} />
                      </div>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <div style={{ color: '#5F5F5F', fontWeight: 600, fontSize: '11px' }}>
                        {item.label}
                      </div>
                      <div style={{ color: '#000000', fontWeight: 700, fontSize: '13px' }}>
                        {item.number}
                      </div>
                    </CCol>
                  </CRow>
                </Card>
              </CCol>
            ))}
          </CRow>
        ) : (
          <CRow>
            <CCol className="Dashboard_Tab">
              <Tabs
                defaultActiveKey={`tab-active-${index}-1`}
                activeKey={activeTab}
                items={items}
                onChange={toggleTab}
              />
            </CCol>
          </CRow>
        )}
      </CCard>
    </div>
  )
}

const DashboardCard = ({ index, title, widgetLength }) => (
  <DashboardCardStyle index={index} title={title} widgetLength={widgetLength} />
)

DashboardCardStyle.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  widgetLength: PropTypes.number.isRequired,
}

DashboardCard.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  widgetLength: PropTypes.number.isRequired,
}

export default DashboardCard
