import React, { useState } from 'react';

interface OperationsDashboardViewProps {
  onNavigateToFsm: () => void;
  onNavigateToApprovals: () => void;
}

export const OperationsDashboardView: React.FC<OperationsDashboardViewProps> = ({
  onNavigateToFsm,
  onNavigateToApprovals,
}) => {
  const [filter, setFilter] = useState<'all' | 'running' | 'waiting' | 'failed'>('all');

  const runs = [
    {
      id: 'run-9821',
      workflow: 'ci-cd-prod-gate-fsm.v3',
      commit: '7b8c2e1',
      branch: 'main',
      trigger: 'git.push (Elena Vance)',
      stage: 'Exec Multi-Stage Sign-Off (S3 Gate)',
      status: 'waiting_approval',
      duration: '18m 42s',
      slaRemaining: '1h 14m left',
    },
    {
      id: 'run-9820',
      workflow: 'auth-token-rotation.v1',
      commit: '4f19aa0',
      branch: 'release/v2.4.1',
      trigger: 'cron (hourly)',
      stage: 'Production Live (S_DONE)',
      status: 'completed',
      duration: '4m 12s',
      slaRemaining: 'Met',
    },
    {
      id: 'run-9819',
      workflow: 'billing-ledger-audit.v2',
      commit: 'e921bc4',
      branch: 'main',
      trigger: 'celery.worker',
      stage: 'Static SAST Scan (S1)',
      status: 'running',
      duration: '1m 20s',
      slaRemaining: '28m left',
    },
    {
      id: 'run-9818',
      workflow: 'ci-cd-prod-gate-fsm.v3',
      commit: '33a901f',
      branch: 'feat/vault-sync',
      trigger: 'git.push',
      stage: 'Security Reject (Dead Letter DLQ)',
      status: 'failed',
      duration: '54s',
      slaRemaining: 'Breached',
    },
  ];

  const filteredRuns = runs.filter((r) => {
    if (filter === 'running') return r.status === 'running';
    if (filter === 'waiting') return r.status === 'waiting_approval';
    if (filter === 'failed') return r.status === 'failed';
    return true;
  });

  return (
    <div className="flex flex-col w-full p-6 max-w-7xl mx-auto gap-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
        <div>
          <h1 className="text-xl font-semibold text-on-surface">
            Operations Dashboard &amp; Workflow Monitor
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Real-time finite state machine execution telemetry, Celery worker cluster metrics, and live gating.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToApprovals}
            className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono rounded flex items-center gap-1.5 border border-surface-container-highest/40"
          >
            <span className="material-symbols-outlined text-sm text-tertiary">how_to_reg</span>
            <span>Approvals Queue (1)</span>
          </button>
          <button
            onClick={onNavigateToFsm}
            className="px-3 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-xs rounded flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">account_tree</span>
            <span className="font-mono">Open FSM Visual Studio</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-container-low rounded-lg border border-surface-container-highest/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-[11px] font-mono uppercase">
            <span>Operational SLA</span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-mono font-bold text-secondary">99.98%</span>
            <span className="text-[10px] font-mono text-outline block mt-0.5">Target: &ge;99.95%</span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded overflow-hidden">
            <div className="bg-secondary h-full" style={{ width: '99.98%' }}></div>
          </div>
        </div>

        <div className="p-4 bg-surface-container-low rounded-lg border border-surface-container-highest/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-[11px] font-mono uppercase">
            <span>Celery Nodes</span>
            <span className="material-symbols-outlined text-secondary text-sm">dns</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-mono font-bold text-on-surface">12 / 12</span>
            <span className="text-[10px] font-mono text-secondary block mt-0.5">100% Health Status</span>
          </div>
          <span className="text-[10px] font-mono text-outline">Cluster Latency: 42ms</span>
        </div>

        <div className="p-4 bg-surface-container-low rounded-lg border border-surface-container-highest/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-[11px] font-mono uppercase">
            <span>24h FSM Dispatches</span>
            <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-mono font-bold text-on-surface">34,180</span>
            <span className="text-[10px] font-mono text-primary-fixed block mt-0.5">+14% vs 7d avg</span>
          </div>
          <span className="text-[10px] font-mono text-outline">Mean transition: 240ms</span>
        </div>

        <div className="p-4 bg-surface-container-low rounded-lg border border-surface-container-highest/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-outline text-[11px] font-mono uppercase">
            <span>Pending Gates</span>
            <span className="material-symbols-outlined text-tertiary text-sm">pending_actions</span>
          </div>
          <div className="my-2">
            <span className="text-2xl font-mono font-bold text-tertiary">1 Gate</span>
            <span className="text-[10px] font-mono text-tertiary block mt-0.5">ci-cd-prod-gate-fsm.v3</span>
          </div>
          <span className="text-[10px] font-mono text-outline">SLA Timer: 1h 14m left</span>
        </div>
      </div>

      {/* Active Pipeline Executions Table */}
      <div className="bg-surface-container-low rounded-lg border border-surface-container-highest/30 overflow-hidden">
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-surface-container-highest/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">sync_saved_locally</span>
            <h2 className="text-sm font-semibold text-on-surface">
              Live Pipeline State Machine Runs
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg">
            {(['all', 'running', 'waiting', 'failed'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded text-xs font-mono capitalize transition-colors ${
                  filter === t
                    ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-container text-outline text-[10px] font-mono uppercase border-b border-surface-container-highest/30">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Execution ID</th>
                <th className="py-2.5 px-4 font-semibold">Workflow Machine</th>
                <th className="py-2.5 px-4 font-semibold">Commit / Trigger</th>
                <th className="py-2.5 px-4 font-semibold">Current State</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">SLA Window</th>
                <th className="py-2.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest/20 font-mono">
              {filteredRuns.map((run) => (
                <tr key={run.id} className="hover:bg-surface-container/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-primary-fixed">{run.id}</td>
                  <td className="py-3 px-4 text-on-surface font-sans font-medium">{run.workflow}</td>
                  <td className="py-3 px-4 text-outline">
                    <span className="text-on-surface-variant font-mono">{run.commit}</span> ({run.branch})
                  </td>
                  <td className="py-3 px-4 text-on-surface font-sans">{run.stage}</td>
                  <td className="py-3 px-4">
                    {run.status === 'waiting_approval' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-tertiary-container/20 text-tertiary text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                        AWAITING SIGN-OFF
                      </span>
                    )}
                    {run.status === 'completed' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-secondary-container/20 text-secondary text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[12px]">check</span>
                        SUCCESS LIVE
                      </span>
                    )}
                    {run.status === 'running' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-primary-container/20 text-primary-fixed text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                        IN PROGRESS
                      </span>
                    )}
                    {run.status === 'failed' && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-error-container/20 text-error text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[12px]">block</span>
                        DLQ QUARANTINE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant text-[11px]">{run.slaRemaining}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={onNavigateToFsm}
                      className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded text-[11px] transition-colors"
                    >
                      Inspect FSM
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
