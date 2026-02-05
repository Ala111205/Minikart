import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductList({ refresh, baseURL, onEditProduct, scrollToId, clearScroll }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const token = localStorage.getItem("adminToken");

    const res = await axios.get(`${baseURL}/api/products/shop`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, [refresh]);

  // SCROLL AFTER PRODUCTS RENDER
  useEffect(() => {
    if (!scrollToId) return;

    const run = async () => {
      await fetchProducts(); // wait for fresh list

      setTimeout(() => {
        const el = document.getElementById(`product-${scrollToId}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        clearScroll();
      }, 0); // wait for DOM paint
    };

    run();
  }, [scrollToId]);


  const handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");

    await axios.delete(`${baseURL}/api/products/shop/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchProducts();
  };

  return (
    <div className="Productlist">
      <h2>All Products</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Brand</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>RAM</th>
            <th>Storage</th>
            <th>Processor</th>
            <th>Display</th>
            <th>OS</th>
            <th>Battery</th>
            <th>Image</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((prod) => (
            <tr key={prod._id} id={`product-${prod._id}`}>
              <td>{prod.name}</td>
              <td>{prod.brand || "-"}</td>
              <td>{prod.description}</td>
              <td>₹{prod.price}</td>
              <td>{prod.stock}</td>
              <td>{prod.specs?.ram || "-"}</td>
              <td>{prod.specs?.storage || "-"}</td>
              <td>{prod.specs?.processor || "-"}</td>
              <td>{prod.specs?.display || "-"}</td>
              <td>{prod.specs?.os || "-"}</td>
              <td>{prod.specs?.battery || "-"}</td>
              <td>
                {prod.image ? (
                  <img src={prod.image} alt={prod.name} width="60" />
                ) : "No Image"}
              </td>
              <td colSpan={"2"} className="gap">
                <button onClick={() => onEditProduct(prod)}>Edit</button>
                <button onClick={() => handleDelete(prod._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}