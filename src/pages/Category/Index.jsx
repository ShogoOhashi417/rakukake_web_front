import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
import { X, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
import PrimaryButton from "../../components/PrimaryButton";
import SecondaryButton from "../../components/SecondaryButton";
import { categoryService } from "../../api/services/categoryService";
import { userService } from "../../api/services/userService";

export default function Category() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [incomeCategoryInfoList, setIncomeCategoryInfoList] = useState([]);
    const [expenditureCategoryInfoList, setExpenditureCategoryInfoList] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userService.getProfile();
                console.error(userData);
                setUser(userData);
                setLoading(false);
            } catch (e) {
                console.error(e);
                // setUser(null);
                // setLoading(false);
                // navigate('/');
            }
        };
        fetchUser();
    }, [navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [incomeCategories, expenditureCategories] = await Promise.all([
                    categoryService.getIncomeCategories(),
                    categoryService.getExpenseCategories()
                ]);
                
                let mappedIncomeCategories = [];
                let mappedExpenditureCategories = [];
                
                mappedIncomeCategories = incomeCategories.income_category_info_list.map(category => ({
                    id: category.id,
                    name: category.name
                }));
                
                mappedExpenditureCategories = expenditureCategories.expenditure_category_info_list.map(category => ({
                    id: category.id,
                    name: category.name
                }));

                setIncomeCategoryInfoList(mappedIncomeCategories);
                setExpenditureCategoryInfoList(mappedExpenditureCategories);
            } catch (e) {
                setIncomeCategoryInfoList([]);
                setExpenditureCategoryInfoList([]);
            }
        };
        fetchCategories();
    }, []);

    const [activeTab, setActiveTab] = useState("income");

    const changeActiveTab = (tab) => {
        setActiveTab(tab);
    };

    const activeTabClassAttribute =
        "bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold cursor-pointer";
    const inactiveTabClassAttribute =
        "bg-white inline-block py-2 px-4 text-blue-300 hover:text-blue-800 font-semibold cursor-pointer";

    const [addCategory, setAddCategory] = useState(false);
    const [addExpenditureCategory, setAddExpenditureCategory] = useState(false);
    const [editIncomeCategory, setEditIncomeCategory] = useState(false);
    const [editExpenditureCategory, setEditExpenditureCategory] = useState(false);

    const [incomeCategoryId, setIncomeCategoryId] = useState(0);
    const [incomeCategoryName, setIncomeCategoryName] = useState("");

    const [expenditureCategoryId, setExpenditureCategoryId] = useState(0);
    const [expenditureCategoryName, setExpenditureCategoryName] = useState("");

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

    const changeIncomeCaterogyName = (event) => {
        setIncomeCategoryName(event.target.value);
    };

    const changeExpenditureCaterogyName = (event) => {
        setExpenditureCategoryName(event.target.value);
    };

    const addIncomeCategory = async () => {
        try {
            const response = await categoryService.addIncomeCategory(incomeCategoryName);
            
            const newCategory = {
                id: response.categoryData.id,
                name: response.categoryData.name
            };
            
            setIncomeCategoryInfoList([...incomeCategoryInfoList, newCategory]);
            
            closeModal();
            setIncomeCategoryName("");
        } catch (error) {
            console.error("カテゴリー追加中にエラーが発生しました", error);
            alert("カテゴリーの追加に失敗しました。");
        }
    };

    const saveExpenditureCategory = async () => {
        try {
            const response = await categoryService.addExpenditureCategory(expenditureCategoryName);
            
            console.error(response);
            const newCategory = {
                id: response.categoryData.id,
                name: response.categoryData.name
            };
            
            setExpenditureCategoryInfoList([...expenditureCategoryInfoList, newCategory]);
            
            closeModal();
            setExpenditureCategoryName("");
        } catch (error) {
            console.error("カテゴリー追加中にエラーが発生しました", error);
            alert("カテゴリーの追加に失敗しました。");
        }
    };

    const updateIncomeCategory = async () => {
        try {
            const response = await categoryService.updateIncomeCategory(incomeCategoryId, incomeCategoryName);
            
            const updatedCategories = incomeCategoryInfoList.map(category => {
                if (category.id === incomeCategoryId) {
                    return {
                        id: response.categoryData.id,
                        name: response.categoryData.name
                    };
                }
                return category;
            });
            
            setIncomeCategoryInfoList(updatedCategories);
            closeModal();
        } catch (error) {
            console.error("カテゴリー更新中にエラーが発生しました", error);
            alert("カテゴリーの更新に失敗しました。");
        }
    };

    const updateExpenditureCategory = async () => {
        try {
            const response = await categoryService.updateExpenseCategory(expenditureCategoryId, expenditureCategoryName);
            
            const updatedCategories = expenditureCategoryInfoList.map(category => {
                if (category.id === expenditureCategoryId) {
                    return {
                        id: response.categoryData.id,
                        name: response.categoryData.name
                    };
                }
                return category;
            });
            
            setExpenditureCategoryInfoList(updatedCategories);
            closeModal();
        } catch (error) {
            console.error("カテゴリー更新中にエラーが発生しました", error);
            alert("カテゴリーの更新に失敗しました。");
        }
    };

    const deleteExpenditureCategory = async (expenditureCategoryId) => {
        if (!window.confirm("この支出カテゴリーを削除します。本当によろしいですか？")) {
            return;
        }

        try {
            await categoryService.deleteExpenseCategory(expenditureCategoryId);
            
            const filteredCategories = expenditureCategoryInfoList.filter(
                category => category.id !== expenditureCategoryId
            );
            setExpenditureCategoryInfoList(filteredCategories);
        } catch (error) {
            console.error("カテゴリー削除中にエラーが発生しました", error);
            alert("カテゴリーの削除に失敗しました。");
        }
    };

    const deleteIncomeCategory = async (incomeCategoryId) => {
        if (!window.confirm("この収入カテゴリーを削除します。本当によろしいですか？")) {
            return;
        }

        try {
            await categoryService.deleteIncomeCategory(incomeCategoryId);
            
            const filteredCategories = incomeCategoryInfoList.filter(
                category => category.id !== incomeCategoryId
            );
            setIncomeCategoryInfoList(filteredCategories);
        } catch (error) {
            console.error("カテゴリー削除中にエラーが発生しました", error);
            alert("カテゴリーの削除に失敗しました。");
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">読み込み中...</div>;
    }

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">リダイレクト中...</div>;
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
                                <SecondaryButton
                                    onClick={closeModal}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    キャンセル
                                </SecondaryButton>
                                <PrimaryButton
                                    className="ms-3"
                                    onClick={addIncomeCategory}
                                >
                                    収入カテゴリーを追加する
                                </PrimaryButton>
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
                                <PrimaryButton
                                    className="ms-3"
                                    onClick={updateIncomeCategory}
                                >
                                    収入カテゴリーを更新する
                                </PrimaryButton>
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
                                <SecondaryButton
                                    onClick={closeModal}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    キャンセル
                                </SecondaryButton>
                                <PrimaryButton
                                    className="ms-3"
                                    onClick={saveExpenditureCategory}
                                >
                                    支出カテゴリーを追加する
                                </PrimaryButton>
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
                                <SecondaryButton
                                    onClick={closeModal}
                                    variant="outline"
                                    className="mr-2"
                                >
                                    キャンセル
                                </SecondaryButton>
                                <PrimaryButton
                                    className="ms-3"
                                    onClick={updateExpenditureCategory}
                                >
                                    支出カテゴリーを更新する
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
} 