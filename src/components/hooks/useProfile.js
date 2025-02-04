import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useReducer } from "react";
import { firestore, storage } from "../../firebase";
import { getDownloadURL, ref } from "firebase/storage";

const ACTIONS = {
    SET_FRIENDS: "set-friends",
    SET_PHOTO_URL: "set-photo-url",
    SET_BOOKMARK_FILES: "set-bookmark-files",
    SET_BOOKMARK_FOLDERS: "set-bookmark-folders",
}

export function useProfile(user) {
    const [state, dispatch] = useReducer(reducer, {
        friends: [],
        profileUrl: "",
        fileBookmarks: [],
        folderBookmarks: []
    })

    useEffect(() => {
        const friendCollection = collection(firestore, "friends")

        const cleanup = () => {
            const q = query(friendCollection,
                where("from", "==", user.uid)
            )

            getDocs(q).then(data => {
                dispatch({ 
                    type: ACTIONS.SET_FRIENDS,
                    payload: { friends: data.docs.map(d => {
                        return {...d.data(), id: d.id}
                    }) }
                })
            }).catch(err => {
                console.error(err)
                dispatch({
                    type: ACTIONS.SET_FRIENDS,
                    payload: { friends: [] }
                })
            })
        }

        return () => cleanup()
    }, [user])

    useEffect(() => {
        if (!user.photoURL) {
            const defaultImageRef = ref(storage, "profileImages/default.jpg")
            getDownloadURL(defaultImageRef).then(downloadURL => {
                dispatch({
                    type: ACTIONS.SET_PHOTO_URL,
                    payload: { profileURL: downloadURL }
                })
            })
        } else {
            dispatch({ 
                type: ACTIONS.SET_PHOTO_URL,
                payload: { profileURL: user.photoURL }
            })
        }
    }, [user])

    useEffect(() => {
        const fileBookmarksCollection = collection(firestore, "fileBookmarks")
        const filesCollection = collection(firestore, "files")

        const cleanup = () => {
            const q = query(fileBookmarksCollection,
                where("userId", "==", user.uid)
            )

            getDocs(q).then(data => {
                dispatch({
                    type: ACTIONS.SET_BOOKMARK_FILES,
                    payload: { fileBookmarks: data.docs.map(d => {
                        getDoc(doc(filesCollection, d.fileId)).then(da => {
                            return {...da.data(), id: da.id}
                        })
                    })}
                })
            }).catch(err => {
                console.error(err)
                dispatch({
                    type: ACTIONS.SET_BOOKMARK_FILES,
                    payload: { fileBookmarks: [] }
                })
            })
        }

        return () => cleanup()
    }, [user])

    useEffect(() => {
        const folderBookmarksCollection = collection(firestore, "folderBookmarks")
        const foldersCollection = collection(firestore, "folders")

        const cleanup = () => {
            const q = query(folderBookmarksCollection, 
                where("userId", "==", user.uid)
            )

            getDocs(q).then(data => {
                dispatch({
                    type: ACTIONS.SET_BOOKMARK_FOLDERS,
                    payload: { folderBookmarks: data.docs.map(d => {
                        getDoc(doc(foldersCollection, d.folderId)).then(dt => {
                            return {...dt.data(), id: dt.id}
                        })
                    })}
                })
            }).catch(err => {
                console.error(err)
                dispatch({
                    type: ACTIONS.SET_BOOKMARK_FILES,
                    payload: { folderBookmarks: [] }
                })
            })
        }

        return () => cleanup()
    }, [user])

    return state
}

function reducer(state, action) {
    switch (action.type) {
        case ACTIONS.SET_FRIENDS:
            return {
                ...state,
                friends: action.payload.friends
            }
        case ACTIONS.SET_PHOTO_URL:
            return {
                ...state,
                profileUrl: action.payload.profileUrl
            }
        case ACTIONS.SET_BOOKMARK_FILES:
            return {
                ...state,
                fileBookmarks: action.payload.fileBookmarks
            }
        case ACTIONS.SET_BOOKMARK_FOLDERS:
            return {
                ...state,
                folderBookmarks: action.payload.folderBookmarks
            }
        default:
            return state
    }
}