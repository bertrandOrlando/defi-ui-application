import React, { useState } from "react";
import treeData from "../data/treeData.json";
import "@xyflow/react/dist/style.css";
import { ReactFlowProvider, useReactFlow } from "@xyflow/react";
import Slider from "@mui/material/Slider";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Handle,
  Position,
} from "@xyflow/react";

import Header from "../component/header";
import DynamicBreadcrumb from "../component/DynamicBreadCrumbs";
import { useNavigate } from "react-router-dom";

/* TODO :
 * - Buat Alarm, konek dengan data, tampilan pake MUI
 * - Buat Location, konek dengan data juga.
 * - Selain itu all working
 */

const ServiceAssuranceTreeView = () => {
  const [focusedMode, setFocusedMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);

  const navigate = useNavigate();

  //debugging
  // React.useEffect(() => {
  //   console.log("selectedId:", selectedId);
  // }, [selectedId]);

  // React.useEffect(() => {
  //   if (selectedId) {
  //     const descendants = getDescendants(selectedId);
  //     console.log("descendants of", selectedId, ":", descendants);
  //   }
  // }, [selectedId]);

  React.useEffect(() => {
    if (selectedId) {
      const descendants = getDescendants(selectedId);
      setHighlightedIds([selectedId, ...descendants]);
    } else {
      setHighlightedIds([]);
    }
  }, [selectedId, setHighlightedIds]);

  type BoxNodeProps = {
    data: { label: string; bg: string; isHighlighted?: boolean };
  };

  const BoxNode = ({ data }: BoxNodeProps) => {
    const isHighlighted = !!data.isHighlighted;
    const base = data.bg as string;
    const bg = isHighlighted ? base : "transparent";
    const text = isHighlighted ? "#000000" : base;
    const border = base;

    return (
      <div
        style={{
          background: bg,
          color: text,
          borderRadius: 6,
          width: 120,
          height: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: isHighlighted ? 600 : 500,
          border: `2px solid ${border}`,
          transition: "background 150ms, color 150ms, box-shadow 150ms",
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{ opacity: 0, pointerEvents: "none" }}
        />
        {data.label}
        <Handle
          type="source"
          position={Position.Right}
          style={{ opacity: 0, pointerEvents: "none" }}
        />
      </div>
    );
  };

  type Kind = "enterprise" | "site" | "core" | "ran" | "cpe" | "unknown";

  const COLOR_MAP: Record<string, string> = {
    enterprise: "#3B82F6",
    site: "#10B981",
    core: "#10B981",
    ran: "#F59E0B",
    cpe: "#06B6D4",
    unknown: "#9CA3AF",
  };
  function getKindFromId(id: string): Kind {
    const low = id.toLowerCase();
    if (low.startsWith("ent")) return "enterprise";
    if (low.startsWith("site")) return "site";
    if (low.startsWith("core")) return "core";
    if (low.startsWith("ran")) return "ran";
    if (low.startsWith("cpe")) return "cpe";
    return "unknown";
  }

  const nodes = treeData.nodes.map((n) => {
    const kind = getKindFromId(n.id);
    return {
      ...n,
      type: "box",
      data: {
        ...n.data,
        bg: COLOR_MAP[kind],
      },
    };
  });

  const edges = treeData.edges.map((e) => {
    const kind = getKindFromId(e.target);
    return {
      ...e,
      type: "bezier",
      style: { stroke: COLOR_MAP[kind], strokeWidth: 2 },
    };
  });

  const childMap: Record<string, string[]> = {};
  edges.forEach((edge) => {
    if (!childMap[edge.source]) {
      childMap[edge.source] = [];
    }
    childMap[edge.source].push(edge.target);
  });

  const parentMap: Record<string, string | undefined> = {};
  edges.forEach((e) => {
    parentMap[e.target] = e.source;
  });

  function getDescendants(nodeId: string): string[] {
    const result: string[] = [];
    const stack = [nodeId];

    while (stack.length > 0) {
      const current = stack.pop()!;
      const children = childMap[current] || [];
      for (const child of children) {
        result.push(child);
        stack.push(child);
      }
    }

    return result;
  }

  function getAncestors(nodeId: string): string[] {
    const res: string[] = [];
    let cur = parentMap[nodeId];
    while (cur) {
      res.push(cur);
      cur = parentMap[cur];
    }
    return res;
  }

  function getRootEnterprise(nodeId: string) {
    let cur: string | undefined = nodeId;
    while (cur) {
      if (getKindFromId(cur) === "enterprise") {
        return nodes.find((n) => n.id === cur) ?? null;
      }
      cur = parentMap[cur];
    }
    return null;
  }

  function pickByKind(ids: string[], kind: Kind) {
    return ids
      .map((id) => nodes.find((n) => n.id === id))
      .filter(
        (n): n is NonNullable<typeof n> => !!n && getKindFromId(n.id) === kind
      );
  }

  const panelData = React.useMemo(() => {
    if (!selectedId) return null;

    const rootEnterprise = getRootEnterprise(selectedId);
    const subtree = [selectedId, ...getDescendants(selectedId)];
    const ancestors = getAncestors(selectedId);
    const combinedIds = Array.from(new Set([...subtree, ...ancestors]));

    return {
      rootEnterprise,
      sites: pickByKind(combinedIds, "site"),
      core: pickByKind(combinedIds, "core"),
      ran: pickByKind(combinedIds, "ran"),
      cpe: pickByKind(combinedIds, "cpe"),
    };
  }, [selectedId, nodes]);

  // id untuk focus on
  const visibleIds = React.useMemo(() => {
    if (!focusedMode || !selectedId) return null;
    return new Set([selectedId, ...getDescendants(selectedId)]);
  }, [focusedMode, selectedId]);

  // node/edge focus
  const filteredNodes = React.useMemo(() => {
    const base = nodes.map((n) => ({
      ...n,
      data: { ...n.data, isHighlighted: highlightedIds.includes(n.id) },
    }));

    if (!visibleIds) return base;

    return base.filter((n) => visibleIds.has(n.id));
  }, [nodes, highlightedIds, visibleIds]);

  const filteredEdges = React.useMemo(() => {
    if (!visibleIds) return edges;
    return edges.filter(
      (e) => visibleIds.has(e.source) && visibleIds.has(e.target)
    );
  }, [edges, visibleIds]);

  //zoom slider mui
  const ZoomSlider: React.FC<{
    value: number;
    onChange: (z: number) => void;
  }> = ({ value, onChange }) => {
    const { zoomTo } = useReactFlow();

    const handleChange = (_: Event, newValue: number | number[]) => {
      const v = Array.isArray(newValue) ? newValue[0] : newValue;
      onChange(v);
      zoomTo(v);
    };

    const handleZoomIn = () => {
      const newZoom = Math.min(value + 0.1, 2);
      onChange(newZoom);
      zoomTo(newZoom);
    };

    const handleZoomOut = () => {
      const newZoom = Math.max(value - 0.1, 0.2);
      onChange(newZoom);
      zoomTo(newZoom);
    };

    return (
      <div
        className="fixed left-7 bottom-7 z-50 flex flex-col items-center bg-[#3a3a3a] rounded-lg "
        style={{ pointerEvents: "auto" }}
      >
        <button
          onClick={handleZoomIn}
          className="text-white text-xl mb-2 hover:bg-[#4a4a4a] rounded w-8 h-8 flex items-center justify-center transition-colors"
        >
          +
        </button>
        <Slider
          orientation="vertical"
          value={value}
          min={0.2}
          max={2}
          step={0.05}
          valueLabelDisplay="off"
          onChange={handleChange}
          sx={{
            height: 120,
            color: "#fff",
            "& .MuiSlider-track": {
              width: 3,
              background: "#4a7c9e",
              border: "none",
            },
            "& .MuiSlider-rail": {
              width: 3,
              backgroundColor: "#acacacff",
              opacity: 1,
            },
            "& .MuiSlider-thumb": {
              width: 24,
              height: 12,
              borderRadius: "6px",
              backgroundColor: "#fff",
              "&:hover, &.Mui-focusVisible": {
                boxShadow: "0 0 0 8px rgba(255, 255, 255, 0.16)",
              },
              "&.Mui-active": {
                boxShadow: "0 0 0 14px rgba(255, 255, 255, 0.16)",
              },
            },
          }}
          aria-label="Zoom"
        />
        <button
          onClick={handleZoomOut}
          className="text-white text-xl mt-2 hover:bg-[#4a4a4a] rounded w-8 h-8 flex items-center justify-center transition-colors"
        >
          −
        </button>
      </div>
    );
  };

  const nodeTypes = { box: BoxNode };

  return (
    <div className="min-h-screen bg-[#282828] text-white flex flex-col">
      {/* <FloatingHeader /> */}

      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <Header />
      </div>

      <div className="fixed left-7 top-24 z-50 flex flex-col space-y-4">
        <div className="flex flex-col space-y-1">
          <DynamicBreadcrumb />
          <h1 className="text-2xl font-bold text-white mt-1">
            Service Assurance
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-white font-medium">Focused</span>
          <div
            className={`w-10 h-6 rounded-full cursor-pointer transition-colors 
              ${focusedMode ? "bg-green-500" : "bg-gray-500"}`}
            onClick={() => setFocusedMode(!focusedMode)}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform duration-200
                ${focusedMode ? "translate-x-4" : "translate-x-0.5"}`}
            />
          </div>
        </div>
      </div>

      <div className="w-full h-screen">
        <ReactFlowProvider>
          <ReactFlow
            nodes={filteredNodes}
            edges={filteredEdges}
            fitView
            onNodeClick={(_, node) => {
              setSelectedId((prev) => (prev === node.id ? null : node.id));
            }}
            onPaneClick={() => setSelectedId(null)}
            onMove={(_, viewport) => setZoom(viewport.zoom)}
            nodeTypes={nodeTypes}
            fitViewOptions={{ padding: 0.2 }}
            panOnScroll
            nodesDraggable={false}
            zoomOnDoubleClick={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Lines}
              gap={20}
              color="#444"
              lineWidth={0.3}
            />
          </ReactFlow>
          <ZoomSlider value={zoom} onChange={setZoom} />
          {/* Floating keterangan (ran, cpe)*/}
          <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-2 rounded-sm"
            style={{
              background: "rgba(60, 60, 60, 0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(6px)",
              pointerEvents: "none", // tidak block zoom
            }}
          >
            <div className="flex items-center space-x-6 text-sm text-white/90">
              {/* Enterprise */}
              <div className="flex items-center space-x-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: "#3B82F6" }}
                />
                <span>Enterprise</span>
              </div>

              {/* Sites */}
              <div className="flex items-center space-x-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: "#10B981" }}
                />
                <span>Sites</span>
              </div>

              {/* Core */}
              <div className="flex items-center space-x-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: "#10B981" }}
                />
                <span>Core</span>
              </div>

              {/* RAN */}
              <div className="flex items-center space-x-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: "#F59E0B" }}
                />
                <span>RAN</span>
              </div>

              {/* CPE */}
              <div className="flex items-center space-x-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: "#06B6D4" }}
                />
                <span>CPE</span>
              </div>
            </div>
          </div>
          {selectedId && panelData && (
            <div
              className="fixed right-4 top-28 bottom-16 w-80 z-[200] rounded-2xl shadow-2xl p-2 flex flex-col"
              style={{
                background: "rgba(47,48,53,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(6px)",
              }}
            >
              {/* HEADER */}
              <div className="flex items-start justify-between px-4 pt-3">
                <div className="font-semibold">
                  {panelData.rootEnterprise
                    ? panelData.rootEnterprise.data.label
                    : "Enterprise"}
                </div>
              </div>
              <div className="mx-4 h-px bg-white/15 my-3"></div>

              {/* BODY */}
              <div className="p-4 pt-2 text-sm space-y-3 flex-1 overflow-y-auto">
                {panelData.sites.length > 0 && (
                  <div>
                    <div className="text-white/60 mb-1">Sites</div>
                    <div className="flex flex-wrap gap-1">
                      {panelData.sites.map((n) => (
                        <span
                          key={n.id}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ border: `1px solid ${n.data.bg}` }}
                        >
                          {n.data.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {panelData.core.length > 0 && (
                  <div>
                    <div className="text-white/60 mb-1">Core</div>
                    <div className="flex flex-wrap gap-1">
                      {panelData.core.map((n) => (
                        <span
                          key={n.id}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${n.data.bg}20`,
                            border: `1px solid ${n.data.bg}`,
                          }}
                        >
                          {n.data.label}
                        </span>
                      ))}
                    </div>
                    <div className="mx-4 h-px bg-white/15 my-4"></div>
                  </div>
                )}

                {panelData.ran.length > 0 && (
                  <div>
                    <div className="text-white/60 mb-1">RAN</div>
                    <div className="flex flex-wrap gap-1">
                      {panelData.ran.map((n) => (
                        <span
                          key={n.id}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${n.data.bg}20`,
                            border: `1px solid ${n.data.bg}`,
                          }}
                        >
                          {n.data.label}
                        </span>
                      ))}
                    </div>
                    <div className="mx-4 h-px bg-white/15 my-4"></div>
                  </div>
                )}

                {panelData.cpe.length > 0 && (
                  <div>
                    <div className="text-white/60 mb-1">CPE</div>
                    <div className="flex flex-wrap gap-1 max-h-50 pr-1">
                      {panelData.cpe.map((n) => (
                        <span
                          key={n.id}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${n.data.bg}20`,
                            border: `1px solid ${n.data.bg}`,
                          }}
                        >
                          {n.data.label}
                        </span>
                      ))}
                    </div>
                    <div className="mx-4 h-px bg-white/15 my-4"></div>
                  </div>
                )}

                {/* REPORTS */}
                <div>
                  <div className="text-white/60 mb-2">Reports</div>

                  {/* Alarms card ,MASIH BUAT TAMPILAN DOANG*/}
                  <button
                    className="w-full flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 transition-colors px-2 py-2 mb-3"
                    onClick={() => console.log("open alarms")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-600/25 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5 text-purple-300 fill-current"
                        >
                          <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2Z" />
                        </svg>
                      </div>
                      <span className="text-white">2 Alarms</span>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-white/70 fill-current"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>

                  {/* Locations card, MASIH BUAT TAMPILAN DOANG */}
                  <button
                    className="w-full flex items-center justify-between rounded-xl bg-white/5 hover:bg-white/10 transition-colors px-2 py-2"
                    onClick={() => console.log("open locations")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-600/25 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-5 h-5 text-pink-300 fill-current"
                        >
                          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                        </svg>
                      </div>
                      <span className="text-white">2 Locations</span>
                    </div>
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-white/70 fill-current"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* FOOTER */}
              <div className="px-4 pb-3 pt-2 flex items-center gap-3">
                <button
                  className="flex-1 flex items-center justify-center gap-2 rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-2 py-2 transition-colors text-sm"
                  onClick={() => navigate('/service-assurance/dashboard')}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M3 3h2v18H3V3Zm4 10h2v8H7v-8Zm4-6h2v14h-2V7Zm4 4h2v10h-2V11Zm4-8h2v18h-2V3Z" />
                  </svg>
                  Service Assurance
                </button>

                <button
                  onClick={() => setSelectedId(null)}
                  className="rounded-sm bg-white/10 hover:bg-white/15 text-white px-2 py-2 transition-colors text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default ServiceAssuranceTreeView;
