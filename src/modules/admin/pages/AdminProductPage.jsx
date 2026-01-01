import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import toast from "react-hot-toast";
import ProductModal from "../components/ProductModal"; // Import Modal mới

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/products"); // Lấy tất cả (có thể thêm phân trang sau)
      setProducts(data);
    } catch (error) { toast.error("Failed to load products"); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddNew = () => {
      setEditingProduct(null); 
      setShowModal(true);
  };

  const handleEdit = (product) => {
      setEditingProduct(product);
      setShowModal(true);
  };

  const handleDelete = async (id) => {
      if(!window.confirm("Are you sure you want to delete this item?")) return;
      try {
          await axiosClient.delete(`/products/${id}`);
          toast.success("Product deleted");
          fetchProducts();
      } catch (error) { toast.error("Delete failed"); }
  };

  const handleFormSubmit = async (formData) => {
    try {
        let response;
        if (editingProduct) {
            response = await axiosClient.put(`/products/${editingProduct._id}`, formData);
            toast.success("Product updated successfully");
        } else {
            response = await axiosClient.post("/products", formData);
            toast.success("Product created successfully");
        }
        
        console.log("✅ Product saved:", response.data);
        setShowModal(false);
        fetchProducts();
    } catch (error) {
        console.error("❌ Error saving product:", error.response?.data);
        toast.error(error.response?.data?.message || "Operation failed. Check console for details.");
    }
};

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
              <h1 className="display-6 fw-bold" style={{fontFamily: "'Playfair Display', serif"}}>Products</h1>
              <p className="text-muted m-0">Manage your inventory catalogue</p>
          </div>
          <button className="btn btn-dark rounded-0 px-4 py-2 text-uppercase fw-bold shadow-sm" onClick={handleAddNew}>
              <i className="fa fa-plus me-2"></i> New Product
          </button>
      </div>

      <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
              <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                      <thead className="bg-light text-uppercase small text-muted">
                          <tr>
                              <th className="py-3 ps-4">Image</th>
                              <th>Name</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Fabrics</th>
                              <th className="text-end pe-4">Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {products.map((p) => (
                              <tr key={p._id}>
                                  <td className="ps-4 py-3">
                                      <img src={p.image} alt="" style={{width: "50px", height: "50px", objectFit: "cover"}} className="rounded-1 border bg-light" />
                                  </td>
                                  <td>
                                      <div className="fw-bold text-dark">{p.title}</div>
                                      {p.isBestSeller && <span className="badge bg-warning text-dark" style={{fontSize: "0.6rem"}}>BEST SELLER</span>}
                                  </td>
                                  <td><span className="badge bg-light text-dark border fw-normal">{p.category}</span></td>
                                  <td className="fw-bold">${p.price}</td>
                                  <td>
                                      {p.fabrics && p.fabrics.length > 0 ? (
                                          <div className="d-flex gap-1">
                                              {p.fabrics.slice(0, 3).map((f, i) => (
                                                  <img key={i} src={f.image} title={f.name} style={{width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover", border: "1px solid #ddd"}} />
                                              ))}
                                              {p.fabrics.length > 3 && <span className="small text-muted">+{p.fabrics.length - 3}</span>}
                                          </div>
                                      ) : <span className="text-muted small">-</span>}
                                  </td>
                                  <td className="text-end pe-4">
                                      <button className="btn btn-sm btn-link text-dark" onClick={() => handleEdit(p)} title="Edit"><i className="fa fa-edit"></i></button>
                                      <button className="btn btn-sm btn-link text-danger" onClick={() => handleDelete(p._id)} title="Delete"><i className="fa fa-trash"></i></button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>

      <ProductModal 
          show={showModal} 
          onClose={() => setShowModal(false)} 
          onSubmit={handleFormSubmit}
          initialData={editingProduct} 
      />
    </>
  );
};

export default AdminProductPage;
