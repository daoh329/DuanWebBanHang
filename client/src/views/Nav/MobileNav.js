import React from "react";
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FolderIcon from '@mui/icons-material/Folder';
import RestoreIcon from '@mui/icons-material/Restore';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Person2RoundedIcon from '@mui/icons-material/Person2Rounded';
import { Link } from 'react-router-dom';
import './MobileNav.css'
const MobileNav = () => {
    const [value, setValue] = React.useState('recents');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <nav className="mobile-nav">
                {/* <a href="/" className="nav-item is-active" active-color="orange">
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
                <span className="nav-indicator"></span> */}
                <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>
                    <BottomNavigationAction
                        component={Link}
                        to="/"
                        label="Home"
                        value="home"
                        icon={<HomeRoundedIcon />}
                    />
                    <BottomNavigationAction
                        component={Link}
                        to="/noi-dung"
                        label="Category"
                        value="Category"
                        style={{ fontSize: '10px' }}
                        icon={<GridViewRoundedIcon />}
                    />
                    <BottomNavigationAction
                        component={Link}
                        to="/cart"
                        label="Cart"
                        value="Cart"
                        icon={<LocalMallRoundedIcon />}
                    />
                    <BottomNavigationAction
                        component={Link}
                        to="/thongbao"
                        label="notify"
                        value="notify"
                        icon={<NotificationsRoundedIcon />}
                    />
                    <BottomNavigationAction
                        component={Link}
                        to="/profile"
                        label="Profile"
                        value="Profile"
                        icon={<Person2RoundedIcon />}
                    /> 
                   
                </BottomNavigation>
            </nav>

        </>
    )
}
export default MobileNav;