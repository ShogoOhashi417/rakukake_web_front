import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
import { X, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function Category() {
    // モックユーザー情報
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // モックデータ
    const [incomeCategoryInfoList, setIncomeCategoryInfoList] = useState([
        { id: 1, name: "給与" },
        { id: 2, name: "臨時収入" },
        { id: 3, name: "副収入" },
        { id: 4, name: "その他" },
    ]);

    const [expenditureCategoryInfoList, setExpenditureCategoryInfoList] = useState([
        { id: 1, name: "食費" },
        { id: 2, name: "日用品" },
        { id: 3, name: "交通費" },
        { id: 4, name: "光熱費" },
        { id: 5, name: "通信費" },
        { id: 6, name: "住居費" },
        { id: 7, name: "教育費" },
        { id: 8, name: "医療費" },
        { id: 9, name: "交際費" },
        { id: 10, name: "娯楽費" },
        { id: 11, name: "その他" },
    ]);

    useEffect(() => {
        // ローカルストレージからユーザー情報を取得
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
            // 認証されていない場合はログインページにリダイレクト
            window.location.href = '/login';
        }
        setLoading(false);
    }, []);

    const [activeTab, setActiveTab] = useState("income");

    const changeActiveTab = (tab) => {
        setActiveTab(tab);
    };

    const activeTabClassAttribute =
        "bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold cursor-pointer";
    const inactiveTabClassAttribute =
        "bg-white inline-block py-2 px-4 text-blue-300 hover:text-blue-800 font-semibold cursor-pointer";

    // モーダル状態の管理
    const [addCategory, setAddCategory] = useState(false);
    const [addExpenditureCategory, setAddExpenditureCategory] = useState(false);
    const [editIncomeCategory, setEditIncomeCategory] = useState(false);
    const [editExpenditureCategory, setEditExpenditureCategory] = useState(false);

    // 収入カテゴリーの状態管理
    const [incomeCategoryId, setIncomeCategoryId] = useState(0);
    const [incomeCategoryName, setIncomeCategoryName] = useState("");

    // 支出カテゴリーの状態管理
    const [expenditureCategoryId, setExpenditureCategoryId] = useState(0);
    const [expenditureCategoryName, setExpenditureCategoryName] = useState("");

    // モーダル表示・非表示の制御
    const showAddCategoryModal = () => {
        setAddCategory(true);
    };

    const showEditIncomeCategoryModal = (incomeCategoryId, incomeCategoryName) => {
        setIncomeCategoryId(incomeCategoryId);
        setIncomeCategoryName(incomeCategoryName);
        setEditIncomeCategory(true);
    };

    const showExpenditureCategoryModal = () => {
        setAddExpenditureCategory(true);
    };

    const showEditExpenditureCategoryModal = (expenditureCategoryId, expenditureCategoryName) => {
        setExpenditureCategoryId(expenditureCategoryId);
        setExpenditureCategoryName(expenditureCategoryName);
        setEditExpenditureCategory(true);
    };

    const closeModal = () => {
        setAddCategory(false);
        setAddExpenditureCategory(false);
        setEditExpenditureCategory(false);
        setEditIncomeCategory(false);
    };

    // イベントハンドラー
    const changeIncomeCaterogyName = (event) => {
        setIncomeCategoryName(event.target.value);
    };

    const changeExpenditureCaterogyName = (event) => {
        setExpenditureCategoryName(event.target.value);
    };

    // 収入カテゴリーの追加
    const addIncomeCategory = () => {
        // モックでデータを追加
        const newIncomeCategory = {
            id: incomeCategoryInfoList.length + 1,
            name: incomeCategoryName
        };
        
        setIncomeCategoryInfoList([...incomeCategoryInfoList, newIncomeCategory]);
        closeModal();
        setIncomeCategoryName("");
    };

    // 支出カテゴリーの追加
    const saveExpenditureCategory = () => {
        // モックでデータを追加
        const newExpenditureCategory = {
            id: expenditureCategoryInfoList.length + 1,
            name: expenditureCategoryName
        };
        
        setExpenditureCategoryInfoList([...expenditureCategoryInfoList, newExpenditureCategory]);
        closeModal();
        setExpenditureCategoryName("");
    };

    // 収入カテゴリーの更新
    const updateIncomeCategory = () => {
        // モックでデータを更新
        const updatedCategories = incomeCategoryInfoList.map(category => {
            if (category.id === incomeCategoryId) {
                return {
                    ...category,
                    name: incomeCategoryName
                };
            }
            return category;
        });
        
        setIncomeCategoryInfoList(updatedCategories);
        closeModal();
    };

    // 支出カテゴリーの更新
    const updateExpenditureCategory = () => {
        // モックでデータを更新
        const updatedCategories = expenditureCategoryInfoList.map(category => {
            if (category.id === expenditureCategoryId) {
                return {
                    ...category,
                    name: expenditureCategoryName
                };
            }
            return category;
        });
        
        setExpenditureCategoryInfoList(updatedCategories);
        closeModal();
    };

    // 支出カテゴリーの削除
    const deleteExpenditureCategory = (expenditureCategoryId) => {
        if (!confirm("この支出カテゴリーを削除します。本当によろしいですか？")) {
            return;
        }

        // モックでデータを削除
        const filteredCategories = expenditureCategoryInfoList.filter(
            category => category.id !== expenditureCategoryId
        );
        setExpenditureCategoryInfoList(filteredCategories);
    };

    // 収入カテゴリーの削除
    const deleteIncomeCategory = (incomeCategoryId) => {
        if (!confirm("この収入カテゴリーを削除します。本当によろしいですか？")) {
            return;
        }

        // モックでデータを削除
        const filteredCategories = incomeCategoryInfoList.filter(
            category => category.id !== incomeCategoryId
        );
        setIncomeCategoryInfoList(filteredCategories);
    };

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
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    カテゴリー管理
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <ul className="flex border-b">
                                <li className="-mb-px mr-1">
                                    <a
                                        className={
                                            activeTab === "income"
                                                ? activeTabClassAttribute
                                                : inactiveTabClassAttribute
                                        }
                                        onClick={() => changeActiveTab("income")}
                                    >
                                        収入
                                    </a>
                                </li>
                                <li className="mr-1">
                                    <a
                                        className={
                                            activeTab === "expenditure"
                                                ? activeTabClassAttribute
                                                : inactiveTabClassAttribute
                                        }
                                        onClick={() => changeActiveTab("expenditure")}
                                    >
                                        支出
                                    </a>
                                </li>
                            </ul>

                            {activeTab === "income" && (
                                <div className="mt-4">
                                    <Button
                                        onClick={showAddCategoryModal}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        カテゴリー追加
                                    </Button>

                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    カテゴリー名
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    操作
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {incomeCategoryInfoList.map((category) => (
                                                <tr key={category.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Button
                                                            onClick={() => showEditIncomeCategoryModal(category.id, category.name)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="mr-2"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => deleteIncomeCategory(category.id)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === "expenditure" && (
                                <div className="mt-4">
                                    <Button
                                        onClick={showExpenditureCategoryModal}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        カテゴリー追加
                                    </Button>

                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    カテゴリー名
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    操作
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {expenditureCategoryInfoList.map((category) => (
                                                <tr key={category.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Button
                                                            onClick={() => showEditExpenditureCategoryModal(category.id, category.name)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="mr-2"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            onClick={() => deleteExpenditureCategory(category.id)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-red-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 収入カテゴリー追加モーダル */}
            {addCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold">収入カテゴリー追加</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">カテゴリー名</label>
                                <input
                                    type="text"
                                    value={incomeCategoryName}
                                    onChange={changeIncomeCaterogyName}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={closeModal}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    キャンセル
                                </Button>
                                <Button
                                    onClick={addIncomeCategory}
                                >
                                    登録
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 収入カテゴリー編集モーダル */}
            {editIncomeCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold">収入カテゴリー編集</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">カテゴリー名</label>
                                <input
                                    type="text"
                                    value={incomeCategoryName}
                                    onChange={changeIncomeCaterogyName}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={closeModal}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    キャンセル
                                </Button>
                                <Button
                                    onClick={updateIncomeCategory}
                                >
                                    更新
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 支出カテゴリー追加モーダル */}
            {addExpenditureCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold">支出カテゴリー追加</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">カテゴリー名</label>
                                <input
                                    type="text"
                                    value={expenditureCategoryName}
                                    onChange={changeExpenditureCaterogyName}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={closeModal}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    キャンセル
                                </Button>
                                <Button
                                    onClick={saveExpenditureCategory}
                                >
                                    登録
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 支出カテゴリー編集モーダル */}
            {editExpenditureCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold">支出カテゴリー編集</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium">カテゴリー名</label>
                                <input
                                    type="text"
                                    value={expenditureCategoryName}
                                    onChange={changeExpenditureCaterogyName}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={closeModal}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    キャンセル
                                </Button>
                                <Button
                                    onClick={updateExpenditureCategory}
                                >
                                    更新
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
} 