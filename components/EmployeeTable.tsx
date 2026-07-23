'use client';

import Image from 'next/image';
import { Employee } from '@/types/employee';
import { useState } from 'react';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  onViewDetails: (employee: Employee) => void;
  selectedIds: number[];
  onSelectAll: (selected: boolean) => void;
  onSelectOne: (id: number, selected: boolean) => void;
}

export default function EmployeeTable({ 
  employees, 
  onEdit, 
  onDelete,
  onViewDetails,
  selectedIds,
  onSelectAll,
  onSelectOne
}: EmployeeTableProps) {
  const allSelected = employees.length > 0 && selectedIds.length === employees.length;

  const getPerformanceColor = (rating?: number) => {
    if (!rating) return 'text-gray-400';
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-blue-600';
    if (rating >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Age/Gender
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                University
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Salary
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Performance
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {employees.map((employee) => (
              <tr 
                key={employee.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(employee.id)}
                    onChange={(e) => onSelectOne(employee.id, e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={employee.image}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {employee.company.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-xs text-gray-600 dark:text-gray-300">{employee.email}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{employee.phone}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{employee.age || 'N/A'} years</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{employee.gender || 'N/A'}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-xs text-gray-900 dark:text-white">{employee.address?.city || 'N/A'}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{employee.address?.state || 'N/A'}, {employee.address?.country || 'N/A'}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-xs text-gray-900 dark:text-white truncate max-w-xs">{employee.university || 'N/A'}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {employee.company.department}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 capitalize">
                    {employee.role || 'user'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {employee.bank?.currency || 'USD'} {employee.salary?.toLocaleString() || '0'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">per year</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-sm ${i < (employee.performance || 0) ? getPerformanceColor(employee.performance) : 'text-gray-300 dark:text-gray-700'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${
                    employee.status === 'Active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {employee.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(employee)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEdit(employee)}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(employee.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
