const SUPABASE_URL =
    "https://puypvwyxbrhmzvxhwfgx.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_FcAFlPmsQZ6Wc9FUtjWtqA_6c0_u6Hx";

const API_URL =
    `${SUPABASE_URL}/rest/v1/rpc/get_dashboard_orders`;


// =====================================================
// GET API DATA
// =====================================================

async function getDashboardData(reportDate) {

    console.log("Loading date:", reportDate);

    const response = await fetch(API_URL, {

        method: "POST",

        headers: {
            "apikey": SUPABASE_KEY,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            report_date: reportDate
        })

    });


    const text = await response.text();

    console.log("API STATUS:", response.status);
    console.log("API RESPONSE:", text);


    if (!response.ok) {

        throw new Error(
            `API Error ${response.status}: ${text}`
        );

    }


    return JSON.parse(text);
}


// =====================================================
// LOAD DASHBOARD
// =====================================================

async function loadDashboard() {

    const dateInput =
        document.getElementById("reportDate");

    const reportDate =
        dateInput.value;

    if (!reportDate) {
        alert("Please select a date.");
        return;
    }

    const button =
        document.getElementById("loadDataBtn");

    button.disabled = true;
    button.textContent = "Loading...";


    try {

        // =================================================
        // CURRENT MONTH DATA
        // =================================================

        const currentData =
            await getDashboardData(
                reportDate
            );


        console.log(
            "CURRENT MONTH DATA:",
            currentData
        );


        // =================================================
        // CALCULATE PREVIOUS MONTH END DATE
        // =================================================

        const selected =
            new Date(
                reportDate + "T00:00:00"
            );


        const previousMonthEnd =
            new Date(
                selected.getFullYear(),
                selected.getMonth(),
                0
            );


        const previousYear =
            previousMonthEnd.getFullYear();


        const previousMonth =
            String(
                previousMonthEnd.getMonth() + 1
            ).padStart(2, "0");


        const previousDay =
            String(
                previousMonthEnd.getDate()
            ).padStart(2, "0");


        const previousMonthDate =
            `${previousYear}-${previousMonth}-${previousDay}`;


        console.log(
            "PREVIOUS MONTH END:",
            previousMonthDate
        );


        // =================================================
        // GET PREVIOUS MONTH DATA
        // =================================================

        const previousData =
            await getDashboardData(
                previousMonthDate
            );


        console.log(
            "PREVIOUS MONTH DATA:",
            previousData
        );


        // =================================================
        // TODAY'S DATA
        // =================================================

        const todayData =
            currentData.filter(
                row =>
                    row.order_date ===
                    reportDate
            );


        const todayOrders =
            todayData.length;


        const todayRevenue =
            todayData.reduce(
                (sum, row) =>
                    sum +
                    Number(
                        row.revenue || 0
                    ),
                0
            );


        // =================================================
        // CURRENT MONTH
        // =================================================

        const monthOrders =
            currentData.length;


        const monthRevenue =
            currentData.reduce(
                (sum, row) =>
                    sum +
                    Number(
                        row.revenue || 0
                    ),
                0
            );


        // =================================================
        // PREVIOUS MONTH
        // =================================================

        const previousMonthOrders =
            previousData.length;


        const previousMonthRevenue =
            previousData.reduce(
                (sum, row) =>
                    sum +
                    Number(
                        row.revenue || 0
                    ),
                0
            );


        // =================================================
        // UPDATE TODAY
        // =================================================

        document.getElementById(
            "todayOrders"
        ).textContent =
            todayOrders;


        document.getElementById(
            "todayRevenue"
        ).textContent =
            "₹ " +
            todayRevenue.toFixed(2);


        // =================================================
        // UPDATE MTD
        // =================================================

        document.getElementById(
            "monthOrders"
        ).textContent =
            monthOrders;


        document.getElementById(
            "monthRevenue"
        ).textContent =
            "₹ " +
            monthRevenue.toFixed(2);


        // =================================================
        // UPDATE PREVIOUS MONTH
        // =================================================

        document.getElementById(
            "previousMonthOrders"
        ).textContent =
            previousMonthOrders;


        document.getElementById(
            "previousMonthRevenue"
        ).textContent =
            "₹ " +
            previousMonthRevenue.toFixed(2);


        // =================================================
        // TOTAL REVENUE
        // =================================================

        document.getElementById(
            "totalRevenue"
        ).textContent =
            "₹ " +
            monthRevenue.toFixed(2);


        // =================================================
        // LEADERBOARD
        // =================================================

        updateLeaderboard(
            todayData
        );


        // =================================================
        // DESTINATIONS
        // =================================================

        updateDestinations(
            todayData
        );
        updateCharts(
        currentData,
        reportDate,
        previousData
);


        console.log(
            "Dashboard updated successfully."
        );


    } catch (error) {

        console.error(
            "DASHBOARD ERROR:",
            error
        );


        alert(
            "Failed to load dashboard:\n\n" +
            error.message
        );


    } finally {

        button.disabled = false;

        button.textContent =
            "🔄 Load Data";

    }
}


