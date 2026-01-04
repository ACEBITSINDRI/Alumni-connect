import React from 'react';
import { Megaphone, Calendar, Briefcase, Trophy, Newspaper, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TickerItemIconProps {
  type: 'announcement' | 'event' | 'job' | 'news' | 'achievement';
  variant: 'info' | 'success' | 'warning' | 'urgent';
  size?: number;
  className?: string;
}

const iconMap = {
  announcement: Megaphone,
  event: Calendar,
  job: Briefcase,
  achievement: Trophy,
  news: Newspaper,
};

const variantColors = {
  info: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  urgent: 'text-red-600',
};

const TickerItemIcon: React.FC<TickerItemIconProps> = ({
  type,
  variant,
  size = 20,
  className
}) => {
  const Icon = iconMap[type] || AlertCircle;

  return (
    <Icon
      size={size}
      className={cn(
        'flex-shrink-0',
        variantColors[variant],
        className
      )}
    />
  );
};

export default TickerItemIcon;
