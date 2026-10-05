export type NodeType =
  | 'initial'
  | 'state'
  | 'guard'
  | 'quorum_gate'
  | 'dead_letter'
  | 'escalation'
  | 'terminal';

export interface ApproverRole {
  id: string;
  name: string;
  status: 'signed' | 'pending' | 'required';
  signedBy?: string;
  time?: string;
  avatar?: string;
}

export interface TransitionRule {
  id: string;
  name: string;
  type: 'success' | 'fail' | 'warn';
  condition: string;
  targetNodeId: string;
}

export interface FsmNode {
  id: string;
  type: NodeType;
  code: string;
  title: string;
  subtitle: string;
  icon: string;
  x: number;
  y: number;
  width?: number;
  badgeRight?: string;
  badgeRightColor?: string;
  metaLeft?: string;
  metaRight?: string;
  metaRightColor?: string;
  codeSnippet?: string;
  roles?: string[];
  slaLimit?: string;
  slaLeft?: string;
  slaPercent?: number;
  status?: 'active' | 'passed' | 'idle' | 'failed' | 'simulating';
  approversConfig?: {
    requiredCount: number;
    totalCount: number;
    signedCount: number;
    roles: ApproverRole[];
    slaBreachAction: string;
  };
  transitionRules?: TransitionRule[];
  hooks?: {
    onEntry: string;
    onExit: string;
    onTimeout: string;
  };
  telemetry?: {
    executions24h: string;
    errorRate: string;
    p95Latency: string;
    workersPool: string;
    workersCount: number;
  };
}

export interface FsmEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  labelType?: 'secondary' | 'primary' | 'error' | 'tertiary';
  type: 'green' | 'indigo' | 'rose' | 'amber';
  dashed?: boolean;
  active?: boolean;
}

export type ActiveNavPath =
  | 'operations-dashboard-workflow-monitor'
  | 'projects-milestones'
  | 'task-engine-kanban'
  | 'workflow-state-machines'
  | 'multi-stage-approvals'
  | 'event-automations'
  | 'developer-api-webhooks'
  | 'tenancy-rbac-settings';
