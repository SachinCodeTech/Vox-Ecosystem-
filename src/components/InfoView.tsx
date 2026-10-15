import React, { useRef } from 'react';
import { ViewType } from '../types';

interface InfoViewProps {
  onNavigate: (view: ViewType) => void;
  adminUnlocked: boolean;
  onUnlockAdmin: () => void;
}

export const InfoView: React.FC<InfoViewProps> = ({
  onNavigate,
  adminUnlocked,
  onUnlockAdmin,
}) => {
  const tapsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleVersionClick = () => {
    tapsRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      tapsRef.current = 0;
    }, 1500);

    if (tapsRef.current >= 5) {
      tapsRef.current = 0;
      onUnlockAdmin();
    }
  };

  return (
    <section className="view" id="v-info">
      <h1 className="page-title">Info</h1>
      <p className="page-sub">About Vox Ecosystem and CodeTech Developers.</p>

      <div className="section-title">Product</div>
      <div className="list">
        <button
          type="button"
          className="row"
          onClick={() => onNavigate('about')}
        >
          <span className="l">
            <svg className="i" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            About
          </span>
          <svg className="i" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <button
          type="button"
          className="row"
          onClick={() => onNavigate('versions')}
        >
          <span className="l">
            <svg className="i" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            Version History
          </span>
          <svg className="i" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="section-title">Legal Information</div>
      <div className="list">
        <button
          type="button"
          className="row"
          onClick={() => onNavigate('privacy')}
        >
          <span className="l">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
            </svg>
            Privacy Policy
          </span>
          <svg className="i" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
        <button
          type="button"
          className="row"
          onClick={() => onNavigate('terms')}
        >
          <span className="l">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5M9 13h6M9 17h6" />
            </svg>
            Terms of Use
          </span>
          <svg className="i" viewBox="0 0 24 24">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {adminUnlocked && (
        <div id="admin-entry">
          <div className="section-title">Administration</div>
          <div className="list">
            <button
              type="button"
              className="row"
              onClick={() => onNavigate('admin')}
            >
              <span className="l">
                <svg className="i" viewBox="0 0 24 24">
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                Admin Console
              </span>
              <svg className="i" viewBox="0 0 24 24">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="section-title">Company Info</div>
      <div className="kv">
        <div>
          <span>Company</span>
          <b>CodeTech Developers</b>
        </div>
        <div>
          <span>Lead Developer</span>
          <b>Sachin Sheth</b>
        </div>
        <div>
          <span>Email</span>
          <b>
            <a href="mailto:codetech.appstore@gmail.com">
              codetech.appstore@gmail.com
            </a>
          </b>
        </div>
        <div
          id="ver-row"
          className="clickable-ver"
          onClick={handleVersionClick}
          title="Version 1.2.0"
        >
          <span>Version</span>
          <b>1.2.0</b>
        </div>
      </div>
    </section>
  );
};
