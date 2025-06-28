import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

const OrderPriceChart = ({ orders }) => {
  return (
    <div className="mb-3 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4">Order Price Chart</h3>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={orders}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#f9fafb', 
                borderColor: '#e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend />
            <Bar
              type="monotone"
              dataKey="itemsPrice"
              fill="#7AC6E1"
              activeDot={{ r: 8 }}
              name="Items Price"
            />
            <Bar
              type="monotone"
              dataKey="taxPrice"
              fill="#EB6F80"
              activeDot={{ r: 8 }}
              name="Tax Price"
            />
            <Bar
              type="monotone"
              dataKey="totalPrice"
              fill="#FFD949"
              activeDot={{ r: 8 }}
              name="Total Price"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderPriceChart;