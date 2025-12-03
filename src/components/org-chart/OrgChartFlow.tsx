"use client";

import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import OrgChartCustomNode from "./OrgChartCustomNode";
import { OrgNode } from "@/types/org-chart-types";

// Node types for React Flow
const nodeTypes = {
  customNode: OrgChartCustomNode,
};

// Dagre layout configuration
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 256; // w-64 in pixels
const nodeHeight = 180; // Approximate height of custom node

/**
 * Auto-layout nodes using Dagre algorithm
 */
function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: string = "TB"
) {
  dagreGraph.setGraph({ rankdir: direction, nodesep: 80, ranksep: 120 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Convert OrgNode tree structure to React Flow nodes and edges
 */
function convertOrgTreeToFlow(orgNode: OrgNode): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function traverse(node: OrgNode, parentId?: string) {
    nodes.push({
      id: node.id,
      type: "customNode",
      data: {
        name: node.name,
        role: node.role,
        avatar: node.avatar,
        directReports: node.children?.length || 0,
      },
      position: { x: 0, y: 0 }, // Will be set by Dagre
    });

    if (parentId) {
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: "smoothstep",
        style: { stroke: "#d1d5db", strokeWidth: 2 },
        animated: false,
      });
    }

    node.children?.forEach((child) => traverse(child, node.id));
  }

  traverse(orgNode);
  return { nodes, edges };
}

interface OrgChartFlowProps {
  orgData: OrgNode;
}

function OrgChartFlowInner({ orgData }: OrgChartFlowProps) {
  // Convert tree to flow format and apply layout
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const { nodes, edges } = convertOrgTreeToFlow(orgData);
    return getLayoutedElements(nodes, edges, "TB");
  }, [orgData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
      >
        {/* Dot Grid Background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#e5e7eb"
          className="bg-gray-50"
        />

        {/* Zoom Controls */}
        <Controls
          showInteractive={false}
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
        />

        {/* MiniMap */}
        <MiniMap
          nodeColor={(node) => "#3b82f6"}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}

export default function OrgChartFlow({ orgData }: OrgChartFlowProps) {
  return (
    <ReactFlowProvider>
      <OrgChartFlowInner orgData={orgData} />
    </ReactFlowProvider>
  );
}
