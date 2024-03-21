import customFetch from '@/lib/customFetch';
import React, { useEffect, useState } from 'react';
import BarChart from './BarChart';
import PieChart from './PieChart';

const Stats = ({ month }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const { data } = await customFetch.get(`products/all-stats/${month}`);
        setStats(data);
      } catch (error) {
        console.log(error);
      }
    };

    const timeOutID = setTimeout(() => {
      getStats();
    }, 750);

    return () => clearTimeout(timeOutID);
  }, [month]);

  return (
    <div className='space-y-20 max-w-[990px] mx-auto px-2'>
      <div className='space-y-6'>
        <h1 className='text-4xl text-slate-800 text-center font-semibold tracking-wide'>
          Statistics {month}
        </h1>

        <div className='bg-zinc-200 rounded-sm px-3 py-4'>
          <p className='font-semibold tracking-wide text-2xl'>
            Total sales: ₹{' '}
            {stats?.statisticsResponse?.saleAmount[0].total.toFixed(2)}
          </p>
          <p className='font-semibold tracking-wide text-2xl'>
            Total sold items: {stats?.statisticsResponse?.numberOfSoldItems}
          </p>
          <p className='font-semibold tracking-wide text-2xl'>
            Total unsold items:{' '}
            {stats?.statisticsResponse?.numberOfNotSoldItems}
          </p>
        </div>
      </div>

      <BarChart month={month} stats={stats} />
      <PieChart month={month} stats={stats} />
    </div>
  );
};

export default Stats;
