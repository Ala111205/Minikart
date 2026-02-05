import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default function UserOrders({ baseURL }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("userToken");

        const res = await axios.get(
          `${baseURL}/api/orders/my-orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setOrders(res.data);
      } catch (err) {
        console.error(err);
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

  if (loading) return <p>Loading...</p>;
  if (!orders.length) return <p>No orders yet</p>;

  return (
    <div className="orders">

      {loading && <p className='loading'></p>}

      {!loading && orders.length === 0 && (
        <p>No orders found</p>
      )}

      {!loading && orders.length > 0 &&
        orders.map(order => (
          <div key={order._id} data-aos="fade-up" className="order-card">
            <h2><b>Name:-</b> {order.customer?.name}</h2>
            <p><strong>Order ID:</strong> {order._id}</p>

            <div>
              <p><strong>Total:</strong> ₹{order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>

            <p><strong>Phone No:-</strong> {order.customer?.phone}</p>

            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>

            <h4>Items:</h4>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} — ₹{item.price} x {item.quantity}
                </li>
              ))}
            </ul>

            <p><b>Address:-</b> {order.customer?.address}</p>
          </div>
        ))
      }

    </div>
  );
}