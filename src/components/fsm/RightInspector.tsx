import React, { useState } from 'react';
import { FsmNode } from '../../types/fsm';

interface RightInspectorProps {
  selectedNode: FsmNode | null;
  onUpdateNode: (updated: FsmNode) => void;
  onTriggerDryRun: () => void;
  onDeleteNode?: (nodeId: string) => void;
}

export const RightInspector: React.FC<RightInspectorProps> = ({
  selectedNode,
  onUpdateNode,
  onTriggerDryRun,
  onDeleteNode,
}) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'approvers' | 'telemetry' | 'json'>('rules');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!selectedNode) {
    return (
      <div className="col-span-12 md:col-span-12 xl:col-span-3 bg-surface-container-low flex flex-col h-full items-center justify-center p-6 text-center border-l border-surface-container-high/40">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">
          touch_app
        </span>
        <h3 className="text-sm font-semibold text-on-surface">No Node Selected</h3>
        <p className="text-xs text-on-surface-variant mt-1">
          Click any state node or guard gate on the canvas to configure transition rules, approvers, and hooks.
        </p>
      </div>
    );
  }

  const approversConfig = selectedNode.approversConfig || {
    requiredCount: 2,
    totalCount: 3,
    signedCount: 1,
    roles: [
      { id: 'secops', name: 'SecOps Lead', status: 'signed' as const, signedBy: 'Elena Vance', time: '14m ago' },
      { id: 'vpeng', name: 'VP Engineering', status: 'pending' as const },
      { id: 'finance', name: 'Finance Admin', status: 'required' as const },
    ],
    slaBreachAction: 'Escalate to CFO if > 4.0h',
  };

  const handleRequiredCountChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(approversConfig.totalCount, approversConfig.requiredCount + delta));
    onUpdateNode({
      ...selectedNode,
      badgeRight: `${newCount}/${approversConfig.totalCount} Sig`,
      approversConfig: {
        ...approversConfig,
        requiredCount: newCount,
      },
    });
  };

  const handleToggleRole = (roleId: string) => {
    const updatedRoles = approversConfig.roles.map((r) => {
      if (r.id === roleId) {
        const nextStatus: 'signed' | 'pending' | 'required' =
          r.status === 'signed' ? 'pending' : r.status === 'pending' ? 'required' : 'signed';
        return { ...r, status: nextStatus };
      }
      return r;
    });
    const signedCount = updatedRoles.filter((r) => r.status === 'signed').length;
    onUpdateNode({
      ...selectedNode,
      approversConfig: {
        ...approversConfig,
        signedCount,
        roles: updatedRoles,
      },
    });
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="col-span-12 md:col-span-12 xl:col-span-3 bg-surface-container-low flex flex-col h-full overflow-y-auto border-l border-surface-container-high/40">
      {/* Node Inspector Header */}
      <div className="p-4 bg-surface-container-lowest flex flex-col gap-1 sticky top-0 z-20 shadow-sm border-b border-surface-container-high/30">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
            Node Inspector
          </span>
          <span className="text-[10px] font-mono bg-surface-container-high text-outline px-1.5 py-0.5 rounded">
            #{selectedNode.id}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={selectedNode.title}
            onChange={(e) => onUpdateNode({ ...selectedNode, title: e.target.value })}
            className="text-lg font-semibold text-on-surface bg-transparent focus:outline-none focus:border-b focus:border-primary w-full truncate mr-2"
          />
          {onDeleteNode && (
            <button
              onClick={() => onDeleteNode(selectedNode.id)}
              className="text-outline hover:text-error transition-colors p-1"
              title="Delete this node from canvas"
            >
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          )}
        </div>
        <span className="text-[11px] text-on-surface-variant truncate">
          Type: {selectedNode.type === 'quorum_gate'
            ? 'Finite State Machine Gate with Multi-Sig Quorum'
            : selectedNode.type === 'guard'
            ? 'CEL Predicate Guard Gate'
            : selectedNode.type === 'initial'
            ? 'Entrypoint Webhook Trigger Node'
            : selectedNode.type === 'terminal'
            ? 'Immutable Terminal State'
            : selectedNode.type === 'dead_letter'
            ? 'Quarantine Triage Dead Letter Queue'
            : 'Synchronous Async Execution Node'}
        </span>
      </div>

      {/* Config Tab Bar */}
      <div className="flex items-center bg-surface-container-lowest px-4 border-b border-surface-container-high/30">
        <button
          onClick={() => setActiveTab('rules')}
          className={`py-2 text-[11px] font-mono font-medium transition-colors border-b-2 mr-4 ${
            activeTab === 'rules'
              ? 'border-primary text-on-surface font-semibold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Rules &amp; Logic
        </button>
        <button
          onClick={() => setActiveTab('approvers')}
          className={`py-2 text-[11px] font-mono font-medium transition-colors border-b-2 mr-4 ${
            activeTab === 'approvers'
              ? 'border-primary text-on-surface font-semibold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Approvers
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`py-2 text-[11px] font-mono font-medium transition-colors border-b-2 mr-4 ${
            activeTab === 'telemetry'
              ? 'border-primary text-on-surface font-semibold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Telemetry
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`py-2 text-[11px] font-mono font-medium transition-colors border-b-2 ${
            activeTab === 'json'
              ? 'border-primary text-on-surface font-semibold'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Raw JSON
        </button>
      </div>

      {/* Tab 1: Rules & Logic */}
      {activeTab === 'rules' && (
        <div className="flex flex-col gap-4 p-4">
          {/* Approvals Quorum Matrix */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-wider text-outline font-semibold">
                Approvals Quorum
              </label>
              <span className="text-[10px] font-mono text-secondary">
                Status: {approversConfig.signedCount} of {approversConfig.totalCount} signed
              </span>
            </div>
            <div className="bg-surface-container p-3 rounded-lg flex flex-col gap-2.5 border border-surface-container-highest/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface">Required Signatures</span>
                <div className="flex items-center bg-surface-container-low rounded p-1 gap-1 border border-surface-container-highest/30">
                  <button
                    onClick={() => handleRequiredCountChange(-1)}
                    className="p-1 hover:bg-surface-container rounded text-outline hover:text-on-surface flex items-center"
                  >
                    <span className="material-symbols-outlined text-xs">remove</span>
                  </button>
                  <span className="text-xs font-mono font-bold text-on-surface px-1.5">
                    {approversConfig.requiredCount} of {approversConfig.totalCount}
                  </span>
                  <button
                    onClick={() => handleRequiredCountChange(1)}
                    className="p-1 hover:bg-surface-container rounded text-outline hover:text-on-surface flex items-center"
                  >
                    <span className="material-symbols-outlined text-xs">add</span>
                  </button>
                </div>
              </div>

              {/* Approver Tags */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-on-surface-variant">
                  Required Roles: (click to toggle state)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {approversConfig.roles.map((r) => {
                    const isSigned = r.status === 'signed';
                    const isPending = r.status === 'pending';
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleToggleRole(r.id)}
                        className={`inline-flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded transition-all cursor-pointer ${
                          isSigned
                            ? 'bg-secondary-container/20 text-secondary border border-secondary/30'
                            : isPending
                            ? 'bg-tertiary-container/20 text-tertiary border border-tertiary/30'
                            : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-surface-container-highest'
                        }`}
                      >
                        {isSigned ? (
                          <span className="material-symbols-outlined text-[12px]">check</span>
                        ) : isPending ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                        )}
                        <span>{r.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SLA Escalation policy */}
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-[10px] font-mono text-outline">SLA Breach Escalation:</span>
                <select
                  value={approversConfig.slaBreachAction}
                  onChange={(e) =>
                    onUpdateNode({
                      ...selectedNode,
                      approversConfig: {
                        ...approversConfig,
                        slaBreachAction: e.target.value,
                      },
                    })
                  }
                  className="bg-surface-container-low p-2 rounded text-on-surface text-xs border border-surface-container-highest/40 focus:outline-none focus:border-primary"
                >
                  <option value="Escalate to CFO if > 4.0h">Escalate to CFO if &gt; 4.0h</option>
                  <option value="Auto-Rollback to Previous Safe Build">Auto-Rollback to Previous Safe Build</option>
                  <option value="Trigger P1 PagerDuty & Slack Incident Channel">Trigger P1 PagerDuty &amp; Slack Incident Channel</option>
                </select>
              </div>
            </div>
          </div>

          {/* Transition Guard Rules */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-mono uppercase tracking-wider text-outline font-semibold">
                Transition Guard Rules
              </label>
              <span className="text-[10px] font-mono text-primary-fixed-dim">Engine: FSM v2</span>
            </div>

            {/* Rule 1: Success path */}
            <div className="bg-surface-container p-3 rounded-lg flex flex-col gap-1.5 border border-surface-container-highest/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-secondary font-semibold uppercase">
                  Rule #1: Success Forward
                </span>
                <span className="material-symbols-outlined text-secondary text-xs">verified</span>
              </div>
              <textarea
                rows={3}
                value={
                  selectedNode.transitionRules?.[0]?.condition ||
                  `WHEN state == 'PENDING_APPROVAL'\nIF signature_count >= 2\n→ TRANSITION TO 'S4_CANARY'`
                }
                onChange={(e) => {
                  const updatedRules = [...(selectedNode.transitionRules || [])];
                  if (updatedRules[0]) {
                    updatedRules[0].condition = e.target.value;
                  }
                  onUpdateNode({ ...selectedNode, transitionRules: updatedRules });
                }}
                className="text-[11px] font-mono text-on-surface bg-surface-container-lowest p-2 rounded border border-surface-container-highest/30 focus:outline-none focus:border-primary resize-none"
              />
            </div>

            {/* Rule 2: Rejection or Breach path */}
            <div className="bg-surface-container p-3 rounded-lg flex flex-col gap-1.5 border border-surface-container-highest/20">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-error font-semibold uppercase">
                  Rule #2: Fail / Escalation
                </span>
                <span className="material-symbols-outlined text-error text-xs">warning</span>
              </div>
              <textarea
                rows={2}
                value={
                  selectedNode.transitionRules?.[1]?.condition ||
                  `WHEN status == 'REJECTED' || timeout > 4h\n→ TRANSITION TO 'S_ROLLBACK_DLQ'`
                }
                onChange={(e) => {
                  const updatedRules = [...(selectedNode.transitionRules || [])];
                  if (updatedRules[1]) {
                    updatedRules[1].condition = e.target.value;
                  }
                  onUpdateNode({ ...selectedNode, transitionRules: updatedRules });
                }}
                className="text-[11px] font-mono text-on-surface bg-surface-container-lowest p-2 rounded border border-surface-container-highest/30 focus:outline-none focus:border-primary resize-none"
              />
            </div>
          </div>

          {/* Automated Event Hooks */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-outline font-semibold">
              Automated Event Hooks
            </label>
            <div className="bg-surface-container p-3 rounded-lg flex flex-col gap-2.5 border border-surface-container-highest/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">arrow_forward</span>
                  <span className="text-xs text-on-surface">On Entry Action</span>
                </div>
                <input
                  type="text"
                  value={selectedNode.hooks?.onEntry || 'Slack DM Notify'}
                  onChange={(e) =>
                    onUpdateNode({
                      ...selectedNode,
                      hooks: { ...(selectedNode.hooks || { onEntry: '', onExit: '', onTimeout: '' }), onEntry: e.target.value },
                    })
                  }
                  className="text-[11px] font-mono text-on-surface text-right bg-transparent border-b border-surface-container-highest focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-secondary">output</span>
                  <span className="text-xs text-on-surface">On Exit Action</span>
                </div>
                <input
                  type="text"
                  value={selectedNode.hooks?.onExit || 'Emit audit.receipt'}
                  onChange={(e) =>
                    onUpdateNode({
                      ...selectedNode,
                      hooks: { ...(selectedNode.hooks || { onEntry: '', onExit: '', onTimeout: '' }), onExit: e.target.value },
                    })
                  }
                  className="text-[11px] font-mono text-on-surface text-right bg-transparent border-b border-surface-container-highest focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-error">alarm_on</span>
                  <span className="text-xs text-on-surface">On Timeout Action</span>
                </div>
                <input
                  type="text"
                  value={selectedNode.hooks?.onTimeout || 'Trigger P1 PagerDuty'}
                  onChange={(e) =>
                    onUpdateNode({
                      ...selectedNode,
                      hooks: { ...(selectedNode.hooks || { onEntry: '', onExit: '', onTimeout: '' }), onTimeout: e.target.value },
                    })
                  }
                  className="text-[11px] font-mono text-error text-right bg-transparent border-b border-surface-container-highest focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Approvers Details */}
      {activeTab === 'approvers' && (
        <div className="flex flex-col gap-3 p-4">
          <div className="p-3 bg-surface-container rounded-lg border border-surface-container-highest/20">
            <h4 className="text-xs font-semibold text-on-surface mb-1">
              Active Executive Quorum Policy
            </h4>
            <p className="text-[11px] text-on-surface-variant">
              Transactions reaching this state require cryptographic sign-offs from authorized engineering leadership prior to proceeding into canary rollout.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {approversConfig.roles.map((role) => (
              <div
                key={role.id}
                className="p-3 bg-surface-container rounded-lg border border-surface-container-highest/30 flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface">{role.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      role.status === 'signed'
                        ? 'bg-secondary-container/20 text-secondary'
                        : role.status === 'pending'
                        ? 'bg-tertiary-container/20 text-tertiary'
                        : 'bg-surface-container-high text-outline'
                    }`}
                  >
                    {role.status.toUpperCase()}
                  </span>
                </div>
                {role.signedBy && (
                  <div className="text-[10px] font-mono text-outline flex items-center justify-between">
                    <span>Signer: {role.signedBy}</span>
                    {role.time && <span>{role.time}</span>}
                  </div>
                )}
                {role.status === 'pending' && (
                  <button
                    onClick={() => handleToggleRole(role.id)}
                    className="mt-1 w-full py-1 bg-primary text-on-primary text-[11px] font-mono font-medium rounded hover:bg-primary-fixed transition-colors"
                  >
                    Sign Off as Current Admin
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Telemetry */}
      {activeTab === 'telemetry' && (
        <div className="flex flex-col gap-3 p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-surface-container rounded border border-surface-container-highest/30">
              <span className="text-[10px] font-mono text-outline uppercase">24h Executions</span>
              <p className="text-lg font-mono font-bold text-on-surface mt-0.5">
                {selectedNode.telemetry?.executions24h || '14.8k'}
              </p>
            </div>
            <div className="p-2.5 bg-surface-container rounded border border-surface-container-highest/30">
              <span className="text-[10px] font-mono text-outline uppercase">Error Rate</span>
              <p className="text-lg font-mono font-bold text-secondary mt-0.5">
                {selectedNode.telemetry?.errorRate || '0.00%'}
              </p>
            </div>
            <div className="p-2.5 bg-surface-container rounded border border-surface-container-highest/30">
              <span className="text-[10px] font-mono text-outline uppercase">p95 Latency</span>
              <p className="text-lg font-mono font-bold text-on-surface mt-0.5">
                {selectedNode.telemetry?.p95Latency || '42m'}
              </p>
            </div>
            <div className="p-2.5 bg-surface-container rounded border border-surface-container-highest/30">
              <span className="text-[10px] font-mono text-outline uppercase">Worker Pool</span>
              <p className="text-xs font-mono font-medium text-primary-fixed mt-1 truncate">
                {selectedNode.telemetry?.workersPool || 'quorum_engine'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-surface-container rounded-lg border border-surface-container-highest/20">
            <span className="text-[10px] font-mono text-outline uppercase font-semibold">
              Live Transition Trace Stream
            </span>
            <div className="mt-2 flex flex-col gap-1.5 font-mono text-[10px] text-on-surface-variant max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between text-secondary">
                <span>[12m ago] TRANSITION_SUCCESS</span>
                <span>ev-9820</span>
              </div>
              <p className="text-outline text-[9px]">Quorum reached (2/3 signatures). Transitioned to S4_CANARY.</p>
              <div className="h-px bg-surface-container-highest/40 my-1"></div>
              <div className="flex items-center justify-between text-primary-fixed">
                <span>[36m ago] SIGNATURE_RECORDED</span>
                <span>secops-lead</span>
              </div>
              <p className="text-outline text-[9px]">SHA256: 8f9b...1102 verified via hardware token.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Raw JSON */}
      {activeTab === 'json' && (
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-outline">Node JSON Schema</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(selectedNode, null, 2));
                alert('Copied node JSON to clipboard!');
              }}
              className="text-[10px] font-mono text-primary hover:underline"
            >
              Copy JSON
            </button>
          </div>
          <pre className="p-3 bg-surface-container-lowest rounded border border-surface-container-highest/40 text-[10px] font-mono text-on-surface overflow-x-auto max-h-96">
            {JSON.stringify(selectedNode, null, 2)}
          </pre>
        </div>
      )}

      {/* Sticky Footer Action Panel */}
      <div className="mt-auto flex flex-col gap-2 p-4 border-t border-surface-container-high sticky bottom-0 bg-surface-container-low">
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-2 bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-xs rounded shadow-sm transition-all"
        >
          {saveSuccess ? (
            <>
              <span className="material-symbols-outlined text-sm">check</span>
              <span className="font-mono">Configuration Saved!</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-sm">save</span>
              <span className="font-mono">Save Node Configuration</span>
            </>
          )}
        </button>

        <button
          onClick={onTriggerDryRun}
          className="w-full flex items-center justify-center gap-2 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono rounded transition-colors border border-surface-container-highest/40"
        >
          <span className="material-symbols-outlined text-sm text-tertiary">play_circle</span>
          <span>Evaluate Transition In Dry-Run</span>
        </button>
      </div>
    </div>
  );
};
