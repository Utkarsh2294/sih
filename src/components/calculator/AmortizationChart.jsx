import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useTranslation } from 'react-i18next';
import { formatINR } from '../../utils/currency';

const AmortizationChart = ({ schedule, moratoriumMonths }) => {
  const { t } = useTranslation();
  
  const chartData = useMemo(() => {
    return schedule.map((item, index) => ({
      month: index + 1,
      principalPaid: item.principalPaid,
      interestPaid: item.interestPaid,
      balance: item.balance,
      isMoratorium: index < moratoriumMonths
    }));
  }, [schedule, moratoriumMonths]);

  if (!schedule || schedule.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-64 md:h-80 mt-6" role="img" aria-label={t('calculator.chartAria')}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary-500)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-primary-500)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent-500)" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="var(--color-accent-500)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-20 text-gray-400 dark:text-gray-600" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: 'currentColor' }} 
            className="text-xs text-gray-600 dark:text-gray-400"
            tickFormatter={(val) => val % 12 === 0 ? `Y${val/12}` : ''}
          />
          <YAxis 
            tickFormatter={(val) => `₹${val / 1000}k`} 
            tick={{ fill: 'currentColor' }} 
            className="text-xs text-gray-600 dark:text-gray-400"
          />
          <Tooltip 
            formatter={(value) => formatINR(value)}
            labelFormatter={(label) => `Month ${label}`}
            contentStyle={{ backgroundColor: 'var(--color-gray-900)', color: 'white', borderRadius: '8px', border: 'none' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {moratoriumMonths > 0 && (
            <ReferenceLine 
              x={moratoriumMonths} 
              stroke="var(--color-accent-600)" 
              strokeDasharray="3 3"
              label={{ position: 'top', value: t('calculator.moratoriumEnd'), fill: 'currentColor', fontSize: 12 }} 
            />
          )}
          <Area 
            type="monotone" 
            dataKey="principalPaid" 
            stackId="1" 
            stroke="var(--color-primary-600)" 
            fillOpacity={1} 
            fill="url(#colorPrincipal)" 
            name={t('calculator.principal')} 
          />
          <Area 
            type="monotone" 
            dataKey="interestPaid" 
            stackId="1" 
            stroke="var(--color-accent-600)" 
            fillOpacity={1} 
            fill="url(#colorInterest)" 
            name={t('calculator.interest')} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

AmortizationChart.propTypes = {
  schedule: PropTypes.arrayOf(PropTypes.shape({
    principalPaid: PropTypes.number,
    interestPaid: PropTypes.number,
    balance: PropTypes.number,
  })).isRequired,
  moratoriumMonths: PropTypes.number
};

AmortizationChart.defaultProps = {
  moratoriumMonths: 0
};

export default AmortizationChart;
