import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useAuth } from '../Contexts/useContext'
import { firestore } from '../firebase'

export default function FileBookmarkButton({ file }) {
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
      setIsBookmarked(file.isBookmarked)
      setLoading(false)
  }, [file])

  function addBookmark(e) {
      e.preventDefault()

      setLoading(true)
      const bookmarkDoc = doc(firestore, "fileBookmarks", file.id)

      setDoc(bookmarkDoc, {
          fileId: file.id,
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
      const bookmarkDoc = doc(firestore, "fileBookmarks", file.id)

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
