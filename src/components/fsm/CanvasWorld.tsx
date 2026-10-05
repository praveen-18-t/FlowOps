import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FsmNode, FsmEdge } from '../../types/fsm';

interface CanvasWorldProps {
  nodes: FsmNode[];
  edges: FsmEdge[];
  selectedNodeId: string;
  onSelectNode: (nodeId: string) => void;
  onUpdateNodePosition: (nodeId: string, x: number, y: number) => void;
  onDropNewNode: (nodeData: any, x: number, y: number) => void;
  zoomLevel: number;
  showGrid: boolean;
  simulationStep: number;
  onAdvanceSimulation: () => void;
  isSimulating: boolean;
  onToggleSimulating: () => void;
}

export const CanvasWorld: React.FC<CanvasWorldProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onUpdateNodePosition,
  onDropNewNode,
  zoomLevel,
  showGrid,
  simulationStep,
  onAdvanceSimulation,
  isSimulating,
  onToggleSimulating,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showMiniMap, setShowMiniMap] = useState(true);

  // Simulation steps sequence
  const simulationFlow = [
    { from: 'node_s0_ticket', to: 'node_s1_sast', label: 'Ticket Ingest → SAST Scan', eventId: '#EV-9821', desc: 'Valid HMAC git payload verified' },
    { from: 'node_s1_sast', to: 'node_s2_rbac', label: 'SAST Scan → Policy Guard', eventId: '#EV-9822', desc: '0 vulnerabilities detected in SARIF stream' },
    { from: 'node_s2_rbac', to: 'node_s3_gate', label: 'RBAC Allow → Exec Sign-Off', eventId: '#EV-9823', desc: 'Tenant tier Enterprise verified. Awaiting quorum.' },
    { from: 'node_s3_gate', to: 'node_s4_canary', label: 'Quorum Signed → Canary 10%', eventId: '#EV-9824', desc: 'SecOps & VP Eng signatures valid.' },
    { from: 'node_s4_canary', to: 'node_sdone_live', label: 'Canary Passed → Production Live', eventId: '#EV-9825', desc: '0.00% err over 30m dwell window. Promoted.' },
  ];

  const currentSimState = simulationFlow[simulationStep % simulationFlow.length];

  // Auto step when simulating
  useEffect(() => {
    if (!isSimulating) return;
    const timer = setInterval(() => {
      onAdvanceSimulation();
    }, 2200);
    return () => clearInterval(timer);
  }, [isSimulating, onAdvanceSimulation]);

  // Handle canvas mouse move for dragging nodes
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingNodeId || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scale = zoomLevel / 100;
      const newX = Math.max(10, Math.round((e.clientX - rect.left) / scale - dragOffset.x));
      const newY = Math.max(10, Math.round((e.clientY - rect.top) / scale - dragOffset.y));
      onUpdateNodePosition(draggingNodeId, newX, newY);
    },
    [draggingNodeId, dragOffset, zoomLevel, onUpdateNodePosition]
  );

  const handleMouseUp = useCallback(() => {
    setDraggingNodeId(null);
  }, []);

  const handleNodeMouseDown = (e: React.MouseEvent, node: FsmNode) => {
    e.stopPropagation();
    onSelectNode(node.id);
    const scale = zoomLevel / 100;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / scale;
    const mouseY = (e.clientY - rect.top) / scale;
    setDragOffset({
      x: mouseX - node.x,
      y: mouseY - node.y,
    });
    setDraggingNodeId(node.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const dataStr = e.dataTransfer.getData('text/plain');
    if (!dataStr) return;
    try {
      const item = JSON.parse(dataStr);
      const rect = containerRef.current.getBoundingClientRect();
      const scale = zoomLevel / 100;
      const dropX = Math.max(20, Math.round((e.clientX - rect.left) / scale - 100));
      const dropY = Math.max(20, Math.round((e.clientY - rect.top) / scale - 40));
      onDropNewNode(item, dropX, dropY);
    } catch {
      // not JSON
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Helper to compute node center coordinates
  const getNodeAnchor = (nodeId: string, side: 'left' | 'right' | 'top' | 'bottom' = 'right') => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };
    const width = node.width || 208;
    const height = 90; // approx height

    if (side === 'left') return { x: node.x, y: node.y + height / 2 };
    if (side === 'right') return { x: node.x + width, y: node.y + height / 2 };
    if (side === 'top') return { x: node.x + width / 2, y: node.y };
    if (side === 'bottom') return { x: node.x + width / 2, y: node.y + height };
    return { x: node.x + width / 2, y: node.y + height / 2 };
  };

  return (
    <div
      className="col-span-12 md:col-span-9 xl:col-span-7 relative h-full bg-surface-dim overflow-hidden select-none"
      id="fsm-canvas-wrapper"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Background subtle dot pattern */}
      {showGrid && (
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #908fa0 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      )}

      {/* State Canvas World Container */}
      <div
        ref={containerRef}
        id="fsm-world"
        className="relative w-full h-full min-w-[1050px] min-h-[640px] overflow-auto transition-transform duration-75 origin-top-left"
        style={{
          transform: `scale(${zoomLevel / 100})`,
        }}
      >
        {/* SVG Curved Transition Edge Connectors */}
        <svg
          className="absolute inset-0 w-[1400px] h-[900px] pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrow-green"
              markerHeight="6"
              markerWidth="6"
              orient="auto-start-reverse"
              refX="6"
              refY="5"
              viewBox="0 0 10 10"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#4edea3" />
            </marker>
            <marker
              id="arrow-indigo"
              markerHeight="6"
              markerWidth="6"
              orient="auto-start-reverse"
              refX="6"
              refY="5"
              viewBox="0 0 10 10"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#8083ff" />
            </marker>
            <marker
              id="arrow-rose"
              markerHeight="6"
              markerWidth="6"
              orient="auto-start-reverse"
              refX="6"
              refY="5"
              viewBox="0 0 10 10"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#ffb4ab" />
            </marker>
            <marker
              id="arrow-amber"
              markerHeight="6"
              markerWidth="6"
              orient="auto-start-reverse"
              refX="6"
              refY="5"
              viewBox="0 0 10 10"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#ffb95f" />
            </marker>
          </defs>

          {/* Render All Dynamic Edges */}
          {edges.map((edge) => {
            const sourceNode = nodes.find((n) => n.id === edge.from);
            const targetNode = nodes.find((n) => n.id === edge.to);
            if (!sourceNode || !targetNode) return null;

            // Determine optimal anchor points
            let startSide: 'right' | 'left' | 'bottom' | 'top' = 'right';
            let endSide: 'left' | 'right' | 'top' | 'bottom' = 'left';

            if (targetNode.x < sourceNode.x - 50) {
              startSide = 'left';
              endSide = 'right';
            } else if (Math.abs(targetNode.x - sourceNode.x) < 80 && targetNode.y > sourceNode.y) {
              startSide = 'bottom';
              endSide = 'top';
            }

            const p1 = getNodeAnchor(edge.from, startSide);
            const p2 = getNodeAnchor(edge.to, endSide);

            // Compute bezier curve control points
            const dx = Math.abs(p2.x - p1.x);
            const dy = Math.abs(p2.y - p1.y);
            const cx1 = startSide === 'right' ? p1.x + Math.max(40, dx * 0.45) : startSide === 'left' ? p1.x - Math.max(40, dx * 0.45) : p1.x;
            const cy1 = startSide === 'bottom' ? p1.y + Math.max(40, dy * 0.45) : p1.y;
            const cx2 = endSide === 'left' ? p2.x - Math.max(40, dx * 0.45) : endSide === 'right' ? p2.x + Math.max(40, dx * 0.45) : p2.x;
            const cy2 = endSide === 'top' ? p2.y - Math.max(40, dy * 0.45) : p2.y;

            const pathD = `M ${p1.x} ${p1.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p2.x} ${p2.y}`;

            const strokeColor =
              edge.type === 'green'
                ? '#4edea3'
                : edge.type === 'indigo'
                ? '#8083ff'
                : edge.type === 'rose'
                ? '#ffb4ab'
                : '#ffb95f';

            const markerId = `url(#arrow-${edge.type})`;
            const isSimEdge = currentSimState.from === edge.from && currentSimState.to === edge.to;

            return (
              <g key={edge.id}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSimEdge ? '3' : '2'}
                  strokeDasharray={edge.dashed ? '4 2' : undefined}
                  markerEnd={markerId}
                  className={`transition-all duration-300 ${
                    isSimEdge ? 'opacity-100 animate-pulse' : 'opacity-85'
                  }`}
                />
                {isSimEdge && (
                  <circle r="4" fill="#ffffff">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path={pathD} />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Dynamic Connection Labels on Canvas */}
        {edges.map((edge) => {
          if (!edge.label) return null;
          const sourceNode = nodes.find((n) => n.id === edge.from);
          const targetNode = nodes.find((n) => n.id === edge.to);
          if (!sourceNode || !targetNode) return null;

          let startSide: 'right' | 'left' | 'bottom' | 'top' = 'right';
          let endSide: 'left' | 'right' | 'top' | 'bottom' = 'left';
          if (targetNode.x < sourceNode.x - 50) {
            startSide = 'left';
            endSide = 'right';
          } else if (Math.abs(targetNode.x - sourceNode.x) < 80 && targetNode.y > sourceNode.y) {
            startSide = 'bottom';
            endSide = 'top';
          }

          const p1 = getNodeAnchor(edge.from, startSide);
          const p2 = getNodeAnchor(edge.to, endSide);
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;

          const textColor =
            edge.labelType === 'secondary'
              ? 'text-secondary'
              : edge.labelType === 'primary'
              ? 'text-primary-fixed'
              : edge.labelType === 'error'
              ? 'text-error'
              : 'text-tertiary';

          return (
            <div
              key={`label-${edge.id}`}
              className={`absolute bg-surface-container-high px-2 py-0.5 rounded ${textColor} text-[10px] font-mono shadow-sm pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-10 border border-surface-container-highest/40`}
              style={{
                left: `${midX}px`,
                top: `${midY}px`,
              }}
            >
              {edge.label}
            </div>
          );
        })}

        {/* GRAPH NODES */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isSimCurrent =
            currentSimState.from === node.id || currentSimState.to === node.id;

          // Standard classes based on node type
          let bgClass = 'bg-surface-container-low';
          let borderClass = 'border border-surface-container-highest/40';
          let badgeColor = 'text-primary';
          let iconBg = 'bg-primary-container/20 text-primary-fixed';

          if (node.type === 'initial') {
            badgeColor = 'text-secondary';
            iconBg = 'bg-secondary-container/20 text-secondary';
          } else if (node.type === 'quorum_gate') {
            bgClass = 'bg-surface-container';
            badgeColor = 'text-primary-fixed-dim';
            iconBg = 'bg-primary-container text-on-primary-container';
          } else if (node.type === 'guard') {
            bgClass = 'bg-surface-container-high';
            badgeColor = 'text-tertiary';
            iconBg = 'bg-tertiary-container/20 text-tertiary';
          } else if (node.type === 'dead_letter') {
            bgClass = 'bg-error-container/20';
            badgeColor = 'text-error';
            iconBg = 'bg-error-container text-on-error-container';
          } else if (node.type === 'escalation') {
            bgClass = 'bg-surface-container';
            badgeColor = 'text-tertiary';
            iconBg = 'bg-tertiary-container/20 text-tertiary';
          } else if (node.type === 'terminal') {
            bgClass = 'bg-surface-container-high';
            badgeColor = 'text-secondary';
            iconBg = 'bg-secondary-container/20 text-secondary';
          }

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleNodeMouseDown(e, node)}
              className={`absolute rounded-lg p-3 shadow-md hover:shadow-xl transition-all cursor-move select-none ${bgClass} ${borderClass} ${
                isSelected
                  ? 'ring-2 ring-primary-container z-30 shadow-2xl'
                  : 'z-20'
              } ${isSimCurrent ? 'ring-1 ring-secondary' : ''}`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${node.width || 208}px`,
                boxShadow: isSelected
                  ? '0 0 0 2px #8083ff, 0 10px 25px -5px rgba(128, 131, 255, 0.3)'
                  : undefined,
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between pb-1.5">
                <div className="flex items-center gap-1.5">
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                  )}
                  <span
                    className={`text-[10px] font-mono uppercase font-semibold ${badgeColor}`}
                  >
                    {node.code}
                  </span>
                </div>
                {node.badgeRight && (
                  <span className="text-[10px] font-mono bg-surface-container-high px-1.5 py-0.5 rounded text-outline">
                    {node.badgeRight}
                  </span>
                )}
                {!node.badgeRight && node.type === 'initial' && (
                  <span className="w-2 h-2 rounded-full bg-secondary"></span>
                )}
                {!node.badgeRight && node.type === 'terminal' && (
                  <span className="material-symbols-outlined text-secondary text-xs">
                    verified
                  </span>
                )}
                {!node.badgeRight && node.type === 'dead_letter' && (
                  <span className="material-symbols-outlined text-error text-xs">
                    block
                  </span>
                )}
              </div>

              {/* Title & icon */}
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded ${iconBg}`}>
                  <span className="material-symbols-outlined text-sm">
                    {node.icon}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-on-surface truncate">
                    {node.title}
                  </span>
                  <span className="text-[10px] font-mono text-outline truncate">
                    {node.subtitle}
                  </span>
                </div>
              </div>

              {/* Optional Code Snippet for guards */}
              {node.codeSnippet && (
                <div className="mt-2 p-1 bg-surface-container-lowest rounded text-[10px] font-mono text-outline-variant truncate border border-surface-container-highest/20">
                  {node.codeSnippet}
                </div>
              )}

              {/* Optional Roles badges */}
              {node.roles && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {node.roles.map((r) => (
                    <span
                      key={r}
                      className="text-[9px] font-mono px-1.5 py-0.5 bg-surface-container-highest text-on-surface-variant rounded"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}

              {/* Optional SLA Bar */}
              {node.slaLimit && (
                <div className="mt-2 pt-1 border-t border-surface-container-highest/20">
                  <div className="flex justify-between text-[10px] font-mono pb-1">
                    <span className="text-outline">SLA Limit: {node.slaLimit}</span>
                    <span className="text-secondary font-medium">
                      {node.slaLeft}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded overflow-hidden">
                    <div
                      className="bg-secondary h-full rounded transition-all duration-300"
                      style={{ width: `${node.slaPercent || 32}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Optional Meta Footer */}
              {node.metaLeft && !node.slaLimit && (
                <div className="mt-2 pt-1 border-t border-surface-container-highest/20 flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
                  <span>{node.metaLeft}</span>
                  <span
                    className={
                      node.metaRightColor === 'secondary'
                        ? 'text-secondary font-bold'
                        : 'text-outline'
                    }
                  >
                    {node.metaRight}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CANVAS OVERLAY 1: Mini-Map View (Bottom-Left) */}
      {showMiniMap && (
        <div className="absolute bottom-4 left-4 w-44 h-28 bg-surface-container-lowest/90 backdrop-blur-md rounded-lg p-2 shadow-lg hidden sm:flex flex-col select-none border border-surface-container-highest/30 z-20">
          <div className="flex items-center justify-between text-on-surface-variant text-[10px] font-mono pb-1">
            <span className="text-outline uppercase text-[9px] tracking-wider">
              Mini-Map View
            </span>
            <button
              onClick={() => setShowMiniMap(false)}
              className="material-symbols-outlined text-xs text-outline cursor-pointer hover:text-on-surface"
            >
              close_fullscreen
            </button>
          </div>
          <div className="relative w-full h-full bg-surface-container-low rounded overflow-hidden">
            {nodes.map((n) => {
              const miniX = (n.x / 1100) * 140;
              const miniY = (n.y / 600) * 75;
              const isSel = n.id === selectedNodeId;
              return (
                <div
                  key={`mini-${n.id}`}
                  onClick={() => onSelectNode(n.id)}
                  className={`absolute rounded-xs cursor-pointer transition-all ${
                    isSel
                      ? 'w-5 h-3 bg-primary-container ring-1 ring-primary-fixed z-10'
                      : n.type === 'initial' || n.type === 'terminal'
                      ? 'w-3.5 h-2 bg-secondary/80'
                      : n.type === 'dead_letter'
                      ? 'w-3.5 h-2 bg-error/80'
                      : 'w-3.5 h-2 bg-primary/70'
                  }`}
                  style={{
                    left: `${Math.min(130, Math.max(2, miniX))}px`,
                    top: `${Math.min(65, Math.max(2, miniY))}px`,
                  }}
                  title={n.title}
                />
              );
            })}
            <div className="absolute inset-1 rounded bg-primary/10 pointer-events-none ring-1 ring-primary/20" />
          </div>
        </div>
      )}

      {/* CANVAS OVERLAY 2: Live Simulator Telemetry Widget (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md rounded-lg p-3 shadow-xl flex items-center gap-3 z-30 border border-surface-container-highest/30">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-on-surface uppercase tracking-tight font-semibold">
              Simulator Event: {currentSimState.eventId}
            </span>
            <span className="text-[10px] font-mono text-outline">
              Transition: {currentSimState.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pl-2 border-l border-surface-container-highest/40">
          <button
            onClick={onAdvanceSimulation}
            className="px-2 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded text-[10px] font-mono flex items-center gap-1 transition-colors"
            title="Step through state machine transition"
          >
            <span className="material-symbols-outlined text-xs text-primary">
              play_arrow
            </span>
            <span>Step</span>
          </button>
          <button
            onClick={onToggleSimulating}
            className={`px-2 py-1 rounded text-[10px] font-mono flex items-center gap-1 transition-colors ${
              isSimulating
                ? 'bg-secondary-container text-on-secondary-container font-semibold'
                : 'bg-surface-container-high hover:bg-surface-container-highest text-outline'
            }`}
            title="Auto-play simulation cycle"
          >
            <span className="material-symbols-outlined text-xs">
              {isSimulating ? 'pause' : 'autorenew'}
            </span>
            <span>{isSimulating ? 'Playing' : 'Auto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
