'use client';

import { Employee } from '@/types/employee';
import { useMemo } from 'react';

interface AnalyticsDashboardProps {
  employees: Employee[];
  onClose: () => void;
}

export default function AnalyticsDashboard({ employees, onClose }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter(e => e.status === 'Active').length;
    const inactive = total - active;
    
    const departments = employees.reduce((acc, emp) => {
      const dept = emp.company.department;
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0) / total;
    const maxSalary = Math.max(...employees.map(e => e.salary || 0));
    const minSalary = Math.min(...employees.map(e => e.salary || 0));

    return {
      total,
      active,
      inactive,
      activePercentage: ((active / total) * 100).toFixed(1),
      departments,
      avgSalary: Math.round(avgSalary),
      maxSalary,
      minSalary,
      topDepartment: Object.entries(departments).sort((a, b) => b[1] - a[1])[0],
    };
  }, [employees]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📊 Analytics Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-sm opacity-90">Total Employees</div>
              <div className="text-3xl font-bold mt-2">{analytics.total}</div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-sm opacity-90">Active</div>
              <div className="text-3xl font-bold mt-2">{analytics.active}</div>
              <div className="text-xs opacity-75 mt-1">{analytics.activePercentage}% of total</div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
              <div className="text-3xl mb-2">❌</div>
              <div className="text-sm opacity-90">Inactive</div>
              <div className="text-3xl font-bold mt-2">{analytics.inactive}</div>
              <div className="text-xs opacity-75 mt-1">{((analytics.inactive / analytics.total) * 100).toFixed(1)}% of total</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="text-3xl mb-2">🏢</div>
              <div className="text-sm opacity-90">Departments</div>
              <div className="text-3xl font-bold mt-2">{Object.keys(analytics.departments).length}</div>
            </div>
          </div>

          {/* Salary Analytics */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💰 Salary Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Salary</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">${analytics.avgSalary.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Highest Salary</div>
                <div className="text-2xl font-bold text-green-600">${analytics.maxSalary.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Lowest Salary</div>
                <div className="text-2xl font-bold text-orange-600">${analytics.minSalary.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🏢 Department Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(analytics.departments)
                .sort((a, b) => b[1] - a[1])
                .map(([dept, count]) => {
                  const percentage = ((count / analytics.total) * 100).toFixed(1);
                  return (
                    <div key={dept}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dept}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{count} employees ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-purple-600 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Top Insights */}
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">💡 Key Insights</h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-lg">🏆</span>
                <span>Largest department is <strong>{analytics.topDepartment?.[0]}</strong> with <strong>{analytics.topDepartment?.[1]}</strong> employees</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">📈</span>
                <span><strong>{analytics.activePercentage}%</strong> of your workforce is currently active</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">💵</span>
                <span>Average salary across all employees is <strong>${analytics.avgSalary.toLocaleString()}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">👤</span>
                <span>You have <strong>{analytics.total}</strong> total employees in your organization</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
