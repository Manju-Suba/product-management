import { CCard, CCol, CRow } from '@coreui/react'
import { React, useEffect, useState, useRef } from 'react'
import dayjs from 'dayjs'
import { getDecodeData } from 'src/constant/Global'
import { Radio, DatePicker, Typography, Menu, Dropdown, Button, Select } from 'antd'
import PendingTable from './PendingTable'
import ApprovalTable from './ApprovalTable'
import ContractPendingTable from './ContractPendingTable'
import OwnerPendingTable from './OwnerPendingTable'
import DropdownSVG from '../DashboardSVG/DropdownSVG'
import ClosedActivityTable from './ClosedActivityTable'
import PropTypes from 'prop-types'
import 'react-datepicker/dist/react-datepicker.css'
import Downarrowimg from '../../../assets/images/downarrow.png'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

const { RangePicker } = DatePicker

function MemberActivity(widgetLength, widgetTableData, title) {
  const user = getDecodeData()
  const dispatch = useDispatch()
  const [disableContent, setDisableContent] = useState(false)
  const [status, setStatus] = useState('Pending')
  const [startDate, setStartDate] = useState('')
  const [cstatus, setCStatus] = useState('')
  const [selectedItem, setSelectedItem] = useState('Member’s Activity')
  const designation = user?.designation
  const supervisor = user?.superviser
  const finalApprover = user?.finalApprover
  const rangePickerRef = useRef()
  const startDateRef = useRef(null)
  const endDateRef = useRef(null)
  const statusRef = useRef(null)
  const selectedRef = useRef('Member’s Activity')
  const [dateRange, setDateRange] = useState(null)
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableContent])
  useEffect(() => {
    dispatch({ type: 'CLEAR_MEMBER_ACTIVITY' })
  })

  const handleStatusChange = (e) => {
    startDateRef.current = null
    endDateRef.current = null
    statusRef.current = ''
    const newStatus = e.target.value
    dispatch({ type: 'CLEAR_MEMBER_ACTIVITY' })
    setDateRange(null)
    setStatus(newStatus)
  }

  const handleStatus = (val) => {
    if (val !== '' && val !== 'undefined' && val != null) {
      statusRef.current = val
      setCStatus(val)
    } else {
      statusRef.current = ''
      setCStatus('')
    }
  }

  const handleStartDateChange = (date) => {
    if (date !== null) {
      const formattedFromDate = dayjs(date[0]).format('YYYY-MM-DD')
      const formattedToDate = dayjs(date[1]).format('YYYY-MM-DD')
      startDateRef.current = formattedFromDate
      endDateRef.current = formattedToDate
      setStartDate(formattedFromDate)
      setDateRange(date)
    } else {
      startDateRef.current = null
      endDateRef.current = null
      setStartDate('')
    }
  }

  const handleMenuClick = (e) => {
    const { key } = e
    let text = 'Member’s Activity'
    switch (key) {
      case '2':
        text = 'Contract Member’s Activity'
        break
      case '3':
        text = 'Product Member’s Activity'
        break
      default:
        break
    }
    startDateRef.current = ''
    endDateRef.current = ''
    setSelectedItem(text)
    selectedRef.current = text
    setDateRange('')
    setStatus('Pending') // Reset status to "Pending" when changing the dropdown selection
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      {supervisor === 'true' && (
        <Menu.Item key="1">
          <div>Member’s Activity</div>
        </Menu.Item>
      )}
      {finalApprover === 'true' && (
        <Menu.Item key="2">
          <div>Contract Member’s Activity</div>
        </Menu.Item>
      )}
      {designation.includes('Owner') && (
        <Menu.Item key="3">
          <div>Product Member’s activity</div>
        </Menu.Item>
      )}
    </Menu>
  )

  return (
    <div>
      <CCard
        style={{
          height: widgetLength > 2 && widgetTableData == title ? '270px' : '440px',
          border: 'none',
          marginBottom: '10px',
        }}
      >
        <div style={{ paddingTop: '5px', padding: '10px', paddingBottom: '0px' }}>
          <CRow>
            <CCol
              xs={12}
              sm={status === 'Pending' ? 12 : 12 || status === 'Closed' ? 12 : 12}
              md={status === 'Pending' ? 5 : 5 || status === 'Closed' ? 5 : 5}
              lg={sidebarShow ? 3 : status === 'Pending' ? 3 : 6 || status === 'Closed' ? 3 : 6}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div>
                {supervisor === 'true' &&
                finalApprover === 'false' &&
                !designation.includes('Owner') ? (
                  <div>
                    <Typography
                      style={{
                        fontSize: '14px',
                        color: '#161C24',
                        fontWeight: '600',
                        paddingLeft: '5px',
                      }}
                      className="DB_ts_lable"
                    >
                      Member’s Activity
                    </Typography>
                  </div>
                ) : (
                  <div>
                    <Dropdown
                      overlay={menu}
                      className="dropdown_box"
                      disabled={sidebarShow === true}
                    >
                      <Button className="dropdown_button">
                        <span className="dropdown_item">{selectedItem}</span>
                        <span>
                          <DropdownSVG width="9px" height="6" fill="#FF2D2D" stopColor="#FF2D2D" />
                        </span>
                      </Button>
                    </Dropdown>
                  </div>
                )}
              </div>
            </CCol>
            <CCol
              xs={8}
              sm={status === 'Pending' ? 12 : 12 || status === 'Closed' ? 12 : 12}
              md={
                sidebarShow === true
                  ? 9
                  : status === 'Pending'
                  ? 7
                  : 7 || status === 'Closed'
                  ? 7
                  : 7
              }
              lg={
                sidebarShow === true
                  ? 8
                  : status === 'Pending'
                  ? 5
                  : 6 || status === 'Closed'
                  ? 5
                  : 6
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '2px',
              }}
            >
              <Radio.Group onChange={handleStatusChange}>
                {selectedRef.current == 'Member’s Activity' ? (
                  <>
                    <Radio.Button
                      className="mem_pending"
                      value="Pending"
                      style={{
                        backgroundColor: status === 'Pending' ? '#FFAA001A' : 'initial',
                        borderColor: status === 'Pending' ? '#FFAA001A' : 'none',
                        color: status === 'Pending' ? '#FFAA00' : '#D1D1D1',
                        width: '76px',
                      }}
                    >
                      Pending
                    </Radio.Button>
                    <Radio.Button
                      className="mem_approved"
                      value="Approved"
                      style={{
                        backgroundColor: status === 'Approved' ? '#EBF8F2' : 'initial',
                        borderColor: status === 'Approved' ? '#EBF8F2' : 'none',
                        color: status === 'Approved' ? '#00ab55' : '#D1D1D1',
                        width: '84px',
                      }}
                    >
                      Approved
                    </Radio.Button>
                    <Radio.Button
                      className="mem_rejected"
                      value="Rejected"
                      style={{
                        backgroundColor: status === 'Rejected' ? '#E40E2C0D' : 'initial',
                        borderColor: status === 'Rejected' ? '#E40E2C0D' : 'none',
                        color: status === 'Rejected' ? '#e40e2d' : '#D1D1D1',
                        width: '78px',
                      }}
                    >
                      Rejected
                    </Radio.Button>
                  </>
                ) : selectedRef.current == 'Contract Member’s Activity' ? (
                  <>
                    <Radio.Button
                      className="mem_pending"
                      value="Pending"
                      style={{
                        backgroundColor: status === 'Pending' ? '#FFAA001A' : 'initial',
                        borderColor: status === 'Pending' ? '#FFAA001A' : 'none',
                        color: status === 'Pending' ? '#FFAA00' : '#D1D1D1',
                      }}
                    >
                      Pending
                    </Radio.Button>
                    <Radio.Button
                      className="mem_closed"
                      value="Closed"
                      style={{
                        backgroundColor: status === 'Closed' ? '#E40E2C0D' : 'initial',
                        borderColor: status === 'Closed' ? '#E40E2C0D' : 'none',
                        color: status === 'Closed' ? '#e40e2d' : '#D1D1D1',
                      }}
                    >
                      Closed
                    </Radio.Button>
                  </>
                ) : (
                  <>
                    <Radio.Button
                      className="mem_pending"
                      value="Pending"
                      style={{
                        backgroundColor: status === 'Pending' ? '#FFAA001A' : 'initial',
                        borderColor: status === 'Pending' ? '#FFAA001A' : 'none',
                        color: status === 'Pending' ? '#FFAA00' : '#D1D1D1',
                      }}
                    >
                      Pending
                    </Radio.Button>
                    <Radio.Button
                      className="mem_closed"
                      value="Closed"
                      style={{
                        backgroundColor: status === 'Closed' ? '#E40E2C0D' : 'initial',
                        borderColor: status === 'Closed' ? '#E40E2C0D' : 'none',
                        color: status === 'Closed' ? '#e40e2d' : '#D1D1D1',
                      }}
                    >
                      Closed
                    </Radio.Button>
                  </>
                )}
              </Radio.Group>
            </CCol>
            {status !== 'Closed' && (
              <CCol xs={4} sm={6} md={6} lg={sidebarShow === true ? 8 : 4}>
                <RangePicker
                  variant={'borderless'}
                  style={{ width: '90%', borderBottom: ' 1px solid #ced4da ', borderRadius: '0px' }}
                  ref={rangePickerRef}
                  value={dateRange}
                  onChange={handleStartDateChange}
                  format="DD MMM, YYYY"
                  // format="YYYY/MM/DD"
                  allowClear
                  disabled={sidebarShow === true}
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </CCol>
            )}

            {status === 'Closed' && (
              <CCol xs={12} md={3}>
                <Select
                  suffixIcon={
                    <img
                      src={Downarrowimg}
                      alt="Downarrowimg"
                      style={{ width: '10px', height: '6px' }}
                    />
                  }
                  className="contract_members_activity_select custom-select_closeact con-cls-status"
                  allowClear
                  placeholder="Choose Status"
                  options={[
                    {
                      value: 'Approved',
                      label: 'Approved',
                    },
                    {
                      value: 'Reject',
                      label: 'Rejected',
                    },
                  ]}
                  onChange={(value) => handleStatus(value)}
                />
              </CCol>
            )}
          </CRow>
        </div>

        <CRow>
          <CCol style={{ marginTop: '20px' }}>
            {status === 'Approved' && selectedItem === 'Member’s Activity' && (
              <ApprovalTable
                typeValue="Approved"
                startDate={startDateRef.current}
                endDate={endDateRef.current}
              />
            )}
            {status === 'Rejected' && selectedItem === 'Member’s Activity' && (
              <ApprovalTable
                typeValue="Reject"
                startDate={startDateRef.current}
                endDate={endDateRef.current}
              />
            )}
            {status === 'Pending' && selectedItem === 'Member’s Activity' && (
              <PendingTable startDate={startDateRef.current} endDate={endDateRef.current} />
            )}
            {status === 'Pending' && selectedItem === 'Contract Member’s Activity' && (
              <ContractPendingTable startDate={startDateRef.current} endDate={endDateRef.current} />
            )}
            {status === 'Closed' && selectedItem === 'Contract Member’s Activity' && (
              <ClosedActivityTable selectStatus={statusRef.current} closedType="contract" />
            )}
            {status === 'Pending' && selectedItem === 'Product Member’s Activity' && (
              <OwnerPendingTable startDate={startDateRef.current} endDate={endDateRef.current} />
            )}
            {status === 'Closed' && selectedItem === 'Product Member’s Activity' && (
              <ClosedActivityTable selectStatus={statusRef.current} closedType="owner" />
            )}
          </CCol>
        </CRow>
      </CCard>
    </div>
  )
}
MemberActivity.propTypes = {
  widgetLength: PropTypes.number.isRequired,
  widgetTableData: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}
export default MemberActivity
