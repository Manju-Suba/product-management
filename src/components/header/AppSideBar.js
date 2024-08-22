import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CButton, CCol, CRow, CSidebar } from '@coreui/react'
import { Button, Card, Typography } from 'antd'
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PropTypes from 'prop-types'
import 'react-toastify/dist/ReactToastify.css'
import SideBarChart from 'src/views/Dashboard/DashboardCard/SidebarPieChart'
import TableBarChart from 'src/views/Dashboard/DashboardCard/TableBarChart'
import SideBarTable from './SideBarTable'
import {
  getSequenceList,
  restoreDefaultWidgets,
  setDefaultData,
  setDragItem,
  setLoader,
  toggleSideBar,
} from 'src/redux/Dashboard/action'
import CrossSvg from 'src/views/svgImages/CrossSvg'

const ItemTypes = {
  CARD: 'widgetCount',
  TABLE: 'widgetTable',
}

const DraggableCard = ({ id, index, title, children }) => {
  const dispatch = useDispatch()

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id, index, title },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, index, title],
  )

  useEffect(() => {
    if (isDragging) {
      dispatch(setDragItem(ItemTypes.CARD, title, index, false))
      dispatch(setLoader(true))
    }
  }, [isDragging, dispatch, title, index])

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  )
}

DraggableCard.propTypes = {
  index: PropTypes.number.isRequired,
  id: PropTypes.number,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const DraggableTable = ({ id, index, title, children }) => {
  const dispatch = useDispatch()

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TABLE,
      item: { id, index, title },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, index, title],
  )

  useEffect(() => {
    if (isDragging) {
      dispatch(setDragItem(ItemTypes.TABLE, title, index, false))
      dispatch(setLoader(true))
    }
  }, [isDragging, dispatch, title, index])

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  )
}

DraggableTable.propTypes = {
  index: PropTypes.number.isRequired,
  id: PropTypes.number,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const DroppableArea = ({ index, children, onDrop, acceptedTypes }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: acceptedTypes,
      drop: (item) => onDrop(item, index),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [index, acceptedTypes],
  )

  return (
    <div
      ref={drop}
      style={{
        background: isOver ? 'lightblue' : 'white',
        borderRadius: '5px',
      }}
    >
      {children}
    </div>
  )
}

DroppableArea.propTypes = {
  index: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  onDrop: PropTypes.func.isRequired,
  acceptedTypes: PropTypes.array.isRequired,
}

const DraggableSidebarCard = ({ title, index, data }) => {
  return (
    <div>
      {title === 'widgetTable' && (data === 'My Timesheet' || data === 'Working Hours') && (
        <DraggableTable id={index} index={index} title={data}>
          <TableBarChart title={data} />
        </DraggableTable>
      )}
      {title === 'widgetTable' && data !== 'My Timesheet' && data !== 'Working Hours' && (
        <DraggableTable id={index} index={index} title={data}>
          <SideBarTable title={data} />
        </DraggableTable>
      )}
      {title === 'widgetCount' && (
        <DraggableCard id={index} index={index} title={data}>
          <SideBarChart title={data} />
        </DraggableCard>
      )}
    </div>
  )
}

DraggableSidebarCard.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)
  const widgetData = useSelector((state) => state.dashboard.sequenceList)
  const updateSequenceData = useSelector((state) => state.dashboard.updateSequenceData)
  const defaultData = useSelector((state) => state.dashboard.defaultData)
  const [isLoadingRD, setIsLoadingRD] = useState(false)
  const counts = useSelector((state) => state.dashboard.count)

  const handleRestore = async () => {
    setIsLoadingRD(true)
    try {
      const response = await dispatch(restoreDefaultWidgets(defaultData)).unwrap()
      if (response.status === true) {
        setIsLoadingRD(false)
        dispatch(toggleSideBar(false))
      } else {
        setIsLoadingRD(false)
      }
    } catch (error) {
      setIsLoadingRD(false)
      // Handle error if needed
    }
    dispatch(getSequenceList())
  }

  const handleClose = () => {
    dispatch(toggleSideBar(false))
  }

  useEffect(() => {
    if (updateSequenceData !== null) {
      setIsLoadingRD(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (counts === 1) {
      dispatch(setDefaultData(widgetData))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counts])

  return (
    <DndProvider backend={HTML5Backend}>
      <CSidebar
        className="App_sidebar"
        style={{ backgroundColor: '#F8F8F8', width: '16rem' }}
        position="fixed"
        visible={sidebarShow}
        onVisibleChange={(visible) => {
          dispatch({ type: 'set', sidebarShow: visible })
        }}
      >
        <div style={{ height: '100%', position: 'sticky' }}>
          <div>
            <CRow>
              <CCol
                sm={9}
                style={{
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                }}
              >
                <Typography className="sideBar_Header_lab">Available Widget</Typography>
              </CCol>
              <CCol
                sm={3}
                style={{
                  height: '40px',
                  display: 'flex',
                  justifyContent: 'end',
                  alignItems: 'center',
                }}
              >
                <CButton color="primary" onClick={handleClose}>
                  <CrossSvg width="12" height="11" viewBox="0 0 14 10" fill="#A5A1A1" />
                </CButton>
              </CCol>
            </CRow>
          </div>
          <div style={{ overflowY: 'auto', height: '90%', paddingBottom: '27px' }}>
            {widgetData?.length === 0 ? (
              <CCol sm={12}>
                <Card style={{ height: '250px' }}>No data found</Card>
              </CCol>
            ) : (
              <>
                {widgetData?.[0]?.remainingWidgetCount?.map((item, index) => (
                  <CCol sm={12} key={`count-${index + 1}`}>
                    <DraggableSidebarCard title="widgetCount" data={item} index={index} />
                  </CCol>
                ))}
                {widgetData?.[0]?.remainingWidgetTable.map((item, index) => (
                  <CCol sm={12} key={`table-${index + 1}`}>
                    <DraggableSidebarCard title="widgetTable" data={item} index={index} />
                  </CCol>
                ))}
              </>
            )}
          </div>

          <div
            style={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: 'White',
              zIndex: 1,
              width: '100%',
              boxShadow: '0px -1px 10px #D8D8D8',
              color: 'rgb(145, 158, 171)',
            }}
          >
            <CRow>
              <CCol
                style={{
                  padding: '10px',
                  paddingLeft: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  className="sidebar_app_button"
                  disabled={updateSequenceData === null || isLoadingRD}
                  onClick={handleRestore}
                  loading={isLoadingRD}
                >
                  Restore Default
                </Button>
              </CCol>
              {/* <CCol sm={6} style={{ padding: '10px', paddingLeft: '10px' }}>
                {' '}
                <Button
                  className="sidebar_app_button"
                  disabled={swapItemList?.length === 0 || isLoadingRD}
                  onClick={handleUpdate}
                  loading={isLoading}
                >
                  Apply
                </Button>
              </CCol> */}
            </CRow>
          </div>
        </div>
      </CSidebar>
    </DndProvider>
  )
}

export default AppSidebar
