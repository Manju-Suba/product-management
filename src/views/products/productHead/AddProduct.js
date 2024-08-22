import React, { useState, useRef } from 'react'
import { Breadcrumb, Select, Input, Button, Form, DatePicker } from 'antd'
import { CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import { ImageUrl, getDecodeData, getHeaders } from '../../../constant/Global'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import profileImage1 from '../../../assets/images/avatars/man1.png'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import Calendar from '../../svgImages/Calendar'
import dayjs from 'dayjs'
import useAxios from 'src/constant/UseAxios'
import Downarrowimg from '../../../assets/images/downarrow.png'
import { Link } from 'react-router-dom'
const AddProduct = ({
  flow,
  flowList,
  close,
  techHeadList,
  prodHeadList,
  dataHeadList,
  howHeadList,
  categories,
  titleList,
  techOwnerList,
  prodOwnerList,
  dataOwnerList,
  howOwnerList,
}) => {
  let api = useAxios()
  const user = getDecodeData()
  const userId = user?.id
  const branch = user?.branch
  const designation = user?.designation
  const empId = user?.employee_id
  const formRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const fileInputRef = useRef(null)
  const [form] = Form.useForm()
  const [loadingState, setLoadings] = useState(false)
  const selectRef = useRef(null)
  const [error, setError] = useState('')
  const handleDropdownVisibleChange = (visible) => {
    if (!visible && selectRef.current) {
      selectRef.current.blur()
    }
  }
  const handleBrowseClick = () => {
    fileInputRef.current.click()
  }
  if (!designation.includes('Internal Admin')) {
    if (branch === 'Technical')
      form.setFieldsValue({
        techHeadValue: userId,
      })
    if (branch === 'Product')
      form.setFieldsValue({
        prodHeadValue: userId,
      })
    if (branch === 'Data')
      form.setFieldsValue({
        dataHeadValue: userId,
      })
    if (branch === 'HOW')
      form.setFieldsValue({
        dataHeadValue: userId,
      })
  }
  if (flow !== null)
    form.setFieldsValue({
      flow: flow,
    })

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
  }

  const prodHeadOption = prodHeadList.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options1 select-options-form">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '20px' } : { width: '29px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {' '}
            {user.name}
          </p>
          <p className="role-text1" title={user.role}>
            {user.role}
          </p>
        </div>
      </div>
    ),
  }))

  const techHeadOption = techHeadList.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options1 select-options-form">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '20px' } : { width: '29px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {user.name}
          </p>
          <p className="role-text1" title={user.role}>
            {user.role}
          </p>
        </div>
      </div>
    ),
  }))

  const dataHeadOption = dataHeadList.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options1 select-options-form">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '20px' } : { width: '29px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {user.name}
          </p>
          <p className="role-text1" title={user.role}>
            {user.role}
          </p>
        </div>
      </div>
    ),
  }))

  const howHeadOption = howHeadList.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options1 select-options-form">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '20px' } : { width: '29px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {user.name}
          </p>
          <p className="role-text1" title={user.role}>
            {user.role}
          </p>
        </div>
      </div>
    ),
  }))

  const options = flowList.map((flow) => ({
    value: flow.id,
    label: flow.name,
  }))

  const categoryOption = categories.map((cate) => ({
    value: cate.id,
    label: cate.name,
  }))

  const handleSubmit = async (values) => {
    if (selectedFile) {
      const validFormats = ['.png', '.jpeg', '.jpg', '.pdf', '.docx']
      const fileExtension = selectedFile.name.split('.').pop()

      if (!validFormats.includes('.' + fileExtension.toLowerCase())) {
        setError('Please select a valid file (.png, .jpeg, .jpg, .pdf, .docx).')
        return
      }
    }
    setLoadings(true)
    const formData = new FormData()
    formData.append('option', status)
    Object.keys(values).forEach((key) => {
      if (key === 'endDateValue') {
        if (endDate === undefined) {
          formData.append('endDate', '')
        } else {
          formData.append('endDate', endDate)
        }
      }
      if (key === 'startDateValue') {
        formData.append('startDate', startDate)
      }
      if (key === 'prodHeadValue') {
        if (values[key] === undefined) {
          formData.append('prodHead', 0)
        } else {
          formData.append('prodHead', values[key])
        }
      }
      if (key === 'techHeadValue') {
        if (values[key] === undefined) {
          formData.append('techHead', 0)
        } else {
          formData.append('techHead', values[key])
        }
      }
      if (key === 'dataHeadValue') {
        if (values[key] === undefined) {
          formData.append('dataHead', 0)
        } else {
          formData.append('dataHead', values[key])
        }
      }
      if (key === 'howHeadValue') {
        if (values[key] === undefined) {
          formData.append('howHead', 0)
        } else {
          formData.append('howHead', values[key])
        }
      }
      if (key === 'techOwnerName') {
        if (values[key] === undefined) {
          formData.append('techOwner', [])
        } else {
          formData.append('techOwner', values[key])
        }
      }
      if (key === 'prodOwnerName') {
        if (values[key] === undefined) {
          formData.append('prodOwner', [])
        } else {
          formData.append('prodOwner', values[key])
        }
      }
      if (key === 'dataOwnerName') {
        if (values[key] === undefined) {
          formData.append('dataOwner', [])
        } else {
          formData.append('dataOwner', values[key])
        }
      }
      if (key === 'howOwnerName') {
        if (values[key] === undefined) {
          formData.append('howOwner', [])
        } else {
          formData.append('howOwner', values[key])
        }
      }
      if (key === 'filesValue') formData.append('files', selectedFile)
      else formData.append(key, values[key])
    })
    let url
    if (designation.includes('Internal Admin') || empId === '120034') {
      url = 'product/create?key=Admin'
    } else {
      url = 'product/create'
    }
    await api
      .post(url, formData, {
        headers: getHeaders('multi'),
      })
      .then((response) => {
        if (response.status === 208) {
          toast.error(response.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
        } else {
          toast.success(response.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
          resetComponent()
        }
        setLoadings(false)
      })
      .catch((error) => {
        toast.error(error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
        setLoadings(false)
      })
  }

  const handleStartDateChange = (date, dateString) => {
    if (date) {
      const parsedDate = dayjs(date, 'DD MMM, YYYY')
      const formattedDate = parsedDate.format('YYYY-MM-DD')
      setStartDate(formattedDate)
      setEndDate()
      form.setFieldsValue({ endDateValue: undefined })
    }
  }

  const handleEndDateChange = (date, dateString) => {
    if (date) {
      const parsedDate = dayjs(date, 'DD MMM, YYYY')
      const formattedDate = parsedDate.format('YYYY-MM-DD')
      setEndDate(formattedDate)
    }
  }

  // const disabledDate = (current) => {
  //   return current && current < dayjs().startOf('day')
  // }

  const disabledEndDate = (current) => {
    if (!startDate) {
      return current && current < dayjs().startOf('day')
    }
    return current && current < dayjs(startDate).startOf('day')
  }

  const resetComponent = () => {
    setStatus('')
    setSelectedFile(null)
    form.resetFields()
    close()
  }

  const techOwnerOptions = techOwnerList?.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px', borderRadius: '14px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {user.name}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))

  const prodOwnerOptions = prodOwnerList?.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px', borderRadius: '14px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {user.name}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))

  const dataOwnerOptions = dataOwnerList?.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px', borderRadius: '14px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {user.name}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))

  const howOwnerOptions = howOwnerList?.map((user) => ({
    value: user.id,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px', borderRadius: '14px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {user.name}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))

  return (
    <div style={{ display: 'flex' }}>
      <CRow>
        <div
          style={{ marginTop: '35px' }}
          className="back_arrow_create"
          // style={{width: '35px' }}
        >
          <span
            className=""
            onClick={resetComponent}
            style={{ cursor: 'pointer', marginTop: '17px', marginLeft: '10px' }}
          >
            <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
          </span>
        </div>
      </CRow>
      <CRow>
        <div style={{ marginLeft: '9px' }}>
          <CCol>
            <div>
              <h6 className="product-heading" style={{ marginTop: '2%' }}>
                Create Product
              </h6>
            </div>

            <Breadcrumb
              // style={{ marginLeft: '19px' }}
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
                    <button
                      className="bg-none border-0 bread-items text-secondary second-subheading"
                      style={{ cursor: 'pointer', backgroundColor: 'transparent' }}
                      onClick={close}
                    >
                      {titleList}
                    </button>
                  ),
                },
                {
                  title: (
                    <span
                      className="text-secondary second-subheading"
                      style={{ cursor: 'default' }}
                    >
                      Create Product
                    </span>
                  ),
                },
              ]}
            />
          </CCol>

          {/* <CRow> */}

          <Form
            className="mt-4 needs-validation create_product_list"
            ref={formRef}
            form={form}
            initialValues={{ budget: '', summary: '', currency: null }}
            layout="vertical"
            onFinish={handleSubmit}
            encType="multipart/form-data"
            requiredMark={false}
            validateTrigger="onSubmit"
            style={{ width: '95%' }}
          >
            <div className="product-pend">
              <div
                style={{
                  height:
                    !designation.includes('Internal Admin') && empId !== '120034'
                      ? '400px'
                      : '500px',
                  overflowY: 'auto',
                }}
              >
                <CRow>
                  <h6 style={{ fontWeight: '700', fontSize: '13px' }}>Product Details</h6>
                </CRow>
                <CRow sx={12}>
                  <CCol xs={4} sm={3} md={3} lg={2}>
                    <Form.Item
                      name="flow"
                      label={
                        <span className="form-label">
                          Flow <span className="red-text1">*</span>
                        </span>
                      }
                      rules={[{ required: true, message: 'Please Choose Flow' }]}
                    >
                      <Select
                        ref={selectRef}
                        className="border-0 time-border-bottom"
                        placeholder="Choose Flow"
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                        options={options}
                        filterOption={(input, option) =>
                          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                        onDropdownVisibleChange={handleDropdownVisibleChange}
                      />
                    </Form.Item>
                  </CCol>
                  <CCol xs={4} sm={3} md={3} lg={2}>
                    <Form.Item
                      name="name"
                      label={
                        <span className="form-label">
                          Product Name <span className="red-text1">*</span>
                        </span>
                      }
                      rules={[
                        { required: true, message: 'Please Enter Product Name' },
                        {
                          pattern:
                            /^(?!.*\s$)(?!^\s)(?!.*\s{2,})(?!.*\(\))(?!^\(\))[a-zA-Z0-9\s.()-]+$/,
                          message: 'Invalid input',
                        },
                      ]}
                      validateTrigger={['onChange', 'onSubmit']}
                    >
                      <Input
                        variant={'borderless'}
                        style={{ marginTop: '9px' }}
                        maxLength={48}
                        className="border-0 time-border-bottom px-0"
                        placeholder="Enter Product Name"
                      />
                    </Form.Item>
                  </CCol>
                  <CCol xs={4} sm={3} md={3} lg={2}>
                    <Form.Item
                      name="prodHeadValue"
                      label={<span className="form-label">Product Head </span>}
                      rules={[
                        {
                          required: true,
                          message: 'Please Choose Product Head',
                          validator: async (_, value) => {
                            const prodHead = form.getFieldValue('techHeadValue')
                            const dataHead = form.getFieldValue('dataHeadValue')
                            const howHead = form.getFieldValue('howHeadValue')
                            if (!prodHead && !value && !dataHead && !howHead) {
                              throw new Error('Please Choose Product Head')
                            }
                          },
                        },
                      ]}
                    >
                      <Select
                        ref={selectRef}
                        className="border-0 time-border-bottom product_head_select"
                        placeholder="Choose Product Head"
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                        options={prodHeadOption}
                        disabled={prodHeadOption.find((option) => option.value === userId)}
                        filterOption={(input, option) => {
                          const userName =
                            option.label.props.children[1].props.children[0].props.children[1] // Adjust this according to the actual structure
                          return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}
                        onDropdownVisibleChange={handleDropdownVisibleChange}
                        allowClear
                        showSearch
                      />
                    </Form.Item>
                  </CCol>
                  <CCol xs={4} sm={3} md={3} lg={2}>
                    <Form.Item
                      name="techHeadValue"
                      label={<span className="form-label">Technical Head</span>}
                      rules={[
                        {
                          required: true,
                          message: 'Please Choose Technical Head',
                          validator: async (_, value) => {
                            const prodHead = form.getFieldValue('prodHeadValue')
                            const dataHead = form.getFieldValue('dataHeadValue')
                            const howHead = form.getFieldValue('howHeadValue')
                            if (!prodHead && !value && !dataHead && !howHead) {
                              throw new Error('Please Choose Technical Head')
                            }
                          },
                        },
                      ]}
                    >
                      <Select
                        ref={selectRef}
                        className="border-0 time-border-bottom"
                        placeholder="Choose Technical Head"
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                        options={techHeadOption}
                        disabled={techHeadOption.some((option) => option.value === userId)}
                        filterOption={(input, option) => {
                          const userName =
                            option.label.props.children[1].props.children[0].props.children[1] // Adjust this according to the actual structure
                          return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}
                        onDropdownVisibleChange={handleDropdownVisibleChange}
                        allowClear
                        showSearch
                      />
                    </Form.Item>
                  </CCol>
                  <CCol xs={4} sm={3} md={3} lg={2}>
                    <Form.Item
                      name="dataHeadValue"
                      label={<span className="form-label">Data Head</span>}
                      rules={[
                        {
                          required: true,
                          message: 'Please Choose Data Head',
                          validator: async (_, value) => {
                            const prodHead = form.getFieldValue('prodHeadValue')
                            const techHead = form.getFieldValue('techHeadValue')
                            const howHead = form.getFieldValue('howHeadValue')
                            if (!prodHead && !value && !techHead && !howHead) {
                              throw new Error('Please Choose Data Head')
                            }
                          },
                        },
                      ]}
                    >
                      <Select
                        ref={selectRef}
                        className="border-0 time-border-bottom"
                        placeholder="Choose Data Head"
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                        options={dataHeadOption}
                        disabled={dataHeadOption.some((option) => option.value === userId)}
                        filterOption={(input, option) => {
                          const userName =
                            option.label.props.children[1].props.children[0].props.children[1] // Adjust this according to the actual structure
                          return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}
                        onDropdownVisibleChange={handleDropdownVisibleChange}
                        allowClear
                        showSearch
                      />
                    </Form.Item>
                  </CCol>
                  <CCol xs={4} sm={3} md={3} lg={2}>
                    <Form.Item
                      name="howHeadValue"
                      label={<span className="form-label">HOW Head</span>}
                      rules={[
                        {
                          required: true,
                          message: 'Please Choose HOW Head',
                          validator: async (_, value) => {
                            const prodHead = form.getFieldValue('prodHeadValue')
                            const techHead = form.getFieldValue('techHeadValue')
                            const dataHead = form.getFieldValue('dataHeadValue')
                            if (!prodHead && !value && !techHead && !dataHead) {
                              throw new Error('Please Choose HOW Head')
                            }
                          },
                        },
                      ]}
                    >
                      <Select
                        ref={selectRef}
                        className="border-0 time-border-bottom"
                        placeholder="Choose HOW Head"
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                        options={howHeadOption}
                        disabled={howHeadOption.some((option) => option.value === userId)}
                        filterOption={(input, option) => {
                          const userName =
                            option.label.props.children[1].props.children[0].props.children[1] // Adjust this according to the actual structure
                          return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}
                        onDropdownVisibleChange={handleDropdownVisibleChange}
                        allowClear
                        showSearch
                      />
                    </Form.Item>
                  </CCol>
                  <CCol xs={4} sm={3} md={3} lg={2}>
                    <Form.Item
                      name="category"
                      label={
                        <span className="form-label">
                          Business Category <span className="red-text1">*</span>
                        </span>
                      }
                      rules={[{ required: true, message: 'Please Choose Category' }]}
                    >
                      <Select
                        ref={selectRef}
                        className="border-0 time-border-bottom"
                        placeholder="Choose Category"
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                        options={categoryOption}
                        allowClear
                        showSearch
                        onDropdownVisibleChange={handleDropdownVisibleChange}
                        filterOption={(input, option) =>
                          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      />
                    </Form.Item>
                  </CCol>
                  <CCol xs={4} sm={3} md={3} lg={2}>
                    <Form.Item
                      name="startDateValue"
                      label={
                        <span className="form-label">
                          Start Date <span className="red-text1">*</span>
                        </span>
                      }
                      rules={[{ required: true, message: 'Please Select Start Date' }]}
                    >
                      <DatePicker
                        variant={'borderless'}
                        className="border-0 time-border-bottom"
                        style={{ paddingLeft: '0px', marginTop: '9px' }}
                        placeholder="Choose Date"
                        allowClear
                        suffixIcon={
                          <Calendar width="15" height="14" viewBox="0 0 15 14" fill="white" />
                        }
                        // disabledDate={disabledDate}
                        onChange={handleStartDateChange}
                        format="DD MMM,YYYY"
                      />
                    </Form.Item>
                  </CCol>

                  <CCol xs={4} sm={3} md={3} lg={2}>
                    <Form.Item
                      name="endDateValue"
                      label={<span className="form-label">End Date</span>}
                      // rules={[{ required: true, message: 'Please Choose End Date' }]}
                    >
                      <DatePicker
                        variant={'borderless'}
                        className="border-0 time-border-bottom"
                        style={{ paddingLeft: '0px', marginTop: '10px' }}
                        placeholder="Choose Date"
                        allowClear
                        suffixIcon={
                          <Calendar width="15" height="14" viewBox="0 0 15 14" fill="white" />
                        }
                        onChange={handleEndDateChange}
                        disabledDate={disabledEndDate}
                        format="DD MMM,YYYY"
                      />
                    </Form.Item>
                  </CCol>
                  <CCol xs={4} sm={4} md={3} lg={2}>
                    <Form.Item
                      name="summary"
                      label={<span className="form-label">Product Summary</span>}
                      rules={[{ required: false, message: 'Please Enter Summary' }]}
                    >
                      <Input.TextArea
                        className="border-0 time-border-bottom px-0"
                        placeholder="Enter Summary"
                        id="summary"
                        variant={'borderless'}
                        style={{ color: 'black', marginTop: '10px' }} // Adjust '100px' to your desired minimum height
                        autoSize={{
                          minRows: 0,
                          maxRows: 1,
                        }}
                      />
                    </Form.Item>
                  </CCol>
                  <CCol xs={4} sm={3} md={3} lg={2}>
                    <Form.Item name="filesValue" label={<span className="form-label">File</span>}>
                      <div
                        className="input-group custom-input-group custom_input_group"
                        style={{
                          marginTop: '-9px',
                        }}
                      >
                        <input
                          type="text"
                          value={selectedFile ? selectedFile.name : ''}
                          readOnly
                          name="fieldName"
                          className="form-control input_border"
                          aria-label="Upload File"
                          aria-describedby="basic-addon1"
                          style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            height: '20px',
                          }}
                        />
                        <div className="input-group-append">
                          <button
                            className="browse input-group-text text-danger"
                            onClick={handleBrowseClick}
                            type="button"
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                      <input
                        type="file"
                        className="file"
                        ref={fileInputRef}
                        accept=".png, .jpeg, .jpg, .pdf, .docx"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <p className="text-danger" style={{ fontSize: '12px' }}>
                        {error}
                      </p>
                    </Form.Item>
                  </CCol>
                  {(designation.includes('Internal Admin') || empId === '120034') && (
                    <>
                      <CCol xs={4} sm={4} md={6} lg={5}>
                        <Form.Item
                          name="techOwnerName"
                          label={<span className="form-label">Technical Owners</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Please Choose Technical Owner',
                              validator: async (_, value) => {
                                const prodOwner = form.getFieldValue('prodOwnerName')
                                const dataOwner = form.getFieldValue('dataOwnerName')
                                const howOwner = form.getFieldValue('howOwnerName')
                                if (!prodOwner && !value && !dataOwner && !howOwner) {
                                  throw new Error('Please Choose Technical Owner')
                                }
                              },
                            },
                          ]}
                        >
                          <Select
                            className="form-custom-selects access-input-box approval_select"
                            options={techOwnerOptions}
                            required
                            showSearch
                            placeholder="Choose Technical Owner"
                            allowClear
                            mode="multiple"
                            variant={'borderless'}
                            filterOption={(input, option) => {
                              const userName =
                                option.label.props.children[1].props.children[0].props.children // Adjust this according to the actual structure
                              return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }}
                            suffixIcon={
                              <img
                                src={Downarrowimg}
                                alt="Downarrowimg"
                                style={{ width: '10px', height: '6px' }}
                              />
                            }
                            maxTagCount="responsive"
                          />
                        </Form.Item>
                      </CCol>
                      <CCol xs={4} sm={4} md={6} lg={5}>
                        <Form.Item
                          name="prodOwnerName"
                          label={<span className="form-label">Product Owners</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Please Choose Product Owner',
                              validator: async (_, value) => {
                                const prodOwner = form.getFieldValue('techOwnerName')
                                const dataOwner = form.getFieldValue('dataOwnerName')
                                const howOwner = form.getFieldValue('howOwnerName')
                                if (!prodOwner && !value && !dataOwner && !howOwner) {
                                  throw new Error('Please Choose Product Owner')
                                }
                              },
                            },
                          ]}
                        >
                          <Select
                            className="form-custom-selects access-input-box approval_select"
                            options={prodOwnerOptions}
                            required
                            showSearch
                            placeholder="Choose Product Owner"
                            allowClear
                            mode="multiple"
                            variant={'borderless'}
                            filterOption={(input, option) => {
                              const userName =
                                option.label.props.children[1].props.children[0].props.children // Adjust this according to the actual structure
                              return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }}
                            suffixIcon={
                              <img
                                src={Downarrowimg}
                                alt="Downarrowimg"
                                style={{ width: '10px', height: '6px' }}
                              />
                            }
                            maxTagCount="responsive"
                          />
                        </Form.Item>
                      </CCol>
                      <CCol xs={4} sm={4} md={6} lg={5}>
                        <Form.Item
                          name="dataOwnerName"
                          label={<span className="form-label">Data Owners</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Please Choose Data Owner',
                              validator: async (_, value) => {
                                const prodOwner = form.getFieldValue('prodOwnerName')
                                const techOwner = form.getFieldValue('techOwnerName')
                                const howOwner = form.getFieldValue('howOwnerName')
                                if (!prodOwner && !value && !techOwner && !howOwner) {
                                  throw new Error('Please Choose Data Owner')
                                }
                              },
                            },
                          ]}
                        >
                          <Select
                            className="form-custom-selects access-input-box approval_select"
                            options={dataOwnerOptions}
                            required
                            showSearch
                            placeholder="Choose Data Owner"
                            allowClear
                            mode="multiple"
                            variant={'borderless'}
                            filterOption={(input, option) => {
                              const userName =
                                option.label.props.children[1].props.children[0].props.children // Adjust this according to the actual structure
                              return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }}
                            suffixIcon={
                              <img
                                src={Downarrowimg}
                                alt="Downarrowimg"
                                style={{ width: '10px', height: '6px' }}
                              />
                            }
                            maxTagCount="responsive"
                          />
                        </Form.Item>
                      </CCol>
                      <CCol xs={4} sm={4} md={6} lg={5}>
                        <Form.Item
                          name="howOwnerName"
                          label={<span className="form-label">HOW Owners</span>}
                          rules={[
                            {
                              required: true,
                              message: 'Please Choose HOW Owner',
                              validator: async (_, value) => {
                                const prodOwner = form.getFieldValue('prodOwnerName')
                                const techOwner = form.getFieldValue('techOwnerName')
                                const dataOwner = form.getFieldValue('dataOwnerName')
                                if (!prodOwner && !value && !techOwner && !dataOwner) {
                                  throw new Error('Please Choose HOW Owner')
                                }
                              },
                            },
                          ]}
                        >
                          <Select
                            className="form-custom-selects access-input-box approval_select"
                            options={howOwnerOptions}
                            required
                            showSearch
                            placeholder="Choose HOW Owner"
                            allowClear
                            mode="multiple"
                            variant={'borderless'}
                            filterOption={(input, option) => {
                              const userName =
                                option.label.props.children[1].props.children[0].props.children // Adjust this according to the actual structure
                              return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }}
                            suffixIcon={
                              <img
                                src={Downarrowimg}
                                alt="Downarrowimg"
                                style={{ width: '10px', height: '6px' }}
                              />
                            }
                            maxTagCount="responsive"
                          />
                        </Form.Item>
                      </CCol>
                    </>
                  )}
                </CRow>
                <CRow>
                  <h6 style={{ fontWeight: '700', fontSize: '13px' }}>Budget Details</h6>
                </CRow>
                <CRow>
                  <CCol sm={3} md={3} lg={2}>
                    <Form.Item
                      name="budget"
                      label={<span className="form-label">Product Budget</span>}
                      rules={[
                        {
                          required: true,
                          message: 'Please Enter Budget',
                          validator: async (_, value) => {
                            const currencyValue = form.getFieldValue('currency')
                            if (currencyValue && !value) {
                              throw new Error('Please enter product budget')
                            }
                          },
                        },
                        {
                          pattern: /^[0-9,.]{1,8}$/,
                          message: 'Number input with maximum 8 digits allowed',
                        },
                      ]}
                      validateTrigger={['onChange', 'onSubmit']}
                    >
                      <Input
                        className="border-0 time-border-bottom px-0"
                        placeholder="Choose Budget"
                        id="budget"
                        style={{ color: 'black' }}
                        variant={'borderless'}
                      />
                    </Form.Item>
                  </CCol>
                  <CCol sm={3} md={3} lg={2}>
                    <Form.Item
                      name="currency"
                      label={<span className="form-label">Currency</span>}
                      rules={[
                        {
                          required: true,
                          message: 'Please Choose Currency',
                          validator: async (_, value) => {
                            const budgetValue = form.getFieldValue('budget')
                            if (budgetValue && !value) {
                              throw new Error('Please choose currency')
                            }
                          },
                        },
                      ]}
                    >
                      <Select
                        className="border-0 time-border-bottom"
                        placeholder="Choose Currency"
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                      >
                        <Select.Option value="USD">USD</Select.Option>
                        <Select.Option value="INR">INR</Select.Option>
                      </Select>
                    </Form.Item>
                  </CCol>
                </CRow>
              </div>
              <CRow>
                <CCol sm={12} className="d-flex justify-content-end align-items-center">
                  {!designation.includes('Internal Admin') && empId !== '120034' && (
                    <Button
                      className="draft-btn"
                      loading={loadingState}
                      htmlType="submit"
                      onClick={() => setStatus('DRAFT')}
                    >
                      Save As Draft
                    </Button>
                  )}
                  <Button
                    className="submit-button save_changes"
                    style={{ fontSize: '13px', color: 'white' }}
                    htmlType="submit"
                    onClick={() => setStatus('CREATED')}
                    loading={loadingState}
                  >
                    Submit
                  </Button>
                </CCol>
              </CRow>
            </div>
          </Form>
        </div>
      </CRow>
    </div>
  )
}
AddProduct.propTypes = {
  flow: PropTypes.number,
  flowList: PropTypes.array.isRequired,
  close: PropTypes.func,
  prodOwnerList: PropTypes.array,
  techOwnerList: PropTypes.array,
  dataOwnerList: PropTypes.array,
  howOwnerList: PropTypes.array,
  categories: PropTypes.array,
  techHeadList: PropTypes.array,
  prodHeadList: PropTypes.array,
  dataHeadList: PropTypes.array,
  howHeadList: PropTypes.array,
  titleList: PropTypes.string,
}
export default AddProduct
