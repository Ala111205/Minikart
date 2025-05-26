import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductForm({ onProductAdded, productToEdit, ClearEdit }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    stock: "",
    brand: "",
    specs: {
      ram: "",
      storage: "",
      processor: "",
      display: "",
      os: "",
      battery: ""
    }
  });
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (productToEdit) {
      // Ensure nested specs is handled correctly
      setForm({
        ...productToEdit,
        specs: {
          ram: productToEdit.specs?.ram || "",
          storage: productToEdit.specs?.storage || "",
          processor: productToEdit.specs?.processor || "",
          display: productToEdit.specs?.display || "",
          os: productToEdit.specs?.os || "",
          battery: productToEdit.specs?.battery || ""
        }
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check for nested specs field
    if (name.startsWith("specs.")) {
      const specKey = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        specs: {
          ...prev.specs,
          [specKey]: value
        }
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    let imageUrl = form.image;

    // If new image file is selected, upload it first
    if (imageFile) {
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadRes = await axios.post("http://localhost:5000/api/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      imageUrl = uploadRes.data.imageUrl; // Get image URL from server
    }

    const productData = {
      ...form,
      image: imageUrl, // Use the uploaded image URL
    };

    if (productToEdit) {
      await axios.put(`http://localhost:5000/api/products/shop/${productToEdit._id}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Product updated");
      ClearEdit();
    } else {
      await axios.post("http://localhost:5000/api/products/shop", productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Product added successfully!");
    }

      setForm({
        name: "",
        description: "",
        price: "",
        image: "",
        stock: "",
        brand: "",
        specs: {
          ram: "",
          storage: "",
          processor: "",
          display: "",
          os: "",
          battery: ""
        }
      });

      setImageFile(null)

      onProductAdded();

    } catch (error) {
      console.error("Error adding/updating product:", error.message);
      alert("Failed to add/update product");
    }
  };

  return (
    <div className="Addlist">
      <h2>{productToEdit ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit}>
        <div><label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div><label>Description</label>
          <input type="text" name="description" value={form.description} onChange={handleChange} required />
        </div>

        <div><label>Price</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required />
        </div>

        <div><label>Image URL</label>
          <input type="file" accept="image/*" name="image" onChange={(e)=>setImageFile(e.target.files[0])} />
        </div>

        <div><label>Stock</label>
          <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
        </div>

        <div><label>Brand</label>
          <input type="text" name="brand" value={form.brand} onChange={handleChange} required />
        </div>

        <fieldset>
          <legend>Specifications</legend>
          <div>
            <label>RAM</label>
            <input type="text" name="specs.ram" value={form.specs.ram} onChange={handleChange} />
          </div>
          <div>
            <label>Storage</label>
            <input type="text" name="specs.storage" value={form.specs.storage} onChange={handleChange} />
          </div>
          <div>
            <label>Processor</label>
            <input type="text" name="specs.processor" value={form.specs.processor} onChange={handleChange} />
          </div>
          <div>
            <label>Display</label>
            <input type="text" name="specs.display" value={form.specs.display} onChange={handleChange} />
          </div>
          <div>
            <label>OS</label>
            <input type="text" name="specs.os" value={form.specs.os} onChange={handleChange} />
          </div>
          <div>
            <label>Battery</label>
            <input type="text" name="specs.battery" value={form.specs.battery} onChange={handleChange} />
          </div>
        </fieldset>

        <button type="submit">{productToEdit ? "Update" : "Add"}</button>
      </form>
    </div>
  );
}
