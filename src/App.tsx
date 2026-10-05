/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveNavPath, FsmNode, FsmEdge } from './types/fsm';
import { INITIAL_NODES, INITIAL_EDGES } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { WorkflowStateMachinesView } from './components/fsm/WorkflowStateMachinesView';
import { OperationsDashboardView } from './components/views/OperationsDashboardView';
import { ProjectsMilestonesView } from './components/views/ProjectsMilestonesView';
import { TaskEngineKanbanView } from './components/views/TaskEngineKanbanView';
import { MultiStageApprovalsView } from './components/views/MultiStageApprovalsView';
import { EventAutomationsView } from './components/views/EventAutomationsView';
import { DeveloperApiView } from './components/views/DeveloperApiView';
import { TenancyRbacView } from './components/views/TenancyRbacView';
import { SearchModal } from './components/modals/SearchModal';

export default function App() {
  const [activePath, setActivePath] = useState<ActiveNavPath>('workflow-state-machines');
  const [nodes, setNodes] = useState<FsmNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<FsmEdge[]>(INITIAL_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_s3_gate');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Global keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased flex flex-col font-sans select-none">
      {/* Fixed Left Navigation Rail */}
      <Sidebar
        activePath={activePath}
        onNavigate={(path) => setActivePath(path)}
        onOpenSettings={() => setActivePath('tenancy-rbac-settings')}
      />

      {/* Main Content Area (offset by 72 = 288px sidebar) */}
      <div className="pl-72 flex-1 flex flex-col min-h-screen bg-surface">
        {/* Fixed Top Header */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigateToApprovals={() => setActivePath('multi-stage-approvals')}
        />

        {/* View Routing Viewport (offset by 16 = 64px header) */}
        <main className="relative pt-16 w-full min-h-[calc(100vh-64px)] flex flex-col bg-surface">
          {activePath === 'workflow-state-machines' && (
            <WorkflowStateMachinesView
              nodes={nodes}
              edges={edges}
              onUpdateNodes={setNodes}
              onUpdateEdges={setEdges}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
            />
          )}

          {activePath === 'operations-dashboard-workflow-monitor' && (
            <OperationsDashboardView
              onNavigateToFsm={() => setActivePath('workflow-state-machines')}
              onNavigateToApprovals={() => setActivePath('multi-stage-approvals')}
            />
          )}

          {activePath === 'projects-milestones' && (
            <ProjectsMilestonesView
              onNavigateToFsm={() => setActivePath('workflow-state-machines')}
            />
          )}

          {activePath === 'task-engine-kanban' && (
            <TaskEngineKanbanView
              onNavigateToFsm={() => setActivePath('workflow-state-machines')}
            />
          )}

          {activePath === 'multi-stage-approvals' && (
            <MultiStageApprovalsView
              onNavigateToFsm={() => setActivePath('workflow-state-machines')}
            />
          )}

          {activePath === 'event-automations' && (
            <EventAutomationsView
              onNavigateToFsm={() => setActivePath('workflow-state-machines')}
            />
          )}

          {activePath === 'developer-api-webhooks' && (
            <DeveloperApiView
              onNavigateToFsm={() => setActivePath('workflow-state-machines')}
            />
          )}

          {activePath === 'tenancy-rbac-settings' && (
            <TenancyRbacView
              onNavigateToFsm={() => setActivePath('workflow-state-machines')}
            />
          )}
        </main>
      </div>

      {/* Global ⌘K Command Palette */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(path) => setActivePath(path)}
        onSelectNode={(id) => {
          setSelectedNodeId(id);
          setActivePath('workflow-state-machines');
        }}
        nodes={nodes}
      />
    </div>
  );
}
