import React, { useState, useRef, useEffect } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import eventEmitter from 'src/constant/EventEmitter'
import FileSvg from '../../svgImages/FileSvg'
import { CaretDownOutlined } from '@ant-design/icons'
import TextArea from 'antd/es/input/TextArea'
import DeleteSvg from '../../svgImages/DeleteSvg'
import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import { toast } from 'react-toastify'
import Downarrowimg from '../../../assets/images/downarrow.png'
import { useDispatch } from 'react-redux'
import { submitActivity } from 'src/redux/timesheet/action'
import PropTypes from 'prop-types'
import CheckSvg from 'src/views/svgImages/CheckSvg'
import { Checkbox, Select, TimePicker, Skeleton, Space, Modal } from 'antd'
import { useSelector } from 'react-redux'

dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  weekStart: 1,
})

const TimesheetTable = ({
  productList,
  taskList,
  selectedDate,
  loader,
  loadingActiveTask,
  handleDisableContent,
  disableContents,
  heightValue,
}) => {
  const dispatch = useDispatch()
  const [disableContent, setDisableContent] = useState(disableContents)
  const [dateWise, setDateWise] = useState(selectedDate)
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false)
  const [isDraftButtonDisabled, setIsDraftButtonDisabled] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [headerLabel, setHeaderLabel] = useState('')
  const sidebarShow = useSelector((state) => state.dashboard.sidebarShow)
  const selectRef = useRef(null)
  const handleDropdownVisibleChange = (visible) => {
    if (!visible && selectRef.current) {
      selectRef.current.blur()
    }
  }
  const [rows, setRows] = useState([
    {
      activity_date: dateWise,
      isChecked: false,
      checkUser: '',
      product: '',
      task: '',
      hours: '',
      status: '',
      description: '',
    },
  ])
  const addRow = () => {
    setRows([
      ...rows,
      {
        activity_date: dateWise,
        isChecked: false,
        checkUser: '',
        product: '',
        task: '',
        hours: '',
        status: '',
        description: '',
      },
    ])
  }

  const hasCheckedRow = rows.some((value) => value.isChecked)

  const handleCheckboxChange = (index) => {
    const newRows = [...rows]
    const currentRow = newRows[index]

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
      // data.status !== '' &&
      data.description.trim() !== ''
    )
  }

  const handleInputChange = (index, fieldName, value) => {
    const newRows = [...rows]
    const currentRow = newRows[index]

    if (fieldName === 'hours') {
      currentRow.hours = value
    } else {
      currentRow[fieldName] = value
    }
    currentRow.isChecked = false
    const updatedRows = newRows.map((row, idx) => ({
      ...row,
      isChecked: false, // Update isChecked conditionally
    }))
    setSelectAll(false)
    setHeaderLabel('')
    handleDisableContent(false)
    setRows(updatedRows)
  }

  const deleteRow = (index) => {
    if (rows.length > 1) {
      const newRows = [...rows]
      newRows.splice(index, 1)
      setRows(newRows)
    } else {
      toast.error('Deleting last row  Restricted', { position: toast.POSITION.BOTTOM_RIGHT })
    }
  }

  const handleSubmit = async (e) => {
    setIsSubmitButtonDisabled(true)
    setIsDraftButtonDisabled(true)
    const remainingRows = rows.filter((value) => !value.isChecked)

    const formData = new FormData()
    let i = 0

    rows.forEach((value) => {
      if (value.isChecked) {
        formData.append(
          `commonTimeSheetActivities[${i}].activity_date`,
          dayjs(dateWise).format('YYYY-MM-DD'),
        )
        formData.append(`commonTimeSheetActivities[${i}].product`, value.product)
        formData.append(`commonTimeSheetActivities[${i}].task`, value.task)
        formData.append(
          `commonTimeSheetActivities[${i}].hours`,
          dayjs(value.hours.$d).format('HH:mm'),
        )
        // formData.append(`commonTimeSheetActivities[${i}].status`, value.status)
        formData.append(`commonTimeSheetActivities[${i}].description`, value.description)
        i++
      }
    })
    formData.append(`status`, 'Created')
    dispatch(submitActivity(formData))
      .then((response) => {
        toast.success(response.data.message, { position: toast.POSITION.BOTTOM_RIGHT })
        setIsSubmitButtonDisabled(false)
        setIsDraftButtonDisabled(false)
        setHeaderLabel('')
        setRows([])
        setSelectAll(false)
        if (remainingRows.length === 0) {
          setRows([
            {
              activity_date: dateWise,
              isChecked: false,
              checkUser: '',
              product: '',
              task: '',
              hours: '',
              // status: 'Choose Status',
              description: '',
            },
          ])
        } else {
          setRows(remainingRows)
        }
      })
      .catch((error) => {
        setIsSubmitButtonDisabled(false)
        setIsDraftButtonDisabled(false)
        setSelectAll(false)
        const updatedRows = rows.map((row) => ({
          ...row,
          isChecked: false,
        }))
        setRows(updatedRows)
        setHeaderLabel('')
        const errors = error.response.data
        if (errors) {
          toast.error(errors.message, { position: toast.POSITION.BOTTOM_RIGHT })
        } else {
          toast.error(error.message, { position: toast.POSITION.BOTTOM_RIGHT })
        }
      })
  }

  const handleDraft = async () => {
    setIsSubmitButtonDisabled(true)
    setIsDraftButtonDisabled(true)
    // Filter out rows with isChecked set to true
    const remainingRows = rows.filter((value) => !value.isChecked)

    const formData = new FormData()
    let i = 0

    rows.forEach((value) => {
      if (value.isChecked) {
        formData.append(
          `commonTimeSheetActivities[${i}].activity_date`,
          dayjs(dateWise).format('YYYY-MM-DD'),
        )
        formData.append(`commonTimeSheetActivities[${i}].product`, value.product)
        formData.append(`commonTimeSheetActivities[${i}].task`, value.task)
        formData.append(
          `commonTimeSheetActivities[${i}].hours`,
          `${dayjs(value.hours.$d).format('HH:mm')}`,
        )
        // formData.append(`commonTimeSheetActivities[${i}].status`, value.status)
        formData.append(`commonTimeSheetActivities[${i}].description`, value.description)
        i++
      }
    })
    formData.append(`status`, 'Draft')
    dispatch(submitActivity(formData))
      .then((response) => {
        toast.success(response.data.message, { position: toast.POSITION.BOTTOM_RIGHT })
        setIsSubmitButtonDisabled(false)
        setIsDraftButtonDisabled(false)
        setHeaderLabel('')
        setSelectAll(false)
        if (remainingRows.length === 0) {
          setRows([
            {
              activity_date: dateWise,
              isChecked: false,
              product: '',
              task: '',
              hours: '',
              // status: '',
              description: '',
            },
          ])
        } else {
          setRows(remainingRows)
        }
        eventEmitter.emit('callDraft')
      })
      .catch((error) => {
        setIsSubmitButtonDisabled(false)
        setIsDraftButtonDisabled(false)
        setSelectAll(!selectAll)
        const updatedRows = rows.map((row) => ({
          ...row,
          isChecked: !selectAll,
        }))
        setRows(updatedRows)
        setHeaderLabel('')
        toast.error(error.message, { position: toast.POSITION.BOTTOM_RIGHT })
      })
  }

  useEffect(() => {
    setDisableContent(disableContents)
  }, [disableContents])

  //Product List
  const options = productList.map((product) => ({
    value: product.id,
    label: product.name,
    status: product.status,
    color: product.status === 'InActive' ? 'orange' : 'green',
  }))
  const activeOptions = options.filter((item) => item.status === 'Active')
  const inactiveOptions = options.filter((item) => item.status === 'InActive')

  // Task Activity list
  const taskOptions = taskList.map((task) => ({
    value: task,
    label: task,
  }))

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll)
    const updatedRows = rows.map((row) => ({
      ...row,
      isChecked: !selectAll,
    }))
    setRows(updatedRows)
    let count = countCheckedItems(updatedRows)
    if (count >= 1) setHeaderLabel(`${count} rows selected`)
    else setHeaderLabel('')
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

  const warning = (id) => {
    Modal.warning({
      title: 'Delete Activity',
      content: 'Are you sure to delete this activity ?',
      onOk: () => deleteRow(id),
      closable: true,
      okCancel: true,
      autoFocusButton: true,
      centered: true,
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: { style: { background: '#f54550', borderColor: '#f54550', color: 'white' } },
    })
  }
  return (
    <div>
      <div
        className=" p-0 "
        style={{ height: heightValue ? '150px' : '316px', overflowY: 'auto', overflowX: 'auto' }}
      >
        <CTable>
          <CTableHead className="draft-head-row-ts">
            {!headerLabel ? (
              <CTableRow className={`my-3 ${disableContent ? 'disabled-content' : ''}`}>
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
                    disabled={
                      disableContent ||
                      sidebarShow === true ||
                      rows.some((row) => !areAllFieldsFilled(row))
                    }
                  />
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c" width="12%" scope="col">
                  Product
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c" scope="col" width="20%">
                  Task
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c" scope="col" width="15%">
                  Hours
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-draft text-c" scope="col" width="30%">
                  Remarks
                </CTableHeaderCell>
              </CTableRow>
            ) : (
              <CTableRow>
                <CTableHeaderCell
                  className="table-head-draft table-head-selected text-c text-center pad_bt"
                  scope="col"
                  width="4.3%"
                >
                  <Checkbox
                    id="selectAllCheckbox"
                    className="checkbox_design"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                    disabled={
                      disableContent ||
                      sidebarShow === true ||
                      rows.some((row) => !areAllFieldsFilled(row))
                    }
                  />
                </CTableHeaderCell>
                <CTableHeaderCell className="table-head-selected text-c align_con_cen" colSpan="3">
                  <span style={{ color: '#f50505' }}>{headerLabel}</span>
                </CTableHeaderCell>
                <CTableHeaderCell
                  className="table-head-selected"
                  colSpan="4"
                  style={{ textAlign: 'right' }}
                  width="39.1%"
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                  >
                    <button
                      className="btn border-0 text-secondary save_draft_button"
                      disabled={!hasCheckedRow || isDraftButtonDisabled || disableContent}
                      onClick={() => handleDraft()}
                      type="button"
                    >
                      <FileSvg width="17" height="17" viewBox="0 0 18 18" fill="none" />
                    </button>
                    <div
                      title={
                        !hasCheckedRow || isSubmitButtonDisabled
                          ? 'Please check a row before submitting'
                          : ''
                      }
                    >
                      <button
                        className="btn border-0 text-secondary save_draft_button"
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={!hasCheckedRow || isSubmitButtonDisabled || disableContent}
                      >
                        <CheckSvg width="11" height="9" viewBox="0 0 14 10" fill="#00ab55" />
                      </button>
                    </div>
                  </div>
                </CTableHeaderCell>
              </CTableRow>
            )}
          </CTableHead>
          <CTableBody className={`my-3 ${disableContent ? 'disabled-content' : ''}`}>
            {rows?.map((data, index) => (
              <CTableRow
                key={index}
                className="my-3"
                style={{ position: 'relative' }}
                onMouseEnter={() =>
                  (document.getElementById(`delete-button-${index}`).style.display = 'block')
                }
                onMouseLeave={() =>
                  (document.getElementById(`delete-button-${index}`).style.display = 'none')
                }
              >
                <CTableDataCell
                  className="activity-text-radio activity-text-index text-center pad-bottom"
                  style={{
                    cursor: !areAllFieldsFilled(data) ? 'not-allowed' : 'default',
                  }}
                  width="4%"
                >
                  <Checkbox
                    className="checkbox_design"
                    id={`flexCheckDefault-${index}`}
                    checked={data.isChecked}
                    onChange={() => handleCheckboxChange(index)}
                    disabled={!areAllFieldsFilled(data) || sidebarShow === true}
                  />
                </CTableDataCell>
                <CTableDataCell className="activity-text-draft pad-bottom" width="15%">
                  <Select
                    showSearch
                    placeholder="Choose Product"
                    variant={'borderless'}
                    ref={selectRef}
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    className="product-select"
                    loading={loader}
                    suffixIcon={
                      <img
                        src={Downarrowimg}
                        alt={Downarrowimg}
                        style={{ width: '12px', height: '7px' }}
                      />
                    }
                    dropdownStyle={{
                      border: '#ffff',
                      width: '15%',
                    }}
                    style={{ width: '100%', fontWeight: '600' }}
                    onChange={(selectedOption) =>
                      handleInputChange(index, 'product', selectedOption)
                    }
                    options={
                      loader
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
                                      backgroundColor: option.color,
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      display: 'inline-block',
                                      border: 'none',
                                    }}
                                  />
                                  <span style={{ fontWeight: '600' }} className="product_option">
                                    {option.label}
                                  </span>
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
                <CTableDataCell className="activity-text-task pad-bottom" width="20%">
                  <Select
                    showSearch
                    suffixIcon={
                      <img
                        src={Downarrowimg}
                        alt={Downarrowimg}
                        style={{ width: '12px', height: '7px' }}
                      />
                    }
                    ref={selectRef}
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    className="draft-form-custom-selects choose_task_box"
                    id={`task-${index}`}
                    value={taskOptions.find((task) => task.value === data.task) || null}
                    onChange={(selectedOption) => handleInputChange(index, 'task', selectedOption)}
                    menuportaltarget={document.body}
                    styles={{
                      control: (base) => ({
                        ...base,
                        fontSize: '14px',
                        minWidth: '80px',
                        minHeight: '46px',
                        maxHeight: index <= 1 ? '120px' : '80px',
                        zIndex: '1',
                        border: 'none',
                        boxShadow: 'none',
                        fontWeight: 600,
                      }),
                      menu: (base) => ({
                        ...base,
                        fontSize: '14px',
                        maxHeight: index <= 1 ? '120px' : '80px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        fontWeight: 600,
                      }),
                      getOptionStyle: (provided, state) => ({
                        ...provided,
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '8px 12px',
                      }),
                    }}
                    dropdownStyle={{
                      border: '#ffff',
                      width: '15%',
                    }}
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
                        : taskOptions
                    }
                    placeholder="Choose Task"
                  />
                </CTableDataCell>
                <CTableDataCell className="activity-text activity-text-time pad-bottom" width="10%">
                  <TimePicker
                    className="date_picker_db"
                    variant={'borderless'}
                    placeholder="HH:mm"
                    format="HH:mm"
                    value={data.hours || null}
                    style={{ border: 'none', fontWeight: 600, fontSize: '13px' }}
                    suffixIcon={<CaretDownOutlined className="caredown-icon" />}
                    disabledTime={disabledTime}
                    hideDisabledOptions
                    picker="time"
                    allowClear={false}
                    showNow={false}
                    onChange={(value) => handleInputChange(index, 'hours', value)}
                  />
                </CTableDataCell>
                <CTableDataCell
                  className="activity-text activity-text-description pad-bottom"
                  width="30%"
                >
                  <div style={{ display: 'flex' }}>
                    <TextArea
                      id={`des-${index}`}
                      variant={'borderless'}
                      value={data.description}
                      className="db_textarea"
                      onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                      style={{ color: 'black', fontWeight: '600' }}
                      placeholder="Enter Remarks..."
                      autoSize={{
                        minRows: 0,
                        maxRows: 1,
                      }}
                    />
                    <div
                      id={`delete-button-${index}`}
                      style={
                        {
                          // position: 'absolute',
                          // top: '50%',
                          // right: '10px',
                          // transform: 'translateY(-50%)',
                          // display: 'none',
                        }
                      }
                    >
                      <button
                        type="button"
                        className="action-view cross-button"
                        onClick={() => warning(index)}
                        disabled={rows[index].isChecked}
                        style={{ padding: '2px 2px' }}
                      >
                        <DeleteSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
                      </button>
                    </div>
                  </div>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
      <div>
        <button
          style={{ background: 'transparent', marginTop: '10px' }}
          type="button"
          className="Add_row_button border-0"
          disabled={sidebarShow === true}
          // className="text-decoration-none  addrow_button"
          onClick={addRow}
        >
          <span className="row_label">
            <span style={{ fontSize: '14px' }}> + </span>Add Row
          </span>
        </button>
      </div>
    </div>
  )
}

TimesheetTable.propTypes = {
  productList: PropTypes.array,
  taskList: PropTypes.array,
  loadingActiveTask: PropTypes.bool,
  loader: PropTypes.bool,
  selectedDate: PropTypes.any,
  handleDisableContent: PropTypes.func,
  disableContents: PropTypes.bool,
  heightValue: PropTypes.bool,
}
export default TimesheetTable
