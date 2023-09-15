import React, { useState } from 'react';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from 'mdb-react-ui-kit';
import './Buy.css'
import { Radio,Input ,Checkbox } from 'antd';
const onChange = (e) => {
  console.log(`checked = ${e.target.checked}`);
};
export default function Buy() {
  const [fillActive, setFillActive] = useState('tab1');

  const handleFillClick = (value: string) => {
    if (value === fillActive) {
      return;
    }

    setFillActive(value);
  };

  return (
    <>
    {/* main */}
<div className="snipcss0-0-0-1 snipcss-nvTph">
  {/* main2 */}
  <div className="css-d00g6r snipcss0-1-1-2">
    {/* main3 */}
    <div className="teko-row css-q0e31u snipcss0-2-2-3 style-4Trly"
      id="style-4Trly">
        {/* main4 */}
      <div  className="teko-col teko-col-8 css-gr7r8o2 snipcss0-3-3-4 style-yXGc7"
        id="style-yXGc7">
          {/*  */}
          <div className="teko-card css-svl62k snipcss0-4-4-5">
          <div className="teko-card-body css-0 snipcss0-5-5-6">
          <MDBTabs fill className='mb-3-buy'>
        <MDBTabsItem  className='nav-tabs-buy'>
          <MDBTabsLink className='nav-link-buy' onClick={() => handleFillClick('tab1')} active={fillActive === 'tab1'}>
            Nhận hàng tại nhà
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem className='nav-tabs-buy'>
          <MDBTabsLink className='nav-link-buy' onClick={() => handleFillClick('tab2')} active={fillActive === 'tab2'}>
           Nhận hàng tại điểm
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={fillActive === 'tab1'}>
          <h7 >Thông tin nhận hàng</h7>
        <div
  className="teko-row teko-row-start css-1v9diph snipcss-f7MJM style-Aergz"
  id="style-Aergz"
>
  <div className="teko-col teko-col-6 css-gr7r8o style-bjeqp" id="style-bjeqp">
    <div
      data-content-region-name="shippingAddress"
      data-track-content="true"
      data-content-name="homeDelivery"
      data-content-index={0}
      data-content-target={79}
      className="css-1014eaz style-tofZn"
      id="style-tofZn"
    >
      <div>
        <span id="style-owhaV" className="style-owhaV">
          Nguyễn Đình minh
        </span>
        <div
          data-content-region-name="shippingAddress"
          data-track-content="true"
          data-content-name="editAddress"
          className="css-7kp13n"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            size={20}
            className="css-1e44j4b"
            color="#848788"
            height={20}
            width={20}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.4798 5.35373C14.968 4.86557 15.7594 4.86557 16.2476 5.35373L16.6919 5.79803C17.1801 6.28618 17.1801 7.07764 16.6919 7.56579L16.1819 8.07582L13.9698 5.86375L14.4798 5.35373ZM12.9092 6.92441L6.23644 13.5971L5.68342 16.3622L8.44851 15.8092L15.1212 9.13648L12.9092 6.92441ZM16.707 9.67199L9.3486 17.0304C9.24389 17.1351 9.11055 17.2065 8.96535 17.2355L4.87444 18.0537C4.62855 18.1029 4.37434 18.0259 4.19703 17.8486C4.01971 17.6713 3.94274 17.4171 3.99192 17.1712L4.8101 13.0803C4.83914 12.9351 4.91051 12.8017 5.01521 12.697L13.4192 4.29307C14.4931 3.21912 16.2343 3.21912 17.3083 4.29307L17.7526 4.73737C18.8265 5.81131 18.8265 7.55251 17.7526 8.62645L16.7174 9.66162C16.7157 9.66336 16.714 9.6651 16.7122 9.66683C16.7105 9.66856 16.7088 9.67028 16.707 9.67199ZM3.15918 20.5908C3.15918 20.1766 3.49497 19.8408 3.90918 19.8408H20.2728C20.687 19.8408 21.0228 20.1766 21.0228 20.5908C21.0228 21.005 20.687 21.3408 20.2728 21.3408H3.90918C3.49497 21.3408 3.15918 21.005 3.15918 20.5908Z"
              fill="#82869E"
            ></path>
          </svg>
        </div>
      </div>
      <div>0349551307</div>
      <div id="style-GqGe8" className="style-GqGe8">
        10, Phường 01, Quận 10, Thành phố Hồ Chí Minh
      </div>
      <div className="css-18wywdr"></div>
      <span className="css-mpv07g">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          size={20}
          className="css-1kpmq"
          color="#ffffff"
          height={20}
          width={20}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12.4545L9.375 17L19 7"
            stroke="#82869E"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </span>
    </div>
  </div>
  <div
    data-content-region-name="addressShipping"
    data-track-content="true"
    data-content-name="addNewAddress"
    className="teko-col teko-col-6 css-gr7r8o style-Jlvl6"
    id="style-Jlvl6"
  >
    <button
      height="100%"
      className="css-162xo41 style-kRCXj"
      type="button"
      id="style-kRCXj"
    >
      <svg
        fill="none"
        viewBox="0 0 24 24"
        size={25}
        className="css-1e44j4b"
        color="#848788"
        height={25}
        width={25}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.75 4C12.75 3.58579 12.4142 3.25 12 3.25C11.5858 3.25 11.25 3.58579 11.25 4V11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H11.25V20C11.25 20.4142 11.5858 20.75 12 20.75C12.4142 20.75 12.75 20.4142 12.75 20V12.75H20C20.4142 12.75 20.75 12.4142 20.75 12C20.75 11.5858 20.4142 11.25 20 11.25H12.75V4Z"
          fill="#82869E"
        ></path>
      </svg>
      Thêm địa chỉ
      <span id="style-EqcsP" className="style-EqcsP">
        <div className="css-157jl91"></div>
      </span>
    </button>
  </div>
</div>


        </MDBTabsPane>
        <MDBTabsPane show={fillActive === 'tab2'}>Tab 2 content</MDBTabsPane>
      </MDBTabsContent>
      <div className='radio'>
  <label>Phương thức giao hàng

  <Radio defaultChecked>Giao hàng tiêu chuẩn</Radio>
  </label>
      
</div>
<div className="css-18c0ysw snipcss0-4-4-52">
          <div type="subtitle" className="css-1realo9 snipcss0-5-52-53">
           Nhập Mã Online, hóa đơn qua Email
          </div>
          <div className="css-boqvfl snipcss0-5-52-54">
            <div
              className="input-container css-icxbs1 snipcss0-6-54-55"
              height={40}
            >
              <Input type="text" maxLength={255} placeholder="Email" />
            </div>
          </div>
        </div>
          </div>
        
        </div>
        {/*  */}


          {/*  */}

          <div className="css-18c0ysw snipcss0-4-4-52">
          <div type="subtitle" className="css-1realo9 snipcss0-5-52-53">
          Ghi chú cho đơn hàng
          </div>
          <div className="css-boqvfl snipcss0-5-52-54">
            <div
              className="input-container css-icxbs1 snipcss0-6-54-55"
              height={40}
            >
              <Input type="text" maxLength={255} placeholder="Ghi chú" />
            </div>
          </div>
        </div>
        <div className="teko-card css-t9nop0 snipcss0-4-4-57">
          <div className="teko-card-header css-0 snipcss0-5-57-58">
            <div className="snipcss0-6-58-59">
              <div type="title" className="css-1p6ero0 snipcss0-7-59-60">
                Phương thức thanh toán
              </div>
              <div
                type="body"
                color="textSecondary"
                className="css-kgtmqg snipcss0-7-59-61"
              >
                Thông tin thanh toán của bạn sẽ luôn được bảo mật
              </div>
            </div>
          </div>
          <div className="teko-card-body css-0 snipcss0-5-57-62">
            <div
              className="teko-row teko-row-start css-80kmv8 snipcss0-6-62-63 style-RRpB6"
              id="style-RRpB6"
            >
              <div
                className="teko-col teko-col-6 css-gr7r8o2 snipcss0-7-63-64 style-CCmWU"
                id="style-CCmWU"
              >
                <div
                  data-content-region-name="paymentMethod"
                  data-track-content="true"
                  data-content-name="VNPAY_GATEWAY"
                  data-content-target="VNPAY_GATEWAY"
                  className="css-1014eaz snipcss0-8-64-65 style-OdjZ8"
                  id="style-OdjZ8"
                >
                  <div type="subtitle" className="css-qat15y snipcss0-9-65-66">
                    Thanh toán VNPAY-QR
                    <span
                      className="snipcss0-10-66-67 style-9jvjF"
                      id="style-9jvjF"
                    >
                      <span className="css-1fh7f3v snipcss0-11-67-68">
                        <div
                          type="caption"
                          color="white"
                          className="css-7496ip snipcss0-12-68-69"
                        >
                          Khuyên dùng
                        </div>
                      </span>
                    </span>
                  </div>
                  <div
                    type="body"
                    color="textSecondary"
                    className="css-ngriz3 snipcss0-9-65-70"
                  >
                    Thanh toán qua Internet Banking, Visa, Master, JCB, VNPAY-QR
                  </div>
                  <div
                    type="body"
                    className="css-9o8e5m snipcss0-9-65-71"
                  ></div>
                  <div className="css-18wywdr snipcss0-9-65-72"></div>
                  <span className="css-mpv07g snipcss0-9-65-73">
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      size={20}
                      className="css-1kpmq snipcss0-10-73-74"
                      color="#ffffff"
                      height={20}
                      width={20}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12.4545L9.375 17L19 7"
                        stroke="#82869E"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </span>
                </div>
              </div>
              <div
                className="teko-col teko-col-6 css-gr7r8o2 snipcss0-7-63-75 style-keAdr"
                id="style-keAdr"
              >
                <div
                  data-content-region-name="paymentMethod"
                  data-track-content="true"
                  data-content-name="COD"
                  data-content-target="COD"
                  className="css-64rk53 snipcss0-8-75-76 style-UMMoQ"
                  id="style-UMMoQ"
                >
                  <div type="subtitle" className="css-qat15y snipcss0-9-76-77">
                    Thanh toán khi nhận hàng
                    <span
                      className="snipcss0-10-77-78 style-NANX3"
                      id="style-NANX3"
                    ></span>
                  </div>
                  <div
                    type="body"
                    color="textSecondary"
                    className="css-ngriz3 snipcss0-9-76-79"
                  ></div>
                  <div
                    type="body"
                    className="css-9o8e5m snipcss0-9-76-80"
                  ></div>
                </div>
              </div>
              <div
                className="teko-col teko-col-6 css-gr7r8o2 snipcss0-7-63-81 style-poooX"
                id="style-poooX"
              >
                <div
                  data-content-region-name="paymentMethod"
                  data-track-content="true"
                  data-content-name="ZALOPAY_GATEWAY"
                  data-content-target="ZALOPAY_GATEWAY"
                  className="css-64rk53 snipcss0-8-81-82 style-OQooy"
                  id="style-OQooy"
                >
                  <div type="subtitle" className="css-qat15y snipcss0-9-82-83">
                    Thanh toán QR Code ZaloPay
                    <span
                      className="snipcss0-10-83-84 style-DJQy2"
                      id="style-DJQy2"
                    ></span>
                  </div>
                  <div
                    type="body"
                    color="textSecondary"
                    className="css-ngriz3 snipcss0-9-82-85"
                  >
                    Thanh toán QR Code ZaloPay
                  </div>
                  <div
                    type="body"
                    className="css-9o8e5m snipcss0-9-82-86"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="teko-row teko-row-start teko-row-middle css-1dmv21i snipcss0-4-4-87">
          <label className="check-box css-1arb6mh snipcss0-5-87-88">
            <Checkbox onChange={onChange}></Checkbox>
          </label>
          <div type="body" className="css-1os8pr0 snipcss0-5-87-93">
            Tôi muốn xuất hóa đơn 
          </div>
        </div>

        <div
          data-content-region-name="staffCode"
          data-track-content="true"
          data-content-name="referralCode"
          data-content-target="checkout"
          className="css-18c0ysw snipcss0-4-4-94"
        >
<div className="css-18c0ysw snipcss0-4-4-52">
          <div type="subtitle" className="css-1realo9 snipcss0-5-52-53">
           Nhập mã nhân viên tư vấn
          </div>
          <div className="css-boqvfl snipcss0-5-52-54">
            <div
              className="input-container css-icxbs1 snipcss0-6-54-55"
              height={40}
            >
              <Input type="text" maxLength={255} placeholder="Đây là mã giới thiệu không có tác dụng cho đơn hàng" />
            </div>
          </div>
        </div>
        </div>
      </div>
      <div
        className="teko-col teko-col-4 css-gr7r8o2 tether-target-attached-top snipcss0-3-3-99 tether-element-attached-top tether-element-attached-center tether-target-attached-center style-FJLy3"
        id="style-FJLy3"
      >
        <div className="css-14xqo9c snipcss0-0-0-1 tether-target-attached-top snipcss0-4-99-100 tether-element-attached-top tether-element-attached-center tether-target-attached-center">
          <div className="card-header css-0 snipcss0-1-1-2 snipcss0-5-100-101">
            <div className="css-1euuut5 snipcss0-2-2-3 snipcss0-6-101-102">
              <h5 className="snipcss0-3-3-4 snipcss0-7-102-103">
                Thông tin đơn hàng
              </h5>
              <a href="/cart" className="snipcss0-3-3-5 snipcss0-7-102-104">
                Chỉnh sửa
              </a>
            </div>
          </div>
          <div className="card-body css-0 snipcss0-1-1-6 snipcss0-5-100-105">
            <div className="css-9op68y snipcss0-2-6-7 snipcss0-6-105-106">
              <div className="css-ov1ktg snipcss0-3-7-8 snipcss0-7-106-107">
                <div className="snipcss0-4-8-9 snipcss0-8-107-108">
                  <div
                    height={80}
                    width={80}
                    className="css-17nqxzh snipcss0-5-9-10 snipcss0-9-108-109"
                  >
                    <picture className="snipcss0-6-10-11 snipcss0-10-109-110">
                      <img
                        className="lazyload css-jdz5ak snipcss0-7-11-14 snipcss0-11-110-113"
                        alt="product"
                        src="https://lh3.googleusercontent.com/Jsg6-adZeI1TZnmeIT8Tpal63lIr4tLji5QjZaOWJjjXPY1blN5K9cG1MWkI7LesQj-8Xw80MVRBQwXWd9fs-kC03cyFCxo=rw"
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>
                </div>
                <div className="css-f0vs3e snipcss0-4-8-15 snipcss0-8-107-114">
                  <a
                    target="_blank"
                    href="/products/210901841"
                    aria-label="Image"
                    className="css-587jha snipcss0-5-15-16 snipcss0-9-114-115"
                  >
                    <div
                      type="body"
                      color="textPrimary"
                      className="css-l4bwcr snipcss0-6-16-17 snipcss0-10-115-116"
                    >
                      Máy tính xách tay/ Laptop Acer Nitro 5 Eagle AN515-57-54MV
                      (NH.QENSV.003) (i5-11400H) (Đen)
                    </div>
                  </a>
                  <div
                    type="caption"
                    color="textSecondary"
                    className="css-1qm2d75 snipcss0-5-15-18 snipcss0-9-114-117"
                  >
                    Số lượng 1
                  </div>
                  <span className="css-7ofbab snipcss0-5-15-19 snipcss0-9-114-118">
                    19.990.000
                    <span className="css-1ul6wk9 snipcss0-6-19-20 snipcss0-10-118-119">
                      đ
                    </span>
                  </span>
                  <div className="css-1vptl7o snipcss0-5-15-21 snipcss0-9-114-120">
                    <span className="css-p2smad snipcss0-6-21-22 snipcss0-10-120-121">
                      25.990.000
                      <span className="css-1ul6wk9 snipcss0-7-22-23 snipcss0-11-121-122">
                        đ
                      </span>
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="snipcss0-4-99-155">
          <div className="css-1pnc6ez snipcss0-5-155-156">
            <div className="teko-row teko-row-no-wrap teko-row-space-between css-1o3gs9x2 snipcss0-6-156-157">
              <div className="teko-col css-gr7r8o2 snipcss0-7-157-158">

                <label className="check-box css-1arb6mh snipcss0-8-158-159">
                  <Checkbox onChange={onChange}></Checkbox>              
                  <div
                    type="body"
                    className="checkbox-label css-10md8qb snipcss0-9-159-164 style-Aggjr"
                    id="style-Aggjr"
                  >             
                    <div
                      type="subtitle"
                      className="ellipsis css-1gcn5cj snipcss0-10-164-165"
                    >
                      Cài đặt miễn phí
                    </div>
                  </div>
                </label>
              </div>
              
            </div>
          </div>
        </div>
        <div className="snipcss0-4-99-168 style-orm2K" id="style-orm2K">
          <div className="css-1pnc6ez snipcss0-5-168-169">
            <div className="teko-row teko-row-no-wrap teko-row-space-between css-1o3gs9x2 snipcss0-6-169-170">
              <div className="teko-col css-gr7r8o2 snipcss0-7-170-171">

                <label className="check-box css-1arb6mh snipcss0-8-171-172">
                <Checkbox onChange={onChange}></Checkbox>   
                  <div
                    type="body"
                    className="checkbox-label css-10md8qb snipcss0-9-172-177 style-aUwfK"
                    id="style-aUwfK"
                  >
                    <div
                      type="subtitle"
                      className="ellipsis css-1gcn5cj snipcss0-10-177-178"
                    >
                      Hỗ trợ kỹ thuật miễn phí
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="css-cssveg snipcss0-4-99-181">
          <div className="css-27abj6 snipcss0-5-181-182">
            <div className="teko-card css-516rdm snipcss0-6-182-183">
              <div className="teko-card-body css-0 snipcss0-7-183-184">
                <div className="css-nouyrl snipcss0-8-184-185">
                  <table className="css-qc9cbn snipcss0-9-185-186">
                    <tbody className="snipcss0-10-186-187">
                      <tr className="snipcss0-11-187-188">
                        <td
                          color="#848788"
                          className="css-8ogxmh snipcss0-12-188-189"
                        >
                          <div className="css-99sejg snipcss0-13-189-190">
                            Tổng tạm tính &nbsp;
                            <div className="css-1777v snipcss0-14-190-191"></div>
                          </div>
                        </td>
                        <td
                          data-att-label="Tổng tạm tính"
                          className="css-1xrkmkn snipcss0-12-188-192"
                        >
                          19.990.000₫
                        </td>
                      </tr>
                      <tr className="snipcss0-11-187-193">
                        <td
                          color="#848788"
                          className="css-13izjcd snipcss0-12-193-194"
                        >
                          <div className="css-99sejg snipcss0-13-194-195">
                            Phí vận chuyển &nbsp;
                            <div className="css-1777v snipcss0-14-195-196"></div>
                          </div>
                        </td>
                        <td
                          data-att-label="Phí vận chuyển"
                          className="css-fsu5pb snipcss0-12-193-197"
                        >
                          Miễn phí
                        </td>
                      </tr>
                      <tr className="snipcss0-11-187-198">
                        <td
                          color="#848788"
                          className="css-13izjcd snipcss0-12-198-199"
                        >
                          Thành tiền
                        </td>
                        <td className="att-final-price css-aafp0n snipcss0-12-198-200">
                          19.990.000&nbsp;₫
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                </div>
              </div>
              <div className="teko-card-footer css-0 snipcss0-7-183-202">
                <div
                  data-content-region-name="bottomCheckOut"
                  data-track-content="true"
                  data-content-name="checkout"
                  className="css-0 snipcss0-8-202-203"
                >
                  <button className="att-checkout-button css-v463h2 snipcss0-9-203-204">
                    <div className="css-1lqe6yk snipcss0-10-204-205">
                      THANH TOÁN
                    </div>
                  </button>
                </div>
                <div className="css-12xhfzh snipcss0-8-202-206">
                  <p className="snipcss0-9-206-207">
                    Nhấn "Thanh toán" đồng nghĩa với việc bạn đọc và đồng ý tuân
                    theo
                    <a
                      href="https://help.phongvu.vn/chinh-sach-ban-hang/quyen-va-nghia-vu-cac-ben"
                      target="_blank"
                      className="snipcss0-10-207-208"
                    >
                      Điều khoản và Điều kiện
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="checkoutInlineRight snipcss0-4-99-209"></div>
      </div>
    </div>
  </div>
</div>

    </>
  );
}