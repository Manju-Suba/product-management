import React from 'react'
import { Table } from 'antd'

const RejectedTable = () => {
  const columns = [
    {
      title: 'SI.No',
      dataIndex: 'sno',
      key: 'sno',
      width: 15,
      fixed: 'left',
    },
    {
      title: 'Team member',
      dataIndex: 'teammember',
      key: 'teammember',
      fixed: 'left',
      width: 20,
    },
    {
      title: 'Activity date',
      width: 30,
      dataIndex: 'activitydate',
      key: 'activitydate',
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      width: 30,
      render: (text, row) => (
        <div
        // className={`text-c pd-text1 grid-cell ${
        //   selectedRows.includes(row.id) ? 'checked-table-row' : ''
        // }`}
        >
          <span>
            {row.assignedStatus === true && (
              <span style={{ fontSize: '16px', color: '#00ab55' }}>&#8226;</span>
            )}
            {row.assignedStatus === false && (
              <span style={{ fontSize: '16px', color: '#ffaa00' }}>&#8226;</span>
            )}
            <span style={{ marginLeft: '5px' }}>Cost Sheet Automation</span>
          </span>
        </div>
      ),
    },
    {
      title: 'Task',
      dataIndex: 'task',
      key: 'task',
      width: 30,
    },

    {
      title: 'No. of Hours',
      dataIndex: 'noOfHours',
      key: 'noOfHours',
      width: 20,
    },
    {
      title: 'Approver Status',
      dataIndex: 'approverStatus',
      key: 'approverStatus',
      width: 35,

      render: (text, row) => {
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

    // {
    //   title: 'Final Status',
    //   dataIndex: 'finalStatus',
    //   key: 'finalStatus',
    //   width: 33,

    //   render: (text, row) => {
    //     let className = 'not-text1'
    //     if (text === 'Approved') {
    //       className = 'green-text1'
    //     } else if (text === 'Reject' || text === 'Rejected') {
    //       className = 'red-text1'
    //     } else if (text === 'Pending') {
    //       className = 'warning-text1'
    //     } else if (text === 'Resubmit') {
    //       className = 'info-text1'
    //     }
    //     return <div className={className}>{text}</div>
    //   },
    // },
    {
      title: 'Remarks',
      width: 60,
      dataIndex: 'remarks',
      key: 'remarks',
    },
  ]

  const data = [
    {
      key: '1',
      sno: '1',
      teammember: 'Ranganath',
      activitydate: '29 May, 2024',

      product: 'Development',
      task: 'Dashboard Design Update',
      noOfHours: '4.3',
      description: 'Gave support to my team',
      approverStatus: 'Approved',
      finalStatus: 'Approved',
      remarks: 'approved data',
      action: '-',
    },
    {
      key: '2',
      sno: '2',
      teammember: 'Ajay',
      activitydate: '29 May, 2024',
      product: 'Deployemnt',
      task: 'Dashboard Design Update',
      noOfHours: '6.13',
      description: 'Gave support to my team',
      approverStatus: 'Approved',
      finalStatus: 'not yet',
      remarks: 'approved data',
      action: '-',
    },
    {
      key: '3',
      sno: '3',
      teammember: 'Lavanya',
      activitydate: '29 May, 2024',

      product: 'Input Gathering',
      task: 'Dashboard Design Update',
      noOfHours: '6.13',
      description: 'Gave support to my team',
      approverStatus: 'Approved',
      finalStatus: 'not yet',
      remarks: 'approved data',
      action: '-',
    },
    {
      key: '4',
      sno: '4',
      teammember: 'Lavanya',
      activitydate: '29 May, 2024',

      product: 'Input Gathering',
      task: 'Dashboard Design Update',
      noOfHours: '4.13',
      description: 'Gave support to my team',
      approverStatus: 'Reject',
      finalStatus: 'not yet',
      remarks: 'reject data',
      action: '-',
    },
    {
      key: '5',
      sno: '5',
      teammember: 'Lavanya',
      activitydate: '29 May, 2024',

      product: 'Input Gathering',
      task: 'Dashboard Design Update',
      noOfHours: '4.13',
      description: 'Gave support to my team',
      approverStatus: 'Reject',
      finalStatus: 'not yet',
      remarks: 'reject data',
      action: '-',
    },
    {
      key: '6',
      sno: '6',
      teammember: 'Lavanya',
      activitydate: '29 May, 2024',

      product: 'Input Gathering',
      task: 'Dashboard Design Update',
      noOfHours: '4.13',
      approverStatus: 'Reject',
      finalStatus: 'not yet',
      remarks: 'reject data',
      action: '-',
    },
  ]

  return (
    <div className="db_table" style={{ height: '312px ' }}>
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
        dataSource={data}
        className="db_table_content"
        scroll={{ x: 1300, y: 300 }}
        pagination={false}
      />
    </div>
  )
}

export default RejectedTable
