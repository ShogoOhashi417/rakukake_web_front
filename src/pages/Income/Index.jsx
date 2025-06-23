import React, { useEffect, useRef, useState } from "react";
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import { PlusCircle, X, Edit, Trash2, Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import {
    createColumnHelper,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";
import { incomeService } from "../../api/services/incomeService";
import { categoryService } from "../../api/services/categoryService";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";


export default function Income() {
    const { user } = useAuth();

    const [incomeId, setIncomeId] = useState(0);
    const [incomeName, setIncomeName] = useState('');
    const [incomeCategoryId, setIncomeCategoryId] = useState(0);
    const [incomeAmount, setIncomeAmount] = useState(0);
    
    const [incomeInfoList, setincomeInfoList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [filteredIncomeList, setFilteredIncomeList] = useState([]);
    
    const [selectedYearMonth, setSelectedYearMonth] = useState('');

    const filterIncomeByCategory = (incomeList, categoryId) => {
        if (!categoryId || categoryId === '') {
            return incomeList;
        }
        return incomeList.filter(income => income.category_id === parseInt(categoryId));
    };

    const filterIncomeByYearMonth = (incomeList, yearMonth) => {
        if (!yearMonth) {
            return incomeList;
        }
        
        const [year, month] = yearMonth.split('-');
        
        return incomeList.filter(income => {
            if (!income.calendar_date) return false;
            
            const incomeDate = new Date(income.calendar_date);
            const incomeYear = incomeDate.getFullYear();
            const incomeMonth = incomeDate.getMonth() + 1;
            
            return incomeYear === parseInt(year) && incomeMonth === parseInt(month);
        });
    };

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategoryId(categoryId);
    };

    const clearYearMonthFilter = () => {
        setSelectedYearMonth('');
    };

    useEffect(() => {
        let filtered = incomeInfoList;
        
        filtered = filterIncomeByCategory(filtered, selectedCategoryId);
        
        filtered = filterIncomeByYearMonth(filtered, selectedYearMonth);
        
        setFilteredIncomeList(filtered);
    }, [incomeInfoList, selectedCategoryId, selectedYearMonth]);

    const getInfo = async () => {
        setIsLoading(true);
        try {
            const incomeList = await incomeService.getIncomeList();
            setincomeInfoList(incomeList);
        } catch (error) {
            console.error('Error fetching income data:', error);
            setincomeInfoList([]);
        } finally {
            setIsLoading(false);
        }
    }
    
    const getCategories = async () => {
        try {
            const categories = await categoryService.getIncomeCategories();
            setIncomeCategoryInfoList(categories.income_category_info_list);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setIncomeCategoryInfoList([]);
        }
    }

    useEffect(() => {
        getInfo();
        getCategories();
    }, []);

    const [selectedDay, setSelectedDay] = useState(null);

    const changeIncomeName = (event) => {
        setIncomeName(event.target.value);
    }

    const changeIncomeCategoryId = (event) => {
        setIncomeCategoryId(event.target.value);
    }

    const changeIncomeAmount = (event) => {
        setIncomeAmount(parseInt(event.target.value));
    }

    const addIncomeRef = useRef(null);
    const updateIncomeRef = useRef(null);

    const openAddModal = () => {
        addIncomeRef.current.classList.remove('hidden');
    }

    const openUpdateModal = (incomeId, incomeName, incomeCategoryId, incomeAmount, incomeCalendarDate) => {
        setIncomeId(incomeId);
        setIncomeName(incomeName);
        setIncomeCategoryId(incomeCategoryId);
        setIncomeAmount(incomeAmount);
        
        if (incomeCalendarDate) {
            setSelectedDay(new Date(incomeCalendarDate));
        }
        
        updateIncomeRef.current.classList.remove('hidden');
    }

    const closeModal = () => {
        addIncomeRef.current.classList.add('hidden');
        updateIncomeRef.current.classList.add('hidden');
    }

    const addIncome = async () => {
        try {
            await incomeService.addIncome({
                'income_name': incomeName,
                'income_category_id': incomeCategoryId,
                'income_amount': incomeAmount,
                'calendar_date': selectedDay ? format(selectedDay, 'yyyy-MM-dd') : null
            });
            getInfo();
            closeModal();
            
            setIncomeName('');
            setIncomeCategoryId(0);
            setIncomeAmount(0);
            setSelectedDay(null);
        } catch (error) {
            console.error('Error adding income:', error);
        }
    }

    const updateIncome = async () => {
        try {
            await incomeService.updateIncome(incomeId, {
                'income_name': incomeName,
                'income_category_id': incomeCategoryId,
                'income_amount': incomeAmount,
                'calendar_date': selectedDay ? format(selectedDay, 'yyyy-MM-dd') : null
            });
            getInfo();
            closeModal();
            
            setIncomeId(0);
            setIncomeName('');
            setIncomeCategoryId(0);
            setIncomeAmount(0);
            setSelectedDay(null);
        } catch (error) {
            console.error('Error updating income:', error);
        }
    }

    const deleteIncome = async (incomeId) => {
        if (!window.confirm('本当に収入を削除しますか？')) {
            return;
        }

        try {
            await incomeService.deleteIncome({
                'id': incomeId,
                'income_name': incomeName,
                'income_amount': incomeAmount,
            });
            getInfo();
        } catch (error) {
            console.error('Error deleting income:', error);
        }
    }

    const [incomeCategoryInfoList, setIncomeCategoryInfoList] = useState([]);

    const [calendarDate, setCalendarDate] = useState({ 
        startDate: null, 
        endDate: null
    });

    const columnHelper = createColumnHelper();

    const data = React.useMemo(
        () => filteredIncomeList || [],
        [filteredIncomeList]
    );

    const columns = React.useMemo(
        () => [
        columnHelper.accessor("name", {
            header: "収入名",
            cell: (info) => {
                const value = info.getValue();
                const truncatedValue = value && value.length > 20 ? value.substring(0, 20) + '...' : value;
                return (
                    <div title={value} className="max-w-xs">
                        {truncatedValue}
                    </div>
                );
            },
        }),
        columnHelper.accessor("amount", {
            header: "金額",
            cell: (info) => {
                const value = info.getValue();
                return (
                    <div className="text-left">
                        {value ? value.toLocaleString() : 0}円
                    </div>
                );
            },
            sortingFn: "basic",
        }),
        columnHelper.accessor("category_name", {
            header: "カテゴリー",
            cell: (info) => {
                const value = info.getValue();
                const truncatedValue = value && value.length > 15 ? value.substring(0, 15) + '...' : value;
                return (
                    <div title={value} className="max-w-xs">
                        {truncatedValue}
                    </div>
                );
            },
            sortingFn: "basic",
        }),
        columnHelper.accessor("calendar_date", {
            header: "日時",
            cell: (info) => {
                const value = info.getValue();
                if (!value) return "-";
                try {
                    return format(new Date(value), "yyyy/MM/dd");
                } catch {
                    return value;
                }
            },
            sortingFn: "basic",
        }),
        ],
        []
    );

    const [sorting, setSorting] = React.useState([]);

    const table = useReactTable({
        data,
        columns,
        state: {
        sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    収入管理
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <Button
                                    onClick={openAddModal}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    収入追加
                                </Button>
                                
                                <div className="flex items-center gap-2">
                                    <label htmlFor="categoryFilter" className="text-sm font-medium text-gray-700">
                                        カテゴリー絞り込み:
                                    </label>
                                    <select
                                        id="categoryFilter"
                                        value={selectedCategoryId}
                                        onChange={handleCategoryChange}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
                                    >
                                        <option value="">すべて</option>
                                        {incomeCategoryInfoList.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium text-gray-700">
                                        年月絞り込み:
                                    </label>
                                    <DatePicker
                                        selected={selectedYearMonth ? new Date(selectedYearMonth + '-01') : null}
                                        onChange={(date) => {
                                            if (date) {
                                                const year = date.getFullYear();
                                                const month = date.getMonth() + 1;
                                                setSelectedYearMonth(`${year}-${month}`);
                                            } else {
                                                setSelectedYearMonth('');
                                            }
                                        }}
                                        dateFormat="yyyy年MM月"
                                        showMonthYearPicker
                                        locale={ja}
                                        placeholderText="年月を選択"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[120px]"
                                        isClearable
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                {(selectedCategoryId || selectedYearMonth) && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-blue-800">
                                                <span className="font-medium">絞り込み条件: </span>
                                                {selectedCategoryId && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-2">
                                                        カテゴリー: {incomeCategoryInfoList.find(cat => cat.id === parseInt(selectedCategoryId))?.name}
                                                        <button
                                                            onClick={() => setSelectedCategoryId('')}
                                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )}
                                                {selectedYearMonth && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mr-2">
                                                        年月: {(() => {
                                                            const [year, month] = selectedYearMonth.split('-');
                                                            return `${year}年${month}月`;
                                                        })()}
                                                        <button
                                                            onClick={clearYearMonthFilter}
                                                            className="ml-1 text-blue-600 hover:text-blue-800"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-blue-600 font-medium">
                                                {filteredIncomeList.length}件表示
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-8 border-gray-200 border-t-blue-500"></div>
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        scope="col"
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    >
                                                        {header.isPlaceholder
                                                        ? null
                                                        : header.column.columnDef.header}
                                                        {{
                                                            asc: " ↑",
                                                            desc: " ↓",
                                                        }[header.column.getIsSorted()] ?? null}
                                                    </th>
                                                ))}
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                                    操作
                                                </th>
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {table.getRowModel().rows.length > 0 ? (
                                            table.getRowModel().rows.map((row) => (
                                                <tr key={row.id} className={`${row.original.fixed_income_id ? 'bg-gray-100 text-gray-500' : 'hover:bg-gray-50'}`}>
                                                    {row.getVisibleCells().map((cell) => (
                                                        <td
                                                            key={cell.id}
                                                            className="px-6 py-4 whitespace-nowrap"
                                                        >
                                                            <div className={`text-sm font-medium ${row.original.fixed_income_id ? 'text-gray-500' : 'text-gray-900'}`}>
                                                                {cell.column.columnDef.cell(cell)}
                                                            </div>
                                                        </td>
                                                    ))}
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Button
                                                                onClick={() => openUpdateModal(
                                                                    row.original.id || 0,
                                                                    row.original.name || '',
                                                                    row.original.category_id || 0,
                                                                    row.original.amount || 0,
                                                                    row.original.calendar_date || null
                                                                )}
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={row.original.fixed_income_id}
                                                                className={row.original.fixed_income_id ? 'opacity-50 cursor-not-allowed' : ''}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => deleteIncome(row.original.id || 0)}
                                                                variant="outline"
                                                                size="sm"
                                                                className={`text-red-500 hover:text-red-700 ${row.original.fixed_income_id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                disabled={row.original.fixed_income_id}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {(selectedCategoryId || selectedYearMonth) ? 
                                                            "絞り込み条件に該当するデータがありません。" :
                                                            "データがありません。上の「収入追加」ボタンから収入を登録してください。"
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div
                ref={addIncomeRef}
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center hidden"
            >
                <div
                    onClick={closeModal}
                    className="absolute w-full h-full bg-gray-900 opacity-50"
                ></div>
                <div className="z-10 bg-white p-6 rounded shadow-lg w-1/2">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">
                            収入を追加する
                        </h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            data-modal-toggle="addTaskModal"
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
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                収入名
                            </label>
                            <input
                                type="text"
                                value={incomeName}
                                onChange={changeIncomeName}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="例) 給料"
                            />
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                カテゴリー
                            </label>

                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                onChange={changeIncomeCategoryId}
                            >
                                <option value="">選択してください</option>
                                {incomeCategoryInfoList.map((category, index) => (
                                    <option key={index} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                金額
                            </label>
                            <input
                                type="number"
                                value={incomeAmount}
                                onChange={changeIncomeAmount}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                min="1"
                            />
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                日時
                            </label>
                            <DatePicker
                                selected={selectedDay}
                                onChange={(date) => setSelectedDay(date)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                dateFormat="yyyy/MM/dd"
                                locale={ja}
                            />
                        </div>
                    </div>
                    <button
                        onClick={addIncome}
                        type="submit"
                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        <svg
                            className="me-1 -ms-1 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        収入を追加する
                    </button>
                </div>
            </div>

            <div
                ref={updateIncomeRef}
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center hidden"
            >
                <div
                    onClick={closeModal}
                    className="absolute w-full h-full bg-gray-900 opacity-50"
                ></div>
                <div className="z-10 bg-white p-6 rounded shadow-lg w-1/2">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">
                            収入を編集する
                        </h3>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                            data-modal-toggle="addTaskModal"
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
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                収入名
                            </label>
                            <input
                                type="text"
                                value={incomeName}
                                onChange={changeIncomeName}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="例) 給料"
                            />
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                カテゴリー
                            </label>

                            <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                value={incomeCategoryId}
                                onChange={changeIncomeCategoryId}
                            >
                                <option value="">選択してください</option>
                                {incomeCategoryInfoList.map((category, index) => (
                                    <option key={index} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                金額
                            </label>
                            <input
                                type="number"
                                value={incomeAmount}
                                onChange={changeIncomeAmount}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                min="1"
                            />
                        </div>
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                日時
                            </label>
                            <DatePicker
                                selected={selectedDay}
                                onChange={(date) => setSelectedDay(date)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                dateFormat="yyyy/MM/dd"
                                locale={ja}
                            />
                        </div>
                    </div>
                    <button
                        onClick={updateIncome}
                        type="submit"
                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        <svg
                            className="me-1 -ms-1 w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        収入を登録する
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 