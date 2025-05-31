import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";


export default function Dashboard(){
    const [refers,setRefers]=useState(false);//re-fetch products

    const [editingProduct,setEditingProduct]=useState(null);//holds product being edited

    const navigate=useNavigate();

    useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/",{replace:true}); // Redirect if not logged in
    }
    }, []);

    //toggle to trigger re-fetch
    const handleProductAdded=()=>{
        setRefers(!refers)
    }

    //send to form
    const handleEditProduct = (product) => {
        setEditingProduct(product);
    };

    //reset form after update
    const ClearEdit=()=>setEditingProduct(null);

    const handleLogout=()=>{
        localStorage.clear();
        window.location.href="/"
    }

    return(
        <>
            <div className="content">
                <div>
                    <h1>Admin Dashboard</h1>
                    <button onClick={handleLogout} className="logout">Logout</button>
                </div>
                <div className="dashboard">
                    <ProductForm onProductAdded={handleProductAdded} productToEdit={editingProduct} ClearEdit={ClearEdit} />
                    <ProductList key={refers} onEditProduct={handleEditProduct} />
                </div>
            </div>
        </>
    )
}