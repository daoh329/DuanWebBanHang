import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && (
        <div style={{ marginTop: "20px" }}>
          <MDBFooter
            bgColor="light"
            className="text-center text-lg-start text-muted"
          >
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
              <div className="me-5 d-none d-lg-block">
                <span></span>
              </div>

              <div>
                <a
                  href="https://www.facebook.com/profile.php?id=61552136980563&mibextid=ZbWKwL"
                  className="me-4 text-reset"
                >
                  <MDBIcon color="secondary" fab icon="facebook-f" />
                </a>
                <a
                  href="https://twitter.com/fpl_tn_minh"
                  className="me-4 text-reset"
                >
                  <MDBIcon color="secondary" fab icon="twitter" />
                </a>
                {/* <a href="" className="me-4 text-reset">
                <MDBIcon color="secondary" fab icon="google" />
              </a> */}
                <a
                  href="https://www.instagram.com/minhnguyen.2032/"
                  className="me-4 text-reset"
                >
                  <MDBIcon color="secondary" fab icon="instagram" />
                </a>
                {/* <a href="" className="me-4 text-reset">
                <MDBIcon color="secondary" fab icon="linkedin" />
              </a> */}
                <a
                  href="https://github.com/MinhPK02434"
                  className="me-4 text-reset"
                >
                  <MDBIcon color="secondary" fab icon="github" />
                </a>
              </div>
            </section>

            <section className="">
              <MDBContainer className="text-center text-md-start mt-5">
                <MDBRow className="mt-3">
                  <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">
                      <MDBIcon color="secondary" icon="gem" className="me-3" />
                      Shop Dinh Minh
                    </h6>
                    <p style={{ color: "#333333" }}>
                      Địa chỉ: 200 Hà Huy Tập, Phường Tân Lợi, Tp. Buôn Ma
                      Thuột, Tỉnh Đắk Lắk
                    </p>
                  </MDBCol>

                  <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">
                      Hỗ trợ - dịch vụ
                    </h6>
                    <p>
                      <a
                        href="/huong-dan-mua-hang"
                        className="text-reset"
                        rel="noopener noreferrer"
                      >
                        Hướng dẫn mua hàng
                      </a>
                    </p>

                    <p>
                      <a href="/tra-cuu-don-hang" className="text-reset">
                        Tra cứu đơn hàng
                      </a>
                    </p>
                    <p>
                      <a href="/giai-quyet-khieu-nai" className="text-reset">
                        Chính sách giải quyết khiếu nại
                      </a>
                    </p>
                  </MDBCol>

                  <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">
                      Chính sách mua hàng.
                    </h6>
                    <p>
                      <a href="/chinh-sach-bao-hanh" className="text-reset">
                        Chính sách bảo hành.
                      </a>
                    </p>
                    <p>
                      <a href="/chinh-sach-doi-tra" className="text-reset">
                        Chính sách đổi trả.
                      </a>
                    </p>
                    <p>
                      <a href="/chinh-sach-thanh-toan" className="text-reset">
                        Chính sách thanh toán.
                      </a>
                    </p>
                  </MDBCol>

                  <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
                    <h6 className="text-uppercase fw-bold mb-4">Liên Hệ</h6>
                    <p>
                      <MDBIcon color="secondary" icon="home" className="me-2" />
                      300/6 Hà Huy Tập, Tân An, Tp. BMT.
                    </p>
                    <p>
                      <MDBIcon
                        color="secondary"
                        icon="envelope"
                        className="me-3"
                      />
                      dinhminhshop@gmail.com
                    </p>
                    <p>
                      <MDBIcon
                        color="secondary"
                        icon="phone"
                        className="me-3"
                      />{" "}
                      + 01 234 567 88
                    </p>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </section>

            {/*  */}
            <div
              style={{ width: "100%", backgroundColor: "rgba(0, 0, 0, 0.05)" }}
            >
              <MDBContainer className="p-4">
                <MDBRow>
                  <MDBCol lg="6" md="12" className="mb-4 mb-md-0">
                    <h6 className="text-uppercase">
                      CÔNG TY CỔ PHẦN THƯƠNG MẠI - DỊCH VỤ Đình Minh
                    </h6>

                    <p style={{ color: "#757575" }}>
                      © - Công Ty Cổ Phần Thương Mại - Dịch Vụ Đình Minh
                    </p>
                  </MDBCol>

                  <MDBCol lg="6" md="12" className="mb-4 mb-md-0">
                    <h6 className="text-uppercase">Địa chỉ trụ sở chính:</h6>

                    <p style={{ color: "#757575" }}>
                      Địa chỉ: 300/6 Hà Huy Tập, Tổ dân phố 8, Phường Tân An,
                      Buon Ma Thuot, Vietnam
                    </p>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </div>

            <div
              className="text-center p-4"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
            >
              ©Copyright 2023: -<a className="text-reset fw-bold">by DATN</a>
            </div>
          </MDBFooter>
        </div>
      )}
    </>
  );
}

export default Footer;
