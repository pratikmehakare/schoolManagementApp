import React, { useState, useEffect } from "react";
import { getFinancialAnalytics } from "../../../services/oprations/analyticsAPI";

const FinancialAnalyticsPage = () => {
  const [view, setView] = useState("monthly");
  const [month, setMonth] = useState(new Date().getMonth() + 1); // current month (1-indexed)
  const [year, setYear] = useState(new Date().getFullYear());
  const [financialData, setFinancialData] = useState({
    totalSalaryExpense: 0,
    totalFeesIncome: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFinancialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Build the query parameters for the API call
      const params = { view, year };
      if (view === "monthly") {
        params.month = month;
      }
      // Use the getFinancialAnalytics function
      const data = await getFinancialAnalytics(params);
      setFinancialData(data);
    } catch (err) {
      setError("Error fetching financial analytics");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever the view, month, or year changes
  useEffect(() => {
    fetchFinancialData();
  }, [view, month, year]);

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">
            Financial Analytics
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Monitor your financial health with detailed insights.
          </p>
        </header>

        <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          {/* Toggle View and Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="mb-4 md:mb-0">
              <button
                className={`mr-2 px-4 py-2 rounded ${
                  view === "monthly"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setView("monthly")}
              >
                Monthly View
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  view === "yearly"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
                onClick={() => setView("yearly")}
              >
                Yearly View
              </button>
            </div>

            <div className="flex space-x-4">
              {view === "monthly" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Month
                    </label>
                    <select
                      value={month}
                      onChange={(e) => setMonth(Number(e.target.value))}
                      className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300">
                      Year
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white"
                    >
                      {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="mt-1 block w-full bg-gray-800 border border-gray-600 rounded-md shadow-sm text-white"
                  >
                    {[2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Data Display */}
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-800 rounded-lg shadow transform hover:scale-105 transition-transform">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Total Teacher Salary Expense
                </h2>
                <p className="text-3xl font-bold text-white">
                  ₹{financialData.totalSalaryExpense.toLocaleString()}
                </p>
              </div>
              <div className="p-6 bg-gray-800 rounded-lg shadow transform hover:scale-105 transition-transform">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Total Student Fees Income
                </h2>
                <p className="text-3xl font-bold text-white">
                  ₹{financialData.totalFeesIncome.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialAnalyticsPage;
