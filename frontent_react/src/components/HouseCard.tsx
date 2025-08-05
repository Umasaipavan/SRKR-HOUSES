import React from 'react';
import { cn } from '@/lib/utils';

export type House = 'aakash' | 'agni' | 'vayu' | 'jal' | 'prudhvi';

export type HouseCardProps = {
  house: House;
  points?: number;
  rank?: number;
  className?: string;
};

// Define color mappings that work with Tailwind's utility classes
const houseColors = {
  aakash: {
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-600',
    progressBar: 'bg-blue-500',
    glowBg: 'bg-blue-200'
  },
  agni: {
    border: 'border-red-300',
    bg: 'bg-red-50',
    text: 'text-red-600',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-600',
    progressBar: 'bg-red-500',
    glowBg: 'bg-red-200'
  },
  vayu: {
    border: 'border-green-300',
    bg: 'bg-green-50',
    text: 'text-green-600',
    badgeBg: 'bg-green-100',
    badgeText: 'text-green-600',
    progressBar: 'bg-green-500',
    glowBg: 'bg-green-200'
  },
  jal: {
    border: 'border-cyan-300',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    badgeBg: 'bg-cyan-100',
    badgeText: 'text-cyan-600',
    progressBar: 'bg-cyan-500',
    glowBg: 'bg-cyan-200'
  },
  prudhvi: {
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-600',
    progressBar: 'bg-amber-500',
    glowBg: 'bg-amber-200'
  }
};

const houseInfo = {
  aakash: {
    name: 'Aakash',
    description: 'Represents the sky and innovation'
  },
  agni: {
    name: 'Agni',
    description: 'Represents fire and passion'
  },
  vayu: {
    name: 'Vayu',
    description: 'Represents wind and adaptability'
  },
  jal: {
    name: 'Jal',
    description: 'Represents creativity and imagination'
  },
  prudhvi: {
    name: 'Prudhvi',
    description: 'Represents earth and stability'
  }
};

export function HouseCard({ house, points, rank, className }: HouseCardProps) {
  const houseData = houseInfo[house];
  const colorScheme = houseColors[house];

  if (!houseData) {
    console.error(`Invalid house value: ${house}`);
    return null;
  }

  const { name, description } = houseData;

  const getRankColorClasses = (rank) => {
    if (rank === 1) return 'bg-blue-100 text-blue-600';
    if (rank === 2) return 'bg-red-100 text-red-600';
    if (rank === 3) return 'bg-green-100 text-green-600';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div 
    className={cn(
      'relative overflow-hidden rounded-xl border p-6 transition-all duration-300 hover:shadow-md bg-card',
      colorScheme.border,
      className
    )}
    >
      
      
      <div className='flex items-start justify-between'>
        <div>
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${colorScheme.badgeBg} ${colorScheme.badgeText}`}>
            {name}
          </span>
          
          <h3 className={cn('mt-3 text-2xl font-bold',colorScheme.text)}>
            {name} House
          </h3>
          
          <p className='mt-1 text-muted-foreground'>
            {description}
          </p>
        </div>
        
        {rank && (
          <span className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full font-bold',
            getRankColorClasses(rank)
          )}>
            #{rank}
          </span>
        )}
      </div>
      
      {points !== undefined && (
        <div className='mt-4'>
          <div className='flex justify-between items-center mb-2'>
            <span className='text-sm text-muted-foreground'>Points</span>
            <span className='font-medium'>{points}</span>
          </div>
          <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
            <div 
              className={`h-full rounded-full ${colorScheme.progressBar}`}
              style={{ width: `${Math.min(100, (points / 1000) * 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}