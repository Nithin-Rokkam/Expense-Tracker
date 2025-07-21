import React from 'react';
import { LuTrendingUpDown } from "react-icons/lu";
import ExpenseImage from '../../assets/images/ExpenseClaimMain-1024x838.png';
const AuthLayout = ({ children }) => {
  return (
    <div className='flex bg-gray-100 min-h-screen'>
      {/* Left Section: Auth Form */}
      <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 bg-white'>
        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Expense Tracker</h2>
        {children}
      </div>

      {/* Right Section: Graph and Info */}
      <div className='hidden md:flex flex-col items-center justify-center w-[40vw] h-screen bg-gray-200 relative p-6 overflow-hidden'>

        {/* Background blobs */}
        <div className='w-52 h-52 rounded-[40px] bg-gray-300 absolute -top-6 -left-5 opacity-30 blur-xl' />
        <div className='w-52 h-60 rounded-[40px] bg-gray-400 absolute top-[30%] -right-10 opacity-30 blur-xl' />
        <div className='w-52 h-52 rounded-[40px] bg-gray-300 absolute -bottom-6 -left-4 opacity-30 blur-xl' />

        {/* Info Card */}
        <div className='relative z-10 mb-6'>
          <StatsInfoCard
            icon={<LuTrendingUpDown />}
            label="Track Your Income & Expenses"
            value="430,000"
            color="bg-gray-700"
          />
        </div>

        {/* Uploaded Graph Image */}
        <img
          src={ExpenseImage}
          alt="Expense Chart Illustration"
          className='w-[90%] max-w-[350px] rounded-xl shadow-md relative z-10'
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, value, color }) => {
  return (
    <div className='flex gap-5 bg-white p-5 rounded-2xl shadow-md border border-gray-300 z-10'>
      <div
        className={`w-14 h-14 flex items-center justify-center text-[26px] text-white ${color} rounded-full shadow-lg`}
      >
        {icon}
      </div>
      <div>
        <h6 className='text-sm text-gray-500 mb-1'>{label}</h6>
        <span className='text-2xl font-semibold text-gray-800'>₹{value}</span>
      </div>
    </div>
  );
};
