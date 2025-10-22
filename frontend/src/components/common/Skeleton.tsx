import React from 'react';
import { cn } from '../../utils/cn';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  return (
    <div
      className={cn(
        'bg-gray-200',
        variants[variant],
        animations[animation],
        className
      )}
      style={style}
    />
  );
};

// Preset Skeleton Components for common use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white p-4 rounded-lg border border-gray-200', className)}>
    <div className="flex items-center space-x-3 mb-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="rectangular" height={200} className="mb-3" />
    <Skeleton variant="text" width="100%" className="mb-2" />
    <Skeleton variant="text" width="80%" />
  </div>
);

export const SkeletonPost: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white p-6 rounded-lg border border-gray-200', className)}>
    {/* Header */}
    <div className="flex items-center space-x-3 mb-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="40%" height={16} />
        <Skeleton variant="text" width="30%" height={14} />
      </div>
    </div>
    {/* Content */}
    <Skeleton variant="text" width="100%" className="mb-2" />
    <Skeleton variant="text" width="95%" className="mb-2" />
    <Skeleton variant="text" width="60%" className="mb-4" />
    {/* Image */}
    <Skeleton variant="rectangular" height={300} className="mb-4" />
    {/* Actions */}
    <div className="flex space-x-4">
      <Skeleton variant="text" width={60} />
      <Skeleton variant="text" width={80} />
      <Skeleton variant="text" width={60} />
    </div>
  </div>
);

export const SkeletonAlumniCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
    {/* Cover */}
    <Skeleton variant="rectangular" height={80} className="mb-0 rounded-none" />
    {/* Profile Picture */}
    <div className="px-4 -mt-8 mb-3">
      <Skeleton variant="circular" width={64} height={64} className="border-4 border-white" />
    </div>
    {/* Info */}
    <div className="px-4 pb-4 space-y-3">
      <Skeleton variant="text" width="70%" height={18} />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="60%" />
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" width={60} height={24} className="rounded-full" />
        <Skeleton variant="rectangular" width={70} height={24} className="rounded-full" />
      </div>
      <Skeleton variant="rectangular" height={36} className="rounded-lg mt-3" />
    </div>
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({
  count = 5,
  className,
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
