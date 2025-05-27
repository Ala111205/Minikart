import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect,  useRef, useState } from 'react';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState(null);
  const [cart, setCart] = useState([]);

  const { id } = useParams(); // Get product ID from URL

  const navigate=useNavigate();

  const productRef=useRef(null);
  const cardsRef=useRef(null);
  const imgRef=useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    axios
      .get(`https://minikart-backend.onrender.com/products/shop/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to fetch products', err));

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, [id]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map((item) =>
        item._id === product._id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    navigate("/cart")
  };

  const handleBuyNow = (product) => {
  // Optional: Save to localStorage or Context
  localStorage.setItem('buyNowItem', JSON.stringify(product));

  // Redirect to a checkout page
  window.location.href = '/Buying';

  navigate("/Buying")
};

  useEffect(() => {
    const product = productRef.current;
    const cards = cardsRef.current;
    const img = imgRef.current;

    if (!img) return;

    const handleMouseMove = (e) => {
      const xAxis = (window.innerWidth / 2 - e.clientX) / 25;
      const yAxis = (window.innerHeight / 2 - e.clientY) / 25;
      img.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    const handleMouseEnter = () => {
      // cards.classList.add('has-transform');
      img.classList.add('has-transform',"drop-shadow");
    };

    const handleMouseLeave = () => {
      img.style.transform = `rotateY(0deg) rotateX(0deg)`;
      // cards.classList.remove('has-transform');
      img.classList.remove('has-transform',"drop-shadow");
    };

    img.addEventListener('mousemove', handleMouseMove);
    img.addEventListener('mouseenter', handleMouseEnter);
    img.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      img.removeEventListener('mousemove', handleMouseMove);
      img.removeEventListener('mouseenter', handleMouseEnter);
      img.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [products]);
  
  if(!products){
    
    return <p>loading...</p>;
  }

  return (
    <div className="view">
      <div className="product" ref={productRef}>
          <div className="cards" ref={cardsRef} key={products._id}>
            <div className="img">
              <img ref={imgRef} src={`https://minikart-backend.onrender.com/uploads${products.image}`} alt={products.name} />
            </div>
            <p><strong>Brand:</strong> {products.brand}</p>
            <p>{products.description}</p>
            <div className='specification'>
              <p><strong>Processor:</strong> {products.specs?.processor}</p>
              <p><strong>RAM:</strong> {products.specs?.ram} GB</p>
              <p><strong>Storage:</strong> {products.specs?.storage}</p>
            </div>
            <div className="ps">
              <p><strong>Price:</strong> ₹{products.price}</p>
              <p><strong>Stock:</strong> {products.stock}</p>
            </div>
            <div className="but">
              <button className="buy" onClick={()=>handleBuyNow(products)}>Buy Now</button>
              <button className="add" onClick={() => addToCart(products)}>Add to Cart</button>
            </div>
          </div>
      </div>
    </div>
  );
}
