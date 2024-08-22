import React, { useEffect, useState, useRef } from 'react'

import PropTypes from 'prop-types'
import { Card, Modal } from 'antd'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import { useDebounceEffect } from './useDebounceEffect'
import { canvasPreview } from './canvasPreview.js'
import { toast } from 'react-toastify'
import { CButton, CCardBody, CCol, CRow } from '@coreui/react'
import DeleteSvg from 'src/views/svgImages/DeleteSvg'

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 80,
        height: 80,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function BannerModal({
  handleOpenModalBanner,
  handleCloseModalBanner,
  handledefaultprofic,
  handleprofilepicvalue,
}) {
  const [imgSrc, setImgSrc] = useState(handledefaultprofic)
  const previewCanvasRef = useRef(null)
  const imgRef = useRef(null)
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(handledefaultprofic)

  const [validationMessage, setValidationMessage] = useState('')

  const [selectedFile, setSelectedFile] = useState('')

  const scale = 1
  const rotate = 0
  const aspect = 16 / 16
  const fileInputRef = useRef(null)
  const handleBrowseClick = () => {
    fileInputRef.current.click()
  }

  useEffect(() => {
    const imageUrlToFile = async (url, filename) => {
      try {
        // Fetch the image data from the URL
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch image')
        }
        const blob = await response.blob()
        const file = new File([blob], filename, { type: blob.type })
        setSelectedFile(file)
      } catch (error) {
        // console.error('Error converting image URL to File:', error)
        // Handle error as needed
      }
    }

    const url = new URL(handledefaultprofic)
    const pathname = url.pathname
    const parts = pathname.split('/')
    const imageUrl = pathname
    const filename = parts[parts.length - 1]

    imageUrlToFile(imageUrl, filename)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
    const fileInput = e.target

    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0]

      if (
        !selectedFile.type.startsWith('image/png') &&
        !selectedFile.type.startsWith('image/jpeg') &&
        !selectedFile.type.startsWith('image/jpg')
      ) {
        setImgSrc('')
        setCrop(undefined)

        setValidationMessage('Please select a PNG, JPG, or JPEG file.')

        fileInput.value = ''
        return
      }

      setCrop(undefined)

      const reader = new FileReader()
      reader.addEventListener('load', () => setImgSrc(reader.result.toString() || ''))
      reader.readAsDataURL(selectedFile)

      // Clear any previous error state
      setValidationMessage('')
    } else {
      // No file selected
      setValidationMessage('Please select an image file.')
    }
  }
  //   const onSelectFile = (e) => {
  //     const fileInput = e.target

  //     if (fileInput.files && fileInput.files.length > 0) {
  //       const selectedFile = fileInput.files[0]

  //       if (
  //         !selectedFile.type.startsWith('image/png') &&
  //         !selectedFile.type.startsWith('image/jpeg') &&
  //         !selectedFile.type.startsWith('image/jpg')
  //       ) {
  //         setImgSrc('')
  //         setCrop(undefined)

  //         setValidationMessage('Please select a PNG, JPG, or JPEG file.')

  //         fileInput.value = ''
  //         return
  //       }

  //       setCrop(undefined)

  //       const reader = new FileReader()
  //       reader.addEventListener('load', () => setImgSrc(reader.result.toString() || ''))
  //       reader.readAsDataURL(selectedFile)

  //       // Clear any previous error state
  //       setValidationMessage('')
  //     } else {
  //       // No file selected
  //       setValidationMessage('Please select an image file.')
  //     }
  //   }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate)
      }
    },
    100,
    [completedCrop, scale, rotate],
  )

  const handleCrop = async () => {
    if (completedCrop && imgRef.current) {
      try {
        // Get the cropped canvas
        const canvas = document.createElement('canvas')
        const scaleX = imgRef.current.naturalWidth / imgRef.current.width
        const scaleY = imgRef.current.naturalHeight / imgRef.current.height

        canvas.width = completedCrop.width
        canvas.height = completedCrop.height
        const ctx = canvas.getContext('2d')

        // Ensure the image is loaded from the same origin
        const img = new Image()
        img.crossOrigin = 'anonymous' // Set crossOrigin attribute
        img.src = imgSrc // Use the imgSrc loaded from your state

        img.onload = () => {
          ctx.drawImage(
            img,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            completedCrop.width,
            completedCrop.height,
          )

          // Convert canvas to a blob
          canvas.toBlob((blob) => {
            // Create a File from the blob
            const croppedFile = new File([blob], 'croppedImage.jpeg', {
              type: 'image/jpeg',
            })

            // Dispatch the action to upload the cropped image
            handleprofilepicvalue(croppedFile)
            toast.success('Profile Image Uploaded Successfully', {
              position: toast.POSITION.BOTTOM_RIGHT,
              autoClose: 3000,
            })
            handleCloseModalBanner()
          }, 'image/jpeg')
        }
      } catch (error) {
        toast.error('Profile Image Failed to Upload', {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 3000,
        })
      }
    } else {
      handleprofilepicvalue('')
      toast.success('Profile Image Removed Successfully', {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 3000,
      })
      handleCloseModalBanner()
    }
  }

  const handleDeleteButton = () => {
    // Handle click event to clear imgSrc and selectedFile
    setImgSrc('')
    fileInputRef.current.value = ''
    setSelectedFile('')
  }

  BannerModal.propTypes = {
    handleOpenModalBanner: PropTypes.func.isRequired,
    handleCloseModalBanner: PropTypes.func.isRequired,
    handledefaultprofic: PropTypes.string.isRequired,
    handleprofilepicvalue: PropTypes.func.isRequired,
  }
  return (
    <Modal
      visible={handleOpenModalBanner}
      onCancel={handleCloseModalBanner}
      style={{ maxWidth: '1000px' }}
      maskClosable={false}
      size="extra-small"
      footer={false}
      className="modal_width"
    >
      {/* <ModalHeader toggle={handleCloseModalBanner}> */}
      <>
        <h6 style={{ fontWeight: '700' }}> Edit Profile Picture</h6>
        <button
          className="btn-close invisible"
          type="button"
          onClick={handleCloseModalBanner}
        ></button>
      </>
      {/* </ModalHeader> */}
      {/* <ModalBody> */}
      <Card>
        {/* <CardHeader>
            <h5>Image Cropper</h5>
          </CardHeader> */}
        <CCardBody>
          {Boolean(imgSrc) ? (
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imgSrc}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  height: '100%',
                  width: '100%',
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          ) : (
            <div
              style={{
                height: '154px',
                width: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              className="text-center"
            >
              <b style={{ marginLeft: '71px', fontSize: '14px' }}> Add Profile</b>
            </div>
          )}

          {/* <div>
            {Boolean(completedCrop) && (
              <canvas
                ref={previewCanvasRef}
                style={{
                  // border: '1px solid black',
                  objectFit: 'contain',
                  width: '100%',
                  height: completedCrop.height,
                }}
              />
            )}
          </div> */}
        </CCardBody>
      </Card>
      {/* <div className="Crop-Controls">
        <input
          className="form-control"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={onSelectFile}
        />

        {validationMessage && <div style={{ color: 'red' }}>{validationMessage}</div>}
      </div> */}
      <CRow className="mt-2">
        <CCol sm={10}>
          <div className="input-group  custom-input-group custom_input_group">
            <input
              type="text"
              value={selectedFile ? selectedFile.name : ''}
              readOnly
              name="fieldName"
              className="form-control border-0"
              aria-label="Upload File"
              aria-describedby="basic-addon1"
              style={{ fontSize: '13px', fontWeight: '500' }}
            />
            <div className="input-group-append">
              <button
                className="browse input-group-text text-danger"
                onClick={handleBrowseClick}
                type="button"
              >
                Choose File
              </button>
            </div>
          </div>
          {validationMessage && <div style={{ color: 'red' }}>{validationMessage}</div>}
          <input
            type="file"
            className="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
        </CCol>
        <CCol sm={1}>
          <button
            type="button"
            className="action-view cross-button"
            style={{ marginTop: '5px' }}
            onClick={handleDeleteButton}
            // onClick={() => handleViewClick(flow.id)}
          >
            <DeleteSvg width="18" height="18" viewBox="0 0 18 18" fill="red" />
          </button>
        </CCol>
      </CRow>
      {/* </ModalBody> */}
      {/* <ModalFooter> */}
      <CRow className="mt-3">
        <CCol sm={5}></CCol>
        <CCol sm={12} className="d-flex justify-content-end align-items-center">
          <CButton
            className="cancel-btn text-c"
            onClick={handleCloseModalBanner}
            style={{ width: '100px', height: '44px', marginTop: '2px' }}
          >
            Cancel
          </CButton>
          <CButton
            className="submit-button save_changes "
            style={{ fontSize: '13px', color: 'white', marginTop: '-3px' }}
            type="button"
            onClick={handleCrop}
          >
            Update
          </CButton>
        </CCol>
      </CRow>
      {/* </ModalFooter> */}
    </Modal>
  )
}
