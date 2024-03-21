import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const BarChartComponent = ({ month, stats }) => {
  const data = stats?.barChartResponse?.stats;

  return (
    <div className='space-y-3'>
      <div>
        <h1 className='text-4xl text-slate-800 text-center font-semibold tracking-wide'>
          Monthly Details
          {' ('}
          {month}
          {')'}
        </h1>
        <h3 className='text-2xl text-center mt-4'>Bar Chart</h3>
      </div>

      <div className='w-full max-w-[990px] mx-auto bg-zinc-200 rounded-md'>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart data={data} margin={{ top: 50 }}>
            <CartesianGrid strokeDasharray='3 3 ' />
            <XAxis dataKey='date' />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey='count' fill='#2cb1bc' barSize={75} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartComponent;
