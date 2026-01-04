import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, totalUsers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if token exists
        const token = localStorage.getItem('token');
        console.log('🔑 Token exists:', !!token);
        console.log('🔑 Token value:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
        
        const [ordersRes, statsRes] = await Promise.all([
             axiosClient.get("/orders"),
             axiosClient.get("/stats")
        ]);
        console.log('Orders response:', ordersRes.data);
        console.log('Stats response:', statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5)); 
        setStats(statsRes.data);
      } catch (error) { 
        console.error('Dashboard fetch error:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
      } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const StatCard = ({ label, value, subLabel }) => (
      <div className="col-md-3">
          <div className="bg-white p-4 h-100 d-flex flex-column justify-content-between position-relative overflow-hidden group-hover" style={{boxShadow: "0 2px 10px rgba(0,0,0,0.03)"}}>
              <p className="text-muted text-uppercase small fw-bold mb-1" style={{letterSpacing: "1px", fontSize: "0.7rem"}}>{label}</p>
              <h2 className="display-5 mb-0" style={{fontFamily: "'Playfair Display', serif"}}>{value}</h2>
              {subLabel && <div className="mt-3 pt-3 border-top w-25"><small className="text-success fw-bold" style={{fontSize: "0.7rem"}}>{subLabel}</small></div>}
          </div>
      </div>
  );

  return (
    <>
      <div className="mb-5">
          <h1 className="display-5" style={{fontFamily: "'Playfair Display', serif"}}>Dashboard Overview</h1>
          <p className="text-muted">Here is what's happening with your store today.</p>
      </div>

      <div className="row g-4 mb-5">
          <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} subLabel="+12% from last month" />
          <StatCard label="Total Orders" value={stats.totalOrders} subLabel="+5 new today" />
          <StatCard label="Products" value={stats.totalProducts} subLabel="In Inventory" />
          <StatCard label="Customers" value={stats.totalUsers} subLabel="Active Users" />
      </div>

      <div className="bg-white p-5" style={{boxShadow: "0 5px 20px rgba(0,0,0,0.02)"}}>
          <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                  <h4 style={{fontFamily: "'Playfair Display', serif"}}>Recent Orders</h4>
                  <p className="text-muted small m-0">Latest transaction history</p>
              </div>
              <Link to="/admin/products" className="btn btn-outline-dark rounded-0 text-uppercase small fw-bold px-4">View All Products</Link>
          </div>

          <div className="table-responsive">
              <table className="table align-middle">
                  <thead className="text-uppercase small text-muted" style={{fontSize: "0.7rem", letterSpacing: "1px"}}>
                      <tr>
                          <th className="fw-normal border-0 pb-3">Order ID</th>
                          <th className="fw-normal border-0 pb-3">Customer</th>
                          <th className="fw-normal border-0 pb-3">Date</th>
                          <th className="fw-normal border-0 pb-3">Amount</th>
                          <th className="fw-normal border-0 pb-3 text-end">Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      {recentOrders.map(order => (
                          <tr key={order._id} style={{borderBottom: "1px solid #f9f9f9"}}>
                              <td className="py-4 fw-bold">#{order._id.slice(-6).toUpperCase()}</td>
                              <td className="py-4">
                                  <div className="d-flex align-items-center">
                                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3 fw-bold small text-muted" style={{width: "35px", height: "35px"}}>
                                          {order.customer.name.charAt(0)}
                                      </div>
                                      <span className="fw-bold text-dark" style={{fontSize: "0.9rem"}}>{order.customer.name}</span>
                                  </div>
                              </td>
                              <td className="text-muted small py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                              <td className="fw-bold py-4">${order.totalAmount}</td>
                              <td className="text-end py-4">
                                  <span className={`badge rounded-0 fw-normal text-uppercase px-3 py-2 ${
                                      order.status === 'Delivered' ? 'bg-success bg-opacity-10 text-success' : 
                                      order.status === 'Pending' ? 'bg-warning bg-opacity-10 text-dark' : 'bg-primary bg-opacity-10 text-primary'
                                  }`} style={{letterSpacing: "1px", fontSize: "0.65rem"}}>
                                      {order.status}
                                  </span>
                              </td>
                          </tr>
                      ))}
                      {recentOrders.length === 0 && <tr><td colSpan="5" className="text-center py-5 text-muted">No orders found.</td></tr>}
                  </tbody>
              </table>
          </div>
      </div>
    </>
  );
};

export default AdminDashboard;