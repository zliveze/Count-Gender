import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GenderData } from '../types';

interface GenderChartProps {
  data: GenderData;
}

export const GenderChart: React.FC<GenderChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Nam', value: data.male, color: '#3b82f6' },   // blue-500
    { name: 'Nữ', value: data.female, color: '#ec4899' }, // pink-500
    { name: 'Khác', value: data.unknown, color: '#94a3b8' } // slate-400
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    return (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <p>Chưa có dữ liệu để hiển thị biểu đồ</p>
        </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} người`, 'Số lượng']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};