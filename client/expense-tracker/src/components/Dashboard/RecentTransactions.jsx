import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import TransactionInfoCard from '../cards/TransactionInfoCard';
import moment from 'moment';

const RecentTransactions = ({ transactions, onSeeMore }) => {
  console.log("Transactions received:", transactions);

  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg font-semibold'>Recent Transactions</h5>
        {transactions?.length > 5 && (
          <button className='card-btn flex items-center gap-1' onClick={onSeeMore}>
            See All <LuArrowRight className='text-base' />
          </button>
        )}
      </div>

      <div className='mt-6'>
        {Array.isArray(transactions) && transactions.length > 0 ? (
          transactions
            .slice(0, 5)
            .map((item) => (
              <TransactionInfoCard
                key={item._id}
                title={
                  item.type === 'expense'
                    ? item.category || 'Unknown Expense'
                    : item.source || 'Unknown Income'
                }
                icon={item.icon || ''}
                date={moment(item.date).format('Do MMM YYYY')}
                amount={item.amount}
                type={item.type}
                hideDeleteBtn
              />
            ))
        ) : (
          <p className='text-gray-500 text-sm'>No recent transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentTransactions;
