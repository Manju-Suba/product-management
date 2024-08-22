import React from 'react'
import PropTypes from 'prop-types'

const FileSvg = ({ width, height, fill, viewBox }) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_586_10850)">
      <path
        d="M9 5.25V0.345C9.68475 0.6045 10.3147 1.00425 10.8488 1.5375L13.4618 4.152C13.9957 4.68525 14.3955 5.31525 14.655 6H9.75C9.336 6 9 5.66325 9 5.25ZM9.9525 14.61C9.34275 15.2197 9 16.0462 9 16.9088V18H10.0912C10.9537 18 11.7803 17.6572 12.39 17.0475L17.4953 11.9423C18.168 11.2695 18.168 10.1775 17.4953 9.50475C16.8225 8.832 15.7305 8.832 15.0577 9.50475L9.9525 14.61ZM7.5 16.9088C7.5 15.6398 7.99425 14.4465 8.89125 13.5495L13.9965 8.44425C14.2883 8.1525 14.628 7.92825 14.9948 7.7685C14.9917 7.6785 14.988 7.58925 14.982 7.49925H9.75C8.5095 7.49925 7.5 6.48975 7.5 5.24925V0.018C7.37925 0.00975 7.2585 0 7.13625 0H3.75C1.68225 0 0 1.68225 0 3.75V14.25C0 16.3177 1.68225 18 3.75 18H7.5V16.9088Z"
        fill="#919EAB"
      />
    </g>
    <defs>
      <clipPath id="clip0_586_10850">
        <rect width={width} height={height} />
      </clipPath>
    </defs>
  </svg>
)
FileSvg.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  viewBox: PropTypes.string,
}
export default FileSvg
