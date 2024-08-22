import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CCard, CCol, CRow } from '@coreui/react'
import { Card, Tooltip, Skeleton } from 'antd'
import { ToastContainer } from 'react-toastify'
import DashboardCard from './DashboardCard/DashboardCard'
import { getDecodeData } from 'src/constant/Global'
import {
  countSidebar,
  getSequenceList,
  setDefaultData,
  setDragItem,
  setLoader,
  toggleSideBar,
  updateTitle,
} from 'src/redux/Dashboard/action'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import image from '../../assets/images/D-Frame.png'
import '../Dashboard/style.css'
import DashboardTable from './table'
import PropTypes from 'prop-types'

// Constants for the draggable types
const ItemTypes = {
  CARD: 'widgetCount',
  TABLE: 'widgetTable',
}

const DraggableCard = ({ id, index, title, children }) => {
  const dispatch = useDispatch()

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CARD,
      item: { id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, index, title],
  )

  useEffect(() => {
    if (isDragging) {
      dispatch(setDragItem(ItemTypes.CARD, title, index, true))
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
  title: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
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
      dispatch(setDragItem(ItemTypes.TABLE, title, index, true))
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
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const DroppableArea = ({ index, children, onDrop, acceptedTypes }) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: acceptedTypes,
      drop: (item) => onDrop(item, index, acceptedTypes[0]),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [index, acceptedTypes],
  )
  return (
    <div ref={drop} style={{ background: isOver ? 'lightblue' : 'white', borderRadius: '5px' }}>
      {children}
    </div>
  )
}

DroppableArea.propTypes = {
  index: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  onDrop: PropTypes.func.isRequired,
  acceptedTypes: PropTypes.array.isRequired, // New prop for accepted types
}

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = getDecodeData()
  const widgetData = useSelector((state) => state.dashboard.sequenceList)
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)
  const swapItemList = useSelector((state) => state.dashboard.swapItemList)
  const dragItem = useSelector((state) => state.dashboard.dragItem)
  const [widgetCountData, setWidgetCountData] = useState([])
  const [widgetTableData, setWidgetTableData] = useState([])

  useEffect(() => {
    if (!user) navigate('/')
    dispatch(getSequenceList())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (widgetData?.[0]?.widgetCount) {
      setWidgetCountData(widgetData[0].widgetCount)
    }
    if (widgetData?.[0]?.widgetTable) {
      setWidgetTableData(widgetData[0].widgetTable)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetData])

  useEffect(() => {}, [swapItemList])

  const handleSidebarToggle = () => {
    dispatch(toggleSideBar(!sidebarShow))
    dispatch(countSidebar())
  }

  const handleDrop = (item, index, type) => {
    if (sidebarShow) {
      dispatch(setLoader(true))
      let key
      if (dragItem.status === true) {
        key = 'inner'
      } else {
        key = 'outer'
      }
      dispatch(updateTitle(index, dragItem.title, type, widgetData, key)).then((res) => {
        if (res.status === 200) {
          dispatch(getSequenceList())
        }
      })
    }
  }

  const renderWidgetTable = () => {
    if (widgetTableData?.length === 2) {
      return widgetTableData.map((item, index) => (
        <CCol sm={6} key={index + 1}>
          {sidebarShow === true ? (
            <DroppableArea index={index} onDrop={handleDrop} acceptedTypes={[ItemTypes.TABLE]}>
              <DraggableTable id={index} index={index} title={item}>
                <DashboardTable
                  data={item}
                  widgetLength={widgetTableData.length}
                  widgetTableData={widgetTableData[0]}
                />
              </DraggableTable>
            </DroppableArea>
          ) : (
            <DashboardTable
              data={item}
              widgetLength={widgetTableData.length}
              widgetTableData={widgetTableData[0]}
            />
          )}
        </CCol>
      ))
    } else {
      return widgetTableData.slice(1).map((item, index) => (
        <CCol sm={6} key={index + 1}>
          {sidebarShow === true ? (
            <DroppableArea index={index + 1} onDrop={handleDrop} acceptedTypes={[ItemTypes.TABLE]}>
              <DraggableTable id={index} index={index} title={item}>
                <DashboardTable
                  data={item}
                  widgetLength={widgetTableData.length}
                  widgetTableData={widgetTableData[0]}
                />
              </DraggableTable>
            </DroppableArea>
          ) : (
            <DashboardTable
              data={item}
              widgetLength={widgetTableData.length}
              widgetTableData={widgetTableData[0]}
            />
          )}
        </CCol>
      ))
    }
  }

  const renderWidgetCountData = () => {
    if (widgetCountData.length >= 3) {
      return widgetCountData.slice(0, 3).map((item, index) => (
        <CCol sm={sidebarShow ? 6 : 4} md={6} lg={4} key={index + 1}>
          {sidebarShow === true ? (
            <DroppableArea index={index} onDrop={handleDrop} acceptedTypes={[ItemTypes.CARD]}>
              <DraggableCard id={index} index={index} title={item}>
                <DashboardCard title={item} widgetLength={widgetCountData.length} index={index} />
              </DraggableCard>
            </DroppableArea>
          ) : (
            <DashboardCard title={item} widgetLength={widgetCountData.length} index={index} />
          )}
        </CCol>
      ))
    } else {
      const widgetCountDataSlice = widgetCountData.slice(0, 2)
      return (
        <>
          {widgetCountDataSlice.map((item, index) => (
            <CCol
              sm={sidebarShow ? 6 : 3}
              md={3}
              lg={3}
              key={index + 1}
              className="pr-0"
              style={{ paddingRight: '12px' }}
            >
              {sidebarShow === true ? (
                <DroppableArea index={index} onDrop={handleDrop} acceptedTypes={[ItemTypes.CARD]}>
                  <DraggableCard id={index} index={index} title={item}>
                    <DashboardCard
                      title={item}
                      widgetLength={widgetCountData.length}
                      index={index}
                    />
                  </DraggableCard>
                </DroppableArea>
              ) : (
                <DashboardCard title={item} widgetLength={widgetCountData.length} index={index} />
              )}
            </CCol>
          ))}
          <CCol sm={6} className="pl-2" style={{ paddingLeft: '10px' }}>
            {sidebarShow === true ? (
              <DroppableArea index={0} onDrop={handleDrop} acceptedTypes={[ItemTypes.TABLE]}>
                <DraggableTable id={2} index={2} title={widgetTableData[0]}>
                  <DashboardTable
                    data={widgetTableData[0]}
                    widgetTableData={widgetTableData[0]}
                    widgetLength={widgetTableData.length}
                  />
                </DraggableTable>
              </DroppableArea>
            ) : (
              <DashboardTable
                data={widgetTableData[0]}
                widgetTableData={widgetTableData[0]}
                widgetLength={widgetTableData.length}
              />
            )}
          </CCol>
        </>
      )
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <ToastContainer />
        <CCard className="mt-4 dashbord_content">
          <CRow>
            <CCol xs={12} className="d-flex justify-content-end mb-3">
              <Tooltip placement="top" title="Customise">
                <button
                  onClick={handleSidebarToggle}
                  className="border-0"
                  style={{ background: 'none' }}
                >
                  <img src={image} style={{ width: '44px', height: '38px' }} alt="Dashboard" />
                </button>
              </Tooltip>
            </CCol>
            {widgetData?.length === 0
              ? [0, 1, 2].map((index) => (
                  <CCol sm={4} key={index}>
                    <Card style={{ height: '250px' }}>
                      <Skeleton active />
                    </Card>
                  </CCol>
                ))
              : renderWidgetCountData()}
          </CRow>
          <CRow className="mt-3">
            {widgetData?.length === 0 ? (
              <>
                <CCol sm={6}>
                  <Card style={{ height: '250px' }}>
                    <Skeleton active />
                  </Card>
                </CCol>
                <CCol sm={6}>
                  <Card style={{ height: '250px' }}>
                    <Skeleton active />
                  </Card>
                </CCol>
              </>
            ) : (
              renderWidgetTable()
            )}
          </CRow>
        </CCard>
      </div>
    </DndProvider>
  )
}

export default Dashboard
