import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'
import { getSubmittedActivity } from 'src/redux/timesheet/action'
import { useDispatch, useSelector } from 'react-redux'
import { CSpinner } from '@coreui/react'
import debounce from 'lodash.debounce'
import redirectImg from '../../../assets/images/share.png'
import { useNavigate } from 'react-router-dom'
import { formatDate, formatTimeDuration } from 'src/TimeUtils'

const SubmittedActivityTable = ({ selectedDate, heightValue }) => {
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const pageRef = useRef(0)
  const sizeRef = useRef(5)
  const dateRef = useRef(selectedDate)
  const filterRef = useRef(false)
  const hasMoreRef = useRef(true)
  const [commonLoader, setCommonLoader] = useState(true)
  const tableBodyRef = useRef(null)
  const navigate = useNavigate()
  const submittedList = useSelector((state) => state.timesheet?.submittedTimesheetList)
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

  const handleEdit = (id) => {
    navigate(`/timesheet?tab=3&id=${id}`)
  }

  // submitActivity
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'index',
      key: 'index',
      width: 16,
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
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      fixed: 'left',
      width: 40,
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
          <span className="" title={row.productName}>
            {row.assignedStatus === true && (
              <span style={{ fontSize: '16px', color: '#00ab55' }}>&#8226;</span>
            )}
            {row.assignedStatus === false && (
              <span style={{ fontSize: '16px', color: '#ffaa00' }}>&#8226;</span>
            )}
            <span style={{ marginLeft: '5px' }}>{truncateString(row.productName, 11)}</span>
          </span>
        )
      },
    },
    {
      title: 'Task',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 30,
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
              colSpan: 9, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return truncateString(text, 8)
      },
    },
    {
      title: 'Activity Date',
      dataIndex: 'activity_date',
      key: 'activity_date',
      width: 30,
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
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      width: 25,
      render: (text, record, index) => {
        if (record.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return formatTimeDuration(record.hours)
      },
    },
    {
      title: 'Approver Status',
      dataIndex: 'approvedStatus',
      key: 'approvedStatus',
      width: 35,
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
      title: 'Final Status',
      dataIndex: 'finalApproveStatus',
      key: 'finalApproveStatus',
      width: 33,
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
      title: 'Remarks',
      width: 60,
      dataIndex: 'description',
      key: 'description',
      render: (text, record, index) => {
        if (record.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        return <div title={text}> {truncateString(text, 30)}</div>
      },
    },
    {
      title: 'Action',
      width: 18,
      dataIndex: 'action',
      fixed: 'right',
      render: (text, row) => {
        if (row.key === 'noMoreData') {
          return {
            children: null,
            props: {
              colSpan: 0, // Adjust this number based on the total number of columns to span
            },
          }
        }
        let action
        if (
          row.approvedStatus === 'Reject' ||
          row.finalApproveStatus === 'Reject' ||
          row.ownerStatus === 'Reject'
        ) {
          action = (
            <button
              type="button"
              className="action-view edit-button"
              style={{ padding: '4px 8px' }}
              onClick={() => handleEdit(row.id)}
            >
              <img src={redirectImg} alt="share" style={{ width: '17px' }} />
            </button>
          )
        } else {
          action = '--'
        }
        return action
      },
    },
  ]

  useEffect(() => {
    if (submittedList && submittedList.length >= 0) {
      const dataWithSerialNumbers = addSerialNumbers(submittedList)
      if (dataWithSerialNumbers.length < sizeRef.current) {
        hasMoreRef.current = false
      }
      setData((prevData) => [...prevData, ...dataWithSerialNumbers])
      pageRef.current += 1
    }
    setCommonLoader(false)
  }, [submittedList])

  const displayData = [
    ...data.map((row, index) => ({
      key: row.id,
      id: row.id,
      index: index + 1,
      activity_date: row.activity_date,
      productName: row.productName,
      taskName: row.taskName,
      hours: row.hours,
      description: row.description,
      finalApproveStatus: row.finalApproveStatus,
      approvedStatus: row.approvedStatus,
      ownerStatus: row.ownerStatus,
      assignedStatus: row.assignedStatus,
    })),
  ]

  // Append the "No more Data to load" message as the last row if noMoreData is true
  if (!hasMoreRef.current && displayData.length !== 0 && displayData.length > 5) {
    displayData.push({
      key: 'noMoreData',
      index: '',
      productName: 'No more Data to load',
      taskName: '',
      hours: '',
      description: '',
      action: '',
      finalApproveStatus: '',
      approvedStatus: '',
      ownerStatus: '',
      assignedStatus: '',
    })
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      dispatch(
        getSubmittedActivity(pageRef.current, sizeRef.current, filterRef.current, dateRef.current),
      )
    }
  }

  useEffect(() => {
    setCommonLoader(true)
    dateRef.current = selectedDate
    pageRef.current = 0
    filterRef.current = !!selectedDate
    setData([])
    hasMoreRef.current = true
    dispatch(
      getSubmittedActivity(pageRef.current, sizeRef.current, filterRef.current, dateRef.current),
    )
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
    [],
  )

  useEffect(() => {
    const tableBody = document.querySelector('.submit_table .ant-table-body')
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
      className="db_table submit_table"
      style={{ height: heightValue ? '204px' : '349px', overflowY: 'auto' }}
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
        scroll={{ x: 1300, y: 290 }}
        pagination={false}
        loading={{
          spinning: commonLoader,
          indicator: <CSpinner color="danger" />,
        }}
      />
    </div>
  )
}
SubmittedActivityTable.propTypes = {
  selectedDate: PropTypes.any,
  heightValue: PropTypes.bool,
}
export default SubmittedActivityTable
