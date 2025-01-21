import React, { useEffect } from 'react'
import { Container } from 'react-bootstrap'
import FolderUploadButton from './FolderUploadButton'
import { useFolder } from './useFolder'
import AppNavbar from './header/AppNavbar'
import Folder from './Folder'
import { useLocation, useParams } from 'react-router'
import FileUploadButton from './FileUploadButton'
import File from './File'
import { useAuth } from '../Contexts/useContext'

export default function DashBoard() {
    const { folderId, userId } = useParams()
    const location = useLocation()
    const { user } = useAuth()

    console.log(location.state)
    const curState = useFolder(userId, folderId, location.state?.folder)

  return (
    <>
        <AppNavbar />
        <Container fluid>
          {/* Allow upload file and add folder if the authed user's id matches userId */}
            {userId === user?.uid ? (<>
            <FolderUploadButton folder={curState.folder}/>
            <FileUploadButton folder={curState.folder} />
            </>) : <div></div>}
            {curState.childFolders.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap'
              }}>
                {curState.childFolders.map(folder => (
                  <div 
                  key={folder.id}
                  className="p-2">
                    <Folder folder={folder} userId={userId}/>
                  </div>
                ))}
              </div>
            )}
            {curState.childFolders.length > 0 && curState.childFiles.length > 0 && <hr />}
            {curState.childFiles.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap'
              }}>
                {curState.childFiles.map(file => (
                  <div
                  key={file.id}
                  className='p-2'>
                    <File file={file}/>
                  </div>
                ))}
              </div>
            )}
            
        </Container>
    </>
  )
}
