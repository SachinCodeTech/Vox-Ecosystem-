import React from 'react';
import { VERSION_HISTORY } from '../data/appsData';

interface VersionsViewProps {
  onBack: () => void;
}

export const VersionsView: React.FC<VersionsViewProps> = ({ onBack }) => {
  return (
    <section className="view doc" id="v-versions">
      <button type="button" className="back" onClick={onBack}>
        <svg className="i" viewBox="0 0 24 24">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Info
      </button>
      <h2>Version History</h2>
      <p className="meta">Release notes</p>
      {VERSION_HISTORY.map((ver) => (
        <div key={ver.version} className="ver">
          <h3>
            {ver.version} <small>{ver.date}</small>
          </h3>
          <ul>
            {ver.changes.map((change, idx) => (
              <li key={idx}>{change}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};
