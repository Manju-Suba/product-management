import React, { useState, useEffect, useRef } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
} from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import { getLeaveHistory } from 'src/redux/timesheet/action'
import { useDispatch, useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import PropTypes from 'prop-types'
import 'react-toastify/dist/ReactToastify.css'

const ContractMembersTable = ({ selectedDate }) => {
  const dispatch = useDispatch()
  const pageRef = useRef(0)
  const sizeRef = useRef(10)
  const dateRef = useRef(selectedDate)
  const hasMoreRef = useRef(true)
  const oDataRef = useRef([]) // Added oDataRef
  const [commonLoader, setCommonLoader] = useState(true)
  const [data, setData] = useState([])

  const leaveHistory = useSelector((state) => state.timesheet?.leaveHistoryList)

  const addSerialNumbers = (data) => {
    const startIndex = pageRef.current * sizeRef.current
    return data.map((item, index) => ({
      ...item,
      sno: startIndex + index + 1,
    }))
  }

  useEffect(() => {
    if (leaveHistory) {
      const dataWithSerialNumbers = addSerialNumbers(leaveHistory)
      if (dataWithSerialNumbers.length > 0) {
        pageRef.current += 1
        setData((prevData) => [...prevData, ...dataWithSerialNumbers])
        oDataRef.current = [...oDataRef.current, ...dataWithSerialNumbers]
      }
      setCommonLoader(false)
    }
  }, [leaveHistory])

  useEffect(() => {
    const tableContainer = document.querySelector('.table-container-s')
    tableContainer.addEventListener('scroll', handleScroll)
    return () => {
      tableContainer.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const handleScroll = () => {
    const tableContainer = document.querySelector('.table-container-s')
    if (
      tableContainer.scrollTop + tableContainer.clientHeight === tableContainer.scrollHeight &&
      hasMoreRef.current
    ) {
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

  let content
  if (leaveHistory.length === 0 && data.length === 0 && !commonLoader) {
    content = <div className="text-c text-center my-3 td-text">No Data Found</div>
  } else if (commonLoader) {
    content = (
      <div className="text-c text-center my-3 td-text">
        <CSpinner color="danger" />
      </div>
    )
  } else {
    content = <div></div>
  }

  return (
    <div className="table-container-s mt-2" style={{ border: 'none' }}>
      <InfiniteScroll
        dataLength={data.length}
        next={handleScroll}
        hasMore={hasMoreRef.current}
        endMessage={
          data.length !== 0 &&
          data.length > 5 && (
            <p style={{ textAlign: 'center' }}>
              <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
            </p>
          )
        }
      >
        <CTable hover>
          <CTableHead className="head-row">
            <CTableRow>
              <CTableHeaderCell
                className="table-head-draft  text-c grid-cell-header text-center"
                scope="col"
                width="10%"
              >
                SI.No
              </CTableHeaderCell>
              <CTableHeaderCell
                className="table-head-draft  text-c grid-cell-header"
                scope="col"
                width="45%"
              >
                Contract Members
              </CTableHeaderCell>
              <CTableHeaderCell
                className="table-head-draft  text-c grid-cell-header"
                scope="col"
                width="45%"
              >
                Supervisors
              </CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {data.map((row, index) => (
              <CTableRow key={`${row.id}-${index}`}>
                <CTableDataCell className="text-c text-center pd-text1 grid-cell" width="10%">
                  {index + 1}
                </CTableDataCell>
                <CTableDataCell
                  className="text-c pd-text1 grid-cell"
                  title={row.appliedDate}
                  width="45%"
                >
                  {row.appliedDate}
                </CTableDataCell>
                <CTableDataCell
                  className="text-c pd-text1 grid-cell"
                  title={row.status}
                  width="45%"
                >
                  {row.status}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
        {content}
      </InfiniteScroll>
    </div>
  )
}
ContractMembersTable.propTypes = {
  selectedDate: PropTypes.any,
}
export default ContractMembersTable
