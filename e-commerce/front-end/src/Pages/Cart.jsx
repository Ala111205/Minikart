import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css"

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    AOS.init({
          duration:1000,       // Animation duration in ms
          offset: 50,        // How far from viewport before triggering
          once: false,
          mirror:true,        // Whether animation runs only once or every time
          easing:"ease-out"
    })
    AOS.refresh();
  }, []);

  // Remove an item from the cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));  // Save updated cart to localStorage
  };

  // Update the quantity of an item
  const updateQuantity = (productId, quantity) => {
    const updatedCart = cart.map(item =>
      item._id === productId
        ? { ...item, quantity }
        : item
    );

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Calculate the total price of all items in the cart
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  // Navigate to the checkout page
  const proceedToCheckout = () => {
    navigate('/checkout', { state: { items: cart } });
  };

  return (
    <div className="cart-page">
      <div className="cart-items">
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          cart.map((item) => (
            <div data-aos="fade-right" className="cart-item" key={item._id}>
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p><strong>Processor:</strong> {item.specs?.processor}</p>
                <p><strong>RAM:</strong> {item.specs?.ram} GB</p>
                <p><strong>Storage:</strong> {item.specs?.storage}</p>
              </div>
              <button onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div data-aos="zoom-in" className="cart-summary">
          <h3>Total: ₹{calculateTotal()}</h3>
          <button onClick={proceedToCheckout}>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
}
