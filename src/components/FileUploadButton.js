import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { ProgressBar, Toast } from 'react-bootstrap'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '../Contexts/useContext'
import { addDoc, collection, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { firestore, storage } from '../firebase'
import { getDownloadURL, getMetadata, ref, uploadBytesResumable } from 'firebase/storage'
import { createPortal } from 'react-dom'

export default function FileUploadButton({ folder }) {
  const [uploadingFiles, setUploadingFiles] = useState([])
  const { user } = useAuth()

  console.log(folder?.id)

  function handleUpload(e) {
    const file = e.target.files[0]
    console.log(file.name)
    if (folder == null || file == null) return

    const id = uuidv4()
    setUploadingFiles([
      ...uploadingFiles,
      {id: id, name: file.name, progress: 0, error: false},
    ])

    const fileUploadRef = ref(storage, `/files/${user.uid}/${file.name}`)
    const fileCollection = collection(firestore, `/files`)

    const uploadTask = uploadBytesResumable(fileUploadRef, file)

    uploadTask.on("state_changed", snapshot => {
      const progress = snapshot.bytesTransferred / snapshot.totalBytes
      setUploadingFiles(prevUploadingFiles => {
        // Determine the file uploading progress
        return prevUploadingFiles.map(uploadFile => {
          if (uploadFile.id === id) {
            return {...uploadFile, progress: progress}
          }
        })
      })
    }, error => {
      console.log(error)
      // If an error occurred, set the error
      setUploadingFiles(prevUploadingFiles => {
        return prevUploadingFiles.map(uploadFile => {
          if (uploadFile.id === id) {
            return {...uploadFile, error: true}
          }
        })
      })
    }, () => {
      setUploadingFiles(prevUploadingFiles => {
        return prevUploadingFiles.filter(uploadFile => {
          return uploadFile.id !== id
        })
      })

      getDownloadURL(uploadTask.snapshot.ref).then(url => {
        getMetadata(uploadTask.snapshot.ref).then(metadata => {
          const fileFindingQuery = query(fileCollection,
            where("folderId", "==", folder.id),
            where("name", "==", file.name),
            where("userId", "==", user.uid)
          )

          getDocs(fileFindingQuery).then(files => {
            const f = files.docs[0]
            if (f) {
              updateDoc(f.ref, { url: url })
            } else {
              addDoc(fileCollection, {
                url: url,
                mimeType: metadata.contentType,
                createdTime: serverTimestamp(),
                name: file.name,
                folderId: folder.id,
                userId: user.uid
              }).then(ref => console.log("File successfully uploaded: " + ref.id)).catch(err => {
                console.error("An error uploading file: " + err.message)
              })
            }
          })
        }).catch(err => console.error(err))
      }).catch(err => console.error(err))
    })
  }

  return (
    <>
    <label className='btn btn-outline-success btn-sm m-0 mr-2' style={{
      border: "1px solid black",
      padding: "5px",
      margin: "5px"
    }}>
        <FontAwesomeIcon icon={faFileUpload}/>
        <input type="file" onChange={handleUpload} style={{
          opacity: 0,
          position: 'absolute',
          left: '-9999px'
        }}/>
    </label>
    {uploadingFiles.length > 0 && 
      createPortal(
      <div style={{
        position: "absolute",
        right: "1rem",
        bottom: "1rem",
        maxWidth: "250px"
      }}>
        {uploadingFiles.map(uploadingFile => (
          <Toast 
          key={uploadingFile.id}
          onClose={() => {
            setUploadingFiles(prevUploadingFiles => {
              return prevUploadingFiles.filter(file => {
                return file.id !== uploadingFile.id
              })
            })
          }}>
            <Toast.Header 
            closeButton={uploadingFile.error}
            className='text-truncate w-100 d-block'>
              {uploadingFile.name}
            </Toast.Header>
            <Toast.Body>
              <ProgressBar 
              animated={!uploadingFile.error}
              variant={uploadingFile.error ? "danger" : "primary"}
              now={uploadingFile.error ? 100 : uploadingFile.progress * 100}
              label={
                uploadingFile.error ? "Error" : `${Math.round(uploadingFile.progress * 100)}%`
              }/>
            </Toast.Body>
          </Toast>
        ))}
      </div>, document.body)}
    </>
  )
}
