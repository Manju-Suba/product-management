import React from 'react'
import headerimages from '../../assets/images/Headerimage2.png'

function AppHeaderImage() {
  return (
    <div>
      <div
        className="header_image_bg"
        style={{
          backgroundImage: `url(${headerimages})`,
          backgroundSize: 'cover',
          position: 'relative',
          backgroundPosition: 'center',
          height: '210px',
          zIndex: -1,
        }}
      >
        {' '}
      </div>
    </div>
  )
}

export default AppHeaderImage
