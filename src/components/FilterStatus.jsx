import React from 'react';

const FilterStatus = ({ selectedCategoryId, incomeCategoryInfoList, filteredIncomeList, onClearFilter }) => {
    if (!selectedCategoryId) return null;
    
    const selectedCategory = incomeCategoryInfoList.find(
        cat => cat.id === parseInt(selectedCategoryId)
    );
    
    return (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">
                    フィルター中: {selectedCategory?.name} 
                    ({filteredIncomeList.length}件表示)
                </span>
                <button
                    onClick={onClearFilter}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                    フィルターを解除
                </button>
            </div>
        </div>
    );
};

export default FilterStatus; 