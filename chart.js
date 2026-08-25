// =====================================================
// CHART INSTANCES
// =====================================================

let dailyRevenueChart = null;

let monthlyRevenueChart = null;


// =====================================================
// DESTROY OLD CHARTS
// =====================================================

function destroyCharts() {

    if (dailyRevenueChart) {

        dailyRevenueChart.destroy();

        dailyRevenueChart = null;

    }


    if (monthlyRevenueChart) {

        monthlyRevenueChart.destroy();

        monthlyRevenueChart = null;

    }

}


// =====================================================
// CURRENCY FORMAT
// =====================================================

function formatChartCurrency(value) {

    return "₹ " +
        Number(value).toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 0
            }
        );

}


// =====================================================
// UPDATE CHARTS
// =====================================================

function updateCharts(
    currentData,
    reportDate,
    previousData = []
) {

    console.log(
        "Updating charts..."
    );


    destroyCharts();


    // =================================================
    // DAILY REVENUE
    // =================================================

    const dailyRevenue = {};


    currentData.forEach(order => {

        const date =
            order.order_date;


        if (!dailyRevenue[date]) {

            dailyRevenue[date] = 0;

        }


        dailyRevenue[date] +=
            Number(
                order.revenue || 0
            );

    });


    const dailyDates =
        Object.keys(
            dailyRevenue
        ).sort();


    const dailyValues =
        dailyDates.map(
            date =>
                dailyRevenue[date]
        );


    // =================================================
    // DAILY CHART
    // =================================================

    const dailyCanvas =
        document.getElementById(
            "dailyRevenueChart"
        );


    if (dailyCanvas) {

        const ctx =
            dailyCanvas.getContext(
                "2d"
            );


        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                0,
                320
            );


        gradient.addColorStop(
            0,
            "rgba(139,92,246,0.30)"
        );


        gradient.addColorStop(
            1,
            "rgba(139,92,246,0)"
        );


        dailyRevenueChart =
            new Chart(
                ctx,
                {

                    type: "line",

                    data: {

                        labels:
                            dailyDates,

                        datasets: [

                            {

                                label:
                                    "Revenue",

                                data:
                                    dailyValues,

                                borderColor:
                                    "#8b5cf6",

                                backgroundColor:
                                    gradient,

                                borderWidth:
                                    3,

                                pointBackgroundColor:
                                    "#a78bfa",

                                pointBorderColor:
                                    "#ffffff",

                                pointBorderWidth:
                                    2,

                                pointRadius:
                                    4,

                                pointHoverRadius:
                                    7,

                                fill:
                                    true,

                                tension:
                                    0.4

                            }

                        ]

                    },


                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,


                        interaction: {

                            intersect:
                                false,

                            mode:
                                "index"

                        },


                        plugins: {

                            legend: {

                                display:
                                    false

                            },


                            tooltip: {

                                backgroundColor:
                                    "#111624",

                                borderColor:
                                    "#2b354b",

                                borderWidth:
                                    1,

                                titleColor:
                                    "#ffffff",

                                bodyColor:
                                    "#cbd5e1",

                                padding:
                                    12,

                                callbacks: {

                                    label:
                                        function(
                                            context
                                        ) {

                                            return (
                                                " Revenue: " +
                                                formatChartCurrency(
                                                    context.parsed.y
                                                )
                                            );

                                        }

                                }

                            }

                        },


                        scales: {

                            x: {

                                grid: {

                                    display:
                                        false

                                },

                                ticks: {

                                    color:
                                        "#687287",

                                    font: {

                                        size:
                                            9

                                    }

                                }

                            },


                            y: {

                                beginAtZero:
                                    true,

                                grid: {

                                    color:
                                        "rgba(255,255,255,0.05)"

                                },

                                ticks: {

                                    color:
                                        "#687287",

                                    font: {

                                        size:
                                            9

                                    },

                                    callback:
                                        function(
                                            value
                                        ) {

                                            return formatChartCurrency(
                                                value
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );

    }


    // =================================================
    // MONTHLY REVENUE
    // =================================================

    let currentMonthRevenue =
        0;


    let previousMonthRevenue =
        0;


    currentData.forEach(order => {

        currentMonthRevenue +=
            Number(
                order.revenue || 0
            );

    });


    previousData.forEach(order => {

        previousMonthRevenue +=
            Number(
                order.revenue || 0
            );

    });


    // =================================================
    // MONTHLY CHART
    // =================================================

    const monthlyCanvas =
        document.getElementById(
            "monthlyRevenueChart"
        );


    if (monthlyCanvas) {

        const ctx =
            monthlyCanvas.getContext(
                "2d"
            );


        monthlyRevenueChart =
            new Chart(
                ctx,
                {

                    type: "bar",

                    data: {

                        labels: [

                            "Previous Month",

                            "Current Month"

                        ],


                        datasets: [

                            {

                                label:
                                    "Revenue",

                                data: [

                                    previousMonthRevenue,

                                    currentMonthRevenue

                                ],

                                backgroundColor: [

                                    "rgba(59,130,246,0.75)",

                                    "rgba(139,92,246,0.85)"

                                ],

                                borderColor: [

                                    "#3b82f6",

                                    "#8b5cf6"

                                ],

                                borderWidth:
                                    1,

                                borderRadius:
                                    8,

                                borderSkipped:
                                    false

                            }

                        ]

                    },


                    options: {

                        responsive:
                            true,

                        maintainAspectRatio:
                            false,


                        plugins: {

                            legend: {

                                display:
                                    false

                            },


                            tooltip: {

                                backgroundColor:
                                    "#111624",

                                borderColor:
                                    "#2b354b",

                                borderWidth:
                                    1,

                                padding:
                                    12,

                                callbacks: {

                                    label:
                                        function(
                                            context
                                        ) {

                                            return (
                                                " Revenue: " +
                                                formatChartCurrency(
                                                    context.parsed.y
                                                )
                                            );

                                        }

                                }

                            }

                        },


                        scales: {

                            x: {

                                grid: {

                                    display:
                                        false

                                },

                                ticks: {

                                    color:
                                        "#8992a6",

                                    font: {

                                        size:
                                            10,

                                        weight:
                                            "600"

                                    }

                                }

                            },


                            y: {

                                beginAtZero:
                                    true,

                                grid: {

                                    color:
                                        "rgba(255,255,255,0.05)"

                                },

                                ticks: {

                                    color:
                                        "#687287",

                                    font: {

                                        size:
                                            9

                                    },

                                    callback:
                                        function(
                                            value
                                        ) {

                                            return formatChartCurrency(
                                                value
                                            );

                                        }

                                }

                            }

                        }

                    }

                }
            );

    }

}