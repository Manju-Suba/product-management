import React from 'react'
import PropTypes from 'prop-types'

const EditSvg = ({ width, height, fill, viewBox, color, clipH, clipW }) => (
  <svg
    width={width}
    height={height}
    viewBox={viewBox}
    fill={fill}
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_3212_26864)">
      <path
        d="M0 17.4739C0.104004 17.0872 0.213135 16.7019 0.310913 16.3137C0.57312 15.2722 0.827637 14.2285 1.09351 13.1881C1.12097 13.0812 1.18506 12.9702 1.26306 12.8918C4.50146 9.64685 7.74353 6.40552 10.9852 3.16418C11.0178 3.13159 11.053 3.10083 11.072 3.08325C12.3519 4.36279 13.6271 5.63831 14.9172 6.9281C14.9004 6.94641 14.8605 6.99292 14.8169 7.03613C11.5913 10.261 8.36646 13.4862 5.13721 16.707C5.04346 16.8004 4.91089 16.8784 4.78308 16.911C3.38599 17.2677 1.98596 17.6138 0.587036 17.9635C0.554077 17.9719 0.522949 17.988 0.490723 18.0005H0.280151C0.186401 17.9067 0.0930176 17.8134 -0.000732422 17.7196C-0.000732422 17.6376 -0.000732422 17.5559 -0.000732422 17.4739H0Z"
        fill="#A5A1A1"
      />
      <path
        d="M0 17.7192C0.09375 17.813 0.187134 17.9064 0.280884 18.0001H0C0 17.9064 0 17.813 0 17.7192Z"
        fill="white"
      />
      <path
        d="M16.0682 5.78585C14.7806 4.49825 13.5037 3.22201 12.2164 1.93477C12.5629 1.58834 12.9152 1.23202 13.2722 0.880087C13.4344 0.720419 13.5927 0.552694 13.7747 0.418295C14.4921 -0.111613 15.5486 -0.0731604 16.2081 0.527426C16.6571 0.936117 17.0889 1.36788 17.4965 1.81795C18.1018 2.48592 18.1274 3.50362 17.5884 4.22909C17.5188 4.32247 17.4408 4.41073 17.3588 4.49349C16.9274 4.92818 16.4934 5.36068 16.0682 5.78585Z"
        fill="#A5A1A1"
      />
    </g>
    <defs>
      <clipPath id="clip0_3212_26864">
        <rect width={clipW} height={clipH} fill={color} />
      </clipPath>
    </defs>
  </svg>
)
EditSvg.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  fill: PropTypes.string,
  viewBox: PropTypes.string,
  color: PropTypes.string,
  clipW: PropTypes.string,
  clipH: PropTypes.string,
}
export default EditSvg
