import React, { useState } from 'react'
import { useAuth } from '../Contexts/useContext'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { firestore } from '../firebase'

export default function FolderBookmarkButton({ folderId, isBookmarked }) {
    const [loading, setLoading] = useState(false)

    const { user } = useAuth()

    function addBookmark(e) {
        e.preventDefault()

        setLoading(true)
        const bookmarkDoc = doc(firestore, "folderBookmarks", folderId)

        setDoc(bookmarkDoc, {
            folderId: folderId,
            userId: user.uid,
            createdTime: serverTimestamp()
        }).then(() => {
            console.log("Bookmark added")
        }).catch((err) => {
            console.error(err)
        }).finally(() => {
            setLoading(false)
        })
    }

    function deleteBookmark(e) {
        e.preventDefault()

        setLoading(true)
        const bookmarkDoc = doc(firestore, "folderBookmarks", folderId)

        deleteDoc(bookmarkDoc).then(() => {
            console.log("Bookmark deleted")
        }).catch((err) => {
            console.error(err)
        }).finally(() => {
            setLoading(false)
        })
    }

  return (
    <Button onClick={isBookmarked ? deleteBookmark : addBookmark} disabled={loading}>
      <FontAwesomeIcon icon={faBookmark} style={{
        color: isBookmarked ? "green": "white"
      }}/>
    </Button>
  )
}
