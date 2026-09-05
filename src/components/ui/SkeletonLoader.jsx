import React from 'react';
import PropTypes from 'prop-types';

const SkeletonLoader = ({ width = '100%', height = '1rem', rounded = 'md', className = '', count = 1 }) => {
  const elements = Array.from({ length: count });

  const roundedClass = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }[rounded] || 'rounded-md';

  return (
    <>
      {elements.map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${roundedClass} ${className} ${i > 0 ? 'mt-2' : ''}`}
          style={{ width, height }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

SkeletonLoader.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  className: PropTypes.string,
  count: PropTypes.number,
};

export default SkeletonLoader;
