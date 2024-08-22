import React, { useRef, useState, useEffect } from 'react'
import { ImageUrl, getHeaders } from 'src/constant/Global'
import { CCol, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import { Breadcrumb, Input, Form, Row, Col, Button, Select, DatePicker } from 'antd'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import { CameraOutlined } from '@ant-design/icons'
import profileImage1 from '../../../assets/images/avatars/default-profile.png'
import BannerModal from './BannerModal'
import useAxios from 'src/constant/UseAxios'
import eventEmitter from 'src/constant/EventEmitter'
import Downarrowimg from '../../../assets/images/downarrow.png'
import { toPascalCase } from '../../../constant/TimeUtils'
import Calendar from 'src/views/svgImages/Calendar'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'

const { Option } = Select
const AddUser = ({ close }) => {
  let api = useAxios()
  const formRef = useRef(null)
  const [techHeadList1, setTechHeadList] = useState([])
  const [Approverlist, setApprover] = useState([])
  const [prodHeadList1, setProdHeadList] = useState([])
  const [dataHeadList1, setDataHeadList] = useState([])
  const [userList1, setUserList] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [branch, setBranch] = useState('')
  const [roleType, setRoleType] = useState('')
  const [selectedFile1, setSelectedFile1] = useState(profileImage1)
  const [bannerModal, setBannerModal] = useState(false)
  const [form] = Form.useForm()
  const [loadings, setLoadings] = useState(false)
  const selectRef = useRef(null)
  const [startDate, setStartDate] = useState(null)

  const getTechHead = async () => {
    const url = `common/tech_head`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setTechHeadList(response.data.data)
      })
      .catch((error) => {})
  }
  const getProdHead = async () => {
    const url = `common/prod_head`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setProdHeadList(response.data.data)
      })
      .catch((error) => {})
  }
  const getDataHead = async () => {
    const url = `common/data_head`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setDataHeadList(response.data.data)
      })
      .catch((error) => {})
  }
  const getapproverlist = async (id) => {
    const url = `user/approval-user/list`
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setApprover(response.data.data)
      })
      .catch((error) => {})
  }
  let techHeadList
  if (Array.isArray(techHeadList1) && Array.isArray(Approverlist)) {
    // if (Array.isArray(techList) && Symbol.iterator in prodList) {
    techHeadList = [...techHeadList1, ...Approverlist]
  } else {
    techHeadList = []
  }
  let prodHeadList
  if (Array.isArray(prodHeadList1) && Array.isArray(Approverlist)) {
    // if (Array.isArray(techList) && Symbol.iterator in prodList) {
    prodHeadList = [...prodHeadList1, ...Approverlist]
  } else {
    prodHeadList = []
  }
  let dataHeadList
  if (Array.isArray(dataHeadList1) && Array.isArray(Approverlist)) {
    // if (Array.isArray(techList) && Symbol.iterator in dataList) {
    dataHeadList = [...dataHeadList1, ...Approverlist]
  } else {
    dataHeadList = []
  }
  let userList
  if (Array.isArray(userList1) && Array.isArray(Approverlist)) {
    // if (Array.isArray(techList) && Symbol.iterator in prodList) {
    userList = [...userList1, ...Approverlist]
  } else {
    userList = []
  }
  const techHeadOptions = techHeadList.map((user) => ({
    value: user.userName,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px' } : { width: '39px' }}
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
  const options = userList.map((user) => ({
    value: user.userName,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {toPascalCase(user.name)}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))
  const prodHeadOptions = prodHeadList.map((user) => ({
    value: user.userName,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {toPascalCase(user.name)}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))
  const dataHeadOptions = dataHeadList.map((user) => ({
    value: user.userName,
    label: (
      <div className="select-options select-options-bg">
        <img
          src={user.profile_pic ? ImageUrl + user.profile_pic : profileImage1}
          style={user.profile_pic ? { width: '29px' } : { width: '39px' }}
          alt={user.name}
          className="img-flag"
        />
        <div className="node1" style={user.profile_pic ? { marginLeft: '11px' } : {}}>
          <p className="user-name1" title={user.name}>
            {toPascalCase(user.name)}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))
  const handleBranch = (value) => {
    setBranch(value)
    form.setFieldsValue({ supervisor: undefined })
    getUserList(value)
  }
  const getUserList = async (branch) => {
    const url = 'master/employee/list/' + branch
    await api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        setUserList(data)
      })
      .catch((error) => {})
  }

  useEffect(() => {
    getRoles()
    getTechHead()
    getapproverlist()
    getProdHead()
    getDataHead()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [role, setRole] = useState([])
  const getRoles = async () => {
    const url = 'master/role/all-list'
    await api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        setRole(data)
      })
      .catch((error) => {})
  }
  const handleSubmit = async (values) => {
    setLoadings(true)
    const formData = new FormData()
    formData.append('files', selectedFile)
    formData.append('jod', startDate)
    Object.keys(values).forEach((key) => {
      if (key === 'nameValue') {
        //change name value as pascal string
        let capitalizedString = values[key]
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        formData.append('name', capitalizedString)
      } else formData.append(key, values[key])
    })

    const url = 'master/employee/create'
    await api
      .post(url, formData, {
        headers: getHeaders('multi'),
      })
      .then((response) => {
        setLoadings(false)
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
      })
      .catch((error) => {
        setLoadings(false)
        toast.error(error, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
      })
  }
  const resetComponent = () => {
    close()
    setRoleType('')
    setBranch('')
    setSelectedFile(null)
    form.resetFields()
    eventEmitter.emit('callUserList')
  }
  const handleRoleSelect = (value) => {
    selectRef.current.blur()
    form.setFieldsValue({ finalApprove: undefined })
    setRoleType(value)
  }
  const handleOpenModalBanner = () => {
    setBannerModal(true)
  }

  const handleCloseModalBanner = () => {
    setBannerModal(false)
  }
  const handleprofilepic = (profile) => {
    if (profile) {
      setSelectedFile(profile)
      setSelectedFile1(URL.createObjectURL(profile))
    } else {
      setSelectedFile(profileImage1)
      setSelectedFile1(profileImage1)
    }
  }

  const roleOptions = role.map((role) => ({
    value: role.id,
    label: role.name,
  }))

  const handleDateChange = (date, dateString) => {
    if (date) {
      const parsedDate = dayjs(date, 'DD MMM, YYYY')
      const formattedDate = parsedDate.format('YYYY-MM-DD')
      setStartDate(formattedDate)
    }
  }

  const targetDate = dayjs('2024-05-01')

  const disabledDate = (current) => {
    // Disable dates before May 1, 2024, and after the current date
    return current && (current < targetDate.startOf('day') || current > dayjs().endOf('day'))
  }

  return (
    <CRow>
      <CCol sm={1} style={{ width: '20px' }} className="cancle-arrow-content">
        {' '}
        <span
          style={{ cursor: 'pointer', marginRight: '2px' }}
          onClick={close}
          className="back_arrow"
        >
          <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
        </span>
      </CCol>
      <CCol>
        <h6 className="draft-heading" style={{ marginTop: '29px' }}>
          Add User
        </h6>
        <Breadcrumb
          // style={{ marginLeft: '12px' }}
          className="bread-tab"
          separator={<span className="breadcrumb-separator">|</span>}
          items={[
            {
              title: (
                <Link
                  rel="Dashboard"
                  to={'/dashboard'}
                  className="bread-items text-decoration-none text-secondary first-subheading"
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
                  User Master
                </span>
              ),
            },
            {
              title: (
                <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                  Add User
                </span>
              ),
            },
          ]}
        />
        {/* </CRow>  */}
        {bannerModal && (
          <BannerModal
            handleOpenModalBanner={handleOpenModalBanner}
            handleCloseModalBanner={handleCloseModalBanner}
            handledefaultprofic={selectedFile1}
            handleprofilepicvalue={handleprofilepic}
          />
        )}
        {/* <CRow> */}
        <Form
          className="mt-4 needs-validation"
          ref={formRef}
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          encType="multipart/form-data"
          validateTrigger="onSubmit"
          style={{ marginLeft: '22px', width: '100%' }}
        >
          <Row className="mb-4">
            <Col>
              <div
                // className="user_pic_div"
                onClick={(e) => {
                  e.stopPropagation() // Prevent the event from propagating
                  handleOpenModalBanner()
                }}
              >
                <div className="image-background">
                  <img
                    src={selectedFile1}
                    className="user_pic height_width_profile"
                    alt="profile"
                    style={{ height: '49px', width: '51px' }}
                  />
                  <div className="overlay-text text-center">
                    <CameraOutlined /> Choose picture
                  </div>
                </div>
                <div
                  className="node1 access-person-hovercard"
                  // style={viewUser.profile_pic ? { marginLeft: '11px' } : {}}
                >
                  {/* <p className="member-user-name1 user_pic_name" title=" Edit Profile Picture">
                    {' '}
                    Edit Profile Picture
                  </p> */}
                </div>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col sm={4} span={4}>
              <Form.Item
                name="nameValue"
                label={
                  <span className="form-label">
                    Name <span className="red-text1">*</span>
                  </span>
                }
                colon={false}
                validateTrigger={['onChange', 'onSubmit']}
                rules={[
                  { required: true, message: 'Please enter user name' },
                  {
                    pattern: /^(?!.*\s$)(?!^\s)(?!.*\s{2,})[a-zA-Z\s.]+$/,
                    message: 'Invalid input',
                  },
                ]}
              >
                <Input
                  variant={'borderless'}
                  maxLength={48}
                  className="border-0 time-border-bottom"
                  placeholder="Enter the User name"
                />
              </Form.Item>
            </Col>
            <Col sm={1} span={1}></Col>
            <Col sm={4} span={3}>
              <Form.Item
                name="email"
                label={
                  <span className="form-label">
                    Email <span className="red-text1">*</span>
                  </span>
                }
                colon={false}
                rules={[
                  { required: true, message: 'Please enter Email Address' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
              >
                <Input
                  variant={'borderless'}
                  className="border-0 time-border-bottom"
                  placeholder="Enter the Email Address"
                />
              </Form.Item>
            </Col>
            <Col sm={1} span={1}></Col>
            <Col sm={4} span={3}>
              <Form.Item
                label={
                  <span className="form-label">
                    Employee Id <span className="red-text1">*</span>
                  </span>
                }
                // name="employeeId"
                name="username"
                colon={false}
                validateTrigger={['onChange', 'onSubmit']}
                rules={[
                  { required: true, message: 'Please enter Employee Id' },
                  {
                    pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]*[0-9]+[a-zA-Z0-9]*$|^[0-9]+$/,
                    message: 'Only alphanumeric or numeric characters are allowed.',
                  },
                ]}
              >
                <Input
                  variant={'borderless'}
                  maxLength={15}
                  className="border-0 time-border-bottom"
                  placeholder="Enter the Employee Id"
                />
              </Form.Item>
            </Col>
            <Col sm={1} span={1}></Col>
            <Col sm={4} span={4}>
              <Form.Item
                name="role_id"
                label={
                  <span className="form-label">
                    Designation <span className="red-text1">*</span>
                  </span>
                }
                rules={[{ required: true, message: 'Please Choose Designation' }]}
              >
                <Select
                  className="border-0 time-border-bottom hide-cursor"
                  placeholder="Choose Designation"
                  // onChange={handleRoleName}
                  allowClear
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  ref={selectRef}
                  suffixIcon={
                    <img
                      src={Downarrowimg}
                      alt="Downarrowimg"
                      style={{ width: '10px', height: '6px' }}
                    />
                  }
                  options={roleOptions}
                />
                {/* <Option value="">Choose Designation</Option>
                  {role &&
                    role.map((value, index) => (
                      <Option value={value.id} key={index}>
                        {value.name}
                      </Option>
                    ))}
                </Select> */}
              </Form.Item>
            </Col>
            <Col sm={1} span={1}></Col>
            <Col sm={4}>
              <Form.Item
                name="joiningDate"
                label={
                  <span className="form-label">
                    Joining Date <span className="red-text1">*</span>
                  </span>
                }
                rules={[{ required: true, message: 'Please Choose Joining Date' }]}
              >
                <DatePicker
                  variant="borderless"
                  className="border-0 time-border-bottom"
                  style={{ paddingLeft: '0px', marginTop: '9px' }}
                  placeholder="Choose Date"
                  allowClear={false}
                  suffixIcon={<Calendar width="15" height="14" viewBox="0 0 15 14" fill="white" />}
                  disabledDate={disabledDate}
                  onChange={handleDateChange}
                  format="DD MMM, YYYY"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} className="mt-3">
            <Col sm={4}>
              <Form.Item
                name="designation"
                label={
                  <span className="form-label">
                    Role <span className="red-text1">*</span>
                  </span>
                }
                rules={[{ required: true, message: 'Please Choose Role' }]}
              >
                <Select
                  className="border-0 time-border-bottom"
                  placeholder="Choose Role"
                  // onChange={onInputChange}
                  suffixIcon={
                    <img
                      src={Downarrowimg}
                      alt="Downarrowimg"
                      style={{ width: '10px', height: '6px' }}
                    />
                  }
                >
                  <Option value="">Choose Role</Option>
                  <Option value="Head">Head</Option>
                  <Option value="Employee">Employee</Option>
                  <Option value="Owner">Owner</Option>
                  <Option value="Approver">Approver</Option>
                  <Option value="Others">Others</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={1} span={1}></Col>
            <Col sm={4}>
              <Form.Item
                name="branch"
                label={
                  <span className="form-label">
                    Branch <span className="red-text1">*</span>
                  </span>
                }
                rules={[{ required: true, message: 'Please Choose Branch' }]}
              >
                <Select
                  className="border-0 time-border-bottom"
                  placeholder="Choose Branch"
                  onChange={handleBranch}
                  suffixIcon={
                    <img
                      src={Downarrowimg}
                      alt="Downarrowimg"
                      style={{ width: '10px', height: '6px' }}
                    />
                  }
                >
                  <Option value="Technical">Technical</Option>
                  <Option value="Product">Product</Option>
                  <Option value="Data">Data</Option>
                  <Option value="HOW">HOW (House of website)</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={1} span={1}></Col>
            <Col sm={4}>
              <Form.Item
                name="supervisor"
                label={
                  <span className="form-label">
                    Supervisor <span className="red-text1">*</span>
                  </span>
                }
                rules={[{ required: true, message: 'Please Choose Supervisor' }]}
              >
                <Select
                  className="border-0 time-border-bottom"
                  placeholder="Choose Supervisor"
                  allowClear
                  showSearch
                  options={options}
                  onChange={(selectedOption) => {
                    selectRef.current.blur()
                  }}
                  filterOption={(input, option) => {
                    const userNameArray =
                      option.label.props.children[1].props.children[0].props.children
                    const userName = userNameArray
                    const lowerCaseInput = input.toLowerCase()
                    const lowerCaseUserName = userName.toLowerCase()
                    return lowerCaseUserName.includes(lowerCaseInput)
                  }}
                  ref={selectRef}
                  suffixIcon={
                    <img
                      src={Downarrowimg}
                      alt="Downarrowimg"
                      style={{ width: '10px', height: '6px' }}
                    />
                  }
                ></Select>
              </Form.Item>
            </Col>
            <Col sm={1} span={1}></Col>
            <Col sm={4}>
              <Form.Item
                name="roleType"
                label={
                  <span className="form-label">
                    Role Intake <span className="red-text1">*</span>
                  </span>
                }
                rules={[{ required: true, message: 'Please Choose Supervisor' }]}
              >
                <Select
                  className="border-0 time-border-bottom"
                  showSearch
                  placeholder="Choose Role"
                  allowClear
                  ref={selectRef}
                  suffixIcon={
                    <img
                      src={Downarrowimg}
                      alt="Downarrowimg"
                      style={{ width: '10px', height: '6px' }}
                    />
                  }
                  onChange={handleRoleSelect}
                >
                  <Option value="ON Role">ON Role</Option>
                  <Option value="Contract">Contract</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={1}></Col>
            {roleType === 'Contract' && (
              <Col sm={3}>
                <Form.Item
                  name="finalApprove"
                  label={
                    <span className="form-label">
                      {' '}
                      Final &nbsp;Approver <span className="red-text1">*</span>
                    </span>
                  }
                  rules={[{ required: true, message: 'Please Choose Final Approver' }]}
                >
                  <Select
                    className="border-0 time-border-bottom"
                    placeholder="Choose Role"
                    // onChange={onInputChange}
                    allowClear
                    showSearch
                    suffixIcon={
                      <img
                        src={Downarrowimg}
                        alt="Downarrowimg"
                        style={{ width: '10px', height: '6px' }}
                      />
                    }
                    filterOption={(input, option) => {
                      const userNameArray =
                        option.label.props.children[1].props.children[0].props.children
                      const userName = userNameArray
                      const lowerCaseInput = input.toLowerCase()
                      const lowerCaseUserName = userName.toLowerCase()
                      return lowerCaseUserName.includes(lowerCaseInput)
                    }}
                    // defaultValue={
                    //   branch === 'Technical'
                    //     ? techHeadOptions.length === 1
                    //       ? techHeadOptions[0]
                    //       : null
                    //     : prodHeadOptions.length === 1
                    //     ? prodHeadOptions[0]
                    //     : null
                    // }
                    onChange={(selectedOption) => {
                      selectRef.current.blur()
                    }}
                    ref={selectRef}
                    options={
                      branch === 'Technical'
                        ? techHeadOptions
                        : branch === 'Data'
                        ? dataHeadOptions
                        : prodHeadOptions
                    }
                  ></Select>
                </Form.Item>
              </Col>
            )}
          </Row>
          {/* <div style={{ position: 'absolute', bottom: 0, right: '-103px', padding: '20px' }}> */}
          <Row>
            <Col
              style={{ width: '95%' }}
              className="d-flex justify-content-end align-items-end user-master-footer"
            >
              <Button className="edit-cancel-btn" onClick={close}>
                Cancel
              </Button>
              <Button
                className=" Edit_save_changes"
                style={{ fontSize: '13px', color: 'white' }}
                htmlType="submit"
                loading={loadings}
              >
                Submit
              </Button>
            </Col>
          </Row>
          {/* </div> */}
        </Form>
      </CCol>
    </CRow>
  )
}

AddUser.propTypes = {
  close: PropTypes.func,
}
export default AddUser
