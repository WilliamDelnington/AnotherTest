import React from 'react'
import { faFolder } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Folder({ folderId, folderName }) {
  return (
    <div style={{
        width: "200px",
        border: "1px solid black",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "5px"
    }}>
      <FontAwesomeIcon icon={faFolder} style={{width: "125px", height: "125px"}}/>
      <p>{folderName}</p>
    </div>
  )
}
