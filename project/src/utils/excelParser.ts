import * as XLSX from 'xlsx';
import { ExcelFile } from '../types';

export const parseExcelFile = (file: File): Promise<Omit<ExcelFile, 'id' | 'userId' | 'uploadedAt'>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          reject(new Error('Excel file is empty'));
          return;
        }
        
        const headers = jsonData[0] as string[];
        const dataRows = jsonData.slice(1);
        
        resolve({
          name: file.name.replace(/\.[^/.]+$/, ''),
          originalName: file.name,
          size: file.size,
          data: dataRows,
          headers: headers.map(h => h?.toString() || ''),
          rowCount: dataRows.length,
          columnCount: headers.length,
        });
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const validateExcelFile = (file: File): string | null => {
  const validTypes = [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  
  const validExtensions = ['.xls', '.xlsx'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!validTypes.includes(file.type) && !validExtensions.includes(fileExtension)) {
    return 'Please upload a valid Excel file (.xls or .xlsx)';
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return 'File size must be less than 10MB';
  }
  
  return null;
};

export const getColumnData = (data: any[][], columnIndex: number): any[] => {
  return data.map(row => row[columnIndex]).filter(value => value !== undefined && value !== null && value !== '');
};

export const detectDataType = (values: any[]): 'number' | 'date' | 'string' => {
  if (values.length === 0) return 'string';
  
  const numericValues = values.filter(v => !isNaN(Number(v)));
  if (numericValues.length > values.length * 0.8) {
    return 'number';
  }
  
  const dateValues = values.filter(v => !isNaN(Date.parse(v)));
  if (dateValues.length > values.length * 0.8) {
    return 'date';
  }
  
  return 'string';
};