import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Input, Modal, Switch, Breadcrumb, Checkbox, Table } from 'antd'
import { CButton, CCol, CModal, CModalBody, CRow, CSpinner } from '@coreui/react'
import { getHeaders, ImageUrl } from 'src/constant/Global'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import EditSvg from '../../svgImages/EditSvg'
import DeleteSvg from '../../svgImages/DeleteSvg'
import profileImage1 from '../../../assets/images/avatars/avatar1.png'
import Circle from 'src/views/svgImages/Circle'
import AddUser from './AddUser'
import EditUser from './EditUser'
import useAxios from 'src/constant/UseAxios'
import searchicon from '../../../assets/images/form/search-Icon.png'
import { toPascalCase } from '../../../constant/TimeUtils'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'
const { confirm } = Modal
const User = () => {
  let api = useAxios()
  const [userTable, setUserTable] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [headerLabel, setHeaderLabel] = useState('')
  const [userVisible, setUserVisible] = useState(false)
  const [userVisibleEdit, setUserVisibleEdit] = useState(false)
  const [viewUserData, setViewUserData] = useState(null)
  const searchValueRef = useRef('')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [commonLoader, setCommonLoader] = useState(true)
  const [confirmationData, setConfirmationData] = useState({
    rowIndex: null,
    userStatus: null,
  })
  const [abortController, setAbortController] = useState(new AbortController())
  const hasMoreRef = useRef(true)
  const pageRef = useRef(0)
  const [page, setPage] = useState(0)
  const searchRef = useRef(false)
  const [isNorMore, setIsNorMore] = useState(false)
  const tableBodyRef = useRef(null)

  useEffect(() => {
    if (!userVisibleEdit && !userVisible) {
      hasMoreRef.current = true
      setUserTable([])
      getUserList(0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userVisibleEdit, userVisible])

  const handleHeaderCheck = (isChecked) => {
    if (isChecked) {
      const allRowIds = userTable.map((row) => row.id)
      setSelectedRows(allRowIds)
      setHeaderLabel(`${allRowIds.length} Selected`)
    } else {
      setSelectedRows([])
      setHeaderLabel('')
    }
  }
  const handleSearch = (value) => {
    pageRef.current = 0
    setPage(0)
    hasMoreRef.current = true
    searchValueRef.current = value
    searchRef.current = true
    if (value === '') searchRef.current = false
    getUserList(1)
  }

  const handleMemberCheck = (rowId, isChecked) => {
    if (isChecked) {
      setSelectedRows((prevSelectedRows) => {
        const newSelectedRows = [...prevSelectedRows, rowId]
        setHeaderLabel(`${newSelectedRows.length} Selected`)
        return newSelectedRows
      })
    } else {
      setSelectedRows((prevSelectedRows) => {
        const newSelectedRows = prevSelectedRows.filter((selectedId) => selectedId !== rowId)
        setHeaderLabel(newSelectedRows.length > 0 ? `${newSelectedRows.length} Selected` : '')
        return newSelectedRows
      })
    }
  }

  const resetEditComponent = () => {
    setUserVisibleEdit(false)
    pageRef.current = 0
    setPage(0)
    hasMoreRef.current = true
    searchValueRef.current = ''
    searchRef.current = false
  }
  const resetAddComponent = () => {
    setUserVisible(false)
    pageRef.current = 0
    setPage(0)
    hasMoreRef.current = true
    searchValueRef.current = ''
    searchRef.current = false
  }

  const handleSwitchChange = () => {
    setShowConfirmationModal(true)
  }

  const getUserList = async (type) => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setUserTable([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }
    const url = `master/employee/list?page=${pageRef.current}&size=10&search=${searchRef.current}&value=${searchValueRef.current}`
    await api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        const data = response.data.data

        if (pageRef.current === 0) {
          setUserTable(data)
        } else {
          setUserTable((prevUserData) => {
            const uniqueSet = new Set(prevUserData.map((user) => user.id))
            const newData = data.filter((user) => !uniqueSet.has(user.id))
            return [...prevUserData, ...newData]
          })
        }
        if (data.length < 10) {
          hasMoreRef.current = false
        }
        pageRef.current = pageRef.current + 1
        setCommonLoader(false)
      })
      .catch((error) => {})
  }

  const openUserModal = () => {
    setUserVisible(true)
  }

  const deletefun = async (ids) => {
    const url = `master/employee/delete/user/` + ids

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        api
          .delete(url, {
            headers: getHeaders('json'),
          })
          .then((response) => {
            // Handle success
            pageRef.current = 0
            setPage(0)
            searchValueRef.current = ''
            searchRef.current = false
            getUserList(1)
            setHeaderLabel('')
            setSelectedRows([])
            resolve(response)
          })
          .catch((error) => {
            // Handle error
            reject(error)
          })
      }, 1000) // Timeout after 1 second
    })
  }
  const handleConfirmationModalConfirm = async () => {
    const reciprocalUserStatus = !confirmationData.userStatus

    try {
      const url = `master/employee/update/${confirmationData.rowIndex}/status/${reciprocalUserStatus}`

      const response = await api.put(
        url,
        {
          id: confirmationData.rowIndex,
          status: reciprocalUserStatus,
        },
        {
          headers: getHeaders('json'),
        },
      )

      const data = response.data.data
      if (Array.isArray(data)) {
        setUserTable(data.filter(/* your filter condition */))
      } else {
        // Handle the case where data is not an array
        // console.error('Data is not an array:', data)
      }

      pageRef.current = 0
      setPage(0)
      searchValueRef.current = ''
      searchRef.current = false
      // Call getUserList only after a successful response
      return getUserList(1) // Assuming getUserList returns a promise
    } catch (error) {
    } finally {
      setShowConfirmationModal(false)
      setConfirmationData({
        rowIndex: null,
        userStatus: null,
      })
    }
  }
  const handleConfirmationModalCancel = () => {
    setShowConfirmationModal(false)
  }
  const handleUserEditClick = async (id) => {
    const url = `master/employee/view/` + id
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        setViewUserData(data)
        setUserVisibleEdit(true)
      })
      .catch((error) => {})
  }

  const warning = (id) => {
    confirm({
      title: 'Delete User',
      content: 'Are you sure to delete this User ?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelButtonProps: {
        style: { borderColor: '#f54550', color: 'black' },
      },
      closable: true,
      okButtonProps: {
        style: { borderColor: '#f54550', color: 'white', backgroundColor: '#f54550' },
      },
      cancelText: 'No',
      async onOk() {
        try {
          await deletefun(id)
          toast.success('User Deleted Successfully', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
        } catch (error) {
          toast.error('Deletion failed', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
        }
      },
      onCancel() {
        resetValues()
      },
    })
  }

  const resetValues = () => {
    setSelectedRows([])
    setHeaderLabel('')
  }

  const truncateString = (str, num) => {
    if (str.length <= num) {
      return str
    }
    return str.slice(0, num) + '...'
  }

  const columns = !headerLabel
    ? [
        {
          title: <Checkbox onChange={(e) => handleHeaderCheck(e.target.checked)} />,
          dataIndex: 'checkbox',
          key: 'checkbox',
          width: '3%',
          align: 'center',
          render: (_, record) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return (
              <Checkbox
                className="checkbox_design"
                checked={selectedRows.includes(record.id)}
                onChange={(e) => handleMemberCheck(record.id, e.target.checked)}
              />
            )
          },
        },
        {
          title: 'SI.No',
          dataIndex: 'index',
          key: 'index',
          width: '5%',
          align: 'center',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return index + 1
          },
        },
        {
          title: 'Username & Email',
          dataIndex: 'name',
          key: 'name',
          width: '13%',
          render: (text, row, index) => {
            if (row.key === 'noMoreData') {
              return {
                children: (
                  <div style={{ textAlign: 'center' }}>
                    <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
                  </div>
                ),
                props: {
                  colSpan: 11, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return (
              <div className="user_pic_div">
                <div style={{ marginBottom: '0px' }}>
                  <Circle
                    color={row.userStatus ? '#A3FA34' : '#ED0023'}
                    width="10"
                    height="9"
                    viewBox="0 0 10 9"
                    fill="none"
                  />
                </div>
                <div className="image-background">
                  <img
                    src={row.profile_pic ? ImageUrl + row.profile_pic : profileImage1}
                    className="user_pic"
                    alt={row.name}
                  />
                </div>
                <div
                  className="node1 access-person-hovercard"
                  style={row.profile_pic ? { marginLeft: '11px', marginTop: '10px' } : {}}
                >
                  <p className="member-user-name1 user_pic_name" title={toPascalCase(row.name)}>
                    {toPascalCase(row.name)}
                  </p>
                  <p className="member-role-text1 user_pic_name" title={row.email}>
                    {row.email}
                  </p>
                </div>
              </div>
            )
          },
        },
        {
          title: 'Employee Id',
          dataIndex: 'employeeId',
          key: 'employeeId',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {truncateString(text, 15)}</div>
          },
        },
        {
          title: 'Designation',
          dataIndex: 'role',
          key: 'role',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              setIsNorMore(true)
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <span className="designation-row-name">{truncateString(text, 16)}</span>
          },
        },
        {
          title: 'Role',
          dataIndex: 'designation',
          key: 'designation',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {text}</div>
          },
        },
        {
          title: 'Branch',
          dataIndex: 'branch',
          key: 'branch',
          width: '8%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {text}</div>
          },
        },
        {
          title: 'Supervisor',
          dataIndex: 'supervisor',
          key: 'supervisor',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {text ? truncateString(text, 15) : '--'}</div>
          },
        },
        {
          title: 'Role Type',
          dataIndex: 'roleType',
          key: 'roleType',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {text}</div>
          },
        },
        {
          title: 'Final Approval',
          dataIndex: 'approvalFinalName',
          key: 'approvalFinalName',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              setIsNorMore(true)
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <span className="designation-row-name">{text ? toPascalCase(text) : '--'}</span>
          },
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          width: '8%',
          align: 'center',
          render: (_, record) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="action-view  edit-button mx-1"
                  style={{ padding: '4px 8px' }}
                  onClick={() => handleUserEditClick(record.id)}
                >
                  <EditSvg
                    width="13"
                    height="13"
                    viewBox="0 0 18 18"
                    fill="none"
                    color="white"
                    clipH="18"
                    clipW="18"
                  />
                </button>
                <Switch
                  className={record.userStatus ? 'activeUser mx-1' : 'inactiveUser mx-1'}
                  size="small"
                  id="formSwitchCheckDefaultLg"
                  onChange={handleSwitchChange}
                  onClick={() => {
                    setConfirmationData({
                      rowIndex: record.id,
                      userStatus: record.userStatus,
                    })
                    // Optionally, you can open your modal here
                  }}
                  checked={record.userStatus}
                  style={{
                    backgroundColor: record.userStatus ? '#3CB043' : '#fa170f',
                    cursor: 'pointer',
                    marginTop: '6px',
                  }}
                />
                <button
                  type="button"
                  className="action-view cross-button mx-1"
                  style={{ padding: '4px 8px' }}
                  onClick={!headerLabel ? () => warning(record.id) : null}
                >
                  <DeleteSvg width="14" height="13" viewBox="0 0 18 18" fill="#A5A1A1" />
                </button>
              </div>
            )
          },
        },
      ]
    : [
        {
          title: (
            <Checkbox
              className="checkbox_design"
              checked={selectedRows.length === userTable.length && userTable.length}
              onChange={(e) => handleHeaderCheck(e.target.checked)}
            />
          ),
          dataIndex: 'checkbox',
          key: 'checkbox',
          width: '3%',
          align: 'center',
          render: (_, record) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return (
              <Checkbox
                className="checkbox_design"
                checked={selectedRows.includes(record.id)}
                onChange={(e) => handleMemberCheck(record.id, e.target.checked)}
              />
            )
          },
        },
        {
          title: <span style={{ color: '#f50505' }}>{headerLabel}</span>,
          dataIndex: 'index',
          key: 'index',
          width: '5%',
          align: 'center',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return index + 1
          },
        },
        {
          title: '',
          dataIndex: 'name',
          key: 'name',
          width: '10%',
          render: (text, row, index) => {
            if (row.key === 'noMoreData') {
              return {
                children: (
                  <div style={{ textAlign: 'center' }}>
                    <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
                  </div>
                ),
                props: {
                  colSpan: 11, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return (
              <>
                <div className="user_pic_div">
                  <div style={{ marginBottom: '11px' }}>
                    <Circle
                      color={row.userStatus ? '#A3FA34' : '#ED0023'}
                      width="10"
                      height="9"
                      viewBox="0 0 10 9"
                      fill="none"
                    />
                  </div>
                  <div className="image-background">
                    <img
                      src={row.profile_pic ? ImageUrl + row.profile_pic : profileImage1}
                      className="user_pic"
                      alt={row.name}
                    />
                  </div>
                  <div
                    className="node1 access-person-hovercard"
                    style={row.profile_pic ? { marginLeft: '11px', marginTop: '10px' } : {}}
                  >
                    <p className="member-user-name1 user_pic_name" title={toPascalCase(row.name)}>
                      {' '}
                      {toPascalCase(row.name)}
                    </p>
                    <p className="member-role-text1 user_pic_name" title={row.email}>
                      {row.email}
                    </p>
                  </div>
                </div>
              </>
            )
          },
        },
        {
          title: '',
          dataIndex: 'employeeId',
          key: 'employeeId',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {truncateString(text, 15)}</div>
          },
        },
        {
          title: '',
          dataIndex: 'role',
          key: 'role',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              setIsNorMore(true)
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <span className="designation-row-name">{truncateString(text, 15)}</span>
          },
        },
        {
          title: '',
          dataIndex: 'designation',
          key: 'designation',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {text}</div>
          },
        },
        {
          title: '',
          dataIndex: 'branch',
          key: 'branch',
          width: '8%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {text}</div>
          },
        },
        {
          title: '',
          dataIndex: 'supervisor',
          key: 'supervisor',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {toPascalCase(text)}</div>
          },
        },
        {
          title: '',
          dataIndex: 'roleType',
          key: 'roleType',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <div title={text}> {text}</div>
          },
        },
        {
          title: '',
          dataIndex: 'approvalFinalName',
          key: 'approvalFinalName',
          width: '10%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              setIsNorMore(true)
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <span className="designation-row-name">{text ? toPascalCase(text) : '--'}</span>
          },
        },
        {
          title: '',
          dataIndex: 'action',
          key: 'action',
          width: '8%',
          align: 'center',
          render: (_, record) => {
            if (record.key === 'noMoreData') {
              return {
                children: null,
                props: {
                  colSpan: 0, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="action-view  edit-button mx-1"
                  style={{ padding: '4px 8px' }}
                  onClick={() => handleUserEditClick(record.id)}
                >
                  <EditSvg
                    width="13"
                    height="13"
                    viewBox="0 0 18 18"
                    fill="none"
                    color="white"
                    clipH="18"
                    clipW="18"
                  />
                </button>
                <Switch
                  className={record.userStatus ? 'activeUser mx-1' : 'inactiveUser mx-1'}
                  size="small"
                  id="formSwitchCheckDefaultLg"
                  onChange={handleSwitchChange}
                  onClick={() => {
                    setConfirmationData({
                      rowIndex: record.id,
                      userStatus: record.userStatus,
                    })
                    // Optionally, you can open your modal here
                  }}
                  checked={record.userStatus}
                  style={{
                    backgroundColor: record.userStatus ? '#3CB043' : '#fa170f',
                    cursor: 'pointer',
                    marginTop: '6px',
                  }}
                />
                <button
                  type="button"
                  className="action-view cross-button mx-1"
                  style={{ padding: '4px 8px' }}
                  onClick={!headerLabel ? () => warning(record.id) : null}
                >
                  <DeleteSvg width="14" height="13" viewBox="0 0 18 18" fill="#A5A1A1" />
                </button>
              </div>
            )
          },
        },
      ]

  const displayData = [
    ...userTable.map((row, index) => ({
      key: row.id,
      id: row.id,
      index: index + 1,
      employeeId: row.employeeId,
      name: row.name,
      role: row.role,
      designation: row.designation,
      branch: row.branch,
      supervisor: row.supervisor,
      roleType: row.roleType,
      approvalFinalName: row.approvalFinalName,
      email: row.email,
      profile_pic: row.profile_pic,
      userStatus: row.userStatus,
    })),
  ]

  // Append the "No more Data to load" message as the last row if noMoreData is true
  if (!hasMoreRef.current && displayData.length !== 0 && displayData.length > 10) {
    displayData.push({
      key: 'noMoreData',
      index: '',
      name: 'No more Data to load',
      checkbox: '',
      action: '',
      employeeId: '',
      role: '',
      designation: '',
      branch: '',
      supervisor: '',
      roleType: '',
      approvalFinalName: '',
      email: '',
      profile_pic: '',
      userStatus: '',
    })
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      getUserList(0)
    }
  }

  const handleScroll = useCallback(
    debounce(() => {
      if (!tableBodyRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        if (hasMoreRef.current && !commonLoader) {
          setCommonLoader(true)
          fetchMoreData()
        }
      }
    }, 100),
    [hasMoreRef.current, commonLoader],
  )

  useEffect(() => {
    const tableBody = document.querySelector('.design_table .ant-table-body')
    if (tableBody) {
      tableBodyRef.current = tableBody
      tableBody.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (tableBody) {
        tableBody.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  const renderUserComponent = () => {
    if (userVisible) {
      return <AddUser close={resetAddComponent} />
    } else if (userVisibleEdit) {
      return <EditUser close={resetEditComponent} viewUser={viewUserData} />
    } else {
      return (
        <>
          <CRow className="mt-3 user-master-header">
            <CCol xs={12} sm={6} md={8}>
              <b style={{ paddingLeft: '30px' }}>User Master</b>
              <br />
              <Breadcrumb
                style={{ paddingLeft: '30px' }}
                className="bread-tab"
                separator={<span className="breadcrumb-separator">|</span>}
                items={[
                  {
                    title: (
                      <Link
                        rel="Dashboard"
                        to={'/dashboard'}
                        className="bread-items text-decoration-none text-secondary "
                      >
                        Dashboard
                      </Link>
                    ),
                  },
                  {
                    title: (
                      <span className="text-secondary " style={{ cursor: 'default' }}>
                        User Master
                      </span>
                    ),
                  },
                ]}
              />
            </CCol>

            <CCol xs={6} sm={3} md={2}>
              {' '}
              <div style={{ width: '90%', marginRight: '20px' }} className="mt-1 des-mas">
                <Input
                  placeholder="Search"
                  className="border-0 user-select-sec "
                  onChange={(e) => handleSearch(e.target.value)}
                  variant={'borderless'}
                  prefix={
                    <img
                      src={searchicon}
                      alt={searchicon}
                      style={{ width: '14px', height: '14px' }}
                      className="search-icon"
                    />
                  }
                />
              </div>
            </CCol>
            <CCol xs={6} sm={3} md={2} className="add-usermaster">
              <button
                className="master-createflow-button button-clr"
                type="button"
                onClick={openUserModal}
              >
                {/* <CheckOutlined /> */}
                <span className="plus-lable">+</span> Add User
              </button>
            </CCol>
          </CRow>
          <div className="mt-2 design_table user-table">
            <style>
              {`
              .design_table .ant-table-wrapper .ant-table-thead > tr > th {
                background-color: ${headerLabel ? '#ffa5b240 !important' : ''};
              }
              .design_table .ant-table-body::-webkit-scrollbar {
                display: none !important;
              }
             `}
            </style>

            <Table
              columns={columns}
              dataSource={displayData}
              size={'middle'}
              className={`${isNorMore ? 'last-row-table' : ''}`}
              rowKey="id"
              pagination={false}
              scroll={{ y: 490 }}
              loading={{
                spinning: commonLoader,
                indicator: <CSpinner color="danger" />,
              }}
            />
          </div>

          {showConfirmationModal && (
            <CModal
              size="sm"
              backdrop="static"
              alignment="center"
              visible={showConfirmationModal}
              onClose={handleConfirmationModalCancel}
              className={`right ${showConfirmationModal ? 'modal-visible' : 'modal-hidden'}`}
            >
              <CModalBody>
                <CRow>
                  <CCol style={{ fontSize: '14px', fontWeight: '600' }}>
                    {confirmationData.userStatus === true
                      ? 'Are you sure you want to Inactivate this User?'
                      : 'Are you sure you want to Activate this User?'}
                  </CCol>
                </CRow>
                <CRow className="mt-2">
                  <CCol className="d-flex justify-content-end align-items-end user-master-footer">
                    <CButton className="edit-cancel-btn" onClick={handleConfirmationModalCancel}>
                      Cancel
                    </CButton>
                    <CButton
                      className=" Edit_save_changes"
                      style={{ fontSize: '13px', color: 'white', width: '20%' }}
                      onClick={() => handleConfirmationModalConfirm()}
                    >
                      Confirm
                    </CButton>
                  </CCol>
                </CRow>
              </CModalBody>
            </CModal>
          )}
        </>
      )
    }
  }

  return <>{renderUserComponent()}</>
}

export default User
