import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

interface HeaderProps {
  onOpenSearch: () => void;
  onNavigateToApprovals?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onNavigateToApprovals,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6 border-b border-surface-container-high/40">
      {/* Left zone: Search and Telemetry indicators */}
      <div className="flex items-center gap-4">
        {/* Search trigger */}
        <div
          onClick={onOpenSearch}
          className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg text-outline cursor-pointer hover:bg-surface-container hover:text-on-surface transition-all border border-surface-container-highest/20"
        >
          <span className="material-symbols-outlined text-sm">search</span>
          <span className="text-xs text-on-surface-variant font-normal">
            Search metrics, workers, executions...
          </span>
          <span className="text-[10px] font-mono bg-surface-container-high px-1.5 py-0.5 rounded text-outline ml-2">
            ⌘K
          </span>
        </div>

        {/* Cluster environment pill */}
        <div className="hidden xl:flex items-center gap-1.5 bg-surface-container-high px-2.5 py-1 rounded border border-surface-container-highest/30">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <span className="text-[11px] font-mono text-on-surface font-medium">
            Production (v2.4.1)
          </span>
        </div>

        {/* SLA and health pill */}
        <div className="hidden lg:flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded border border-surface-container-highest/20">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          <span className="text-[11px] font-mono text-secondary font-semibold">
            99.98% SLA
          </span>
          <span className="text-[11px] font-mono text-outline-variant">|</span>
          <span className="text-[11px] font-mono text-on-surface-variant">
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Right zone: Heartbeat, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Celery heartbeat */}
        <div className="hidden sm:flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1 rounded border border-surface-container-highest/20">
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
          <span className="text-[11px] font-mono text-on-surface">
            Celery Heartbeat
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center p-2 text-on-surface-variant hover:text-on-surface cursor-pointer rounded-lg hover:bg-surface-container transition-colors"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error animate-pulse"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-surface-container-high border border-surface-container-highest rounded-lg shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/40">
                <span className="text-xs font-mono font-semibold text-on-surface uppercase tracking-wider">
                  Operational Alerts
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-mono text-primary hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      if (n.id === 'notif-1' && onNavigateToApprovals) {
                        onNavigateToApprovals();
                        setShowNotifications(false);
                      }
                    }}
                    className={`p-2 rounded text-left cursor-pointer transition-colors ${
                      n.unread
                        ? 'bg-surface-container border border-surface-container-highest'
                        : 'hover:bg-surface-container/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-on-surface leading-tight">
                        {n.title}
                      </span>
                      <span className="text-[10px] font-mono text-outline shrink-0 ml-1">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="relative pl-1">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="text-[11px] font-mono text-on-surface font-medium leading-none">
                Elena Vance
              </span>
              <span className="text-[10px] font-mono text-primary font-semibold mt-0.5 leading-none">
                ORG_ADMIN
              </span>
            </div>
            <img
              alt="Elena Vance Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-primary-container"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrZrs3wjqMNSPIRBIDQp9fCwpzTcpZhWOHJtx7ThNUkSwSufxX3JJ6OsMNX9N2qDkK-defLnATYBSKvjRTRLzISHRO912mk0K6crkZKyVJBlJfMTscIrN42mUOkgcg3Z9Q5bPJoNcon_2RVSoItuyHHXFw1dACY4Anzmykj63cJadde8p42sm1RbEZekSvdnPsRp7ao_9lJbW_RoevdjTemfN6JEU3hqhAqZe3sRfJpz4aQJWjpJPz"
            />
          </div>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-56 bg-surface-container-high border border-surface-container-highest rounded-lg shadow-2xl p-2 z-50">
              <div className="p-2 border-b border-surface-container-highest/40 mb-1">
                <p className="text-xs font-semibold text-on-surface">Elena Vance</p>
                <p className="text-[10px] font-mono text-outline truncate">
                  elena.vance@acmecloud.systems
                </p>
                <span className="inline-block mt-1 text-[9px] font-mono bg-primary-container/20 text-primary-fixed px-1.5 py-0.5 rounded">
                  Hardware Security Key Active (FIDO2)
                </span>
              </div>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-2 py-1.5 text-xs text-on-surface hover:bg-surface-container rounded"
              >
                Security Credentials &amp; Keys
              </button>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-2 py-1.5 text-xs text-on-surface hover:bg-surface-container rounded"
              >
                Audit Session Logs
              </button>
              <div className="h-px bg-surface-container-highest my-1"></div>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-2 py-1.5 text-xs text-error hover:bg-error-container/20 rounded"
              >
                Lock Admin Console
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
