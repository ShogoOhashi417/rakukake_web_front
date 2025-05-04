import React, { useState, forwardRef, useImperativeHandle } from "react";

const YearSelectBox = forwardRef(({onChange, className = '', value = ''}, ref) => {
    const currentYear = new Date().getFullYear();

    const years = Array.from({ length: 16 }, (_, i) => currentYear - 10 + i);

    const [selectedYear, setSelectedYear] = useState(currentYear);

    // refを通じて外部から呼び出せるメソッドを定義
    useImperativeHandle(ref, () => ({
        resetYear: () => {
            setSelectedYear("");
        }
    }));
    
    const handleChange = (event) => {
        setSelectedYear(event.target.value);

        if (onChange) {
            onChange(event);
        }
    };
    
    // 親コンポーネントからvalueが渡された場合は、それを優先する
    const displayValue = value !== '' ? value : selectedYear;
    
    return (
        <select
            id="year-select"
            value={displayValue}
            className={`w-1/6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ` + className}
            onChange={handleChange}
        >
            <option key="" value="">
                年単位で表示する
            </option>
            {years.map((year) => (
            <option key={year} value={year}>
                {year}
            </option>
            ))}
        </select>
    );
});

export default YearSelectBox;