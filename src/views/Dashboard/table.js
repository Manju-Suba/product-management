import React from 'react'
import PropTypes from 'prop-types'
import DashboardTimesheet from './TimeSheet/Timesheet'
import SubmitedActivity from './SubmitedActivity'
import RaisedRequest from './RaisedRequest/RaisedRequest'
import TimeSheetStatus from './TimeSheetStatus/TimeSheetStatus'
import LeaveHistory from './LeaveHistory'
import ContractMembers from './ContractMembers'
import WorkingHours from './WorkingHours'
import MemberActivity from './Member Activity'

const getComponent = (data, widgetTableData, widgetLength) => {
  const titleRef = data
  const tableData = widgetTableData
  const length = widgetLength

  switch (data) {
    case 'Timesheet Status':
      return <TimeSheetStatus />
    case 'Submitted Activity':
      return <SubmitedActivity widgetTableData={tableData} widgetLength={length} title={titleRef} />
    case 'My Timesheet':
      return (
        <DashboardTimesheet widgetTableData={tableData} widgetLength={length} title={titleRef} />
      )
    case 'Raised Request':
      return (
        <RaisedRequest widgetTableData={widgetTableData} widgetLength={widgetLength} title={data} />
      )
    case "Memeber's Activity":
      return <MemberActivity widgetTableData={tableData} widgetLength={length} title={titleRef} />
    case 'Leave History':
      return (
        <LeaveHistory widgetTableData={widgetTableData} widgetLength={widgetLength} title={data} />
      )
    case 'Contract Members and their Supervisor':
      return <ContractMembers widgetTableData={tableData} widgetLength={length} title={titleRef} />
    case 'Working Hours':
      return <WorkingHours widgetTableData={tableData} widgetLength={length} title={titleRef} />
    default:
      return null
  }
}

const DashboardTable = ({ data, widgetLength, widgetTableData }) => {
  return <div>{getComponent(data, widgetTableData, widgetLength)}</div>
}

DashboardTable.propTypes = {
  data: PropTypes.string,
  widgetLength: PropTypes.number,
  widgetTableData: PropTypes.string,
}

export default DashboardTable
