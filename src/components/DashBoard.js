import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import FolderUploadButton from './FolderUploadButton'
import { useFolder } from './useFolder'
import AppNavbar from './header/AppNavbar'
import Folder from './Folder'
import { useLocation, useParams } from 'react-router'

export default function DashBoard() {
    const { folderId } = useParams()
    const location = useLocation()

    console.log(location.state)
    const curState = useFolder(folderId, location.state?.folder)
    const childFolders = curState.childFolders

  return (
    <>
        <AppNavbar />
        <Container fluid>
            <FolderUploadButton folder={curState.folder}/>
            {childFolders.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap'
              }}>
                {childFolders.map(folder => (
                  <div 
                  key={folder.id}
                  className="p-2">
                    <Folder folder={folder} />
                  </div>
                ))}
              </div>
            )}
            
        </Container> 
    </>
  )
}
