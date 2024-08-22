import { CCard, CCol, CRow } from '@coreui/react'
import { Dropdown, Input, Typography } from 'antd'
import React, { useState } from 'react'
import searchicon from '../../../assets/images/form/search-Icon.png'
import { IoMdArrowDropdown } from 'react-icons/io'
import TimeSheetStatusTable from './TimeSheetstatusTable'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import TimeSheetstatusTableContract from './TimeSheetstatusTableContract'

function TimeSheetStatus({ widgetLength, widgetTableData, title }) {
  const [selectedItem, setSelectedItem] = useState('1') // Initialize with default selection
  const [searchValue, setSearchValue] = useState('')
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)

  const items = [
    {
      key: '1',
      label: <div>Contract Member`s</div>,
    },
    {
      key: '2',
      label: <div>On Role Member`s</div>,
    },
  ]

  const handleMenuClick = (e) => {
    setSelectedItem(e.key)
  }
  const handleSearch = (e) => {
    setSearchValue(e)
  }

  return (
    <div>
      <CCard
        style={{
          height: widgetLength > 2 && widgetTableData === title ? '270px' : '440px',
          border: 'none',
          marginBottom: '10px',
        }}
      >
        <div
          style={{
            paddingTop: '10px',
            padding: '12px',
            paddingBottom: '9px',
          }}
        >
          <CRow>
            <CCol
              xs={12}
              md={sidebarShow === true ? 12 : 12}
              lg={sidebarShow === true ? 9 : 8}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div>
                <div
                  style={
                    sidebarShow === true
                      ? { fontSize: '11px', color: '#161C24', fontWeight: '600' }
                      : {
                          fontSize: '14px',
                          color: '#161C24',
                          fontWeight: '600',
                        }
                  }
                  className="DB_ts_lable"
                >
                  TimeSheet Status <span>- &nbsp;</span>
                </div>
              </div>
              <div
                className={sidebarShow === true ? 'dashboard_dropdown_side' : 'dashboard_dropdown'}
              >
                <Dropdown
                  style={
                    sidebarShow === true
                      ? { fontSize: '11px', color: '#d30000', height: '20px', cursor: 'pointer' }
                      : {
                          fontSize: '14px',
                          color: '#d30000',
                          height: '20px',
                          cursor: 'pointer',
                        }
                  }
                  disabled={sidebarShow === true}
                  menu={{
                    items,
                    onClick: handleMenuClick,
                  }}
                >
                  <a onClick={(e) => e.preventDefault()}>
                    {selectedItem === '1' ? 'Contract Member`s' : 'On Role Member`s'}
                    <IoMdArrowDropdown
                      className="db_Dropdown_icon"
                      style={{ fontSize: '14px', color: '#d30000', cursor: 'pointer' }}
                    />
                  </a>
                </Dropdown>
              </div>
            </CCol>
            <CCol xs={12} md={6} lg={sidebarShow === true ? 3 : 4}>
              <Input
                className="db_inputbox"
                placeholder="Search"
                style={{ borderBottom: '1px solid #ced4da ', borderRadius: '0px' }}
                // className="border-0 user-select-sec "
                disabled={sidebarShow === true}
                onChange={(e) => handleSearch(e.target.value)}
                variant={'borderless'}
                prefix={
                  <img
                    src={searchicon}
                    alt="search icon"
                    style={{ width: '14px', height: '14px' }}
                    className="search-icon"
                  />
                }
              />
            </CCol>
          </CRow>
        </div>

        <CRow>
          <CCol style={{ marginTop: '20px' }}>
            {selectedItem === '1' ? (
              <TimeSheetstatusTableContract type="Contract" filterValue={searchValue} />
            ) : (
              <TimeSheetStatusTable type="On Role" filterValue={searchValue} />
            )}
          </CCol>
        </CRow>
      </CCard>
    </div>
  )
}

TimeSheetStatus.propTypes = {
  widgetLength: PropTypes.number,
  widgetTableData: PropTypes.string,
  title: PropTypes.string,
}

export default TimeSheetStatus
