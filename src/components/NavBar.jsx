import React from 'react';
import CartWidget from './CartWidget';
import './NavBar.css'; 

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/">MiTienda</a>
      </div>
      <ul className="nav-links">
        <li><a href="/home">Inicio</a></li>
        <li><a href="/shop">Tienda</a></li>
        <li><a href="/contact">Contacto</a></li>
      </ul>
      <CartWidget />
    </nav>
  );
}

export default NavBar;