// =====================================================
// LEADERBOARD
// =====================================================

function updateLeaderboard(data) {

    const tbody =
        document.getElementById(
            "leaderboardBody"
        );


    tbody.innerHTML = "";


    const employees = {};


    data.forEach(row => {

        const name =
            String(
                row.employee_name ||
                "Unknown"
            ).trim();


        if (!employees[name]) {

            employees[name] = {

                orders: 0,

                revenue: 0

            };

        }


        employees[name].orders += 1;

        employees[name].revenue +=
            Number(
                row.revenue || 0
            );

    });


    const sorted =
        Object.entries(
            employees
        ).sort(
            (a, b) =>
                b[1].revenue -
                a[1].revenue
        );


    sorted.forEach(
        ([name, stats], index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${name}
                </td>

                <td>
                    ${stats.orders}
                </td>

                <td>
                    ₹ ${stats.revenue.toFixed(2)}
                </td>

            `;


            tbody.appendChild(row);

        }
    );


    if (sorted.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="4">
                    No orders for this date
                </td>

            </tr>

        `;

    }

}


// =====================================================
// DESTINATIONS
// =====================================================

function updateDestinations(data) {

    const container =
        document.getElementById(
            "destinationsList"
        );


    container.innerHTML = "";


    const destinations = {};


    data.forEach(row => {

        if (!row.destinations) {
            return;
        }


        const countries =
            row.destinations
                .split(",")
                .map(
                    x => x.trim()
                )
                .filter(Boolean);


        countries.forEach(country => {

            if (!destinations[country]) {

                destinations[country] = 0;

            }


            destinations[country]++;

        });

    });


    const sorted =
        Object.entries(
            destinations
        ).sort(
            (a, b) =>
                b[1] - a[1]
        );


    sorted
        .slice(0, 10)
        .forEach(
            ([country, count]) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "destination-item";


                item.innerHTML = `

                    <strong>
                        ${country}
                    </strong>

                    <span>
                        ${count} orders
                    </span>

                `;


                container.appendChild(
                    item
                );

            }
        );


    if (sorted.length === 0) {

        container.innerHTML =
            "<p>No destinations found</p>";

    }

}


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const button =
            document.getElementById(
                "loadDataBtn"
            );


        const dateInput =
            document.getElementById(
                "reportDate"
            );


        // ---------------------------------------------
        // BUTTON CLICK
        // ---------------------------------------------

        button.addEventListener(
            "click",
            loadDashboard
        );


        // ---------------------------------------------
        // DATE CHANGE
        // ---------------------------------------------

        dateInput.addEventListener(
            "change",
            () => {

                console.log(
                    "DATE CHANGED:"
                );

                console.log(
                    dateInput.value
                );


                loadDashboard();

            }
        );


        // ---------------------------------------------
        // INITIAL LOAD
        // ---------------------------------------------

        loadDashboard();

    }
);