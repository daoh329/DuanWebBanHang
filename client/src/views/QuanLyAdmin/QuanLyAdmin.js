import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Button, Modal, Form, Input } from 'antd';
import axios from 'axios';

const AdminPage = ({ users, deleteUserRedux, addUserRedux, updateUserRedux }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();
    const [ListUsers, setListUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const showModal = () => {
        setOpen(true);
    };


    const handleOk = async () => {
        if (selectedUser) {
            setConfirmLoading(true);
            try {
                await handleDeleteUser(selectedUser);
            } catch (error) {
                console.error('Delete user error:', error);
            } finally {
                setConfirmLoading(false);
                setOpen(false);
            }
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    useEffect(() => {
        async function fetchData() {
            try {
                let res = await axios.get('https://64df1e7171c3335b25821aef.mockapi.io/users');
                console.log('API Response:', res.data);
                setListUsers(res && res.data && res.data ? res.data : []);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchData();
    }, []);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'Giá', dataIndex: 'Price', key: 'Price' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <span>
                    <Button onClick={() => handleEditUser(record)}>Sửa</Button>
                    <Button
                        type="primary"
                        onClick={() => {
                            setSelectedUser(record); // Lưu user vào selectedUser
                            setOpen(true); // Mở modal
                        }}
                    >
                        Xóa
                    </Button>

                </span>
            ),
        },
    ];

    const handleAdd = () => {
        setSelectedUser(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };


    const handleDeleteUser = async (user) => {
        try {
            const response = await axios.delete(`https://64df1e7171c3335b25821aef.mockapi.io/users/${user.id}`);
            console.log('Delete user response:', response);

            deleteUserRedux(user.id);
            setListUsers(ListUsers.filter(item => item.id !== user.id));
        } catch (error) {
            console.error('Delete user error:', error);
        }
    };

    const handleModalOk = () => {
        form.validateFields().then((values) => {
            if (selectedUser) {
                const updatedUser = { ...selectedUser, ...values };
                handleSaveEditUser(updatedUser); // Đã gọi đúng hàm handleSaveEditUser và truyền dữ liệu đã chỉnh sửa vào đó
            } else {
                const newUser = { ...values, id: users.length + 1 };
                handleCreateUser(newUser);
            }
            form.resetFields();
            setIsModalVisible(false);
        });
    };

    const handleModalCancel = () => {
        form.resetFields();
        setIsModalVisible(false);
    };

    const handleCreateUser = async (newUser) => {
        try {
            const response = await axios.post('https://64df1e7171c3335b25821aef.mockapi.io/users', newUser);
            console.log('Create user response:', response);

            addUserRedux(response.data);
            setListUsers([...ListUsers, response.data]);
        } catch (error) {
            console.error('Create user error:', error);
        }
    };

    const handleSaveEditUser = async (editedUser) => {
        if (editedUser) {
            try {
                const response = await axios.put(`https://64df1e7171c3335b25821aef.mockapi.io/users/${editedUser.id}`, editedUser);
                console.log('Edit user response:', response);

                updateUserRedux(editedUser);
                setListUsers(ListUsers.map(user =>
                    user.id === editedUser.id ? editedUser : user
                ));
            } catch (error) {
                console.error('Edit user error:', error);
            }
        }
    };

    return (
        <div>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Add Sản Phẩm
            </Button>
            <Table dataSource={ListUsers} columns={columns} />

            <Modal
                title={selectedUser ? 'Edit User' : 'Add User'}
                visible={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter user name' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Price" name="Price" rules={[{ required: true, message: 'Please enter Price' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="avatar" name="avatar" rules={[{ required: true, message: 'Please enter avatar' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="Xác nhận xóa"
                visible={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
            >
                <p>Bạn chắc chắn muốn xóa ??</p>
            </Modal>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        users: state.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteUserRedux: (userId) => dispatch({ type: 'DELETE_USER', payload: userId }),
        addUserRedux: (newUser) => dispatch({ type: 'CREATE_USER', payload: newUser }),
        updateUserRedux: (updatedUser) => dispatch({ type: 'UPDATE_USER', payload: updatedUser }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
