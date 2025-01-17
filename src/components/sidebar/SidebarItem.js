import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function SidebarItem({ arrow, icon, label}) {
  return (
    <div className="sidebarItem">
      <div className="sidebarItem__arrow">
        {arrow && (<FontAwesomeIcon icon={faArrowRight}/>)}
      </div>
      <div className="sidebarItem__main">
        {icon}
        <p>{label}</p>
      </div>
    </div>
  )
}
