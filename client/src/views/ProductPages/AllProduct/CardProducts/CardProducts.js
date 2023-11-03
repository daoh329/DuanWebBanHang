import React, { useEffect } from "react";

import { formatCurrency } from "../../../../util/FormatVnd";
import { format_sale } from "../../../../util/formatSale";

import { Divider, Space, Tag } from 'antd';

function CardProduct2(props) {
    const { item, onClick } = props;

    useEffect(() => {
        if (!item) return;
    });

    function handleViewDetail() {
        onClick(item);
    }

    return (
        <div type="grid" className="css-13w7uog" >
            <div
                className="product-cards css-35xksx"
                data-content-region-name="itemProductResult"
                data-track-content="true"
                // data-content-name={item.id}
                // data-content-index={index}
                data-content-target="productDetail"
            >
                <a
                    target="_self"
                    className="css-pxdb0j"
                    onClick={() => handleViewDetail(item)}
                >
                    <div className="css-4rhdrh">
                        <div className="css-1v97aik">
                            <div className="css-798fc">
                                <div height="100%" width="100%" className="css-1uzm8bv">
                                    <img
                                        loading="lazy"
                                        hover="zoom"
                                        decoding="async"
                                        src={process.env.REACT_APP_API_URL + item.thumbnail}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            position: "absolute",
                                            top: 0,
                                            left: 0
                                        }}
                                        alt={item.shortDescription}
                                    />
                                </div>
                            </div>
                            {/* tem */}
                            {item.remaining_quantity !== 0 && item.discount > 0 && item.price - item.discount > 0 ? (
                                <div className="css-14q2k9d">
                                    <div className="css-zb7zul">
                                        <div className="css-1bqeu8f">TIẾT KIỆM</div>
                                        <div className="css-1rdv2qd">
                                            {formatCurrency(item.price - item.discount)}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* brand */}
                        <div className="css-68cx5s">
                            <div
                                type="body"
                                color="textSecondary"
                                className="product-brand-name css-90n0z6"
                                style={{ display: "inline" }}
                            >
                                {item.brand}
                            </div>
                        </div>

                        {/* name */}
                        <div className="css-1ybkowq">
                            <div
                                type="caption"
                                className="att-product-card-title css-1uunp2d"
                                color="textPrimary"
                            >
                                <h3
                                    title={item.shortDescription}
                                    className="css-1xdyrhj"
                                >
                                    {item.shortDescription}
                                </h3>
                            </div>
                        </div>

                        {/* show giá */}
                        <div className="css-kgkvir">
                            {item.remaining_quantity === 0 ? (
                                <Tag color="red">Sản phẩm tạm hết</Tag>
                            ) : item.discount > 0 && item.price - item.discount > 0 ? (
                                <div className="css-1co26wt">
                                    {/* discount */}
                                    <div
                                        type="subtitle"
                                        className="att-product-detail-latest-price css-do31rh"
                                        color="primary500"
                                    >
                                         {formatCurrency(item.discount)}
                                    </div>
                                    <div className="css-3mjppt">
                                        {/* price */}

                                        <div
                                            type="caption"
                                            className="att-product-detail-retail-price css-18z00w6"
                                            color="textSecondary"
                                        >
                                            {formatCurrency(item.price)}
                                        </div>

                                        <div type="caption" color="primary500" className="css-2rwx6s">
                                        -{format_sale(item.price, item.discount)}
                                        </div>

                                    </div>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        color: "#1435c3",
                                        display: "-webkit-box",
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        width: "90px",
                                        lineHeight: "24px",
                                    }}
                                >
                                    {formatCurrency(item.price)}
                                </div>
                            )}
                        </div>
                        {/* <div direction="row" className="css-w8t278">
                            <div width={24} height={24} className="css-mtfgc8">
                                <div height="100%" width="100%" className="css-8tlony">
                                    <img
                                        src="https://lh3.googleusercontent.com/Py0IZbRdaIo7LaHZK3eblQBu-iPyWjPepxwWmwcDPgUw6z2oKksOybAsl0Twi0t4BusEcmAsFFMTBlSD7aLV=rw"
                                        loading="lazy"
                                        hover=""
                                        decoding="async"
                                        alt="Túi chống sốc Western (Quà tặng)"
                                        fetchpriority="low"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                            position: "absolute",
                                            top: 0,
                                            left: 0
                                        }}
                                    />
                                </div>
                            </div>
                        </div> */}
                    </div>
                </a>
            </div>
        </div>


    );
}

export default CardProduct2;
