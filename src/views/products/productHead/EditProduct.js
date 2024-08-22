import React, { useState, useRef, useEffect } from 'react'
import { CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import { ImageUrl, getDecodeData, getHeaders } from '../../../constant/Global'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import profileImage1 from '../../../assets/images/avatars/man1.png'
import { Breadcrumb, Select, Col, Row, Input, Button, Form, DatePicker } from 'antd'
import { CaretDownOutlined } from '@ant-design/icons'
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

const EditProduct = ({
  flowList,
  techHeadList,
  prodHeadList,
  dataHeadList,
  howHeadList,
  categories,
  EditProductData,
  callBackFunc,
  title,
  viewStatus,
  mastersTech,
  mastersProd,
  mastersData,
  mastersHow,
}) => {
  let api = useAxios()
  const user = getDecodeData()
  const userId = user?.id
  const formRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [status, setStatus] = useState('')
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [loadingState, setLoadings] = useState(false)
  const fileInputRef = useRef(null)
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const selectRef = useRef(null)

  const handleBrowseClick = () => {
    fileInputRef.current.click()
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

  const techOwnerOptions = mastersTech?.map((user) => ({
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

  const prodOwnerOptions = mastersProd?.map((user) => ({
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

  const dataOwnerOptions = mastersData?.map((user) => ({
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

  const howOwnerOptions = mastersHow?.map((user) => ({
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

  useEffect(() => {
    const selectedProdOwnerIds = EditProductData?.prodOwnerName
      ? EditProductData.prodOwnerName
          .map((name) => mastersProd.find((user) => user.name === name)?.id)
          .filter(Boolean)
      : []
    const selectedTechOwnerIds = EditProductData?.techOwnerName
      ? EditProductData.techOwnerName
          .map((name) => mastersTech.find((user) => user.name === name)?.id)
          .filter(Boolean)
      : []
    const selectedDataOwnerIds = EditProductData?.dataOwnerName
      ? EditProductData.dataOwnerName
          .map((name) => mastersData.find((user) => user.name === name)?.id)
          .filter(Boolean)
      : []
    const selectedHowOwnerIds = EditProductData?.howOwnerName
      ? EditProductData.howOwnerName
          .map((name) => mastersHow.find((user) => user.name === name)?.id)
          .filter(Boolean)
      : []
    form.setFieldsValue({
      budget: EditProductData.budget,
      summary: EditProductData.summary,
      flow: EditProductData.flow,
      name: EditProductData.name,
      techHeadValue: EditProductData.tech_headId !== 0 ? EditProductData.tech_headId : '',
      prodHeadValue: EditProductData.prod_headId !== 0 ? EditProductData.prod_headId : '',
      dataHeadValue: EditProductData.data_headId !== 0 ? EditProductData.data_headId : '',
      howHeadValue: EditProductData.how_headId !== 0 ? EditProductData.how_headId : '',
      startDateValue: EditProductData.startDate && dayjs(EditProductData.startDate),
      endDateValue: EditProductData.endDate && dayjs(EditProductData.endDate),
      filesValue: EditProductData.file,
      currency:
        EditProductData.currency === 'undefined' || EditProductData.currency === 'null'
          ? null
          : EditProductData.currency,
      category: EditProductData.categoryID,
      prodOwnerName: selectedProdOwnerIds,
      techOwnerName: selectedTechOwnerIds,
      dataOwnerName: selectedDataOwnerIds,
      howOwnerName: selectedHowOwnerIds,
    })
    setSelectedFile(EditProductData.file)
    setStartDate(EditProductData.startDate)
    setEndDate(EditProductData.endDate !== null ? EditProductData.endDate : '')
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
    // formData.append('option', status)
    Object.keys(values).forEach((key) => {
      if (key === 'endDateValue') {
        if (endDate === undefined && endDate === null) {
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
      if (key === 'howHeadValue') {
        if (values[key] === undefined) {
          formData.append('howHead', 0)
        } else {
          formData.append('howHead', values[key])
        }
      }
      if (key === 'startDateValue') {
        formData.append('startDate', startDate)
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
    if (viewStatus === 'Admin') {
      url = 'product/update/' + EditProductData.id + '/' + status + '?key=Admin'
    } else {
      url = 'product/update/' + EditProductData.id + '/' + status
    }
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
    callBackFunc()
  }
  const handleDropdownVisibleChange = (visible) => {
    if (!visible && selectRef.current) {
      selectRef.current.blur()
    }
  }

  return (
    <CRow>
      <CCol md={9}>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '35px' }}>
            <span
              className=""
              onClick={resetComponent}
              style={{ cursor: 'pointer', marginTop: '17px', marginLeft: '10px' }}
            >
              <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
            </span>
          </div>

          <CCol>
            <div>
              <h6 className="product-heading" style={{ marginTop: '2%' }}>
                Edit <span style={{ color: '#E01B38' }}>{EditProductData.name}</span>
              </h6>
            </div>

            <Breadcrumb
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
                      onClick={resetComponent}
                    >
                      {title}
                    </span>
                  ),
                },
                {
                  title: (
                    <span
                      className="text-secondary second-subheading"
                      style={{ cursor: 'default' }}
                    >
                      {title === 'Draft List' ? 'Edit Draft' : 'Edit Product'}
                    </span>
                  ),
                },
              ]}
            />
          </CCol>
        </div>
        <Row className="product-draft-edit">
          <Form
            className="mt-4 needs-validation"
            ref={formRef}
            form={form}
            initialValues={{
              budget: EditProductData.budget,
              summary: EditProductData.summary,
              flow: EditProductData.flow,
              name: EditProductData.name,
              techHeadValue: EditProductData.tech_headId !== 0 ? EditProductData.tech_headId : '',
              prodHeadValue: EditProductData.prod_headId !== 0 ? EditProductData.prod_headId : '',
              howHeadValue: EditProductData.how_headId !== 0 ? EditProductData.how_headId : '',
              startDateValue: EditProductData.startDate && dayjs(EditProductData.startDate),
              endDateValue: EditProductData.endDate && dayjs(EditProductData.endDate),
              filesValue: EditProductData.file,
              currency:
                EditProductData.currency === 'undefined' || EditProductData.currency === 'null'
                  ? null
                  : EditProductData.currency,
              category: EditProductData.categoryID,
              // prodOwnerName:
              //   EditProductData?.prodOwnerName.length !== 0 ? EditProductData.prodOwnerName : null,
              // techOwnerName:
              //   EditProductData?.techOwnerName.length !== 0 ? EditProductData.techOwnerName : null,
            }}
            layout="vertical"
            onFinish={handleSubmit}
            encType="multipart/form-data"
            requiredMark={false}
            validateTrigger="onSubmit"
            style={{ marginLeft: '39px', width: '100%' }}
          >
            <Row>
              <h6 style={{ fontWeight: '700', fontSize: '13px' }}>Product Details</h6>
            </Row>
            <Row gutter={16}>
              <Col sm={4}>
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
                    suffixIcon={<CaretDownOutlined className="caretdownicon" />}
                    options={options}
                    showSearch
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  />
                </Form.Item>
              </Col>
              <Col sm={4} offset={1}>
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
                    maxLength={48}
                    className="border-0 time-border-bottom px-0"
                    placeholder="Enter Product Name"
                  />
                </Form.Item>
              </Col>
              <Col sm={4} offset={1}>
                <Form.Item
                  name="prodHeadValue"
                  label={<span className="form-label">Product Head</span>}
                >
                  <Select
                    ref={selectRef}
                    className="border-0 time-border-bottom"
                    placeholder="Choose Product Head"
                    suffixIcon={<CaretDownOutlined className="caretdownicon" />}
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
              </Col>
              <Col sm={4} offset={1}>
                <Form.Item
                  name="techHeadValue"
                  label={<span className="form-label">Technical Head</span>}
                >
                  <Select
                    ref={selectRef}
                    className="border-0 time-border-bottom"
                    placeholder="Choose Technical Head"
                    suffixIcon={<CaretDownOutlined className="caretdownicon" />}
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
              </Col>
              <Col sm={4} offset={1}>
                <Form.Item
                  name="dataHeadValue"
                  label={<span className="form-label">Data Head</span>}
                >
                  <Select
                    ref={selectRef}
                    className="border-0 time-border-bottom"
                    placeholder="Choose Data Head"
                    suffixIcon={<CaretDownOutlined className="caretdownicon" />}
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
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '10px' }}>
              <Col sm={4}>
                <Form.Item name="howHeadValue" label={<span className="form-label">HOW Head</span>}>
                  <Select
                    ref={selectRef}
                    className="border-0 time-border-bottom"
                    placeholder="Choose HOW Head"
                    suffixIcon={<CaretDownOutlined className="caretdownicon" />}
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
              </Col>
              <Col sm={4} offset={1}>
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
                    suffixIcon={<CaretDownOutlined className="caretdownicon" />}
                    options={categoryOption}
                    allowClear
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onDropdownVisibleChange={handleDropdownVisibleChange}
                    showSearch
                  />
                </Form.Item>
              </Col>
              <Col sm={4} offset={1}>
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
                    className="border-0 time-border-bottom"
                    style={{ paddingLeft: '0px', marginTop: '10px' }}
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
              </Col>
              <Col sm={4} offset={1}>
                <Form.Item name="endDateValue" label={<span className="form-label">End Date</span>}>
                  <DatePicker
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
              </Col>
              <Col sm={4} offset={1}>
                <Form.Item
                  name="summary"
                  label={<span className="form-label">Product Summary</span>}
                >
                  <Input.TextArea
                    className="border-0 time-border-bottom px-0"
                    placeholder="Enter Summary"
                    id="summary"
                    variant={'borderless'}
                    style={{ color: 'black', marginTop: '10px' }}
                    autoSize={{
                      minRows: 0,
                      maxRows: 1,
                    }}
                  />
                </Form.Item>
              </Col>
              <Col sm={4}>
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
              </Col>
            </Row>
            {viewStatus === 'Admin' && (
              <Row>
                <CCol xs={4} sm={6} md={6} lg={6}>
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
                      style={{ width: '85%' }}
                      className="border-0 time-border-bottom"
                      options={techOwnerOptions}
                      required
                      showSearch
                      placeholder="Choose Technical Owners"
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
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={4} sm={6} md={6} lg={6}>
                  <Form.Item
                    name="prodOwnerName"
                    label={<span className="form-label">Product Owners</span>}
                    rules={[
                      {
                        required: true,
                        message: 'Please Choose Product Owner',
                        validator: async (_, value) => {
                          const techOwner = form.getFieldValue('techOwnerName')
                          const howOwner = form.getFieldValue('howtechOwnerName')
                          const dataOwner = form.getFieldValue('dataOwnerName')
                          if (!techOwner && !value && !dataOwner && !howOwner) {
                            throw new Error('Please Choose Product Owner')
                          }
                        },
                      },
                    ]}
                  >
                    <Select
                      style={{ width: '85%' }}
                      className="border-0 time-border-bottom"
                      options={prodOwnerOptions}
                      required
                      showSearch
                      placeholder="Choose Product Owners"
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
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={4} sm={6} md={6} lg={6}>
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
                      style={{ width: '85%' }}
                      className="border-0 time-border-bottom"
                      options={dataOwnerOptions}
                      required
                      showSearch
                      placeholder="Choose Data Owners"
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
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={4} sm={6} md={6} lg={6}>
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
                      style={{ width: '85%' }}
                      className="border-0 time-border-bottom"
                      options={howOwnerOptions}
                      required
                      showSearch
                      placeholder="Choose HOW Owners"
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
                    />
                  </Form.Item>
                </CCol>
              </Row>
            )}
            <Row style={{ marginTop: '10px' }}>
              <h6 style={{ fontWeight: '700', fontSize: '13px' }}>Budget Details</h6>
            </Row>
            <Row gutter={16} style={{ marginTop: '10px' }}>
              <Col sm={4}>
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
                      message: 'Number input',
                    },
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
              </Col>
              <Col sm={4} offset={1}>
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
                    suffixIcon={<CaretDownOutlined className="caretdownicon" />}
                  >
                    <Select.Option value="USD">USD</Select.Option>
                    <Select.Option value="INR">INR</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col
                sm={6}
                offset={9}
                className="d-flex justify-content-end align-items-center"
                style={{ padding: '19px' }}
              >
                {title !== 'Product Creation Master' && (
                  <Button
                    className="draft-btn"
                    htmlType="submit"
                    onClick={() => setStatus('DRAFT')}
                    loading={loadingState}
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
                  {viewStatus === 'Admin' ? 'Update' : 'Submit'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Row>
      </CCol>
      <CCol md={3} className="approvalflow-rightside">
        <div style={{ marginLeft: '14px' }}>
          <Row style={{ marginTop: '31%' }}>
            <h6 style={{ fontWeight: '700', fontSize: '13px' }}>Approval Flow</h6>
          </Row>
          <div style={{ maxHeight: '290px', overflowY: 'auto' }}>
            {EditProductData.approvalFlow &&
              EditProductData.approvalFlow.map((approver, approverIndex) => (
                <React.Fragment key={approverIndex}>
                  <Row className="align-items-center mt-2">
                    <div className="col-md-5">
                      <img
                        alt="stages"
                        style={{ width: '12px' }}
                        className="content-img appr_img"
                        src={
                          approver.approStatus === 'Pending'
                            ? stage1
                            : approver.approStatus === 'Approved'
                            ? stage2
                            : approver.approStatus === 'Rejected'
                            ? stage3
                            : stage
                        }
                      />
                      <span style={{ marginLeft: '10%', fontSize: '11px', fontWeight: '600' }}>
                        Flow {approverIndex + 1}
                      </span>
                    </div>
                  </Row>

                  <Row className="align-items-center" style={{ marginTop: '12px' }}>
                    <div className="col-md-1">
                      <div className="vertical-line"></div>
                    </div>
                  </Row>

                  <Row className="align-items-center">
                    <div className="col-md-1"></div>
                    <div className="col-md-2" style={{ marginleft: '12px' }}>
                      <img
                        alt="profile*"
                        className="head-td-flow"
                        src={approver.profile_pic ? ImageUrl + approver.profile_pic : profileImage1}
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
                  </Row>
                </React.Fragment>
              ))}
          </div>
        </div>
      </CCol>
    </CRow>
  )
}
EditProduct.propTypes = {
  flowList: PropTypes.array.isRequired,
  prodOwnerList: PropTypes.array,
  techOwnerList: PropTypes.array,
  categories: PropTypes.array,
  techHeadList: PropTypes.array,
  prodHeadList: PropTypes.array,
  dataHeadList: PropTypes.array,
  howHeadList: PropTypes.array,
  EditProductData: PropTypes.object,
  callBackFunc: PropTypes.func,
  title: PropTypes.string,
  mastersProd: PropTypes.array,
  mastersTech: PropTypes.array,
  mastersData: PropTypes.array,
  mastersHow: PropTypes.array,
  viewStatus: PropTypes.string,
}
export default EditProduct
