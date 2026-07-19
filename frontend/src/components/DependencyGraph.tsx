'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 250, y: 0 }, data: { label: 'src/index.ts' }, className: 'react-flow__node-custom' },
  { id: '2', position: { x: 100, y: 150 }, data: { label: 'src/routes/webhooks.ts' }, className: 'react-flow__node-custom' },
  { id: '3', position: { x: 400, y: 150 }, data: { label: 'src/db/postgres.ts' }, className: 'react-flow__node-custom' },
  { id: '4', position: { x: 250, y: 300 }, data: { label: 'src/workers/queue.ts' }, className: 'react-flow__node-custom' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } }, // Simulating a high risk connection
];

export default function DependencyGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges as Edge[]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls style={{ backgroundColor: 'rgba(30, 30, 35, 0.8)', fill: 'white' }} />
        <MiniMap 
          nodeColor={(n) => {
            return n.id === '2' ? '#ef4444' : '#6366f1';
          }}
          style={{ backgroundColor: '#0a0a0c', maskImage: 'linear-gradient(to bottom, black, transparent)' }} 
        />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#333" />
      </ReactFlow>
    </div>
  );
}
