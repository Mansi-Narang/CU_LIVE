import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ImageIcon, DollarSign, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosClient from '../api/axiosClient';

const CreateEventForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        date: '',
        category: '',
        time: '',
        isPaid: false,
        amountPerPerson: '',
        about: '',
        image: null
    });

    const categories = [
        'Music Concert',
        'Tech Conference',
        'Workshop',
        'Cultural Event',
        'Sports Event',
        'Academic Event',
        'Other'
    ];

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const event = formData;

        if (!formData.title || !formData.about || !formData.amountPerPerson || !formData.category || !formData.date || !formData.isPaid || !formData.location || !formData.time) {
            await Swal.fire({
                toast: true,
                title: "Invalid credentials",
                icon: "error",
                position: 'top',
                showCancelButton: false,
                showConfirmButton: false,
                showDenyButton: false,
                showCloseButton: false,
                timer: 2000,
                timerProgressBar: true,
            });

            return;
        }

        const result = await axiosClient.post("/events/list", { event });
        const response = result.data;

        if (response.success) {
            await Swal.fire({
                title: "Done!",
                text: "Event got listed!",
                icon: "success"
            });
            setFormData({
                title: '',
                location: '',
                date: '',
                category: '',
                time: '',
                isPaid: false,
                amountPerPerson: '',
                about: '',
                image: null
            });
            return window.location.href = "/organizer";
        } else {
            await Swal.fire({
                icon: "error",
                title: "Event already Listed",
                text: "Add another event",
            });
            setFormData({
                title: '',
                location: '',
                date: '',
                category: '',
                time: '',
                isPaid: false,
                amountPerPerson: '',
                about: '',
                image: null
            });
            return;
        }
        // Add your form submission logic here
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Create New Event</h2>
                    <p className="mt-2 text-gray-600">Fill in the details to create your event</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Event Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 transition duration-150"
                            placeholder="Enter event title"
                            required
                        />
                    </div>

                    {/* Location and Date Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                </div>
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                placeholder="Event venue"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Date
                                </div>
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Category and Time Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Time
                                </div>
                            </label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="isPaid"
                                name="isPaid"
                                checked={formData.isPaid}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-gray-700 text-sm font-bold" htmlFor="isPaid">
                                This is a paid event
                            </label>
                        </div>
                        {formData.isPaid && (
                            <div className="ml-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amountPerPerson">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Amount per person
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    id="amountPerPerson"
                                    name="amountPerPerson"
                                    value={formData.amountPerPerson}
                                    onChange={handleInputChange}
                                    className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                                    placeholder="Enter amount"
                                />
                            </div>
                        )}
                    </div>

                    {/* About */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="about">
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                About the Event
                            </div>
                        </label>
                        <textarea
                            id="about"
                            name="about"
                            value={formData.about}
                            onChange={handleInputChange}
                            rows="4"
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            placeholder="Describe your event"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            <div className="flex items-center gap-2">
                                <ImageIcon className="w-4 h-4" />
                                Event Banner
                            </div>
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                            <div className="space-y-1 text-center">
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                        <span>Upload a file</span>
                                        <input
                                            id="image"
                                            name="image"
                                            type="file"
                                            onChange={handleInputChange}
                                            className="sr-only"
                                            accept="image/*"
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEventForm;