import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import AdminNavbar from '../../components/AdminNavbar';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const [orderStatsResult, productCountResult, userStatsResult] = await Promise.allSettled([
        api.get('/api/order/stats'),
        api.get('/api/product/count'),
        api.get('/api/user/stats')
      ]);

      const orderStatsRes = orderStatsResult.status === 'fulfilled' ? orderStatsResult.value : null;
      const productsRes = productCountResult.status === 'fulfilled' ? productCountResult.value : null;
      const userStatsRes = userStatsResult.status === 'fulfilled' ? userStatsResult.value : null;
      
      setStats((previous) => ({
        totalProducts: productsRes?.data.success ? productsRes.data.count : previous.totalProducts,
        totalOrders: orderStatsRes?.data.success ? orderStatsRes.data.stats.totalOrders : previous.totalOrders,
        totalUsers: userStatsRes?.data.success ? userStatsRes.data.stats.totalUsers : previous.totalUsers,
        totalRevenue: orderStatsRes?.data.success ? orderStatsRes.data.stats.totalRevenue : previous.totalRevenue
      }));
      if (orderStatsRes?.data.success) {
        setRecentOrders(orderStatsRes.data.stats.recentOrders || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const aov = stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(2) : '0.00';

  const getStatusBadge = (status) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('delivered')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    }
    if (s.includes('ship') || s.includes('transit') || s.includes('out for delivery')) {
      return 'bg-blue-50 text-blue-700 border-blue-200/80';
    }
    if (s.includes('cancel')) {
      return 'bg-rose-50 text-rose-700 border-rose-200/80';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200/80';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbf9f5]">
        <AdminNavbar />
        <div className="pt-32 pb-20 px-4 sm:px-[5vw] max-w-7xl mx-auto animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-12 w-80 bg-gray-200 rounded-lg mb-10"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-white rounded-2xl border border-gray-200/70 p-6"></div>
            ))}
          </div>
          <div className="h-96 bg-white rounded-2xl border border-gray-200/70"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1d1a17]">
      <AdminNavbar />
      
      <main className="pt-28 sm:pt-32 pb-20 px-4 sm:px-[5vw] md:px-[6vw] lg:px-[7vw]">
        <div className="max-w-7xl mx-auto">
          
          {/* Top Bar: Title & Live Indicator */}
          <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[#ded7cc]/60 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#b4935f]">Store Intelligence & Operations</span>
              </div>
              <h1 className="editorial-title !text-3xl sm:!text-4xl lg:!text-[2.75rem] text-[#1d1a17]">
                Executive Dashboard
              </h1>
              <p className="mt-2 text-sm text-[#746d65]">
                Real-time performance, inventory health, and customer fulfillment status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#ded7cc] bg-white/80 px-4 py-2 text-xs font-medium text-[#746d65] shadow-sm backdrop-blur">
                <svg className="w-3.5 h-3.5 text-[#b4935f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>

              <button
                type="button"
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-full border border-[#ded7cc] bg-white px-4 py-2 text-xs font-semibold text-[#1d1a17] transition hover:border-[#7d263d] hover:text-[#7d263d] shadow-sm disabled:opacity-50"
                title="Refresh metrics"
              >
                <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#7d263d]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{refreshing ? 'Refreshing...' : 'Sync'}</span>
              </button>
            </div>
          </header>

          {/* 4 Metric KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10" aria-label="Key performance indicators">
            
            {/* 1: Total Revenue */}
            <div className="relative overflow-hidden rounded-2xl border border-[#ded7cc]/80 bg-white p-6 shadow-[0_8px_24px_rgba(29,26,23,0.04)] transition hover:shadow-[0_12px_32px_rgba(29,26,23,0.08)] hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#746d65]">Gross Revenue</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1d1a17] text-[#fffdf9] shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-[#1d1a17] sm:text-4xl">
                ${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-[#746d65]">
                <span>Settled payments</span>
                <span className="font-semibold text-[#b4935f]">AOV: ${aov}</span>
              </div>
            </div>

            {/* 2: Total Orders */}
            <div className="relative overflow-hidden rounded-2xl border border-[#ded7cc]/80 bg-white p-6 shadow-[0_8px_24px_rgba(29,26,23,0.04)] transition hover:shadow-[0_12px_32px_rgba(29,26,23,0.08)] hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#746d65]">Total Orders</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#7d263d]/10 text-[#7d263d] border border-[#7d263d]/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-[#1d1a17] sm:text-4xl">
                {stats.totalOrders}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-[#746d65]">
                <span>Lifetime purchases</span>
                <Link to="/admin/orders" className="font-semibold text-[#7d263d] hover:underline">View all →</Link>
              </div>
            </div>

            {/* 3: Total Products */}
            <div className="relative overflow-hidden rounded-2xl border border-[#ded7cc]/80 bg-white p-6 shadow-[0_8px_24px_rgba(29,26,23,0.04)] transition hover:shadow-[0_12px_32px_rgba(29,26,23,0.08)] hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#746d65]">Catalogue Items</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#b4935f]/15 text-[#8b6b3b] border border-[#b4935f]/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-[#1d1a17] sm:text-4xl">
                {stats.totalProducts}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-[#746d65]">
                <span>Active in store</span>
                <Link to="/admin/products" className="font-semibold text-[#b4935f] hover:underline">Manage →</Link>
              </div>
            </div>

            {/* 4: Total Users */}
            <div className="relative overflow-hidden rounded-2xl border border-[#ded7cc]/80 bg-white p-6 shadow-[0_8px_24px_rgba(29,26,23,0.04)] transition hover:shadow-[0_12px_32px_rgba(29,26,23,0.08)] hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#746d65]">Registered Clients</span>
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#5f5851]/10 text-[#1d1a17] border border-[#ded7cc]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-[#1d1a17] sm:text-4xl">
                {stats.totalUsers}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-[#746d65]">
                <span>Customer accounts</span>
                <Link to="/admin/users" className="font-semibold text-[#1d1a17] hover:underline">Directory →</Link>
              </div>
            </div>

          </section>

          {/* Main Grid: Recent Orders (8 cols) + Management Suite (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Recent Orders */}
            <div className="lg:col-span-8">
              <div className="rounded-2xl border border-[#ded7cc]/80 bg-white shadow-[0_8px_24px_rgba(29,26,23,0.04)] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#ded7cc]/60">
                  <div>
                    <h2 className="text-lg font-bold text-[#1d1a17]">Recent Orders</h2>
                  </div>
                  <Link
                    to="/admin/orders"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7d263d] hover:underline"
                  >
                    <span>View all orders</span>
                    <span>→</span>
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#f8f5ef] border border-[#ded7cc] text-[#746d65]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-semibold text-[#1d1a17]">No orders yet</h3>
                    <p className="mt-1 text-xs text-[#746d65] max-w-sm mx-auto">
                      Transactions will automatically appear here as customers complete checkout on the store.
                    </p>
                    <Link
                      to="/"
                      className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#ded7cc] bg-[#f8f5ef] px-4 py-2 text-xs font-semibold text-[#1d1a17] transition hover:border-[#1d1a17] hover:bg-white"
                    >
                      <span>Preview Storefront</span>
                      <span>↗</span>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#ded7cc]/50">
                      <thead className="bg-[#fcfbf9] text-[11px] font-bold uppercase tracking-wider text-[#746d65]">
                        <tr>
                          <th className="px-6 py-3.5 text-left">Order ID</th>
                          <th className="px-6 py-3.5 text-left">Customer</th>
                          <th className="px-6 py-3.5 text-left">Amount</th>
                          <th className="px-6 py-3.5 text-left">Status</th>
                          <th className="px-6 py-3.5 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ded7cc]/40 text-sm">
                        {recentOrders.map((order) => (
                          <tr key={order._id} className="transition hover:bg-[#faf8f4]">
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs font-semibold text-[#1d1a17]">
                              #{order._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="grid h-8 w-8 place-items-center rounded-full bg-[#f3eee5] text-xs font-bold text-[#7d263d]">
                                  {(order.userId?.name || 'C').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-medium text-[#1d1a17]">{order.userId?.name || 'Guest Customer'}</p>
                                  <p className="text-[11px] text-[#746d65]">{order.userId?.email || 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-semibold text-[#1d1a17]">
                              ${Number(order.amount).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${getStatusBadge(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-xs text-[#746d65]">
                              {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Quick Management & Store Summary */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Management Shortcuts */}
              <div className="rounded-2xl border border-[#ded7cc]/80 bg-white p-6 shadow-[0_8px_24px_rgba(29,26,23,0.04)]">
                <h2 className="mb-5 text-base font-bold text-[#1d1a17]">Management Suite</h2>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/admin/products"
                    className="group flex items-center justify-between rounded-xl border border-[#ded7cc]/70 bg-[#fbf9f5] p-3.5 transition hover:border-[#7d263d] hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#b4935f]/15 text-[#8b6b3b] group-hover:bg-[#7d263d] group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1d1a17] group-hover:text-[#7d263d] transition-colors">Product Catalogue</p>
                        <p className="text-[11px] text-[#746d65]">Add, edit, or adjust inventory</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#746d65] group-hover:translate-x-1 group-hover:text-[#7d263d] transition-all">→</span>
                  </Link>

                  <Link
                    to="/admin/orders"
                    className="group flex items-center justify-between rounded-xl border border-[#ded7cc]/70 bg-[#fbf9f5] p-3.5 transition hover:border-[#7d263d] hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#7d263d]/10 text-[#7d263d] group-hover:bg-[#7d263d] group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1d1a17] group-hover:text-[#7d263d] transition-colors">Order Processing</p>
                        <p className="text-[11px] text-[#746d65]">Fulfill & update order status</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#746d65] group-hover:translate-x-1 group-hover:text-[#7d263d] transition-all">→</span>
                  </Link>

                  <Link
                    to="/admin/users"
                    className="group flex items-center justify-between rounded-xl border border-[#ded7cc]/70 bg-[#fbf9f5] p-3.5 transition hover:border-[#7d263d] hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#1d1a17]/10 text-[#1d1a17] group-hover:bg-[#1d1a17] group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1d1a17] group-hover:text-[#7d263d] transition-colors">Customer Directory</p>
                        <p className="text-[11px] text-[#746d65]">Accounts and profiles</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-[#746d65] group-hover:translate-x-1 group-hover:text-[#7d263d] transition-all">→</span>
                  </Link>
                </div>
              </div>

              {/* Store Health Card */}
              <div className="rounded-2xl border border-[#ded7cc]/80 bg-gradient-to-br from-[#1d1a17] to-[#2d2823] p-6 text-white shadow-[0_8px_24px_rgba(29,26,23,0.12)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#dfbd91]">System Health</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-400/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    Operational
                  </span>
                </div>

                <h3 className="text-lg font-bold">Loomora Store Engine</h3>
                <p className="text-xs text-white/70 mt-1 mb-5">Cloud database, image storage and checkout pipelines are operating normally.</p>

                <div className="space-y-3 border-t border-white/10 pt-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Cloudinary Media</span>
                    <span className="font-semibold text-white/90">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Payment Gateways</span>
                    <span className="font-semibold text-white/90">Stripe & Razorpay</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Catalogue Items</span>
                    <span className="font-semibold text-[#dfbd91]">{stats.totalProducts} Live in store</span>
                  </div>
                </div>

                <Link
                  to="/"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#1d1a17]"
                >
                  <span>Open Public Storefront</span>
                  <span>↗</span>
                </Link>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
