import React, { useState, useEffect, useRef } from 'react'
import {
  Select,
  Space,
  Input,
  Checkbox,
  TimePicker,
  Breadcrumb,
  Modal,
  Skeleton,
  DatePicker,
  Alert,
  Table,
  Button,
} from 'antd'
import dayjs from 'dayjs'
import { CCol, CRow } from '@coreui/react'
import { getDecodeData, getHeaders } from 'src/constant/Global'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PropTypes from 'prop-types'
import eventEmitter from 'src/constant/EventEmitter'
import { CaretDownOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import Downarrowimg from '../../assets/images/downarrow.png'
import DeleteSvg from '../svgImages/DeleteSvg'
import useAxios from 'src/constant/UseAxios'
import Calendarimg from '../../assets/images/calendar-image.png'
import { Link } from 'react-router-dom'
const { confirm } = Modal
const Draft = ({ productList, today, taskList, loader, loadingActiveTask }) => {
  let api = useAxios()
  const [rows, setRows] = useState([])
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [headerLabel, setHeaderLabel] = useState('')
  const [taskOptions, setTaskOptions] = useState([])
  const hasCheckedRow = rows.some((value) => value.isChecked)
  const { TextArea } = Input
  const selectRef = useRef(null)
  const user = getDecodeData()
  const joiningDate = user?.jod
  const [statusCache, setStatusCache] = useState({})
  const raisedDates = useRef([])
  const [filterValue, setFilterValue] = useState(null)

  const handleDropdownVisibleChange = (visible) => {
    if (!visible && selectRef.current) {
      selectRef.current.blur()
    }
  }

  useEffect(() => {
    getdraftList()
    setTaskOptions(taskList.map((task) => ({ value: task, label: task })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    eventEmitter.on('callDraft', callDraft)
    return () => {
      eventEmitter.off('callDraft', callDraft)
    }
  })

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll
    setSelectAll(newSelectAll)

    // Filter rows based on the current filterValue
    const filteredRows = rows.filter((row) => {
      return (
        (filterValue === 'raised' && row.isRed === true) ||
        (filterValue === 'disabled' && row.isDisabled === true) ||
        (filterValue === 'enable' && !row.isDisabled && !row.isRed && !row.isDisabledRow) ||
        filterValue === null // No filter applied
      )
    })

    const updatedRows = rows.map((row) => {
      // Update rows that are currently filtered/visible
      if (filteredRows.includes(row)) {
        return {
          ...row,
          isChecked: newSelectAll && !row.isDisabledRow,
          isDelete: newSelectAll && !row.isDisabledRow,
        }
      } else {
        return {
          ...row,
          isChecked: row.isChecked, // Keep current state for non-filtered rows
          isDelete: row.isDelete, // Keep current state for non-filtered rows
        }
      }
    })

    setRows(updatedRows)

    const count = countCheckedItems(updatedRows)
    if (count >= 1) {
      setHeaderLabel(`${count} rows selected`)
    } else {
      setHeaderLabel('')
    }
  }

  function countCheckedItems(data) {
    let checkedCount = 0
    for (let item of data) {
      if (item.isChecked === true) {
        checkedCount++
      }
    }
    return checkedCount
  }
  const callDraft = () => {
    getdraftList()
  }

  const handleCheckboxChange = (id) => {
    const newRows = [...rows]
    const currentRowIndex = newRows.findIndex((row) => row.id === id)

    if (currentRowIndex === -1) return // Row with the given ID not found

    const currentRow = newRows[currentRowIndex]
    const allFieldsFilled = areAllFieldsFilled(currentRow)

    currentRow.isChecked = allFieldsFilled ? !currentRow.isChecked : false
    setRows(newRows)

    let count = countCheckedItems(newRows)
    if (count >= 1) {
      if (count === rows.length && count === newRows.filter((row) => row.isChecked).length) {
        // All checkboxes are checked, update Select All checkbox
        setSelectAll(true)
        setHeaderLabel(`${count} rows selected`)
      } else {
        setSelectAll(false)
        setHeaderLabel(`${count} rows selected`)
      }
    } else {
      setSelectAll(false)
      setHeaderLabel('')
    }
  }

  const areAllFieldsFilled = (data) => {
    return (
      data.product !== 0 &&
      data.product !== '' &&
      data.task.trim() !== '' &&
      data.hours !== '' &&
      data.description.trim() !== ''
    )
  }

  const handleInputChange = (id, fieldName, value) => {
    const newRows = rows.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [fieldName]: value }
        if (fieldName === 'estimate_hours') {
          updatedRow.hours = value
        }
        updatedRow.isChecked = false
        return updatedRow
      }
      return row
    })

    if (fieldName === 'activity_date') {
      setStatusCache({})
      fetchData(newRows)
    }

    setSelectAll(false)
    setHeaderLabel('')
    setRows(newRows)
  }

  const getdraftList = async () => {
    const url = `common/timesheet/list/status/` + true
    await api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const Data = response.data.data

        const newTaskOptions = new Set(taskOptions.map((option) => option.value)) // Create a Set of existing task values

        Data.forEach((data) => {
          if (!newTaskOptions.has(data.task)) {
            newTaskOptions.add(data.task) // Add new task to the Set if it's not already present
          }
        })

        taskList.forEach((task) => {
          if (!newTaskOptions.has(task)) {
            newTaskOptions.add(task) // Add task from taskList if it's not already present
          }
        })

        // Convert the Set back to an array of objects
        const uniqueTaskOptions = Array.from(newTaskOptions).map((task) => ({
          value: task,
          label: task,
        }))

        const draftdatalist = Data.map((data, index) => {
          const timeString = data.hours
          return {
            id: data.id,
            activity_date: data.activity_date,
            product: data.product.id,
            task: data.task,
            hours: timeString,
            // status: data.status,
            description: data.description,
            isDisabledRow: false,
            isRed: false,
            isDisabled: false,
            isDelete: false,
          }
        })
        setRows(draftdatalist)
        fetchData(draftdatalist)
        setTaskOptions(uniqueTaskOptions)
      })
      .catch((error) => {})
  }

  const getdraftListDate = async (date) => {
    const url = `common/timesheet/list/status/date/` + true + `/${date}`
    await api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const Data = response.data.data

        const newTaskOptions = new Set(taskOptions.map((option) => option.value)) // Create a Set of existing task values

        Data.forEach((data) => {
          if (!newTaskOptions.has(data.task)) {
            newTaskOptions.add(data.task) // Add new task to the Set if it's not already present
          }
        })

        taskList.forEach((task) => {
          if (!newTaskOptions.has(task)) {
            newTaskOptions.add(task) // Add task from taskList if it's not already present
          }
        })

        // Convert the Set back to an array of objects
        const uniqueTaskOptions = Array.from(newTaskOptions).map((task) => ({
          value: task,
          label: task,
        }))

        const draftdatalist = Data.map((data, index) => {
          const timeString = data.hours
          return {
            id: data.id,
            activity_date: data.activity_date,
            product: data.product.id,
            task: data.task,
            hours: timeString,
            isDisabledRow: false,
            isRed: false,
            isDisabled: false,
            // status: data.status,
            description: data.description,
            isDelete: false,
          }
        })
        setRows(draftdatalist)
        setTaskOptions(uniqueTaskOptions)
      })
      .catch((error) => {})
  }

  const handleUpdate = async () => {
    const url = `common/timesheet/activity/update`
    const checkedRows = rows.filter((value) => value.isChecked)
    const records = checkedRows.map((activity) => ({
      activity_date: dayjs(activity.activity_date).format('YYYY-MM-DD'),
      product: parseInt(activity.product, 10),
      task: activity.task,
      hours:
        typeof activity.hours === 'string'
          ? activity.hours
          : dayjs(activity.hours.$d).format('HH:mm'),
      // status: activity.status,
      description: activity.description,
      id: activity.id,
    }))
    setIsSubmitButtonDisabled(true)
    try {
      const response = await api.put(url, records, {
        headers: getHeaders('json'),
      })

      // Assuming getdraftList and toast.success are functions available in your code
      setRows([])
      getdraftList()
      setHeaderLabel('')
      setSelectAll(false)
      toast.success(response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
      setIsSubmitButtonDisabled(false)
    } catch (error) {
      setIsSubmitButtonDisabled(false)
      setSelectAll(false)
      const updatedRows = rows.map((row) => ({
        ...row,
        isChecked: false,
      }))
      setRows(updatedRows)
      setHeaderLabel('')
      const errors = error.response.data
      if (error.response.status === 400) {
        setRows([])
        getdraftList()
      }
      if (errors) {
        toast.error(errors.message, { position: toast.POSITION.BOTTOM_RIGHT })
      } else {
        toast.error(error.message, { position: toast.POSITION.BOTTOM_RIGHT })
      }
    }
  }

  const deleteFunction = async (value, index, selectedIds) => {
    let id
    if (value === 'singleDelete') {
      id = selectedIds
    } else {
      const rowsToDelete = rows.filter((row) => row.isChecked).map((row) => row.id)
      id = rowsToDelete
    }
    const url = `common/timesheet/activity/draft/${id}`
    setIsSubmitButtonDisabled(true)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        api
          .delete(url, {
            headers: getHeaders('json'),
          })
          .then((response) => {
            getdraftList()
            setHeaderLabel('')
            setSelectAll(false)
            const updatedRows = rows.map((row) => ({
              ...row,
              isChecked: false,
            }))
            setRows(updatedRows)
            setIsSubmitButtonDisabled(false)
            resolve(response)
          })
          .catch((error) => {
            // Handle error
            reject(new Error(error.message))
          })
      }, 1000) // Timeout after 1 second
    })
  }
  //search
  const options = productList.map((product) => ({
    value: product.id,
    label: product.name,
    status: product.status,
    color: product.status === 'InActive' ? 'orange' : 'green',
  }))
  const sortByLabel = (a, b) => a.label.localeCompare(b.label)

  const activeOptions = options.filter((item) => item.status === 'Active').sort(sortByLabel)

  const inactiveOptions = options.filter((item) => item.status === 'InActive').sort(sortByLabel)

  const disabledTime = (current) => {
    const hour = current.hour()

    return {
      disabledHours: () => {
        const disabledHoursArray = []
        for (let i = 0; i < 24; i++) {
          if (i < 0 || i > 9) {
            disabledHoursArray.push(i)
          }
        }
        return disabledHoursArray
      },
      disabledMinutes: () => {
        if (hour === 9) {
          return [...Array(60).keys()].slice(1)
        } else if (hour === 0) {
          return [0]
        } else {
          return []
        }
      },
    }
  }
  const handleDeleteCancelAll = () => {
    setHeaderLabel('')
    setSelectAll(false)
    const updatedRows = rows.map((row) => ({
      ...row,
      isChecked: false,
    }))
    setRows(updatedRows)
  }

  const warning = (value, index, id) => {
    confirm({
      title: 'Delete Draft Activity',
      content: 'Are you sure to delete this Activity ?',
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
      async onOk() {
        try {
          await deleteFunction(value, index, id)
          toast.success('Draft Activity Deleted Successfully', {
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
        return value === 'multiDelete' ? handleDeleteCancelAll() : null
      },
      cancelText: 'No',
    })
  }

  const handleDateChange = (date, dateString) => {
    const selectedDate = dayjs(date).format('YYYY-MM-DD')
    if (date !== null) {
      setRows([])
      getdraftListDate(selectedDate)
    } else {
      getdraftList()
    }
  }

  const fetchStatus = async (date) => {
    try {
      // Replace with your actual API endpoint
      const response = await api.get(`approval/product/approvaldate/${date}`)
      return response.data
    } catch (error) {
      return { status: '' } // Fallback in case of error
    }
  }

  const fetchData = async (tableData) => {
    raisedDates.current = []
    const uniqueDates = [
      ...new Set(tableData.map((data) => dayjs(data.activity_date).format('YYYY-MM-DD'))),
    ]

    const newStatusCache = { ...statusCache }
    const newRaisedDates = Array.isArray(raisedDates.current) ? [...raisedDates.current] : []

    for (const date of uniqueDates) {
      if (!newStatusCache[date]) {
        const statusData = await fetchStatus(date)
        newStatusCache[date] = statusData.status
        if (statusData.status === '' && !newRaisedDates.includes(date)) {
          newRaisedDates.push(date)
        }
      }
    }

    setStatusCache(newStatusCache)

    // Group dates by month and year
    const groupedDates = newRaisedDates.reduce((acc, date) => {
      const dayjsDate = dayjs(date)
      const monthYear = dayjsDate.format('MMM, YYYY')
      const day = dayjsDate.format('DD')

      if (!acc[monthYear]) {
        acc[monthYear] = []
      }
      acc[monthYear].push(day)

      return acc
    }, {})

    // Format the grouped dates for display
    const formattedDates = Object.entries(groupedDates)
      .map(([monthYear, days]) => {
        return `${monthYear} (${days.join(', ')})`
      })
      .join(', ')

    raisedDates.current = formattedDates
  }

  const processedRows = rows.map((data, index) => {
    const currentTime = new Date()
    const currentHour = currentTime.getHours()
    const isAfterEleven = currentHour >= 11
    let dateKey
    if (typeof data.activity_date === 'string') {
      dateKey = data.activity_date
    } else {
      dateKey = dayjs(data.activity_date).format('YYYY-MM-DD')
    }
    const statusData = statusCache[dateKey] || ''

    let isDisabled = false
    let isCheckedBox = false
    let red = false

    if (statusData === 'Permission' || statusData === 'Approved') {
      // No restriction
      isDisabled = false
    } else if (statusData === 'Pending') {
      isDisabled = true
      isCheckedBox = true
    } else if (statusData === '' || (isAfterEleven && dateKey !== dayjs().format('YYYY-MM-DD'))) {
      red = true
      isCheckedBox = true
    }
    rows[index] = {
      ...rows[index],
      isDisabledRow: isCheckedBox,
      isRed: red,
      isDisabled,
    }

    return {
      ...data,
      isDisabledRow: isCheckedBox,
      isRed: red,
      isDisabled,
    }
  })

  return (
    <>
      <CRow>
        <CCol xs={3}>
          <h6 className="timesheet-heading mt-3" style={{ marginLeft: '30px' }}>
            Draft - Time Sheet
          </h6>
          <Breadcrumb
            style={{ marginLeft: '30px' }}
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
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    Draft Activity
                  </span>
                ),
              },
            ]}
          />
        </CCol>
        {raisedDates.current.length > 0 && (
          <CCol className="mt-3" xs={6}>
            <Alert
              message={`Raise the request for these dates( ${raisedDates.current} ) to submit timesheet`}
              banner
            />
          </CCol>
        )}

        <CCol className="draft-sumbit-button ">
          <CRow>
            <CCol className="draft-rightside-header draft-rs-datepicker submit_datepicker">
              <DatePicker
                variant={'borderless'}
                id="date"
                type="date"
                name="fieldName"
                placeholder="Choose Date"
                className="form-input-draft input-lg date-picker activity-date "
                onChange={handleDateChange}
                format="DD MMM, YYYY"
                suffixIcon={
                  <img
                    src={Calendarimg}
                    alt="Calendarimg"
                    style={{ width: '13px', height: '13px' }}
                  />
                }
                maxDate={dayjs()}
                minDate={dayjs(joiningDate)}
                active
                allowClear={true}
              />
            </CCol>
          </CRow>
        </CCol>
      </CRow>
      <div className="table-container-draft table_scroll-draft design_table ">
        <Table
          dataSource={processedRows}
          rowKey={(record, index) => index + 1}
          pagination={false}
          bordered={true}
          size={'small'}
          rowClassName={(record) => {
            if (record.isDisabled === true) return 'disabled-row'
            if (record.isRed === true) return 'red-row'
            return ''
          }}
        >
          <Table.Column
            title={
              <Checkbox
                id="flexCheckDefault"
                className="checkbox_design"
                checked={selectAll}
                onChange={handleSelectAllChange}
                disabled={rows.some((row) => !areAllFieldsFilled(row)) || rows.length === 0}
              />
            }
            align="center"
            dataIndex="checkbox"
            key="checkbox"
            render={(text, record, index) => (
              <Checkbox
                className="checkbox_design"
                id={`flexCheckDefault-${index}`}
                checked={record.isChecked}
                onChange={() => handleCheckboxChange(record.id)}
                disabled={!areAllFieldsFilled(record) || record.isDisabled || record.isRed}
              />
            )}
            width="4%"
            filters={[
              { text: 'Blocked', value: 'raised' },
              { text: 'Request Pending', value: 'disabled' },
              { text: 'Pending', value: 'enable' },
            ]}
            onFilter={(value, record) => {
              setFilterValue(value)
              // setSelectAll(false)
              switch (value) {
                case 'raised':
                  return record.isRed === true
                case 'disabled':
                  return record.isDisabled === true
                case 'enable':
                  return !record.isDisabled && !record.isRed && !record.isDisabledRow
                default:
                  return true
              }
            }}
          />
          <Table.Column
            title={
              headerLabel === '' ? (
                <>SI NO</>
              ) : (
                <span style={{ color: '#f50505', textAlign: 'left' }}>{headerLabel}</span>
              )
            }
            align={headerLabel ? 'left' : ''}
            dataIndex="serialNo"
            colSpan={headerLabel ? 4 : undefined} // Use undefined instead of 0 when headerLabel is empty
            key="serialNo"
            render={(text, record, index) => (
              <div
                className={`text-center ${record.isDisabled ? 'disabled' : ''} ${
                  record.isRed ? 'raise_req' : ''
                }`}
              >
                {index + 1}
              </div>
            )}
            width="5%"
          />

          <Table.Column
            title={headerLabel === '' ? <>Activity Date</> : <></>}
            dataIndex="activity_date"
            key="activity_date"
            render={(text, record, index) => (
              <DatePicker
                variant={'borderless'}
                className={`activity-date-draft input-lg pt-1 ${record.isRed ? 'raise_req' : ''}`}
                id="date"
                type="date"
                name="fieldName"
                placeholder="Choose Date"
                format="DD MMM, YYYY"
                onChange={(date, dateString) => handleInputChange(record.id, 'activity_date', date)}
                suffixIcon={
                  <img
                    src={Calendarimg}
                    alt="Calendarimg"
                    style={{ width: '13px', height: '13px' }}
                  />
                }
                value={dayjs(record.activity_date)}
                maxDate={dayjs()}
                minDate={dayjs(joiningDate)}
                disabled={record.isDisabled}
                disabledDate={(date) => {
                  const dateKey = date.format('YYYY-MM-DD')
                  return statusCache[dateKey] === 'Pending'
                }}
                allowClear={false}
              />
            )}
            width="10%"
          />
          <Table.Column
            title={headerLabel === '' ? <>Product</> : <></>}
            dataIndex="product"
            colSpan={headerLabel ? 0 : 1}
            key="product"
            render={(text, record, index) => (
              <Select
                showSearch
                placeholder="Choose Product"
                variant={'borderless'}
                ref={selectRef}
                onDropdownVisibleChange={handleDropdownVisibleChange}
                className="product-select"
                suffixIcon={
                  <img
                    src={Downarrowimg}
                    alt={Downarrowimg}
                    style={{ width: '12px', height: '7px' }}
                  />
                }
                dropdownStyle={{ border: '#ffff' }}
                style={{ width: '100%' }}
                onChange={(selectedOption) =>
                  handleInputChange(record.id, 'product', selectedOption)
                }
                disabled={record.isDisabled}
                options={
                  loadingActiveTask
                    ? [
                        {
                          label: (
                            <div style={{ textAlign: 'center' }}>
                              <Skeleton
                                title={false}
                                paragraph={{
                                  rows: 5,
                                  width: '100%',
                                }}
                              />
                            </div>
                          ),
                          value: 'loading',
                          disabled: true,
                        },
                      ]
                    : [
                        {
                          label: 'Assigned Projects',
                          options: activeOptions,
                        },
                        {
                          label: 'Other Projects',
                          options: inactiveOptions,
                        },
                      ].map((group) => ({
                        label: group.label,
                        options: group.options.map((option) => ({
                          label: (
                            <Space>
                              <span
                                style={{
                                  color: option.color,
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  display: 'inline-block',
                                }}
                              />
                              <span style={{ fontWeight: '600' }}>{option.label}</span>
                            </Space>
                          ),
                          value: option.value,
                        })),
                      }))
                }
                value={record.product || null}
                filterOption={(input, option) => {
                  const label = option.label?.props?.children?.[1]?.props?.children
                  return label?.toLowerCase().includes(input.toLowerCase())
                }}
              />
            )}
            width="15%"
          />
          <Table.Column
            className="task-text-input"
            title={headerLabel === '' ? <>Task</> : <></>}
            dataIndex="task"
            colSpan={headerLabel ? 0 : 1}
            key="task"
            render={(text, record, index) => (
              <Select
                variant={false}
                ref={selectRef}
                onDropdownVisibleChange={handleDropdownVisibleChange}
                suffixIcon={<CaretDownOutlined className="caredown-icon" />}
                className="draft-form-custom-selects choose_task_box"
                id={`task-${index}`}
                value={taskOptions.find((task) => task.value === record.task) || ''}
                onChange={(selectedOption) => handleInputChange(record.id, 'task', selectedOption)}
                styles={{
                  control: (base) => ({
                    ...base,
                    fontSize: '14px',
                    minWidth: '80px',
                    minHeight: '46px',
                    zIndex: '1',
                    border: 'none',
                    boxShadow: 'none',
                  }),
                  menu: (base) => ({
                    ...base,
                    fontSize: '14px',
                    maxHeight: index <= 1 ? '120px' : '80px',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }),
                  getOptionStyle: (provided) => ({
                    ...provided,
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '10px',
                    color: 'inherit',
                  }),
                }}
                disabled={record.isDisabled}
                options={taskOptions}
              />
            )}
            width="15%"
          />
          <Table.Column
            title={headerLabel === '' ? <>No.of.Hours</> : <></>}
            dataIndex="hours"
            colSpan={headerLabel ? 0 : 1}
            key="hours"
            render={(text, record, index) => (
              <TimePicker
                variant={'borderless'}
                className="date_picker_box"
                placeholder=""
                format="HH:mm"
                suffixIcon={<CaretDownOutlined className="caredown-icon" />}
                value={dayjs(record.hours, 'HH:mm')}
                showNow={false}
                disabledTime={disabledTime}
                hideDisabledOptions
                allowClear={false}
                disabled={record.isDisabled}
                style={{ border: 'none', color: record.red ? '#ff2424' : '' }}
                onChange={(value) => handleInputChange(record.id, 'estimate_hours', value)}
              />
            )}
            width="10%"
          />
          <Table.Column
            title={
              headerLabel === '' ? (
                <>Remarks</>
              ) : (
                <Button
                  type="primary"
                  style={{
                    backgroundColor: '#ee0f1e',
                    borderColor: '#ee0f1e',
                    height: '36px',
                    width: '100px',
                  }}
                  disabled={!hasCheckedRow || isSubmitButtonDisabled}
                  onClick={handleUpdate}
                >
                  Submit
                </Button>
              )
            }
            align={headerLabel ? 'right' : ''}
            dataIndex="remarks"
            colSpan={1}
            key="remarks"
            render={(text, record, index) => (
              <TextArea
                id={`des-${index}`}
                variant={'borderless'}
                className="draft_description"
                value={record.description}
                onChange={(e) => handleInputChange(record.id, 'description', e.target.value)}
                style={{ fontWeight: '600' }} // Adjust '100px' to your desired minimum height
                placeholder="Enter Descriptions..."
                disabled={record.isDisabled}
                autoSize={{
                  minRows: 0,
                }}
              />
            )}
            width="30%"
          />
          <Table.Column
            title={
              headerLabel === '' ? (
                <>Action</>
              ) : (
                <Button
                  type="default"
                  onClick={() => warning('multiDelete', 0, 0)}
                  className="action-view cross-button"
                  style={{ padding: '4px 8px' }}
                >
                  <DeleteSvg width="16" height="15" viewBox="0 0 18 18" fill="#e40e2d" />
                </Button>
              )
            }
            dataIndex="action"
            colSpan={1}
            key="action"
            render={(text, record, index) => (
              <Button
                type="default"
                className="action-view cross-button"
                onClick={() => {
                  warning('singleDelete', index, record.id)
                }}
                disabled={rows[index].isChecked || record.isDisabledRow}
                style={{ padding: '4px 8px' }}
              >
                <DeleteSvg width="16" height="15" viewBox="0 0 18 18" fill="#e40e2d" />
              </Button>
            )}
            width="5%"
          />
        </Table>
        {/* <CTable hover>
          <CTableHead className="draft-head-row-ts">
            {!headerLabel ? (
              <CTableRow>
                <CTableHeaderCell
                  className="table-head-draft text-c text-center"
                  scope="col"
                  width="4%"
                >
                  <Checkbox
                    className="checkbox_design"
                    id="selectAllCheckbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    disabled={rows.some((row) => !areAllFieldsFilled(row)) || rows.length === 0}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft text-c text-center"
                  scope="col"
                  width="4%"
                >
                  SI.No
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c " width="10%" scope="col">
                  Activity Date
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c " width="15%" scope="col">
                  Product
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c " scope="col  " width="20%">
                  Task
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c " scope="col" width="10%">
                  No.of.Hours
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c " scope="col" width="30%">
                  Remarks
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-draft text-c text-center "
                  scope="col"
                  width="6%"
                >
                  Action
                </CTableHeaderCell>
              </CTableRow>
            ) : (
              <CTableRow>
                <CTableHeaderCell
                  className="table-head-selected text-center  text-c pad_bt "
                  width="4.3%"
                >
                  <Checkbox
                    id="flexCheckDefault"
                    className="checkbox_design"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    disabled={rows.some((row) => !areAllFieldsFilled(row)) || rows.length === 0}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-selected  text-c align_con_cen"
                  colSpan="5" // Span across all other columns
                >
                  <span style={{ color: '#f50505' }}>{headerLabel}</span>
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-selected "
                  style={{ textAlign: 'right' }}
                  width="30%"
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                  >
                    <button
                      className="btn"
                      style={{
                        fontSize: '13px',
                        color: 'white',
                        backgroundColor: '#ee0f1e',
                        height: '36px',
                        width: '100px',
                      }}
                      disabled={!hasCheckedRow || isSubmitButtonDisabled}
                      onClick={() => handleUpdate()}
                    >
                      Submit
                    </button>
                  </div>
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-selected "
                  style={{ textAlign: 'right' }}
                  width="6%"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '10%', display: 'flex', justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="action-view cross-button"
                        onClick={() => warning('multiDelete', 0, 0)}
                        style={{ padding: '4px 8px' }}
                      >
                        <DeleteSvg width="16" height="15" viewBox="0 0 18 18" fill="#e40e2d" />
                      </button>
                    </div>
                  </div>
                </CTableHeaderCell>
              </CTableRow>
            )}
          </CTableHead>
          <CTableBody>
            {rows
              ?.map((data, index) => {
                const currentTime = new Date()
                const currentHour = currentTime.getHours()
                const isAfterEleven = currentHour >= 11
                let dateKey
                if (typeof data.activity_date === 'string') {
                  dateKey = data.activity_date
                } else {
                  dateKey = dayjs(data.activity_date.$d).format('YYYY-MM-DD')
                }
                const statusData = statusCache[dateKey] || ''

                let color = 'inherit'
                let isDisabled = false
                let isCheckedBox = false
                let red = false

                if (statusData === 'Permission' || statusData === 'Approved') {
                  // No restriction
                  isDisabled = false
                } else if (statusData === 'Pending') {
                  color = '#d3d3d3' // grey
                  isDisabled = true
                  isCheckedBox = true
                } else if (
                  statusData === '' ||
                  (isAfterEleven && dateKey !== dayjs().format('YYYY-MM-DD'))
                ) {
                  color = '#ff8484b5' // red
                  red = true
                  isCheckedBox = true
                }

                rows[index] = {
                  ...rows[index],
                  isDisabledRow: isCheckedBox,
                  isRed: red,
                  isDisabled: isDisabled,
                }

                return { ...data, color, isDisabled, isCheckedBox, red }
              })

              .map((data, index) => (
                <CTableRow
                  key={index + 1}
                  className="my-3"
                  style={{
                    color: data.color,
                    cursor: data.isDisabled ? 'not-allowed' : 'default',
                  }}
                >
                  <CTableDataCell
                    className="activity-text-radio activity-text-index text-center pad-bottom"
                    style={{
                      color: data.color,
                      cursor: !areAllFieldsFilled(data) ? 'not-allowed' : 'default',
                      ...(areAllFieldsFilled(data)
                        ? {} // No hover effect for enabled checkboxes
                        : { ':hover': { cursor: 'not-allowed' } }), // Hover effect for disabled checkboxes
                    }}
                    width="4%"
                  >
                    <Checkbox
                      className="checkbox_design"
                      id={`flexCheckDefault-${index}`}
                      checked={data.isChecked}
                      onChange={() => handleCheckboxChange(index)}
                      disabled={!areAllFieldsFilled(data) || data.isDisabled || data.isRed}
                    />
                  </CTableDataCell>
                  <CTableDataCell
                    className={`activity-text-index pad-bottom text-center ${
                      (data.isDisabled ? 'disabled' : '', data.red ? 'raise_req' : '')
                    }`}
                    width="4%"
                  >
                    {index + 1}
                  </CTableDataCell>
                  <CTableDataCell
                    className={`activity-text-draft-date pad-bottom ${data.red ? 'raise_req' : ''}`}
                    width="10%"
                  >
                    <DatePicker
                      variant={'borderless'}
                      id="date"
                      type="date"
                      name="fieldName"
                      placeholder="Choose Date"
                      className="activity-date-draft input-lg pt-1"
                      format="DD MMM, YYYY"
                      onChange={(date, dateString) =>
                        handleInputChange(index, 'activity_date', date)
                      }
                      suffixIcon={
                        <img
                          src={Calendarimg}
                          alt="Calendarimg"
                          style={{ width: '13px', height: '13px' }}
                        />
                      }
                      style={{ fontWeight: '700' }}
                      defaultValue={dayjs(data.activity_date)}
                      maxDate={dayjs()}
                      minDate={dayjs(joiningDate)}
                      active
                      disabled={data.isDisabled}
                      disabledDate={(date) => {
                        const dateKey = date.format('YYYY-MM-DD')
                        // Disable the date if its status is 'Pending'
                        return statusCache[dateKey] === 'Pending'
                      }}
                      allowClear={false}
                    />
                  </CTableDataCell>
                  <CTableDataCell
                    className={`activity-text-draft pad-bottom ${data.red ? 'raise_req' : ''}`}
                    width="15%"
                    style={{
                      color: data.color,
                    }}
                  >
                    <Select
                      showSearch
                      placeholder="Choose Product"
                      variant={'borderless'}
                      ref={selectRef}
                      onDropdownVisibleChange={handleDropdownVisibleChange}
                      className="product-select"
                      suffixIcon={
                        <img
                          src={Downarrowimg}
                          alt={Downarrowimg}
                          style={{ width: '12px', height: '7px' }}
                        />
                      }
                      dropdownStyle={{
                        border: '#ffff', // Setting border: 'none' here to remove border from the dropdown menu
                      }}
                      style={{ width: '100%' }}
                      onChange={(selectedOption) =>
                        handleInputChange(index, 'product', selectedOption)
                      }
                      disabled={data.isDisabled}
                      options={
                        loader
                          ? [
                              // If loading, show loader inside options
                              {
                                label: (
                                  <div style={{ textAlign: 'center' }}>
                                    <Skeleton
                                      title={false}
                                      paragraph={{
                                        rows: 5, // Adjust the number of rows here
                                        width: '100%', // Optional: Adjust the width of each line
                                      }}
                                    />
                                  </div>
                                ),
                                value: 'loading',
                                disabled: true, // Make loader option disabled
                              },
                            ]
                          : [
                              {
                                label: 'Assigned Projects',
                                options: activeOptions,
                              },
                              {
                                label: 'Other Projects',
                                options: inactiveOptions,
                              },
                            ].map((group) => ({
                              label: group.label,
                              options: group.options.map((option) => ({
                                label: (
                                  <Space>
                                    <span
                                      style={{
                                        color: option.color,
                                        width: 6,
                                        height: 6,
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        border: 'none',
                                      }}
                                    />
                                    <span style={{ fontWeight: '600' }}>{option.label}</span>{' '}
                                  </Space>
                                ),
                                value: option.value,
                              })),
                            }))
                      }
                      value={data.product || null}
                      filterOption={(input, option) => {
                        const label = option.label?.props?.children?.[1]?.props?.children
                        return label?.toLowerCase().includes(input.toLowerCase())
                      }}
                    />
                  </CTableDataCell>
                  <CTableDataCell
                    className={`activity-text-task pad-bottom ${data.red ? 'raise_req' : ''}`}
                    width="15%"
                    style={{
                      color: data.color,
                    }}
                  >
                    <Select
                      variant={false}
                      ref={selectRef}
                      onDropdownVisibleChange={handleDropdownVisibleChange}
                      suffixIcon={<CaretDownOutlined className="caredown-icon" />}
                      className="draft-form-custom-selects choose_task_box"
                      id={`task-${index}`}
                      value={taskOptions.find((task) => task.value === data.task) || ''}
                      onChange={(selectedOption) =>
                        handleInputChange(index, 'task', selectedOption)
                      }
                      menuportaltarget={document.body}
                      styles={{
                        control: (base) => ({
                          ...base,
                          fontSize: '14px',
                          minWidth: '80px',
                          minHeight: '46px',
                          maxHeight: index <= 1 ? '120px' : '80px', // Set maxHeight based on the condition
                          zIndex: '1', // Adjust the zIndex as needed
                          border: 'none',
                          boxShadow: 'none',
                        }),
                        menu: (base) => ({
                          ...base,
                          fontSize: '14px',
                          maxHeight: index <= 1 ? '120px' : '80px', // Set maxHeight based on the condition
                          overflowY: 'auto', // Enable vertical scroll if options exceed maxHeight
                          '&::-webkit-scrollbar': {
                            display: 'none', // Hide WebKit scrollbar
                          },
                        }),
                        getOptionStyle: (provided, state) => ({
                          ...provided,
                          height: '40px', // Set your fixed height for options
                          display: 'flex',
                          alignItems: 'center', // Vertically center the content
                          padding: '8px 12px', // Adjust padding as needed
                        }),
                      }}
                      disabled={data.isDisabled}
                      options={
                        loadingActiveTask
                          ? [
                              {
                                label: (
                                  <div style={{ textAlign: 'center' }}>
                                    <Skeleton
                                      title={false}
                                      paragraph={{
                                        rows: 5, // Adjust the number of rows here
                                        width: '100%', // Optional: Adjust the width of each line
                                      }}
                                    />
                                  </div>
                                ),
                                value: 'loading',
                                disabled: true,
                              },
                            ]
                          : taskOptions
                      }
                      placeholder="Choose Task"
                    />
                  </CTableDataCell>
                  <CTableDataCell
                    className="activity-text activity-text-time pad-bottom "
                    width="10%"
                    style={{
                      color: data.color,
                    }}
                  >
                    <TimePicker
                      variant={'borderless'}
                      className="date_picker_box"
                      placeholder=""
                      format="HH:mm"
                      suffixIcon={<CaretDownOutlined className="caredown-icon" />}
                      defaultValue={dayjs(data.hours, 'HH:mm')}
                      showNow={false}
                      disabledTime={disabledTime}
                      hideDisabledOptions
                      allowClear={false}
                      disabled={data.isDisabled}
                      style={{ border: 'none', color: data.red ? '#ff2424' : '' }}
                      onChange={(value) => handleInputChange(index, 'estimate_hours', value)}
                    />
                  </CTableDataCell>
                  <CTableDataCell
                    className="activity-text activity-text-description pad-bottom"
                    width="30%"
                    style={{
                      color: data.color,
                    }}
                  >
                    <TextArea
                      id={`des-${index}`}
                      variant={'borderless'}
                      className="draft_description"
                      value={data.description}
                      onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                      style={{ color: data.red ? '#ff2424' : 'black', fontWeight: '600' }} // Adjust '100px' to your desired minimum height
                      placeholder="Enter Descriptions..."
                      disabled={data.isDisabled}
                      autoSize={{
                        minRows: 0,
                      }}
                    />
                  </CTableDataCell>
                  <CTableDataCell
                    className="text-c  text-center activity-text-status pad-bottom"
                    width="9%"
                    style={{
                      color: data.color,
                    }}
                  >
                    <div
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <button
                        type="button"
                        className="action-view cross-button"
                        onClick={() => {
                          warning('singleDelete', index, data.id)
                        }}
                        disabled={rows[index].isChecked || data.isDisabled}
                        style={{ padding: '4px 8px' }}
                      >
                        <DeleteSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
                      </button>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
          </CTableBody>
        </CTable> */}
        {/* {(rows === null && !commonLoader) || (rows.length === 0 && !commonLoader) ? (
          <div className="text-c text-center my-3 td-text">No Data Found</div>
        ) : (
          commonLoader && (
            <div className="text-c text-center my-3 td-text">
              <CSpinner color="danger" />
            </div>
          )
        )} */}
      </div>
    </>
  )
}

Draft.propTypes = {
  productList: PropTypes.array,
  today: PropTypes.string,
  taskList: PropTypes.array,
  loadingActiveTask: PropTypes.bool,
  loader: PropTypes.bool,
}
export default Draft
