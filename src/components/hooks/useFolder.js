import { useEffect, useReducer } from "react";
import { firestore } from "../../firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../Contexts/useContext";

const ACTIONS = {
    SELECT_FOLDER: "select-folder",
    UPDATE_FOLDER: "update-folder",
    SET_CHILD_FOLDERS: "set-child-folders",
    SET_CHILD_FILES: "set-child-files",
}

export const ROOT_FOLDER = {name: "root", id: null, path: []}

export function useFolder(userId, folderId = null, folder = null) {
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: [],
    })

    const { user } = useAuth()

    useEffect(() => {
        dispatch({
            type: ACTIONS.SELECT_FOLDER,
            payload: { folderId, folder }
        })
    }, [folderId, folder])

    useEffect(() => {
        if (folderId == null) {
            return dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        }

        const folderRef = collection(firestore, "folders")
        getDoc(doc(folderRef, folderId)).then(doc => {
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: {id: doc.id, ...doc.data()} }
            })
        }).catch(() => {
            dispatch({
                type: ACTIONS.UPDATE_FOLDER,
                payload: { folder: ROOT_FOLDER }
            })
        })
    }, [folderId])

    useEffect(() => {
        const folderCollection = collection(firestore, "folders")

        const cleanup = () => {
            const q = query(folderCollection,
                where("parentId", "==", folderId),
                where("userId", "==", userId)
            )

            getDocs(q).then(data => {
                if (user) {
                    const checkAllBookmarks = data.docs.map(async (d) => {
                        const bookmarkDoc = doc(firestore, "folderBookmarks", d.id)

                        try {
                            const docSnapshot = await getDoc(bookmarkDoc)

                            return {...d.data(), id: d.id, isBookmarked: docSnapshot.exists()}
                        } catch (e) {
                            console.error(e)

                            return {...d.data(), id: d.id, isBookmarked: false}
                        }
                    })

                    Promise.all(checkAllBookmarks).then(data => {
                        console.log(data)
                        dispatch({
                            type: ACTIONS.SET_CHILD_FOLDERS,
                            payload: { childFolders: data }
                        })
                    }).catch((e) => {
                        console.error(e)
                        dispatch({ 
                            type: ACTIONS.SET_CHILD_FOLDERS,
                            payload: { childFolders: [] }
                        })
                    })
                }
                else {
                    dispatch({
                        type: ACTIONS.SET_CHILD_FOLDERS,
                        payload: { childFolders: data.docs.map(d => {
                            return {...d.data(), id: d.id}
                        })}
                    })
                }
            })
        }
        
        return () => cleanup()
    }, [folderId, userId, user])

    useEffect(() => {
        const fileCollection = collection(firestore, "files")

        const cleanup = () => {
            const q = query(fileCollection, 
                where("folderId", "==", folderId),
                where("userId", "==", userId)
            )

            getDocs(q).then(data => {
                if (user) {
                    const checkAllBookmarks = data.docs.map(async (d) => {
                        const bookmarkDoc = doc(firestore, "fileBookmarks", d.id)

                        try {
                            const docSnapshot = await getDoc(bookmarkDoc)

                            return {...d.data(), id: d.id, isBookmarked: docSnapshot.exists()}
                        } catch (e) {
                            console.error(e)

                            return {...d.data(), id: d.id, isBookmarked: false}
                        }
                    })
                    
                    Promise.all(checkAllBookmarks).then(data => {
                        console.log(data)
                        dispatch({
                            type: ACTIONS.SET_CHILD_FILES,
                            payload: { childFiles: data }
                        })
                    }).catch((e) => {
                        console.error(e)
                        dispatch({ 
                            type: ACTIONS.SET_CHILD_FILES,
                            payload: { childFiles: [] }
                        })
                    })
                }
                else {
                    dispatch({
                        type: ACTIONS.SET_CHILD_FILES,
                        payload: { childFiles: data.docs.map(d => {
                            return {...d.data(), id: d.id}
                        })}
                    })
                }
            })
        }

        return () => cleanup()
    }, [folderId, userId, user])

    return state
}

function reducer(state, {type, payload}) {
    switch (type) {
        case ACTIONS.SELECT_FOLDER:
            return {
                folderId: payload.folderId,
                folder: payload.folder,
                childFiles: [],
                childFolders: []
            }
        case ACTIONS.UPDATE_FOLDER:
            return {
                ...state,
                folder: payload.folder,
            }
        case ACTIONS.SET_CHILD_FOLDERS:
            return {
                ...state,
                childFolders: payload.childFolders,
            }
        case ACTIONS.SET_CHILD_FILES:
            return {
                ...state,
                childFiles: payload.childFiles,
            }
        default:
            return state
    }
}