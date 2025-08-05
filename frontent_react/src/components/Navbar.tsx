import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Image, 
  Trophy, 
  Star, 
  Users,
  LogIn, 
  Menu, 
  X,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { profile } from 'console';

type NavItemProps = {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
};

const NavItem = ({ href, icon: Icon, label, isActive }: NavItemProps) => (
  <Link 
    to={href} 
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all-200",
      "hover:bg-secondary",
      isActive ? "bg-secondary font-medium" : "text-muted-foreground"
    )}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeItem, setActiveItem] = useState('/');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle path change for active state
  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/pointspage', icon: Star, label: 'Points' }, // Corrected href for points page
    { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/events', icon: Calendar, label: 'Events' },
    // { href: '/displayprofiles', icon: Users, label: 'Profile' },
    // { href: '/community', icon: Users, label: 'Community' },
    // { href: '/loginpage', icon: LogIn, label: 'Login' }
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">Houses</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={activeItem === item.href}
            />
          ))}
          
          <button 
            onClick={toggleDarkMode}
            className="ml-2 p-2 rounded-full hover:bg-secondary transition-all-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-secondary transition-all-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-secondary transition-all-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b animate-slide-down">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <NavItem 
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={activeItem === item.href}
              />
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}