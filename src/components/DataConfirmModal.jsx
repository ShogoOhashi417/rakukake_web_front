import React from 'react';
import PrimaryButton from './PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';

export default function DataConfirmModal({
  isOpen,
  onClose,
  title = 'データを確認してください',
  dataList,
  columns,
  onDataChange,
  onDataDelete,
  onSave,
  saveButtonText = '保存'
}) {
  if (!isOpen) return null;

  const handleDataChange = (index, field, value) => {
    const newList = [...dataList];
    newList[index][field] = value;
    onDataChange(newList);
  };

  const renderCell = (item, column, index) => {
    const value = item[column.field];

    switch (column.type) {
      case 'status':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.id 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {item.id ? '上書き' : '新規'}
          </span>
        );

      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            onChange={(e) => handleDataChange(index, column.field, e.target.value)}
            placeholder={column.placeholder}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || 0}
            className="text-right bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            onChange={(e) => handleDataChange(index, column.field, parseInt(e.target.value) || 0)}
            placeholder={column.placeholder}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            onChange={(e) => handleDataChange(index, column.field, parseInt(e.target.value))}
          >
            {column.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <DatePicker
              value={value ? new Date(value) : new Date()}
              onChange={(date) => {
                const formattedDate = date.toISOString().split('T')[0];
                handleDataChange(index, column.field, formattedDate);
              }}
              slotProps={{ textField: { size: 'small' } }}
            />
          </LocalizationProvider>
        );

      case 'delete':
        return (
          <button
            className="mx-auto"
            onClick={() => onDataDelete(index)}
          >
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="text-red-500 hover:text-red-700"
            />
          </button>
        );

      default:
        return <span>{value}</span>;
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div
        onClick={onClose}
        className="absolute w-full h-full bg-gray-900 opacity-50"
      ></div>
      <div className="z-10 bg-white p-6 rounded shadow-lg w-5/6 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
        
        <div className="p-4 md:p-5">
          <div
            className="w-full"
            style={{
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <table className="w-full text-sm rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column.field} 
                      scope="col" 
                      className={`px-3 py-3 ${column.width || 'w-auto'}`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataList.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    {columns.map((column) => (
                      <td 
                        key={column.field} 
                        className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {renderCell(item, column, index)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-4 pb-4">
          <PrimaryButton onClick={onSave}>
            {saveButtonText}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
} 