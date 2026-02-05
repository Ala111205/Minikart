import { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Checkout({ baseURL, auth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = auth.token;
  const role = auth.role;

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* =============================
     LOAD ITEMS (Cart or BuyNow)
  ==============================*/
  useEffect(() => {
    const itemsFromState = location.state?.items || [];

    if (!itemsFromState.length) {
      navigate("/shop", { replace: true });
      return;
    }

    setItems(itemsFromState);

    AOS.init({ duration: 1000 });
    setLoading(false);
  }, [location]);

  /* =============================
     FORM
  ==============================*/
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  /* =============================
     REMOVE ITEM
  ==============================*/
  const handleRemove = (id) => {
    const updated = items.filter((i) => i._id !== id);

    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));

    if (!updated.length) navigate("/shop");
  };

  /* =============================
     TOTAL
  ==============================*/
  const total = items.reduce(
    (sum, i) => sum + i.price * (i.quantity || 1),
    0
  );

  /* =============================
     SUBMIT ORDER
  ==============================*/
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login first");
      navigate("/login", { replace: true });
      return;
    }

    if (!form.name || !form.address || !form.phone)
      return alert("Fill all fields");

    setSubmitting(true);

    try {
      const payload = {
        items: items.map((i) => ({
          productId: i._id,
          name: i.name,
          price: i.price,
          quantity: i.quantity || 1,
        })),
        total,
        customer: form,
      };

      await axios.post(`${baseURL}/api/orders`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Order placed successfully");

      localStorage.removeItem("cart");
      localStorage.removeItem("buyNowItem");

      const path = role === "user" ? "/my-orders" : "/admin/orders";
      navigate(path, { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* =============================
     UI
  ==============================*/
  if (loading) return <p className="loading"></p>;

  return (
    <div className="checkout-page" data-aos="zoom-in">
      <h2>Checkout</h2>

      {/* ===== ITEMS ===== */}
      <h3>Order Summary</h3>

      {items.map((item) => (
        <div key={item._id} className="item-remove">
          <p>
            {item.name} x {item.quantity || 1} = ₹
            {item.price * (item.quantity || 1)}
          </p>

          <MdCancel
            className="remove"
            onClick={() => handleRemove(item._id)}
          />
        </div>
      ))}

      <h4>Total: ₹{total}</h4>

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <button disabled={submitting}>
          {submitting ? "Placing..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}