import React, { useEffect, useState } from 'react'
import { useAuth } from '../Contexts/useContext'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { firestore } from '../firebase'

export default function FolderBookmarkButton({ folder }) {
    const [loading, setLoading] = useState(true)
    const [isBookmarked, setIsBookmarked] = useState(false)

    const { user } = useAuth()

    useEffect(() => {
        setIsBookmarked(folder.isBookmarked)
        setLoading(false)
    }, [folder])

    function addBookmark(e) {
        e.preventDefault()

        setLoading(true)
        const bookmarkDoc = doc(firestore, "folderBookmarks", folder.id)

        setDoc(bookmarkDoc, {
            folderId: folder.id,
            userId: user.uid,
            createdTime: serverTimestamp()
        }).then(() => {
            console.log("Bookmark added")
        }).catch((err) => {
            console.error(err)
        }).finally(() => {
            setIsBookmarked(true)
            setLoading(false)
        })
    }

    function deleteBookmark(e) {
        e.preventDefault()

        setLoading(true)
        const bookmarkDoc = doc(firestore, "folderBookmarks", folder.id)

        deleteDoc(bookmarkDoc).then(() => {
            console.log("Bookmark deleted")
        }).catch((err) => {
            console.error(err)
        }).finally(() => {
            setIsBookmarked(false)
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
