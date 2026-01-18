import React from "react";
import { Card, CardContent } from "./ui/card";
import { Building2, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

const BankAccountCard = ({ 
    account, 
    onEdit = () => {}, 
    onDelete = () => {},
    showActions = true 
}) => {
    const formatAmount = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) {
            return "0円";
        }
        return Number(amount).toLocaleString() + "円";
    };

    const getBankIcon = (bankName) => {
        if (!bankName) return "bg-gray-100 text-gray-600";
        
        const bankColors = {
            "三菱UFJ銀行": "bg-red-100 text-red-600",
            "みずほ銀行": "bg-blue-100 text-blue-600", 
            "三井住友銀行": "bg-green-100 text-green-600",
            "楽天銀行": "bg-purple-100 text-purple-600",
            "ゆうちょ銀行": "bg-orange-100 text-orange-600"
        };
        
        return bankColors[bankName] || "bg-gray-100 text-gray-600";
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(account);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`${account.bank_name || '銀行口座'}を削除しますか？`)) {
            onDelete(account.id);
        }
    };

    return (
        <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center flex-1">
                        <div className={`p-3 rounded-full mr-3 ${getBankIcon(account.bank_name)}`}>
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">
                                {account.bank_name || '銀行名未設定'}
                            </h4>
                        </div>
                    </div>
                    
                    {showActions && (
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleEdit}
                                className="p-2"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDelete}
                                className="p-2 text-red-500 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
                
                {account.branch_name && (
                    <div className="flex items-center mb-4">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                            {account.branch_name || '支店名未設定'}
                        </span>
                    </div>
                )}

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-500">
                            残高
                        </span>
                        <div className="text-right">
                            <span className="text-xl font-bold text-green-600">
                                {formatAmount(account.balance)}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BankAccountCard;