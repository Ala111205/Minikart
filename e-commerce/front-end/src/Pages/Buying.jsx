import { useEffect, useState } from 'react';
import axios from 'axios';
import AOS from "aos";
import "aos/dist/aos.css";

export default function Buying({baseURL}) {
  const [item, setItem] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    const buyItem = JSON.parse(localStorage.getItem('buyNowItem'));
    if (buyItem) setItem(buyItem);

    AOS.init({
      duration: 1000,
      offset:100,
      once:false,
      easing:"ease-in-out"
    })
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!form.name || !form.address || !form.phone) {
    return alert('Please fill in all details');
  }

    const token = localStorage.getItem('adminToken'); // or user token
    
    const orderData={
      item:[{
        customer:{
          address:form.address,
          phone:form.phone,
          name:form.name,
        },
        productId:item._id,
        quantity:1,
        amount:item.price,
        name:item.name
      }],
      
      
    };

    try {
    const response = await axios.post(`${baseURL}/api/`, {
      orderData
    });

    alert('Order placed successfully!');
    localStorage.removeItem('buyNowItem');
    // You may redirect user here if needed
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    }
    };

  if (!item) return <p>Loading item...</p>;

  return (
    <div className="Buying" data-aos="zoom-in">
      <h2>Checkout</h2>
      <p><strong>Product:</strong> {item.name}</p>
      <p><strong>Price:</strong> ₹{item.price}</p>
      <form onSubmit={handlePlaceOrder}>
        <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} />
       <input type="text" name="address" placeholder="Delivery Address" value={form.address} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}
