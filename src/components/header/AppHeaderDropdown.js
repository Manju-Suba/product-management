import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CAvatar, CDropdown, CDropdownToggle } from '@coreui/react'
import avatar8 from '../../assets/images/avatars/default-profile.png'
import { ImageUrl, getDecodeData } from '../../constant/Global'

const AppHeaderDropdown = (profilePic) => {
  const navigate = useNavigate()
  const user = getDecodeData()
  const pic = user?.profile_pic
  const microsoftProfilePic = profilePic?.profilePic.profilePic

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  const isMicrosoftProfilePicEmpty =
    !microsoftProfilePic || Object.keys(microsoftProfilePic).length === 0

  const defaultAvatar = 'default-profile.png'
  const getMicrosoftProfilePicSrc = (microsoftProfilePic) => {
    return microsoftProfilePic.startsWith('/9j/')
      ? `data:image/png;base64,${microsoftProfilePic}`
      : ImageUrl + microsoftProfilePic
  }

  const getProfilePicSrc = (pic) => {
    if (pic && pic !== defaultAvatar) {
      return pic.startsWith('/9j/') ? `data:image/png;base64,${pic}` : ImageUrl + pic
    } else {
      return avatar8
    }
  }

  const profilePicSrc = isMicrosoftProfilePicEmpty
    ? getProfilePicSrc(pic)
    : getMicrosoftProfilePicSrc(microsoftProfilePic)

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-center" className="py-0" caret={false}>
        <CAvatar
          src={profilePicSrc}
          style={{
            cursor: 'pointer',
            width: '43px',
            height: '46px',
            marginRight: '10px',
            marginTop: '16px',
          }}
          size="md"
        />
      </CDropdownToggle>
    </CDropdown>
  )
}

export default AppHeaderDropdown
