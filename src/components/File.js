import { faFile, faFileAudio, faFileCsv, faFileExcel, faFileImage, faFilePdf, faFilePowerpoint, faFileText, faFileVideo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'

export default function File({ fileId, fileName, fileType }) {
    const [fileIcon, setFileIcon] = useState(null)

    useEffect(() => {
        switch (fileType) {
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
            case "application/vnd.ms-excel":
                setFileIcon(faFileExcel)
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
    }, [fileType])
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
        <FontAwesomeIcon icon={fileIcon} style={{width: "125px", height: "125px"}}/>
        <p>{fileName}</p>
    </div>
  )
}
