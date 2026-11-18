import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../config/api';
import AdminNavbar from '../../components/AdminNavbar';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.post('/api/order/list');
      console.log('Orders response:', response.data);
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        if (response.data.message === 'jwt expired') {
          toast.error('Session expired. Please login again.');
          // Redirect will be handled by API interceptor
          return;
        }
        console.error('Failed to fetch orders:', response.data.message);
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to fetch orders: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await api.post('/api/order/status', {
        orderId,
        status: newStatus
      });

      if (response.data.success) {
        toast.success('Order status updated successfully');
        fetchOrders();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('Error updating order status');
      console.error('Error:', error);
    }
  };

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const response = await api.post('/api/order/payment-status', {
        orderId,
        payment: paymentStatus
      });

      if (response.data.success) {
        toast.success('Payment status updated successfully');
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({...selectedOrder, payment: paymentStatus});
        }
      } else {
        toast.error(response.data.message || 'Failed to update payment status');
      }
    } catch (error) {
      toast.error('Error updating payment status');
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'bg-blue-100 text-blue-800',
      'Packing': 'bg-yellow-100 text-yellow-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Out for delivery': 'bg-orange-100 text-orange-800',
      'Delivered': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusOptions = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(Number(value) || 0);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return orders
      .filter((order) => {
        const customerName = order.userId?.name
          || `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.trim();
        const email = order.userId?.email || order.address?.email || '';
        const searchableItems = order.items?.map((item) => item.name).join(' ') || '';
        const matchesSearch = !normalizedSearch || [
          order._id,
          customerName,
          email,
          searchableItems
        ].some((value) => String(value || '').toLowerCase().includes(normalizedSearch));
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesPayment = paymentFilter === 'all'
          || (paymentFilter === 'paid' && order.payment)
          || (paymentFilter === 'unpaid' && !order.payment);

        return matchesSearch && matchesStatus && matchesPayment;
      })
      .sort((firstOrder, secondOrder) => {
        const firstDate = new Date(firstOrder.date).getTime();
        const secondDate = new Date(secondOrder.date).getTime();

        if (sortBy === 'oldest') return firstDate - secondDate;
        if (sortBy === 'amount-high') return Number(secondOrder.amount) - Number(firstOrder.amount);
        if (sortBy === 'amount-low') return Number(firstOrder.amount) - Number(secondOrder.amount);
        return secondDate - firstDate;
      });
  }, [orders, paymentFilter, searchTerm, sortBy, statusFilter]);

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || sortBy !== 'newest';

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setSortBy('newest');
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                  <p className="text-gray-600 mt-2">View and manage all customer orders</p>
                </div>
                <p className="text-sm font-medium text-gray-500">
                  Showing <span className="text-gray-900">{filteredOrders.length}</span> of {orders.length} orders
                </p>
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_190px_170px_180px_auto]">
                <label className="relative block">
                  <span className="sr-only">Search orders</span>
                  <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search ID, customer, email or item"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-[#7d263d] focus:ring-2 focus:ring-[#7d263d]/15"
                  />
                </label>

                <label>
                  <span className="sr-only">Filter by order status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#7d263d] focus:ring-2 focus:ring-[#7d263d]/15"
                  >
                    <option value="all">All statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="sr-only">Filter by payment status</span>
                  <select
                    value={paymentFilter}
                    onChange={(event) => setPaymentFilter(event.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#7d263d] focus:ring-2 focus:ring-[#7d263d]/15"
                  >
                    <option value="all">All payments</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </label>

                <label>
                  <span className="sr-only">Sort orders</span>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#7d263d] focus:ring-2 focus:ring-[#7d263d]/15"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="amount-high">Amount: high to low</option>
                    <option value="amount-low">Amount: low to high</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No orders found</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="px-6 py-14 text-center">
                  <p className="text-base font-semibold text-gray-900">No matching orders</p>
                  <p className="mt-1 text-sm text-gray-500">Try changing or clearing the filters.</p>
                  <button type="button" onClick={clearFilters} className="mt-5 rounded-full bg-[#1d1a17] px-5 py-2 text-sm font-semibold text-white">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1180px] table-fixed divide-y divide-gray-200">
                    <colgroup>
                      <col style={{ width: '10%' }} />
                      <col style={{ width: '17%' }} />
                      <col style={{ width: '23%' }} />
                      <col style={{ width: '9%' }} />
                      <col style={{ width: '9%' }} />
                      <col style={{ width: '11%' }} />
                      <col style={{ width: '9%' }} />
                      <col style={{ width: '12%' }} />
                    </colgroup>
                    <thead className="bg-gray-50">
                      <tr>
                        {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map((heading) => (
                          <th key={heading} className="px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order._id} className="align-top transition-colors hover:bg-gray-50/80">
                          <td className="px-4 py-5 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{order._id.slice(-8)}</div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="truncate text-sm font-medium text-gray-900" title={order.userId?.name || `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.trim() || 'N/A'}>
                              {order.userId?.name || `${order.address?.firstName || ''} ${order.address?.lastName || ''}`.trim() || 'N/A'}
                            </div>
                            <div className="mt-0.5 truncate text-xs text-gray-500" title={order.userId?.email || order.address?.email}>{order.userId?.email || order.address?.email}</div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="space-y-1 text-sm text-gray-900">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="truncate" title={`${item.name} x${item.quantity} (${item.size})`}>
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-gray-500"> &times;{item.quantity} ({item.size})</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap">
                            <div className="text-sm font-semibold tabular-nums text-gray-900">{formatCurrency(order.amount)}</div>
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.paymentMethod}</div>
                            <div className={`text-xs ${order.payment ? 'text-green-600' : 'text-red-600'}`}>
                              {order.payment ? 'Paid' : 'Unpaid'}
                            </div>
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-5 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(order.date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => viewOrderDetails(order)}
                                className="w-full rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                              >
                                View
                              </button>
                              <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                aria-label={`Update status for order ${order._id.slice(-8)}`}
                                className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7d263d]/20"
                              >
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">#{selectedOrder._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-medium">{new Date(selectedOrder.date).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`font-medium ${selectedOrder.payment ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedOrder.payment ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">Customer Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{selectedOrder.userId?.name || selectedOrder.address?.firstName + ' ' + selectedOrder.address?.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{selectedOrder.userId?.email || selectedOrder.address?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedOrder.address?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded text-sm">
                  <p className="font-medium">{selectedOrder.address?.firstName} {selectedOrder.address?.lastName}</p>
                  <p className="text-gray-600 mt-1">{selectedOrder.address?.street}</p>
                  <p className="text-gray-600">{selectedOrder.address?.city}, {selectedOrder.address?.state} {selectedOrder.address?.zipcode}</p>
                  <p className="text-gray-600">{selectedOrder.address?.country}</p>
                  <p className="text-gray-600 mt-2">Phone: {selectedOrder.address?.phone}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900">Order Items</h3>
                <div className="border border-gray-200 rounded overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="flex items-center">
                              {item.image && (
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded mr-3" />
                              )}
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(item.price)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.size}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(selectedOrder.amount - 10)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="font-medium">{formatCurrency(10)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Order Status:</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => {
                        updateOrderStatus(selectedOrder._id, e.target.value);
                        setSelectedOrder({...selectedOrder, status: e.target.value});
                      }}
                      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Payment Status:</label>
                    <button
                      onClick={() => updatePaymentStatus(selectedOrder._id, !selectedOrder.payment)}
                      className={`px-4 py-2 rounded font-medium transition-colors ${
                        selectedOrder.payment
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {selectedOrder.payment ? '✓ Paid' : '✗ Unpaid'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => window.print()}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Print Invoice
                  </button>
                  <button
                    onClick={closeModal}
                    className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrders;
