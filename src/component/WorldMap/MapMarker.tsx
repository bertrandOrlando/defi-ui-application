import { Popup } from "react-leaflet/Popup";
import { Marker } from "react-leaflet/Marker";
import L from "leaflet";
import { BsGraphUp } from "react-icons/bs";
import { GoOrganization } from "react-icons/go";
import type { WorldMapProps } from "./WorldMap";
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Healthy":
      return "#7dc161"; // Green
    case "Major":
      return "#ffcd2e"; // Yellow
    case "Critical":
      return "#d1664f"; // Red
    default:
      return "#6c757d"; // Grey
  }
};

const getOfficeIcon = (status: string) => {
  const color = getStatusColor(status);

  const iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="15" fill="${color}" stroke="black" stroke-width="1.5"/>
        <g transform="translate(4, 4)">
            <path fill="black" d="M4 22V8l8-4l8 4v14h-4v-7h-4v7H4m2-2h2v-3h4v3h2V9l-4-2l-4 2v11Z"/>
        </g>
      </svg>`;

  return L.divIcon({
    html: iconHtml,
    className: "custom-leaflet-icon",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#344043",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});

type MapMarkerProps = {
  enterprise: WorldMapProps;
  onUpdateAddress: (id: number, newAddress: string) => void;
};

const MapMarker = ({ enterprise, onUpdateAddress }: MapMarkerProps) => {
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const [address, setAddress] = useState<string>(enterprise.address);

  const cancelHandler = () => {
    setIsEdited(false);
    setAddress(enterprise.address);
  };

  const saveHandler = () => {
    onUpdateAddress(enterprise.id, address);
    setIsEdited(false);
  };

  useEffect(() => {
    setAddress(enterprise.address); // keep local state in sync with props
  }, [enterprise.address]);

  const { lat, long } = enterprise;
  const position: [number, number] = [lat, long];

  return (
    <ThemeProvider theme={theme}>
      <Marker position={position} icon={getOfficeIcon(enterprise.status)}>
        <Popup closeOnClick={false} className="popup text-white bg-[#343536]">
          <h1 className="font-semibold text-base flex items-center gap-x-2">
            <GoOrganization color="grey" /> {enterprise.enterprise}
          </h1>
          <div className="w-56 h-[1px] bg-slate-500 my-2"></div>
          <div className="text-white text-xs w-56 flex gap-2 flex-wrap">
            <span className="px-2 bg-[#3a4438] border border-[#66b248] inline-block rounded-lg">
              {enterprise.core}
            </span>
            <span className="px-2 bg-[#344043] border border-[#33798c] inline-block rounded-lg">
              {enterprise.ran}
            </span>
            {enterprise.cpe.map((cpe, index) => {
              return (
                <span
                  className="px-2 bg-[#344043] border border-[#33798c] inline-block rounded-lg"
                  key={`cpe-${cpe}-${index}`}
                >
                  {cpe}
                </span>
              );
            })}
          </div>
          <div className="w-56 h-[1px] bg-slate-500 my-2"></div>
          {!isEdited ? (
            <>
              <p>{address}</p>
              <button
                className="cursor-pointer underline"
                onClick={() => setIsEdited(true)}
              >
                Edit
              </button>
            </>
          ) : (
            <>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                className="text-white w-full p-2 bg-[#282828] resize-none"
              />
              <div className="flex gap-x-4">
                <button
                  onClick={cancelHandler}
                  className="underline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={saveHandler}
                  className="underline cursor-pointer"
                >
                  Save
                </button>
              </div>
            </>
          )}
          <div className="w-56 h-[1px] bg-slate-500 my-2"></div>
          <button className="pr-3 cursor-pointer flex items-center gap-x-2 bg-[#355493]">
            <span className="bg-[#4a659e] p-2">
              <BsGraphUp color="white" />
            </span>
            Service Assurance
          </button>
        </Popup>
      </Marker>
    </ThemeProvider>
  );
};

export default MapMarker;
