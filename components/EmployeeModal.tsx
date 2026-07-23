'use client';

import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { validators } from '@/utils/validation';

interface EmployeeModalProps {
  employee: Employee | null;
  onSave: (employee: Employee) => void;
  onClose: () => void;
}

export default function EmployeeModal({ employee, onSave, onClose }: EmployeeModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'personal' | 'address' | 'work' | 'bank' | 'other'>('basic');
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: 25,
    gender: 'male',
    username: '',
    salary: 50000,
    status: 'Active',
    performance: 3,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (employee) {
      setFormData(employee);
      setImagePreview(employee.image);
    }
  }, [employee]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev: any) => ({ ...prev, image: base64String }));
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const firstNameError = validators.required(formData.firstName, 'First name');
    if (firstNameError) newErrors.firstName = firstNameError;

    const lastNameError = validators.required(formData.lastName, 'Last name');
    if (lastNameError) newErrors.lastName = lastNameError;

    const emailRequiredError = validators.required(formData.email, 'Email');
    const emailFormatError = validators.email(formData.email);
    if (emailRequiredError) {
      newErrors.email = emailRequiredError;
    } else if (emailFormatError) {
      newErrors.email = emailFormatError;
    }

    const phoneError = validators.required(formData.phone, 'Phone');
    if (phoneError) newErrors.phone = phoneError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const employeeData: Employee = {
      ...employee,
      ...formData,
      id: employee?.id || Date.now(),
      image: formData.image || employee?.image || `https://robohash.org/${formData.email}`,
    } as Employee;

    onSave(employeeData);
  };

  const tabs = [
    { id: 'basic', label: '👤 Basic Info', icon: '📝' },
    { id: 'personal', label: '🧬 Personal', icon: '🎯' },
    { id: 'address', label: '📍 Address', icon: '🏠' },
    { id: 'work', label: '💼 Work Details', icon: '🏢' },
    { id: 'bank', label: '💳 Bank Account', icon: '🏦' },
    { id: 'other', label: '⚙️ Other', icon: '📋' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-900'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="First Name *"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, firstName: e.target.value }))}
                  error={errors.firstName}
                />

                <Input
                  type="text"
                  label="Last Name *"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, lastName: e.target.value }))}
                  error={errors.lastName}
                />
              </div>

              <Input
                type="email"
                label="Email *"
                value={formData.email || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                error={errors.email}
              />

              <Input
                type="tel"
                label="Phone *"
                value={formData.phone || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, phone: e.target.value }))}
                error={errors.phone}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Status"
                  value={formData.status || 'Active'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Performance: {formData.performance || 3}/5</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.performance || 3}
                    onChange={(e) => setFormData((prev: any) => ({ ...prev, performance: Number(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Personal Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Personal Details</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  label="Age"
                  value={formData.age || 25}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, age: Number(e.target.value) }))}
                />

                <Select
                  label="Gender"
                  value={formData.gender || 'male'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Select>

                <Input
                  type="date"
                  label="Birth Date"
                  value={formData.birthDate || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, birthDate: e.target.value }))}
                />

                <Input
                  type="number"
                  label="Height (cm)"
                  value={formData.height || 170}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, height: Number(e.target.value) }))}
                />

                <Input
                  type="number"
                  label="Weight (kg)"
                  value={formData.weight || 70}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, weight: Number(e.target.value) }))}
                />

                <Select
                  label="Blood Group"
                  value={formData.bloodGroup || 'O+'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, bloodGroup: e.target.value }))}
                >
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                </Select>
              </div>

              <Input
                type="text"
                label="University"
                value={formData.university || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, university: e.target.value }))}
              />
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Address Information</h3>
              
              <Input
                type="text"
                label="Street Address"
                value={formData.address?.address || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, address: { ...prev.address, address: e.target.value } }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="City"
                  value={formData.address?.city || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
                />

                <Input
                  type="text"
                  label="State"
                  value={formData.address?.state || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, address: { ...prev.address, state: e.target.value } }))}
                />

                <Input
                  type="text"
                  label="Postal Code"
                  value={formData.address?.postalCode || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, address: { ...prev.address, postalCode: e.target.value } }))}
                />

                <Input
                  type="text"
                  label="Country"
                  value={formData.address?.country || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, address: { ...prev.address, country: e.target.value } }))}
                />
              </div>
            </div>
          )}

          {/* Work Tab */}
          {activeTab === 'work' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Work Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Department"
                  value={formData.company?.department || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, department: e.target.value } }))}
                />

                <Input
                  type="text"
                  label="Job Title"
                  value={formData.company?.title || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, company: { ...prev.company, title: e.target.value } }))}
                />

                <Select
                  label="Role"
                  value={formData.role || 'user'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, role: e.target.value }))}
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="user">User</option>
                </Select>

                <Input
                  type="date"
                  label="Join Date"
                  value={formData.joinDate || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, joinDate: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Salary"
                  value={formData.salary || 50000}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, salary: Number(e.target.value) }))}
                />

                <Select
                  label="Currency"
                  value={formData.bank?.currency || 'USD'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, bank: { ...prev.bank, currency: e.target.value } }))}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="PKR">PKR</option>
                  <option value="INR">INR</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                  <option value="JPY">JPY</option>
                  <option value="CNY">CNY</option>
                </Select>
              </div>
            </div>
          )}

          {/* Bank Tab */}
          {activeTab === 'bank' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Bank Account Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Card Type"
                  value={formData.bank?.cardType || 'Visa'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, bank: { ...prev.bank, cardType: e.target.value } }))}
                >
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="American Express">American Express</option>
                  <option value="Discover">Discover</option>
                  <option value="JCB">JCB</option>
                  <option value="UnionPay">UnionPay</option>
                  <option value="Diners Club International">Diners Club</option>
                </Select>

                <Input
                  type="text"
                  label="Card Number"
                  value={formData.bank?.cardNumber || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, bank: { ...prev.bank, cardNumber: e.target.value } }))}
                  placeholder="1234 5678 9012 3456"
                />

                <Input
                  type="text"
                  label="Card Expiry (MM/YY)"
                  value={formData.bank?.cardExpire || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, bank: { ...prev.bank, cardExpire: e.target.value } }))}
                  placeholder="12/28"
                />

                <Select
                  label="Currency"
                  value={formData.bank?.currency || 'USD'}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, bank: { ...prev.bank, currency: e.target.value } }))}
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="PKR">PKR - Pakistani Rupee</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="NZD">NZD - New Zealand Dollar</option>
                </Select>
              </div>

              <Input
                type="text"
                label="IBAN"
                value={formData.bank?.iban || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, bank: { ...prev.bank, iban: e.target.value } }))}
                placeholder="DE89370400440532013000"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="SSN"
                  value={formData.ssn || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, ssn: e.target.value }))}
                  placeholder="123-45-6789"
                />

                <Input
                  type="text"
                  label="EIN"
                  value={formData.ein || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, ein: e.target.value }))}
                  placeholder="12-3456789"
                />
              </div>
            </div>
          )}

          {/* Other Tab */}
          {activeTab === 'other' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Additional Information</h3>
              
              <Input
                type="text"
                label="Username"
                value={formData.username || ''}
                onChange={(e) => setFormData((prev: any) => ({ ...prev, username: e.target.value }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData((prev: any) => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Additional notes about the employee..."
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
            >
              {employee ? 'Save Changes' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
