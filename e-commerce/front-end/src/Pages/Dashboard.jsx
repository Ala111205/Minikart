import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";

export default function Dashboard({ baseURL }) {
  const [refresh, setRefresh] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ⭐ NEW
  const [scrollToId, setScrollToId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) navigate("/", { replace: true });
  }, []);

  // called after add/update
  const handleProductAdded = (productId) => {
    setRefresh(prev => !prev);

    // tell table which row to scroll
    setScrollToId(productId);

    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearScroll = () => setScrollToId(null);

  return (
    <div className="content">
      <div className="dashboard">

        <ProductForm
          onProductAdded={handleProductAdded}
          productToEdit={editingProduct}
          ClearEdit={() => setEditingProduct(null)}
          baseURL={baseURL}
        />

        <ProductList
          refresh={refresh}
          scrollToId={scrollToId}
          clearScroll={clearScroll}
          onEditProduct={handleEditProduct}
          baseURL={baseURL}
        />

      </div>
    </div>
  );
}