"use client"
import React, { useEffect, useState } from 'react';
import { NextResponse } from "next/server";
import AppointmentForm from '@/components/AppointmentForm'; // Import the AppointmentForm component

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAppointmentForm, setShowAppointmentForm] = useState(false); // State variable to track whether to display the appointment form

    // Define fetchAppointments function
    const fetchAppointments = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/appointment");
            if (!response.ok) {
                throw new Error("Failed to fetch appointments");
            }
            const data = await response.json();
            setAppointments(data.appointments);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    // Function to handle changing the status of an appointment
    const changeStatus = async (appointmentId, newStatus) => {
        try {
            // Update the status of the appointment in the backend
            const response = await fetch(`http://localhost:3000/api/appointment/${appointmentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) {
                throw new Error("Failed to update appointment status");
            }
            // Fetch updated appointments after status change
            fetchAppointments();
        } catch (error) {
            console.error("Error updating appointment status:", error);
        }
    };

    // Function to handle deleting an appointment
    const deleteAppointment = async (appointmentId) => {
        try {
            // Delete the appointment from the backend
            const response = await fetch(`http://localhost:3000/api/appointment/${appointmentId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error("Failed to delete appointment");
            }
            // Fetch updated appointments after deletion
            fetchAppointments();
        } catch (error) {
            console.error("Error deleting appointment:", error);
        }
    };

    return (
        <div className="relative overflow-x-auto sm:rounded-lg">
            <div className='flex items-center justify-between my-4'>
                <h1 className="text-xl font-bold mb-4">Appointments Management</h1>
                {/* Button to toggle display of appointment form */}
                {!showAppointmentForm && (
                    <button onClick={() => setShowAppointmentForm(true)} className="px-4 py-2 rounded text-white bg-zinc hover:bg-zinc/[0.9]">
                        Add Appointment
                    </button>
                )}
            </div>

            {/* Conditionally render the AppointmentForm component */}
            {showAppointmentForm && <AppointmentForm />}
            
            {/* Conditionally render the table */}
            {!showAppointmentForm && (
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
                                Car VIN
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Service Type
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Appointment Date
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
                        ) : appointments && appointments.length > 0 ? (
                            appointments.map((appointment, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    {/* Table data */}
                                    <td className="w-4 p-4">
                                        {/* Checkbox input */}
                                    </td>
                                    <td className="px-6 py-4 flex items-center">
                                        {/* Client name and email */}
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{appointment.customerFirstName} {appointment.customerLastName}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.customerEmail}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{appointment.phoneNumber}</td>
                                    <td className="px-6 py-4">{appointment.carVIN}</td>
                                    <td className="px-6 py-4">{appointment.serviceType}</td>
                                    <td className="px-6 py-4">{appointment.appointmentDateOptions[0].date}</td>
                                    <td className="px-6 py-4">
                                        {/* Status dropdown */}
                                        <select
                                            value={appointment.status}
                                            onChange={(e) => changeStatus(appointment._id, e.target.value)}
                                            className={`block w-full py-2 px-3 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                        >
                                            <option style={{ backgroundColor: '#fff', color: appointment.status === 'Confirmed' ? '#0F9D58' : '#000' }} value="Confirmed">Confirmed</option>
                                            <option style={{ backgroundColor: '#fff', color: appointment.status === 'Pending' ? '#FFD33D' : '#000' }} value="Pending">Pending</option>
                                            <option style={{ backgroundColor: '#fff', color: appointment.status === 'Declined' ? '#DB4437' : '#000' }} value="Declined">Declined</option>
                                        </select>



                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Delete button */}
                                        <button
                                            onClick={() => deleteAppointment(appointment._id)}
                                            className="inline-flex items-start px-4 py-2 rounded-md shadow-sm text-sm font-medium text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No appointments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Appointments;
