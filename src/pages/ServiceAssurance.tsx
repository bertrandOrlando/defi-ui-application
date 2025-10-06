import { useState } from "react";
import WorldMap from "../component/WorldMap/WorldMap";
import enterpriseData from "../data/enterprise.json";
import ServiceAssuranceTreeView from "./ServiceAssuranceTreeView";

// eslint-disable-next-line react-refresh/only-export-components
export const viewTypes = {
  Map: "Map",
  Satelite: "Satelite",
  Tree: "Tree",
} as const;

export type ViewType = keyof typeof viewTypes;

const ServiceAssurance = () => {
  const [view, setView] = useState<ViewType>(viewTypes.Map);

  return (
    <>
      {view === viewTypes.Map && (
        <WorldMap data={enterpriseData} view={view} setView={setView} />
      )}
      {view === viewTypes.Satelite && (
        <WorldMap data={enterpriseData} view={view} setView={setView} />
      )}
      {view === viewTypes.Tree && <ServiceAssuranceTreeView />}
    </>
  );
};

export default ServiceAssurance;
