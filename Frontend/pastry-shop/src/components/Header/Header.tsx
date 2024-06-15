import React from 'react';


import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


import './Header.css';


const Header = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary"  style={{backgroundColor: "#FFDFBA"}}> 
      <Container>
        <Navbar.Brand href="/">Pastry Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/office">Office</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
