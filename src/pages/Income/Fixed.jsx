import React from "react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import ja from "date-fns/locale/ja";
import axios from "axios";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
import {
    createColumnHelper,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from "@tanstack/react-table";

// DatePickerの幅を100%にするためのスタイル
const globalStyles = `
	.react-datepicker-wrapper {
    width: 100% !important;
}

.icon-button {
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0 0.5rem;
}

.nav-header {
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem 0;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
}

.nav-logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1a56db;
    text-decoration: none;
}

.nav-links {
    display: flex;
    gap: 1.5rem;
}

.nav-link {
    color: #4b5563;
    text-decoration: none;
    font-size: 0.9rem;
    transition: color 0.2s;
}

.nav-link:hover {
    color: #1a56db;
}

.nav-link.active {
    color: #1a56db;
    font-weight: 600;
}
`;

export default function Fixed({
    incomeDataList = [],
    IncomeCategoryDataList = [],
}) {
    const [incomeInfoList, setIncomeInfoList] = useState(incomeDataList);
    const [categoryInfoList, setCategoryInfoList] = useState(
        IncomeCategoryDataList
    );

    const [incomeId, setIncomeId] = useState(0);
    const [incomeName, setIncomeName] = useState("");
    const [incomeCategoryId, setIncomeCategoryId] = useState(0);
    const [incomeAmount, setIncomeAmount] = useState(0);
    const [periodStartDate, setPeriodStartDate] = useState(null);
    const [periodEndDate, setPeriodEndDate] = useState(null);
    const [cycleUnit, setCycleUnit] = useState(1);
    const [paymentDay, setPaymentDay] = useState(1);
    const [paymentMonth, setPaymentMonth] = useState(1);

    const changeIncomeName = (event) => {
        setIncomeName(event.target.value);
    };

    const changeIncomeCategoryId = (event) => {
        setIncomeCategoryId(event.target.value);
    };

    const changeIncomeAmount = (event) => {
        setIncomeAmount(parseInt(event.target.value));
    };

    const addIncomeRef = useRef(null);
    const updateIncomeRef = useRef(null);

    const openAddModal = () => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        setIncomeName("");
        setIncomeCategoryId(0);
        setIncomeAmount(0);
        setPeriodStartDate(firstDayOfMonth);
        setPeriodEndDate(null);
        setCycleUnit(1);
        setPaymentDay(1);
        setPaymentMonth(1);
        addIncomeRef.current.classList.remove("hidden");
    };

    const openUpdateModal = (
        incomeId,
        incomeName,
        incomeCategoryId,
        incomeAmount,
        paymentDay,
        paymentMonth,
        startDate,
        endDate,
        cycleUnitValue
    ) => {
        setIncomeId(incomeId);
        setIncomeName(incomeName);
        setIncomeCategoryId(incomeCategoryId);
        setIncomeAmount(incomeAmount);
        setPaymentDay(paymentDay);
        setPaymentMonth(paymentMonth);
        setPeriodStartDate(startDate ? new Date(startDate) : null);
        setPeriodEndDate(endDate ? new Date(endDate) : null);
        setCycleUnit(cycleUnitValue);
        updateIncomeRef.current.classList.remove("hidden");
    };

    const closeModal = () => {
        addIncomeRef.current.classList.add("hidden");
        updateIncomeRef.current.classList.add("hidden");
    };

    const getInfo = () => {
        axios
            .get("/api/fixed-income/get")
            .then((response) => {
                setIncomeInfoList(response.data.fixedIncomes);
                setCategoryInfoList(response.data.incomeCategoryInfoList);
            })
            .catch((error) => {
                console.error("データの取得に失敗しました", error);
            });
    };

    const addIncome = () => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const localStartDate = periodStartDate || firstDayOfMonth;

        const localPeriodStartDate = format(
            localStartDate,
            cycleUnit == 1 ? "yyyy-MM-01" : "yyyy-01-01"
        );
        const localPeriodEndDate = periodEndDate
            ? format(
                  periodEndDate,
                  cycleUnit == 1
                      ? "yyyy-MM-01"
                      : `yyyy-${String(paymentMonth).padStart(2, "0")}-01`
              )
            : null;

        axios
            .post("/api/fixed-income/create", {
                income_name: incomeName,
                income_category_id: incomeCategoryId,
                income_amount: incomeAmount,
                cycle_unit: cycleUnit,
                payment_day: paymentDay,
                payment_month: cycleUnit == 2 ? paymentMonth : null,
                period_start_date: localPeriodStartDate,
                period_end_date: localPeriodEndDate,
            })
            .then(() => {
                getInfo();
                closeModal();
            })
            .catch(error => {
                console.error("収入の追加に失敗しました", error);
            });

        setIncomeName("");
        setIncomeCategoryId(0);
        setIncomeAmount(0);
        setPeriodStartDate(null);
        setPeriodEndDate(null);
    };

    const updateIncome = () => {
        const localPeriodStartDate = periodStartDate
            ? format(
                  periodStartDate,
                  cycleUnit == 1
                      ? "yyyy-MM-01"
                      : `yyyy-${String(paymentMonth).padStart(2, "0")}-01`
              )
            : null;
        const localPeriodEndDate = periodEndDate
            ? format(
                  periodEndDate,
                  cycleUnit == 1
                      ? "yyyy-MM-01"
                      : `yyyy-${String(paymentMonth).padStart(2, "0")}-01`
              )
            : null;

        axios
            .put(`/fixed-income/update/${incomeId}`, {
                income_name: incomeName,
                income_category_id: incomeCategoryId,
                income_amount: incomeAmount,
                cycle_unit: cycleUnit,
                payment_day: paymentDay,
                payment_month: cycleUnit == 2 ? paymentMonth : null,
                period_start_date: localPeriodStartDate,
                period_end_date: localPeriodEndDate,
            })
            .then(() => {
                getInfo();
                closeModal();
            })
            .catch(error => {
                console.error("収入の更新に失敗しました", error);
            });

        setIncomeId(0);
        setIncomeName("");
        setIncomeCategoryId(0);
        setIncomeAmount(0);
        setPeriodStartDate(null);
        setPeriodEndDate(null);
    };

    const deleteIncome = (incomeId) => {
        if (!window.confirm("本当にこの固定収入を削除しますか？")) {
            return;
        }

        axios.delete(`/fixed-income/${incomeId}`)
            .then(() => {
                getInfo();
            })
            .catch(error => {
                console.error("収入の削除に失敗しました", error);
            });
    };

    const columnHelper = createColumnHelper();

    const data = React.useMemo(() => incomeInfoList, [incomeInfoList]);

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
                formatValue: (value) => `${value.toLocaleString()}円`,
            }),
            columnHelper.accessor("period_type", {
                header: "受け取りペース",
                cell: (info) => info.getValue(),
                sortingFn: "basic",
                formatValue: (value) => (value === "month" ? "毎月" : "毎年"),
            }),
            columnHelper.accessor("payment_month", {
                header: "受け取り月",
                cell: (info) => {
                    const row = info.row.original;
                    return row.period_type === "month" ? "-" : info.getValue();
                },
                sortingFn: "basic",
                formatValue: (value) => (value ? `${value} 月` : "-"),
            }),
            columnHelper.accessor("payment_day", {
                header: "受け取り日",
                cell: (info) => info.getValue(),
                sortingFn: "basic",
                formatValue: (value) => `${value} 日`,
            }),
            columnHelper.accessor("period_start_date", {
                header: "開始",
                cell: (info) => {
                    const value = info.getValue();
                    if (!value) return "-";
                    const date = new Date(value);
                    return format(date, "yyyy/MM");
                },
                sortingFn: "basic",
                formatValue: (value) => {
                    if (!value) return "-";
                    const date = new Date(value);
                    return format(date, "yyyy/MM");
                },
            }),
            columnHelper.accessor("period_end_date", {
                header: "終了",
                cell: (info) => {
                    const value = info.getValue();
                    if (!value) return "-";
                    const date = new Date(value);
                    return format(date, "yyyy/MM");
                },
                sortingFn: "basic",
                formatValue: (value) => {
                    if (!value) return "-";
                    const date = new Date(value);
                    return format(date, "yyyy/MM");
                },
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

    return (
        <>
            <style>{globalStyles}</style>
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        固定収入管理
                    </h2>
                }
            >
                <div className="w-5/6 mx-auto my-3 flex-1 relative sm:justify-center bg-gray-100 selection:text-white">
                    <div className="container">
                        <div className="mx-auto mt-3">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        {table
                                            .getHeaderGroups()
                                            .map((headerGroup) => (
                                                <tr key={headerGroup.id}>
                                                    {headerGroup.headers.map(
                                                        (header) => (
                                                            <th
                                                                key={
                                                                    header.id
                                                                }
                                                                onClick={header.column.getToggleSortingHandler()}
                                                                className="cursor-pointer border px-4 py-2"
                                                            >
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : header
                                                                          .column
                                                                          .columnDef
                                                                          .header}
                                                                {{
                                                                    asc: " ↑",
                                                                    desc: " ↓",
                                                                }[
                                                                    header.column.getIsSorted()
                                                                ] ?? null}
                                                            </th>
                                                        )
                                                    )}
                                                    <th className="w-10">
                                                        <div className="flex justify-center items-center">
                                                            <span className="icon-button" title="追加" onClick={openAddModal}>
                                                                ➕
                                                            </span>
                                                        </div>
                                                    </th>
                                                </tr>
                                            ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.length > 0 ? (
                                            table
                                                .getRowModel()
                                                .rows.map((row) => (
                                                    <tr
                                                        key={row.id}
                                                        className="bg-white border-b hover:bg-gray-50"
                                                    >
                                                        {row
                                                            .getVisibleCells()
                                                            .map((cell) => (
                                                                <td
                                                                    key={
                                                                        cell.id
                                                                    }
                                                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                                                >
                                                                    {cell.column
                                                                        .columnDef
                                                                        .formatValue
                                                                        ? cell.column.columnDef.formatValue(
                                                                            cell.getValue()
                                                                        )
                                                                        : cell.getValue()}
                                                                </td>
                                                            ))}
                                                        <td>
                                                            <div className="flex justify-center items-center gap-1">
                                                                <span className="icon-button" title="編集" onClick={() => openUpdateModal(row.original.id, row.getValue("name"), row.original.category_id, row.getValue("amount"), row.getValue("payment_day"), row.getValue("payment_month"), row.getValue("period_start_date"), row.getValue("period_end_date"), row.original.period_type === "month" ? 1 : 2)}>
                                                                    ✏️
                                                                </span>
                                                                <span className="icon-button" title="削除" onClick={() => deleteIncome(row.original.id)}>
                                                                    ❌
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr className="bg-white border-b">
                                                <td colSpan={9} className="px-6 py-4 text-center font-medium text-gray-900">
                                                    データがありません。右上の ➕ から固定収入を登録してください。
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>

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
                            固定収入を登録する
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
                    <div className="grid gap-4 mb-4 grid-cols-2 mt-3">
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                収入名
                            </label>
                            <input
                                type="text"
                                name="income_name"
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
                                name=""
                                id=""
                                value={incomeCategoryId}
                                onChange={changeIncomeCategoryId}
                            >
                                <option value="">選択してください</option>
                                {categoryInfoList.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <option value={item.id}>
                                            {item.name}
                                        </option>
                                    </React.Fragment>
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
                                name="amount"
                                value={incomeAmount}
                                onChange={changeIncomeAmount}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                min="1"
                            />
                        </div>
                        <div className="col-span-2 gap-4">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                受け取りペース
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="period-type-month"
                                        name="period-type"
                                        value="1"
                                        checked={cycleUnit == 1}
                                        onChange={() => {
                                            setCycleUnit(1);
                                            setPaymentDay(1);
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="period-type-month"
                                        className="ms-2 text-sm font-medium text-gray-900"
                                    >
                                        毎月
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="period-type-year"
                                        name="period-type"
                                        value="2"
                                        checked={cycleUnit == 2}
                                        onChange={() => {
                                            setCycleUnit(2);
                                            setPaymentMonth(1);
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="period-type-year"
                                        className="ms-2 text-sm font-medium text-gray-900"
                                    >
                                        毎年
                                    </label>
                                </div>
                            </div>
                        </div>
                        {cycleUnit == 1 && (
                            <div className="col-span-2">
                                <label
                                    htmlFor="payment_day"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    受け取り日
                                </label>
                                <select
                                    id="payment_day"
                                    value={paymentDay}
                                    onChange={(e) =>
                                        setPaymentDay(Number(e.target.value))
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                >
                                    {[...Array(31)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}日
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {cycleUnit == 2 && (
                            <>
                                <div className="col-span-1">
                                    <label
                                        htmlFor="payment_month"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        受け取り月
                                    </label>
                                    <select
                                        id="payment_month"
                                        value={paymentMonth}
                                        onChange={(e) =>
                                            setPaymentMonth(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    >
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}月
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label
                                        htmlFor="payment_day"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        受け取り日
                                    </label>
                                    <select
                                        id="payment_day"
                                        value={paymentDay}
                                        onChange={(e) =>
                                            setPaymentDay(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    >
                                        {[...Array(31)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}日
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        <div className="col-span-2 flex gap-4">
                            <div className="w-5/12 mr-auto">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    開始
                                </label>
                                <DatePicker
                                    selected={periodStartDate}
                                    onChange={(date) => {
                                        if (cycleUnit == 2 && date) {
                                            const newDate = new Date(date);
                                            newDate.setMonth(paymentMonth - 1);
                                            setPeriodStartDate(newDate);
                                        } else {
                                            setPeriodStartDate(date);
                                        }
                                    }}
                                    dateFormat={
                                        cycleUnit == 1 ? "yyyy年MM月" : "yyyy年"
                                    }
                                    showMonthYearPicker={cycleUnit == 1}
                                    showYearPicker={cycleUnit == 2}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    locale={ja}
                                />
                            </div>
                            <div className="flex items-center mt-7">
                                <span className="text-gray-900 text-lg">
                                    〜
                                </span>
                            </div>
                            <div className="w-5/12 ml-auto">
                                <label
                                    htmlFor="name"
                                    className="flex mb-2 text-sm font-medium text-gray-900"
                                >
                                    終了
                                </label>
                                <div className="">
                                    <DatePicker
                                        selected={periodEndDate}
                                        onChange={(date) => {
                                            if (cycleUnit == 2 && date) {
                                                const newDate = new Date(date);
                                                newDate.setMonth(
                                                    paymentMonth - 1
                                                );
                                                setPeriodEndDate(newDate);
                                            } else {
                                                setPeriodEndDate(date);
                                            }
                                        }}
                                        dateFormat={
                                            cycleUnit == 1
                                                ? "yyyy年MM月"
                                                : "yyyy年"
                                        }
                                        showMonthYearPicker={cycleUnit == 1}
                                        showYearPicker={cycleUnit == 2}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                        locale={ja}
                                    />
                                </div>
                            </div>
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
                        固定収入を登録する
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
                            固定収入を編集する
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
                    <div className="grid gap-4 mb-4 grid-cols-2 mt-3">
                        <div className="col-span-2">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                収入名
                            </label>
                            <input
                                type="text"
                                name="income_name"
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
                                name=""
                                id=""
                                value={incomeCategoryId}
                                onChange={changeIncomeCategoryId}
                            >
                                <option value="">選択してください</option>
                                {categoryInfoList.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <option value={item.id}>
                                            {item.name}
                                        </option>
                                    </React.Fragment>
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
                                name="amount"
                                value={incomeAmount}
                                onChange={changeIncomeAmount}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                min="1"
                            />
                        </div>
                        <div className="col-span-2 gap-4">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                受け取りペース
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="period-type-month-edit"
                                        name="period-type-edit"
                                        value="1"
                                        checked={cycleUnit == 1}
                                        onChange={() => {
                                            setCycleUnit(1);
                                            setPaymentDay(1);
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="period-type-month-edit"
                                        className="ms-2 text-sm font-medium text-gray-900"
                                    >
                                        毎月
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="period-type-year-edit"
                                        name="period-type-edit"
                                        value="2"
                                        checked={cycleUnit == 2}
                                        onChange={() => {
                                            setCycleUnit(2);
                                            setPaymentMonth(1);
                                        }}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label
                                        htmlFor="period-type-year-edit"
                                        className="ms-2 text-sm font-medium text-gray-900"
                                    >
                                        毎年
                                    </label>
                                </div>
                            </div>
                        </div>
                        {cycleUnit == 1 ? (
                            <div className="col-span-2">
                                <label
                                    htmlFor="payment_day_edit"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    受け取り日
                                </label>
                                <select
                                    id="payment_day_edit"
                                    value={paymentDay}
                                    onChange={(e) =>
                                        setPaymentDay(Number(e.target.value))
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                >
                                    {[...Array(31)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}日
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <>
                                <div className="col-span-1">
                                    <label
                                        htmlFor="payment_month_edit"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        受け取り月
                                    </label>
                                    <select
                                        id="payment_month_edit"
                                        value={paymentMonth}
                                        onChange={(e) =>
                                            setPaymentMonth(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    >
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}月
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label
                                        htmlFor="payment_day_edit"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        受け取り日
                                    </label>
                                    <select
                                        id="payment_day_edit"
                                        value={paymentDay}
                                        onChange={(e) =>
                                            setPaymentDay(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    >
                                        {[...Array(31)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}日
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        <div className="col-span-2 flex gap-4">
                            <div className="w-5/12 mr-auto">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    開始
                                </label>
                                <DatePicker
                                    selected={periodStartDate}
                                    onChange={(date) => {
                                        if (cycleUnit == 2 && date) {
                                            const newDate = new Date(date);
                                            newDate.setMonth(paymentMonth - 1);
                                            setPeriodStartDate(newDate);
                                        } else {
                                            setPeriodStartDate(date);
                                        }
                                    }}
                                    dateFormat={
                                        cycleUnit == 1 ? "yyyy年MM月" : "yyyy年"
                                    }
                                    showMonthYearPicker={cycleUnit == 1}
                                    showYearPicker={cycleUnit == 2}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    locale={ja}
                                />
                            </div>
                            <div className="flex items-center mt-7">
                                <span className="text-gray-900 text-lg">
                                    〜
                                </span>
                            </div>
                            <div className="w-5/12 ml-auto">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900"
                                >
                                    終了
                                </label>
                                <DatePicker
                                    selected={periodEndDate}
                                    onChange={(date) => {
                                        if (cycleUnit == 2 && date) {
                                            const newDate = new Date(date);
                                            newDate.setMonth(paymentMonth - 1);
                                            setPeriodEndDate(newDate);
                                        } else {
                                            setPeriodEndDate(date);
                                        }
                                    }}
                                    dateFormat={
                                        cycleUnit == 1 ? "yyyy年MM月" : "yyyy年"
                                    }
                                    showMonthYearPicker={cycleUnit == 1}
                                    showYearPicker={cycleUnit == 2}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    locale={ja}
                                />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={updateIncome}
                        type="submit"
                        className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-8"
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
                        固定収入を更新する
                    </button>
                </div>
            </div>
        </>
    );
}
