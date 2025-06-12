import React from "react";
import { useRef, useState, useEffect } from "react";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { categoryService } from "../../api/services/categoryService";
import { expenditureService } from "../../api/services/expenditureService";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";

export default function Expense() {
    const { user } = useAuth();
    
    useEffect(() => {
        document.title = "支出管理";
        getInfo();
        getCategories();
    }, []);
    
    const [expenditureInfoList, setExpenditureInfoList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [expenditureId, setExpenditureId] = useState(0);
    const [expenditureName, setExpenditureName] = useState("");
    const [expenditureCategoryId, setExpenditureCategoryId] = useState(0);
    const [expenditureAmount, setExpenditureAmount] = useState(0);
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');

    const [expenditureCategoryInfoList, setExpenditureCategoryInfoList] = useState([]);

    const getCategories = async () => {
        try {
            const categories = await categoryService.getExpenseCategories();
            setExpenditureCategoryInfoList(categories.expenditure_category_info_list);
        } catch (error) {
            console.error('カテゴリーデータの取得に失敗しました:', error);
            setExpenditureCategoryInfoList([]);
        }
    };

    const sortData = (field) => {
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);
        
        const sortedData = [...expenditureInfoList].sort((a, b) => {
            if (a[field] < b[field]) return newDirection === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return newDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        setExpenditureInfoList(sortedData);
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? " ↑" : " ↓";
    };

    const changeExpenditureName = (event) => {
        setExpenditureName(event.target.value);
    };

    const changeExpenditureCategoryId = (event) => {
        setExpenditureCategoryId(event.target.value);
    };

    const changeExpenditureAmount = (event) => {
        setExpenditureAmount(parseInt(event.target.value));
    };

    const addExpenditureRef = useRef(null);
    const updateExpenditureRef = useRef(null);

    const openAddModal = () => {
        addExpenditureRef.current.classList.remove("hidden");
    };

    const openUpdateModal = (
        expenditureId,
        expenditureName,
        expenditureCategoryId,
        expenditureAmount,
        expenditureCalendarDate
    ) => {
        setExpenditureId(expenditureId);
        setExpenditureName(expenditureName);
        setExpenditureCategoryId(expenditureCategoryId);
        setExpenditureAmount(expenditureAmount);
        const date = expenditureCalendarDate ? new Date(expenditureCalendarDate) : null;
        setSelectedDate(date);
        setCalendarDate({
            startDate: expenditureCalendarDate,
            endDate: expenditureCalendarDate,
        });
        updateExpenditureRef.current.classList.remove("hidden");
    };

    const closeModal = () => {
        addExpenditureRef.current.classList.add("hidden");
        updateExpenditureRef.current.classList.add("hidden");
    };

    const getInfo = async () => {
        setIsLoading(true);
        try {
            const expenditureList = await expenditureService.getExpenditureList();
            setExpenditureInfoList(expenditureList);
        } catch (error) {
            console.error('支出データの取得に失敗しました:', error);
            setExpenditureInfoList([]);
        } finally {
            setIsLoading(false);
        }
    };

    const [selectedDate, setSelectedDate] = useState(null);

    // calendarDateは元のコードとの互換性のために残す
    // eslint-disable-next-line no-unused-vars
    const [calendarDate, setCalendarDate] = useState({
        startDate: null,
        endDate: null,
    });

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setCalendarDate({
            startDate: date ? date.toISOString().split('T')[0] : null,
            endDate: date ? date.toISOString().split('T')[0] : null,
        });
    };

    const addExpenditure = () => {
        if (!selectedDate) {
            alert("日付を選択してください");
            return;
        }
        
        const localCalendarDate = selectedDate.toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" });
        
        expenditureService.addExpenditure({
            expenditure_name: expenditureName,
            expenditure_category_id: expenditureCategoryId,
            expenditure_amount: expenditureAmount,
            calendar_date: localCalendarDate,
        })
        .then(() => {
            getInfo();
            closeModal();
            
            setExpenditureName("");
            setExpenditureCategoryId(0);
            setExpenditureAmount(0);
            setSelectedDate(null);
            setCalendarDate({ startDate: null, endDate: null });
        })
        .catch((error) => {
            console.error("支出の追加に失敗しました:", error);
        });
    };

    const updateExpenditure = () => {
        if (!selectedDate) {
            alert("日付を選択してください");
            return;
        }
        
        const localCalendarDate = selectedDate.toLocaleString("sv-SE", { timeZone: "Asia/Tokyo" });
        
        expenditureService.updateExpenditure(expenditureId, {
            expenditure_name: expenditureName,
            expenditure_category_id: expenditureCategoryId,
            expenditure_amount: expenditureAmount,
            calendar_date: localCalendarDate,
        })
        .then(() => {
            getInfo();
            closeModal();
            
            setExpenditureId(0);
            setExpenditureName("");
            setExpenditureCategoryId(0);
            setExpenditureAmount(0);
            setSelectedDate(null);
        })
        .catch((error) => {
            console.error("支出の更新に失敗しました:", error);
        });
    };

    const deleteExpenditure = (expenditureId) => {
        if (!window.confirm("本当にこの支出を削除しますか？")) {
            return;
        }

        expenditureService.deleteExpenditure({
            id: expenditureId,
            expenditure_name: expenditureName,
            expenditure_amount: expenditureAmount,
        })
        .then(() => {
            getInfo();
        })
        .catch((error) => {
            console.error("支出の削除に失敗しました:", error);
        });
    };

    return (
        <>
            <AuthenticatedLayout
                user={user || { name: 'ゲスト', email: 'guest@example.com' }}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        支出管理
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <Button
                                    onClick={openAddModal}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                                >
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    支出追加
                                </Button>

                                {isLoading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-8 border-gray-200 border-t-blue-500"></div>
                                    </div>
                                ) : (
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th 
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() => sortData('name')}
                                                >
                                                    支出名{getSortIcon('name')}
                                                </th>
                                                <th 
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() => sortData('amount')}
                                                >
                                                    金額{getSortIcon('amount')}
                                                </th>
                                                <th 
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() => sortData('category_name')}
                                                >
                                                    カテゴリー{getSortIcon('category_name')}
                                                </th>
                                                <th 
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                                    onClick={() => sortData('calendar_date')}
                                                >
                                                    日時{getSortIcon('calendar_date')}
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    操作
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {expenditureInfoList.length > 0 ? (
                                                expenditureInfoList.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900 max-w-xs" title={item.name}>
                                                                {item.name && item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900 text-left">
                                                                {item.amount ? item.amount.toLocaleString() : 0}円
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900 max-w-xs" title={item.category_name}>
                                                                {item.category_name && item.category_name.length > 15 ? item.category_name.substring(0, 15) + '...' : item.category_name}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.calendar_date ? format(new Date(item.calendar_date), "yyyy/MM/dd") : "-"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex justify-end space-x-2">
                                                                <Button
                                                                    onClick={() =>
                                                                        openUpdateModal(
                                                                            item.id,
                                                                            item.name,
                                                                            item.category_id,
                                                                            item.amount,
                                                                            item.calendar_date
                                                                        )
                                                                    }
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    onClick={() =>
                                                                        deleteExpenditure(
                                                                            item.id
                                                                        )
                                                                    }
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-red-500 hover:text-red-700"
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
                                                            データがありません。上の「支出追加」ボタンから支出を登録してください。
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
            </AuthenticatedLayout>

            <div
                ref={addExpenditureRef}
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center hidden"
            >
                <div
                    onClick={closeModal}
                    className="absolute w-full h-full bg-gray-900 opacity-50"
                ></div>
                <div className="z-10 bg-white p-6 rounded shadow-lg w-1/2">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">
                            支出を登録する
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
                                支出名
                            </label>
                            <input
                                type="text"
                                name="expenditure_name"
                                value={expenditureName}
                                onChange={changeExpenditureName}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="例) 食費"
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
                                name=""
                                id=""
                                onChange={changeExpenditureCategoryId}
                            >
                                <option value="">選択してください</option>
                                {expenditureCategoryInfoList.map(
                                    (item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.name}
                                        </option>
                                    )
                                )}
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
                                name="amount"
                                value={expenditureAmount}
                                onChange={changeExpenditureAmount}
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
                                selected={selectedDate}
                                onChange={handleDateChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                dateFormat="yyyy/MM/dd"
                                locale={ja}
                            />
                        </div>
                    </div>
                    <button
                        onClick={addExpenditure}
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
                        支出を登録する
                    </button>
                </div>
            </div>

            <div
                ref={updateExpenditureRef}
                className="fixed top-0 left-0 w-full h-full flex items-center justify-center hidden"
            >
                <div
                    onClick={closeModal}
                    className="absolute w-full h-full bg-gray-900 opacity-50"
                ></div>
                <div className="z-10 bg-white p-6 rounded shadow-lg w-1/2">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                        <h3 className="text-lg font-semibold text-gray-900">
                            支出を編集する
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
                                支出名
                            </label>
                            <input
                                type="text"
                                name="expenditure_name"
                                value={expenditureName}
                                onChange={changeExpenditureName}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="例) 食費"
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
                                name=""
                                id=""
                                value={expenditureCategoryId}
                                onChange={changeExpenditureCategoryId}
                            >
                                <option value="">選択してください</option>
                                {expenditureCategoryInfoList.map(
                                    (item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.name}
                                        </option>
                                    )
                                )}
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
                                name="amount"
                                value={expenditureAmount}
                                onChange={changeExpenditureAmount}
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
                                selected={selectedDate}
                                onChange={handleDateChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                dateFormat="yyyy/MM/dd"
                                locale={ja}
                            />
                        </div>
                    </div>
                    <button
                        onClick={updateExpenditure}
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
                        支出を更新する
                    </button>
                </div>
            </div>
        </>
    );
}
