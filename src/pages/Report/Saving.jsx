import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "../../components/AuthenticatedLayout";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { reportService } from "../../api/services/reportService";
import { useAuth } from "../../contexts/AuthContext";

export default function Saving() {
    const { user } = useAuth();
    
    const getMonth = (year, month, period) => {
        const date = new Date(year, month - 1 + period, 1);
        const resultYear = date.getFullYear();
        const resultMonth = date.getMonth() + 1;
        
        return resultYear + "-" + String(resultMonth).padStart(2, "0");
    };

    const thisDate = new Date();
    const thisYear = thisDate.getFullYear();
    const thisMonth = thisDate.getMonth() + 1;

    const initialDateList = [];
    for (let i = -11; i <= 0; i++) {
        initialDateList.push(getMonth(thisYear, thisMonth, i));
    }
    
    const [dateList, setDateList] = useState(initialDateList);
    const [isLoading, setIsLoading] = useState(true);

    const INITIAL_SAVINGS = 500000;

    const THIS_MONTH_PERIOD = "1";
    const THREE_MONTHS_PERIOD = "2";
    const HALF_YEAR_PERIOD = "3";
    const THIS_YEAR_PERIOD = "4";
    const THREE_YEARS_PERIOD = "5";
    const DECADE_PERIOD = "6";

    const relativePeriodList = new Map();
    relativePeriodList.set(THIS_MONTH_PERIOD, "今月");
    relativePeriodList.set(THREE_MONTHS_PERIOD, "3ヶ月間");
    relativePeriodList.set(HALF_YEAR_PERIOD, "半年間");
    relativePeriodList.set(THIS_YEAR_PERIOD, "1年間");
    relativePeriodList.set(THREE_YEARS_PERIOD, "3年間");
    relativePeriodList.set(DECADE_PERIOD, "10年間");

    const setRelativePeriod = (period) => {
        if (period === THIS_MONTH_PERIOD) {
            setDateList([getMonth(thisYear, thisMonth, 0)]);
            return;
        }

        if (period === THREE_MONTHS_PERIOD) {
            const dateList = [];
            for (let i = -2; i <= 0; i++) {
                dateList.push(getMonth(thisYear, thisMonth, i));
            }
            setDateList(dateList);
            return;
        }

        if (period === HALF_YEAR_PERIOD) {
            const dateList = [];
            for (let i = -5; i <= 0; i++) {
                dateList.push(getMonth(thisYear, thisMonth, i));
            }
            setDateList(dateList);
            return;
        }

        if (period === THIS_YEAR_PERIOD) {
            const dateList = [];
            for (let i = -11; i <= 0; i++) {
                dateList.push(getMonth(thisYear, thisMonth, i));
            }
            setDateList(dateList);
            return;
        }

        if (period === THREE_YEARS_PERIOD) {
            const dateList = [];
            for (let i = -35; i <= 0; i++) {
                dateList.push(getMonth(thisYear, thisMonth, i));
            }
            setDateList(dateList);
            return;
        }

        if (period === DECADE_PERIOD) {
            const dateList = [];
            for (let i = -119; i <= 0; i++) {
                dateList.push(getMonth(thisYear, thisMonth, i));
            }
            setDateList(dateList);
            return;
        }
    };

    const fetchChart = async () => {
        setIsLoading(true);
        try {
            const response = await reportService.getSavingReport({
                start_date: dateList[0] + '-01',
                end_date: getMonthEndDate(dateList[dateList.length - 1])
            });

            setIncomeInfoList(response.incomeDataList.category_to_amount_list || {});
            setExpenditureInfoList(response.expenseDataList.category_to_amount_list || {});
        } catch (error) {
            console.error('Failed to fetch chart data:', error);
            setIncomeInfoList({});
            setExpenditureInfoList({});
        } finally {
            setIsLoading(false);
        }
    }

    const getMonthEndDate = (yearMonth) => {
        const [year, month] = yearMonth.split('-');
        const lastDay = new Date(year, month, 0).getDate();
        return `${yearMonth}-${String(lastDay).padStart(2, '0')}`;
    }

    const changeDate = (event) => {
        setRelativePeriod(event.target.value);
    }

    const [incomeInfoList, setIncomeInfoList] = useState({});
    const [expenditureInfoList, setExpenditureInfoList] = useState({});
    const [combinedChartOptions, setCombinedChartOptions] = useState({});

    useEffect(() => {
        fetchChart();
    }, [dateList]);

    useEffect(() => {
        const incomeData = [];
        const expenditureData = [];
        const balanceData = [];
        const savingsData = [];
        
        let currentSavings = INITIAL_SAVINGS;

        const sortedDateList = [...dateList].sort();

        sortedDateList.forEach((date) => {
            let totalIncome = 0;
            let totalExpenditure = 0;

            Object.values(incomeInfoList).forEach((dateToAmountList) => {
                if (dateToAmountList[date]) {
                    totalIncome += parseInt(dateToAmountList[date]) || 0;
                }
            });

            Object.values(expenditureInfoList).forEach((dateToAmountList) => {
                if (dateToAmountList[date]) {
                    totalExpenditure += parseInt(dateToAmountList[date]) || 0;
                }
            });

            incomeData.push(totalIncome);
            expenditureData.push(totalExpenditure);
            const monthlyBalance = totalIncome - totalExpenditure;
            balanceData.push(monthlyBalance);
            
            currentSavings += monthlyBalance;
            savingsData.push(currentSavings);
        });

        const maxIncomeValue = Math.max(...incomeData);
        const maxExpenditureValue = Math.max(...expenditureData);
        const maxIncomeExpenditure = Math.max(maxIncomeValue, maxExpenditureValue);
        
        const maxSavingsValue = Math.max(...savingsData);

        const incomeColor = "#2E86C1";
        const expenditureColor = "#D6EAF8";
        const savingsColor = "#3498DB";

        const incomeExpenditureAxisMax = Math.ceil(maxIncomeExpenditure * 5 / 100000) * 100000;
        const savingsAxisMax = Math.ceil(maxSavingsValue * 1.0 / 100000) * 100000;

        const combinedOptions = {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: sortedDateList,
                crosshair: true
            },
            yAxis: [
                {
                    title: {
                        text: '貯金額 (円)',
                        style: {
                            color: savingsColor,
                            fontSize: '12px'
                        }
                    },
                    labels: {
                        format: '{value}円',
                        style: {
                            color: savingsColor,
                            fontSize: '11px'
                        }
                    },
                    min: 0,
                    max: savingsAxisMax,
                    tickInterval: 500000,
                    gridLineWidth: 1,
                    gridLineDashStyle: 'Dot'
                },
                {
                    title: {
                        text: '収支額 (円)',
                        style: {
                            color: Highcharts.getOptions().colors[0],
                            fontSize: '12px'
                        }
                    },
                    labels: {
                        format: '{value}円',
                        style: {
                            color: Highcharts.getOptions().colors[0],
                            fontSize: '11px'
                        }
                    },
                    min: 0,
                    max: incomeExpenditureAxisMax,
                    tickInterval: 500000,
                    opposite: true,
                    gridLineWidth: 0
                }
            ],
            tooltip: {
                shared: true,
                formatter: function() {
                    let tooltip = '<b>' + this.x + '</b><br/>';
                    
                    this.points.forEach(function(point) {
                        tooltip += '<span style="color:' + point.color + '">●</span> ' + 
                                    point.series.name + ': ' + 
                                    Highcharts.numberFormat(point.y, 0, '.', ',') + '円<br/>';
                    });
                    
                    return tooltip;
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                floating: false,
                backgroundColor: 'white',
                shadow: false
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                column: {
                    pointPadding: 0,
                    borderWidth: 0,
                },
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },
            series: [
                {
                    name: '収入',
                    type: 'column',
                    color: incomeColor,
                    data: incomeData,
                    yAxis: 1,
                    tooltip: {
                        valueSuffix: '円'
                    },
                    pointPlacement: -0.05
                },
                {
                    name: '支出',
                    type: 'column',
                    color: expenditureColor,
                    data: expenditureData,
                    yAxis: 1,
                    tooltip: {
                        valueSuffix: '円'
                    },
                    pointPlacement: 0.05
                },
                {
                    name: '貯金額',
                    type: 'line',
                    color: savingsColor,
                    data: savingsData,
                    yAxis: 0,
                    tooltip: {
                        valueSuffix: '円'
                    },
                    marker: {
                        enabled: true,
                        radius: 4,
                        symbol: 'point',
                        lineColor: savingsColor,
                        lineWidth: 2,
                        fillColor: '#FFFFFF'
                    },
                    lineWidth: 2
                }
            ]
        };

        setCombinedChartOptions(combinedOptions);
    }, [incomeInfoList, expenditureInfoList, dateList]);

    return (
        <AuthenticatedLayout
            user={user || {}}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    貯金額レポート
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    期間選択
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    onChange={changeDate}
                                    defaultValue={THIS_YEAR_PERIOD}
                                >
                                    {Array.from(
                                        relativePeriodList.entries()
                                    ).map(([key, value]) => (
                                        <option key={key} value={key}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-8">
                                {isLoading ? (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-8 border-gray-200 border-t-blue-500"></div>
                                    </div>
                                ) : (
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={combinedChartOptions}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
