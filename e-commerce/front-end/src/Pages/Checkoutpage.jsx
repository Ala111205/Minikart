import { useState, useEffect } from 'react';
import { MdCancel } from "react-icons/md";
import axios from "axios"
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function CheckoutPage({baseURL}) {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const buyNowItem = JSON.parse(localStorage.getItem('buyNowItem'));

    // If there's a buyNowItem, replace the cart with just that one item
    if (buyNowItem) {
      setCart([{ ...buyNowItem, quantity: 1 }]);
    } else {
      setCart(savedCart);
    }

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

  const handleRemove=(productId)=>{
    const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Case 1: If the item is the buyNowItem
    if (buyNowItem && buyNowItem._id === productId) {
      localStorage.removeItem("buyNowItem");
      setCart([]);
    } else {
      // Case 2: Remove item from cart
      const updatedCart = savedCart.filter(item => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();

  if (!form.name || !form.address || !form.phone) {
    return alert('Please fill in all details');
  }

  const items = cart.map(item => ({
    productId: item._id,
    name: item.name,
    price: item.price,
    quantity: item.quantity || 1
  }));

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  try {
    const response = await axios.post(`${baseURL}/api/orders/`, {
      items,
      total
    });

    alert('Order placed successfully!');
    localStorage.removeItem('cart');
    localStorage.removeItem('buyNowItem');
    setCart([]);
    // You may redirect user here if needed
  } catch (error) {
    console.error('Order failed:', error);
    alert('Order failed. Please try again.');
  }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="checkout-page" data-aos="zoom-in">
      <h2>Checkout</h2>

      <h3>Order Summary</h3>
        {cart.map(item => (
        <div key={item._id}>
          <div className="item-remove">
            <p>{item.name} x {item.quantity} = ₹{item.price * item.quantity}</p>
            < MdCancel className="remove" onClick={()=>handleRemove(item._id)} />
          </div>
        </div>
        ))}
      <h4>Total: ₹{total}</h4>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} />
        <input type="text" name="address" placeholder="Delivery Address" value={form.address} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}