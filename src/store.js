import { configureStore } from '@reduxjs/toolkit'
import timesheetReducer from './redux/timesheet/reducer'
import DashboardReducer from './redux/Dashboard/reducer'
import memberActivityReducer from './redux/memberActivity/reducer'

const isDevelopment = process.env.NODE_ENV === 'development'

export const store = configureStore({
  reducer: {
    timesheet: timesheetReducer,
    dashboard: DashboardReducer,
    memberactivity: memberActivityReducer,
  },
  devTools: isDevelopment,
})
