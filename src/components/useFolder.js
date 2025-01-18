import { ref } from "firebase/storage";
import { useEffect, useReducer } from "react";
import { auth, firestore } from "../firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

const ACTIONS = {
    SELECT_FOLDER: "select-folder",
    UPDATE_FOLDER: "update-folder",
    SET_CHILD_FOLDERS: "select-child-folders",
}

export const ROOT_FOLDER = {name: "root", id: null, path: []}

const user = auth.currentUser

export function useFolder(folderId = null, folder = null) {
    const [state, dispatch] = useReducer(reducer, {
        folderId,
        folder,
        childFolders: [],
        childFiles: [],
    })

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
        const folderRef = collection(firestore, "folders")

        const cleanup = () => {
            console.log(user)
            if (user != null) {
                const q = query(folderRef,
                    where("parentId", "==", folderId),
                    where("userId", "==", user.uid)
                )

                getDocs(q).then(data => {
                    dispatch({
                        type: ACTIONS.SET_CHILD_FOLDERS,
                        payload: { childFolders: data.docs.map(d => {
                            return {...d.data(), id: d.id}
                        })}
                    })
                })
            }
        }
        
        return () => cleanup()
    }, [folder, user])

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
                folder: payload.folder
            }
        case ACTIONS.SET_CHILD_FOLDERS:
            return {
                ...state,
                childFolders: payload.childFolders
            }
        default:
            return state
    }
}