import { faFile, faFileAudio, faFileCsv, faFileExcel, faFileImage, faFilePdf, faFilePowerpoint, faFileText, faFileVideo, faFileWord } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router'

export default function File({ file }) {
    const [fileIcon, setFileIcon] = useState(null)

    useEffect(() => {
        switch (file.mimeType) {
            case "video/mp4":
                setFileIcon(faFileVideo)
                break
            case "video/ogg":
                setFileIcon(faFileVideo)
                break
            case "video/mpeg":
                setFileIcon(faFileVideo)
                break
            case "image/jpeg":
                setFileIcon(faFileImage)
                break
            case "image/png":
                setFileIcon(faFileImage)
                break
            case "image/svg+xml":
                setFileIcon(faFileImage)
                break
            case "application/pdf":
                setFileIcon(faFilePdf)
                break
            case "text/csv":
                setFileIcon(faFileCsv)
                break
            case "application/vnd.ms-powerpoint":
                setFileIcon(faFilePowerpoint)
                break
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                setFileIcon(faFilePowerpoint)
                break
            case "application/vnd.ms-excel":
                setFileIcon(faFileExcel)
                break
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                setFileIcon(faFileWord)
                break
            case "audio/mpeg":
                setFileIcon(faFileAudio)
                break
            case "audio/ogg":
                setFileIcon(faFileAudio)
                break
            case "audio/webm":
                setFileIcon(faFileAudio)
                break
            case "text/plain":
                setFileIcon(faFileText)
                break
            default:
                setFileIcon(faFile)
                break
        }
    }, [file.mimeType])
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
    as={Link}
    to={file.url}>
        <FontAwesomeIcon icon={fileIcon} style={{width: "125px", height: "125px"}}/>
        <p>{file.name.length > 15 ? `${file.name.substring(0, 15)}...` : file.name}</p>
    </Button>
  )
}
