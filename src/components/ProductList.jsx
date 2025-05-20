import { Component } from "react";
import axios from "axios";

export default class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = { Products: [] };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.log("No token found in localStorage");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/products/shop", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.setState({ Products: res.data });
    } catch (error) {
      console.log("Error fetching products: ", error.message);
    }
  };

  handleDelete = async (id) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.delete(`http://localhost:5000/api/products/shop/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Product deleted");
      this.fetchProducts();
    } catch (error) {
      console.error("Delete failed", error.message);
    }
  };

  render() {
    const { Products } = this.state;
    const { onEditProduct } = this.props;

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
              <th colSpan={"2"} className="last-th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Products.map((prod) => (
              <tr key={prod._id}>
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
                  ) : (
                    "No Image"
                  )}
                </td>
                <td colSpan={"2"} className="gap">
                  <button onClick={() => onEditProduct(prod)}>Edit</button>
                  <button onClick={() => this.handleDelete(prod._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
