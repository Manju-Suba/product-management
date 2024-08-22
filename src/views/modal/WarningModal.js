import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
const WarningModal = ({
  isModalOpen,
  handleCancel,
  handleApprove,
  id,
  headContent,
  resetFunc,
  date,
}) => {
  const [loading, setLoading] = useState(false)

  const handleOk = async () => {
    setLoading(true)
    try {
      const response = await handleApprove(id)
      if (response.status === true) {
        resetFunc()
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={`${headContent}`}
      open={isModalOpen}
      onOk={handleOk}
      okText="Confirm"
      centered
      onCancel={handleCancel}
      okButtonProps={{
        style: { background: '#f54550', borderColor: '#f54550', color: 'white' },
        loading: loading,
      }} // Change button color here
      maskClosable={false}
    >
      <p>
        Are you sure to withdraw leave on the <b>{date}</b> ?
      </p>
    </Modal>
  )
}

WarningModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleApprove: PropTypes.func,
  id: PropTypes.any,
  headContent: PropTypes.string,
  resetFunc: PropTypes.func,
  date: PropTypes.string,
}
export default WarningModal
