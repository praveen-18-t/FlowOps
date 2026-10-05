import React, { useState } from 'react';

export const TenancyRbacView: React.FC<{ onNavigateToFsm: () => void }> = ({
  onNavigateToFsm,
}) => {
  const [roles, setRoles] = useState([
    {
      id: 'org_admin',
      role: 'ORG_ADMIN',
      holder: 'Elena Vance',
      permissions: ['Manage FSM Schemas', 'Publish Production Gateways', 'Bypass Emergency DLQ'],
      badge: 'Full Root',
    },
    {
      id: 'secops_lead',
      role: 'SecOps Lead',
      holder: 'Sarah Connor',
      permissions: ['Sign-Off Quorum Gate (S3)', 'Review SAST SARIF Vulnerabilities', 'Triage DLQ'],
      badge: 'Security',
    },
    {
      id: 'vp_eng',
      role: 'VP Engineering',
      holder: 'Marcus Sterling',
      permissions: ['Authorize Canary Deployments', 'Sign-Off Quorum Gate (S3)', 'Configure SLA Thresholds'],
      badge: 'Engineering',
    },
    {
      id: 'finance_admin',
      role: 'Finance Admin',
      holder: 'Claire Dunphy',
      permissions: ['Sign-Off Quorum Gate (S3)', 'Approve Cloud Infrastructure Scaling & Budget'],
      badge: 'Finance',
    },
  ]);

  return (
    <div className="flex flex-col w-full p-6 max-w-7xl mx-auto gap-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
        <div>
          <h1 className="text-xl font-semibold text-on-surface">
            Tenancy &amp; RBAC Access Controls
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Organization multi-tenancy partitions, role-based access delegation, and executive quorum policies.
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
        {roles.map((r) => (
          <div
            key={r.id}
            className="p-5 bg-surface-container-low rounded-xl border border-surface-container-highest/30 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/20">
                <span className="text-sm font-mono font-bold text-primary-fixed">
                  {r.role}
                </span>
                <span className="text-[10px] font-mono bg-surface-container-high px-2 py-0.5 rounded text-outline uppercase font-semibold">
                  {r.badge}
                </span>
              </div>

              <div className="mt-3">
                <span className="text-xs text-outline font-mono">Assigned Principal:</span>
                <p className="text-base font-semibold text-on-surface">{r.holder}</p>
              </div>

              <div className="mt-3 flex flex-col gap-1.5">
                <span className="text-xs text-outline font-mono">Bound Permissions:</span>
                <ul className="list-disc list-inside text-xs text-on-surface-variant flex flex-col gap-1">
                  {r.permissions.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-surface-container-highest/20 flex justify-between items-center text-xs font-mono">
              <span className="text-secondary font-medium">MFA / Hardware Token Enforced</span>
              <button
                onClick={() => alert(`Configuring permissions for ${r.role}`)}
                className="text-primary hover:underline"
              >
                Edit Policy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
