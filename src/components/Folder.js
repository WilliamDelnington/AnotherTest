import React from 'react'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import FolderBookmarkButton from './FolderBookmarkButton'

export default function Folder({ folder, userId }) {
  const navigate = useNavigate()

  function toFolder() {
    navigate(`/user/${userId}/folder/${folder.id}`, { state: { folder: folder }})
  }

  return (
    <Card style={{padding: "0 6px"}}>
      <FontAwesomeIcon icon={faFolder} style={{
        width: "125px", 
        height: "125px",
        cursor: "pointer"
      }} onClick={toFolder}/>
      <Card.Body style={{display: "flex", alignItems: "center"}}>
        <p>{folder.name.length > 15 ? `${folder.name.substring(0, 15)}...` : folder.name}</p>
        {folder.hasOwnProperty("isBookmarked") && <FolderBookmarkButton folder={folder} />}
      </Card.Body>
    </Card>
  )
}
