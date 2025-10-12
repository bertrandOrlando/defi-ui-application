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

import { PieChart } from "@mui/x-charts/PieChart";


import Header from "../component/header";
import DynamicBreadcrumb from "../component/DynamicBreadCrumbs";
import { viewTypes, type ViewType } from "./ServiceAssurance";
import { BiWorld } from "react-icons/bi";
import { MdCellTower } from "react-icons/md";
import { TbHierarchy } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

/* TODO :
 * - all working!!!
 */

const ServiceAssuranceTreeView = ({
  view,
  setView,
}: {
  view: ViewType;
  setView: (view: ViewType) => void;
}) => {
  const [focusedMode, setFocusedMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const [isAlarmsExpanded, setIsAlarmsExpanded] = useState(false);
  const [isLocationsExpanded, setIsLocationsExpanded] = useState(false);
  const [editedLocations, setEditedLocations] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  

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

 const COLORS = {
  text: '#e5e7eb',
  critical: '#c4515d',
  warning: '#e3b347',
  minor: '#079487',
  bg: '#1e1e1e',
  divider: '#333',
};

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex flex-col items-center min-w-[70px]">
    <div className="inline-flex items-center gap-1 text-xs" style={{ color: COLORS.text }}>
      <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </div>
  </div>
);

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

  const reportData = React.useMemo(() => {
    if (!selectedId) return null;
    const subtreeIds = [selectedId, ...getDescendants(selectedId)];
    const relevantNodes = nodes.filter((n) => subtreeIds.includes(n.id));
    const allAlarms = relevantNodes.flatMap((n) => n.data.alarms || []);

    const alarmCounts = allAlarms.reduce(
      (acc, alarm) => {
        acc[alarm.severity] = (acc[alarm.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const allLocations = relevantNodes.flatMap((n) => n.data.locations || []);
    const uniqueLocations = [...new Set(allLocations)];

    return {
      totalAlarms: allAlarms.length,
      alarmCounts,
      locations: uniqueLocations,
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
      {/* Header floating*/}

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

      <div className="fixed right-7 top-24 z-50 flex flex-col space-y-4">
        <div></div>
        <div
          id="view-type"
          className="bg-[#747282] h-7 p-[2px] flex flex-row rounded-sm"
        >
          <button
            className={`${
              view === viewTypes.Map ? `bg-[#355493]` : `cursor-pointer`
            } p-1 w-7 flex justify-center items-center rounded-sm`}
            onClick={() => setView(viewTypes.Map)}
          >
            <BiWorld color="white" />
          </button>

          <button
            className={`${
              view === viewTypes.Satelite ? `bg-[#355493]` : `cursor-pointer`
            } p-1 w-7 flex justify-center items-center rounded-sm`}
            onClick={() => setView(viewTypes.Satelite)}
          >
            <MdCellTower color="white" />
          </button>

          <button
            className={`${
              view === viewTypes.Tree ? `bg-[#355493]` : `cursor-pointer`
            } p-1 w-7 flex justify-center items-center rounded-sm`}
            onClick={() => setView(viewTypes.Tree)}
          >
            <TbHierarchy color="white" />
          </button>
        </div>
      </div>

      <div className="w-full h-screen">
        <ReactFlowProvider>
          <ReactFlow
            nodes={filteredNodes}
            edges={filteredEdges}
            fitView
            onNodeClick={(_, node) => {
              setSelectedId((prev) => {
                const newId = prev === node.id ? null : node.id;
                if (prev !== node.id) {
                  setIsAlarmsExpanded(false);
                  setIsLocationsExpanded(false);
                }
                return newId;
              });
            }}
            onPaneClick={() => {
              setSelectedId(null);
              setIsAlarmsExpanded(false);
              setIsLocationsExpanded(false);
            }}
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
                {reportData && (
                  <div>
                    <div className="text-white/60 mb-2">Reports</div>

                    {/* Alarms Card  */}
                    <div className="rounded-xl bg-white/5 overflow-hidden mb-3">
                      <button
                        className="w-full flex items-center justify-between hover:bg-white/10 transition-colors px-2 py-2"
                        onClick={() => setIsAlarmsExpanded(!isAlarmsExpanded)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-600/25 flex items-center justify-center">
                            {/* Bell Icon */}
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-300 fill-current">
                              <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5L4 18v1h16v-1l-2-2Z" />
                            </svg>
                          </div>
                          <span className="text-white">
                            {reportData.totalAlarms} Alarm{reportData.totalAlarms !== 1 ? "s" : ""}
                          </span>
                        </div>
                        {/* Location Icon */}
                        <svg
                          viewBox="0 0 20 20"
                          className={`w-5 h-5 text-white/70 fill-current transition-transform duration-300 ${isAlarmsExpanded ? "rotate-90" : ""}`}
                        >
                          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/*Alarm Content yang extended - PIE CHART */}
                  {isAlarmsExpanded && reportData.totalAlarms > 0 && (
                    <div className="mx-2 mb-2 p-2 rounded-lg bg-[#2b2b2b] border border-white/10">
                      {/* Title */}
                      <div className="text-center text-white text-sm ">
                        Open Alarms Severity (%)
                      </div>

                      {/* Pie Chart */}
                      <div className="flex justify-center">
                        <PieChart
                          width={240}
                          height={200}
                          series={[
                            {
                              data: [
                                { id: 0, value: reportData.alarmCounts.Minor || 0, label: 'Minor' },
                                { id: 1, value: reportData.alarmCounts.Warning || 0, label: 'Warning' },
                                { id: 2, value: reportData.alarmCounts.Critical || 0, label: 'Critical' },
                              ],
                              innerRadius: 0,
                              outerRadius: 80,
                            },
                          ]}
                          colors={[COLORS.minor, COLORS.warning, COLORS.critical]}
                          sx={{
                            '& .MuiChartsLegend-root': { display: 'none' },
                            '& text': { fill: COLORS.text },
                            '& path': { stroke: '#2b2b2b', strokeWidth:2 },
                          }}
                        />
                      </div>

                      {/* Custom Legend */}
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <LegendItem color={COLORS.minor} label="Minor" />
                        <LegendItem color={COLORS.warning} label="Warning" />
                        <LegendItem color={COLORS.critical} label="Critical" />
                      </div>
                    </div>
                  )}
                  </div>

                  {/* Locations Card */}
                  <div className="rounded-xl bg-white/5 overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between hover:bg-white/10 transition-colors px-2 py-2"
                      onClick={() => setIsLocationsExpanded(!isLocationsExpanded)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-600/25 flex items-center justify-center">
                          {/* Location Icon */}
                          <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-300 fill-current">
                            <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
                          </svg>
                        </div>
                        <span className="text-white">
                          {reportData.locations.length} Location{reportData.locations.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {/* Chevron Icon */}
                      <svg
                        viewBox="0 0 20 20"
                        className={`w-5 h-5 text-white/70 fill-current transition-transform duration-300 ${isLocationsExpanded ? "rotate-90" : ""}`}
                      >
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Location Content Yang udah dibuka */}
                    {isLocationsExpanded && reportData.locations.length > 0 && (
                    <div className="p-4 pt-2 space-y-3 text-xs text-white/80">
                      {reportData.locations.map((loc, index) => {
                        const currentValue =
                          editedLocations[index] ?? loc;

                        return (
                          <div key={index}>
                            {editingIndex === index ? (
                              <>
                                {/* Editable input */}
                              <textarea
                                  value={currentValue}
                                  onChange={(e) => {
                                    const next = [...editedLocations];
                                    next[index] = e.target.value;
                                    setEditedLocations(next);
                                  }}
                                  rows={2}
                                  className="w-full rounded-md bg-[#2b2b2b] text-white/90 px-2 py-1 text-xs resize-none 
                                            focus:outline-none focus:bg-[#333333] transition-colors break-words"
                                  placeholder="Edit location..."
                                />

                                {/* Save / Cancel */}
                                <div className="mt-2 flex justify-end gap-4 text-[11px] underline font-semibold">
                                  <button
                                    onClick={() => setEditingIndex(null)}
                                    className="text-white hover:opacity-80 transition-opacity"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => {
                                      const updated = [...reportData.locations];
                                      updated[index] = editedLocations[index];
                                      setEditedLocations(updated);
                                      setEditingIndex(null);
                                    }}
                                    className="text-white hover:opacity-80 transition-opacity"
                                  >
                                    Save
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <p>{currentValue}</p>
                                <div className="mt-2 flex gap-4 text-[11px] underline font-semibold">
                                  <button
                                    className="text-white hover:opacity-80 transition-opacity"
                                    onClick={() =>
                                      window.open(
                                      )
                                    }
                                  >
                                    View Map
                                  </button>
                                  <button
                                    onClick={() => setEditingIndex(index)}
                                    className="text-white hover:opacity-80 transition-opacity"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </>
                            )}
                            <div className="my-3 border-b border-white/10" />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  </div>
                </div>
              )}
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
