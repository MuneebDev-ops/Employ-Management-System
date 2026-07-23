'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';

interface NavbarProps {
  onAddEmployee: () => void;
  onShowAnalytics?: () => void;
  onExport?: (type: 'csv' | 'json' | 'pdf' | 'print') => void;
  onRefreshData?: () => void;
}

export default function Navbar({ onAddEmployee, onShowAnalytics, onExport, onRefreshData }: NavbarProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    router.push('/login');
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white truncate">Employee Dashboard</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Enterprise Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {onRefreshData && (
              <Button
                onClick={onRefreshData}
                variant="warning"
                size="sm"
                icon={<span className="text-base sm:text-lg">🔄</span>}
                title="Refresh Employee Data"
              >
                <span className="hidden md:inline">Refresh</span>
              </Button>
            )}

            {onShowAnalytics && (
              <Button
                onClick={onShowAnalytics}
                variant="info"
                size="sm"
                icon={<span className="text-base sm:text-lg">📊</span>}
                title="View Analytics"
              >
                <span className="hidden md:inline">Analytics</span>
              </Button>
            )}

            {onExport && (
              <div className="relative">
                <Button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  variant="success"
                  size="sm"
                  icon={<span className="text-base sm:text-lg">📥</span>}
                  title="Export Data"
                >
                  <span className="hidden md:inline">Export</span>
                </Button>
                
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <button
                      onClick={() => { onExport && onExport('csv'); setShowExportMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <span>📄</span> Export as CSV
                    </button>
                    <button
                      onClick={() => { onExport && onExport('json'); setShowExportMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <span>📋</span> Export as JSON
                    </button>
                    <button
                      onClick={() => { onExport && onExport('pdf'); setShowExportMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <span>📕</span> Export as PDF
                    </button>
                    <button
                      onClick={() => { onExport && onExport('print'); setShowExportMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <span>🖨️</span> Print Report
                    </button>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={onAddEmployee}
              variant="primary"
              size="sm"
              icon={<span className="text-base sm:text-lg">+</span>}
            >
              <span className="hidden sm:inline">Add</span>
            </Button>

            <Button
              onClick={toggleTheme}
              variant="secondary"
              size="sm"
              title="Toggle theme"
              className="p-1.5 sm:p-2"
            >
              <span className="text-lg sm:text-xl">{isDark ? '☀️' : '🌙'}</span>
            </Button>

            <Button
              onClick={handleLogout}
              variant="danger"
              size="sm"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
