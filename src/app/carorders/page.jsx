"use client"
import React, { useEffect, useState } from 'react';
import OrderForm from '@/components/OrderForm'; // Import the OrderForm component

function CarOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOrderForm, setShowOrderForm] = useState(false); // State variable to track whether to display the order form

    // Define fetchCarOrders function
    const fetchCarOrders = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/carpurchase");
            if (!response.ok) {
                throw new Error("Failed to fetch car orders");
            }
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching car orders:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarOrders();
    }, []);

    // Function to handle changing the status of an order
    const changeStatus = async (orderId, newStatus) => {
        try {
            // Update the status of the order in the backend
            const response = await fetch(`http://localhost:3000/api/carpurchase/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) {
                throw new Error("Failed to update order status");
            }
            // Fetch updated orders after status change
            fetchCarOrders();
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    // Function to handle deleting an order
    const deleteOrder = async (orderId) => {
        try {
            // Delete the order from the backend
            const response = await fetch(`http://localhost:3000/api/carpurchase/${orderId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error("Failed to delete order");
            }
            // Fetch updated orders after deletion
            fetchCarOrders();
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    return (
        <div className="relative overflow-x-auto sm:rounded-lg">
            <div className='flex items-center justify-between my-4'>
            <h1 className="text-xl font-bold mb-4">Orders Management</h1>
           {/* Button to toggle display of order form */}
           {!showOrderForm && (
               <button onClick={() => setShowOrderForm(true)} className="px-4 py-2 rounded text-white bg-zinc hover:bg-zinc/[0.9]">
                    Add Order
                </button>
            )}
            </div>

            {/* Conditionally render the OrderForm component */}
            {showOrderForm && <OrderForm />}
            {/* Conditionally render the table */}
            {!showOrderForm && (
            <table className="w-full mt-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="p-4">
                            {/* Checkbox */}
                            {/* Place your checkbox input here */}
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Phone Number
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Model
                        </th>
                        <th scope="col" className="px-6 py-3">
                            VIN
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Year
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="7" className="text-center py-4">Loading...</td>
                        </tr>
                    ) : orders && orders.length > 0 ? (
                        orders.map((order, index) => (
                            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                {/* Table data */}
                                <td className="w-4 p-4">
                                    {/* Checkbox input */}
                                </td>
                                <td className="px-6 py-4 flex items-center">
                                    {/* Client name and email */}
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{order.firstName} {order.lastName}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{order.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{order.phoneNumber}</td>
                                <td className="px-6 py-4">{order.model}</td>
                                <td className="px-6 py-4">{order.vin}</td>
                                <td className="px-6 py-4">{order.year}</td>
                                <td className="px-6 py-4">
                                    {/* Status dropdown */}
                                    <select
                                        value={order.status}
                                        onChange={(e) => changeStatus(order._id, e.target.value)}
                                        className={`block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    >
                                        <option style={{ backgroundColor: '#fff', color: order.status === 'confirmed' ? '#0F9D58' : '#000' }} value="confirmed">Confirmed</option>
                                        <option style={{ backgroundColor: '#fff', color: order.status === 'pending' ? '#FFD33D' : '#000' }} value="pending">Pending</option>
                                        <option style={{ backgroundColor: '#fff', color: order.status === 'declined' ? '#DB4437' : '#000' }} value="declined">Declined</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    {/* Delete button */}
                                    <button
                                        onClick={() => deleteOrder(order._id)}
                                        className="inline-flex items-start px-4 py-2 rounded-md shadow-sm text-sm font-medium text-red-500"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4">No orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
              )}
        </div>
    );
}

export default CarOrders;
