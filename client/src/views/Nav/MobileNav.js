import React from "react";

import './MobileNav.css'
const MobileNav = () => {

    return (
        <>
            <nav className="mobile-nav">
                <a href="/" className="nav-item is-active" active-color="orange">
                    <i className="fa fa-house"></i>
                </a>
                <a href="/noi-dung" className="nav-item" active-color="#0d6efd">
                    <i className="fa-brands fa-microsoft"></i>
                </a>
                <a href="/cart" className="nav-item" active-color="blue">
                    <i className="fa-solid fa-cart-shopping"></i>
                </a>
                <a href="#" className="nav-item" active-color="red">
                    <i className="fa-solid fa-bell"></i>
                </a>
                <a href="/profile" className="nav-item" active-color="rebeccapurple">
                    <i className="fa-solid fa-user"></i>
                </a>
                <span className="nav-indicator"></span>
            </nav>

        </>
    )
}
export default MobileNav;