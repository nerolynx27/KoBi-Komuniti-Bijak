import { useEffect, useState } from 'react';
import { Button } from '../ui/Button.jsx';
import { Icon } from '../ui/Icon.jsx';

function BurgerNavIcon({ name, active = false, size = 26 }) {
  return (
    <svg
      className={`bottom-nav-sticker-icon ${active ? 'is-active' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      {name === 'profile' && (
        <g>
          <path
            d="M10 3h8v2h2v6h-2v2h-8v-2H8V5h2V3z"
            fill="var(--color-wine)"
          />
          <rect x="10" y="5" width="8" height="6" fill={active ? 'var(--color-gold)' : 'var(--color-vanilla)'} />
          <path
            d="M6 15h16v2h2v8H4v-8h2v-2z"
            fill="var(--color-wine)"
          />
          <path
            d="M8 17h12v2h2v4H6v-4h2v-2z"
            fill={active ? 'var(--color-gold)' : 'var(--color-sand)'}
          />
        </g>
      )}
    </svg>
  );
}

export function AppHeader({
  staff = false,
  actor,
  session,
  data,
  store,
  navigate,
  openReset,
  notify,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [residentIndex, setResidentIndex] = useState(0);

  // Close on Escape key press
  useEffect(() => {
    if (!menuOpen) return undefined;
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const residents = [
    { name: 'Resident — Aina', roleLabel: 'RESIDENT' },
    { name: 'Resident — Ravi', roleLabel: 'RESIDENT' },
  ];

  const currentResident = residents[residentIndex % residents.length];
  const activePersonaName = staff ? 'SDP Staff' : currentResident.name;
  const activeRoleLabel = staff ? 'SDP STAFF' : currentResident.roleLabel;
  const townshipName = data?.township?.name || 'Komuniti Bijak';

  const myReportsCount = data?.complaints
    ? data.complaints.filter(c => !actor?.id || c.resident_id === actor.id).length
    : 0;

  function handleSwitchAccount() {
    if (staff) {
      session?.setView('resident');
      if (data?.preferences?.rememberWorkspace) store?.setWorkspace('resident');
      navigate?.('map');
      notify?.('Switched to resident view.');
    } else {
      setResidentIndex(prev => prev + 1);
      const nextName = residents[(residentIndex + 1) % residents.length].name;
      notify?.(`Switched active account to ${nextName}.`);
    }
  }

  function handleSelectWorkspace(mode) {
    if (mode === 'resident') {
      session?.setView('resident');
      if (data?.preferences?.rememberWorkspace) store?.setWorkspace('resident');
      navigate?.('map');
      notify?.('Resident view active.');
    } else {
      session?.setView('sdp');
      if (data?.preferences?.rememberWorkspace) store?.setWorkspace('sdp');
      navigate?.('sdp');
      notify?.('SDP demo workspace active.');
    }
    setMenuOpen(false);
  }

  function handleNavigate(dest) {
    navigate?.(dest);
    setMenuOpen(false);
  }

  function handleToggleRememberWorkspace() {
    const nextVal = !data?.preferences?.rememberWorkspace;
    if (store?.setRememberWorkspace) {
      store.setRememberWorkspace(nextVal);
      notify?.(`Remember workspace turned ${nextVal ? 'On' : 'Off'}.`);
    }
  }

  return (
    <>
      <header className="app-header">
        <div className="app-header-brand-wrap">
          <a
            href="#map"
            className="brand"
            aria-label="KoBi home"
            onClick={() => setMenuOpen(false)}
          >
            <span>KoBi</span>
            <span className="brand-fold" aria-hidden="true" />
          </a>
        </div>

        <button
          type="button"
          className={`burger-menu-btn ${menuOpen ? 'is-open' : ''}`}
          aria-label={menuOpen ? 'Close app menu' : 'Open app menu'}
          aria-expanded={menuOpen}
          aria-controls="app-burger-drawer"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            shapeRendering="crispEdges"
          >
            {menuOpen ? (
              <path
                d="M5 5h3v3h3v3h2V8h3V5h3v3h-3v3h-3v2h3v3h3v3h-3v-3h-3v-3h-2v3H8v3H5v-3h3v-3h3v-2H8V8H5V5z"
                fill="var(--color-wine)"
              />
            ) : (
              <>
                <rect x="2" y="4" width="20" height="3" fill="var(--color-wine)" />
                <rect x="2" y="10" width="20" height="3" fill="var(--color-wine)" />
                <rect x="2" y="16" width="20" height="3" fill="var(--color-wine)" />
              </>
            )}
          </svg>
        </button>
      </header>

      {menuOpen && (
        <div
          className="burger-drawer-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {menuOpen && (
        <aside
          id="app-burger-drawer"
          className="app-burger-drawer"
          aria-label="KoBi app menu"
        >
          {/* 1. Active Persona Card */}
          <section className="burger-section burger-persona-card" aria-label="Active account">
            <div className="burger-persona-row">
              <div className="burger-persona-avatar">
                <BurgerNavIcon name="profile" active size={30} />
              </div>
              <div className="burger-persona-meta">
                <div className="burger-persona-badges">
                  <span className="burger-persona-role-pill">{activeRoleLabel}</span>
                  <span className="burger-persona-township">{townshipName}</span>
                </div>
                <strong className="burger-persona-name">{activePersonaName}</strong>
              </div>
            </div>
            <div className="burger-persona-actions">
              <Button
                size="sm"
                variant="secondary"
                icon="profile"
                onClick={handleSwitchAccount}
              >
                Switch account
              </Button>
            </div>
          </section>

          {/* 2. Workspace Mode Switcher (Resident <-> SDP Workspace) */}
          <section className="burger-section" aria-label="Workspace switcher">
            <span className="burger-heading">WORKSPACE MODE</span>
            <div className="burger-workspace-grid" role="group" aria-label="Choose workspace">
              <button
                type="button"
                className={`burger-workspace-pill ${!staff ? 'is-selected' : ''}`}
                aria-pressed={!staff}
                onClick={() => handleSelectWorkspace('resident')}
              >
                <span className="burger-workspace-pill-title">RESIDENT VIEW</span>
                <span className="burger-workspace-pill-sub">Map, Reports & Activities</span>
              </button>
              <button
                type="button"
                className={`burger-workspace-pill ${staff ? 'is-selected' : ''}`}
                aria-pressed={staff}
                onClick={() => handleSelectWorkspace('sdp')}
              >
                <span className="burger-workspace-pill-title">SDP WORKSPACE</span>
                <span className="burger-workspace-pill-sub">Staff maintenance & World editor</span>
              </button>
            </div>

            {staff && (
              <div className="burger-sdp-shortcuts">
                <button
                  type="button"
                  className="burger-shortcut-btn"
                  onClick={() => handleNavigate('sdp/reports')}
                >
                  <Icon name="report" />
                  <span>Review reports</span>
                </button>
                <button
                  type="button"
                  className="burger-shortcut-btn"
                  onClick={() => handleNavigate('sdp/activities')}
                >
                  <Icon name="activity" />
                  <span>Manage activities</span>
                </button>
                <button
                  type="button"
                  className="burger-shortcut-btn"
                  onClick={() => handleNavigate('sdp/world')}
                >
                  <Icon name="catalog" />
                  <span>World editor</span>
                </button>
              </div>
            )}
          </section>

          {/* 3. Shortcuts & Preferences */}
          <section className="burger-section" aria-label="Shortcuts and preferences">
            <span className="burger-heading">SHORTCUTS & PREFERENCES</span>
            <div className="burger-shortcut-list">
              <button
                type="button"
                className="burger-shortcut-btn"
                onClick={() => {
                  if (staff) {
                    session?.setView('resident');
                  }
                  handleNavigate('reports');
                }}
              >
                <Icon name="report" />
                <span>My submitted reports ({myReportsCount})</span>
              </button>
              <button
                type="button"
                className="burger-shortcut-btn"
                aria-pressed={Boolean(data?.preferences?.rememberWorkspace)}
                onClick={handleToggleRememberWorkspace}
              >
                <Icon name="settings" />
                <span>
                  Settings · Remember workspace: <strong>{data?.preferences?.rememberWorkspace ? 'On' : 'Off'}</strong>
                </span>
              </button>
            </div>
          </section>

          {/* 4. Demo Storage Footer */}
          <footer className="burger-footer" aria-label="Demo storage controls">
            <div className="burger-status-line">
              <span className="burger-status-dot" aria-hidden="true" />
              <span>Browser demo · Saved in this browser</span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              icon="reset-demo"
              onClick={() => {
                setMenuOpen(false);
                openReset?.();
              }}
            >
              Reset demo data
            </Button>
          </footer>
        </aside>
      )}
    </>
  );
}
