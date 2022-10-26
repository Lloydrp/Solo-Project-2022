import React from "react";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavbarComponent({ orgid }) {
  const user = useSelector((store) => store.user);

  return (
    <>
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand href="#/home">Organization Station</Navbar.Brand>
          {!user.id && (
            <Nav className="ms-auto">
              <Nav.Link href="#/login">Login/Register</Nav.Link>
            </Nav>
          )}
          {/* If a user is logged in, show these links */}
          {user.id && (
            <Nav className="ms-auto">
              <Nav.Link href={`#/resources/${orgid}`}>Resources</Nav.Link>
              <Nav.Link href={`#/schedule/${orgid}`}>Schedule</Nav.Link>
              <Nav.Link href={`#/chat/${orgid}`}>Chat</Nav.Link>
              <Nav.Link href={`#/user/${orgid ? orgid : ""}`}>Profile</Nav.Link>
            </Nav>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
