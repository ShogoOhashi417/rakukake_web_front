import React, { useEffect, useRef, useState } from "react";
import AuthenticatedLayout from '../../components/AuthenticatedLayout';
import { PlusCircle, X, Edit, Trash2 } from "lucide-react";
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
import axios from "axios";

function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (e) {
                console.error('認証情報の解析に失敗しました', e);
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } else {
            window.location.href = '/login';
        }
        setLoading(false);
    }, []);

    return { user, loading };
}

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default function Income() {
    const { user, loading } = useAuth();

    // todo temporary.apiから取得
    const IncomeCategoryDataList = [];

    const [incomeId, setIncomeId] = useState(0);
    const [incomeName, setIncomeName] = useState('');
    const [incomeCategoryId, setIncomeCategoryId] = useState(0);
    const [incomeAmount, setIncomeAmount] = useState(0);
    
    // Initialize this above the useEffect to prevent race conditions
    const [incomeInfoList, setincomeInfoList] = useState([]);

    const getInfo = () => {
        api.get('/wasshoi')
            .then(response => {
                console.error(response);
                if (response.data && response.data.income_info_list) {
                    setincomeInfoList(response.data.income_info_list);
                } else {
                    console.error('Invalid response format:', response.data);
                    setincomeInfoList([]);
                }
            })
            .catch(error => {
                console.error('Error fetching income data:', error);
                setincomeInfoList([]);
            });
    }

    useEffect(() => {
        getInfo();
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
        
        // todo from rakukake
        // setCalendarDate({ startDate : incomeCalendarDate, endDate:incomeCalendarDate });

        // todo original
        if (incomeCalendarDate) {
            setSelectedDay(new Date(incomeCalendarDate));
        }
        
        updateIncomeRef.current.classList.remove('hidden');
    }

    const closeModal = () => {
        addIncomeRef.current.classList.add('hidden');
        updateIncomeRef.current.classList.add('hidden');
    }

    const addIncome = () => {
        // todo from rakukake
        api.post('/income/add', {
            'income_name': incomeName,
            'income_category_id' : incomeCategoryId,
            'income_amount': incomeAmount,
            // 'calendar_date' : calendarDate.startDate
        })
        .then(response => {
            getInfo();
            closeModal();
        })
        .catch(error => {
            console.error('Error adding income:', error);
        });

        setIncomeName('');
        setIncomeCategoryId(0);
        setIncomeAmount(0);

        // const newIncome = {
        //     id: incomeInfoList.length + 1, 
        //     name: incomeName,
        //     amount: incomeAmount,
        //     category_id: incomeCategoryId,
        //     category_name: incomeCategoryInfoList.find(cat => cat.id === parseInt(incomeCategoryId))?.name || "不明",
        //     date: selectedDay ? formatDateString(selectedDay) : null
        // };
        
        // setIncomeInfoList([...incomeInfoList, newIncome]);
        closeModal();
        
        // フォームをリセット
        setIncomeName('');
        setIncomeCategoryId(0);
        setIncomeAmount(0);
        setSelectedDay(null);
    }

    const updateIncome = () => {
        // todo from rakukake
        // const localDate = new Date(calendarDate.startDate).toLocaleString('sv-SE', { timeZone: 'Asia/Tokyo' });
        api.put(`/income/update/${incomeId}`, {
            'income_name': incomeName,
            'income_category_id' : incomeCategoryId,
            'income_amount': incomeAmount,
            // 'calendar_date' : localDate
        })
        .then(response => {
            getInfo();
            closeModal();
        })
        .catch(error => {
            console.error('Error updating income:', error);
        });

        setIncomeId(0);
        setIncomeName('');
        setIncomeCategoryId(0);
        setIncomeAmount(0);
        // const updatedIncomes = incomeInfoList.map(income => {
        //     if (income.id === incomeId) {
        //         return {
        //             ...income,
        //             name: incomeName,
        //             amount: incomeAmount,
        //             category_id: parseInt(incomeCategoryId),
        //             category_name: incomeCategoryInfoList.find(cat => cat.id === parseInt(incomeCategoryId))?.name || "不明",
        //             date: selectedDay ? formatDateString(selectedDay) : null
        //         };
        //     }
        //     return income;
        // });
        
        // setIncomeInfoList(updatedIncomes);
        // closeModal();
        
        // // フォームをリセット
        // setIncomeId(0);
        // setIncomeName('');
        // setIncomeCategoryId(0);
        // setIncomeAmount(0);
        // setSelectedDay(null);
    }

    const deleteIncome = (incomeId) => {
        if (!window.confirm('本当に収入を削除しますか？')) {
            return;
        }

        // todo from rakukake
        api.post('/income/delete', {
            'id' : incomeId,
            'income_name' : incomeName,
            'income_amount': incomeAmount,
        })
        .then(response => {
            getInfo();
        })
        .catch(error => {
            console.error('Error deleting income:', error);
        });
        
        // モックでデータを削除
        // const filteredIncomes = incomeInfoList.filter(income => income.id !== incomeId);
        // setIncomeInfoList(filteredIncomes);
    }

    const [incomeCategoryInfoList, setIncomeCategoryInfoList] = useState(IncomeCategoryDataList);

    const [calendarDate, setCalendarDate] = useState({ 
        startDate: null, 
        endDate: null
    });

    const columnHelper = createColumnHelper();

    const data = React.useMemo(
        () => incomeInfoList || [],
        [incomeInfoList]
    );

    const columns = React.useMemo(
        () => [
        columnHelper.accessor("name", {
            header: "収入名",
            cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("amount", {
            header: "金額",
            cell: (info) => info.getValue(),
            sortingFn: "basic",
        }),
        columnHelper.accessor("category_name", {
            header: "カテゴリー",
            cell: (info) => info.getValue(),
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

    
    // // 日付変換関数を追加
    // const formatDateString = (date) => {
    //     if (!date) return null;
    //     return format(date, 'yyyy-MM-dd');
    // };

    // const columnHelper = createColumnHelper();

    // const data = React.useMemo(
    //     () => incomeInfoList,
    //     [incomeInfoList]
    // );

    // const columns = React.useMemo(
    //     () => [
    //     columnHelper.accessor("name", {
    //         header: "収入名",
    //         cell: (info) => info.getValue(),
    //     }),
    //     columnHelper.accessor("amount", {
    //         header: "金額",
    //         cell: (info) => info.getValue().toLocaleString() + "円",
    //         sortingFn: "basic",
    //     }),
    //     columnHelper.accessor("category_name", {
    //         header: "カテゴリー",
    //         cell: (info) => info.getValue(),
    //         sortingFn: "basic",
    //     }),
    //     ],
    //     []
    // );

    // const [sorting, setSorting] = useState([]);

    // const table = useReactTable({
    //     data,
    //     columns,
    //     state: {
    //         sorting,
    //     },
    //     onSortingChange: setSorting,
    //     getCoreRowModel: getCoreRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    // });

    // ローディング中は何も表示しない
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>;
    }

    // ユーザーがない場合は何も表示しない（リダイレクト処理中）
    if (!user) {
        return null;
    }

    return (
        <AuthenticatedLayout
            user={user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">収入管理</h2>}
        >
            <div className='flex flex-col min-h-screen'>
                <div className="w-5/6 mx-auto my-3 flex-1 relative sm:justify-center bg-dots-darker bg-center bg-gray-100 selection:text-white">
                    <div className='container'>
                        <div className="mx-auto mt-3">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                        className="cursor-pointer border px-4 py-2"
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
                                                <th className='w-10'>
                                                    <div className="flex justify-center items-center">
                                                        <button onClick={openAddModal}>
                                                            <PlusCircle className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </th>
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className={
                                                    row.index % 2 === 0
                                                        ? "bg-white border-b"
                                                        : "bg-gray-100 border-b"
                                                }
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <td
                                                        key={cell.id}
                                                        className="border px-4 py-2"
                                                    >
                                                        {cell.column.columnDef.cell(cell)}
                                                    </td>
                                                ))}
                                                <td className="w-10 p-2 border">
                                                    <div className="flex justify-center items-center">
                                                        <button
                                                            onClick={() => openUpdateModal(
                                                                row.original.id || 0,
                                                                row.original.name || '',
                                                                row.original.category_id || 0,
                                                                row.original.amount || 0,
                                                                row.original.date || null
                                                            )}
                                                            className="mr-2"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteIncome(row.original.id || 0)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 収入追加モーダル */}
            <div ref={addIncomeRef} id="add_income" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                            <h3 className="text-lg font-semibold text-gray-900">
                                収入追加
                            </h3>
                            <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                <X className="w-4 h-4" />
                                <span className="sr-only">閉じる</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form className="space-y-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">収入名</label>
                                    <input type="text" value={incomeName} onChange={changeIncomeName} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="収入名" required />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">カテゴリー</label>
                                    <select onChange={changeIncomeCategoryId} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                        <option value="">選択してください</option>
                                        {incomeCategoryInfoList.map((category, index) => (
                                            <option key={index} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">金額</label>
                                    <input type="number" value={incomeAmount} onChange={changeIncomeAmount} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="金額" required />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">日付</label>
                                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                                        <DatePicker
                                            selected={selectedDay}
                                            onChange={(date) => setSelectedDay(date)}
                                            dateFormat="yyyy/MM/dd"
                                            className="w-full bg-transparent"
                                            locale={ja}
                                        />
                                    </div>
                                </div>
                                <button type="button" onClick={addIncome} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">追加</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* 収入更新モーダル */}
            <div ref={updateIncomeRef} id="update_income" tabIndex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                            <h3 className="text-lg font-semibold text-gray-900">
                                収入更新
                            </h3>
                            <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center">
                                <X className="w-4 h-4" />
                                <span className="sr-only">閉じる</span>
                            </button>
                        </div>
                        <div className="p-4 md:p-5">
                            <form className="space-y-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">収入名</label>
                                    <input type="text" value={incomeName} onChange={changeIncomeName} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="収入名" required />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">カテゴリー</label>
                                    <select value={incomeCategoryId} onChange={changeIncomeCategoryId} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                        <option value="">選択してください</option>
                                        {incomeCategoryInfoList.map((category, index) => (
                                            <option key={index} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">金額</label>
                                    <input type="number" value={incomeAmount} onChange={changeIncomeAmount} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="金額" required />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-900">日付</label>
                                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-2">
                                        <DatePicker
                                            selected={selectedDay}
                                            onChange={(date) => setSelectedDay(date)}
                                            dateFormat="yyyy/MM/dd"
                                            className="w-full bg-transparent"
                                            locale={ja}
                                        />
                                    </div>
                                </div>
                                <button type="button" onClick={updateIncome} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">更新</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 