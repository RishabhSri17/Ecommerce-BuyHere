import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

const ProductPriceChart = ({ products }) => {
  return (
    <div className="mb-3 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-center mb-4">Product Price Chart</h3>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={products}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
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
            <Area
              type="monotone"
              dataKey="price"
              stroke="#54B4D3"
              fill="#0DCAF0"
              activeDot={{ r: 8 }}
              name="Price"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductPriceChart;