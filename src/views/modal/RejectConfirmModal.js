import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input, Modal } from 'antd'

const { TextArea } = Input
const RejectConfirmModal = ({
  isModalOpen,
  handleCancel,
  handleApprove,
  id,
  headContent,
  resetFunc,
}) => {
  const [remarks, setRemarks] = useState('')
  const [loadings, setLoadings] = useState(false)
  const [formErrors, setFormErrors] = useState({
    remarks: '',
  })

  const validateForm = () => {
    const errors = {
      remarks: '',
    }
    if (remarks === '') {
      errors.remarks = 'Please Enter Remarks'
    }
    setFormErrors(errors)
    const hasErrors = errors.remarks !== ''
    return !hasErrors
  }

  const handleOk = async () => {
    const isFormValid = validateForm()
    if (isFormValid) {
      setLoadings(true)
      try {
        const response = await handleApprove('Rejected', id, remarks)
        if (response.status === true) {
          resetFunc()
        }
      } catch (error) {
      } finally {
        setLoadings(false)
      }
    }
  }

  const handleRemark = (remarks) => {
    const regex = /^(?!\s)(?![&@.,()\s])(?![^a-zA-Z0-9\s.,()-]+$)[&@a-zA-Z0-9\s.,()-]*$/
    if (regex.test(remarks) || remarks === '') {
      setRemarks(remarks)
    }
  }

  return (
    <Modal
      title={`Reject ${headContent}`}
      open={isModalOpen}
      onOk={handleOk}
      okText="Reject"
      onCancel={handleCancel}
      okButtonProps={{
        style: { background: '#f54550', borderColor: '#f54550', color: 'white' },
        loading: loadings,
        disabled: remarks.trim() === '',
      }} // Change button color here
      maskClosable={false}
    >
      <p>Do you want to do reject this {headContent} ?</p>

      <TextArea
        id="Description"
        variant={'borderless'}
        value={remarks}
        onChange={(e) => handleRemark(e.target.value)}
        className="time-border-bottom"
        style={{
          color: 'black',
          width: '265px',
          fontSize: '13px',
          padding: '0px',
        }}
        placeholder="Enter Remarks..."
        autoSize={{
          minRows: 0,
          maxRows: 1,
        }}
      />
      <br />
      <span className="text-danger nameflow-error ">{formErrors.remarks}</span>
    </Modal>
  )
}

RejectConfirmModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleApprove: PropTypes.func,
  id: PropTypes.any,
  headContent: PropTypes.string,
  resetFunc: PropTypes.func,
}
export default RejectConfirmModal
