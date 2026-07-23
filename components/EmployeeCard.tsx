'use client';

import Image from 'next/image';
import { Employee } from '@/types/employee';

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  onViewDetails: (employee: Employee) => void;
}

export default function EmployeeCard({ employee, onEdit, onDelete, onViewDetails }: EmployeeCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 dark:border-gray-800">
      <div className="relative h-24 bg-gradient-to-r from-primary-400 to-primary-600">
        <div className="absolute -bottom-10 left-5">
          <div className="relative w-20 h-20 rounded-full border-3 border-white dark:border-gray-900 overflow-hidden bg-gray-100 shadow-md">
            <Image
              src={employee.image}
              alt={`${employee.firstName} ${employee.lastName}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            employee.status === 'Active'
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
          }`}>
            {employee.status}
          </span>
        </div>
      </div>

      <div className="pt-12 px-5 pb-5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-0.5">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{employee.company.title}</p>

        <div className="space-y-1.5 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>📧</span>
            <span className="truncate text-xs">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>📱</span>
            <span className="text-xs">{employee.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>🏢</span>
            <span className="text-xs">{employee.company.department}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>📍</span>
            <span className="text-xs">{employee.address?.city || 'N/A'}, {employee.address?.state || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>🎓</span>
            <span className="text-xs truncate">{employee.university || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>💵</span>
            <span className="text-xs font-medium">
              {employee.bank?.currency || 'USD'} {employee.salary?.toLocaleString() || '0'}/year
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span>👤</span>
            <span className="text-xs capitalize">{employee.role || 'user'}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => onViewDetails(employee)}
            className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(employee)}
            className="flex-1 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(employee.id)}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-red-50 dark:bg-gray-800 dark:hover:bg-red-900 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 text-sm font-medium rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
