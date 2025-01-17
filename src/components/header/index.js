import React from 'react'
import ReactLogo from "../../media/React-icon.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faBars, faCog, faQuestionCircle, faSearch } from '@fortawesome/free-solid-svg-icons'

import "../../styles/Header.css"

export default function Header({ userPhoto }) {
  return (
    <div className="header">
      <div className="header__logo">
        <img src={ReactLogo} alt='React' />
        <span>Drive</span>
      </div>
      <div className="header__searchContainer">
        <div className="header__searchBar">
          <FontAwesomeIcon icon={faSearch} className='fa-icon'/>
          <input type='text' placeholder='Search...'/>  
          <FontAwesomeIcon icon={faArrowDown} className='fa-icon'/>
        </div>
      </div>
    <div className="header__icons">
      <span>
        <FontAwesomeIcon icon={faCog} className='fa-icon'/>
        <FontAwesomeIcon icon={faQuestionCircle} className='fa-icon'/>
      </span>
      <FontAwesomeIcon icon={faBars} className='fa-icon'/>
      <img src={userPhoto} alt='User Photo'/>
    </div>
  </div>
  )
}