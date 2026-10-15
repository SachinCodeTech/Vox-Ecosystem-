import React from 'react';

interface PrivacyViewProps {
  onBack: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onBack }) => {
  return (
    <section className="view doc" id="v-privacy">
      <button type="button" className="back" onClick={onBack}>
        <svg className="i" viewBox="0 0 24 24">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Info
      </button>
      <h2>Privacy Policy</h2>
      <p className="meta">Last updated: October 2026</p>
      <p>
        Vox Ecosystem, provided by CodeTech Developers, is a launcher that links
        to separate applications. This policy covers the launcher itself.
      </p>
      <h3>Information we collect</h3>
      <p>
        The launcher does not require an account and does not collect, store or
        transmit personal information. It stores only the files needed to work
        offline on your device.
      </p>
      <h3>Third-party applications</h3>
      <p>
        The apps you open from here (VoxCADD, Arch Pad Pro, 10to7 and others) are
        independent and open in your browser. Each has its own data handling,
        and any data you enter is subject to that app's own policy.
      </p>
      <h3>Cookies and tracking</h3>
      <p>The launcher does not use advertising or tracking cookies.</p>
      <h3>Contact</h3>
      <p>
        Questions:{' '}
        <a href="mailto:codetech.appstore@gmail.com">
          codetech.appstore@gmail.com
        </a>
      </p>
    </section>
  );
};
