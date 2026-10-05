import React, { useState } from 'react';
import { FsmNode, FsmEdge } from '../../types/fsm';

interface JsonModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: FsmNode[];
  edges: FsmEdge[];
  onImportGraph?: (imported: { nodes: FsmNode[]; edges: FsmEdge[] }) => void;
}

export const JsonModal: React.FC<JsonModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fsmSchema = {
    schema_version: 'fsm.v3',
    identifier: 'ci-cd-prod-gate-fsm.v3',
    published_by: 'Elena Vance (ORG_ADMIN)',
    state_count: nodes.length,
    transition_count: edges.length,
    nodes,
    edges,
  };

  const jsonString = JSON.stringify(fsmSchema, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ci-cd-prod-gate-fsm.v3.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container-high border border-surface-container-highest rounded-xl shadow-2xl max-w-2xl w-full p-5 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">code</span>
            <h3 className="text-base font-semibold text-on-surface">
              Raw FSM Graph Definition (JSON)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="mt-3 flex-1 overflow-y-auto">
          <pre className="p-3 bg-surface-container-lowest rounded-lg border border-surface-container-highest/40 text-[11px] font-mono text-on-surface overflow-x-auto select-text leading-relaxed">
            {jsonString}
          </pre>
        </div>

        <div className="mt-4 pt-3 border-t border-surface-container-highest/40 flex items-center justify-between">
          <span className="text-xs font-mono text-outline">
            {nodes.length} nodes · {edges.length} edges
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-highest text-on-surface text-xs font-mono rounded flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Download Schema</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-mono text-xs font-medium rounded flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
