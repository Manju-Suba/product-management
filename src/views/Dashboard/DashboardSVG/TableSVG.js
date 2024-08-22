import React from 'react'
import PropTypes from 'prop-types'

const NextArrowSVG = ({ width, height, fill, viewBox, stopColor }) => (
  <>
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5809 0.153809H1.26636L0.669922 0.750248V13.8719L1.26636 14.4683H15.5809L16.1773 13.8719V0.750248L15.5809 0.153809ZM1.8628 1.34669H14.9845V2.53957H1.8628V1.34669ZM10.2129 6.1182H6.63431V3.73244H10.2129V6.1182ZM10.2129 7.31108V9.69684H6.63431V7.31108H10.2129ZM1.8628 3.73244H5.44144V6.1182H1.8628V3.73244ZM1.8628 7.31108H5.44144V9.69684H1.8628V7.31108ZM1.8628 13.2755V10.8897H5.44144V13.2755H1.8628ZM6.63431 13.2755V10.8897H10.2129V13.2755H6.63431ZM14.9845 13.2755H11.4058V10.8897H14.9845V13.2755ZM14.9845 9.69684H11.4058V7.31108H14.9845V9.69684ZM11.4058 6.1182V3.73244H14.9845V6.1182H11.4058Z"
        fill={fill}
      />
    </svg>
  </>
)

NextArrowSVG.propTypes = {
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  fill: PropTypes.string.isRequired,
  viewBox: PropTypes.string.isRequired,
  stopColor: PropTypes.string.isRequired,
}

export default NextArrowSVG
