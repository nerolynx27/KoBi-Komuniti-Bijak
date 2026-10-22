import { Button } from '../../../components/ui/Button.jsx';
import { Icon } from '../../../components/ui/Icon.jsx';

export const SANDBOX_NAV_ITEMS = [
  { id: 'map', label: 'Map', sharedIcon: 'map' },
  { id: 'reports', label: 'Reports', sharedIcon: 'report' },
  { id: 'activities', label: 'Activities', sharedIcon: 'activity' },
  { id: 'profile', label: 'Profile', sharedIcon: 'profile' },
];

export function SandboxNavIcon({ name, active = false, size = 26 }) {
  return (
    <svg
      className={`sandbox-nav-icon ${active ? 'is-active' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
    >
      {name === 'map' && (
        <g>
          <path
            d="M2 5h6v2h2V5h8v2h2V5h6v18h-6v-2h-2v2h-8v-2H8v2H2V5z"
            fill="var(--color-wine)"
          />
          <rect x="4" y="7" width="4" height="14" fill={active ? 'var(--color-gold)' : 'var(--color-sand)'} />
          <rect x="10" y="7" width="8" height="14" fill="var(--color-vanilla)" />
          <rect x="13" y="7" width="2" height="14" fill="var(--color-wine)" />
          <rect x="20" y="7" width="4" height="14" fill={active ? 'var(--color-gold)' : 'var(--color-sand)'} />
        </g>
      )}

      {name === 'reports' && (
        <g>
          <path
            d="M5 2h13v2h2v2h2v2h2v18H5V2z"
            fill="var(--color-wine)"
          />
          <path
            d="M7 4h9v6h6v14H7V4z"
            fill={active ? 'var(--color-gold)' : 'var(--color-sand)'}
          />
          <path d="M18 4h2v2h2v2h-4V4z" fill="var(--color-vanilla)" />
          <rect x="9" y="12" width="10" height="2" fill="var(--color-wine)" />
          <rect x="9" y="16" width="10" height="2" fill="var(--color-wine)" />
          <rect x="9" y="20" width="7" height="2" fill="var(--color-wine)" />
        </g>
      )}

      {name === 'activities' && (
        <g>
          <path
            d="M18 4h4v20h-4v-3h-4v-2h-4v5H6v-5H3v-8h3V9h4V7h4V4h4z"
            fill="var(--color-wine)"
          />
          <rect x="5" y="13" width="3" height="4" fill="var(--color-cherry)" />
          <path
            d="M10 11h4V9h4v10h-4v-2h-4v-6z"
            fill={active ? 'var(--color-gold)' : 'var(--color-sand)'}
          />
          <rect x="18" y="6" width="2" height="16" fill="var(--color-vanilla)" />
          <rect x="7" y="19" width="2" height="3" fill="var(--color-sand)" />
          <rect x="24" y="9" width="2" height="2" fill="var(--color-wine)" />
          <rect x="24" y="13" width="3" height="2" fill="var(--color-wine)" />
          <rect x="24" y="17" width="2" height="2" fill="var(--color-wine)" />
        </g>
      )}

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

export function SandboxBottomNav({ active = 'reports', onSelectNav, staticPreview = false }) {
  return (
    <nav
      aria-label={staticPreview ? 'Sandbox navigation preview' : 'Main navigation'}
      className={`sandbox-bottom-nav ${staticPreview ? 'is-static-preview' : ''}`}
    >
      {SANDBOX_NAV_ITEMS.map(item => {
        const isCurrent = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            className={`sandbox-nav-item ${isCurrent ? 'is-selected' : ''}`}
            aria-current={isCurrent ? 'page' : undefined}
            onClick={() => onSelectNav?.(item.id)}
          >
            <SandboxNavIcon name={item.id} active={isCurrent} />
            <span className="sandbox-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function SandboxHeader({ onMenuClick, menuOpen = false }) {
  return (
    <header className="sandbox-top-header">
      <a
        href="#sandbox-top"
        className="sandbox-brand"
        aria-label="KoBi home"
        onClick={event => event.preventDefault()}
      >
        <img src="/assets/brand/kobi-logo.png" alt="KoBi" className="brand-logo" />
        <span className="sr-only">KoBi</span>
      </a>

      <button
        type="button"
        className={`sandbox-menu-btn ${menuOpen ? 'is-open' : ''}`}
        aria-label={menuOpen ? 'Close app menu' : 'Open app menu'}
        aria-expanded={menuOpen}
        aria-controls="sandbox-burger-drawer"
        onClick={onMenuClick}
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
  );
}

export function SandboxBurgerDrawer({
  open,
  activePersona,
  onSwitchAccount,
  workspaceMode,
  onSelectWorkspace,
  onSelectSdpDestination,
  myReportsCount = 0,
  onJumpToMyReports,
  rememberWorkspace = true,
  onToggleRememberWorkspace,
  onResetDemoData,
}) {
  if (!open) return null;

  return (
    <aside
      id="sandbox-burger-drawer"
      className="sandbox-burger-drawer"
      aria-label="KoBi app menu"
    >
      {/* 1. Current Resident / Persona Card */}
      <section className="sandbox-burger-section sandbox-persona-card" aria-label="Active account">
        <div className="sandbox-persona-row">
          <div className="sandbox-persona-avatar">
            <SandboxNavIcon name="profile" active size={30} />
          </div>
          <div className="sandbox-persona-meta">
            <div className="sandbox-persona-badges">
              <span className="sandbox-persona-role-pill">{activePersona.roleLabel}</span>
              <span className="sandbox-persona-township">{activePersona.township}</span>
            </div>
            <strong className="sandbox-persona-name">{activePersona.name}</strong>
          </div>
        </div>
        <div className="sandbox-persona-actions">
          <Button size="sm" variant="secondary" icon="profile" onClick={onSwitchAccount}>
            Switch account
          </Button>
        </div>
      </section>

      {/* 2. Workspace Switcher (Resident <-> SDP Staff Mode) */}
      <section className="sandbox-burger-section" aria-label="Workspace switcher">
        <span className="sandbox-burger-heading">WORKSPACE MODE</span>
        <div className="sandbox-workspace-grid" role="group" aria-label="Choose workspace">
          <button
            type="button"
            className={`sandbox-workspace-pill ${workspaceMode === 'resident' ? 'is-selected' : ''}`}
            aria-pressed={workspaceMode === 'resident'}
            onClick={() => onSelectWorkspace('resident')}
          >
            <span className="sandbox-workspace-pill-title">RESIDENT VIEW</span>
            <span className="sandbox-workspace-pill-sub">Map, Reports & Activities</span>
          </button>
          <button
            type="button"
            className={`sandbox-workspace-pill ${workspaceMode === 'sdp' ? 'is-selected' : ''}`}
            aria-pressed={workspaceMode === 'sdp'}
            onClick={() => onSelectWorkspace('sdp')}
          >
            <span className="sandbox-workspace-pill-title">SDP WORKSPACE</span>
            <span className="sandbox-workspace-pill-sub">Staff maintenance & World editor</span>
          </button>
        </div>

        {workspaceMode === 'sdp' && (
          <div className="sandbox-sdp-shortcuts">
            <button
              type="button"
              className="sandbox-shortcut-btn"
              onClick={() => onSelectSdpDestination?.('Review reports (#sdp/reports)')}
            >
              <Icon name="report" />
              <span>Review reports</span>
            </button>
            <button
              type="button"
              className="sandbox-shortcut-btn"
              onClick={() => onSelectSdpDestination?.('Manage activities (#sdp/activities)')}
            >
              <Icon name="activity" />
              <span>Manage activities</span>
            </button>
            <button
              type="button"
              className="sandbox-shortcut-btn"
              onClick={() => onSelectSdpDestination?.('World editor (#sdp/world)')}
            >
              <Icon name="catalog" />
              <span>World editor</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. Quick App Shortcuts */}
      <section className="sandbox-burger-section" aria-label="Quick shortcuts">
        <span className="sandbox-burger-heading">SHORTCUTS & PREFERENCES</span>
        <div className="sandbox-shortcut-list">
          <button
            type="button"
            className="sandbox-shortcut-btn"
            onClick={onJumpToMyReports}
          >
            <Icon name="report" />
            <span>My submitted reports ({myReportsCount})</span>
          </button>
          <button
            type="button"
            className="sandbox-shortcut-btn"
            aria-pressed={rememberWorkspace}
            onClick={onToggleRememberWorkspace}
          >
            <Icon name="settings" />
            <span>
              Settings · Remember workspace: <strong>{rememberWorkspace ? 'On' : 'Off'}</strong>
            </span>
          </button>
        </div>
      </section>

      {/* 4. Compact Demo & Storage Footer */}
      <footer className="sandbox-burger-footer" aria-label="Demo storage controls">
        <div className="sandbox-burger-status-line">
          <span className="sandbox-status-dot" aria-hidden="true" />
          <span>Browser demo · Saved in this browser</span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          icon="reset-demo"
          onClick={onResetDemoData}
        >
          Reset demo data
        </Button>
      </footer>
    </aside>
  );
}

export function SharedIconComparisonRow() {
  return (
    <div className="sandbox-icon-comparison">
      {SANDBOX_NAV_ITEMS.map(item => (
        <div key={item.id} className="sandbox-icon-specimen-card">
          <div className="sandbox-icon-pair">
            <div className="sandbox-icon-sample">
              <SandboxNavIcon name={item.id} active={item.id === 'reports'} size={32} />
              <span className="helper">Sandbox SVG</span>
            </div>
            <div className="sandbox-icon-sample">
              <Icon name={item.sharedIcon} />
              <span className="helper">icons.svg#{item.sharedIcon}</span>
            </div>
          </div>
          <strong className="sandbox-icon-title">{item.label}</strong>
        </div>
      ))}
    </div>
  );
}
