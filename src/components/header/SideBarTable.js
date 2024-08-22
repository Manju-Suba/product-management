import React from 'react'
import { Table, Typography } from 'antd'
import { CCard, CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
const SideBarTable = ({ title }) => {
  const columns = [
    {
      title: 'SNo',
      dataIndex: 'sno',
      width: '3%',
      // fixed: 'left',
    },
    {
      title: 'Member',
      dataIndex: 'teammember',
      width: '4%',
    },
    {
      title: 'Date',
      dataIndex: 'activitydate',
      width: '3%',
    },
  ]
  const data = [
    {
      key: '1',
      sno: '1',
      teammember: 'Jeeva',
      activitydate: '24-04-2024',
    },
    {
      key: '2',
      sno: '2',
      teammember: 'Dinesh',
      activitydate: '24-04-2024',
    },
    {
      key: '3',
      sno: '3',
      teammember: 'Jaya',
      activitydate: '24-04-2024',
    },
  ]
  return (
    <div style={{ padding: '5px', paddingBottom: '0px' }}>
      <CCard
        style={{
          backgroundColor: 'white',
          height: '184px',
          padding: '15px',
          paddingBottom: '0px',
          margin: '13px',
          borderRadius: '10px',
          border: 'none',
        }}
        className="mt-3"
      >
        <CRow>
          <CCol>
            <Typography
              style={{
                color: 'rgb(76, 76, 76)',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'default',
              }}
            >
              {title}
            </Typography>
          </CCol>
        </CRow>
        <div className="sidebar_table">
          <Table columns={columns} dataSource={data} pagination={false} scroll={{ y: 87 }} />
        </div>
      </CCard>
    </div>
  )
}
SideBarTable.propTypes = {
  title: PropTypes.string.isRequired,
}
export default SideBarTable
