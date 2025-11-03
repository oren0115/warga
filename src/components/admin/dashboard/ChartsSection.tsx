import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';

interface Props {
  monthlyFees: Array<{ month: string; total: number }>;
  paymentStatus: Array<{ name: string; value: number }>;
  chartZoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

const COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export const ChartsSection: React.FC<Props> = ({
  monthlyFees,
  paymentStatus,
  chartZoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <Card className='rounded-2xl shadow-md hover:shadow-xl transition'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Grafik Iuran Bulanan</CardTitle>
              <CardDescription>
                Ringkasan total iuran tiap bulan - Scroll horizontal untuk
                melihat data
              </CardDescription>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={onZoomOut}
                disabled={chartZoom <= 0.5}
                className='h-8 w-8 p-0'
              >
                <ZoomOut className='w-4 h-4' />
              </Button>
              <span className='text-xs text-gray-500 min-w-[3rem] text-center'>
                {Math.round(chartZoom * 100)}%
              </span>
              <Button
                size='sm'
                variant='outline'
                onClick={onZoomIn}
                disabled={chartZoom >= 2}
                className='h-8 w-8 p-0'
              >
                <ZoomIn className='w-4 h-4' />
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={onResetZoom}
                className='h-8 w-8 p-0'
              >
                <RotateCcw className='w-4 h-4' />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className='h-72'>
          <div className='w-full h-full overflow-x-auto overflow-y-hidden'>
            <div
              className='h-full'
              style={{
                minWidth: `${600 * chartZoom}px`,
                transform: `scale(${chartZoom})`,
                transformOrigin: 'top left',
              }}
            >
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={monthlyFees}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='month'
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor='end'
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={value =>
                      `Rp ${(value / 1000000).toFixed(1)}M`
                    }
                  />
                  <Tooltip
                    formatter={(val: any) => [
                      `Rp ${Number(val)?.toLocaleString()}`,
                      'Total Iuran',
                    ]}
                    labelFormatter={label => `Bulan: ${label}`}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey='total' fill='#3b82f6' radius={[6, 6, 0, 0]}>
                    <LabelList
                      dataKey='total'
                      position='top'
                      content={({ value }) =>
                        value != null ? (
                          <tspan fontSize='10'>{`Rp ${(
                            Number(value) / 1000000
                          ).toFixed(1)}M`}</tspan>
                        ) : null
                      }
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='rounded-2xl shadow-md hover:shadow-xl transition'>
        <CardHeader>
          <CardTitle>Status Pembayaran</CardTitle>
          <CardDescription>Distribusi status pembayaran</CardDescription>
        </CardHeader>
        <CardContent className='h-72'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={paymentStatus}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                innerRadius={50}
                outerRadius={90}
                label
              >
                {paymentStatus.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChartsSection;
