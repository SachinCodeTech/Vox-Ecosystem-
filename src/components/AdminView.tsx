import React, { useState, useEffect } from 'react';
import { ServiceState, GitHubConnection } from '../types';
import { APPS } from '../data/appsData';

interface AdminViewProps {
  servicesStatus: Record<string, ServiceState>;
  updatedAt: string;
  onUpdateStatus: (newStatus: Record<string, ServiceState>, updatedTime: string) => void;
  onBack: () => void;
  onLock: () => void;
  showToast: (msg: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  servicesStatus,
  updatedAt,
  onUpdateStatus,
  onBack,
  onLock,
  showToast,
}) => {
  const liveApps = APPS.filter((a) => a.live);

  // Initialize draft from current servicesStatus
  const [draft, setDraft] = useState<Record<string, ServiceState>>(() => {
    const initial: Record<string, ServiceState> = {};
    liveApps.forEach((app) => {
      const s = servicesStatus[app.id];
      initial[app.id] = {
        enabled: s ? s.enabled !== false : true,
        message: s?.message || '',
      };
    });
    return initial;
  });

  const [connection, setConnection] = useState<GitHubConnection>(() => {
    return {
      owner: localStorage.getItem('vox_g_owner') || '',
      repo: localStorage.getItem('vox_g_repo') || '',
      branch: localStorage.getItem('vox_g_branch') || 'main',
      token: localStorage.getItem('vox_g_token') || '',
      remember: !!localStorage.getItem('vox_g_token'),
    };
  });

  const [message, setMessage] = useState<{ text: string; type: 'ok' | 'err' | '' }>({
    text: '',
    type: '',
  });
  const [isPublishing, setIsPublishing] = useState(false);

  // Keep draft in sync if external status changes
  useEffect(() => {
    setDraft((prev) => {
      const next = { ...prev };
      liveApps.forEach((app) => {
        if (!next[app.id]) {
          const s = servicesStatus[app.id];
          next[app.id] = {
            enabled: s ? s.enabled !== false : true,
            message: s?.message || '',
          };
        }
      });
      return next;
    });
  }, [servicesStatus]);

  const handleToggle = (id: string, enabled: boolean) => {
    setDraft((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { enabled: true, message: '' }),
        enabled,
      },
    }));
    setMessage({ text: 'Unsaved changes — tap Publish changes.', type: '' });
  };

  const handleMessageChange = (id: string, text: string) => {
    setDraft((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { enabled: true, message: '' }),
        message: text,
      },
    }));
  };

  const handleStopAll = () => {
    setDraft((prev) => {
      const next: Record<string, ServiceState> = {};
      liveApps.forEach((app) => {
        next[app.id] = {
          enabled: false,
          message: prev[app.id]?.message || '',
        };
      });
      return next;
    });
    setMessage({ text: 'Unsaved changes — tap Publish changes.', type: '' });
  };

  const handleResumeAll = () => {
    setDraft((prev) => {
      const next: Record<string, ServiceState> = {};
      liveApps.forEach((app) => {
        next[app.id] = {
          enabled: true,
          message: prev[app.id]?.message || '',
        };
      });
      return next;
    });
    setMessage({ text: 'Unsaved changes — tap Publish changes.', type: '' });
  };

  const handleSaveConnection = () => {
    localStorage.setItem('vox_g_owner', connection.owner.trim());
    localStorage.setItem('vox_g_repo', connection.repo.trim());
    localStorage.setItem('vox_g_branch', connection.branch.trim() || 'main');
    if (connection.remember && connection.token.trim()) {
      localStorage.setItem('vox_g_token', connection.token.trim());
    } else {
      localStorage.removeItem('vox_g_token');
    }
    showToast('Connection saved');
  };

  const b64 = (str: string) => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  const handlePublish = async () => {
    const owner = connection.owner.trim();
    const repo = connection.repo.trim();
    const branch = connection.branch.trim() || 'main';
    const token = connection.token.trim();

    if (!owner || !repo || !token) {
      setMessage({
        text: 'Fill in the publishing connection first (username, repository, token).',
        type: 'err',
      });
      return;
    }

    setIsPublishing(true);
    setMessage({ text: 'Publishing…', type: '' });

    const api = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/services.json`;
    const authHeaders: HeadersInit = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    };
    const newUpdated = new Date().toISOString();
    const payloadBody = {
      updated: newUpdated,
      services: draft,
    };

    try {
      // 1. Fetch current file to get sha
      const getRes = await fetch(`${api}?ref=${encodeURIComponent(branch)}`, {
        headers: authHeaders,
        cache: 'no-store',
      });

      let sha: string | undefined = undefined;
      if (getRes.status === 401 || getRes.status === 403) {
        throw new Error('Token rejected. Check the token and its repository permission.');
      }
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      } else if (getRes.status !== 404) {
        throw new Error(`GitHub error ${getRes.status}`);
      }

      // 2. Put file
      const putPayload: Record<string, any> = {
        message: 'Admin: update service status',
        content: b64(JSON.stringify(payloadBody, null, 2) + '\n'),
        branch,
      };
      if (sha) {
        putPayload.sha = sha;
      }

      const putRes = await fetch(api, {
        method: 'PUT',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(putPayload),
      });

      if (!putRes.ok) {
        const errJson = await putRes.json().catch(() => ({}));
        throw new Error(errJson.message || `GitHub error ${putRes.status}`);
      }

      // Success
      onUpdateStatus(draft, newUpdated);
      localStorage.setItem('vox_g_owner', owner);
      localStorage.setItem('vox_g_repo', repo);
      localStorage.setItem('vox_g_branch', branch);
      if (connection.remember) {
        localStorage.setItem('vox_g_token', token);
      }
      setMessage({
        text: 'Published. Vercel redeploys in about a minute, then every device picks up the change.',
        type: 'ok',
      });
      showToast('Changes published to GitHub');
    } catch (err: any) {
      setMessage({
        text: err.message || 'Publish failed.',
        type: 'err',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Immediate preview mode (updates local active status for instant verification)
  const handleApplyLocally = () => {
    const newUpdated = new Date().toISOString();
    onUpdateStatus(draft, newUpdated);
    setMessage({
      text: 'Applied locally! You can test the stopped/live states on the Apps tab.',
      type: 'ok',
    });
    showToast('Applied locally');
  };

  const lastPublishedText = updatedAt
    ? `Last published: ${new Date(updatedAt).toLocaleString()}`
    : 'No published status yet — all services are running';

  return (
    <section className="view doc" id="v-admin">
      <button type="button" className="back" onClick={onBack}>
        <svg className="i" viewBox="0 0 24 24">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Info
      </button>

      <h2>Admin Console</h2>
      <p className="meta">{lastPublishedText}</p>

      <div className="section-title">Services</div>
      <div id="adm-list">
        {liveApps.map((app) => {
          const item = draft[app.id] || { enabled: true, message: '' };
          return (
            <div key={app.id} className="svc">
              <div className="svc-top">
                <div>
                  <b>{app.name}</b>
                  <small className={item.enabled ? 'on' : 'off'}>
                    {item.enabled ? 'Running' : 'Stopped'}
                  </small>
                </div>
                <label className="sw">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) => handleToggle(app.id, e.target.checked)}
                  />
                  <i />
                </label>
              </div>
              {!item.enabled && (
                <input
                  className="msg"
                  type="text"
                  placeholder="Message shown to users (optional)"
                  value={item.message}
                  onChange={(e) => handleMessageChange(app.id, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="btnrow">
        <button type="button" className="danger" onClick={handleStopAll}>
          Stop all
        </button>
        <button type="button" onClick={handleResumeAll}>
          Resume all
        </button>
      </div>

      <div className="btnrow">
        <button
          type="button"
          className="primary"
          disabled={isPublishing}
          onClick={handlePublish}
        >
          {isPublishing ? 'Publishing…' : 'Publish changes'}
        </button>
        <button
          type="button"
          title="Test changes immediately in this session"
          onClick={handleApplyLocally}
        >
          Apply in Preview
        </button>
      </div>

      {message.text && (
        <p className={`adm-msg ${message.type}`}>{message.text}</p>
      )}

      <div className="section-title">Publishing connection</div>
      <div className="box">
        <label htmlFor="g-owner">GitHub username</label>
        <input
          id="g-owner"
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          placeholder="your-github-username"
          value={connection.owner}
          onChange={(e) =>
            setConnection({ ...connection, owner: e.target.value })
          }
        />

        <label htmlFor="g-repo">Repository</label>
        <input
          id="g-repo"
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          placeholder="Vox-Ecosystem-"
          value={connection.repo}
          onChange={(e) =>
            setConnection({ ...connection, repo: e.target.value })
          }
        />

        <label htmlFor="g-branch">Branch</label>
        <input
          id="g-branch"
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          value={connection.branch}
          onChange={(e) =>
            setConnection({ ...connection, branch: e.target.value })
          }
        />

        <label htmlFor="g-token">Access token</label>
        <input
          id="g-token"
          type="password"
          autoComplete="off"
          placeholder="github_pat_…"
          value={connection.token}
          onChange={(e) =>
            setConnection({ ...connection, token: e.target.value })
          }
        />

        <label className="chk">
          <input
            type="checkbox"
            checked={connection.remember}
            onChange={(e) =>
              setConnection({ ...connection, remember: e.target.checked })
            }
          />
          Remember on this device
        </label>

        <p className="hint">
          Use a fine-grained token limited to this one repository with Contents:
          Read and write. Publishing is protected by this token — without it
          nobody can change service status.
        </p>

        <div className="btnrow">
          <button type="button" onClick={handleSaveConnection}>
            Save connection
          </button>
        </div>
      </div>

      <div className="btnrow">
        <button type="button" className="danger" onClick={onLock}>
          Lock admin &amp; forget token
        </button>
      </div>
    </section>
  );
};
