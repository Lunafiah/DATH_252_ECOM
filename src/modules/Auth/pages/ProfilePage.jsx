import React, { useState, useEffect } from "react";
import { Navbar, Footer } from "../../../components";
import axiosClient from "../../../api/axiosClient";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

// Move components outside to prevent re-creation on every render
const MenuTab = ({ id, label, activeTab, setActiveTab }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className="btn text-start p-0 mb-4 position-relative d-flex align-items-center w-100 border-0 bg-transparent"
        style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: "0.85rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: activeTab === id ? "#000" : "#999",
            transition: "color 0.3s ease"
        }}
    >
        {activeTab === id && <span className="me-3" style={{width: "20px", height: "1px", background: "#000"}}></span>}
        {label}
    </button>
);

const LuxuryInput = ({ label, value, onChange, type="text", disabled=false }) => (
    <div className="mb-5">
        <label className="d-block text-muted text-uppercase small mb-2" style={{fontSize: "0.7rem", letterSpacing: "1px"}}>{label}</label>
        <input 
            type={type} 
            className="w-100" 
            value={value} 
            onChange={onChange} 
            disabled={disabled}
            placeholder={!value ? "Not set" : ""}
            style={{
                border: "none",
                borderBottom: "1px solid #e5e5e5",
                padding: "10px 0",
                fontSize: "1.1rem",
                fontFamily: "'Playfair Display', serif",
                outline: "none",
                background: "transparent",
                color: disabled ? "#999" : "#000"
            }}
        />
    </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("settings");
  
  const [user, setUser] = useState(() => {
      const saved = JSON.parse(localStorage.getItem("user"));
      return saved ? { ...saved, addresses: saved.addresses || [] } : {};
  });

  const [name, setName] = useState(user.name || "");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  
  const [newAddress, setNewAddress] = useState({ street: "", city: "Ho Chi Minh", phone: "" });
  const [isAddingAddr, setIsAddingAddr] = useState(false);

  useEffect(() => {
    if (activeTab === "orders" && user.email) {
        axiosClient.get(`/orders/mine?email=${user.email}`).then(res => setOrders(res.data));
    }
  }, [activeTab, user.email]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axiosClient.put("/users/profile", { name, password });
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        toast.success("Changes saved.");
        setPassword("");
    } catch (err) { toast.error("Update failed."); }
  };

  const addAddress = async () => {
    if(!newAddress.street) return toast.error("Address required");
    try {
        const { data } = await axiosClient.post("/users/address", newAddress);
        const updated = { ...user, addresses: data };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        setNewAddress({ street: "", city: "Ho Chi Minh", phone: "" });
        setIsAddingAddr(false);
        toast.success("Address added.");
    } catch (err) { toast.error("Failed to add."); }
  };

  const deleteAddress = async (id) => {
      if(!window.confirm("Remove address?")) return;
      try {
          const { data } = await axiosClient.delete(`/users/address/${id}`);
          const updated = { ...user, addresses: data };
          setUser(updated);
          localStorage.setItem("user", JSON.stringify(updated));
      } catch (err) { toast.error("Failed to remove."); }
  };

  const logout = () => {
      localStorage.clear();
      navigate("/login");
  };




  return (
    <>
      <div className="bg-white" style={{minHeight: "100vh", paddingTop: "140px", paddingBottom: "100px"}}>
        
        {/* --- HEADER --- */}
        <div className="container mb-5 px-lg-5 fade-in">
             <div className="row align-items-end">
                 <div className="col-md-6">
                     <p className="text-muted text-uppercase mb-2 small" style={{letterSpacing: "3px"}}>Member Access</p>
                     <h1 className="display-3 m-0" style={{fontFamily: "'Playfair Display', serif"}}>My Account</h1>
                 </div>
                 <div className="col-md-6 text-md-end">
                     <p className="text-muted m-0" style={{fontFamily: "'Playfair Display', serif", fontSize: "1.2rem"}}>Hello, {user.name}</p>
                 </div>
             </div>
             <div className="mt-5 w-100" style={{height: "1px", background: "#f0f0f0"}}></div>
        </div>

        <div className="container px-lg-5">
            <div className="row gx-5">
                
                {/* --- LEFT SIDEBAR --- */}
                <div className="col-lg-3 mb-5">
                    <div className="sticky-top" style={{top: "150px"}}>
                        <MenuTab id="settings" label="Profile & Security" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <MenuTab id="addresses" label="Address Book" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <MenuTab id="orders" label="Order History" activeTab={activeTab} setActiveTab={setActiveTab} />
                        
                        <button onClick={logout} className="btn text-start p-0 mt-5 text-danger border-0 bg-transparent text-uppercase small" style={{letterSpacing: "2px", fontSize: "0.75rem"}}>
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* --- RIGHT CONTENT --- */}
                <div className="col-lg-8 offset-lg-1 fade-in-up">
                    
                    {/* >>> TAB: SETTINGS <<< */}
                    {activeTab === "settings" && (
                        <div style={{maxWidth: "600px"}}>
                            <h4 className="mb-5 text-uppercase" style={{letterSpacing: "2px", fontSize: "0.9rem"}}>Personal Details</h4>
                            <form onSubmit={updateProfile}>
                                <LuxuryInput label="Full Name" value={name} onChange={e=>setName(e.target.value)} />
                                <LuxuryInput label="Email Address" value={user.email} disabled={true} />
                                <LuxuryInput label="New Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
                                
                                <button className="btn btn-dark rounded-0 px-5 py-3 text-uppercase fw-bold mt-3" style={{letterSpacing: "2px", fontSize: "0.8rem"}}>
                                    Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {/* >>> TAB: ADDRESSES <<< */}
                    {activeTab === "addresses" && (
                        <div>
                             <div className="d-flex justify-content-between align-items-baseline mb-5">
                                <h4 className="text-uppercase m-0" style={{letterSpacing: "2px", fontSize: "0.9rem"}}>Saved Addresses</h4>
                                <button className="btn btn-link text-dark text-decoration-none text-uppercase small fw-bold" onClick={() => setIsAddingAddr(!isAddingAddr)}>
                                    {isAddingAddr ? "Cancel" : "+ Add New"}
                                </button>
                             </div>

                             {isAddingAddr && (
                                 <div className="bg-light p-4 mb-5 fade-in">
                                     <div className="row g-4">
                                         <div className="col-12"><input className="form-control border-0 border-bottom rounded-0 bg-transparent ps-0" placeholder="Street Address" value={newAddress.street} onChange={e=>setNewAddress({...newAddress, street: e.target.value})} /></div>
                                         <div className="col-6"><input className="form-control border-0 border-bottom rounded-0 bg-transparent ps-0" placeholder="City" value={newAddress.city} onChange={e=>setNewAddress({...newAddress, city: e.target.value})} /></div>
                                         <div className="col-6"><input className="form-control border-0 border-bottom rounded-0 bg-transparent ps-0" placeholder="Phone" value={newAddress.phone} onChange={e=>setNewAddress({...newAddress, phone: e.target.value})} /></div>
                                         <div className="col-12"><button className="btn btn-dark w-100 rounded-0 text-uppercase small py-3" onClick={addAddress}>Save Address</button></div>
                                     </div>
                                 </div>
                             )}

                             <div className="row g-4">
                                {user.addresses.map((addr, idx) => (
                                    <div className="col-md-6" key={idx}>
                                        <div className="p-4 border border-light h-100 position-relative bg-white" style={{boxShadow: "0 5px 20px rgba(0,0,0,0.03)"}}>
                                            <p className="fw-bold mb-2" style={{fontFamily: "'Playfair Display', serif", fontSize: "1.1rem"}}>Destination {idx + 1}</p>
                                            <p className="text-muted small mb-1">{addr.street}</p>
                                            <p className="text-muted small mb-4">{addr.city} • {addr.phone}</p>
                                            <button onClick={() => deleteAddress(addr._id)} className="btn btn-link text-danger p-0 text-decoration-none text-uppercase" style={{fontSize: "0.7rem", letterSpacing: "1px"}}>Remove</button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* >>> TAB: ORDERS <<< */}
                    {activeTab === "orders" && (
                        <div>
                            <h4 className="mb-5 text-uppercase" style={{letterSpacing: "2px", fontSize: "0.9rem"}}>Order History</h4>
                            {orders.length === 0 ? <p className="text-muted fst-italic">You have no past orders.</p> : (
                                <div className="d-flex flex-column gap-5">
                                    {orders.map(order => (
                                        <Link to={`/orders/${order._id}`} key={order._id} className="text-decoration-none text-dark">
                                            <div key={order._id} className="pb-5 border-bottom border-light">
                                                <div className="d-flex justify-content-between mb-4">
                                                    <div>
                                                        <span className="d-block fw-bold fs-5 mb-1" style={{fontFamily: "'Playfair Display', serif"}}>#{order._id.slice(-6).toUpperCase()}</span>
                                                        <span className="text-muted small text-uppercase" style={{fontSize: "0.7rem", letterSpacing: "1px"}}>{new Date(order.createdAt).toDateString()}</span>
                                                    </div>
                                                    <div className="text-end">
                                                        <span className="d-block fw-bold fs-5 mb-1">${order.totalAmount}</span>
                                                        <span className={`text-uppercase small fw-bold ${order.status === 'Delivered' ? 'text-success' : 'text-warning'}`} style={{fontSize: "0.7rem", letterSpacing: "1px"}}>● {order.status}</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Minimal Image List */}
                                                <div className="d-flex gap-3 overflow-auto scrollbar-hide">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} style={{width: "70px", height: "70px"}} className="bg-light flex-shrink-0">
                                                            <img src={item.image} className="w-100 h-100 object-fit-cover opacity-75" alt="" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
      </div>
      <style jsx>{`
        .fade-in { animation: fadeIn 0.8s ease-out; }
        .fade-in-up { animation: fadeInUp 0.8s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        input:focus { border-bottom-color: #000 !important; }
      `}</style>
    </>
  );
};

export default ProfilePage;