import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation,Link,useNavigate } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";

export default function Shop({baseURL}) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [change,setChange]=useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search')?.toLowerCase() || '';
  };

  const searchTerm = getSearchQuery();

  const toggel=()=>{
    setChange(!change)
  }

  const handleBuyNow = (product) => {
    // Optional: Save to localStorage or Context
    localStorage.setItem('buyNowItem', JSON.stringify(product));

    // Redirect to a checkout page
    window.location.href = '/checkout';

    navigate("/checkout")
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    axios.get(`${baseURL}/api/products/shop`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to fetch products', err));

    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);

    AOS.init({
        duration:1000,       // Animation duration in ms
        offset: 100,        // How far from viewport before triggering
        once: false,
        mirror:true,        // Whether animation runs only once or every time
        easing:"ease-out"
    })
    AOS.refresh();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    let updatedCart;

    if (existing) {
      updatedCart = cart.map(item =>
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

  const filteredProducts = products.filter(prod =>
    prod.name?.toLowerCase().includes(searchTerm) ||
    prod.description?.toLowerCase().includes(searchTerm) ||
    prod.brand?.toLowerCase().includes(searchTerm) ||
    prod.processor?.toLowerCase().includes(searchTerm)
  );
  if(!change){
    
    return <div className='loading'></div>;
  }

  return (
    <div className="shop">
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((prod) => (
            <>
              <div onClick={toggel} data-aos={`${change?"flip-left":"fade-up"}`} className="product-card">
                <Link  to={`/products/${prod._id}`}>
                <div onClick={toggel} className="card" key={prod._id}>
                  <img src={prod.image} alt={prod.name} />
                  <h2>{prod.name}</h2>
                  <div className='ps'>
                    <p>Price: ₹{prod.price}</p>
                    <p>Stock: {prod.stock}</p>
                  </div>
                </div>
                </Link>
                <div className='but'>
                  <button className="buy" onClick={()=>handleBuyNow(prod)}>Buy Now</button>
                  <button className='add' onClick={() => addToCart(prod)}>Add to Cart</button>
                </div>
              </div>
            </>
          ))
        ) : (
          <p className={!searchTerm?"loading":""}>{searchTerm?"No products match your search":""}</p>
        )}
      </div>
    </div>
  );
}
