import { Employee } from '@/types/employee';

const STORAGE_KEY = 'employees_data';

export const storage = {
  getEmployees: (): Employee[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  setEmployees: (employees: Employee[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
  },

  addEmployee: (employee: Employee): void => {
    const employees = storage.getEmployees();
    employees.push(employee);
    storage.setEmployees(employees);
  },

  updateEmployee: (id: number, updatedEmployee: Employee): void => {
    const employees = storage.getEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      employees[index] = updatedEmployee;
      storage.setEmployees(employees);
    }
  },

  deleteEmployee: (id: number): void => {
    const employees = storage.getEmployees();
    const filtered = employees.filter(emp => emp.id !== id);
    storage.setEmployees(filtered);
  },
};
