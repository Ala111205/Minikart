import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductForm({
  onProductAdded,
  productToEdit,
  ClearEdit,
  baseURL
}) {
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
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileRef = useRef();
  const token = localStorage.getItem("adminToken");
  const navigate = useNavigate();

  /* ---------------- LOAD EDIT DATA ---------------- */
  useEffect(() => {
    if (!productToEdit) return;

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
  }, [productToEdit]);

  /* ---------------- CHANGE HANDLER ---------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("specs.")) {
      const key = name.split(".")[1];

      setForm(prev => ({
        ...prev,
        specs: { ...prev.specs, [key]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = form.image;

      /* image upload */
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);

        const uploadRes = await axios.post(
          `${baseURL}/api/products/upload`,
          fd,
          {
            headers: { Authorization: `Bearer ${token}` },
            onUploadProgress: (e) =>
              setProgress(Math.round((e.loaded * 100) / e.total))
          }
        );

        imageUrl = uploadRes.data.imageUrl;

        setImageFile(null);
        fileRef.current.value = "";
      }

      const payload = {
        ...form,
        image: imageUrl
      };

      let productId;

      /* update */
      if (productToEdit) {
        await axios.put(
          `${baseURL}/api/products/shop/${productToEdit._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        productId = productToEdit._id;
        ClearEdit();
      }
      /* add */
      else {
        const res = await axios.post(
          `${baseURL}/api/products/shop`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        productId = res.data._id;
      }

      /* reset */
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

      /* send ID to dashboard */
      onProductAdded(productId);

    } catch (err) {
      console.error(err);
      alert("Failed");
    } finally {
      setSubmitting(false);
      setProgress(0);
    }
  };

  /* ---------------- UI ---------------- */
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

        <div><label>Product Image</label>
          <input type="file" ref={fileRef} accept="image/*" onChange={(e)=>setImageFile(e.target.files[0])} />
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

        <button type="submit" disabled={submitting}>
          {submitting
            ? `Uploading ${progress}%...`
            : productToEdit
              ? "Update"
              : "Add"}
        </button>
      </form>
    </div>
  );
}
