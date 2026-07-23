'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Employee } from '@/types/employee';
import { useEmployees } from '@/hooks/useEmployees';
import { useDebounce } from '@/hooks/useDebounce';
import EmployeeCard from '@/components/EmployeeCard';
import EmployeeModal from '@/components/EmployeeModal';
import EmployeeDetailsModal from '@/components/EmployeeDetailsModal';
import Navbar from '@/components/Navbar';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import EmployeeTable from '@/components/EmployeeTable';
import Pagination from '@/components/Pagination';
import { exportToCSV, exportToJSON, exportToPDF, printEmployees } from '@/utils/export';

export default function DashboardPage() {
  const router = useRouter();
  const { employees, loading, error, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'salary' | 'department'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Check authentication
  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (!isAuth) {
      router.push('/login');
    }
  }, [router]);

  // Get unique departments (sorted alphabetically)
  const departments = Array.from(new Set(employees.map(emp => emp.company.department))).sort();

  // Filter and sort employees
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      emp.email.toLowerCase().includes(debouncedSearch.toLowerCase());
    
    // Trim and compare departments to avoid whitespace issues
    const empDept = emp.company?.department?.trim() || '';
    const filterDept = departmentFilter.trim();
    const matchesDepartment = filterDept === 'all' || empDept === filterDept;
    
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

    // Debug logging
    if (filterDept !== 'all' && matchesDepartment) {
      console.log(`Match found: ${emp.firstName} ${emp.lastName} - Dept: "${empDept}" === Filter: "${filterDept}"`);
    }

    return matchesSearch && matchesDepartment && matchesStatus;
  }).sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'name') {
      comparison = `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    } else if (sortBy === 'salary') {
      comparison = (a.salary || 0) - (b.salary || 0);
    } else if (sortBy === 'department') {
      comparison = a.company.department.localeCompare(b.company.department);
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      deleteEmployee(id);
    }
  };

  const handleSave = (employee: Employee) => {
    if (editingEmployee) {
      updateEmployee(employee.id, employee);
    } else {
      addEmployee({ ...employee, id: Date.now() });
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleExport = (type: 'csv' | 'json' | 'pdf' | 'print') => {
    switch (type) {
      case 'csv':
        exportToCSV(filteredEmployees);
        break;
      case 'json':
        exportToJSON(filteredEmployees);
        break;
      case 'pdf':
        exportToPDF(filteredEmployees);
        break;
      case 'print':
        printEmployees(filteredEmployees);
        break;
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedIds(paginatedEmployees.map(emp => emp.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} selected employees?`)) {
      selectedIds.forEach(id => deleteEmployee(id));
      setSelectedIds([]);
    }
  };

  const handleRefreshData = () => {
    localStorage.removeItem('employees_data');
    window.location.reload();
  };

  const toggleSort = (field: 'name' | 'salary' | 'department') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Navbar onAddEmployee={() => {}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 max-w-md">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar 
        onAddEmployee={() => setIsModalOpen(true)} 
        onShowAnalytics={() => setShowAnalytics(true)}
        onExport={handleExport}
        onRefreshData={handleRefreshData}
      />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-3 sm:p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{employees.length}</p>
              </div>
              <div className="text-2xl sm:text-3xl opacity-80">👥</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-3 sm:p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Active</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{employees.filter(e => e.status === 'Active').length}</p>
              </div>
              <div className="text-2xl sm:text-3xl opacity-80">✓</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-3 sm:p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Inactive</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{employees.filter(e => e.status === 'Inactive').length}</p>
              </div>
              <div className="text-2xl sm:text-3xl opacity-80">×</div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-3 sm:p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Depts</p>
                <p className="text-xl sm:text-2xl font-bold text-primary-600">{departments.length}</p>
              </div>
              <div className="text-2xl sm:text-3xl opacity-80">🏢</div>
            </div>
          </div>
        </div>

        {/* View Toggle & Bulk Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                viewMode === 'grid'
                  ? 'bg-primary-500 text-white shadow'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                viewMode === 'table'
                  ? 'bg-primary-500 text-white shadow'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Table View
            </button>
          </div>
          
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 sm:gap-3 bg-primary-50 dark:bg-primary-900/20 px-3 sm:px-4 py-2 rounded-lg border border-primary-200 dark:border-primary-800">
              <span className="text-xs sm:text-sm font-medium text-primary-900 dark:text-primary-300">
                {selectedIds.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-medium rounded-md transition"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium rounded-md transition"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-3 sm:p-5 mb-4 sm:mb-6 border border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Search</label>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page when filter changes
                }}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              >
                <option value="all" key="all-departments">All Departments</option>
                {departments.map((dept, index) => (
                  <option key={`dept-${index}-${dept}`} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              >
                <option value="all" key="all-status">All Status</option>
                <option value="Active" key="status-active">Active</option>
                <option value="Inactive" key="status-inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">Sort By</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => toggleSort('name')}
                  className={`px-2 py-2 rounded-md text-xs font-medium transition ${
                    sortBy === 'name'
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => toggleSort('salary')}
                  className={`px-2 py-2 rounded-md text-xs font-medium transition ${
                    sortBy === 'salary'
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Salary {sortBy === 'salary' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => toggleSort('department')}
                  className={`px-2 py-2 rounded-md text-xs font-medium transition ${
                    sortBy === 'department'
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  Dept {sortBy === 'department' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Grid/Table */}
        {filteredEmployees.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No employees found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {paginatedEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={(emp) => setViewingEmployee(emp)}
                  />
                ))}
              </div>
            ) : (
              <EmployeeTable
                employees={paginatedEmployees}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewDetails={(emp) => setViewingEmployee(emp)}
                selectedIds={selectedIds}
                onSelectAll={handleSelectAll}
                onSelectOne={handleSelectOne}
              />
            )}
            
            {/* Pagination */}
            {filteredEmployees.length > 10 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredEmployees.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(items) => {
                    setItemsPerPage(items);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EmployeeModal
          employee={editingEmployee}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      {/* Details Modal */}
      {viewingEmployee && (
        <EmployeeDetailsModal
          employee={viewingEmployee}
          onClose={() => setViewingEmployee(null)}
        />
      )}

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <AnalyticsDashboard
          employees={employees}
          onClose={() => setShowAnalytics(false)}
        />
      )}
    </div>
  );
}
