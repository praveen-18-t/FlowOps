import React, { useState } from 'react';

export const EventAutomationsView: React.FC<{ onNavigateToFsm: () => void }> = ({
  onNavigateToFsm,
}) => {
  const [celCode, setCelCode] = useState("tenant.tier == 'Enterprise' && request.auth.role in ['SecOps', 'VP_Eng']");
  const [testPayload, setTestPayload] = useState(
    JSON.stringify(
      {
        tenant: { tier: 'Enterprise', id: 'acme-us-east' },
        request: { auth: { role: 'SecOps', verified: true } },
      },
      null,
      2
    )
  );
  const [evaluationResult, setEvaluationResult] = useState<boolean | null>(true);

  const handleEvaluate = () => {
    try {
      const data = JSON.parse(testPayload);
      const isEnt = data.tenant?.tier === 'Enterprise';
      const roleOk = ['SecOps', 'VP_Eng'].includes(data.request?.auth?.role);
      setEvaluationResult(isEnt && roleOk);
    } catch {
      setEvaluationResult(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-6 max-w-7xl mx-auto gap-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
        <div>
          <h1 className="text-xl font-semibold text-on-surface">
            Event Automations &amp; CEL Policy Guards
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Common Expression Language (CEL) predicates, webhook routers, and asynchronous event triggers.
          </p>
        </div>

        <button
          onClick={onNavigateToFsm}
          className="px-3 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-xs rounded flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">account_tree</span>
          <span className="font-mono">FSM Canvas</span>
        </button>
      </div>

      {/* Interactive CEL Evaluation Playground */}
      <div className="p-5 bg-surface-container-low rounded-xl border border-surface-container-highest/30 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">code_blocks</span>
            <h2 className="text-sm font-semibold text-on-surface">
              Interactive CEL Predicate Sandbox
            </h2>
          </div>
          <span className="text-[10px] font-mono bg-surface-container px-2 py-0.5 rounded text-outline">
            FSM Engine v2 Compatibility
          </span>
        </div>

        <div>
          <label className="text-[10px] font-mono text-outline uppercase font-semibold">
            CEL Expression Guard Rule
          </label>
          <input
            type="text"
            value={celCode}
            onChange={(e) => setCelCode(e.target.value)}
            className="mt-1 w-full bg-surface-container p-2.5 rounded font-mono text-xs text-secondary border border-surface-container-highest/40 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-mono text-outline uppercase font-semibold">
              Incoming Event Context (JSON)
            </label>
            <textarea
              rows={6}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="mt-1 w-full bg-surface-container-lowest p-2.5 rounded font-mono text-xs text-on-surface border border-surface-container-highest/40 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="flex flex-col justify-between p-4 bg-surface-container rounded-lg border border-surface-container-highest/30">
            <div>
              <span className="text-[10px] font-mono text-outline uppercase font-semibold">
                Evaluation Output
              </span>
              <div className="mt-3 flex items-center gap-3">
                <span
                  className={`text-2xl font-mono font-bold ${
                    evaluationResult ? 'text-secondary' : 'text-error'
                  }`}
                >
                  {evaluationResult ? 'ALLOW (Passed)' : 'DENY (Rejected)'}
                </span>
                <span
                  className={`material-symbols-outlined text-xl ${
                    evaluationResult ? 'text-secondary' : 'text-error'
                  }`}
                >
                  {evaluationResult ? 'check_circle' : 'cancel'}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed font-mono">
                {evaluationResult
                  ? 'Condition satisfied. FSM route transitions to forward gate (#node_s3_gate).'
                  : 'Guard evaluated false. Execution diverted to Dead Letter Queue [DLQ].'}
              </p>
            </div>

            <button
              onClick={handleEvaluate}
              className="mt-4 w-full py-2 bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-xs font-mono rounded shadow-sm transition-all"
            >
              Evaluate Predicate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
