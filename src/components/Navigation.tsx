import React from 'react';
import { ViewType } from '../types';

interface NavigationProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const isApps = currentView === 'apps';
  const isInfo = currentView !== 'apps';

  return (
    <nav className="bottom-nav" aria-label="Main">
      <div className="in">
        <button
          type="button"
          className={isApps ? 'on' : ''}
          onClick={() => onNavigate('apps')}
        >
          <svg className="i" viewBox="0 0 24 24">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />
          </svg>
          Apps
        </button>
        <button
          type="button"
          className={isInfo ? 'on' : ''}
          onClick={() => onNavigate('info')}
        >
          <svg className="i" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          Info
        </button>
      </div>
    </nav>
  );
};
