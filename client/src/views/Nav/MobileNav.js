import React from "react";

import './MobileNav.css'
const MobileNav = () => {

    return (
        <>
            <nav className="mobile-nav">
                <a href="/" className="nav-item is-active" active-color="orange">
                    <i class="fa fa-house"></i>
                </a>
                <a href="#" className="nav-item" active-color="#0d6efd">
                    <i class="fa-brands fa-microsoft"></i>
                </a>
                <a href="/cart" className="nav-item" active-color="blue">
                    <i class="fa-solid fa-cart-shopping"></i>
                </a>
                <a href="#" className="nav-item" active-color="red">
                    <i class="fa-solid fa-bell"></i>
                </a>
                <a href="/profile" className="nav-item" active-color="rebeccapurple">
                    <i class="fa-solid fa-user"></i>
                </a>
                <span className="nav-indicator"></span>
            </nav>
            {/* <nav className="mobile-nav">
                <a href="#" className="bloc-icon">
                    <i class="fa fa-house"></i>
                </a>
                <a href="#" className="bloc-icon">
                    <i class="fa-brands fa-microsoft"></i>
                </a>
                <a href="#" className="bloc-icon">
                    <i class="fa-solid fa-cart-shopping"></i>
                </a>
                <a href="#" className="bloc-icon">
                    <i class="fa-solid fa-bell"></i>
                </a>
                <a href="#" className="bloc-icon">
                    <i class="fa-solid fa-user"></i>
                </a>
            </nav> */}

        </>
    )
}
export default MobileNav;