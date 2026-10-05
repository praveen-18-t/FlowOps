import React, { useState } from 'react';
import { ActiveNavPath } from '../types/fsm';
import { TENANTS } from '../data/mockData';

interface SidebarProps {
  activePath: ActiveNavPath;
  onNavigate: (path: ActiveNavPath) => void;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePath,
  onNavigate,
  onOpenSettings,
}) => {
  const [selectedTenant, setSelectedTenant] = useState(TENANTS[0]);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);

  const navItems: { path: ActiveNavPath; label: string; icon: string; badge?: string }[] = [
    {
      path: 'operations-dashboard-workflow-monitor',
      label: 'Operations Dashboard & Workflow Monitor',
      icon: 'monitoring',
    },
    {
      path: 'projects-milestones',
      label: 'Projects & Milestones',
      icon: 'flag',
    },
    {
      path: 'task-engine-kanban',
      label: 'Task Engine & Kanban',
      icon: 'view_kanban',
    },
    {
      path: 'workflow-state-machines',
      label: 'Workflow State Machines',
      icon: 'account_tree',
    },
    {
      path: 'multi-stage-approvals',
      label: 'Multi-Stage Approvals',
      icon: 'fact_check',
      badge: '1 Pending',
    },
    {
      path: 'event-automations',
      label: 'Event Automations',
      icon: 'bolt',
    },
    {
      path: 'developer-api-webhooks',
      label: 'Developer API & Webhooks',
      icon: 'webhook',
    },
    {
      path: 'tenancy-rbac-settings',
      label: 'Tenancy & RBAC Settings',
      icon: 'admin_panel_settings',
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container-high/40">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between bg-surface-container-lowest/50 border-b border-surface-container-high/30">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('workflow-state-machines')}
          >
            <img
              alt="FlowOps Brand Icon"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VjywN7HXKtiEkmpHoMHwGt83EOJrty37cd-wAdg5kZz6VA_9dwnWflzdpMiMiEv4scKjopJC7Wux8p38H4eZOxNf5uvU0347-_9Gug1rJX_ZFBSRN42_c6VX1_lQUaqwr9gzGNu0vCejNnmovsFZUq9JI4Eg7HEqZqJ9cH6PmWPIp0p2qTUfJlKw9mOyqYyuj1MQ25-Ra4wYRQap5Kpx1DPEg3Wf0Yb0Wo1fEyN63Bx-LOt70rRaXhsQ"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold text-on-surface tracking-tight leading-tight">
                FlowOps
              </span>
              <span className="text-[10px] font-mono text-primary uppercase tracking-wider font-semibold">
                Enterprise
              </span>
            </div>
          </div>
          <button
            onClick={onOpenSettings}
            title="Configure System"
            className="text-outline cursor-pointer hover:text-on-surface transition-colors p-1 rounded hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-lg">tune</span>
          </button>
        </div>

        {/* Tenant Switcher */}
        <div className="p-2 relative">
          <div
            onClick={() => setShowTenantDropdown(!showTenantDropdown)}
            className="bg-surface-container rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors border border-surface-container-highest/40"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="material-symbols-outlined text-secondary text-sm">
                domain
              </span>
              <div className="flex flex-col truncate">
                <span className="text-[11px] font-mono text-on-surface truncate font-medium">
                  {selectedTenant.name}
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant truncate">
                  {selectedTenant.region}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline text-sm">
              unfold_more
            </span>
          </div>

          {/* Tenant Dropdown Menu */}
          {showTenantDropdown && (
            <div className="absolute left-2 right-2 top-14 bg-surface-container-high border border-surface-container-highest rounded-lg shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono text-outline uppercase tracking-wider">
                Select Tenant Organization
              </div>
              {TENANTS.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTenant(t);
                    setShowTenantDropdown(false);
                  }}
                  className={`px-3 py-2 flex items-center justify-between text-xs cursor-pointer hover:bg-surface-container transition-colors ${
                    selectedTenant.id === t.id
                      ? 'bg-surface-container text-primary font-medium'
                      : 'text-on-surface-variant'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-mono text-[11px]">{t.name}</span>
                    <span className="text-[10px] text-outline">{t.region}</span>
                  </div>
                  {selectedTenant.id === t.id && (
                    <span className="material-symbols-outlined text-xs text-primary">
                      check
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Label */}
        <div className="px-3 py-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-outline">
            Workspaces &amp; Automation
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col px-2 gap-1 mt-1">
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_1px_8px_rgba(0,0,0,0.04)]'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span
                    className={`material-symbols-outlined text-lg shrink-0 ${
                      isActive ? 'text-on-primary-container' : 'text-outline'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[13px] truncate leading-tight">
                    {item.label}
                  </span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-bold shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Status Box */}
      <div className="p-2 bg-surface-container-lowest/40 border-t border-surface-container-high/30">
        <div className="bg-surface-container rounded-lg p-2.5 flex items-center justify-between border border-surface-container-highest/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-on-surface font-medium">
                Celery Cluster
              </span>
              <span className="text-[10px] font-mono text-secondary">
                12/12 Nodes Up
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-outline">42ms</span>
        </div>
      </div>
    </aside>
  );
};
