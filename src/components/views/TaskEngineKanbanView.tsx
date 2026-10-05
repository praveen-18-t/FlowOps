import React, { useState } from 'react';

export const TaskEngineKanbanView: React.FC<{ onNavigateToFsm: () => void }> = ({
  onNavigateToFsm,
}) => {
  const [columns, setColumns] = useState([
    {
      id: 'queued',
      title: 'Queued Dispatch',
      tasks: [
        { id: 'TSK-109', title: 'Compile Semgrep SARIF', pool: 'sec_worker', priority: 'High', latency: '40ms' },
        { id: 'TSK-110', title: 'KMS Digest S3 Sign', pool: 's3_archiver', priority: 'Medium', latency: '22ms' },
      ],
    },
    {
      id: 'inflight',
      title: 'Celery In-Flight',
      tasks: [
        { id: 'TSK-104', title: 'Static SAST Scan (S1)', pool: 'sec_worker (Node #4)', priority: 'P0', latency: '180ms' },
        { id: 'TSK-105', title: 'RBAC Policy Guard Check', pool: 'auth_daemon', priority: 'High', latency: '8ms' },
      ],
    },
    {
      id: 'approval',
      title: 'Quorum Sign-Off Gate',
      tasks: [
        { id: 'TSK-102', title: 'Exec Multi-Stage Sign-Off (S3)', pool: 'quorum_engine', priority: 'Critical', latency: '1h 14m left' },
      ],
    },
    {
      id: 'canary',
      title: 'Canary Soak (10%)',
      tasks: [
        { id: 'TSK-098', title: 'K8s Pod Dwell Window', pool: 'k8s_deployer', priority: 'High', latency: '12m remaining' },
      ],
    },
    {
      id: 'done',
      title: 'Production Live [DONE]',
      tasks: [
        { id: 'TSK-091', title: 'v2.4.1 Global Rollout', pool: 'k8s_deployer', priority: 'Normal', latency: 'Completed' },
      ],
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPool, setSelectedPool] = useState('sec_worker');

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      title: newTaskTitle.trim(),
      pool: selectedPool,
      priority: 'High',
      latency: '15ms',
    };
    setColumns((prev) =>
      prev.map((c) => (c.id === 'queued' ? { ...c, tasks: [newTask, ...c.tasks] } : c))
    );
    setNewTaskTitle('');
  };

  return (
    <div className="flex flex-col w-full p-6 max-w-7xl mx-auto gap-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
        <div>
          <h1 className="text-xl font-semibold text-on-surface">
            Task Engine &amp; Celery Kanban Board
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Distributed execution pipeline queue across 12 Celery worker cluster nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToFsm}
            className="px-3 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-xs rounded flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">account_tree</span>
            <span className="font-mono">FSM View</span>
          </button>
        </div>
      </div>

      {/* Quick Dispatch Bar */}
      <div className="p-3 bg-surface-container-low rounded-lg border border-surface-container-highest/30 flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-outline">Enqueue Task:</span>
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="e.g., Scan dependency vulnerabilities..."
          className="flex-1 bg-surface-container px-3 py-1.5 rounded text-xs text-on-surface border border-surface-container-highest/40 focus:outline-none focus:border-primary"
        />
        <select
          value={selectedPool}
          onChange={(e) => setSelectedPool(e.target.value)}
          className="bg-surface-container px-3 py-1.5 rounded text-xs text-on-surface border border-surface-container-highest/40 font-mono"
        >
          <option value="sec_worker">sec_worker (Security)</option>
          <option value="k8s_deployer">k8s_deployer (K8s)</option>
          <option value="auth_daemon">auth_daemon (Auth/CEL)</option>
          <option value="s3_archiver">s3_archiver (Digest)</option>
        </select>
        <button
          onClick={handleAddTask}
          className="px-4 py-1.5 bg-secondary-container text-on-secondary-container hover:bg-secondary font-semibold text-xs rounded transition-colors"
        >
          Dispatch to Cluster
        </button>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {columns.map((col) => (
          <div
            key={col.id}
            className="bg-surface-container-low rounded-xl border border-surface-container-highest/30 p-3 flex flex-col min-h-[500px]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest/20 mb-3">
              <span className="text-xs font-mono font-semibold text-on-surface">
                {col.title}
              </span>
              <span className="text-[10px] font-mono bg-surface-container px-1.5 py-0.5 rounded text-outline">
                {col.tasks.length}
              </span>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {col.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-surface-container rounded-lg border border-surface-container-highest/20 hover:border-primary-container/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-primary-fixed">
                      {task.id}
                    </span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        task.priority === 'Critical' || task.priority === 'P0'
                          ? 'bg-error-container/20 text-error'
                          : 'bg-surface-container-high text-outline'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-on-surface mt-1 group-hover:text-primary-fixed">
                    {task.title}
                  </h4>
                  <div className="mt-2 pt-2 border-t border-surface-container-highest/20 flex items-center justify-between text-[10px] font-mono text-outline">
                    <span className="truncate max-w-[110px]">{task.pool}</span>
                    <span className="text-secondary">{task.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
