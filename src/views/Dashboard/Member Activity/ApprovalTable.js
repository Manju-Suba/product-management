import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { getMemberActivity } from 'src/redux/memberActivity/action'
import { CSpinner } from '@coreui/react'
import debounce from 'lodash.debounce'

const ApprovalTable = ({ typeValue, startDate, endDate }) => {
  const [commonLoader, setCommonLoader] = useState(true)
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const pageRef = useRef(0)
  const statusRef = useRef(typeValue)
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)
  const categoryRef = useRef('approveddefault')
  const hasMoreRef = useRef(true)
  const sizeRef = useRef(5)
  const tableBodyRef = useRef(null)

  const addSerialNumbers = (data) => {
    const startIndex = pageRef.current * sizeRef.current
    return data.map((item, index) => ({
      ...item,
      sno: startIndex + index + 1,
    }))
  }

  const truncateString = (str, num) => {
    if (!str) {
      return '' // or you can return str itself, which would be null or undefined
    }
    return str.length > num ? `${str.substring(0, num)}...` : str
  }

  const columns = [
    {
      title: 'SI.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 8,
      fixed: 'left',
    },
    {
      title: 'Team member',
      dataIndex: 'userName',
      key: 'userName',
      fixed: 'left',
      width: 18,
      render: (text) => truncateString(text, 12),
    },
    {
      title: 'Activity date',
      width: 12,
      dataIndex: 'activity_date',
      key: 'activity_date',
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: 20,
      render: (text, row) => {
        const truncatedProductName = truncateString(row.productName, 16)
        return (
          <div>
            <span>
              {row.assignedStatus === true && (
                <span style={{ fontSize: '16px', color: '#00ab55' }}>&#8226;</span>
              )}
              {row.assignedStatus === false && (
                <span style={{ fontSize: '16px', color: '#ffaa00' }}>&#8226;</span>
              )}
              <span style={{ marginLeft: '5px', color: '#000' }}>{truncatedProductName}</span>
            </span>
          </div>
        )
      },
    },
    {
      title: 'Task',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 18,
      render: (text) => truncateString(text, 15),
    },

    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      width: 10,
    },
    {
      title: 'Approver Status',
      dataIndex: 'supervisorStatus',
      key: 'supervisorStatus',
      width: 15,

      render: (text, row) => {
        let className = 'not-text1'
        if (text === 'Approved') {
          className = 'green-text1'
        } else if (text === 'Reject' || text === 'Rejected') {
          className = 'red-text1'
        } else if (text === 'Pending') {
          className = 'warning-text1'
        } else if (text === 'Resubmit') {
          className = 'info-text1'
        }
        return <div className={className}>{text === 'Reject' ? 'Rejected' : text}</div>
      },
    },
    {
      title: 'Remarks',
      width: 30,
      dataIndex: 'description',
      key: 'description',
      render: (text) => truncateString(text, 20),
    },
  ]

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      dispatch(
        getMemberActivity(
          pageRef.current,
          sizeRef.current,
          categoryRef.current,
          statusRef.current,
          startDateRef.current,
          endDateRef.current,
        ),
      )
        .then((data) => {
          const res = data.data
          const dataWithSerialNumbers = addSerialNumbers(res)
          if (dataWithSerialNumbers.length < sizeRef.current) {
            hasMoreRef.current = false
          }
          if (!pageRef.current) {
            setData(dataWithSerialNumbers)
          } else {
            setData((prevData) => [...prevData, ...dataWithSerialNumbers])
          }

          pageRef.current += 1
          setCommonLoader(false)
        })
        .catch((errors) => {
          setCommonLoader(false)
        })
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      categoryRef.current = 'approveddefaultdate'
      startDateRef.current = startDate
      endDateRef.current = endDate
    } else {
      categoryRef.current = 'approveddefault'
    }
    setCommonLoader(true)
    pageRef.current = 0
    hasMoreRef.current = true
    setData([])
    dispatch(
      getMemberActivity(
        pageRef.current,
        sizeRef.current,
        categoryRef.current,
        statusRef.current,
        startDateRef.current,
        endDateRef.current,
      ),
    )
      .then((data) => {
        const res = data.data
        const dataWithSerialNumbers = addSerialNumbers(res)
        if (dataWithSerialNumbers.length < sizeRef.current) {
          hasMoreRef.current = false
        }
        if (!pageRef.current) {
          setData(dataWithSerialNumbers)
        } else {
          setData((prevData) => [...prevData, ...dataWithSerialNumbers])
        }

        pageRef.current += 1
        setCommonLoader(false)
      })
      .catch((errors) => {
        setCommonLoader(false)
      })
  }, [startDate, endDate, dispatch])

  const handleScroll = useCallback(
    debounce(() => {
      if (!tableBodyRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        fetchMoreData()
      }
    }, 100),
    [hasMoreRef.current, commonLoader],
  )

  useEffect(() => {
    const tableBody = document.querySelector('.memberAtable .ant-table-body')
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
    <div className="db_table memberAtable" style={{ height: '349px ' }}>
      <style>{`
        .ant-table-body {
          scrollbar-width: thin;
        }
        .memberAtable .ant-table-wrapper .ant-table-thead > tr > th {
          color: #919EAB !important;
          font-size: 12px !important;
          padding: 12px !important;
        }
        .memberAtable .ant-table-wrapper .ant-table-thead > tr > td {
          color: #A5A3A4 !important;
        }
        .memberAtable .ant-table-cell {
          font-size: 12px !important;
          color: #A5A3A4 !important;
          font-weight: 600;
        }
      `}</style>
      <Table
        columns={columns}
        dataSource={data}
        className="db_table_content"
        scroll={{ x: 1300, y: 290 }}
        pagination={false}
        loading={{
          spinning: commonLoader,
          indicator: <CSpinner color="danger" />,
        }}
      />
      {!hasMoreRef.current && data.length !== 0 && data.length > 5 && (
        <p style={{ textAlign: 'center' }}>
          <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
        </p>
      )}
    </div>
  )
}

ApprovalTable.propTypes = {
  typeValue: PropTypes.any,
  startDate: PropTypes.any,
  endDate: PropTypes.any,
}
export default ApprovalTable
