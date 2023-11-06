import React, { useState, useEffect } from "react";
import "./HuongDanMuaHang.css"
function HuongDanMuaHang() {

    return (
        <div style={{ height: "1234px", width: "1000px", margin: '0 auto', backgroundColor: 'red', marginTop: '10px' }}>
            <div className="content">
                <div className="paragraph-wrapper">
                    <div className="paragraph">
                        <p className="a-high-quality-solut">
                            A HIGH-QUALITY SOLUTION FOR THOSE WHO WANT A BEAUTIFUL STARTUP WEBSITE QUICKLY.
                        </p>
                        <p className="learn-more-about-sta">
                            Learn more about Startup Framework in the light demo version. It has components from the full version, two
                            great samples and documenta-tion. We hope you will like this introduction to Startup Framework!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HuongDanMuaHang;
