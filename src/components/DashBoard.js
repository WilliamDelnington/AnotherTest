import React from 'react'
import { Container } from 'react-bootstrap'
import FolderUploadButton from './FolderUploadButton'
import { useFolder } from './useFolder'

export default function DashBoard() {
    const state = useFolder()
  return (
    <>
        <Container fluid>
            <FolderUploadButton folderId={state}/>
        </Container> 
    </>
  )
}
