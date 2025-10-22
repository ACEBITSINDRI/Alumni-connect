import React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fallback?: string;
  online?: boolean;
  onClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  className,
  fallback,
  online,
  onClick,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 48,
  };

  const onlineIndicatorSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
  };

  const showImage = src && !imageError;
  const showFallback = !showImage && fallback;
  const showIcon = !showImage && !showFallback;

  return (
    <div className={cn('relative inline-block', className)} onClick={onClick}>
      <div
        className={cn(
          'rounded-full overflow-hidden bg-gray-200 flex items-center justify-center',
          sizes[size],
          onClick && 'cursor-pointer'
        )}
      >
        {showImage && (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
        {showFallback && (
          <span className="font-semibold text-gray-700 uppercase">
            {fallback.substring(0, 2)}
          </span>
        )}
        {showIcon && (
          <User size={iconSizes[size]} className="text-gray-400" />
        )}
      </div>
      {online && (
        <span
          className={cn(
            'absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full',
            onlineIndicatorSizes[size]
          )}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
