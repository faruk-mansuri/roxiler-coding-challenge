import React from 'react';
import { PieChart, Pie, Tooltip, ResponsiveContainer } from 'recharts';

const PieChartComponent = ({ month, stats }) => {
  return (
    <div className='space-y-3'>
      <div>
        <h1 className='text-4xl text-slate-800 text-center font-semibold tracking-wide'>
          Category Monthly Statement
          {' ('}
          {month}
          {')'}
        </h1>
        <h3 className='text-2xl text-center mt-4'>Pie Chart</h3>
      </div>

      <div className='w-full max-w-[990px] bg-zinc-200 mx-auto flex items-center justify-center rounded-md'>
        <div className='w-96'>
          <ResponsiveContainer width='100%' height={400}>
            <PieChart>
              <Pie
                dataKey='value'
                isAnimationActive={false}
                data={stats?.pieChartResponse.stats}
                cx={200}
                cy={200}
                outerRadius={150}
                fill='#2cb1bc'
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
