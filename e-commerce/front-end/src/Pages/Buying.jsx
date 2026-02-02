import { useEffect, useState } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Buying({ baseURL }) {
  const [item, setItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("buyNowItem");
    if (stored) setItem(JSON.parse(stored));

    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!item) return;
    if (!form.name || !form.address || !form.phone)
      return alert("Fill all fields");

    const token = localStorage.getItem("adminToken");

    if (!token) {
      alert("Login required");
      return;
    }

    try {
      const orderPayload = {
        items: [
          {
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: 1,
          },
        ],
        total: item.price,
        customer: form,
      };

      await axios.post(
        `${baseURL}/api/orders`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order placed successfully");

      localStorage.removeItem("buyNowItem");

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Order failed");
    }
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className="Buying" data-aos="zoom-in">
      <h2>Checkout</h2>

      <p><strong>Product:</strong> {item.name}</p>
      <p><strong>Price:</strong> ₹{item.price}</p>

      <form onSubmit={handlePlaceOrder}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}