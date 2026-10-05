import React, { useState } from 'react';

interface MultiStageApprovalsViewProps {
  onNavigateToFsm: () => void;
}

export const MultiStageApprovalsView: React.FC<MultiStageApprovalsViewProps> = ({
  onNavigateToFsm,
}) => {
  const [approvers, setApprovers] = useState([
    {
      id: 'secops',
      role: 'SecOps Lead',
      assignee: 'Sarah Connor',
      email: 'secops-lead@acmecloud.systems',
      status: 'signed',
      time: '18m ago',
      hash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      method: 'YubiKey FIDO2 (Hardware Token)',
    },
    {
      id: 'vpeng',
      role: 'VP Engineering',
      assignee: 'Elena Vance (Acting Delegate)',
      email: 'elena.vance@acmecloud.systems',
      status: 'pending',
      time: 'Awaiting signature',
      hash: 'Pending signature...',
      method: 'WebAuthn Multi-Factor',
    },
    {
      id: 'finance',
      role: 'Finance Admin',
      assignee: 'Claire Dunphy',
      email: 'claire.dunphy@acmecloud.systems',
      status: 'pending',
      time: 'Awaiting signature',
      hash: 'Pending signature...',
      method: 'Okta Verify Push',
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const signedCount = approvers.filter((a) => a.status === 'signed').length;
  const isQuorumReached = signedCount >= 2;

  const handleSign = (id: string) => {
    setApprovers((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'signed',
              time: 'Just now',
              hash: `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
            }
          : a
      )
    );
    setToastMessage('Cryptographic signature recorded! Quorum threshold updated.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReject = () => {
    alert('Deployment rejected. Workflow state transitioned to Dead Letter Quarantine [DLQ].');
  };

  return (
    <div className="flex flex-col w-full p-6 max-w-7xl mx-auto gap-6 animate-in fade-in duration-200">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="p-3 bg-secondary-container text-on-secondary-container rounded-lg font-mono text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">verified</span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-on-secondary-container">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-primary-container/20 text-primary-fixed px-2 py-0.5 rounded font-semibold">
              GATING DECISION
            </span>
            <span className="text-xs font-mono text-outline">Execution #run-9821</span>
          </div>
          <h1 className="text-xl font-semibold text-on-surface mt-1">
            Exec Multi-Stage Sign-Off (#node_s3_gate)
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Workflow: <span className="text-primary-fixed-dim font-mono">ci-cd-prod-gate-fsm.v3</span> · Triggered by git push to main
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToFsm}
            className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-mono rounded flex items-center gap-1.5 border border-surface-container-highest/40"
          >
            <span className="material-symbols-outlined text-sm">account_tree</span>
            <span>View Canvas Position</span>
          </button>
        </div>
      </div>

      {/* Quorum Summary Banner */}
      <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
        isQuorumReached
          ? 'bg-secondary-container/10 border-secondary/30'
          : 'bg-surface-container-low border-surface-container-highest/40'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            isQuorumReached
              ? 'bg-secondary-container text-on-secondary-container'
              : 'bg-tertiary-container/20 text-tertiary'
          }`}>
            <span className="material-symbols-outlined text-2xl">
              {isQuorumReached ? 'verified' : 'how_to_reg'}
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-on-surface">
                Executive Quorum Status: {signedCount} of 3 Signatures
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                isQuorumReached ? 'bg-secondary text-on-secondary' : 'bg-tertiary-container/30 text-tertiary'
              }`}>
                {isQuorumReached ? 'QUORUM ATTAINED' : 'AWAITING 1 MORE SIGNATURE'}
              </span>
            </div>
            <span className="text-xs text-on-surface-variant mt-0.5">
              Policy Rule: Minimum 2 authorized signatures required to trigger forward transition into <strong className="text-secondary font-mono">S4_CANARY</strong>.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReject}
            className="px-3 py-1.5 bg-surface-container hover:bg-error-container/20 text-error rounded text-xs font-mono transition-colors border border-surface-container-highest/40"
          >
            Reject to DLQ
          </button>
          {isQuorumReached ? (
            <button
              onClick={() => {
                alert('Transitioning to S4 Canary! 10% traffic target dispatch enqueued on K8s cluster.');
                onNavigateToFsm();
              }}
              className="px-4 py-1.5 bg-secondary text-on-secondary font-semibold text-xs font-mono rounded shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">flight_takeoff</span>
              <span>Execute Transition to S4 Canary</span>
            </button>
          ) : (
            <button
              onClick={() => handleSign('vpeng')}
              className="px-4 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-xs font-mono rounded shadow-sm transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">key</span>
              <span>Sign as Elena Vance (VP Delegate)</span>
            </button>
          )}
        </div>
      </div>

      {/* Approvers Roster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {approvers.map((item) => {
          const isSigned = item.status === 'signed';
          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isSigned
                  ? 'bg-surface-container-low border-secondary/30'
                  : 'bg-surface-container-low border-surface-container-highest/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/20">
                  <span className="text-xs font-mono font-semibold text-on-surface">
                    {item.role}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isSigned
                        ? 'bg-secondary-container/20 text-secondary'
                        : 'bg-surface-container-high text-tertiary'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-col gap-1">
                  <span className="text-sm font-semibold text-on-surface">
                    {item.assignee}
                  </span>
                  <span className="text-[11px] font-mono text-outline">
                    {item.email}
                  </span>
                  <span className="text-[10px] font-mono text-outline-variant mt-1">
                    Method: {item.method}
                  </span>
                </div>

                <div className="mt-3 p-2 bg-surface-container-lowest rounded border border-surface-container-highest/20 text-[9px] font-mono text-outline break-all">
                  {item.hash}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-container-highest/20 flex items-center justify-between">
                <span className="text-[10px] font-mono text-outline">{item.time}</span>
                {!isSigned && (
                  <button
                    onClick={() => handleSign(item.id)}
                    className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high text-primary-fixed rounded text-xs font-mono transition-colors"
                  >
                    Sign Role
                  </button>
                )}
                {isSigned && (
                  <span className="material-symbols-outlined text-secondary text-sm">
                    verified
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Audit Log Stream */}
      <div className="bg-surface-container-low rounded-lg border border-surface-container-highest/30 p-4">
        <h3 className="text-xs font-mono uppercase text-outline font-semibold mb-3">
          Immutable Audit Log Trail
        </h3>
        <div className="flex flex-col gap-2 font-mono text-xs text-on-surface-variant">
          <div className="flex items-center justify-between p-2 bg-surface-container rounded">
            <span>[18m ago] Sarah Connor (SecOps Lead) recorded digital signature.</span>
            <span className="text-outline text-[10px]">AUTH_SIG_OK</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-surface-container rounded">
            <span>[22m ago] SAST static scan verified: 0 critical vulnerabilities in repo.</span>
            <span className="text-secondary text-[10px]">SARIF_CLEARED</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-surface-container rounded">
            <span>[24m ago] Webhook trigger deploy.req dispatched from GitHub Enterprise.</span>
            <span className="text-outline text-[10px]">PAYLOAD_INGEST</span>
          </div>
        </div>
      </div>
    </div>
  );
};
