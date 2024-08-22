import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import CrossSvg from 'src/views/svgImages/CrossSvg'
import CheckSvg from 'src/views/svgImages/CheckSvg'
import debounce from 'lodash.debounce'
import { CSpinner } from '@coreui/react'
import ApprovedConfirmModal from '../modal/ApprovedConfirmModel'
import RejectConfirmModal from '../modal/RejectConfirmModal'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import useAxios from 'src/constant/UseAxios'
import { getHeaders } from 'src/constant/Global'
import { ToastContainer } from 'react-toastify'

const RaiseRequestList = ({ startDate, endDate, memberId, memberName, date, resetComponent }) => {
  const dispatch = useDispatch()
  let api = useAxios()
  const tableBodyRef = useRef(null)
  const pageRef = useRef(0)
  const sizeRef = useRef(5)
  const hasMoreRef = useRef(true)
  const [commonLoader, setCommonLoader] = useState(true)
  const [memberTable, setMemberTable] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const selectedRef = useRef('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [singleId, setSingleId] = useState()
  const [singleApprovedId, setSingleApprovedId] = useState('')
  const [open, setOpen] = useState(false)
  const [approvedStatus, setApprovedStatus] = useState('')
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)
  const [abortController, setAbortController] = useState(new AbortController())

  useEffect(() => {
    setSelectedRows([])
    selectedRef.current = ''
    pageRef.current = 0
    hasMoreRef.current = true
    setCommonLoader(true)
    setMemberTable([])
    getRequestList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, memberId, dispatch])

  const getRequestList = async () => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setMemberTable([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }

    try {
      const response = await api.get(
        `activity/raisedRequest/tosupervisor?page=${pageRef.current}&size=${sizeRef.current}&filter=true&userid=${memberId}&date=${startDate}`,
        {
          headers: getHeaders('json'),
          signal: newAbortController?.signal,
        },
      )
      const data = response.data.data
      if (pageRef.current === 0) {
        setMemberTable(data)
      } else {
        setMemberTable((prevUserData) => {
          const uniqueSet = new Set(prevUserData.map((user) => user.id))
          const newData = data.filter((user) => !uniqueSet.has(user.id))
          return [...prevUserData, ...newData]
        })
      }
      if (data.length < 10) {
        hasMoreRef.current = false
      } else {
        hasMoreRef.current = true
      }
      pageRef.current = pageRef.current + 1
      setCommonLoader(false)
    } catch (error) {
      setCommonLoader(false)
    }
  }

  const showPopconfirm = (status, rowId) => {
    setOpen(true)
    setSingleApprovedId(rowId)
    setApprovedStatus(status)
  }

  const truncateString = (str, num) => {
    if (!str) {
      return '' // or you can return str itself, which would be null or undefined
    }
    return str.length > num ? `${str.substring(0, num)}...` : str
  }

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
      getRequestList()
    }
  }

  useEffect(() => {
    const tableBody = document.querySelector('.ant-table-body')
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

  const columns = [
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: '80%',
      render: (text) => truncateString(text, 12),
    },
    {
      title: 'Action',
      width: '18%',
      dataIndex: 'action',
      fixed: 'right',
      key: 'action',
      render: (text, row) => (
        <div>
          <button
            className="btn border-0 text-c text-secondary check-button"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            disabled={selectedRows.includes(row.id) || sidebarShow === true}
            onClick={() => showPopconfirm('Approved', row.id)}
          >
            <CheckSvg width="11" height="9" viewBox="0 0 14 10" fill="#A5A1A1" />
          </button>
          <button
            className="btn border-0 text-c text-secondary cross-button"
            style={{ fontSize: '12px', padding: '4px 8px' }}
            onClick={() => showModal(row.id, 'Reject')}
            disabled={selectedRows.includes(row.id) || sidebarShow === true}
          >
            <CrossSvg width="9" height="11" viewBox="0 0 14 10" fill="#A5A1A1" />
          </button>
        </div>
      ),
    },
  ]

  const showModal = (id, status) => {
    setIsModalOpen(true)
    setSingleId(id)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleApproveCancel = () => {
    setOpen(false)
  }

  const handleApproved = async (status, singleApprovedId, remarks) => {
    return await handleRaiseApprove(approvedStatus, singleApprovedId, remarks)
  }

  const handleRaiseApprove = async (status, id, remarks) => {
    const url = 'activity/approve/' + id
    const postData = {
      status: status,
      remarks: remarks,
    }
    try {
      const response = await api.put(url, postData, {
        headers: getHeaders('json'),
      })

      if (response?.data) {
        const message = `Request ${status} Successfully`
        toast.success(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 2000,
        })
        return response.data
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message
      toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
      throw error
    }
  }

  const resetFormValues = () => {
    setIsModalOpen(false)
    setOpen(false)
    setSelectedRows([])
    selectedRef.current = ''
    pageRef.current = 0
    hasMoreRef.current = true
    getRequestList()
    resetComponent()
  }

  return (
    <>
      <ToastContainer />
      <div style={{ fontSize: '14px', fontWeight: '600', paddingLeft: '40px' }}>
        {' '}
        {memberName} activity for {date}
      </div>
      <br></br>
      <div className="db_table" style={{ height: '312px' }} id="scrollableDiv">
        <style>{`
          .db_table .ant-table-body::-webkit-scrollbar {
            display: none !important;
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
        <Table
          columns={columns}
          dataSource={memberTable}
          className="db_table_content"
          pagination={false}
          loading={{
            spinning: commonLoader,
            indicator: <CSpinner color="danger" />,
          }}
        />

        {isModalOpen && (
          <RejectConfirmModal
            isModalOpen={isModalOpen}
            handleCancel={handleCancel}
            handleApprove={handleRaiseApprove}
            id={singleId}
            headContent="request"
            resetFunc={resetFormValues}
          />
        )}
        {open && (
          <ApprovedConfirmModal
            isModalOpen={open}
            handleCancel={handleApproveCancel}
            handleApprove={handleApproved}
            id={singleApprovedId}
            headContent="request"
            resetFunc={resetFormValues}
          />
        )}
      </div>
    </>
  )
}

RaiseRequestList.propTypes = {
  startDate: PropTypes.any,
  endDate: PropTypes.any,
  memberId: PropTypes.any,
  memberName: PropTypes.any,
  date: PropTypes.any,
  resetComponent: PropTypes.func,
}
export default RaiseRequestList
