import React, { useRef, useEffect, useState } from 'react'
import { CCol, CForm, CFormLabel, CRow } from '@coreui/react'
import PropTypes from 'prop-types'
import { getHeaders, ImageUrl, getDecodeData } from '../../constant/Global'
import profileImage1 from '../../assets/images/avatars/man1.png'
import { Breadcrumb, Select, Col, Row, Input, Button, Form, DatePicker, Card, Skeleton } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import BackArrowSvg from 'src/views/svgImages/BackArrowSvg'
import { toast } from 'react-toastify'
import Calendar from '../svgImages/Calendar'
import dayjs from 'dayjs'
import stage from '../../assets/images/form/stage.png'
import stage1 from '../../assets/images/form/stage-p.png'
import stage2 from '../../assets/images/form/stage-a.png'
import stage3 from '../../assets/images/form/stage-r.png'
import eyeIcon from '../../assets/images/login/Show.png'
import PlusSvg from '../svgImages/PlusSvg'
import DeleteSvg from '../svgImages/DeleteSvg'
import FileSvg from '../svgImages/FileSvg'
import useAxios from 'src/constant/UseAxios'
import Downarrowimg from '../../assets/images/downarrow.png'
import { Link } from 'react-router-dom'

const ViewProduct = ({
  flowList,
  viewStatus,
  ownerOption,
  close,
  techHeadList,
  prodHeadList,
  dataHeadList,
  howHeadList,
  categories,
  ViewProductData,
  titleList,
  mastersTech,
  mastersProd,
  mastersData,
  mastersHow,
}) => {
  let api = useAxios()
  const formRef = useRef(null)
  const [form] = Form.useForm()
  const user = getDecodeData()
  const branch = user?.branch
  const [addTeamMember, setAddTeamMember] = useState([{ member: 0, role: '' }])
  const [selectedMember, setSelectedMember] = useState([])
  const [selectedValues, setSelectedValues] = useState([])
  const [userData, setUserData] = useState([])
  const [loadings, setLoadings] = useState(false)
  const [memberLoader, setMemberLoader] = useState(true)
  const openFileInNewTab = () => {
    window.open(ImageUrl + ViewProductData.file, '_blank')
  }
  form.setFieldsValue({
    budget: ViewProductData.budget,
    summary: ViewProductData.summary,
    flow: ViewProductData.flowName,
    name: ViewProductData.name,
    techHead:
      ViewProductData.tech_headId !== 0 ? ViewProductData.tech_headId : 'Choose Technical Head',
    dataHead: ViewProductData.data_headId !== 0 ? ViewProductData.data_headId : 'Choose Data Head',
    prodHead:
      ViewProductData.prod_headId !== 0 ? ViewProductData.prod_headId : 'Choose Product Head',
    howHead: ViewProductData.how_headId !== 0 ? ViewProductData.how_headId : 'Choose HOW Head',
    startDateValue: ViewProductData.startDate && dayjs(ViewProductData.startDate),
    endDateValue: ViewProductData.endDate && dayjs(ViewProductData.endDate),
    filesValue: ViewProductData.file,
    currency:
      ViewProductData.currency === 'undefined' || ViewProductData.currency === 'null'
        ? null
        : ViewProductData.currency,
    category: ViewProductData.categoryID,
  })

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
          <p className="user-name1" title={user.name} style={{ cursor: 'not-allowed' }}>
            {' '}
            {user.name}
          </p>
          <p className="role-text1" title={user.role} style={{ cursor: 'not-allowed' }}>
            {user.role}
          </p>
        </div>
      </div>
    ),
  }))
  const getMemberData = async () => {
    const url = `member/view/` + ViewProductData.id
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        const data = response.data.data
        const memberDetails = data.member?.map((member) => ({
          member: member.userId,
          role: member.role,
        }))
        if (viewStatus === 'OwnerEdit') {
          setAddTeamMember(memberDetails)
        }
      })
      .catch((error) => {})
  }
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
          <p className="user-name1" title={user.name} style={{ cursor: 'not-allowed' }}>
            {user.name}
          </p>
          <p className="role-text1" title={user.role} style={{ cursor: 'not-allowed' }}>
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
          <p className="user-name1" title={user.name} style={{ cursor: 'not-allowed' }}>
            {user.name}
          </p>
          <p className="role-text1" title={user.role} style={{ cursor: 'not-allowed' }}>
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
          <p className="user-name1" title={user.name} style={{ cursor: 'not-allowed' }}>
            {user.name}
          </p>
          <p className="role-text1" title={user.role} style={{ cursor: 'not-allowed' }}>
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

  // Owner Member Add
  const userOptions = userData.map((user) => ({
    value: user.id,
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
            {' '}
            {user.name}
          </p>
          <p className="role-text1">{user.role}</p>
        </div>
      </div>
    ),
  }))
  const getUserList = async (id) => {
    const url = `member/user/list/show/` + branch + '/' + ViewProductData.id
    api
      .get(url, {
        headers: getHeaders('json'),
      })
      .then((response) => {
        setUserData(response.data.data)
        setMemberLoader(false)
      })
      .catch((error) => {})
  }
  useEffect(() => {
    if (viewStatus === 'OwnerCreate' || viewStatus === 'OwnerEdit') {
      getMemberData()
      getUserList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addTeamMembers = () => {
    setAddTeamMember([...addTeamMember, { member: 0, role: '' }])
    setSelectedValues([...selectedValues, null])
    setSelectedMember([...selectedMember, null])
  }
  const handleMember = (selectedOption, index) => {
    if (selectedOption) {
      const newValue = selectedOption
      setSelectedMember((prevSelectedMember) => {
        const updatedMember = [...prevSelectedMember]
        updatedMember[index] = {
          id: Number(newValue),
          name: userData.find((user) => user.id === newValue)?.name || '',
        }
        return updatedMember
      })
      setAddTeamMember((prevMember) => {
        const memberId = [...prevMember]
        memberId[index].member = Number(newValue)
        return memberId
      })
    } else {
      // Handle the case when the selection is cleared
      setSelectedMember((prevSelectedMember) => {
        const updatedMember = [...prevSelectedMember]
        updatedMember[index] = null
        return updatedMember
      })
      setAddTeamMember((prevMember) => {
        const memberId = [...prevMember]
        memberId[index].member = null
        return memberId
      })
    }
  }
  const handleRole = (e, index) => {
    const newValue = e
    setAddTeamMember((prevRole) => {
      const updatedRole = [...prevRole]
      updatedRole[index].role = newValue
      return updatedRole
    })
  }
  const removeMember = (index) => {
    if (index !== 0) {
      setAddTeamMember((prevApprovalFlows) => {
        const updatedFlows = [...prevApprovalFlows]
        updatedFlows.splice(index, 1)
        return updatedFlows
      })

      setSelectedMember((prevSelectedApprovals) => {
        const updatedApprovals = [...prevSelectedApprovals]
        updatedApprovals.splice(index, 1)
        return updatedApprovals
      })

      setSelectedValues((prevSelectedApprovals) => {
        const updatedApprovals = [...prevSelectedApprovals]
        updatedApprovals.splice(index, 1)
        return updatedApprovals
      })
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors }
        updatedErrors.role.splice(index, 1)
        updatedErrors.members.splice(index, 1)
        return updatedErrors
      })
    }
  }
  const resetModal = () => {
    //  setValidated(false)
    // eventEmitter.emit('callOwnerProductList')
    setAddTeamMember([{}])
    setSelectedMember([])
    close()
  }
  const [errors, setErrors] = useState({ role: [], members: [] })
  const validateForm = () => {
    const errors = {
      role: Array.from({ length: addTeamMember.length }, () => ''),
      members: Array.from({ length: addTeamMember.length }, () => ''),
    }

    addTeamMember.forEach((value, key) => {
      if (value.member === 0) errors.members[key] = 'Please Select Team Member'
      if (value.role === '') errors.role[key] = 'Please Select Role'
    })
    setErrors(errors)
    const hasErrors =
      Object.values(errors.role).some((value) => value !== '') ||
      Object.values(errors.members).some((value) => value !== '')
    return !hasErrors
  }
  const handleSubmit = async (e) => {
    setLoadings(true)
    e.preventDefault()
    const isFormValid = validateForm()
    if (isFormValid) {
      const formData = new FormData()
      addTeamMember.forEach((team, index) => {
        formData.append(`members[${index}].member`, team.member)
        formData.append(`members[${index}].role`, team.role)
        formData.append(`members[${index}].prodId`, ViewProductData.id)
      })
      let url
      let method
      if (viewStatus === 'OwnerEdit') {
        url = `member/update/${ViewProductData.id}`
        method = 'put'
      } else {
        url = `member/create`
        method = 'post'
      }

      try {
        const response = await api({
          method: method,
          url: url,
          data: formData,
          headers: getHeaders('multi'),
        })

        setAddTeamMember([{ member: 0, role: 0 }])
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
        resetModal()
        setLoadings(false)
      } catch (error) {
        setLoadings(false)
        const message = error.response?.data?.message || 'An error occurred'
        toast.error(message, {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
      }
    } else {
      setLoadings(false)
    }
  }

  const handleClose = () => {
    close()
  }
  const selectedMemberIds = addTeamMember.map((flow) => Number(flow.member))
  const filteredOptions = userOptions.filter(
    (option) => !selectedMemberIds.includes(Number(option.value)),
  )

  return (
    <CRow>
      <CCol xs={9} md={9}>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', alignItems: 'center', width: '35px' }}>
            <span
              className=""
              onClick={handleClose}
              style={{ cursor: 'pointer', marginTop: '17px', marginLeft: '10px' }}
            >
              <BackArrowSvg width="16" height="15" viewBox="0 0 18 18" fill="#A5A1A1" />
            </span>
          </div>
          <CCol>
            <h6 className="product-heading" style={{ marginTop: '2%' }}>
              View <span style={{ color: '#E01B38' }}>{ViewProductData.name}</span>
            </h6>

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
                      onClick={close}
                    >
                      {titleList}
                    </span>
                  ),
                },
                {
                  title: (
                    <span
                      className="text-secondary second-subheading"
                      style={{ cursor: 'default' }}
                    >
                      View Product
                    </span>
                  ),
                },
              ]}
            />
          </CCol>
        </div>
        {/* <CCol>
          <h6 className="product-heading" style={{ marginTop: '2%' }}>
            View <span style={{ color: '#E01B38' }}>{ViewProductData.name}</span>
          </h6>

          <Breadcrumb
            className="bread-tab"
            separator={<span className="breadcrumb-separator">|</span>}
            items={[
              {
                title: (
                  <span
                    className="text-secondary text-decoration-none"
                    style={{ cursor: 'default' }}
                  >
                    Dashboard
                  </span>
                ),
              },
              {
                title: (
                  <span
                    className="bread-items text-secondary second-subheading"
                    style={{ cursor: 'pointer' }}
                    onClick={close}
                  >
                    {titleList}
                  </span>
                ),
              },
              {
                title: (
                  <span className="text-secondary second-subheading" style={{ cursor: 'default' }}>
                    View Product
                  </span>
                ),
              },
            ]}
          />
        </CCol> */}
        <div style={{ overflowY: 'auto', overflowX: 'hidden' }} className="scroll-form">
          <CRow className="mt-3">
            {viewStatus === 'OwnerCreate' || viewStatus === 'OwnerEdit' ? (
              <CCol style={{ marginLeft: '36px' }}>
                <Card style={{ backgroundColor: '#FAFAFA' }}>
                  <CRow>
                    <CCol sm={8}>
                      <h6>Team Members</h6>
                    </CCol>
                    <CCol style={{ display: 'flex', justifyContent: 'end' }}>
                      <h6
                        className="text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => addTeamMembers()}
                      >
                        <span style={{ marginBottom: '3px', marginRight: '5px' }}>
                          <PlusSvg width="8" height="12" viewBox="0 0 18 18" fill="#E01B38" />
                        </span>
                        <span className="add_Team">Add Team member</span>
                      </h6>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol>
                      <CForm
                        className="mt-4 needs-validation"
                        // validated={validated}
                        onSubmit={handleSubmit}
                        // ref={formRef}
                      >
                        {addTeamMember.map((flow, index) => {
                          // const filteredOptions = userOptions.filter(
                          //   (option) =>
                          //     !addTeamMember.some(
                          //       (t, i) =>
                          //         i < index &&
                          //         t.member ===
                          //           Number(userData.find((user) => user.id === option.value)),
                          //     ),
                          // )

                          return (
                            <Row key={index + 1} className={index >= 1 && `mt-3`}>
                              <Col sm={4}>
                                <div className="label-field-container">
                                  <CFormLabel
                                    className="form-label text-c"
                                    htmlFor={`member-${index}`}
                                  >
                                    Member
                                  </CFormLabel>
                                  <Select
                                    className="  time-border-bottom border-0"
                                    value={
                                      selectedMember
                                        ? userOptions.find(
                                            (option) => option.value === flow.member,
                                          ) || null
                                        : null
                                    }
                                    feedbackInvalid="Please select a Member."
                                    id={`member-${index}`}
                                    options={
                                      memberLoader
                                        ? [
                                            {
                                              label: (
                                                <div style={{ textAlign: 'center' }}>
                                                  {Array.from({ length: 5 }, (_, index) => (
                                                    <Skeleton
                                                      key={index + 1}
                                                      title={false}
                                                      avatar={{
                                                        size: '20',
                                                      }} // Adjust the width and height here
                                                      paragraph={{
                                                        rows: 2,
                                                        height: '10px',
                                                        style: { height: '10px !important' },
                                                      }}
                                                    />
                                                  ))}
                                                </div>
                                              ),
                                              value: 'loading',
                                              disabled: true,
                                            },
                                          ]
                                        : filteredOptions
                                    }
                                    suffixIcon={
                                      <img
                                        src={Downarrowimg}
                                        alt="Downarrowimg"
                                        style={{ width: '10px', height: '6px' }}
                                      />
                                    }
                                    // onChange={(event) => {
                                    //   const selectedValue = event ? event : null
                                    //   const updatedValues = [...selectedValues]
                                    //   updatedValues[index] = Number(
                                    //     userData.find((user) => user.id === selectedValue),
                                    //   )
                                    //   setSelectedValues(updatedValues)
                                    //   handleMember(event, index)
                                    // }}
                                    onChange={(event) => handleMember(event, index)}
                                    filterOption={(input, option) => {
                                      const userNameArray =
                                        option.label.props.children[1].props.children[0].props
                                          .children
                                      const userName = userNameArray[1]
                                      const lowerCaseInput = input.toLowerCase()
                                      const lowerCaseUserName = userName.toLowerCase()
                                      return lowerCaseUserName.includes(lowerCaseInput)
                                    }}
                                    required
                                    showSearch
                                    placeholder="Choose Member"
                                    allowClear
                                  />
                                </div>
                                <span className="text-danger nameflow-error">
                                  {errors.members[index]}
                                </span>{' '}
                              </Col>
                              <Col sm={1}></Col>
                              <Col sm={4}>
                                <div className="label-field-container">
                                  <CFormLabel
                                    className="form-label text-c"
                                    htmlFor={`role-${index}`}
                                  >
                                    Role
                                  </CFormLabel>
                                  <Select
                                    id={`role-${index}`}
                                    className="  time-border-bottom border-0"
                                    value={flow.role}
                                    onChange={(e) => handleRole(e, index)}
                                    placeholder="Choose Role"
                                    suffixIcon={
                                      <img
                                        src={Downarrowimg}
                                        alt="Downarrowimg"
                                        style={{ width: '10px', height: '6px' }}
                                      />
                                    }
                                  >
                                    <Select.Option value="Team Lead">Team Leader</Select.Option>
                                    <Select.Option value="Team Member">Team Member</Select.Option>
                                  </Select>
                                </div>
                                <span className="text-danger nameflow-error">
                                  {errors.role[index]}
                                </span>{' '}
                              </Col>
                              <Col sm={1}></Col>
                              <Col sm={4} className="mt-4">
                                {index !== 0 && (
                                  <Button
                                    className="pro-delete-button"
                                    style={{
                                      backgroundColor: '#FAFAFA',
                                    }}
                                    onClick={() => removeMember(index)}
                                  >
                                    <div style={{ marginRight: '15px', marginTop: ' -3px' }}>
                                      <DeleteSvg
                                        width="16"
                                        height="15"
                                        viewBox="0 0 18 18"
                                        fill="#A5A1A1"
                                      />
                                    </div>
                                    <div style={{ fontSize: '14px' }}>Delete</div>
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          )
                        })}
                        <Row className="mt-3">
                          <Col sm={17}></Col>
                          <Col sm={7} className="d-flex">
                            <Button className="draft-btn text-c mt-2 " onClick={resetModal}>
                              <FileSvg width="16" height="16 " viewBox="0 0 18 18" fill="none" />{' '}
                              &nbsp; Cancel
                            </Button>
                            <Button
                              className="submit-button save_changes mt-2"
                              style={{ fontSize: '13px', color: 'white', width: '96px' }}
                              htmlType="submit"
                              loading={loadings}
                            >
                              <CheckOutlined />
                              {viewStatus === 'OwnerEdit' ? 'Update' : 'Submit'}
                            </Button>
                          </Col>
                        </Row>
                      </CForm>
                    </CCol>
                  </CRow>
                </Card>
              </CCol>
            ) : (
              <></>
            )}
            <Form
              className="mt-4 needs-validation app-scroll "
              ref={formRef}
              form={form}
              initialValues={{
                budget: ViewProductData.budget,
                summary: ViewProductData.summary,
                flow: ViewProductData.flow,
                name: ViewProductData.name,
                techHead: ViewProductData.tech_headId,
                prodHead: ViewProductData.prod_headId,
                dataHead: ViewProductData.data_headId,
                startDateValue: ViewProductData.startDate && dayjs(ViewProductData.startDate),
                endDateValue: ViewProductData.endDate && dayjs(ViewProductData.endDate),
                filesValue: ViewProductData.file,
                currency:
                  ViewProductData.currency === 'undefined' || ViewProductData.currency === 'null'
                    ? null
                    : ViewProductData.currency,
                category: ViewProductData.categoryID,
              }}
              layout="vertical"
              requiredMark={false}
              style={{ marginLeft: '39px', width: '100%', height: '300px' }}
            >
              {viewStatus === 'Head' && (
                <>
                  <Row>
                    <h6
                      style={{
                        fontWeight: '700',
                        fontSize: '13px',
                      }}
                    >
                      {branch === 'Technical'
                        ? 'Technical'
                        : branch === 'Product'
                        ? 'Product'
                        : 'Data'}{' '}
                      Owners
                    </h6>
                  </Row>

                  <Row gutter={16}>
                    <Col sm={14}>
                      <Select
                        onClick={(e) => e.stopPropagation()}
                        className="form-custom-selects access-input-box_owner"
                        value={
                          branch === 'Technical'
                            ? ownerOption.filter((option) =>
                                ViewProductData.techOwnerName.some(
                                  (selected) => selected === option.value,
                                ),
                              )
                            : branch === 'Product'
                            ? ownerOption.filter((option) =>
                                ViewProductData.prodOwnerName.some(
                                  (selected) => selected === option.value,
                                ),
                              )
                            : ownerOption.filter((option) =>
                                ViewProductData.dataOwnerName.some(
                                  (selected) => selected === option.value,
                                ),
                              )
                        }
                        options={ownerOption}
                        required
                        showSearch
                        disabled
                        placeholder="Choose Owners"
                        allowClear
                        mode="multiple"
                        variant={'borderless'}
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                        labelInValue={(option) => (
                          <div className="select-options select-options-approval">
                            <img
                              src={
                                option.profile_pic ? ImageUrl + option.profile_pic : profileImage1
                              }
                              style={
                                option.profile_pic
                                  ? { width: '29px', borderRadius: '14px' }
                                  : { width: '39px' }
                              }
                              alt={option.value}
                              className="img-flag"
                            />
                            <div
                              className="node1"
                              style={option.profile_pic ? { marginLeft: '11px' } : {}}
                            >
                              <p className="user-name1">{option.value}</p>
                              <p className="role-text1">{option.label.role}</p>
                            </div>
                          </div>
                        )}
                      />
                    </Col>
                  </Row>
                </>
              )}
              {viewStatus === 'Admin' && (
                <Row>
                  {ViewProductData.techOwnerName?.length !== 0 && (
                    <CCol xs={12} sm={12} md={6}>
                      <h6
                        style={{
                          fontWeight: '700',
                          fontSize: '13px',
                        }}
                      >
                        Technical Owners
                      </h6>
                      <Select
                        style={{ width: '85%' }}
                        onClick={(e) => e.stopPropagation()}
                        className="form-custom-selects access-input-box_owner"
                        value={mastersTech.filter((option) =>
                          ViewProductData.techOwnerName?.some(
                            (selected) => selected === option.value,
                          ),
                        )}
                        options={mastersTech}
                        required
                        showSearch
                        disabled
                        placeholder="Choose Owners"
                        allowClear
                        mode="multiple"
                        variant={'borderless'}
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                        labelInValue={(option) => (
                          <div className="select-options select-options-approval">
                            <img
                              src={
                                option.profile_pic ? ImageUrl + option.profile_pic : profileImage1
                              }
                              style={
                                option.profile_pic
                                  ? { width: '29px', borderRadius: '14px' }
                                  : { width: '39px' }
                              }
                              alt={option.value}
                              className="img-flag"
                            />
                            <div
                              className="node1"
                              style={option.profile_pic ? { marginLeft: '11px' } : {}}
                            >
                              <p className="user-name1">{option.value}</p>
                              <p className="role-text1">{option.label.role}</p>
                            </div>
                          </div>
                        )}
                      />
                    </CCol>
                  )}
                  {ViewProductData?.prodOwnerName?.length !== 0 && (
                    <CCol xs={12} sm={12} md={6}>
                      <h6
                        style={{
                          fontWeight: '700',
                          fontSize: '13px',
                        }}
                      >
                        Product Owners
                      </h6>
                      <Select
                        style={{ width: '85%' }}
                        onClick={(e) => e.stopPropagation()}
                        className="form-custom-selects access-input-box_owner"
                        value={mastersProd.filter((option) =>
                          ViewProductData.prodOwnerName?.some(
                            (selected) => selected === option.value,
                          ),
                        )}
                        options={mastersProd}
                        required
                        showSearch
                        disabled
                        placeholder="Choose Owners"
                        allowClear
                        mode="multiple"
                        variant={'borderless'}
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                        labelInValue={(option) => (
                          <div className="select-options select-options-approval">
                            <img
                              src={
                                option.profile_pic ? ImageUrl + option.profile_pic : profileImage1
                              }
                              style={
                                option.profile_pic
                                  ? { width: '29px', borderRadius: '14px' }
                                  : { width: '39px' }
                              }
                              alt={option.value}
                              className="img-flag"
                            />
                            <div
                              className="node1"
                              style={option.profile_pic ? { marginLeft: '11px' } : {}}
                            >
                              <p className="user-name1">{option.value}</p>
                              <p className="role-text1">{option.label.role}</p>
                            </div>
                          </div>
                        )}
                      />
                    </CCol>
                  )}
                  {ViewProductData?.dataOwnerName?.length !== 0 && (
                    <CCol xs={12} sm={12} md={6}>
                      <h6
                        style={{
                          fontWeight: '700',
                          fontSize: '13px',
                        }}
                      >
                        Data Owners
                      </h6>
                      <Select
                        style={{ width: '85%' }}
                        onClick={(e) => e.stopPropagation()}
                        className="form-custom-selects access-input-box_owner"
                        value={mastersData.filter((option) =>
                          ViewProductData.dataOwnerName?.some(
                            (selected) => selected === option.value,
                          ),
                        )}
                        options={mastersData}
                        required
                        showSearch
                        disabled
                        placeholder="Choose Owners"
                        allowClear
                        mode="multiple"
                        variant={'borderless'}
                        suffixIcon={
                          <img
                            src={Downarrowimg}
                            alt="Downarrowimg"
                            style={{ width: '10px', height: '6px' }}
                          />
                        }
                        labelInValue={(option) => (
                          <div className="select-options select-options-approval">
                            <img
                              src={
                                option.profile_pic ? ImageUrl + option.profile_pic : profileImage1
                              }
                              style={
                                option.profile_pic
                                  ? { width: '29px', borderRadius: '14px' }
                                  : { width: '39px' }
                              }
                              alt={option.value}
                              className="img-flag"
                            />
                            <div
                              className="node1"
                              style={option.profile_pic ? { marginLeft: '11px' } : {}}
                            >
                              <p className="user-name1">{option.value}</p>
                              <p className="role-text1">{option.label.role}</p>
                            </div>
                          </div>
                        )}
                      />
                    </CCol>
                  )}
                </Row>
              )}
              <Row className={viewStatus === 'View' ? '' : 'mt-4'}>
                <h6
                  style={{
                    fontWeight: '700',
                    fontSize: '13px',
                  }}
                >
                  Product Details
                </h6>
              </Row>
              <CRow>
                <CCol xs={6} sm={4} md={3} lg={3}>
                  <Form.Item
                    name="flow"
                    label={<span className="form-label">Flow</span>}
                    rules={[{ required: true, message: 'Please Choose Flow' }]}
                  >
                    <Select
                      className="border-0 time-border-bottom "
                      placeholder="Choose Flow"
                      suffixIcon={
                        <img
                          src={Downarrowimg}
                          alt="Downarrowimg"
                          style={{ width: '10px', height: '6px' }}
                        />
                      }
                      options={options}
                      disabled
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3} lg={3}>
                  <Form.Item
                    name="name"
                    label={<span className="form-label">Product Name</span>}
                    rules={[{ required: true, message: 'Please Enter Product Name' }]}
                  >
                    <Input
                      variant={'borderless'}
                      className="border-0 time-border-bottom px-0"
                      placeholder="Enter Product Name"
                      readOnly
                      style={{ cursor: 'not-allowed' }}
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3} lg={3}>
                  <Form.Item
                    name="prodHead"
                    label={<span className="form-label">Product Head</span>}
                  >
                    <Select
                      className="border-0 time-border-bottom"
                      placeholder="Choose Product Head"
                      suffixIcon={
                        <img
                          src={Downarrowimg}
                          alt="Downarrowimg"
                          style={{ width: '10px', height: '6px' }}
                        />
                      }
                      options={prodHeadOption}
                      filterOption={(input, option) => {
                        const userName =
                          option.label.props.children[1].props.children[0].props.children[1] // Adjust this according to the actual structure
                        return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                      disabled
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3} lg={3}>
                  <Form.Item
                    name="techHead"
                    label={<span className="form-label">Technical Head</span>}
                  >
                    <Select
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
                      filterOption={(input, option) => {
                        const userName =
                          option.label.props.children[1].props.children[0].props.children[1] // Adjust this according to the actual structure
                        return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                      disabled
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3} lg={3}>
                  <Form.Item name="dataHead" label={<span className="form-label">Data Head</span>}>
                    <Select
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
                      filterOption={(input, option) => {
                        const userName =
                          option.label.props.children[1].props.children[0].props.children[1] // Adjust this according to the actual structure
                        return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                      disabled
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3} lg={3}>
                  <Form.Item name="howHead" label={<span className="form-label">HOW Head</span>}>
                    <Select
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
                      filterOption={(input, option) => {
                        const userName =
                          option.label.props.children[1].props.children[0].props.children[1] // Adjust this according to the actual structure
                        return userName.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }}
                      disabled
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3} lg={3}>
                  <Form.Item
                    name="category"
                    label={<span className="form-label">Business Category</span>}
                    rules={[{ required: true, message: 'Please Choose Category' }]}
                  >
                    <Select
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
                      filterOption={(input, option) =>
                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      disabled
                    />
                  </Form.Item>
                </CCol>

                {/* <Row gutter={16} style={{ marginTop: '10px' }} className=" start-date-prd"> */}
                <CCol xs={6} sm={4} md={3} lg={3}>
                  <Form.Item
                    name="startDateValue"
                    label={<span className="form-label">Start Date</span>}
                    rules={[{ required: true, message: 'Please Select Start Date' }]}
                  >
                    <DatePicker
                      className="border-0 time-border-bottom"
                      style={{ paddingLeft: '0px', marginTop: '10px' }}
                      placeholder="Choose Date"
                      suffixIcon={
                        <Calendar width="15" height="14" viewBox="0 0 15 14" fill="white" />
                      }
                      disabled
                      format="DD MMM,YYYY"
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3} lg={3}>
                  <Form.Item
                    name="endDateValue"
                    label={<span className="form-label">End Date</span>}
                    // rules={[{ required: true, message: 'Please Choose End Date' }]}
                  >
                    <DatePicker
                      className="border-0 time-border-bottom"
                      style={{ paddingLeft: '0px', marginTop: '10px' }}
                      placeholder="Choose Date"
                      suffixIcon={
                        <Calendar width="15" height="14" viewBox="0 0 15 14" fill="white" />
                      }
                      disabled
                      format="DD MMM,YYYY"
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={6} md={5} lg={3}>
                  <Form.Item
                    name="summary"
                    label={<span className="form-label">Product Summary</span>}
                    // rules={[{ required: true, message: 'Please Enter Summary' }]}
                  >
                    <Input.TextArea
                      className="border-0 time-border-bottom  px-0"
                      placeholder="Enter Summary"
                      id="summary"
                      style={{ color: 'black', marginTop: '10px', background: '#fff' }} // Adjust '100px' to your desired minimum height
                      autoSize={{
                        minRows: 0,
                        maxRows: 1,
                      }}
                      disabled
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={6} sm={4} md={3} lg={3}>
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
                          disabled={ViewProductData.file === null}
                        >
                          <img src={eyeIcon} alt="eye" width={12} />
                        </button>
                      </div>
                    }
                  >
                    <div className="input-group custom-input-group custom_input_group">
                      <input
                        type="text"
                        value={ViewProductData.file ? ViewProductData.file : ''}
                        readOnly
                        name="fieldName"
                        className="form-control border-0"
                        aria-label="Upload File"
                        aria-describedby="basic-addon1"
                        style={{
                          fontSize: '13px',
                          fontWeight: '500',
                          height: '10px',
                          cursor: 'not-allowed',
                        }}
                      />
                    </div>
                  </Form.Item>
                </CCol>
              </CRow>
              <CRow>
                <h6
                  style={{ fontWeight: '700', fontSize: '13px', marginTop: '10px' }}
                  className="bud-details"
                >
                  Budget Details
                </h6>
              </CRow>
              <CRow style={{ marginTop: '10px' }}>
                <CCol xs={12} sm={4}>
                  <Form.Item
                    name="budget"
                    label={<span className="form-label">Product Budget</span>}
                    // rules={[{ required: true, message: 'Please Enter Budget' }]}
                  >
                    <Input
                      className="border-0 time-border-bottom px-0"
                      placeholder="Enter Budget"
                      id="budget"
                      disabled
                      style={{
                        color: 'black',
                        cursor: 'not-allowed',
                        background: '#fff',
                      }}
                    />
                  </Form.Item>
                </CCol>
                <CCol xs={12} sm={4}>
                  <Form.Item
                    name="currency"
                    label={<span className="form-label">Currency</span>}
                    rules={[{ required: false, message: 'Please Choose Currency' }]}
                  >
                    <Select
                      className="border-0 time-border-bottom "
                      placeholder="Choose Currency"
                      disabled
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
            </Form>
          </CRow>
        </div>
      </CCol>
      <CCol xs={3} md={3} className="approvalflow-rightside">
        <div style={{ marginLeft: '14px' }}>
          <Row style={{ marginTop: '31%' }}>
            <h6 style={{ fontWeight: '700', fontSize: '13px' }}>Approval Flow</h6>
          </Row>
          <div style={{ maxHeight: '290px', overflowY: 'auto' }}>
            {ViewProductData.approvalFlow &&
              ViewProductData.approvalFlow.map((approver, approverIndex) => (
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
                      <span
                        style={{ marginLeft: '10%', fontSize: '11px', fontWeight: '600' }}
                        className="flow1_lable"
                      >
                        Flow {approverIndex + 1}
                      </span>
                    </div>
                  </Row>

                  <Row className="align-items-center" style={{ marginTop: '12px' }}>
                    <div className="col-sm-1 col-xs-1">
                      <div className="vertical-line"></div>
                    </div>
                  </Row>

                  {/* Profile details */}
                  <CRow className="align-items-center">
                    <div className="col-sm-1 col-xs-1"></div>
                    <div className="col-sm-2 col-md-1 col-xs-2" style={{ marginleft: '12px' }}>
                      <img
                        alt="profile-pic"
                        className="head-td-flow approval_flow_img"
                        src={approver.profile_pic ? ImageUrl + approver.profile_pic : profileImage1}
                      />
                    </div>
                    <div className="col-md-6 name_role name_role_view" style={{ marginTop: '6px' }}>
                      <p
                        className="head-td-name"
                        title={approver.name}
                        style={{ cursor: 'default' }}
                      >
                        {approver.name}
                      </p>
                      <p
                        className="head-td-role"
                        title={approver.role}
                        style={{ cursor: 'default' }}
                      >
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
  )
}
ViewProduct.propTypes = {
  flowList: PropTypes.array.isRequired,
  close: PropTypes.func,
  categories: PropTypes.array,
  techHeadList: PropTypes.array,
  prodHeadList: PropTypes.array,
  dataHeadList: PropTypes.array,
  howHeadList: PropTypes.array,
  ViewProductData: PropTypes.object,
  viewStatus: PropTypes.string,
  ownerOption: PropTypes.array,
  titleList: PropTypes.string,
  mastersProd: PropTypes.array,
  mastersTech: PropTypes.array,
  mastersData: PropTypes.array,
  mastersHow: PropTypes.array,
}
export default ViewProduct
