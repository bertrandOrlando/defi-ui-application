import { useState } from "react";
import WorldMap from "../component/WorldMap/WorldMap";
import enterpriseData from "../data/enterprise.json";
import ServiceAssuranceTreeView from "./ServiceAssuranceTreeView";

const ServiceAssurance = () => {
  const [view, setView] = useState("mdap");
  return (
    <>
      {view === "map" ? (
        <WorldMap data={enterpriseData} />
      ) : (
        <ServiceAssuranceTreeView />
      )}
    </>
  );
};

export default ServiceAssurance;
