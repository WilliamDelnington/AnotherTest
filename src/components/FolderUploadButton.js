import { faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { auth, firestore } from '../firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ROOT_FOLDER } from './useFolder'

export default function FolderUploadButton({ folder }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [folderName, setFolderName] = useState("")
    const [error, setError] = useState("")
    
    const user = auth.currentUser

    function openModal() {
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            if (folder == null) return
            const path = [...folder.path]
            if (folder !== ROOT_FOLDER) {
                path.push({
                    name: folder.name,
                    id: folder.id
                })
            }
            const folderCollection = collection(firestore, "/folders")

            const folderData = {
                name: folderName,
                userId: user.uid,
                parentId: folder.id,
                path: path,
                createdTime: serverTimestamp()
            }

            const addRef = await addDoc(folderCollection, folderData)
            console.log(addRef.id)
            
        }
        catch (error) {
            console.log(error)
        } finally {
            setFolderName("")
            closeModal()
        }
    }

  return (
    <>
        <Button onClick={openModal} style={{
            border: '1px solid black',
            padding: '5px',
            margin: '5px'
        }}>
            <FontAwesomeIcon icon={faFolderPlus}/>
        </Button>
        <Modal show={isModalOpen} onHide={closeModal}>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Add Folder:</Form.Label>
                        <Form.Control
                        type='text'
                        required
                        value={folderName}
                        onChange={e => setFolderName(e.target.value)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                    <Button variant="success" type="submit">Add Folder</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
  )
}
