import React, { useRef, useEffect, useState } from 'react'
import { PieChart } from '@mui/x-charts/PieChart'
import { CCol, CRow, CSpinner } from '@coreui/react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { setLoader } from 'src/redux/Dashboard/action'

const DashboardPieChart = ({ chartData, title, widgetLength }) => {
  const totalCountRef = useRef()
  const mapDataRef = useRef({ labels: [] })
  const setloader = useSelector((state) => state.dashboard.setloader)
  const widgetData = useSelector((state) => state.dashboard.sequenceList)
  const [widgetCountData, setWidgetCountData] = useState([])
  const [mapData, setMapData] = useState({ values: [], labels: [], color: [] })
  const dispatch = useDispatch()
  useEffect(() => {
    if (Object.keys(chartData).length !== 0) {
      mapDataRef.current = generateChartData()
      setMapData(generateChartData())
      totalCountRef.current = `${getTitleType(title)} </span></br>`
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData, title])

  useEffect(() => {
    if (widgetData?.[0]?.widgetCount) {
      setWidgetCountData(widgetData[0].widgetCount)
    }
  }, [widgetData])
  useEffect(() => {
    if (Object.keys(chartData).length !== 0) {
      dispatch(setLoader(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setloader, dispatch, chartData])

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

  function getTitleType(title) {
    if (title.includes('Flow')) {
      return 'Flows'
    } else if (title.includes('Members')) {
      return 'Members'
    } else if (title.includes('Activity')) {
      return 'Activity'
    } else if (title.includes('Product')) {
      return 'Products'
    } else {
      return 'Activity'
    }
  }
  return (
    <CRow>
      {setloader ? (
        <div className="text-c text-center my-3 td-text">
          <CSpinner color="danger" />
        </div>
      ) : (
        <>
          <CCol
            xs={widgetCountData?.length === 3 ? 7 : 12}
            className={widgetCountData?.length === 3 ? 'pie_chart' : 'pie_charttwo'}
            style={{ position: 'relative' }}
          >
            <PieChart
              key={JSON.stringify(mapData)}
              series={[
                {
                  innerRadius: 40,
                  paddingAngle: 0,
                  cornerRadius: 1,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 40, additionalRadius: -1 },
                  data: mapData.values.map((value, index) => ({
                    id: index,
                    value,
                    label: mapData.labels[index],
                    color: mapData.color[index],
                  })),
                },
              ]}
              width={224}
              height={200}
            />
            {widgetCountData?.length === 3 ? (
              <div
                className="pieChart_text"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '105px',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<span style="color:#a5a3a4;font-size:11px">Total ${totalCountRef.current}<b>${chartData.totalCount}</b>`,
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: '120px',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<span style="color:#a5a3a4;font-size:11px">Total ${totalCountRef.current}<b>${chartData.totalCount}</b>`,
                  }}
                />
              </div>
            )}
          </CCol>
          {widgetCountData?.length === 3 ? (
            <CCol xs={5} style={{ display: 'flex', alignItems: 'center' }} className="legend">
              <div className="legend-container">
                {mapData.labels.map((label, index) => (
                  <div key={index + 1} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: mapData.color[index] }}
                    />
                    <span
                      className="legend-label"
                      style={{
                        fontSize: '12px',
                        color: 'rgba(0, 0, 0, 0.87)',
                        paddingLeft: '10px',
                      }}
                      title={label}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </CCol>
          ) : (
            <div
              style={{
                transform: ' translate(-1px, -35px)',
                height: '20px',
                overflowY: 'auto',
                display: 'grid',
                gridAutoFlow: 'column',
                alignItems: 'center',
              }}
              // className="legend"
            >
              <div className="legend-containers">
                {mapData.labels.map((label, index) => (
                  <CRow key={index + 1}>
                    <CCol
                      xs={12}
                      key={index + 1}
                      className="legend-itemss"
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <div
                        className="legend-color"
                        style={{
                          backgroundColor: mapData.color[index],
                          marginLeft: '10px',
                        }}
                      />
                      <span
                        className="legend-label"
                        style={{
                          fontSize: '12px',
                          color: 'rgba(0, 0, 0, 0.87)',
                          paddingLeft: '10px',
                        }}
                        title={label}
                      >
                        {label}
                      </span>
                    </CCol>
                  </CRow>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </CRow>
  )
}

DashboardPieChart.propTypes = {
  chartData: PropTypes.any,
  title: PropTypes.string,
  widgetLength: PropTypes.number,
}

export default DashboardPieChart
