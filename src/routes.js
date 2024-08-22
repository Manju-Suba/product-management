import React from 'react'
import { getDecodeData } from './constant/Global'

const ProductFlow = React.lazy(() => import('./views/flow/FlowList'))
const ProductList = React.lazy(() => import('./views/products/Products'))
const Login = React.lazy(() => import('./views/auth/login/Login'))
const Master = React.lazy(() => import('./views/master/Masters'))
const Timesheet = React.lazy(() => import('./views/timesheet/TimeSheet'))
const Report = React.lazy(() => import('./views/Reports/Report'))
const MembersActivity = React.lazy(() => import('./views/membersActivity/MembersActivity'))
const SelfActivity = React.lazy(() => import('./views/selfActivity/SelfActivity'))

const ContractMembersActivity = React.lazy(() =>
  import('./views/contractMemberActivity/ContractMembersActivity'),
)
const Dashboard = React.lazy(() => import('./views/Dashboard'))
const ProductMembersActivity = React.lazy(() =>
  import('./views/productMemberActivity/ProductMembersActivity'),
)
const History = React.lazy(() => import('./views/history/History'))

const user = getDecodeData()

const routes = [
  { path: '/', exact: true, name: 'Home', element: Login },

  ...(!user?.designation?.includes('Internal Admin')
    ? [
        { path: '/timesheet', name: 'Timesheet', element: Timesheet },
        { path: '/report', name: 'Report', element: Report },
        { path: '/dashboard', name: 'Dashboard', element: Dashboard },
      ]
    : []),
  ...(user?.designation?.includes('Admin') &&
  !user?.designation?.includes('Internal Admin') &&
  !user?.designation?.includes('QA Admin')
    ? [{ path: '/flow', name: 'CreateFlow', element: ProductFlow }]
    : []),
  ...((user?.designation?.includes('Admin') || user?.employee_id === '120034') &&
  !user?.designation?.includes('QA Admin')
    ? [{ path: '/master', name: 'Master', element: Master }]
    : []),
  ...(user?.designation?.includes('Owner')
    ? [
        {
          path: '/product-members-activity',
          name: 'ProductMembersActivity',
          element: ProductMembersActivity,
        },
      ]
    : []),
  ...(user?.designation?.includes('Owner') ||
  user?.designation?.includes('Approver') ||
  user?.designation?.includes('Head')
    ? [{ path: '/product/list', name: 'CreateProducts', element: ProductList }]
    : []),
  ...(user && user.superviser === 'true'
    ? [
        { path: '/members-activity', name: 'MembersActivity', element: MembersActivity },
        { path: '/history', name: 'history', element: History },
        { path: '/self-activity', name: 'SelfActivity', element: SelfActivity },
      ]
    : []),
  ...(user && user.finalApprover === 'true'
    ? [
        {
          path: '/contract-members-activity',
          name: 'ContractMembersActivity',
          element: ContractMembersActivity,
        },
      ]
    : []),
]
export default routes
