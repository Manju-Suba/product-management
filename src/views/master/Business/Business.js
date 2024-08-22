import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CCol, CRow, CSpinner } from '@coreui/react'
import { getHeaders } from 'src/constant/Global'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'
import { Breadcrumb, Checkbox, Input, Modal, Table } from 'antd'
import EditSvg from '../../svgImages/EditSvg'
import DeleteSvg from '../../svgImages/DeleteSvg'
import useAxios from 'src/constant/UseAxios'
import { toast } from 'react-toastify'
import searchIcon from '../../../assets/images/form/search-Icon.png'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import debounce from 'lodash.debounce'
import AddBusiness from './AddBusiness'
import EditBusiness from './EditBusiness'
const { confirm } = Modal
const Business = () => {
  let api = useAxios()
  const [businessTable, setBusinessTable] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [headerLabel, setHeaderLabel] = useState('')
  const [businessVisible, setBusinessVisible] = useState(false)
  const [businessVisibleEdit, setBusinessVisibleEdit] = useState(false)
  const [viewBusinessData, setViewBusinessData] = useState(null)
  const searchValueRef = useRef('')
  const [commonLoader, setCommonLoader] = useState(true)
  const [abortController, setAbortController] = useState(new AbortController())
  const tableBodyRef = useRef(null)
  const hasMoreRef = useRef(true)
  const pageRef = useRef(0)
  const searchRef = useRef(false)
  const [isNorMore, setIsNorMore] = useState(false)

  useEffect(() => {
    if (!businessVisible && !businessVisibleEdit) {
      hasMoreRef.current = true
      getBusinessList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessVisible, businessVisibleEdit])

  const handleHeaderCheck = (isChecked) => {
    if (isChecked) {
      const allRowIds = businessTable.map((row) => row.id)
      setSelectedRows(allRowIds)
      setHeaderLabel(`${allRowIds.length} Selected`)
    } else {
      setSelectedRows([])
      setHeaderLabel('')
    }
  }

  const handleSearch = (value) => {
    pageRef.current = 0
    hasMoreRef.current = true
    searchValueRef.current = value
    searchRef.current = true
    if (value === '') searchRef.current = false

    getBusinessList()
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

  const closeEditComponent = () => {
    pageRef.current = 0
    searchValueRef.current = ''
    searchRef.current = false
    setBusinessVisibleEdit(false)
  }
  const closeAddComponent = () => {
    pageRef.current = 0
    searchValueRef.current = ''
    searchRef.current = false
    setBusinessVisible(false)
  }

  const getBusinessList = async () => {
    let newAbortController
    if (pageRef.current === 0) {
      setCommonLoader(true)
      setBusinessTable([])
      abortController.abort()
      newAbortController = new AbortController()
      setAbortController(newAbortController)
    }

    const url = `master/bussiness/list?page=${pageRef.current}&size=10&search=${searchRef.current}&value=${searchValueRef.current}`
    await api
      .get(url, {
        headers: getHeaders('json'),
        signal: newAbortController?.signal,
      })
      .then((response) => {
        const data = response.data.data.content

        if (pageRef.current === 0) {
          setBusinessTable(data)
        } else {
          setBusinessTable((prevUserData) => {
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

  const openBusinessModal = () => {
    setBusinessVisible(true)
  }

  const handleBusinessEditClick = async (id) => {
    const url = `master/bussiness/byid/` + id
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        setViewBusinessData(data)
        setBusinessVisibleEdit(true)
      })
      .catch((error) => {})
  }

  const deletefun = async (ids) => {
    const url = `master/bussiness/delete/` + ids

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        api
          .delete(url, {
            headers: getHeaders('json'),
          })
          .then((response) => {
            // Handle success
            pageRef.current = 0
            searchValueRef.current = ''
            searchRef.current = false
            getBusinessList()
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

  const warning = (id) => {
    confirm({
      title: 'Delete Business',
      content: 'Are you sure to delete this Business ?',
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
          toast.success('Business Deleted Successfully', {
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
          title: 'Business',
          dataIndex: 'name',
          key: 'name',
          width: '35%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              setIsNorMore(true)
              return {
                children: (
                  <div style={{ textAlign: 'center' }}>
                    <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
                  </div>
                ),
                props: {
                  colSpan: 4, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <span className="designation-row-name">{text}</span>
          },
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          width: '5%',
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
                  onClick={() => handleBusinessEditClick(record.id)}
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
              checked={selectedRows.length === businessTable.length && businessTable.length}
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
          width: '35%',
          render: (text, record, index) => {
            if (record.key === 'noMoreData') {
              setIsNorMore(true)
              return {
                children: (
                  <div style={{ textAlign: 'center' }}>
                    <b style={{ color: '#e40e2d', fontSize: '12px' }}>No more Data to load</b>
                  </div>
                ),
                props: {
                  colSpan: 4, // Adjust this number based on the total number of columns to span
                },
              }
            }
            return <span className="designation-row-name">{text}</span>
          },
        },
        {
          title: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                className="action-view cross-button"
                onClick={() => warning(selectedRows)}
                style={{ padding: '4px 8px' }}
              >
                <DeleteSvg width="16" height="15" viewBox="0 0 18 18" fill="#e40e2d" />
              </button>
            </div>
          ),
          dataIndex: 'action',
          key: 'action',
          width: '5%',
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
                  onClick={() => handleBusinessEditClick(record.id)}
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
    ...businessTable.map((row, index) => ({
      key: row.id,
      id: row.id,
      index: index + 1,
      name: row.name,
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
    })
  }

  let businessComponent
  if (businessVisible) {
    businessComponent = <AddBusiness close={closeAddComponent} />
  } else if (businessVisibleEdit) {
    businessComponent = <EditBusiness close={closeEditComponent} viewBusiness={viewBusinessData} />
  } else {
    businessComponent = (
      <>
        <CRow className="mt-3 user-master-header">
          <CCol sm={8}>
            <b style={{ paddingLeft: '30px' }}>Business Master</b>
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
                      Business Master
                    </span>
                  ),
                },
              ]}
            />
          </CCol>

          <CCol sm={2}>
            {' '}
            <div style={{ width: '90%', marginRight: '20px' }} className="mt-1 des-mas">
              <Input
                placeholder="Search"
                variant={'borderless'}
                className="border-0 time-border-bottom "
                onChange={(e) => handleSearch(e.target.value)}
                prefix={
                  <img
                    src={searchIcon}
                    alt="Search"
                    className="search-icon"
                    style={{ width: '14px', height: '14px' }}
                  />
                }
              />
            </div>
          </CCol>
          <CCol sm={2}>
            <button
              className="bus-createflow-button button-clr"
              type="button"
              onClick={openBusinessModal}
            >
              <span className="plus-lable">+</span> Add Business
            </button>
          </CCol>
        </CRow>

        <div className="mt-2 design_table">
          <style>
            {`
            .design_table .ant-table-wrapper .ant-table-thead > tr > th {
              background-color: ${headerLabel ? '#ffa5b240 !important' : ''};
            }
          `}
          </style>

          <Table
            columns={columns}
            dataSource={displayData}
            className={`${isNorMore ? 'last-row-table' : ''}`}
            size={'middle'}
            rowKey="id"
            pagination={false}
            scroll={{ y: 490 }}
            loading={{
              spinning: commonLoader,
              indicator: <CSpinner color="danger" />,
            }}
          />
        </div>
      </>
    )
  }

  const fetchMoreData = () => {
    if (hasMoreRef.current) {
      getBusinessList()
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

  return businessComponent
}

export default Business
