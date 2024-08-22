import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Table } from 'antd'
import { CSpinner } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getClosedContractMemberActivity,
  getClosedProductMemberActivity,
} from 'src/redux/memberActivity/action'
import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'

const ClosedActivityTable = ({ selectStatus, closedType }) => {
  const [commonLoader, setCommonLoader] = useState(true)
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const pageRef = useRef(0)
  const sizeRef = useRef(5)
  const hasMoreRef = useRef(true)
  const statusRef = useRef(null)
  const categoryRef = useRef('default')
  const tableBodyRef = useRef(null)
  const closedContractMemberActivityData = useSelector(
    (state) => state.memberactivity?.closedContractMemberData,
  )
  const closedProductMemberData = useSelector(
    (state) => state.memberactivity?.closedProductMemberData,
  )

  const addSerialNumbers = (data) => {
    const startIndex = pageRef.current * sizeRef.current
    return data.map((item, index) => ({
      ...item,
      sno: startIndex + index + 1,
    }))
  }

  useEffect(() => {
    if (closedType === 'owner') {
      if (closedProductMemberData && closedProductMemberData.length > 0) {
        const dataWithSerialNumbers = addSerialNumbers(closedProductMemberData)
        if (dataWithSerialNumbers.length < sizeRef.current) {
          hasMoreRef.current = false
        }
        setData((prevData) => [...prevData, ...dataWithSerialNumbers])
        pageRef.current += 1
      }
    } else {
      if (closedContractMemberActivityData && closedContractMemberActivityData.length > 0) {
        const dataWithSerialNumbers = addSerialNumbers(closedContractMemberActivityData)
        if (dataWithSerialNumbers.length < sizeRef.current) {
          hasMoreRef.current = false
        }
        setData((prevData) => [...prevData, ...dataWithSerialNumbers])
        pageRef.current += 1
      }
    }
    setCommonLoader(false)
  }, [closedContractMemberActivityData, closedProductMemberData, closedType])

  const truncateString = (str, num) => {
    if (!str) {
      return '' // or you can return str itself, which would be null or undefined
    }
    return str.length > num ? `${str.substring(0, num)}...` : str
  }

  const keyType = closedType == 'owner' ? 'task_user_name' : 'userName'
  const approverStatus = closedType == 'owner' ? 'supervisor_approved' : 'finalApproveStatus'

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
      dataIndex: keyType,
      key: keyType,
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
        const truncatedProductName = truncateString(row.productName, 18)
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
      dataIndex: approverStatus,
      key: approverStatus,
      width: 15,
      render: (text) => {
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
        return <div className={className}>{text}</div>
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
      setCommonLoader(true)
      if (closedType === 'owner') {
        dispatch(
          getClosedProductMemberActivity(
            pageRef.current,
            sizeRef.current,
            categoryRef.current,
            statusRef.current,
          ),
        )
      } else {
        dispatch(
          getClosedContractMemberActivity(
            pageRef.current,
            sizeRef.current,
            categoryRef.current,
            statusRef.current,
          ),
        )
      }
    }
  }

  useEffect(() => {
    setCommonLoader(true)
    pageRef.current = 0
    hasMoreRef.current = true
    setData([])
    if (closedType === 'owner') {
      categoryRef.current = 'default'
      if (selectStatus !== null && selectStatus !== '') {
        if (selectStatus == 'Reject') {
          statusRef.current = 'Rejected'
        } else {
          statusRef.current = selectStatus
        }
      } else {
        statusRef.current = 'all'
      }
      dispatch(
        getClosedProductMemberActivity(
          pageRef.current,
          sizeRef.current,
          categoryRef.current,
          statusRef.current,
        ),
      )
    } else {
      if (selectStatus !== null && selectStatus !== '') {
        categoryRef.current = 'status'
        statusRef.current = selectStatus
      } else {
        categoryRef.current = 'default'
        statusRef.current = ''
      }
      dispatch(
        getClosedContractMemberActivity(
          pageRef.current,
          sizeRef.current,
          categoryRef.current,
          statusRef.current,
        ),
      )
    }
  }, [dispatch, selectStatus, closedType])

  const handleScroll = useCallback(
    debounce(() => {
      if (!tableBodyRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        fetchMoreData()
      }
    }, 100),
    [],
  )

  useEffect(() => {
    const tableBody = document.querySelector('.closedTable .ant-table-body')
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
    <div className="db_table closed-table" style={{ height: '349px ' }}>
      <style>{`
        .ant-table-body {
          scrollbar-width: thin;
        }
        .closed-table .ant-table-wrapper .ant-table-thead > tr > th {
          color: #919EAB !important;
          font-size: 12px !important;
          padding: 12px !important;
        }
        .closed-table .ant-table-cell {
          font-size: 12px !important;
          color: #A5A3A4 !important;
          font-weight: 600;
        }
      `}</style>
      <Table
        columns={columns}
        dataSource={data}
        className="db_table_content closedTable"
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

ClosedActivityTable.propTypes = {
  selectStatus: PropTypes.any,
  closedType: PropTypes.string.isRequired,
}

export default ClosedActivityTable
