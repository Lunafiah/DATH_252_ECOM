import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../../orders/store/cartSlice";
import { Navbar, Footer } from "../../../components";
import axiosClient from "../../../api/axiosClient";
import SkeletonLoading from "../components/SkeletonLoading";
import Product3DViewer from "../../../components/Product3DViewer";
import toast from "react-hot-toast";

const FABRIC_COLLECTIONS = {
    "Origin": {
        description: "Made in Italy from hides sourced across Australia, New Zealand and Europe. Origin is a luxurious top grain corrected leather.",
        details: "Top grain corrected leather. Made in Italy.",
        price: 0, 
        swatches: [
            { id: "o1", name: "Origin Esperance Sand", color: "#E8E0D5", image: "https://www.kingliving.com.au/media/catalog/product/cache/a0ddeba5837ba2905413885380808fb3/o/r/origin_esperance_sand.jpg" },
            { id: "o2", name: "Origin Ghost Gum", color: "#D3CDC6", image: "https://www.kingliving.com.au/media/catalog/product/cache/a0ddeba5837ba2905413885380808fb3/o/r/origin_ghostgum.jpg" },
            { id: "o3", name: "Origin Silver Eucalypt", color: "#B8B3AD", image: "https://www.kingliving.com.au/media/catalog/product/cache/a0ddeba5837ba2905413885380808fb3/o/r/origin_silver_eucalypt.jpg" },
            { id: "o4", name: "Origin Tasman", color: "#8B7D72", image: "https://www.kingliving.com.au/media/catalog/product/cache/a0ddeba5837ba2905413885380808fb3/o/r/origin_tasman.jpg" },
        ]
    },
    "Prestige": {
        description: "A true expression of casual elegance, Prestige is a classic full grain semi-aniline leather.",
        details: "100% full grain semi-aniline leather.",
        price: 654, 
        swatches: [
            { id: "p1", name: "Prestige Silk", color: "#EFEBE7", image: "https://www.kingliving.com.au/media/catalog/product/cache/a0ddeba5837ba2905413885380808fb3/p/r/prestige_silk_1.jpg" },
            { id: "p2", name: "Prestige Palomino", color: "#C4A484", image: "https://www.kingliving.com.au/media/catalog/product/cache/a0ddeba5837ba2905413885380808fb3/p/r/prestige_palomino.jpg" },
        ]
    }
};

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(1);

  const [activeCollection, setActiveCollection] = useState("Origin");
  const [selectedSwatch, setSelectedSwatch] = useState(FABRIC_COLLECTIONS["Origin"].swatches[1]); 
  const [isCoverOpen, setIsCoverOpen] = useState(true); 
  const [openSpec, setOpenSpec] = useState("features"); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/products/${id}`);
        console.log("📦 Product data from API:", data);
        console.log("🎨 model3D data:", data.model3D);
        setProduct(data);
      } catch (error) { toast.error("Error loading"); } 
      finally { setLoading(false); }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const currentCollectionData = FABRIC_COLLECTIONS[activeCollection];
  const extraPrice = currentCollectionData.price;
  const finalPrice = product ? product.price + extraPrice : 0;
  
  const isOutOfStock = product?.countInStock === 0;

  const handleAddToCart = () => {
      dispatch(addCart({ 
          ...product, 
          price: finalPrice, 
          selectedFabric: selectedSwatch.name, 
          qty 
      }));
      toast.success("Added to cart");
  };

  const KingAccordion = ({ id, title, children }) => {
      const isOpen = openSpec === id;
      return (
          <div className="border-bottom border-light-gray">
              <button className="w-100 py-4 d-flex justify-content-between align-items-center bg-transparent border-0 cursor-pointer" onClick={() => setOpenSpec(isOpen ? "" : id)}>
                  <span className="text-uppercase fw-bold" style={{fontSize: "0.8rem", letterSpacing: "1.5px"}}>{title}</span>
                  <i className={`fa fa-chevron-down transition-transform ${isOpen ? "rotate-180" : ""}`} style={{fontSize: "0.7rem", opacity: 0.5}}></i>
              </button>
              <div className={`overflow-hidden transition-all ${isOpen ? "mb-4" : ""}`} style={{maxHeight: isOpen ? "1000px" : "0px", opacity: isOpen ? 1 : 0}}>
                  <div className="text-secondary small" style={{lineHeight: "1.8"}} dangerouslySetInnerHTML={{__html: children}}></div>
              </div>
          </div>
      );
  };

  if (loading || !product) return <SkeletonLoading />;

  return (
    <>
      <div style={{ backgroundColor: "#fff", paddingTop: "120px", fontFamily: "Helvetica, Arial, sans-serif" }}>
        
        <div className="container-fluid px-lg-5">
            <div className="row gx-lg-5">
                
                <div className="col-lg-7 mb-5 mb-lg-0">
                    <div className="sticky-top" style={{top: "140px", zIndex: 1}}>
                        <div className="w-100 d-flex align-items-center justify-content-center mb-2 position-relative bg-light-gray" style={{height: "75vh"}}>
                            <img src={product.image} alt={product.title} className="img-fluid mix-blend-multiply" style={{maxHeight: "85%", maxWidth: "85%"}} />
                        </div>
                        
                        {/* 3D Viewer Section */}
                        {product.model3D?.glb && (
                          <div className="mt-4">
                            <Product3DViewer
                              modelUrl={product.model3D.glb}
                              iosModelUrl={product.model3D.usdz}
                              productName={product.title}
                              poster={product.model3D.thumbnail || product.image}
                            />
                          </div>
                        )}
                    </div>
                </div>

                <div className="col-lg-5 ps-lg-5" style={{paddingTop: "20px"}}>
                    
                    {/* Header */}
                    <div className="mb-5 pb-4 border-bottom">
                        <span className="text-uppercase text-secondary fw-bold" style={{fontSize: "0.75rem", letterSpacing: "2px"}}>{product.category}</span>
                        <h1 className="display-5 mt-2 mb-2 text-black" style={{fontFamily: "'Playfair Display', serif", fontWeight: "500"}}>{product.title}</h1>
                        <p className="text-secondary mt-3" style={{fontSize: "0.95rem", lineHeight: "1.6"}}>{product.description}</p>
                    </div>

                    <div className="mb-2">
                        <h6 className="text-uppercase fw-bold mb-3" style={{letterSpacing: "1px", fontSize: "0.85rem"}}>Customise your {product.title}</h6>
                        
                        <div className="border border-dark">
                            
                            <div className="d-flex justify-content-between align-items-center p-3 cursor-pointer bg-white" onClick={() => setIsCoverOpen(!isCoverOpen)}>
                                <div className="d-flex align-items-center">
                                    <i className="fa fa-check-circle fs-5 me-3"></i>
                                    <span className="fw-bold fs-6">Cover</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="text-secondary me-3 small">{selectedSwatch.name}</span>
                                    <img src={selectedSwatch.image} alt="" style={{width: "20px", height: "20px", objectFit: "cover"}} className="me-3" />
                                    <i className={`fa fa-chevron-down transition-transform ${isCoverOpen ? "rotate-180" : ""}`} style={{fontSize: "0.8rem"}}></i>
                                </div>
                            </div>

                            {isCoverOpen && (
                                <div className="px-3 pb-3 border-top border-light-gray pt-3">
                                    
                                    <div className="mb-4">
                                        <p className="text-uppercase fw-bold mb-2" style={{fontSize: "0.7rem", letterSpacing: "1px"}}>Colour</p>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="small me-2">All</span>
                                            {["#fff", "#f5f5dc", "#808080", "#a52a2a", "#000"].map((c, i) => (
                                                <div key={i} style={{width: "20px", height: "20px", background: c, border: "1px solid #ddd"}} className="cursor-pointer"></div>
                                            ))}
                                            <a href="#" className="small text-dark fw-bold ms-2 text-decoration-underline">View All</a>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-uppercase fw-bold mb-2" style={{fontSize: "0.7rem", letterSpacing: "1px"}}>Swatch</p>
                                        <select 
                                            className="form-select rounded-0 border-dark py-2 shadow-none fw-bold" 
                                            value={activeCollection}
                                            onChange={(e) => setActiveCollection(e.target.value)}
                                            style={{fontSize: "0.9rem"}}
                                        >
                                            {Object.keys(FABRIC_COLLECTIONS).map(key => <option key={key} value={key}>{key}</option>)}
                                        </select>
                                    </div>

                                    <div className="row g-2 mb-4">
                                        {currentCollectionData.swatches.map((swatch) => (
                                            <div key={swatch.id} className="col-3">
                                                <div 
                                                    className={`ratio ratio-1x1 cursor-pointer position-relative ${selectedSwatch.name === swatch.name ? "selected-fabric" : "border"}`}
                                                    onClick={() => setSelectedSwatch(swatch)}
                                                >
                                                    <img src={swatch.image} className="w-100 h-100 object-fit-cover" alt={swatch.name} />
                                                </div>
                                                <div className="mt-2" style={{lineHeight: "1.2"}}>
                                                    <span className="d-block fw-bold text-dark" style={{fontSize: "0.65rem"}}>{swatch.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="row mt-4 pt-3 border-top border-light-gray g-4">
                                        <div className="col-8 border-end border-light-gray">
                                            <p className="text-secondary small mb-0" style={{fontSize: "0.75rem", lineHeight: "1.6"}}>{currentCollectionData.description}</p>
                                        </div>
                                        <div className="col-4">
                                            <p className="fw-bold mb-1" style={{fontSize: "0.7rem"}}>Fabric Details:</p>
                                            <p className="text-secondary small mb-0" style={{fontSize: "0.75rem", lineHeight: "1.4"}}>{currentCollectionData.details}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 p-3 bg-light-gray text-center">
                                        <p className="fw-bold text-uppercase mb-1" style={{fontSize: "0.7rem", letterSpacing: "1px"}}>Order Complimentary Swatches</p>
                                        <a href="#" className="small fw-bold text-dark text-decoration-underline">Order Now</a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="py-4">
                        <div className="mb-3 d-flex justify-content-between align-items-center">
                            <div>
                                <span className="small text-secondary">Full Price </span>
                                {isOutOfStock ? (
                                    <span className="fw-bold text-danger fs-5">SOLD OUT</span>
                                ) : (
                                    <span className="fw-bold text-black fs-4">${finalPrice.toLocaleString()}</span>
                                )}
                                {extraPrice > 0 && !isOutOfStock && <span className="d-block small text-muted">Includes +${extraPrice} for {activeCollection} cover</span>}
                            </div>
                        </div>

                        {!isOutOfStock ? (
                            <div className="d-flex gap-2">
                                <div className="border border-dark d-flex align-items-center justify-content-between px-3" style={{width: "120px", height: "55px"}}>
                                    <span className="cursor-pointer fw-bold fs-5" onClick={() => qty > 1 && setQty(qty-1)}>-</span>
                                    <span className="fw-bold fs-5">{qty}</span>
                                    <span 
                                        className={`fw-bold fs-5 ${qty >= product.countInStock ? "text-muted" : "cursor-pointer"}`} 
                                        onClick={() => qty < product.countInStock && setQty(qty+1)}
                                    >+</span>
                                </div>
                                <button onClick={handleAddToCart} className="btn btn-black w-100 rounded-0 text-uppercase fw-bold text-white d-flex align-items-center justify-content-center py-3" style={{letterSpacing: "2px", fontSize: "0.9rem"}}>
                                    Add to Cart
                                </button>
                            </div>
                        ) : (
                            <button className="btn btn-secondary w-100 rounded-0 text-uppercase fw-bold text-white py-3 disabled" style={{cursor: "not-allowed"}}>
                                Notify Me When Available
                            </button>
                        )}
                        
                        <p className="mt-3 text-secondary small">
                            {!isOutOfStock && product.countInStock < 5 && <span className="text-danger fw-bold"><i className="fa fa-exclamation-circle"></i> Only {product.countInStock} left!</span>}
                        </p>
                    </div>

                    <div className="mt-5 pt-5 border-top">
                        <h6 className="text-uppercase fw-bold mb-4" style={{letterSpacing: "2px", fontSize: "0.9rem"}}>Specifications</h6>
                        <KingAccordion id="features" title="Feature Overview">{product.feature_overview}</KingAccordion>
                        <KingAccordion id="shipping" title="Shipping & Delivery">{product.shipping_info}</KingAccordion>
                        <KingAccordion id="warranty" title="Warranty">{product.warranty_info}</KingAccordion>
                    </div>

                </div>
            </div>
        </div>



      </div>
      
      <style jsx>{`
        .bg-light-gray { background-color: #f7f7f7; }
        .border-light-gray { border-color: #e5e5e5 !important; }
        .btn-black { background-color: #000; border: 1px solid #000; transition: all 0.3s; }
        .btn-black:hover { background-color: #333; }
        .mix-blend-multiply { mix-blend-mode: multiply; }
        .selected-fabric { box-shadow: 0 0 0 1px #fff, 0 0 0 3px #000; z-index: 2; }
        .transition-transform { transition: transform 0.3s ease; }
        .rotate-180 { transform: rotate(180deg); }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </>
  );
};

export default ProductDetailPage;