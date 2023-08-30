import React, { useState, useEffect } from 'react';
import { Layout, Menu, Input, Badge, Avatar, Dropdown, Affix, Button, Popover, List, } from 'antd';
import { DownOutlined, BellOutlined, ShoppingCartOutlined, UserOutlined, SearchOutlined, TagOutlined, EnvironmentOutlined, CommentOutlined, PhoneOutlined, DeleteOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Hinh from '../../../src/assets/logo1.png';
import { useCart } from '../Cart/CartContext';
const { Header } = Layout;


const App = () => {
    const [menuOpenKeys, setMenuOpenKeys] = useState([]);

    const handleMenuOpenChange = (openKeys) => {
        setMenuOpenKeys(openKeys);
    };
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const { cartItems, removeFromCart } = useCart();

    // phone
    const [phone, setPhone] = useState('');
    const handleConfirm = async () => {
        // Lưu giá trị phone vào session
        window.sessionStorage.setItem('phone', phone);
        navigate(`/orderHistory/${phone}`);
    }
    //------giỏ hàng---------------


    useEffect(() => {
        // Tải dữ liệu từ API khi component được render
        fetch('https://64df1e7171c3335b25821aef.mockapi.io/users')
            .then(response => response.json())
            .then(data => {
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        // Lọc sản phẩm dựa trên từ khóa tìm kiếm
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchQuery, products]);
    console.log(">>>", searchQuery)
    const handleSearch = value => {
        setSearchQuery(value);
        navigate(`/search?query=${encodeURIComponent(value)}`);
    };
    const menu = (
        <Menu>
            <Menu.Item key="1">
                <NavLink to="/login">Đăng nhập</NavLink> {/* Link to login page */}
            </Menu.Item>
            <Menu.Item key="2">
                <NavLink to="/logout">Đăng xuất</NavLink> {/* Link to logout page */}
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Affix offsetTop={0}>
                <div className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f8fc', margintop: '0px' }}>

                    <a
                        href="/sale"
                        style={{
                            marginRight: '20px',
                            color: '#333',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <TagOutlined style={{ marginRight: '8px' }} />
                        Khuyến mãi
                    </a>
                    <a href='/showroom' style={{ marginRight: '20px', color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><EnvironmentOutlined style={{ marginRight: '8px' }} /> Hệ thống showroom</a>
                    <a href='/support' style={{ marginRight: '20px', color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><CommentOutlined style={{ marginRight: '8px' }} /> Tư vẫn doanh nghiệp</a>
                    <a href='/host' style={{ marginRight: '20px', color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><PhoneOutlined style={{ marginRight: '8px' }} /> Liên hệ</a>

                </div>

                <Header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'black' }}>
                    <div className="logo" style={{ width: '80px', marginRight: '16px', color: '#ffffff' }}>
                        {/* Add your logo here */}
                        <span style={{ position: 'relative', }}>  <NavLink to="/">

                            <img src={Hinh} style={{ width: '100%', height: '100%' }}></img></NavLink></span>
                    </div>

                    <div className="right-icons" style={{ display: 'flex', alignItems: 'center' }}>
                        <Badge count={5} style={{ marginTop: '10px', marginRight: '10px', backgroundColor: '#f50', color: '#fff' }}>
                            <BellOutlined style={{ fontSize: '24px', color: '#ffffff', margin: '10px' }} />
                        </Badge>
                        <Popover
                            content={
                                <div style={{  width: '300px', maxHeight: '200px', overflowY: 'auto', scrollbarWidth: 'none'}}>
                                    <List                                   
                                        itemLayout="horizontal"
                                        dataSource={cartItems}
                                        

                                        renderItem={item => (
                                            <List.Item
                                                actions={[
                                                    <Button type="danger" icon={<DeleteOutlined />} onClick={() => removeFromCart(item.id)}>                                                   
                                                    </Button>,
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={<Avatar src={item.avatar} />}
                                                    title={item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name}
                                                    description={`Giá: ${item.Price} ₫`}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                    <Button type="primary" style={{ width: '100%', marginTop: '10px' }}>
                                        <NavLink to="/cart">Xem giỏ hàng</NavLink>
                                    </Button>
                                </div>
                            }
                            title="Giỏ hàng"
                            trigger="hover"
                        >
                            <Badge count={cartItems.length} style={{ marginRight: '10px', marginTop: '10px' }}>
                                <ShoppingCartOutlined style={{ fontSize: '24px', color: '#ffffff', margin: '10px' }} />
                            </Badge>
                        </Popover>

                        <Dropdown overlay={menu}>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#005c42', margin: '10px' }} />
                        </Dropdown>
                    </div>

                    <div className="search-container" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <Input.Search placeholder="Tìm kiếm" style={{ width: '100%', color: '#ffffff', marginRight: 50 }} onSearch={handleSearch} />
                    </div>
                    {/* <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        openKeys={menuOpenKeys}
                        onOpenChange={handleMenuOpenChange}
                        style={{ width: '120px', }}
                    >
                        <Menu.SubMenu
                            key="sub1"
                            icon={<DownOutlined />}
                            title={<span>Danh mục</span>}
                            popupClassName="white-menu"
                            style={{ background: "black" }}
                        >
                            <Menu.Item key="1">Danh mục 1</Menu.Item>
                            <Menu.Item key="2">Danh mục 2</Menu.Item>
                            <Menu.Item key="3">Danh mục 3</Menu.Item>
                            <Menu.Item key="4">Danh mục 4</Menu.Item>
                        </Menu.SubMenu>
                    </Menu> */}
                </Header>
            </Affix >
        </Layout >
    );
};

export default App;
