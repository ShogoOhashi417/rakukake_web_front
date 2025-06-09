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

export default function Expense() {
    const { user } = useAuth();
    
    useEffect(() => {
        document.title = "支出管理";
        getInfo();
        getCategories();
    }, []);
    
    const [expenditureInfoList, setExpenditureInfoList] = useState([]);

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
        try {
            const expenditureList = await expenditureService.getExpenditureList();
            setExpenditureInfoList(expenditureList);
        } catch (error) {
            console.error('支出データの取得に失敗しました:', error);
            setExpenditureInfoList([]);
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
                <div className="flex flex-col min-h-screen">
                    <div className=" w-5/6 mx-auto my-3 flex-1 relative sm:justify-center bg-dots-darker bg-center bg-gray-100 selection:text-white">
                        <div className="container">
                            <div className="mx-auto mt-3">
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th 
                                                    className="cursor-pointer border px-4 py-2"
                                                    onClick={() => sortData('name')}
                                                >
                                                    支出名{getSortIcon('name')}
                                                </th>
                                                <th 
                                                    className="cursor-pointer border px-4 py-2"
                                                    onClick={() => sortData('amount')}
                                                >
                                                    金額{getSortIcon('amount')}
                                                </th>
                                                <th 
                                                    className="cursor-pointer border px-4 py-2"
                                                    onClick={() => sortData('category_name')}
                                                >
                                                    カテゴリー{getSortIcon('category_name')}
                                                </th>
                                                <th className="w-10">
                                                    <div className="flex justify-center items-center">
                                                        <button onClick={openAddModal}>
                                                            <PlusCircle className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expenditureInfoList.length > 0 ? (
                                                expenditureInfoList.map((item, index) => (
                                                    <tr
                                                        key={index}
                                                        className={index % 2 === 0 ? "bg-white border-b" : "bg-gray-100 border-b"}
                                                    >
                                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                            {item.name}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                            {item.amount}
                                                        </td>
                                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                            {item.category_name}
                                                        </td>
                                                        <td className="w-10 p-2 border">
                                                            <div className="flex justify-center items-center gap-1">
                                                                <button
                                                                    className="mr-2"
                                                                    onClick={() =>
                                                                        openUpdateModal(
                                                                            item.id,
                                                                            item.name,
                                                                            item.category_id,
                                                                            item.amount,
                                                                            item.calendar_date
                                                                        )
                                                                    }
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        deleteExpenditure(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr className="bg-white border-b">
                                                    <td colSpan={4} className="px-6 py-4 text-center font-medium text-gray-900">
                                                        データがありません。右上の + から支出を登録してください。
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
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
