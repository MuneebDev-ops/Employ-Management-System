'use client';

import { Employee } from '@/types/employee';
import Image from 'next/image';

interface EmployeeDetailsModalProps {
  employee: Employee;
  onClose: () => void;
}

export default function EmployeeDetailsModal({ employee, onClose }: EmployeeDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Complete Employee Details
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Profile Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-primary-500">
                <Image
                  src={employee.image}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {employee.firstName} {employee.lastName}
                  {employee.maidenName && <span className="text-gray-500"> (née {employee.maidenName})</span>}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">{employee.company.title}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    employee.status === 'Active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {employee.status}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 capitalize">
                    {employee.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Username</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.username}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Age</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.age || 'N/A'} years</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Gender</p>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{employee.gender || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Birth Date</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.birthDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Join Date</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.joinDate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Performance</p>
                <p className="text-sm text-gray-900 dark:text-white">{'★'.repeat(employee.performance || 0)} ({employee.performance || 0}/5)</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📧 Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Phone</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.phone}</p>
              </div>
            </div>
          </div>

          {/* Physical Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              👤 Physical Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Height</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.height || 'N/A'} cm</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Weight</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.weight || 'N/A'} kg</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Eye Color</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.eyeColor || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Blood Group</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.bloodGroup || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Hair Color</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.hair?.color || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Hair Type</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.hair?.type || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              📍 Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Street Address</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.address?.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">City</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.address?.city || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">State</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.address?.state || 'N/A'} ({employee.address?.stateCode || 'N/A'})</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Postal Code</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.address?.postalCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Country</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.address?.country || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🎓 Education
            </h4>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">University</p>
              <p className="text-sm text-gray-900 dark:text-white">{employee.university || 'N/A'}</p>
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🏢 Company Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Company Name</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.company.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Department</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.company.department}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Job Title</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.company.title}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Salary</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.bank?.currency || 'USD'} {employee.salary?.toLocaleString() || '0'}/year</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Company Address</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {employee.company.address?.address || 'N/A'}, {employee.company.address?.city || 'N/A'}, {employee.company.address?.state || 'N/A'} {employee.company.address?.postalCode || ''}, {employee.company.address?.country || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              💳 Bank Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Card Type</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.bank?.cardType || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Card Number</p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">**** **** **** {employee.bank?.cardNumber?.slice(-4) || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Card Expiry</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.bank?.cardExpire || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Currency</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.bank?.currency || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">IBAN</p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">{employee.bank?.iban || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Tax & Security */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              🔒 Tax & Security Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">SSN</p>
                <p className="text-sm text-gray-900 dark:text-white font-mono">***-**-{employee.ssn?.slice(-4) || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">EIN</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.ein || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Crypto Wallet */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              ₿ Cryptocurrency Wallet
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Coin</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.crypto?.coin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Network</p>
                <p className="text-sm text-gray-900 dark:text-white">{employee.crypto?.network || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Wallet Address</p>
                <p className="text-sm text-gray-900 dark:text-white font-mono break-all">{employee.crypto?.wallet || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Technical */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              💻 Technical Information
            </h4>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">User Agent</p>
              <p className="text-sm text-gray-900 dark:text-white break-all">{employee.userAgent || 'N/A'}</p>
            </div>
          </div>

          {/* Notes */}
          {employee.notes && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                📝 Notes
              </h4>
              <p className="text-sm text-gray-900 dark:text-white">{employee.notes}</p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
