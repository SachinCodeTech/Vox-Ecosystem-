import React from 'react';

interface TermsViewProps {
  onBack: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onBack }) => {
  return (
    <section className="view doc" id="v-terms">
      <button type="button" className="back" onClick={onBack}>
        <svg className="i" viewBox="0 0 24 24">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Info
      </button>
      <h2>Terms of Use</h2>
      <p className="meta">Last updated: October 2026</p>
      <p>By using Vox Ecosystem you agree to these terms.</p>
      <h3>Use of the service</h3>
      <p>
        Vox Ecosystem is provided free of charge as a convenience launcher.
        You agree to use it and the linked applications lawfully.
      </p>
      <h3>Linked applications</h3>
      <p>
        Applications reached through the launcher are independent services and
        may have their own terms.
      </p>
      <h3>Availability and changes</h3>
      <p>
        The service is provided &quot;as is&quot; without warranties. CodeTech
        Developers may update, change or discontinue features at any time.
      </p>
      <h3>Intellectual property</h3>
      <p>
        The Vox name, logo and interface are the property of CodeTech
        Developers.
      </p>
      <h3>Contact</h3>
      <p>
        <a href="mailto:codetech.appstore@gmail.com">
          codetech.appstore@gmail.com
        </a>
      </p>
    </section>
  );
};
