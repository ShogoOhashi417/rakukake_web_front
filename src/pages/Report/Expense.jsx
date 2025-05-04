import React, { useEffect, useState, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import YearSelectBox from "../../components/YearSelectBox";
import axios from "axios";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";

export default function ExpenseReport({ auth = { user: { name: '' } }, expenseInfoList = { category_to_amount_list: {} } }) {
    const getMonth = (year, month, period) => {
        const date = new Date(year, month - 1 + period, 1);
        const resultYear = date.getFullYear();
        const resultMonth = date.getMonth() + 1;
        
        return resultYear + "-" + String(resultMonth).padStart(2, "0");
    };

    const [totalChartOptions, setTotalChartOptions] = useState([]);
    const [chartOptionsList, setChartOptionsList] = useState([]);

    const thisDate = new Date();
    const thisYear = thisDate.getFullYear();
    const thisMonth = thisDate.getMonth() + 1;

    const [dateList, setDateList] = useState([
        getMonth(thisYear, thisMonth, -2),
        getMonth(thisYear, thisMonth, -1),
        getMonth(thisYear, thisMonth, 0),
    ]);

    const [selectedYear, setSelectedYear] = useState("");
    const yearSelectRef = useRef(null);

    const changeYear = (event) => {
        const year = event.target.value;
        setSelectedYear(year);

        if (year === "") {
            return;
        }

        setRelativePeriod("");

        const YearMonthList = [];
        let month = 1;
        while (month <= 12) {
            YearMonthList.push(year + "-" + String(month).padStart(2, "0"));
            month++;
        }

        const updatedDateList = [...YearMonthList];
        setDateList(updatedDateList);
        
        if (updatedDateList.length > 0) {
            fetchDataWithDates(updatedDateList);
        }
    };

    const fetchDataWithDates = async (dates) => {
        if (!dates || dates.length === 0) return;

        const startDate = dates[0] + '-01';
        
        const [year, month] = dates[dates.length - 1].split('-');
        const lastDay = new Date(year, month, 0).getDate();
        const endDate = `${dates[dates.length - 1]}-${String(lastDay).padStart(2, '0')}`;

        try {
            const response = await axios.get('/report/expense/get', {
                params: {
                    start_date: startDate,
                    end_date: endDate
                }
            });
            setExpenditureInfoList(response.data.category_to_amount_list);
        } catch (error) {
            console.error('データの取得に失敗しました:', error);
        }
    };

    const THIS_MONTH_PERIOD = "1";
    const THREE_MONTHS_PERIOD = "2";
    const HALF_YEAR_PERIOD = "3";
    const THIS_YEAR_PERIOD = "4";
    const THREE_YEARS_PERIOD = "5";
    const DECADE_PERIOD = "6";

    const [relativePeriod, setRelativePeriod] = useState(THREE_MONTHS_PERIOD);

    const relativePeriodList = new Map();

    relativePeriodList.set("", "期間で表示する");
    relativePeriodList.set(THIS_MONTH_PERIOD, "今月");
    relativePeriodList.set(THREE_MONTHS_PERIOD, "3ヶ月間");
    relativePeriodList.set(HALF_YEAR_PERIOD, "半年間");
    relativePeriodList.set(THIS_YEAR_PERIOD, "1年間");
    relativePeriodList.set(THREE_YEARS_PERIOD, "3年間");
    relativePeriodList.set(DECADE_PERIOD, "10年間");

    const getDateListByPeriod = (period) => {
        let dateList = [];
        
        if (period === THIS_MONTH_PERIOD) {
            return [getMonth(thisYear, thisMonth, 0)];
        }
        
        if (period === THREE_MONTHS_PERIOD) {
            for (let i = -2; i <= 0; i++) {
                dateList.push(getMonth(thisYear, thisMonth, i));
            }
            return dateList;
        }
        
        if (period === HALF_YEAR_PERIOD) {
            for (let i = -5; i <= 0; i++) {
                dateList.push(getMonth(thisYear, thisMonth, i));
            }
            return dateList;
        }
        
        if (period === THIS_YEAR_PERIOD) {
            for (let i = -11; i <= 0; i++) {
                dateList.push(getMonth(thisYear, thisMonth, i));
            }
            return dateList;
        }
        
        if (period === THREE_YEARS_PERIOD) {
            for (let i = -35; i <= 0; i++) {
                dateList.push(getMonth(thisYear, thisMonth, i));
            }
            return dateList;
        }
        
        if (period === DECADE_PERIOD) {
            for (let i = -119; i <= 0; i++) {
                dateList.push(getMonth(thisYear, thisMonth, i));
            }
            return dateList;
        }
        
        return dateList;
    };
    
    const changeRelativePeriod = (event) => {
        const period = event.target.value;
        setRelativePeriod(period);

        if (period === "") {
            return;
        }
        
        setSelectedYear("");
        if (yearSelectRef.current) {
            yearSelectRef.current.resetYear();
        }

        const updatedDateList = getDateListByPeriod(period);
        setDateList(updatedDateList);
        
        if (updatedDateList.length > 0) {
            fetchDataWithDates(updatedDateList);
        }
    };

    const [expenditureInfoList, setExpenditureInfoList] = useState(expenseInfoList?.category_to_amount_list || {});

    useEffect(() => {
        const totalDataList = [];
        const optionsList = [];

        Object.entries(expenditureInfoList).forEach(
            ([categoryName, dateToAmountList]) => {
                const amountList = [];
                dateList.forEach((date) => {
                    const amount = dateToAmountList[date] ?? 0;
                    amountList.push(amount);
                });

                totalDataList.push({
                    name: categoryName,
                    data: amountList,
                });

                optionsList.push({
                    chart: {
                        type: "column",
                    },
                    title: {
                        text: `${categoryName}の月別支出額`,
                    },
                    xAxis: {
                        categories: dateList,
                    },
                    yAxis: {
                        title: {
                            text: "支出額 (万)",
                        },
                        labels: {
                            formatter: function () {
                                return this.value / 10000 + "万";
                            },
                        },
                    },
                    legend: {
                        reversed: true,
                    },
                    plotOptions: {
                        series: {
                            stacking: "normal",
                            dataLabels: {
                                enabled: true,
                            },
                        },
                    },
                    series: [
                        {
                            name: categoryName,
                            data: amountList,
                        },
                    ],
                });
            }
        );

        const totalChartOptions = {
            chart: {
                type: "column",
            },
            title: {
                text: "合計支出額",
            },
            xAxis: {
                categories: dateList,
            },
            yAxis: {
                title: {
                    text: "支出額 (万)",
                },
                labels: {
                    formatter: function () {
                        return this.value / 10000 + "万";
                    },
                },
            },
            legend: {
                reversed: true,
            },
            plotOptions: {
                series: {
                    stacking: "normal",
                    dataLabels: {
                        enabled: true,
                    },
                },
            },
            series: totalDataList,
        };

        setChartOptionsList(optionsList);
        setTotalChartOptions(totalChartOptions);
    }, [expenditureInfoList, dateList]);

    return (
        <>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        レポート
                    </h2>
                }
            >
                <div className="flex flex-col min-h-screen">
                    <div className="w-5/6 mx-auto my-3 flex-1 relative sm:justify-center bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:text-white">
                        <div className="container">
                            <div className="flex">
                                <YearSelectBox
                                    ref={yearSelectRef}
                                    onChange={changeYear}
                                    value={selectedYear}
                                ></YearSelectBox>
                                <select
                                    className="w-1/6 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ml-3"
                                    onChange={changeRelativePeriod}
                                    value={relativePeriod}
                                >
                                    {Array.from(
                                        relativePeriodList.entries()
                                    ).map(([value, period]) => (
                                        <React.Fragment key={value}>
                                            <option value={value}>
                                                {period}
                                            </option>
                                        </React.Fragment>
                                    ))}
                                </select>
                            </div>
                            <div className="mx-auto mt-3">
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={totalChartOptions}
                                />

                                {chartOptionsList.map((options, index) => (
                                    <div key={index} className="mt-3">
                                        <HighchartsReact
                                            highcharts={Highcharts}
                                            options={options}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
