import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const ProductModal = ({ show, onClose, onSubmit, initialData }) => {
  const defaultData = {
    title: "", price: "", category: "Living Room", image: "", description: "", isBestSeller: false,
    countInStock: 0, 
    dimensionImage: "", feature_overview: "", shipping_info: "", warranty_info: "",
    fabrics: []
  };

  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    if (initialData) setFormData(initialData);
    else setFormData(defaultData);
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleFabricChange = (index, field, value) => {
    const newFabrics = [...formData.fabrics];
    newFabrics[index][field] = value;
    setFormData({ ...formData, fabrics: newFabrics });
  };

  const addFabric = () => setFormData({ ...formData, fabrics: [...(formData.fabrics || []), { name: "", image: "", extraPrice: 0 }] });
  const removeFabric = (index) => setFormData({ ...formData, fabrics: formData.fabrics.filter((_, i) => i !== index) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.price || !formData.category || !formData.image) {
        toast.error("Please fill in required fields: Title, Price, Category, Main Image");
        return;
    }
    
    // Validate price and stock
    if (Number(formData.price) <= 0) {
        toast.error("Price must be greater than 0");
        return;
    }
    
    if (Number(formData.countInStock) < 0) {
        toast.error("Stock cannot be negative");
        return;
    }
    
    // Prepare data for API
    const payload = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
        // Ensure fabrics have required fields
        fabrics: formData.fabrics
            .filter(f => f.name && f.image) // Only keep valid fabrics
            .map(f => ({
                ...f,
                extraPrice: Number(f.extraPrice) || 0
            })),
        // Set default rating
        rating: formData.rating || { rate: 5, count: 0 },
        // Default values for missing fields
        isOnSale: formData.isOnSale || false,
        salePercentage: formData.salePercentage || 0
    };
    
    // Remove empty strings from optional fields
    Object.keys(payload).forEach(key => {
        if (payload[key] === "" && key !== "description") {
            delete payload[key];
        }
    });
    
    try {
        onSubmit(payload);
    } catch (error) {
        toast.error("Error preparing product data");
        console.error(error);
    }
};

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content rounded-0 border-0">
          <div className="modal-header bg-dark text-white rounded-0">
            <h5 className="modal-title fw-bold text-uppercase">{initialData ? "Update Product" : "Create New Product"}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4 bg-light">
            <form onSubmit={handleSubmit} id="productForm">
              
              <div className="row g-4">
                  <div className="col-lg-6">
                      <h6 className="fw-bold text-uppercase mb-3 border-bottom pb-2">Basic Info</h6>
                      <div className="mb-3">
                          <label className="form-label small fw-bold">PRODUCT NAME</label>
                          <input type="text" className="form-control rounded-0" name="title" value={formData.title} onChange={handleChange} required />
                      </div>
                      
                      <div className="row mb-3">
                          <div className="col-6">
                              <label className="form-label small fw-bold">PRICE ($)</label>
                              <input type="number" className="form-control rounded-0" name="price" value={formData.price} onChange={handleChange} required />
                          </div>
                          <div className="col-6">
                              <label className="form-label small fw-bold">IN STOCK</label>
                              <input type="number" className="form-control rounded-0" name="countInStock" value={formData.countInStock} onChange={handleChange} required min="0" />
                          </div>
                      </div>

                      <div className="row mb-3">
                          <div className="col-6">
                              <label className="form-label small fw-bold">CATEGORY</label>
                              <select className="form-select rounded-0" name="category" value={formData.category} onChange={handleChange}>
                                  <option value="Living Room">Living Room</option>
                                  <option value="Dining">Dining</option>
                                  <option value="Bedroom">Bedroom</option>
                                  <option value="Decor">Decor</option>
                              </select>
                          </div>
                          <div className="col-6 d-flex align-items-end">
                              <div className="form-check mb-2">
                                  <input className="form-check-input" type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} id="bestSeller" />
                                  <label className="form-check-label fw-bold small" htmlFor="bestSeller">Mark as Best Seller</label>
                              </div>
                          </div>
                      </div>

                      <div className="mb-3">
                          <label className="form-label small fw-bold">MAIN IMAGE URL</label>
                          <input type="text" className="form-control rounded-0" name="image" value={formData.image} onChange={handleChange} />
                      </div>
                      <div className="mb-3">
                          <label className="form-label small fw-bold">DESCRIPTION</label>
                          <textarea className="form-control rounded-0" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
                      </div>

                      <h6 className="fw-bold text-uppercase mb-3 border-bottom pb-2 mt-5">Specifications</h6>
                      <div className="mb-2"><label className="small fw-bold text-muted">FEATURE OVERVIEW</label><textarea className="form-control rounded-0" name="feature_overview" rows="2" value={formData.feature_overview} onChange={handleChange}></textarea></div>
                      <div className="mb-2"><label className="small fw-bold text-muted">SHIPPING INFO</label><textarea className="form-control rounded-0" name="shipping_info" rows="2" value={formData.shipping_info} onChange={handleChange}></textarea></div>
                      <div className="mb-2"><label className="small fw-bold text-muted">WARRANTY INFO</label><textarea className="form-control rounded-0" name="warranty_info" rows="2" value={formData.warranty_info} onChange={handleChange}></textarea></div>
                  </div>

                  <div className="col-lg-6">
                      <h6 className="fw-bold text-uppercase mb-3 border-bottom pb-2">Technical Details</h6>
                      <div className="mb-4">
                          <label className="form-label small fw-bold">DIMENSION IMAGE URL</label>
                          <input type="text" className="form-control rounded-0 mb-2" name="dimensionImage" value={formData.dimensionImage} onChange={handleChange} />
                          {formData.dimensionImage && <img src={formData.dimensionImage} alt="Preview" style={{height: "100px", objectFit: "contain", border: "1px dashed #ccc"}} />}
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2 mt-5">
                          <h6 className="fw-bold text-uppercase m-0">Fabric Options</h6>
                          <button type="button" className="btn btn-sm btn-dark rounded-0" onClick={addFabric}>+ Add Fabric</button>
                      </div>
                      <div style={{maxHeight: "400px", overflowY: "auto"}} className="pe-2">
                          {formData.fabrics && formData.fabrics.map((fabric, idx) => (
                              <div key={idx} className="card border p-3 mb-3 position-relative">
                                  <button type="button" className="btn-close position-absolute top-0 end-0 m-2" onClick={() => removeFabric(idx)}></button>
                                  <div className="row g-2">
                                      <div className="col-8">
                                          <input type="text" className="form-control form-control-sm rounded-0 mb-2" placeholder="Fabric Name" value={fabric.name} onChange={(e) => handleFabricChange(idx, "name", e.target.value)} />
                                          <input type="text" className="form-control form-control-sm rounded-0" placeholder="Image URL" value={fabric.image} onChange={(e) => handleFabricChange(idx, "image", e.target.value)} />
                                      </div>
                                      <div className="col-4">
                                          <input type="number" className="form-control form-control-sm rounded-0 mb-2" placeholder="Extra Price" value={fabric.extraPrice} onChange={(e) => handleFabricChange(idx, "extraPrice", e.target.value)} />
                                          {fabric.image && <img src={fabric.image} alt="" style={{width: "100%", height: "40px", objectFit: "cover"}} />}
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
            </form>
          </div>
          <div className="modal-footer bg-white">
            <button type="button" className="btn btn-outline-secondary rounded-0" onClick={onClose}>Cancel</button>
            <button type="submit" form="productForm" className="btn btn-dark rounded-0 px-4 fw-bold">{initialData ? "Save Changes" : "Create Product"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
