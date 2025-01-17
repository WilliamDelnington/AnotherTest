import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function NewFile() {
  return (
    <div className="newFile">
      <div className="newFile__container">
        <FontAwesomeIcon icon={faPlus} />
        <p>New</p>
      </div>
    </div>
  )
}
