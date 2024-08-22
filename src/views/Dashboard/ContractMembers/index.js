import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Typography, Table } from 'antd'
import multipersonIcon from '../../../assets/images/MultipersonIcon.png'
import multigroupIcon from '../../../assets/images/multiGroup.png'
import { useDispatch, useSelector } from 'react-redux'
import { getcontracterAndSupervisor } from 'src/redux/Dashboard/action'
import { CCol, CRow, CSpinner } from '@coreui/react'

function ContractMembers({ widgetLength, widgetTableData, title }) {
  const dispatch = useDispatch()
  const [commonLoader, setCommonLoader] = useState(true)
  const [data, setData] = useState({})
  const [contractData, setContractData] = useState([])
  const contractAndSupervisor = useSelector((state) => state.dashboard?.contractAndSupervisor)

  useEffect(() => {
    if (contractAndSupervisor.length === 0) {
      dispatch(getcontracterAndSupervisor())
    } else {
      setData(contractAndSupervisor)
      setContractData(contractAndSupervisor?.usernames)
    }
    setCommonLoader(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractAndSupervisor, dispatch])

  const columns = [
    {
      title: 'SI.No',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
      align: 'center',
      width: '10%',
    },
    {
      title: 'Contract Members',
      dataIndex: 'username',
      key: 'username',
      width: '25%',
    },
    {
      title: 'Supervisors',
      dataIndex: 'supervisorName',
      key: 'supervisorName',
      width: '25%',
    },
  ]

  return (
    <div>
      <Card
        style={{
          height: widgetLength > 2 && widgetTableData.includes(title) ? '270px' : '440px',
          border: 'none',
          marginBottom: '10px',
          // padding: '25px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <Typography style={{ fontSize: '14px', color: '#161C24', fontWeight: '600' }}>
            {title}
          </Typography>
        </div>
        {/* <div style={{ display: 'flex', marginTop: '10px' }}> */}
        <CRow>
          <CCol
            sm={12}
            md={6}
            style={{
              marginRight: '0px',
            }}
          >
            <Card
              className="contract_member_card"
              style={{
                marginY: '20px',
                paddingBottom: '10px',
                marginRight: '0px',
                border: '0px',
                boxShadow: ' 0px 3.83px 47.86px 0px #0000000D',
                flex: 1,
              }}
            >
              <div style={{ display: 'flex' }}>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    height: '40px',
                    width: '40px',
                    backgroundColor: '#1F65CE1A',
                    borderRadius: '5px',
                  }}
                >
                  <img src={multipersonIcon} alt="icon" style={{ width: '16px', height: '16px' }} />
                </div>
                <div style={{ paddingLeft: '20px' }}>
                  <div style={{ color: '#797979', fontSize: '12px', fontWeight: '600' }}>
                    Contract Members
                  </div>
                  <div style={{ color: '#000000', fontSize: '15px', fontWeight: '600' }}>
                    {data.contractMemberCount}
                  </div>
                </div>
              </div>
            </Card>
          </CCol>
          <CCol
            sm={12}
            md={6}
            style={{
              marginLeft: '0px',
            }}
          >
            <Card
              className="contract_member_card"
              style={{
                marginY: '20px',
                marginLeft: '0px',
                paddingBottom: '10px',
                border: '0px',
                boxShadow: ' 0px 3.83px 47.86px 0px #0000000D',
                flex: 1,
              }}
            >
              <div style={{ display: 'flex' }}>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    height: '40px',
                    width: '40px',
                    backgroundColor: '#FF56300D',
                    borderRadius: '5px',
                  }}
                >
                  <img src={multigroupIcon} alt="icon" style={{ width: '20px', height: '20px' }} />
                </div>
                <div style={{ paddingLeft: '20px' }}>
                  <div style={{ color: '#797979', fontSize: '12px', fontWeight: '600' }}>
                    Supervisors
                  </div>
                  <div style={{ color: '#000000', fontSize: '15px', fontWeight: '600' }}>
                    {data.supervisorCount}
                  </div>
                </div>
              </div>
            </Card>
          </CCol>
        </CRow>
        {/* </div> */}
        <div className="db_table" style={{ marginTop: '14px' }}>
          <style>{`
        .ant-table-body {
          scrollbar-width: thin;
        }
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
            dataSource={contractData}
            className="db_table_content custom-table"
            scroll={{ y: 220 }}
            pagination={false}
            loading={{
              spinning: commonLoader,
              indicator: <CSpinner color="danger" />,
            }}
            rowKey={(record, index) => `${record.id}-${index}`}
          />
        </div>
      </Card>
    </div>
  )
}

ContractMembers.propTypes = {
  widgetLength: PropTypes.number.isRequired,
  widgetTableData: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default ContractMembers
