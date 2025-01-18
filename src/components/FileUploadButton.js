import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Button } from 'react-bootstrap'

export default function FileUploadButton({ user }) {
  return (
    <Button variant='outline-success' size="sm">
        <FontAwesomeIcon icon={faFileUpload}/>
    </Button>
  )
}
