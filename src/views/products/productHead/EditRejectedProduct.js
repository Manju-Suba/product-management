import React, { useState, useRef, useEffect } from 'react'
import { CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import { ImageUrl, getDecodeData, getHeaders } from '../../../constant/Global'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import profileImage1 from '../../../assets/images/avatars/man1.png'
import { Breadcrumb, Select, Row, Input, Button, Form, DatePicker } from 'antd'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import Calendar from '../../svgImages/Calendar'
import dayjs from 'dayjs'
import stage from '../../../assets/images/form/stage.png'
import stage1 from '../../../assets/images/form/stage-p.png'
import stage2 from '../../../assets/images/form/stage-a.png'
import stage3 from '../../../assets/images/form/stage-r.png'
import eyeIcon from '../../../assets/images/login/Show.png'
import useAxios from 'src/constant/UseAxios'
import Downarrowimg from '../../../assets/images/downarrow.png'
import { Link } from 'react-router-dom'

const EditRejectedProduct = ({
  flowList,
  close,
  techHeadList,
  prodHeadList,
  dataHeadList,
  categories,
  EditProductData,
}) => {
  let api = useAxios()
  const user = getDecodeData()
  const userId = user && user.id
  const formRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [loadingState, setLoadings] = useState(false)
  const fileInputRef = useRef(null)
  const [form] = Form.useForm()
  const [flowId, setFlowId] = useState()
  const selectRef = useRef(null)
  const [error, setError] = useState('')

  const handleBrowseClick = () => {
    fileInputRef.current.click()
  }
  const handleDropdownVisibleChange = (visible) => {
    if (!visible && selectRef.current) {
      selectRef.current.blur()
    }
  }
  const openFileInNewTab = () => {
    window.open(ImageUrl + EditProductData.file, '_blank')
  }

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

  const options = flowList.map((flow) => ({
    value: flow.id,
    label: flow.name,
  }))

  const categoryOption = categories.map((cate) => ({
    value: cate.id,
    label: cate.name,
  }))

  useEffect(() => {
    form.setFieldsValue({
      budget: EditProductData.budget,
      summary: EditProductData.summary,
      flowValue: EditProductData.flowName,
      name: EditProductData.name,
      techHeadValue: EditProductData.tech_headId !== 0 ? EditProductData.tech_headId : '',
      prodHeadValue: EditProductData.prod_headId !== 0 ? EditProductData.prod_headId : '',
      startDateValue: EditProductData.startDate && dayjs(EditProductData.startDate),
      endDateValue: EditProductData.endDate && dayjs(EditProductData.endDate),
      filesValue: EditProductData.file,
      currency:
        EditProductData.currency === 'undefined' || EditProductData.currency === 'null'
          ? null
          : EditProductData.currency,
      category: EditProductData.categoryID,
      rejRemarks: EditProductData.approvalremarks,
    })
    setSelectedFile(EditProductData.file)
    setStartDate(EditProductData.startDate)
    setEndDate(EditProductData.endDate)
    setFlowId(EditProductData.flow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EditProductData])

  const handleSubmit = async (values) => {
    if (selectedFile) {
      const validFormats = ['.png', '.jpeg', '.jpg', '.pdf', '.docx']
      const fileExtension = selectedFile.name.split('.').pop()

      if (!validFormats.includes('.' + fileExtension.toLowerCase())) {
        setError('Please select a valid file (.png, .jpeg, .jpg, .pdf, .docx).')
        return
      }
    }
    const formData = new FormData()
    setLoadings(true)
    formData.append('option', status)
    Object.keys(values).forEach((key) => {
      if (key === 'endDateValue') {
        if (endDate === undefined || endDate === null) {
          formData.append('endDate', '')
        } else {
          formData.append('endDate', endDate)
        }
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
      if (key === 'startDateValue') {
        formData.append('startDate', startDate)
      }
      if (key === 'flowValue') {
        formData.append('flow', flowId)
      }
      if (key === 'filesValue') formData.append('files', selectedFile)
      else formData.append(key, values[key])
    })
    const url = 'approval/product/update/' + EditProductData.id
    await api
      .put(url, formData, {
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
        const errorMessage = error.response
        if (errorMessage.status !== 400) {
          toast.error(errorMessage.data.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
        } else {
          toast.error('Request to failed', {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 3000,
          })
        }
        setLoadings(false)
      })
  }

  const handleStartDateChange = (date, dateString) => {
    if (date) {
      const parsedDate = dayjs(date, 'DD MMM, YYYY')
      const formattedDate = parsedDate.format('YYYY-MM-DD')
      setStartDate(formattedDate)
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

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day')
  }

  const disabledEndDate = (current) => {
    if (!startDate) {
      return current && current < dayjs().startOf('day')
    }
    return current && current < dayjs(startDate).startOf('day')
  }

  const resetComponent = () => {
    close()
    setStatus('')
    setSelectedFile(null)
    form.resetFields()
  }

  return (
    <>
      <CRow>
        <CCol xs={9} md={9}>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '35px' }}>
              <span
                className="back_arrow_rej"
                onClick={resetComponent}
                style={{ cursor: 'pointer', marginTop: '17px', marginLeft: '10px' }}
              >
                <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
              </span>
            </div>
            <CCol>
              {/* <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              > */}
              <CRow>
                <CCol xs={12} sm={12} md={6}>
                  <div style={{ marginTop: '20px' }}>
                    <h6 className="product-heading" style={{ marginTop: '2%' }}>
                      Edit <span style={{ color: '#E01B38' }}>{EditProductData.name}</span>
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
                          <span
                            className="bread-items text-secondary second-subheading"
                            style={{ cursor: 'pointer' }}
                            onClick={close}
                          >
                            Rejected List
                          </span>
                        ),
                      },
                      {
                        title: (
                          <span
                            className="text-secondary second-subheading"
                            style={{ cursor: 'default' }}
                          >
                            Edit Rejected Product
                          </span>
                        ),
                      },
                    ]}
                  />
                </CCol>
                <CCol md={6}>
                  <div>
                    <p className="text-c" style={{ fontSize: '13px', marginTop: '12px' }}>
                      This Product has been Rejected by {EditProductData.approvalby}{' '}
                      {EditProductData.approvalRole}
                    </p>
                  </div>
                </CCol>
              </CRow>
              {/* </div> */}
              {/* <p style={{ fontSize: '12px', color: '#9B9B9B' }}>
                Remarks : {EditProductData.approvalremarks}
              </p> */}
              {/* </div> */}
            </CCol>
          </div>

          <CRow className="product-draft-edit">
            <Form
              className="mt-4 needs-validation"
              ref={formRef}
              form={form}
              initialValues={{
                budget: EditProductData.budget,
                summary: EditProductData.summary,
                flowValue: EditProductData.flowName,
                name: EditProductData.name,
                techHeadValue: EditProductData.tech_headId !== 0 ? EditProductData.tech_headId : '',
                prodHeadValue: EditProductData.prod_headId !== 0 ? EditProductData.prod_headId : '',
                dataHeadValue: EditProductData.data_headId !== 0 ? EditProductData.data_headId : '',
                startDateValue: EditProductData.startDate && dayjs(EditProductData.startDate),
                endDateValue:
                  EditProductData.endDate !== null ? dayjs(EditProductData.endDate) : '',
                filesValue: EditProductData.file,
                currency:
                  EditProductData.currency === 'undefined' || EditProductData.currency === 'null'
                    ? null
                    : EditProductData.currency,
                category: EditProductData.categoryID,
                rejRemarks: EditProductData.approvalremarks,
              }}
              layout="vertical"
              onFinish={handleSubmit}
              encType="multipart/form-data"
              requiredMark={false}
              validateTrigger="onSubmit"
              style={{ marginLeft: '39px', width: '100%', paddingRight: '45px' }}
            >
              <CRow>
                <h6 style={{ fontWeight: '700', fontSize: '13px' }}>Product Details</h6>
              </CRow>
              <CRow style={{ marginTop: '10px' }}>
                <CCol xs={6} sm={4} md={3}>
                  <Form.Item
                    name="flowValue"
                    label={
                      <span className="form-label">
                        Flow <span className="red-text1">*</span>
                      </span>
                    }
                    rules={[{ required: true, message: 'Please Choose Flow' }]}
                  >
                    <Select
                      ref={selectRef}
                      onDropdownVisibleChange={handleDropdownVisibleChange}
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
                      showSearch
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={(value) => setFlowId(value)}
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3}>
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
                  >
                    <Input
                      variant={'borderless'}
                      maxLength={48}
                      className="border-0 time-border-bottom px-0"
                      placeholder="Enter Product Name"
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3}>
                  <Form.Item
                    name="prodHeadValue"
                    label={<span className="form-label">Product Head</span>}
                  >
                    <Select
                      ref={selectRef}
                      className="border-0 time-border-bottom rej_selectbox"
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
                <CCol xs={6} sm={4} md={3}>
                  <Form.Item
                    name="techHeadValue"
                    label={<span className="form-label">Technical Head</span>}
                  >
                    <Select
                      ref={selectRef}
                      className="border-0 time-border-bottom rej_selectbox"
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
                      allowClear
                      showSearch
                      onDropdownVisibleChange={handleDropdownVisibleChange}
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3}>
                  <Form.Item
                    name="dataHeadValue"
                    label={<span className="form-label">Data Head</span>}
                  >
                    <Select
                      ref={selectRef}
                      className="border-0 time-border-bottom rej_selectbox"
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
                      allowClear
                      showSearch
                      onDropdownVisibleChange={handleDropdownVisibleChange}
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3}>
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
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                      onDropdownVisibleChange={handleDropdownVisibleChange}
                    />
                  </Form.Item>
                </CCol>
                {/* </CRow>
              <Row gutter={16} style={{ marginTop: '10px' }}> */}
                <CCol xs={6} sm={4} md={3}>
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
                      style={{ paddingLeft: '0px', marginTop: '10px' }}
                      placeholder="Choose Date"
                      allowClear
                      suffixIcon={
                        <Calendar width="15" height="14" viewBox="0 0 15 14" fill="white" />
                      }
                      disabledDate={disabledDate}
                      onChange={handleStartDateChange}
                      format="DD MMM,YYYY"
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3}>
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
                <CCol xs={6} sm={9} md={3}>
                  <Form.Item
                    name="summary"
                    label={<span className="form-label">Product Summary</span>}
                    // rules={[{ required: true, message: 'Please Enter Summary' }]}
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
                <CCol xs={6} sm={4} md={3}>
                  <Form.Item
                    name="filesValue"
                    label={
                      <div style={{ width: '220px' }}>
                        <span className="form-label">File</span>
                        <button
                          onClick={openFileInNewTab}
                          type="button"
                          className="border-0 bg-none"
                          style={{
                            cursor: 'pointer',
                            background: 'none',
                            float: 'inline-end',
                          }}
                          disabled={EditProductData.file === null}
                        >
                          <img src={eyeIcon} alt="Password" width={12} />
                        </button>
                      </div>
                    }
                  >
                    <div className="input-group custom-input-group custom_input_group">
                      <input
                        type="text"
                        value={selectedFile ? selectedFile.name : ''}
                        readOnly
                        name="fieldName"
                        className="form-control border-0"
                        aria-label="Upload File"
                        aria-describedby="basic-addon1"
                        style={{ fontSize: '13px', fontWeight: '500', height: '10px' }}
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
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <p className="text-danger" style={{ fontSize: '12px' }}>
                      {error}
                    </p>
                  </Form.Item>
                </CCol>
              </CRow>
              <CRow style={{ marginTop: '10px' }}>
                <h6 style={{ fontWeight: '700', fontSize: '13px' }}>Budget Details</h6>
              </CRow>
              <CRow style={{ marginTop: '10px' }}>
                <CCol sm={4} md={3}>
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
                      { pattern: /^[0-9,.]{1,8}$/, message: 'Please enter numbers only' },
                    ]}
                  >
                    <Input
                      className="border-0 time-border-bottom px-0"
                      placeholder="Choose Budget"
                      id="budget"
                      variant={'borderless'}
                      style={{ color: 'black' }}
                    />
                  </Form.Item>
                </CCol>
                <CCol sm={4} md={3}>
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
                <CCol sm={4} md={3}>
                  <Form.Item
                    name="rejRemarks"
                    label={<span className="form-label">Rejected Remarks</span>}
                    // rules={[{ required: true, message: 'Please Enter Rejected Remarks' }]}
                  >
                    <Input.TextArea
                      className="border-0 time-border-bottom px-0"
                      id="Rejected Remarks"
                      disabled
                      variant={'borderless'}
                      style={{ color: 'black', marginTop: '10px', cursor: 'not-allowed' }} // Adjust '100px' to your desired minimum height
                      autoSize={{
                        minRows: 0,
                        maxRows: 1,
                      }}
                    />
                  </Form.Item>
                </CCol>
                <CCol
                  sm={4}
                  md={3}
                  className="d-flex justify-content-end align-items-center"
                  style={{ padding: '19px' }}
                >
                  <Button
                    className=" save_changes"
                    style={{ fontSize: '13px', color: 'white' }}
                    htmlType="submit"
                    onClick={() => setStatus('CREATED')}
                    loading={loadingState}
                  >
                    Update
                  </Button>
                </CCol>
              </CRow>
            </Form>
          </CRow>
        </CCol>
        <CCol xs={3} md={3} className="approvalflow-rightside">
          <div style={{ marginLeft: '14px' }}>
            <Row style={{ marginTop: '31%' }}>
              <h6 style={{ fontWeight: '700', fontSize: '13px' }}>Approval Flow</h6>
            </Row>
            <div style={{ maxHeight: '290px', overflowY: 'auto' }}>
              {EditProductData.approvalFlow &&
                EditProductData.approvalFlow.map((approver, approverIndex) => (
                  <React.Fragment key={approverIndex}>
                    <CRow className="align-items-center mt-2">
                      <div className="">
                        <img
                          alt="stages"
                          style={{ width: '12px' }}
                          className="content-img appr_img"
                          src={
                            approver.approvalStatus === 'Pending'
                              ? stage1
                              : approver.approvalStatus === 'Approved'
                              ? stage2
                              : approver.approvalStatus === 'Rejected'
                              ? stage3
                              : stage
                          }
                        />
                        <span style={{ marginLeft: '10%', fontSize: '11px', fontWeight: '600' }}>
                          Flow {approverIndex + 1}
                        </span>
                      </div>
                    </CRow>

                    <CRow className="align-items-center" style={{ marginTop: '12px' }}>
                      <div className="col-md-1">
                        <div className="vertical-line"></div>
                      </div>
                    </CRow>

                    {/* Profile details */}
                    <CRow className="align-items-center">
                      <div className="col-md-1"></div>
                      <div className="col-md-2 col-sm-2" style={{ marginleft: '12px' }}>
                        <img
                          alt="profile"
                          className="head-td-flow_rej"
                          src={
                            approver.profile_pic ? ImageUrl + approver.profile_pic : profileImage1
                          }
                        />
                      </div>
                      <div className="col-md-6 name_role" style={{ marginTop: '6px' }}>
                        <p className="head-td-name" title={approver.name}>
                          {approver.name}
                        </p>
                        <p className="head-td-role" title={approver.role}>
                          {approver.role}
                        </p>
                      </div>
                    </CRow>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </CCol>
      </CRow>
    </>
  )
}
EditRejectedProduct.propTypes = {
  flowList: PropTypes.array.isRequired,
  close: PropTypes.func,
  prodOwnerList: PropTypes.array,
  techOwnerList: PropTypes.array,
  categories: PropTypes.array,
  techHeadList: PropTypes.array,
  prodHeadList: PropTypes.array,
  dataHeadList: PropTypes.array,
  EditProductData: PropTypes.array,
}
export default EditRejectedProduct
