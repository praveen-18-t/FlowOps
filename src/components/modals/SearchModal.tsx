import React, { useState, useEffect } from 'react';
import { ActiveNavPath, FsmNode } from '../../types/fsm';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: ActiveNavPath) => void;
  onSelectNode: (nodeId: string) => void;
  nodes: FsmNode[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onSelectNode,
  nodes,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks: { title: string; category: string; icon: string; action: () => void }[] = [
    {
      title: 'Workflow State Machines (Visual Canvas)',
      category: 'Workspaces',
      icon: 'account_tree',
      action: () => {
        onNavigate('workflow-state-machines');
        onClose();
      },
    },
    {
      title: 'Operations Dashboard & Workflow Monitor',
      category: 'Workspaces',
      icon: 'monitoring',
      action: () => {
        onNavigate('operations-dashboard-workflow-monitor');
        onClose();
      },
    },
    {
      title: 'Multi-Stage Approvals & Executive Quorum',
      category: 'Approvals',
      icon: 'fact_check',
      action: () => {
        onNavigate('multi-stage-approvals');
        onClose();
      },
    },
    {
      title: 'Task Engine & Celery Worker Board',
      category: 'Workers',
      icon: 'view_kanban',
      action: () => {
        onNavigate('task-engine-kanban');
        onClose();
      },
    },
    {
      title: 'Event Automations & CEL Evaluators',
      category: 'Automations',
      icon: 'bolt',
      action: () => {
        onNavigate('event-automations');
        onClose();
      },
    },
    {
      title: 'Developer API Keys & Webhooks',
      category: 'Developer',
      icon: 'webhook',
      action: () => {
        onNavigate('developer-api-webhooks');
        onClose();
      },
    },
    {
      title: 'Tenancy & RBAC Security Settings',
      category: 'Security',
      icon: 'admin_panel_settings',
      action: () => {
        onNavigate('tenancy-rbac-settings');
        onClose();
      },
    },
  ];

  const nodeResults = nodes.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      n.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      n.id.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLinks = quickLinks.filter(
    (l) =>
      l.title.toLowerCase().includes(query.toLowerCase()) ||
      l.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4">
      <div className="bg-surface-container-high border border-surface-container-highest rounded-xl shadow-2xl max-w-xl w-full p-3 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center gap-2.5 px-3 py-2 bg-surface-container rounded-lg border border-surface-container-highest/40 text-outline focus-within:text-on-surface">
          <span className="material-symbols-outlined text-lg">search</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search screens, FSM nodes, Celery workers, approvals..."
            className="w-full bg-transparent text-sm text-on-surface focus:outline-none placeholder:text-outline font-normal"
          />
          <span className="text-[10px] font-mono bg-surface-container-high px-1.5 py-0.5 rounded text-outline">
            ESC
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-3 max-h-80 overflow-y-auto px-1">
          {/* FSM Canvas Nodes */}
          {nodeResults.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-outline px-2">
                FSM Canvas Nodes ({nodeResults.length})
              </span>
              {nodeResults.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    onNavigate('workflow-state-machines');
                    onSelectNode(n.id);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-sm text-primary">
                      {n.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface">
                        {n.title}
                      </span>
                      <span className="text-[10px] font-mono text-outline">
                        {n.code} · {n.subtitle}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-surface-container-high px-1.5 py-0.5 rounded text-outline">
                    #{n.id}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Quick Navigation Links */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-outline px-2">
              Workspaces &amp; Screens
            </span>
            {filteredLinks.map((link) => (
              <div
                key={link.title}
                onClick={link.action}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-sm text-secondary">
                    {link.icon}
                  </span>
                  <span className="text-xs text-on-surface font-medium">
                    {link.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-outline">
                  {link.category}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
