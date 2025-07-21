import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import InfoCard from '../../components/cards/InfoCard';
import { addThousandsSeperator } from '../../utils/helper';
import { IoMdCard } from 'react-icons/io';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomeWithChart   from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';
const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  console.log("Home component rendered");
  useEffect(() => {
    let isMounted = true; // track if component is still mounted

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
        if (isMounted && response.data) {
          setDashboardData(response.data);

          // Debug logging (disable in production)
          if (process.env.NODE_ENV !== 'production') {
            console.log("Dashboard data fetched:", response.data);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Dashboard fetch error:", err);
          setError("Failed to load dashboard data.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        {loading && <p className="text-center text-gray-600">Loading dashboard...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && dashboardData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoCard
                icon={<IoMdCard />}
                label="Total Balance"
                value={addThousandsSeperator(dashboardData.totalBalance || 0)}
                color="bg-primary"
              />
              <InfoCard
                icon={<IoMdCard />}
                label="Total Income"
                value={addThousandsSeperator(dashboardData.totalIncome || 0)}
                color="bg-orange-500"
              />
              <InfoCard
                icon={<IoMdCard />}
                label="Total Expense"
                value={addThousandsSeperator(dashboardData.totalExpense || 0)}
                color="bg-red-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <RecentTransactions
                transactions={dashboardData.recentTransactions}
                onSeeMore={() => navigate("/expense")}
              />

              <FinanceOverview 
                totalBalance = {dashboardData ?.totalBalance || 0 }
                totalIncome = {dashboardData?.totalIncome || 0}
                totalExpense = {dashboardData?.totalExpense|| 0}
              />

              <ExpenseTransactions
                transactions = {dashboardData?.last30DaysExpenses?.transactions || []}
                onSeeMore = {() => navigate("/expense")}
              />
              <Last30DaysExpenses 
                data = {dashboardData?.last30DaysExpenses?.transactions || []}
              />

              <RecentIncomeWithChart
                data = {dashboardData?.last60DaysIncome?.transactions.slice(0,4) || []}
                totalIncome= {dashboardData?.totalIncome || 0}
              />

              <RecentIncome  
                transactions = {dashboardData?.last60DaysIncome?.transactions || []}
                onSeeMore= {() => navigate("/income")}
                />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Home;
