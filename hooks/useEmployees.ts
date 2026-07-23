'use client';

import { useState, useEffect, useCallback } from 'react';
import { Employee } from '@/types/employee';
import { storage } from '@/lib/storage';

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have data in localStorage
      const stored = storage.getEmployees();
      if (stored.length > 0) {
        setEmployees(stored);
        setLoading(false);
        return;
      }

      // Fetch from API only if no stored data
      const response = await fetch('https://dummyjson.com/users?limit=30');
      if (!response.ok) throw new Error('Failed to fetch employees');
      
      const data = await response.json();
      
      // Transform API data to our Employee type
      const transformedEmployees: Employee[] = data.users.map((user: any) => {
        // Use age to determine salary range more realistically
        const baseAge = user.age || 25;
        const experienceYears = Math.max(0, baseAge - 22);
        const baseSalary = 40000 + (experienceYears * 3500);
        const variation = Math.floor(Math.random() * 15000) - 7500;
        const calculatedSalary = Math.max(35000, baseSalary + variation);
        
        // Status based on role from API
        const isHighRole = user.role === 'admin' || user.role === 'moderator';
        const status = isHighRole ? 'Active' : (Math.random() > 0.15 ? 'Active' : 'Inactive');
        
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          maidenName: user.maidenName || '',
          age: user.age,
          gender: user.gender,
          email: user.email,
          phone: user.phone,
          username: user.username,
          birthDate: user.birthDate,
          image: user.image,
          bloodGroup: user.bloodGroup,
          height: user.height,
          weight: user.weight,
          eyeColor: user.eyeColor,
          hair: {
            color: user.hair?.color || '',
            type: user.hair?.type || ''
          },
          address: {
            address: user.address?.address || '',
            city: user.address?.city || '',
            state: user.address?.state || '',
            stateCode: user.address?.stateCode || '',
            postalCode: user.address?.postalCode || '',
            country: user.address?.country || ''
          },
          university: user.university || '',
          bank: {
            cardExpire: user.bank?.cardExpire || '',
            cardNumber: user.bank?.cardNumber || '',
            cardType: user.bank?.cardType || '',
            currency: user.bank?.currency || 'USD',
            iban: user.bank?.iban || ''
          },
          company: {
            name: user.company?.name || 'Unknown Company',
            department: user.company?.department || 'General',
            title: user.company?.title || 'Employee',
            address: {
              address: user.company?.address?.address || '',
              city: user.company?.address?.city || '',
              state: user.company?.address?.state || '',
              stateCode: user.company?.address?.stateCode || '',
              postalCode: user.company?.address?.postalCode || '',
              country: user.company?.address?.country || ''
            }
          },
          ein: user.ein || '',
          ssn: user.ssn || '',
          userAgent: user.userAgent || '',
          crypto: {
            coin: user.crypto?.coin || '',
            wallet: user.crypto?.wallet || '',
            network: user.crypto?.network || ''
          },
          role: user.role || 'user',
          salary: calculatedSalary,
          status: status,
          joinDate: user.birthDate ? new Date(new Date(user.birthDate).getTime() + (22 * 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] : new Date(Date.now() - Math.random() * 365 * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          performance: isHighRole ? Math.floor(Math.random() * 2) + 4 : Math.floor(Math.random() * 3) + 3,
          notes: '',
        };
      });

      storage.setEmployees(transformedEmployees);
      setEmployees(transformedEmployees);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const addEmployee = useCallback((employee: Employee) => {
    storage.addEmployee(employee);
    setEmployees(prev => [...prev, employee]);
  }, []);

  const updateEmployee = useCallback((id: number, updatedEmployee: Employee) => {
    storage.updateEmployee(id, updatedEmployee);
    setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp));
  }, []);

  const deleteEmployee = useCallback((id: number) => {
    storage.deleteEmployee(id);
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  }, []);

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees,
  };
}
