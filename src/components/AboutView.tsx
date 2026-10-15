import React from 'react';
import { ViewType } from '../types';

interface SubViewProps {
  onBack: () => void;
}

export const AboutView: React.FC<SubViewProps> = ({ onBack }) => {
  return (
    <section className="view doc" id="v-about">
      <button type="button" className="back" onClick={onBack}>
        <svg className="i" viewBox="0 0 24 24">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Info
      </button>
      <h2>About Vox Ecosystem</h2>
      <p className="meta">Version 1.2.0 · CodeTech Developers</p>
      <p>
        Vox Ecosystem is a unified launcher for the Vox family of applications.
        Instead of remembering separate links, you get one installable home screen
        that opens each tool in a tap.
      </p>
      <h3>What's inside</h3>
      <ul>
        <li>
          <b>VoxCADD</b> — browser-based CAD drafting and design workspace.
        </li>
        <li>
          <b>Arch Pad Pro</b> — a digital sketch pad for architectural ideas.
        </li>
        <li>
          <b>10to7</b> — productivity and work management.
        </li>
        <li>
          <b>Interior Bot</b> — AI interior design, coming soon.
        </li>
      </ul>
      <h3>Independent by design</h3>
      <p>
        Each application is built and hosted independently. Vox Ecosystem
        simply connects them, so one app never depends on another to work.
      </p>
      <h3>Built by</h3>
      <p>CodeTech Developers · Lead Developer: Sachin Sheth.</p>
    </section>
  );
};
