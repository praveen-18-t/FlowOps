import React from 'react';

export const ProjectsMilestonesView: React.FC<{ onNavigateToFsm: () => void }> = ({
  onNavigateToFsm,
}) => {
  const milestones = [
    {
      version: 'v2.4.1',
      title: 'Current Production Release (Active & Enforcing)',
      status: 'Live',
      date: 'Published today',
      pipelines: ['ci-cd-prod-gate-fsm.v3', 'canary-traffic-allocator.v2'],
      health: '100% Passing',
    },
    {
      version: 'v2.5.0-RC1',
      title: 'Next Gen FSM State Machine Orchestrator',
      status: 'In Review',
      date: 'Target: Next Sprint',
      pipelines: ['ci-cd-prod-gate-fsm.v3', 'multi-region-failover.v1'],
      health: 'Awaiting Quorum Sign-off',
    },
    {
      version: 'v3.0.0-Beta',
      title: 'Global Multi-Region Distributed Consensus',
      status: 'Planning',
      date: 'Q4 2026',
      pipelines: ['raft-consensus-quorum.v1'],
      health: 'Specification Drafted',
    },
  ];

  return (
    <div className="flex flex-col w-full p-6 max-w-7xl mx-auto gap-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
        <div>
          <h1 className="text-xl font-semibold text-on-surface">
            Projects &amp; Release Milestones
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Tracking CI/CD production release trains, canary deployments, and finite state gateways.
          </p>
        </div>

        <button
          onClick={onNavigateToFsm}
          className="px-3 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-xs rounded flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">account_tree</span>
          <span className="font-mono">Open Active FSM</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {milestones.map((m) => (
          <div
            key={m.version}
            className="p-5 bg-surface-container-low rounded-xl border border-surface-container-highest/30 flex flex-col gap-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-primary-fixed bg-surface-container px-2 py-0.5 rounded">
                  {m.version}
                </span>
                <h3 className="text-base font-semibold text-on-surface">{m.title}</h3>
              </div>
              <span
                className={`text-xs font-mono px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  m.status === 'Live'
                    ? 'bg-secondary-container/20 text-secondary'
                    : m.status === 'In Review'
                    ? 'bg-tertiary-container/20 text-tertiary'
                    : 'bg-surface-container text-outline'
                }`}
              >
                {m.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-on-surface-variant font-mono pt-2 border-t border-surface-container-highest/20">
              <div className="flex items-center gap-4">
                <span>Associated Workflows: {m.pipelines.join(', ')}</span>
                <span>·</span>
                <span className="text-secondary">{m.health}</span>
              </div>
              <span className="text-outline">{m.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
