import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { getTimesheetStatusBasedType } from 'src/redux/Dashboard/action'
import { CSpinner } from '@coreui/react'
import debounce from 'lodash.debounce'

const TimeSheetStatusTable = ({ type, filterValue }) => {
  const [commonLoader, setCommonLoader] = useState(true)
  const dispatch = useDispatch()
  const [data, setData] = useState([])
  const pageRef = useRef(0)
  const filterRef = useRef(filterValue)
  const searchRef = useRef(false)
  const hasMoreRef = useRef(true)
  const typeRef = useRef('')
  const sizeRef = useRef(5)
  const timesheetStatus = useSelector((state) => state.dashboard?.timesheetStatusRoleBased)
  const tableBodyRef = useRef(null)

  const addSerialNumbers = (data) => {
    const startIndex = pageRef.current * sizeRef.current
    return data.map((item, index) => ({
      ...item,
      sno: startIndex + index + 1,
    }))
  }

  useEffect(() => {
    if (timesheetStatus && timesheetStatus.length > 0) {
      const dataWithSerialNumbers = addSerialNumbers(timesheetStatus)
      if (dataWithSerialNumbers.length < sizeRef.current) {
        hasMoreRef.current = false
      }
      setData((prevData) => [...prevData, ...dataWithSerialNumbers])
      pageRef.current += 1
    }
    setCommonLoader(false)
  }, [timesheetStatus])

  const truncateString = (str, num) => {
    if (!str) {
      return '' // or you can return str itself, which would be null or undefined
    }
    return str.length > num ? `${str.substring(0, num)}...` : str
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 50,
      fixed: 'left',
    },
    {
      title: 'Member',
      dataIndex: 'member',
      key: 'member',
      fixed: 'left',
      width: 150,
      render: (text) => truncateString(text, 12),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Supervisor',
      dataIndex: 'supervisor',
      key: 'supervisor',
      width: 150,
    },
    {
      title: '1st Approval',
      dataIndex: '1stApproval',
      key: '1stApproval',
      width: 100,
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
        return <div className={className}>{text === 'Reject' ? 'Rejected' : text}</div>
      },
    },
    {
      title: '1st Remarks',
      dataIndex: '1stRemarks',
      key: '1stRemarks',
      width: 200,
      render: (text) => (text === '' ? '--' : truncateString(text, 20)),
    },
    {
      title: '2nd Approval',
      dataIndex: '2ndApproval',
      key: '2ndApproval',
      width: 100,
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
        return <div className={className}>{text === 'Reject' ? 'Rejected' : text}</div>
      },
    },
    {
      title: '2nd Remarks',
      dataIndex: '2ndRemarks',
      key: '2ndRemarks',
      width: 200,
      render: (text) => (text === '' ? '--' : truncateString(text, 20)),
    },
  ]

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      dispatch(
        getTimesheetStatusBasedType(
          pageRef.current,
          searchRef.current,
          typeRef.current,
          filterRef.current,
        ),
      )
    }
  }

  useEffect(() => {
    setCommonLoader(true)
    pageRef.current = 0
    filterRef.current = filterValue
    searchRef.current = filterValue !== ''
    hasMoreRef.current = true
    setData([])
    typeRef.current = type
    dispatch(
      getTimesheetStatusBasedType(pageRef.current, searchRef.current, type, filterRef.current),
    )
  }, [type, filterValue, dispatch])

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
    const tableBody = document.querySelector('.status_table .ant-table-body')
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
    <div className="db_table status_table" style={{ height: '349px' }} id="scrollableDiv">
      <style>{`
        .ant-table-body {
          scrollbar-width: thin;
        }
        // .db_table .ant-table-body::-webkit-scrollbar {
        //   width: 4px !important;
        //   background-color: #EDEDEE;
        // }
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
        dataSource={data}
        className="db_table_content custom-table"
        scroll={{ x: 1300, y: 300 }}
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

TimeSheetStatusTable.propTypes = {
  type: PropTypes.string,
  filterValue: PropTypes.string,
}

export default TimeSheetStatusTable
