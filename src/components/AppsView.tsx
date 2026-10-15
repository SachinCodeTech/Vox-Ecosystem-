import React, { useState } from 'react';
import { AppItem, ServiceState } from '../types';
import { APPS } from '../data/appsData';

interface AppsViewProps {
  servicesStatus: Record<string, ServiceState>;
  canInstall: boolean;
  onInstall: () => void;
}

export const AppsView: React.FC<AppsViewProps> = ({
  servicesStatus,
  canInstall,
  onInstall,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const isStopped = (app: AppItem) => {
    return app.live && servicesStatus[app.id] && servicesStatus[app.id].enabled === false;
  };

  const filteredApps = APPS.filter((app) => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase().trim();
    return (
      app.name.toLowerCase().includes(query) ||
      app.desc.toLowerCase().includes(query)
    );
  });

  const liveCount = APPS.filter((a) => a.live && !isStopped(a)).length;
  const soonCount = APPS.filter((a) => !a.live).length;
  const stopCount = APPS.filter((a) => isStopped(a)).length;

  return (
    <section className="view" id="v-apps">
      <div className="topbar">
        <img src="/icon-192.png" alt="Vox Ecosystem logo" />
        <div className="brand">
          VOX ECOSYSTEM
          <small>by CodeTech Developers</small>
        </div>
      </div>

      <div className="hero">
        <h1>
          One workspace.<br />
          <span>Multiple tools.</span>
        </h1>
        <p>
          Launch every Vox application from a single, unified home — built and
          maintained by CodeTech Developers.
        </p>
        <div className="stats">
          <div className="stat">
            <b>{liveCount}</b>Live apps
          </div>
          <div className="stat">
            <b>{soonCount}</b>Coming soon
          </div>
          {stopCount > 0 && (
            <div className="stat red">
              <b>{stopCount}</b>Stopped
            </div>
          )}
        </div>
        {canInstall && (
          <button
            type="button"
            className="install-btn"
            onClick={onInstall}
          >
            <svg className="i" viewBox="0 0 24 24">
              <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
            </svg>
            Install App
          </button>
        )}
      </div>

      <label className="search">
        <svg className="i" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          placeholder="Search applications"
          autoComplete="off"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>

      <div className="section-title">Your Applications</div>
      <div className="grid">
        {filteredApps.map((app) => {
          const stopped = isStopped(app);
          const stopMsg =
            servicesStatus[app.id]?.message?.trim() ||
            'This service is temporarily unavailable.';

          return (
            <article key={app.id} className="card">
              <div className="card-head">
                <div className="tile" style={{ background: app.bg }}>
                  {app.logo ? (
                    <img src={app.logo} alt={`${app.name} logo`} />
                  ) : (
                    <svg className="i" viewBox="0 0 24 24">
                      {app.id === 'archpad' && (
                        <path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" />
                      )}
                      {app.id === 'tento7' && (
                        <>
                          <rect x="3" y="4" width="18" height="18" rx="2" />
                          <path d="M16 2v4M8 2v4M3 10h18M8 15h3" />
                        </>
                      )}
                      {app.id === 'interiorbot' && (
                        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
                      )}
                    </svg>
                  )}
                </div>
                <div>
                  <h3>{app.name}</h3>
                  {!app.live ? (
                    <span className="tag soon">Coming soon</span>
                  ) : stopped ? (
                    <span className="tag stop">Stopped</span>
                  ) : (
                    <span className="tag live">Live</span>
                  )}
                </div>
              </div>

              <p>{app.desc}</p>

              {stopped && <div className="notice">{stopMsg}</div>}

              {!app.live ? (
                <span className="btn off">Coming Soon</span>
              ) : stopped ? (
                <span className="btn off">Temporarily unavailable</span>
              ) : (
                <a
                  className="btn"
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open {app.name}{' '}
                  <svg className="i" viewBox="0 0 24 24">
                    <path d="M7 17L17 7M8 7h9v9" />
                  </svg>
                </a>
              )}
            </article>
          );
        })}
      </div>

      {filteredApps.length === 0 && (
        <div className="empty">No applications match your search.</div>
      )}

      <footer>
        © CodeTech Developers · Vox Ecosystem<br />
        Independent applications, unified access.
      </footer>
    </section>
  );
};
