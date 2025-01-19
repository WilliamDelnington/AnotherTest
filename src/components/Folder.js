import React from 'react'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'

export default function Folder({ folder, userId }) {
  const navigate = useNavigate()
  function toFolder() {
    navigate(`/user/${userId}/folder/${folder.id}`, { state: { folder: folder }})
  }

  return (
    <Button style={{
        width: "200px",
        border: "1px solid black",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "5px",
        cursor: "pointer"
    }}
    onClick={toFolder}>
      <FontAwesomeIcon icon={faFolder} style={{width: "125px", height: "125px"}}/>
      {folder.name}
    </Button>
  )
}
