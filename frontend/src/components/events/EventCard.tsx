import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Video, CheckCircle, DollarSign } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  venue: string;
  location: string;
  image?: string;
  type: string;
  organizer: {
    id: string;
    name: string;
    avatar?: string;
  };
  registrationFee: string;
  maxParticipants: number;
  registeredCount: number;
  registrationDeadline: string;
  isRegistered: boolean;
  speakers: Array<{ name: string; designation: string }>;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const [isRegistered] = useState(event.isRegistered);

  const getModeBadge = (mode: string) => {
    const config: Record<string, { variant: any; icon: any }> = {
      Online: { variant: 'info', icon: <Video size={14} /> },
      Offline: { variant: 'success', icon: <MapPin size={14} /> },
      Hybrid: { variant: 'warning', icon: <Users size={14} /> },
    };
    const { variant, icon } = config[mode] || config['Online'];
    return (
      <Badge variant={variant} size="sm" className="flex items-center gap-1">
        {icon}
        {mode}
      </Badge>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return { day, month };
  };

  const { day, month } = formatDate(event.date);

  const seatsAvailable = event.maxParticipants - event.registeredCount;
  const isFull = seatsAvailable <= 0;
  const isAlmostFull = seatsAvailable <= 10 && seatsAvailable > 0;

  return (
    <Card
      variant="elevated"
      className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
      onClick={() => navigate(`/event/${event.id}`)}
    >
      {/* Event Image or Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700">
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Calendar size={64} className="text-white opacity-50" />
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{day}</div>
          <div className="text-xs font-medium text-gray-600 uppercase">{month}</div>
        </div>

        {/* Event Type Badge */}
        <div className="absolute top-4 right-4">
          <Badge variant="primary" size="sm">
            {event.type}
          </Badge>
        </div>

        {/* Registered Badge */}
        {isRegistered && (
          <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <CheckCircle size={14} className="mr-1" />
            Registered
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600">
          {event.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>

        {/* Event Details */}
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Clock size={16} className="mr-2 flex-shrink-0" />
            <span>
              {event.startTime} - {event.endTime} ({event.duration})
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            {event.mode === 'Online' ? (
              <Video size={16} className="mr-2 flex-shrink-0" />
            ) : (
              <MapPin size={16} className="mr-2 flex-shrink-0" />
            )}
            <span className="truncate">{event.venue}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Users size={16} className="mr-2 flex-shrink-0" />
            <span>
              {event.registeredCount} / {event.maxParticipants} registered
            </span>
          </div>

          {event.registrationFee && (
            <div className="flex items-center text-gray-600">
              <DollarSign size={16} className="mr-2 flex-shrink-0" />
              <span>{event.registrationFee}</span>
            </div>
          )}
        </div>

        {/* Mode Badge */}
        <div className="mb-4">{getModeBadge(event.mode)}</div>

        {/* Seats Warning */}
        {isFull ? (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-800 font-medium">Event Full - Registration Closed</p>
          </div>
        ) : isAlmostFull ? (
          <div className="mb-4 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-800 font-medium">
              Only {seatsAvailable} seats left!
            </p>
          </div>
        ) : null}

        {/* Register Button */}
        {isRegistered ? (
          <Button variant="outline" size="sm" className="w-full" disabled>
            <CheckCircle size={16} className="mr-2" />
            Already Registered
          </Button>
        ) : isFull ? (
          <Button variant="outline" size="sm" className="w-full" disabled>
            Registration Closed
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/event/${event.id}`);
            }}
          >
            Register Now
          </Button>
        )}

        {/* Organizer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Organized by <span className="font-medium text-gray-700">{event.organizer.name}</span>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
