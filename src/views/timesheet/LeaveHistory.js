import React, { useState, useEffect, useRef, useCallback } from 'react'
import { DatePicker, Breadcrumb, Button, Table } from 'antd'
import { CCol, CRow, CSpinner } from '@coreui/react'
import { getHeaders } from 'src/constant/Global'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import useAxios from 'src/constant/UseAxios'
import Calendarimg from '../../assets/images/calendar-image.png'
import dayjs from 'dayjs'
import WithdrawSvg from '../svgImages/WithdrawSvg'
import WarningModal from '../modal/WarningModal'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'

const LeaveHistory = ({ formatDate }) => {
  let api = useAxios()
  const [leaveDate, setLeaveDate] = useState(null)
  const [leaveTable, setLeaveTable] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [singleId, setSingleId] = useState()
  const [abortController, setAbortController] = useState(new AbortController())
  const hasMoreRef = useRef(true)
  const pageRef = useRef(0)
  const [commonLoader, setCommonLoader] = useState(true)
  const tableBodyRef = useRef(null)
  const [isNorMore, setIsNorMore] = useState(false)

  useEffect(() => {
    hasMoreRef.current = true
    getLeaveHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDateChange = (date, dateString) => {
    const newDate = dayjs(date).format('YYYY-MM-DD')
    pageRef.current = 0
    hasMoreRef.current = true
    setCommonLoader(true)
    setLeaveTable([])
    if (date === undefined || date === null) {
      getLeaveHistory()
    } else {
      getLeaveHistory(newDate)
    }
  }

  const getLeaveHistory = async (date) => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setLeaveTable([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    let url
    if (date === null || date === undefined) {
      url = `activity/attendanceSheet/byuser?page=${pageRef.current}&size=10`
    } else {
      url = `activity/attendanceSheet/byuser?page=${pageRef.current}&size=10&date=${date}`
    }
    try {
      const response = await api.get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      const data = response.data.data
      if (pageRef.current === 0) {
        setLeaveTable(data.content)
      } else {
        setLeaveTable((prevUserData) => {
          return [...prevUserData, ...data.content]
        })
      }
      if (data.last === true) {
        hasMoreRef.current = false
      } else {
        hasMoreRef.current = true
      }
      pageRef.current = pageRef.current + 1
      setCommonLoader(false)
    } catch (error) {}
  }

  //withdraw the leave
  const showModal = (id, date) => {
    setIsModalOpen(true)
    setSingleId(id)
    setLeaveDate(dayjs(date).format('DD MMM, YYYY'))
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleWithdrawLeave = async (id) => {
    const url = `activity/attendance/delete?id=${id}`
    try {
      const response = await api.put(url, null, {
        headers: getHeaders('json'),
      })
      if (response && response.data) {
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
        return response.data
      } else {
        throw new Error('Empty response received from the server')
      }
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
      throw error
    }
  }

  const resetFormValues = () => {
    pageRef.current = 0
    setLeaveTable([])
    setCommonLoader(true)
    hasMoreRef.current = true
    getLeaveHistory()
    setIsModalOpen(false)
  }

  const columns = [
    {
      title: 'SI.No',
      dataIndex: 'index',
      key: 'index',
      width: '4%',
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
      title: 'Date',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      width: '7%',
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
      dataIndex: 'status',
      key: 'status',
      width: '45%',
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
        return text
      },
    },
    {
      title: 'Withdraw',
      dataIndex: 'action',
      key: 'action',
      width: '5%',
      align: 'center',
      render: (_, record) => {
        if (record.key === 'noMoreData') {
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
            onClick={() => showModal(record.id, record.appliedDate)}
          >
            <WithdrawSvg width="15" height="18" viewBox="0 0 15 18" fill="#A5A1A1" />
          </Button>
        )
      },
    },
  ]

  const displayData = [
    ...leaveTable.map((row, index) => ({
      key: row.id,
      id: row.id,
      index: index + 1,
      appliedDate: row.appliedDate,
      status: row.status,
    })),
  ]

  if (!hasMoreRef.current && displayData.length !== 0 && displayData.length > 10) {
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
      getLeaveHistory()
    }
  }

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
    const tableBody = document.querySelector('.design_table .ant-table-body')
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
    <>
      <CRow>
        <CCol xs={12} sm={6} md={9}>
          <h6 className="timesheet-heading mt-3" style={{ marginLeft: '30px' }}>
            Leave History - Time Sheet
          </h6>
          <Breadcrumb
            style={{ marginLeft: '30px' }}
            className="bread-tab"
            separator={<span className="breadcrumb-separator">|</span>}
            items={[
              {
                title: (
                  <Link
                    rel="Dashboard"
                    to={'/dashboard'}
                    className="bread-items text-decoration-none text-secondary "
                  >
                    Dashboard
                  </Link>
                ),
              },
              {
                title: (
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Leave History - Time Sheet
                  </span>
                ),
              },
            ]}
          />
        </CCol>
        <CCol xs={2} sm={2} className="draft-sumbit-button ">
          <CRow>
            <CCol className="draft-rightside-header draft-rs-datepicker submit_datepicker">
              <DatePicker
                variant={'borderless'}
                id="date"
                type="date"
                name="fieldName"
                placeholder="Choose Date"
                className="form-input-draft input-lg date-picker activity-date "
                onChange={handleDateChange}
                format="DD MMM, YYYY"
                suffixIcon={
                  <img
                    src={Calendarimg}
                    alt="Calendarimg"
                    style={{ width: '13px', height: '13px' }}
                  />
                }
                max={dayjs()}
                active
                allowClear={true}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <div className="mt-2 design_table">
        <style>
          {`
            .design_table .ant-table-body::-webkit-scrollbar {
              display: none !important;
            }
          `}
        </style>
        <Table
          columns={columns}
          dataSource={displayData}
          rowKey="id"
          size={'middle'}
          pagination={false}
          scroll={{ y: 490 }}
          className={`${isNorMore ? 'last-row-table' : ''}`}
          loading={{
            spinning: commonLoader,
            indicator: <CSpinner color="danger" />,
          }}
        />
      </div>
      {isModalOpen && (
        <WarningModal
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}
          handleApprove={handleWithdrawLeave}
          id={singleId}
          headContent="Leave Widthraw"
          date={leaveDate}
          resetFunc={resetFormValues}
        />
      )}
    </>
  )
}

LeaveHistory.propTypes = {
  formatDate: PropTypes.func,
}
export default LeaveHistory
