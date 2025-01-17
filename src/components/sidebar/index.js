import React from 'react'
import NewFile from './NewFile'
import SidebarItem from './SidebarItem'
import { faClock, faDesktop, faFile, faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-regular-svg-icons'

export default function SideBar() {
  return (
    <div className="sideBar">
        <NewFile />
        <div className="sideBar__itemContainer">
            <SidebarItem arrow icon={
                (<FontAwesomeIcon icon={faFile} />)
            } label={"Drive"}/>
            <SidebarItem arrow icon={
                (<FontAwesomeIcon icon={faDesktop} />)
            } label={"Computers"} />
            <SidebarItem icon={
                (<FontAwesomeIcon icon={faShare}/>)
            } label={"Shared with me"}/>
            <SidebarItem icon={
                (<FontAwesomeIcon icon={faClock} />)
            } label={"Recent"}/>
            <SidebarItem icon={
                (<FontAwesomeIcon icon={faStar}/>)
            } label={"Starred"}/>
            <SidebarItem icon={} />
            <hr />

        </div>
    </div>
  )
}
