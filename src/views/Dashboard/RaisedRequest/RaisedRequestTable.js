import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getRaisedRequest } from 'src/redux/timesheet/action'
import 'react-datepicker/dist/react-datepicker.css'
import { CSpinner } from '@coreui/react'
import PropTypes from 'prop-types'
import debounce from 'lodash.debounce'
import { formatDate } from 'src/TimeUtils'

const RaisedRequestTable = ({ selectedStatus, filterType, selectedDate, heightValue }) => {
  const dispatch = useDispatch()
  const pageRef = useRef(0)
  const sizeRef = useRef(5)
  const hasMoreRef = useRef(true)
  const dateRef = useRef(selectedDate)
  const statusRef = useRef(selectedStatus)
  const filterRef = useRef(filterType)
  const [data, setData] = useState([])
  const [commonLoader, setCommonLoader] = useState(true)
  const raisedRequestData = useSelector((state) => state.timesheet?.raisedRequestList)
  const tableBodyRef = useRef(null)
  const [isNorMore, setIsNorMore] = useState(false)

  const addSerialNumbers = (data) => {
    const startIndex = pageRef.current * sizeRef.current // Calculate the start index based on the page number
    return data.map((item, index) => ({
      ...item,
      sno: startIndex + index + 1, // Generating serial number with the correct offset
    }))
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
      width: 2,
      fixed: 'left',
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
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      width: 5,
      fixed: 'left',
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
      title: 'Team member',
      dataIndex: 'teamName',
      key: 'teamName',
      width: 8,
      render: (text, row) => {
        if (row.key === 'noMoreData') {
          setIsNorMore(true)
          return {
            children: (
              <div style={{ textAlign: 'center' }}>
                <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
              </div>
            ),
            props: {
              colSpan: 6, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return truncateString(text, 13)
      },
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 15,
      render: (text, row) => {
        if (row.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return truncateString(text, 20)
      },
    },
    {
      title: 'Approver Status',
      dataIndex: 'status',
      key: 'status',
      width: 5,
      render: (text, row) => {
        if (row.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        let className = ''
        if (text === 'Approved') {
          className = 'font-green'
        } else if (text === 'Reject' || text === 'Rejected') {
          className = 'font-red'
        } else if (text === 'Pending') {
          className = 'font-warning'
        } else if (text === 'Resubmit') {
          className = 'font-info'
        }
        return (
          <div className={`dashboard-table-font ${className}`}>
            <span style={{ fontSize: '16px' }}>&#8226;</span>{' '}
            {text === 'Reject' ? 'Rejected' : text}
          </div>
        )
      },
    },
    {
      title: 'Approver Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 9,
      color: '#313131',
      render: (text, record, index) => {
        if (record.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return <div title={text}> {text ? truncateString(text, 30) : '---'}</div>
      },
    },
  ]

  useEffect(() => {
    if (raisedRequestData && raisedRequestData.length >= 0) {
      const dataWithSerialNumbers = addSerialNumbers(raisedRequestData)
      if (dataWithSerialNumbers.length < sizeRef.current) {
        hasMoreRef.current = false
      }
      setData((prevData) => [...prevData, ...dataWithSerialNumbers])
      pageRef.current += 1
    }
    setCommonLoader(false)
  }, [raisedRequestData])

  const displayData = [
    ...data.map((row, index) => ({
      key: row.id,
      id: row.id,
      index: index + 1,
      requestDate: row.requestDate,
      teamName: row.teamName,
      reason: row.reason,
      status: row.status,
    })),
  ]

  // Append the "No more Data to load" message as the last row if noMoreData is true
  if (!hasMoreRef.current && displayData.length !== 0 && displayData.length > 5) {
    displayData.push({
      key: 'noMoreData',
      index: '',
      requestDate: '',
      teamName: 'No more Data to load',
      reason: '',
      status: '',
    })
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      dispatch(
        getRaisedRequest(
          pageRef.current,
          sizeRef.current,
          filterRef.current,
          dateRef.current,
          statusRef.current,
        ),
      )
    }
  }

  useEffect(() => {
    setCommonLoader(true)
    statusRef.current = selectedStatus
    filterRef.current = filterType
    dateRef.current = selectedDate
    pageRef.current = 0 // Reset pagination
    setData([]) // Clear current data
    hasMoreRef.current = true
    dispatch(
      getRaisedRequest(
        pageRef.current,
        sizeRef.current,
        filterRef.current,
        dateRef.current,
        statusRef.current,
      ),
    )
  }, [selectedStatus, filterType, selectedDate, dispatch])

  const handleScroll = useCallback(
    debounce(() => {
      if (!tableBodyRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (hasMoreRef.current && !commonLoader) {
          setCommonLoader(true)
          fetchMoreData()
        }
      }
    }, 100),
    [hasMoreRef.current, commonLoader],
  )

  useEffect(() => {
    const tableBody = document.querySelector('.raise-table .ant-table-body')
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
      className="db_table raise-table"
      style={{ height: heightValue ? '150px' : '349px', overflowY: 'auto' }}
    >
      <style>{`
        .ant-table-body {
          scrollbar-width: thin;
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
        pagination={false}
        scroll={{ x: 1300, y: heightValue ? 150 : 290 }}
        loading={{
          spinning: commonLoader, // Indicate that the table is loading
          indicator: <CSpinner color="danger" />, // Use your custom loader component
        }}
      />
    </div>
  )
}
RaisedRequestTable.propTypes = {
  selectedStatus: PropTypes.any,
  selectedDate: PropTypes.any,
  filterType: PropTypes.any,
  heightValue: PropTypes.bool,
}
export default RaisedRequestTable
