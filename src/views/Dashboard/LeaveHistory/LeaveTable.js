import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Table } from 'antd'
import 'react-datepicker/dist/react-datepicker.css'
import dayjs from 'dayjs'
import WarningModal from '../../modal/WarningModal'
import WithdrawSvg from 'src/views/svgImages/WithdrawSvg'
import { getLeaveHistory, withDrawLeave } from 'src/redux/timesheet/action'
import { useDispatch, useSelector } from 'react-redux'
import { CSpinner } from '@coreui/react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatDate } from 'src/TimeUtils'
import debounce from 'lodash.debounce'

const LeaveHistoryTable = ({ selectedDate, heightValue }) => {
  const dispatch = useDispatch()
  const [leaveDate, setLeaveDate] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [singleId, setSingleId] = useState()
  const pageRef = useRef(0)
  const sizeRef = useRef(5)
  const dateRef = useRef(selectedDate)
  const hasMoreRef = useRef(true)
  const oDataRef = useRef([]) // Added oDataRef
  const [commonLoader, setCommonLoader] = useState(true)
  const [data, setData] = useState([])
  const tableBodyRef = useRef(null)
  const [isNorMore, setIsNorMore] = useState(false)
  const leaveHistory = useSelector((state) => state.timesheet?.leaveHistoryList)
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)

  const addSerialNumbers = (data) => {
    const startIndex = pageRef.current * sizeRef.current
    return data.map((item, index) => ({
      ...item,
      sno: startIndex + index + 1,
    }))
  }

  //withdraw the leave
  const showModal = (id, date) => {
    setIsModalOpen(true)
    setSingleId(id)
    setLeaveDate(dayjs(date).format('DD MMM, YYYY'))
  }

  const handleWithdrawLeave = async (id) => {
    try {
      const response = await dispatch(withDrawLeave(id))
      if (response && response.status === true) {
        toast.success(response.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
        pageRef.current = 0
        setData([])
        oDataRef.current = []
        dispatch(getLeaveHistory(pageRef.current, sizeRef.current, dateRef.current))
        return response
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
    }
  }

  const resetFormValues = () => {
    pageRef.current = 0
    hasMoreRef.current = true
    // getLeaveHistory(dayjs(leaveDate).format('YYYY-MM-DD'))
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'index',
      key: 'index',
      width: 4,
      align: 'center',
      render: (text, record, index) => {
        if (record.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return index + 1
      },
    },
    {
      title: 'Activity Date',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      width: 8,
      render: (text, record, index) => {
        if (record.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return formatDate(text)
      },
    },
    {
      title: 'Remarks',
      width: 25,
      dataIndex: 'status',
      key: 'status',
      render: (text, record, index) => {
        if (record.key === 'noMoreData') {
          setIsNorMore(true)
          return {
            children: (
              <div style={{ textAlign: 'center' }}>
                <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
              </div>
            ),
            props: {
              colSpan: 4, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return <div title={text}> {truncateString(text, 30)}</div>
      },
    },
    {
      title: 'Action',
      width: 5,
      dataIndex: 'action',
      render: (text, row) => {
        if (row.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return (
          <Button
            className="btn border-0 text-c text-secondary cross-button"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            onClick={() => showModal(row.id, row.appliedDate)}
            disabled={sidebarShow === true}
          >
            <WithdrawSvg width="14" height="17" viewBox="0 0 15 18" fill="#A5A1A1" />
          </Button>
        )
      },
    },
  ]

  useEffect(() => {
    if (leaveHistory && leaveHistory.length >= 0) {
      const dataWithSerialNumbers = addSerialNumbers(leaveHistory)
      if (dataWithSerialNumbers.length < sizeRef.current) {
        hasMoreRef.current = false
      }
      pageRef.current += 1
      setData((prevData) => [...prevData, ...dataWithSerialNumbers])
      setCommonLoader(false)
    }
  }, [leaveHistory])

  const displayData = [
    ...data.map((row, index) => ({
      key: row.id,
      id: row.id,
      index: index + 1,
      appliedDate: row.appliedDate,
      status: row.status,
    })),
  ]

  // Append the "No more Data to load" message as the last row if noMoreData is true
  if (!hasMoreRef.current && displayData.length !== 0 && displayData.length > 5) {
    displayData.push({
      key: 'noMoreData',
      index: '',
      status: 'No more Data to load',
      appliedDate: '',
      action: '',
    })
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      dispatch(getLeaveHistory(pageRef.current, sizeRef.current, dateRef.current))
    }
  }

  useEffect(() => {
    setCommonLoader(true)
    dateRef.current = selectedDate
    setData([]) // Clear current data
    pageRef.current = 0 // Reset pagination
    oDataRef.current = [] // Clear cached data
    hasMoreRef.current = true // Reset hasMore flag
    dispatch(getLeaveHistory(pageRef.current, sizeRef.current, dateRef.current))
  }, [selectedDate, dispatch])

  const handleScroll = useCallback(
    debounce(() => {
      if (!tableBodyRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current
      if (scrollTop + clientHeight >= scrollHeight - 10 && hasMoreRef.current) {
        setCommonLoader(true)
        fetchMoreData()
      }
    }, 100),
    [hasMoreRef.current, commonLoader],
  )

  useEffect(() => {
    const tableBody = document.querySelector('.leave_table .ant-table-body')
    if (tableBody) {
      tableBodyRef.current = tableBody
      tableBody.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (tableBody) {
        tableBody.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <div
      className="db_table leave_table"
      style={{ height: heightValue ? '204px' : '349px', overflowY: 'auto' }}
    >
      <style>{`
        .ant-table-body {
          scrollbar-width: thin;
        }
          .leave_table .ant-table-body::-webkit-scrollbar {
              display: none !important;
            }
        .db_table .ant-table-wrapper .ant-table-thead > tr > th {
          color: #313131 !important;
          font-size: 12px !important;
          padding: 12px !important;
        }
        .db_table .ant-table-cell {
          font-size: 12px !important;
          color: #A5A3A4 !important;
          font-weight: 600;
        }
      `}</style>
      <Table
        columns={columns}
        dataSource={displayData}
        className={`${isNorMore ? 'last-row-table' : ''} db_table_content custom-table`}
        scroll={{ y: 290 }}
        pagination={false}
        loading={{
          spinning: commonLoader,
          indicator: <CSpinner color="danger" />,
        }}
      />
      {isModalOpen && (
        <WarningModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          handleApprove={handleWithdrawLeave}
          id={singleId}
          date={leaveDate}
          headContent="Leave Widthraw"
          resetFunc={resetFormValues}
        />
      )}
    </div>
  )
}
LeaveHistoryTable.propTypes = {
  selectedDate: PropTypes.any,
  heightValue: PropTypes.bool,
}
export default LeaveHistoryTable
