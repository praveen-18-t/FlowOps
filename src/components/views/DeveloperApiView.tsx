import React, { useState } from 'react';

export const DeveloperApiView: React.FC<{ onNavigateToFsm: () => void }> = ({
  onNavigateToFsm,
}) => {
  const [apiKey, setApiKey] = useState('flowops_live_sec_99a8b11c0d45f782');
  const [copiedKey, setCopiedKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://api.flowops.internal/v1/fsm/ci-cd-prod-gate-fsm/dispatch');

  const curlSnippet = `curl -X POST "${webhookUrl}" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "deploy.req",
    "git_commit": "7b8c2e1",
    "branch": "main",
    "author": "elena.vance@acmecloud.systems"
  }'`;

  return (
    <div className="flex flex-col w-full p-6 max-w-7xl mx-auto gap-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
        <div>
          <h1 className="text-xl font-semibold text-on-surface">
            Developer API &amp; Webhooks
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Programmatic dispatch APIs, HMAC signature verification, and outbound webhook delivery logs.
          </p>
        </div>

        <button
          onClick={onNavigateToFsm}
          className="px-3 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-xs rounded flex items-center gap-1.5 shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">account_tree</span>
          <span className="font-mono">FSM View</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* API Tokens */}
        <div className="p-5 bg-surface-container-low rounded-xl border border-surface-container-highest/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/20">
              <span className="text-xs font-mono font-semibold text-on-surface">
                Active Ingest API Token
              </span>
              <span className="text-[10px] font-mono bg-secondary-container/20 text-secondary px-2 py-0.5 rounded font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-3">
              Use this bearer secret to trigger FSM transitions via CI/CD pipelines, Git webhooks, and Celery workers.
            </p>
            <div className="mt-3 flex items-center gap-2 bg-surface-container p-2.5 rounded font-mono text-xs border border-surface-container-highest/40">
              <span className="text-on-surface flex-1 truncate">{apiKey}</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(apiKey);
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2000);
                }}
                className="text-primary hover:underline text-[11px]"
              >
                {copiedKey ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-container-highest/20 flex justify-between items-center text-xs font-mono text-outline">
            <span>Last used: 12m ago</span>
            <button
              onClick={() => {
                setApiKey(`flowops_live_sec_${Math.random().toString(36).substring(2, 12)}`);
                alert('Rotated API Key! Update your CI/CD secrets.');
              }}
              className="text-error hover:underline"
            >
              Rotate Secret
            </button>
          </div>
        </div>

        {/* Webhook Endpoint */}
        <div className="p-5 bg-surface-container-low rounded-xl border border-surface-container-highest/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/20">
              <span className="text-xs font-mono font-semibold text-on-surface">
                Production Webhook Listener URL
              </span>
              <span className="text-[10px] font-mono bg-primary-container/20 text-primary-fixed px-2 py-0.5 rounded font-bold">
                HTTPS
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-3">
              Route GitHub, GitLab, and Bitbucket pushes directly into the initial state [S0 Ticket Ingest].
            </p>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="mt-3 w-full bg-surface-container p-2.5 rounded font-mono text-xs text-on-surface border border-surface-container-highest/40 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-surface-container-highest/20 text-xs font-mono text-outline flex items-center justify-between">
            <span>HMAC SHA256 Signature Verification: Enabled</span>
            <span className="text-secondary font-bold">100% OK</span>
          </div>
        </div>
      </div>

      {/* cURL Snippet */}
      <div className="p-5 bg-surface-container-low rounded-xl border border-surface-container-highest/30">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-surface-container-highest/20">
          <span className="text-xs font-mono text-outline uppercase font-semibold">
            cURL Dispatch Example
          </span>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(curlSnippet);
              alert('Copied cURL command to clipboard!');
            }}
            className="text-xs font-mono text-primary hover:underline"
          >
            Copy Snippet
          </button>
        </div>
        <pre className="p-3 bg-surface-container-lowest rounded font-mono text-xs text-on-surface overflow-x-auto leading-relaxed border border-surface-container-highest/40">
          {curlSnippet}
        </pre>
      </div>
    </div>
  );
};
