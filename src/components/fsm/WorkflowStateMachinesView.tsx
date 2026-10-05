import React, { useState } from 'react';
import { FsmNode, FsmEdge, NodeType } from '../../types/fsm';
import { LeftPalette } from './LeftPalette';
import { CanvasWorld } from './CanvasWorld';
import { RightInspector } from './RightInspector';
import { ValidateModal } from '../modals/ValidateModal';
import { JsonModal } from '../modals/JsonModal';
import { PublishModal } from '../modals/PublishModal';

interface WorkflowStateMachinesViewProps {
  nodes: FsmNode[];
  edges: FsmEdge[];
  onUpdateNodes: (nodes: FsmNode[]) => void;
  onUpdateEdges: (edges: FsmEdge[]) => void;
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

export const WorkflowStateMachinesView: React.FC<WorkflowStateMachinesViewProps> = ({
  nodes,
  edges,
  onUpdateNodes,
  onUpdateEdges,
  selectedNodeId,
  onSelectNode,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [version, setVersion] = useState<string>('v3.4.2');
  const [publishTime, setPublishTime] = useState<string>('12m ago');

  // Modals
  const [isValidateOpen, setIsValidateOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  // Simulation state
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(160, prev + 10));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(60, prev - 10));
  const handleFit = () => setZoomLevel(100);

  // Auto layout nodes in an organized flow
  const handleAutoLayout = () => {
    const layoutPositions: Record<string, { x: number; y: number }> = {
      node_s0_ticket: { x: 32, y: 48 },
      node_s1_sast: { x: 320, y: 48 },
      node_s2_rbac: { x: 600, y: 40 },
      node_dlq_reject: { x: 910, y: 48 },
      node_s3_gate: { x: 600, y: 288 },
      node_timeout_escalate: { x: 910, y: 208 },
      node_s4_canary: { x: 208, y: 288 },
      node_sdone_live: { x: 208, y: 480 },
    };

    const updated = nodes.map((node, index) => {
      const pos = layoutPositions[node.id] || {
        x: 400 + (index % 3) * 220,
        y: 400 + Math.floor(index / 3) * 120,
      };
      return { ...node, x: pos.x, y: pos.y };
    });
    onUpdateNodes(updated);
  };

  // Node position update from canvas dragging
  const handleUpdateNodePosition = (nodeId: string, x: number, y: number) => {
    onUpdateNodes(nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)));
  };

  // Node detail update from inspector
  const handleUpdateNode = (updatedNode: FsmNode) => {
    onUpdateNodes(nodes.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  // Delete node
  const handleDeleteNode = (nodeId: string) => {
    if (nodes.length <= 2) {
      alert('Cannot delete: Minimum 2 nodes required for state machine graph.');
      return;
    }
    onUpdateNodes(nodes.filter((n) => n.id !== nodeId));
    onUpdateEdges(edges.filter((e) => e.from !== nodeId && e.to !== nodeId));
    const nextRemaining = nodes.find((n) => n.id !== nodeId);
    if (nextRemaining) onSelectNode(nextRemaining.id);
  };

  // Add new node from palette
  const handleAddNode = (item: {
    title: string;
    desc: string;
    type: NodeType;
    icon: string;
    iconColor: string;
  }) => {
    const newId = `node_${Date.now()}`;
    const newNode: FsmNode = {
      id: newId,
      type: item.type,
      code: item.title.toUpperCase(),
      title: item.title,
      subtitle: item.desc,
      icon: item.icon,
      x: 350 + Math.floor(Math.random() * 80),
      y: 180 + Math.floor(Math.random() * 80),
      width: 208,
      telemetry: {
        executions24h: '0',
        errorRate: '0.00%',
        p95Latency: '15ms',
        workersPool: 'default_worker',
        workersCount: 2,
      },
      hooks: {
        onEntry: 'Log Entry Trace',
        onExit: 'Log Exit Event',
        onTimeout: 'Alert Watchdog',
      },
    };

    onUpdateNodes([...nodes, newNode]);
    onSelectNode(newId);
  };

  // Drop new node on canvas with specific coordinates
  const handleDropNewNode = (item: any, x: number, y: number) => {
    const newId = `node_${Date.now()}`;
    const newNode: FsmNode = {
      id: newId,
      type: item.type || 'state',
      code: (item.title || 'NEW STEP').toUpperCase(),
      title: item.title || 'Custom Step',
      subtitle: item.desc || 'Configured node',
      icon: item.icon || 'adjust',
      x,
      y,
      width: 208,
      telemetry: {
        executions24h: '0',
        errorRate: '0.00%',
        p95Latency: '10ms',
        workersPool: 'default_pool',
        workersCount: 2,
      },
    };
    onUpdateNodes([...nodes, newNode]);
    onSelectNode(newId);
  };

  // Dry run trigger
  const handleAdvanceSimulation = () => {
    setSimulationStep((prev) => prev + 1);
  };

  const handleToggleSimulating = () => {
    setIsSimulating((prev) => !prev);
  };

  const handlePublishCommit = (newVer: string) => {
    setVersion(newVer);
    setPublishTime('Just now');
  };

  const guardsCount = nodes.filter((n) => n.type === 'guard' || n.type === 'quorum_gate').length;

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-64px)]">
      {/* Interactive Top Action & Meta Ribbon */}
      <div className="flex flex-col border-b border-surface-container-high bg-surface-container-lowest/80 backdrop-blur-md sticky top-16 z-30 px-6 py-2.5 gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Breadcrumbs & Status Flag */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-[11px] font-mono">
              <span className="hover:text-on-surface cursor-pointer">Workflows</span>
              <span className="text-outline">/</span>
              <span className="hover:text-on-surface cursor-pointer">CI/CD Production Gateways</span>
              <span className="text-outline">/</span>
              <span className="text-primary-fixed-dim text-xs bg-surface-container-high px-2 py-0.5 rounded font-mono font-medium">
                ci-cd-prod-gate-fsm.v3
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-secondary-container/20 text-secondary px-2.5 py-0.5 rounded-full border border-secondary/20">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold tracking-wide uppercase">
                Active &amp; Enforcing
              </span>
            </div>
            <span className="hidden sm:inline text-xs text-outline font-normal">
              Published {publishTime} by <span className="text-on-surface font-medium">Elena Vance</span>
            </span>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsValidateOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-mono rounded transition-colors border border-surface-container-highest/30 cursor-pointer"
              title="Check structural syntax and dead paths"
            >
              <span className="material-symbols-outlined text-sm text-secondary">verified</span>
              <span>Validate FSM</span>
            </button>

            <button
              onClick={() => setIsPublishOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-mono rounded transition-colors border border-surface-container-highest/30 cursor-pointer"
              title="Switch or view version history"
            >
              <span className="material-symbols-outlined text-sm text-outline">history</span>
              <span>{version}</span>
            </button>

            <button
              onClick={handleAdvanceSimulation}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-mono rounded transition-colors border border-surface-container-highest/30 cursor-pointer"
              title="Trigger Step Simulation"
            >
              <span className="material-symbols-outlined text-sm text-tertiary">science</span>
              <span>Dry Run</span>
            </button>

            <button
              onClick={() => setIsJsonOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-mono rounded transition-colors border border-surface-container-highest/30 cursor-pointer"
              title="View full JSON graph specification"
            >
              <span className="material-symbols-outlined text-sm text-outline">code</span>
              <span>JSON</span>
            </button>

            <button
              onClick={() => setIsPublishOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-container text-on-primary-container hover:bg-primary font-semibold text-xs rounded shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              <span className="font-mono">Publish Version</span>
            </button>
          </div>
        </div>

        {/* Secondary Canvas Control Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            {/* Zoom controls */}
            <div className="flex items-center bg-surface-container-low rounded p-0.5 gap-0.5 text-on-surface-variant border border-surface-container-highest/20">
              <button
                onClick={handleZoomOut}
                className="p-1 hover:bg-surface-container hover:text-on-surface rounded flex items-center justify-center cursor-pointer"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="text-[10px] font-mono px-2 text-on-surface min-w-9 text-center">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 hover:bg-surface-container hover:text-on-surface rounded flex items-center justify-center cursor-pointer"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>

            <div className="h-4 w-px bg-surface-container-highest"></div>

            {/* Canvas Options */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                  showGrid
                    ? 'bg-surface-container text-on-surface border border-primary/30'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-sm text-primary">grid_view</span>
                <span className="hidden sm:inline">{showGrid ? 'Grid On' : 'Grid Off'}</span>
              </button>

              <button
                onClick={handleAutoLayout}
                className="flex items-center gap-1 px-2 py-1 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded text-[10px] font-mono cursor-pointer"
                title="Auto-arrange nodes in logical flow"
              >
                <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                <span className="hidden sm:inline">Auto-Layout</span>
              </button>

              <button
                onClick={handleFit}
                className="flex items-center gap-1 px-2 py-1 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-on-surface rounded text-[10px] font-mono cursor-pointer"
                title="Reset zoom to 100%"
              >
                <span className="material-symbols-outlined text-sm">fit_screen</span>
                <span className="hidden sm:inline">Fit</span>
              </button>
            </div>
          </div>

          {/* State summary chips */}
          <div className="hidden lg:flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              States: <strong className="text-on-surface">{nodes.length}</strong>
            </span>
            <span className="flex items-center gap-1 text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Transitions: <strong className="text-on-surface">{edges.length}</strong>
            </span>
            <span className="flex items-center gap-1 text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
              Guards: <strong className="text-on-surface">{guardsCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Studio 3-Rail Workbench Grid */}
      <div className="grid grid-cols-12 w-full flex-1 h-[calc(100vh-140px)] overflow-hidden">
        {/* Left Rail: Palette */}
        <LeftPalette onAddNode={handleAddNode} />

        {/* Center Rail: Canvas Graph */}
        <CanvasWorld
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          onUpdateNodePosition={handleUpdateNodePosition}
          onDropNewNode={handleDropNewNode}
          zoomLevel={zoomLevel}
          showGrid={showGrid}
          simulationStep={simulationStep}
          onAdvanceSimulation={handleAdvanceSimulation}
          isSimulating={isSimulating}
          onToggleSimulating={handleToggleSimulating}
        />

        {/* Right Rail: Node Inspector */}
        <RightInspector
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          onTriggerDryRun={handleAdvanceSimulation}
          onDeleteNode={handleDeleteNode}
        />
      </div>

      {/* Modals */}
      <ValidateModal
        isOpen={isValidateOpen}
        onClose={() => setIsValidateOpen(false)}
        nodes={nodes}
        edges={edges}
      />
      <JsonModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        nodes={nodes}
        edges={edges}
      />
      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        currentVersion={version}
        onPublish={handlePublishCommit}
      />
    </div>
  );
};
