import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Input, Modal } from 'antd'

const { TextArea } = Input
const ApprovedConfirmModal = ({
  isModalOpen,
  handleCancel,
  handleApprove,
  id,
  headContent,
  resetFunc,
}) => {
  const [remarks, setRemarks] = useState('')
  const [loading, setLoadings] = useState(false)

  const handleOk = async () => {
    setLoadings(true)
    try {
      const response = await handleApprove('Approved', id, remarks)
      if (response.status === true) {
        resetFunc()
      }
    } catch (error) {
    } finally {
      setLoadings(false)
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
      title={`Approved ${headContent}`}
      open={isModalOpen}
      onOk={handleOk}
      okText="Approved"
      onCancel={handleCancel}
      okButtonProps={{
        style: { background: '#f54550', borderColor: '#f54550', color: 'white' },
        loading: loading,
      }} // Change button color here
      maskClosable={false}
    >
      <p>Do you want to do Approved this {headContent} ?</p>

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
    </Modal>
  )
}

ApprovedConfirmModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleApprove: PropTypes.func,
  id: PropTypes.any,
  headContent: PropTypes.string,
  resetFunc: PropTypes.func,
}
export default ApprovedConfirmModal
