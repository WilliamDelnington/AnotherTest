import React from 'react'
import { Nav, Navbar, NavbarBrand } from 'react-bootstrap'
import { Link } from 'react-router'
import { useAuth } from '../../Contexts/useContext'

export default function AppNavbar() {
  const { user } = useAuth()

  return (
    <Navbar bg="light" expanded="sm">
      <NavbarBrand as={Link} to={"/"}>
        Drive
      </NavbarBrand>
      {!user ? (
        <Nav>
          <Nav.Link as={Link} to={"/signIn"}>Sign In</Nav.Link>
          <Nav.Link as={Link} to={"/signUp"}>Sign Up</Nav.Link>
        </Nav>
      ) : (
        <Nav>
          <Nav.Link as={Link} to={"/profile"}>Profile</Nav.Link>
        </Nav>
      )}
      
    </Navbar>
  )
}
