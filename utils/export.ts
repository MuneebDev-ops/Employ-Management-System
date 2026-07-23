import { Employee } from '@/types/employee';

export const exportToCSV = (employees: Employee[]) => {
  const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Age', 'Gender', 'Department', 'Role', 'Salary', 'Currency', 'City', 'State', 'Country', 'University', 'Status', 'Performance'];
  const rows = employees.map(emp => [
    emp.id,
    emp.firstName,
    emp.lastName,
    emp.email,
    emp.phone,
    emp.age || 'N/A',
    emp.gender || 'N/A',
    emp.company.department,
    emp.role || 'user',
    emp.salary || 0,
    emp.bank?.currency || 'USD',
    emp.address?.city || 'N/A',
    emp.address?.state || 'N/A',
    emp.address?.country || 'N/A',
    emp.university || 'N/A',
    emp.status,
    emp.performance || 'N/A'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (employees: Employee[]) => {
  const jsonContent = JSON.stringify(employees, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (employees: Employee[]) => {
  // Dynamic import to avoid SSR issues
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(139, 92, 246); // Primary color
  doc.text('Employee Report', 14, 20);
  
  // Add metadata
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
  doc.text(`Total Employees: ${employees.length}`, 14, 34);
  
  // Prepare table data
  const tableData = employees.map(emp => [
    `${emp.firstName} ${emp.lastName}`,
    emp.email,
    emp.phone,
    `${emp.age || 'N/A'} / ${emp.gender || 'N/A'}`,
    `${emp.address?.city || 'N/A'}, ${emp.address?.state || 'N/A'}`,
    emp.company.department,
    emp.role || 'user',
    `${emp.bank?.currency || 'USD'} ${emp.salary?.toLocaleString() || '0'}`,
    emp.status,
    '★'.repeat(emp.performance || 0)
  ]);

  // Add table
  (doc as any).autoTable({
    head: [['Name', 'Email', 'Phone', 'Age/Gender', 'Location', 'Department', 'Role', 'Salary', 'Status', 'Rating']],
    body: tableData,
    startY: 40,
    styles: { 
      fontSize: 7,
      cellPadding: 2,
    },
    headStyles: { 
      fillColor: [139, 92, 246],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 40 }
  });
  
  // Add footer with page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save PDF
  doc.save(`employees_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const printEmployees = (employees: Employee[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Employee Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #8b5cf6; text-align: center; margin-bottom: 10px; }
        .metadata { text-align: center; color: #666; margin-bottom: 20px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; font-size: 12px; }
        th { background-color: #8b5cf6; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .active { color: green; font-weight: bold; }
        .inactive { color: red; font-weight: bold; }
        .stars { color: #fbbf24; }
        @media print {
          body { padding: 10px; }
          table { font-size: 10px; }
        }
      </style>
    </head>
    <body>
      <h1>Employee Report</h1>
      <div class="metadata">
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Total Employees:</strong> ${employees.length}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          ${employees.map(emp => `
            <tr>
              <td>${emp.firstName} ${emp.lastName}</td>
              <td>${emp.email}</td>
              <td>${emp.phone}</td>
              <td>${emp.company.department}</td>
              <td>${emp.role || 'N/A'}</td>
              <td>${emp.bank.currency || '$'}${emp.salary?.toLocaleString()}</td>
              <td class="${emp.status.toLowerCase()}">${emp.status}</td>
              <td class="stars">${'★'.repeat(emp.performance || 0)}${'☆'.repeat(5 - (emp.performance || 0))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};
