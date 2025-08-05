import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EventCardProps = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  house: string;
  image?: string;
  isFeatured?: boolean;
  className?: string;
};

export function EventCard({
  id,
  title,
  description,
  date,
  time,
  location,
  house,
  image,
  isFeatured = false,
  className,
}: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const houseName = house ? house.charAt(0).toUpperCase() + house.slice(1) : "Unknown";

  return (
    <>
      {/* Event Card */}
      <div
        className={cn(
          'group relative overflow-hidden rounded-xl border bg-card transition-all duration-300',
          'hover:shadow-md hover:-translate-y-1',
          isFeatured && 'md:col-span-2 md:row-span-2',
          className
        )}
      >
        {/* <div className="aspect-video w-full overflow-hidden">
          <img
            src={
              image ||
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
            }
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div> */}

        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className={cn('house-badge', `house-badge-${houseName.toLowerCase()}`)}>
              {houseName}
            </span>
            {isFeatured && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                Featured
              </span>
            )}
          </div>

          <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{description}</p>

          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{date}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{time}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>{location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users size={14} />
              <span>Organized by {houseName} House</span>
            </div>
          </div>

          {/* View Details Button - Opens Modal */}
          <div className="mt-5 flex justify-end">
            {/* <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              View Details
            </button> */}
          </div>
        </div>
      </div>

      {/* Modal - Full Screen */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full h-full p-6 overflow-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>

            <div className="max-w-3xl mx-auto">
              {/* Event Image */}
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={
                    image ||
                    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
                  }
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Details */}
              <h2 className="text-3xl font-bold mt-6">{title}</h2>
              <p className="mt-2 text-muted-foreground">{description}</p>

              <div className="mt-4 space-y-3 text-lg">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{time}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Organized by {houseName} House</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}