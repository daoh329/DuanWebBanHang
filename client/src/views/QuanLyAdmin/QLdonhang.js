import React, { useState, useEffect } from "react";
import axios from "axios";

function OrderList() {
    const [orderList, setOrderList] = useState([]);

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //              let res = await axios.get("http://localhost:3000/order/json");
    //             console.log('API Response:', res.data);
    //             setOrderList(res && res.data && res.data ? res.data : []);
    //         } catch (error) {
    //             console.error("Error fetching order data:", error);
    //         }
    //     }
    //     fetchData();
    // }, []);

    axios
      .get('"http://localhost:3000/order/json', )
      .then(response => {
        const result = response.data;

        if (response.status === 200) {
            console.log("data:>>",result)
        }
      })
      .catch(error => {
        console.error('Error:', error);
       
      });
  
    return (
        <div>
            <h1>Order List</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {orderList.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.name}</td>
                            <td>{order.price}</td>
                            <td>{order.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderList;
