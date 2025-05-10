
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProfileForm = ({ profile, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    proprietorName: '',
    phone: '',
    email: '',
    tradeLicense: '',
    businessType: '',
    establishmentYear: '',
    businessHours: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    profileImage: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                className="form-input mt-1"
              />
            </div>

            <div>
              <label htmlFor="proprietorName" className="block text-sm font-medium text-gray-700">
                Proprietor Name *
              </label>
              <input
                type="text"
                id="proprietorName"
                name="proprietorName"
                value={formData.proprietorName}
                onChange={handleChange}
                required
                className="form-input mt-1"
              />
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                Business Type *
              </label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
                className="form-input mt-1"
              >
                <option value="">Select a business type</option>
                <option value="Beauty & Wellness">Beauty & Wellness</option>
                <option value="Car Rental">Car Rental</option>
                <option value="Tuition">Tuition</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrician">Electrician</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="tradeLicense" className="block text-sm font-medium text-gray-700">
                Trade License Number
              </label>
              <input
                type="text"
                id="tradeLicense"
                name="tradeLicense"
                value={formData.tradeLicense}
                onChange={handleChange}
                className="form-input mt-1"
              />
            </div>

            <div>
              <label htmlFor="establishmentYear" className="block text-sm font-medium text-gray-700">
                Establishment Year
              </label>
              <input
                type="number"
                id="establishmentYear"
                name="establishmentYear"
                value={formData.establishmentYear}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className="form-input mt-1"
              />
            </div>

            <div>
              <label htmlFor="businessHours" className="block text-sm font-medium text-gray-700">
                Business Hours
              </label>
              <input
                type="text"
                id="businessHours"
                name="businessHours"
                value={formData.businessHours}
                onChange={handleChange}
                placeholder="e.g. Mon-Fri: 9AM-5PM"
                className="form-input mt-1"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="form-input mt-1"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input mt-1"
              />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="form-input mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="form-input mt-1"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State/Province *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="form-input mt-1"
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  ZIP/Postal Code *
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="form-input mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Image</h3>
          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
              Profile Image URL
            </label>
            <input
              type="text"
              id="profileImage"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              className="form-input mt-1"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
