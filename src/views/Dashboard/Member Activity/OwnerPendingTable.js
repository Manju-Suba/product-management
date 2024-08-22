import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Checkbox, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import CrossSvg from 'src/views/svgImages/CrossSvg'
import CheckSvg from 'src/views/svgImages/CheckSvg'
import { getOwnerMemberActivity, ownerMemberStatusUpdate } from 'src/redux/memberActivity/action'
import debounce from 'lodash.debounce'
import { CSpinner } from '@coreui/react'
import ApprovedConfirmModal from '../../modal/ApprovedConfirmModel'
import RejectConfirmModal from '../../modal/RejectConfirmModal'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'

const OwnerPendingTable = ({ startDate, endDate }) => {
  const dispatch = useDispatch()
  const [cdata, setCdata] = useState([])
  const tableBodyRef = useRef(null)
  const pageRef = useRef(0)
  const sizeRef = useRef(5)
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)
  const categoryRef = useRef('default')
  const hasMoreRef = useRef(true)
  const [commonLoader, setCommonLoader] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const selectedRef = useRef('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [rejectStatus, setRejectStatus] = useState('')
  const [singleId, setSingleId] = useState()
  const [singleApprovedId, setSingleApprovedId] = useState('')
  const [openSelectAll, setOpenSelectAll] = useState(false)
  const [openSelectRejectAll, setOpenSelectRejectAll] = useState(false)
  const [open, setOpen] = useState(false)
  const [approvedStatusAll, setApprovedStatusAll] = useState('')
  const [approvedStatus, setApprovedStatus] = useState('')
  const [headerLabel, setHeaderLabel] = useState('')
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)
  const getOwnerMemberData = useSelector((state) => state.memberactivity?.ownerMemberData)

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     categoryRef.current = 'date'
  //     startDateRef.current = startDate
  //     endDateRef.current = endDate
  //   } else {
  //     categoryRef.current = 'default'
  //   }
  //   setSelectedRows([])
  //   selectedRef.current = ''
  //   setHeaderLabel('')
  //   pageRef.current = 0
  //   hasMoreRef.current = true
  //   setCommonLoader(true)
  //   setCdata([])
  //   dispatch(
  //     getOwnerMemberActivity(
  //       pageRef.current,
  //       sizeRef.current,
  //       categoryRef.current,
  //       startDateRef.current,
  //       endDateRef.current,
  //     ),
  //   )
  // }, [startDate, endDate])

  const showPopconfirm = (status, rowId) => {
    setOpen(true)
    setSingleApprovedId(rowId)
    setApprovedStatus(status)
  }

  const showPopconfirmAll = (status) => {
    if (status === 'Approved') {
      setOpenSelectAll(true)
      setApprovedStatusAll('Approved')
    } else if (status === 'Reject') {
      setOpenSelectRejectAll(true)
      setApprovedStatusAll('Reject')
    }
  }

  const truncateString = (str, num) => {
    if (!str) {
      return '' // or you can return str itself, which would be null or undefined
    }
    return str.length > num ? `${str.substring(0, num)}...` : str
  }

  useEffect(() => {
    if (getOwnerMemberData && getOwnerMemberData.length > 0) {
      const dataWithSerialNumbers = getOwnerMemberData.map((item, index) => ({
        ...item,
        key: `${pageRef.current}-${index}`,
      }))
      if (dataWithSerialNumbers.length < sizeRef.current) {
        hasMoreRef.current = false
      }
      setCdata((prevData) => [...prevData, ...dataWithSerialNumbers])
      pageRef.current += 1
      setCommonLoader(false)
    } else {
      setCommonLoader(false)
    }
  }, [getOwnerMemberData])

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

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      dispatch(
        getOwnerMemberActivity(
          pageRef.current,
          sizeRef.current,
          categoryRef.current,
          startDateRef.current,
          endDateRef.current,
        ),
      )
    }
  }

  useEffect(() => {
    const tableBody = document.querySelector('.cpt .ant-table-body')
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

  useEffect(() => {
    if (startDate && endDate) {
      categoryRef.current = 'date'
      startDateRef.current = startDate
      endDateRef.current = endDate
    } else {
      categoryRef.current = 'default'
    }

    setSelectedRows([])
    selectedRef.current = ''
    setHeaderLabel('')
    setCommonLoader(true)
    pageRef.current = 0 // Reset pagination
    setCdata([]) // Clear current data
    hasMoreRef.current = true // Reset hasMore flag
    dispatch(
      getOwnerMemberActivity(
        pageRef.current,
        sizeRef.current,
        categoryRef.current,
        startDateRef.current,
        endDateRef.current,
      ),
    )
  }, [dispatch, startDate, endDate])

  const columns = [
    {
      title: (
        <div className="checkbox-container">
          <Checkbox
            id="flexCheckDefault"
            onChange={(e) => handleHeaderCheck(e.target.checked)}
            checked={selectedRows.length === cdata.length && cdata.length > 0}
            disabled={sidebarShow === true || cdata.length === 0}
          />
        </div>
      ),
      width: 10,
      fixed: 'left',
      render: (text, row) => (
        <div className="checkbox-container">
          <Checkbox
            id="flexCheckDefault"
            checked={selectedRows.includes(row.id)}
            onChange={(e) => handleRowCheck(row.id, e.target.checked)}
            disabled={sidebarShow === true}
          />
        </div>
      ),
    },

    {
      title: 'Team member',
      dataIndex: 'userName',
      key: 'userName',
      fixed: 'left',
      width: 20,
      render: (text) => truncateString(text, 12),
    },
    {
      title: 'Activity date',
      width: 18,
      dataIndex: 'activity_date',
      key: 'activity_date',
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: 25,
      render: (text, row) => {
        const truncatedProductName = truncateString(row.productName, 12)
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
      width: 22,
      render: (text) => truncateString(text, 12),
    },
    {
      title: 'Hours',
      dataIndex: 'hours',
      key: 'hours',
      width: 10,
    },
    {
      title: 'Remarks',
      width: 30,
      dataIndex: 'description',
      key: 'description',
      render: (text) => truncateString(text, 20),
    },
    {
      title: 'Action',
      width: 18,
      dataIndex: 'action',
      fixed: 'right',
      key: 'action',
      render: (text, row) => (
        <div>
          <button
            className="btn border-0 text-c text-secondary check-button"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            disabled={selectedRows.includes(row.id)}
            onClick={() => showPopconfirm('Approved', row.id)}
          >
            <CheckSvg width="11" height="9" viewBox="0 0 14 10" fill="#A5A1A1" />
          </button>
          <button
            className="btn border-0 text-c text-secondary cross-button"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            onClick={() => showModal(row.id, 'Reject')}
            disabled={selectedRows.includes(row.id)}
          >
            <CrossSvg width="9" height="11" viewBox="0 0 14 10" fill="#A5A1A1" />
          </button>
        </div>
      ),
    },
  ]

  const handleHeaderCheck = (isChecked) => {
    if (isChecked) {
      const allRowIds = cdata.map((row) => row.id)
      setSelectedRows(allRowIds)
      selectedRef.current = ''
      setHeaderLabel(`${allRowIds.length} Selected`)
    } else {
      setSelectedRows([])
      setHeaderLabel('')
      selectedRef.current = ''
    }
  }

  const handleRowCheck = (id, isChecked) => {
    if (isChecked) {
      setSelectedRows((prevSelectedRows) => {
        const updatedSelectedRows = [...prevSelectedRows, id]
        selectedRef.current = updatedSelectedRows // Update the ref directly
        setHeaderLabel(`${selectedRef.current.length} Selected`)
        return updatedSelectedRows
      })
    } else {
      setSelectedRows((prevSelectedRows) => {
        const updatedSelectedRows = prevSelectedRows.filter((selectedKey) => selectedKey !== id)
        selectedRef.current = updatedSelectedRows // Update the ref directly
        if (updatedSelectedRows.length > 0) {
          setHeaderLabel(`${selectedRef.current.length} Selected`)
        } else {
          setHeaderLabel('')
        }
        return updatedSelectedRows
      })
    }
  }

  const showModal = (id, status) => {
    setIsModalOpen(true)
    setSingleId(id)
    setRejectStatus(status)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleApproveCancel = () => {
    setOpen(false)
  }

  const handleApproveCancelAll = () => {
    setOpenSelectAll(false)
    setSelectedRows([])
    setHeaderLabel('')
  }

  const handleRejectCancelAll = () => {
    setOpenSelectRejectAll(false)
  }

  const handleApproveActivity = async (status, id, remarks) => {
    return await statusChange(rejectStatus, id, remarks)
  }

  const handleApproved = async (status, singleApprovedId, remarks) => {
    return await statusChange(approvedStatus, singleApprovedId, remarks)
  }

  const handleButtonClick = async (status, selectedRows, remarks) => {
    return await statusChange(status, selectedRows, remarks)
  }

  const statusChange = async (statusValue, id, remarks) => {
    try {
      const response = await dispatch(ownerMemberStatusUpdate(statusValue, id, remarks))
      if (response && response.status === true) {
        const message = `Activity ${statusValue} Successfully`
        toast.success(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000,
        })
        pageRef.current = 0
        setCdata([]) // Clear current data
        hasMoreRef.current = true
        dispatch(
          getOwnerMemberActivity(
            pageRef.current,
            sizeRef.current,
            categoryRef.current,
            startDateRef.current,
            endDateRef.current,
          ),
        )
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
    setIsModalOpen(false)
    setOpenSelectRejectAll(false)
    setOpen(false)
    setOpenSelectAll(false)
    setSelectedRows([])
    setHeaderLabel('')
    selectedRef.current = ''
    pageRef.current = 0
    hasMoreRef.current = true
    dispatch(
      getOwnerMemberActivity(
        pageRef.current,
        sizeRef.current,
        categoryRef.current,
        startDateRef.current,
        endDateRef.current,
      ),
    )
  }

  return (
    <div className="db_table" style={{ height: '349px', overflow: 'auto' }} id="scrollableDiv">
      <style>{`
        .ant-table-body {
          scrollbar-width: thin;
        }
        .db_table .ant-table-wrapper .ant-table-thead > tr > th {
          color: #919EAB !important;
          font-size: 12px !important;
          padding: 12px !important;
        }
        .db_table .ant-table-cell {
          font-size: 12px !important;
          color: #A5A3A4 !important;
          font-weight: 600;
        }
      `}</style>
      {headerLabel && (
        <div
          className="table-header"
          style={{ display: 'grid', gridTemplateColumns: '10% 1fr auto', alignItems: 'center' }}
        >
          <div className="table-head-selected text-center text-c" style={{ paddingTop: '15px' }}>
            <Checkbox
              id="flexCheckDefault"
              className="checkbox_design"
              checked={selectedRows.length === cdata.length && cdata.length > 0}
              onChange={(e) => handleHeaderCheck(e.target.checked)}
            />
          </div>
          <div
            className="table-head-selected text-c"
            style={{ textAlign: 'center', padding: '17px 0px 4px 0px' }}
          >
            <span style={{ color: '#f50505' }}>{headerLabel}</span>
          </div>
          <div
            className="table-head-selected"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <button
              className="btn border-0 text-c text-secondary check-button"
              style={{ fontSize: '12px', padding: '4px 8px' }}
              type="button"
              onClick={() => showPopconfirmAll('Approved')}
            >
              <CheckSvg width="11" height="9" viewBox="0 0 14 10" fill="#00ab55" />
            </button>
            <button
              className="btn border-0 text-c text-secondary cross-button"
              style={{ fontSize: '12px', padding: '4px 8px' }}
              onClick={() => showPopconfirmAll('Reject')}
            >
              <CrossSvg width="9" height="11" viewBox="0 0 14 10" fill="#e40e2d" />
            </button>
          </div>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={cdata}
        className="cpt db_table_content"
        scroll={{ x: 1000, y: 300 }}
        pagination={false}
        loading={{
          spinning: commonLoader,
          indicator: <CSpinner color="danger" />,
        }}
      />
      {!hasMoreRef.current && cdata.length !== 0 && cdata.length > 5 && (
        <p style={{ textAlign: 'center' }}>
          <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
        </p>
      )}
      {isModalOpen && (
        <RejectConfirmModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          handleApprove={handleApproveActivity}
          id={singleId}
          headContent="Activity"
          resetFunc={resetFormValues}
        />
      )}
      {open && (
        <ApprovedConfirmModal
          isModalOpen={open}
          handleCancel={handleApproveCancel}
          handleApprove={handleApproved}
          id={singleApprovedId}
          headContent="Activity"
          resetFunc={resetFormValues}
        />
      )}
      {openSelectAll && (
        <ApprovedConfirmModal
          isModalOpen={openSelectAll}
          handleCancel={handleApproveCancelAll}
          handleApprove={(remarks) => handleButtonClick(approvedStatusAll, selectedRows, remarks)}
          headContent="Activity"
          resetFunc={resetFormValues}
        />
      )}
      {openSelectRejectAll && (
        <RejectConfirmModal
          isModalOpen={openSelectRejectAll}
          handleCancel={handleRejectCancelAll}
          handleApprove={(remarks) => handleButtonClick(approvedStatusAll, selectedRows, remarks)}
          headContent="Activity"
          resetFunc={resetFormValues}
        />
      )}
    </div>
  )
}

OwnerPendingTable.propTypes = {
  startDate: PropTypes.any,
  endDate: PropTypes.any,
}
export default OwnerPendingTable
