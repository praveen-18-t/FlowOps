import React, { useState } from 'react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: string;
  onPublish: (newVersion: string, changelog: string) => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  currentVersion,
  onPublish,
}) => {
  const [versionBump, setVersionBump] = useState<'patch' | 'minor' | 'major'>('patch');
  const [changelog, setChangelog] = useState('Enforce strict 2-of-3 executive quorum and update Canary dwell SLA.');
  const [targetGateway, setTargetGateway] = useState('ci-cd-prod-gate-fsm.v3');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const getNextVersion = () => {
    const parts = currentVersion.replace('v', '').split('.').map(Number);
    if (versionBump === 'patch') parts[2] += 1;
    if (versionBump === 'minor') { parts[1] += 1; parts[2] = 0; }
    if (versionBump === 'major') { parts[0] += 1; parts[1] = 0; parts[2] = 0; }
    return `v${parts.join('.')}`;
  };

  const nextVer = getNextVersion();

  const handleCommitPublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onPublish(nextVer, changelog);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-high border border-surface-container-highest rounded-xl shadow-2xl max-w-md w-full p-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">
              rocket_launch
            </span>
            <h3 className="text-base font-semibold text-on-surface">
              Publish FSM to Production Gateway
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-mono uppercase text-outline">
              Target Gateway Identifier
            </label>
            <input
              type="text"
              value={targetGateway}
              onChange={(e) => setTargetGateway(e.target.value)}
              className="mt-1 w-full bg-surface-container-low p-2 rounded text-xs font-mono text-on-surface border border-surface-container-highest/40 focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-outline">
              Version Increment
            </label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(['patch', 'minor', 'major'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVersionBump(type)}
                  className={`py-1.5 text-xs font-mono rounded capitalize transition-colors ${
                    versionBump === type
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'bg-surface-container text-outline hover:text-on-surface'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs font-mono text-secondary flex items-center justify-between px-1">
              <span>Current: {currentVersion}</span>
              <span>Next Target: <strong>{nextVer}</strong></span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-outline">
              Changelog &amp; Audit Note
            </label>
            <textarea
              rows={3}
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              className="mt-1 w-full bg-surface-container-low p-2 rounded text-xs text-on-surface border border-surface-container-highest/40 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="p-2.5 bg-surface-container rounded text-[11px] font-mono text-outline-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-sm">lock</span>
            <span>Cryptographically sealed by Elena Vance (ORG_ADMIN).</span>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs font-medium rounded transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleCommitPublish}
            className="px-4 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-xs rounded transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">
              {isSubmitting ? 'autorenew' : 'publish'}
            </span>
            <span>{isSubmitting ? 'Deploying...' : `Publish ${nextVer}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
