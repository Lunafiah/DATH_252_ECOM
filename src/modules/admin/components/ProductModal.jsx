import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosClient from "../../../api/axiosClient";

const ProductModal = ({ show, onClose, onSubmit, initialData }) => {
  const defaultData = {
    title: "", price: "", category: "Living Room", image: "", description: "", isBestSeller: false,
    countInStock: 0, 
    dimensionImage: "", feature_overview: "", shipping_info: "", warranty_info: "",
    fabrics: [],
    model3D: { glb: "", usdz: "", thumbnail: "" }
  };

  const [formData, setFormData] = useState(defaultData);
  const [selectedGlbFile, setSelectedGlbFile] = useState(null);
  const [uploadingGlb, setUploadingGlb] = useState(false);
  
  useEffect(() => {
    if (initialData) {
      // Ensure model3D exists even if not in database
      setFormData({
        ...initialData,
        model3D: initialData.model3D || { glb: "", usdz: "", thumbnail: "" }
      });
    } else {
      setFormData({
        title: "", price: "", category: "Living Room", image: "", description: "", isBestSeller: false,
        countInStock: 0, 
        dimensionImage: "", feature_overview: "", shipping_info: "", warranty_info: "",
        fabrics: [],
        model3D: { glb: "", usdz: "", thumbnail: "" }
      });
    }
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
    
    // NEW: Upload GLB file if selected
    if (selectedGlbFile) {
      setUploadingGlb(true);
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('glbFile', selectedGlbFile);
        
        const uploadResponse = await axiosClient.post('/upload/glb', formDataUpload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Update formData with the uploaded file path
        formData.model3D = {
          ...formData.model3D,
          glb: uploadResponse.data.path
        };
        
        toast.success(`GLB file uploaded: ${uploadResponse.data.filename}`);
      } catch (error) {
        setUploadingGlb(false);
        toast.error(error.response?.data?.message || 'GLB upload failed');
        return; // Stop submission if upload fails
      }
      setUploadingGlb(false);
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
    
    // Handle model3D - only include if at least one field has a value
    if (formData.model3D && (formData.model3D.glb || formData.model3D.usdz || formData.model3D.thumbnail)) {
        payload.model3D = {
            glb: formData.model3D.glb || "",
            usdz: formData.model3D.usdz || "",
            thumbnail: formData.model3D.thumbnail || ""
        };
    }
    
    // Remove empty strings from optional fields (but not nested objects)
    Object.keys(payload).forEach(key => {
        if (payload[key] === "" && key !== "description" && typeof payload[key] !== "object") {
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
                          <div className="input-group">
                              <input 
                                type="text" 
                                className="form-control rounded-0" 
                                name="image" 
                                value={formData.image} 
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg or upload below"
                              />
                              <label className="btn btn-outline-secondary rounded-0" htmlFor="imageFileUpload">
                                  <i className="fa fa-upload me-1"></i> Upload Local
                              </label>
                              <input 
                                type="file" 
                                id="imageFileUpload" 
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setFormData({ ...formData, image: reader.result });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                          </div>
                          {formData.image && (
                            <div className="mt-2">
                              <img 
                                src={formData.image} 
                                alt="Preview" 
                                style={{ height: "80px", objectFit: "contain", border: "1px solid #ddd", padding: "5px" }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          )}
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
                          <label className="form-label small fw-bold">3D GLB FILE URL</label>
                          <div className="input-group mb-2">
                              <input 
                                type="text" 
                                className="form-control rounded-0" 
                                name="model3D_glb" 
                                value={formData.model3D?.glb || ''} 
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  model3D: { 
                                    ...formData.model3D, 
                                    glb: e.target.value 
                                  }
                                })} 
                                placeholder="/models/sofa.glb or https://example.com/model.glb"
                              />
                              <label className="btn btn-outline-secondary rounded-0" htmlFor="glbFileUpload">
                                  <i className="fa fa-upload me-1"></i> Upload GLB
                              </label>
                              <input 
                                type="file" 
                                id="glbFileUpload" 
                                accept=".glb,.gltf"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    // Just store the file, don't upload yet
                                    setSelectedGlbFile(file);
                                    // Show the filename in the input
                                    setFormData({
                                      ...formData,
                                      model3D: {
                                        ...formData.model3D,
                                        glb: file.name // Show filename temporarily
                                      }
                                    });
                                    toast.success(`File selected: ${file.name}`);
                                  }
                                }}
                              />
                          </div>
                          {formData.model3D?.glb && (
                            <small className="text-muted d-block">
                              <i className="bi bi-check-circle text-success"></i> 
                              {selectedGlbFile 
                                ? ` File ready: ${formData.model3D.glb}` 
                                : ` GLB URL: ${formData.model3D.glb.substring(0, 50)}...`}
                            </small>
                          )}
                          <small className="text-muted d-block mt-1">
                            <i className="fa fa-info-circle"></i> For best performance, use /models/filename.glb or host on a CDN
                          </small>
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
            <button 
              type="submit" 
              form="productForm" 
              className="btn btn-dark rounded-0 px-4 fw-bold"
              disabled={uploadingGlb}
            >
              {uploadingGlb ? "Uploading GLB..." : (initialData ? "Save Changes" : "Create Product")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
