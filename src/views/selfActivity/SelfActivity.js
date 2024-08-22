import React from 'react'
import { CCard, CCol, CRow } from '@coreui/react'
import ActivityCalendar from './ActivityCalendar'

const SelfActivity = () => {
  return (
    <CRow className="my-2">
      <CCol xs={12}>
        <CCard className="mt-4 timesheet-content-report">
          <div>
            <CCol className={`selfactivity-card tab_height`}>
              <CRow>
                <ActivityCalendar />
              </CRow>
            </CCol>
          </div>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default SelfActivity
