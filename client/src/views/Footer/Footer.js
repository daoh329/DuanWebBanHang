import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
function Footer() {
    return (
        <div style={{marginTop:'20px'}}> 
        <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
            <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
                <div className='me-5 d-none d-lg-block'>
                    <span></span>
                </div>

                <div>
                    <a href='' className='me-4 text-reset'>
                        <MDBIcon color='secondary' fab icon='facebook-f' />
                    </a>
                    <a href='' className='me-4 text-reset'>
                        <MDBIcon color='secondary' fab icon='twitter' />
                    </a>
                    <a href='' className='me-4 text-reset'>
                        <MDBIcon color='secondary' fab icon='google' />
                    </a>
                    <a href='' className='me-4 text-reset'>
                        <MDBIcon color='secondary' fab icon='instagram' />
                    </a>
                    <a href='' className='me-4 text-reset'>
                        <MDBIcon color='secondary' fab icon='linkedin' />
                    </a>
                    <a href='' className='me-4 text-reset'>
                        <MDBIcon color='secondary' fab icon='github' />
                    </a>
                </div>
            </section>

            <section className=''>
                <MDBContainer className='text-center text-md-start mt-5'>
                    <MDBRow className='mt-3'>
                        <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>
                                <MDBIcon color='secondary' icon='gem' className='me-3' />
                                Shop Dinh Minh
                            </h6>
                            <p style={{ color: '#333333' }}>
                            Địa chỉ: 200 Hà Huy Tập, Phường Tân Lợi, Tp. Buôn Ma Thuột, Tỉnh Đắk Lắk
                            </p>
                        </MDBCol>

                        <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Hỗ trợ khách hàng</h6>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Hướng dẫn mua hàng trực tuyến.
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Hướng dẫn thanh toán.
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Gửi yêu cầu bảo hành.
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Góp ý, khiếu nại!
                                </a>
                            </p>
                        </MDBCol>

                        <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Chính sách mua hàng.</h6>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Điều kiện giao dịch chung.
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Chính sách bảo hành.
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Chính sách đổi trả.
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Chính sách thanh toán.
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Giao hàng và lắp đặt tại nhà.
                                </a>
                            </p>
                            <p>
                                <a href='#!' className='text-reset'>
                                    Dịch vụ nâng cấp PC, Laptop.
                                </a>
                            </p>
                        </MDBCol>

                        <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Liên Hệ</h6>
                            <p>
                                <MDBIcon color='secondary' icon='home' className='me-2' />
                                200 Hà Huy Tập, Tân Lợi, Tp. BMT.
                            </p>
                            <p>
                                <MDBIcon color='secondary' icon='envelope' className='me-3' />
                                info@example.com
                            </p>
                            <p>
                                <MDBIcon color='secondary' icon='phone' className='me-3' /> + 01 234 567 88
                            </p>
                            <p>
                                <MDBIcon color='secondary' icon='print' className='me-3' /> + 01 234 567 89
                            </p>
                        </MDBCol>
                    </MDBRow>
                    <MDBContainer className='p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05' }}>
                        <MDBRow>
                            <MDBCol lg='6' md='12' className='mb-4 mb-md-0'>
                                <h6 className='text-uppercase'>CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ Đình Minh</h6>

                                <p style={{ color: '#757575' }}>
                                    © - Công Ty Cổ Phần Thương Mại - Dịch Vụ Đình Minh
                                   
                                </p>
                            </MDBCol>

                            <MDBCol lg='6' md='12' className='mb-4 mb-md-0'>
                                <h6 className='text-uppercase'>Địa chỉ trụ sở chính:</h6>

                                <p style={{ color: '#757575' }}>
                                    Địa chỉ: 200 Hà Huy Tập, Phường Tân Lợi, Tp. Buôn Ma Thuột, Tỉnh Đắk Lắk
                                </p>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </MDBContainer>
            </section>

            <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
            ©Copyright 2023: - 
                <a className='text-reset fw-bold' href='https://takatech.com.vn/'>
                 by TakaTech
                </a>
            </div>
        </MDBFooter>
        </div>
    );
}

export default Footer;