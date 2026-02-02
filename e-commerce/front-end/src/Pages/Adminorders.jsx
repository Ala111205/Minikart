import { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from "aos";
import "aos/dist/aos.css";

export default function AdminOrders({baseURL}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("adminToken");
        const adminData = JSON.parse(localStorage.getItem("adminData"));

        const url =
          adminData.role === "admin"
            ? `${baseURL}/api/orders/admin/orders`
            : `${baseURL}/api/orders/my-orders`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);

      } catch (err) {
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    AOS.init({
            duration:1000,       // Animation duration in ms
            offset: 100,        // How far from viewport before triggering
            once: false,
            mirror:true,        // Whether animation runs only once or every time
            easing:"ease-out"
        })
    AOS.refresh();

  }, []);

  return (
    <div className="admin-orders">
      {orders.length > 0 ? (
        Array.isArray(orders)&&orders.map(order => (
          <div key={order._id} data-aos="fade-up" className="order-card">
            <p><strong>Order ID:</strong> {order._id}</p>
            <div>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <h4>Items:</h4>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} — ₹{item.price} x {item.quantity}
                </li>
              ))}
            </ul>
            <hr />
          </div>
        ))
      ) : (
        <p className={loading ? "loading": ""} >{orders.length === 0 ? "No orders found" : ""}</p>
      ) }
    </div>
  );
}
