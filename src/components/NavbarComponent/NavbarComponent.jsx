import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function NavbarComponent({ orgid }) {
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="sm"
        bg="primary"
        variant="dark"
        className="vw-100"
      >
        <Container fluid>
          <Navbar.Brand className="fs-2" href="#/home">
            Organization Station
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link className="mx-auto" href={`#/resources/${orgid}`}>
                Resources
              </Nav.Link>
              <Nav.Link className="mx-auto" href={`#/schedule/${orgid}`}>
                Schedule
              </Nav.Link>
              <Nav.Link className="mx-auto" href={`#/chat/${orgid}`}>
                Chat
              </Nav.Link>
              <Nav.Link
                className="mx-auto"
                href={`#/user/${orgid ? orgid : ""}`}
              >
                Profile
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default NavbarComponent;
