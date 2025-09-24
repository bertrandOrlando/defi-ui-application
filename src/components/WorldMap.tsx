import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Breadcrumbs,
  Link,
  Slider,
  Stack,
  TextField,
} from "@mui/material";
import { BiWorld } from "react-icons/bi";
import { MdCellTower } from "react-icons/md";
import { TbHierarchy } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { FaSliders } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import MapMarker from "./MapMarker";

export type WorldMapProps = {
  address: string;
  lat: number;
  long: number;
  enterprise: string;
  status: string;
  core: string;
  ran: string[];
  cpe: string[];
};

const MIN_ZOOM = 2;
const MAX_ZOOM = 9;

export const WorldMap = ({ data }: { data: WorldMapProps[] }) => {
  // Map
  const [zoom, setZoom] = useState<number>(4);
  const mapRef = useRef(null);

  // enterprise filter
  const locations = data.map((enterprise) => {
    const addressSplited = enterprise.address.split(",");

    return addressSplited[1] + ", " + addressSplited[2];
  });

  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState<WorldMapProps[]>(data);

  const searchHandler = (inputVal: string | null) => {
    setInputValue(inputVal || "");
    if (!inputVal) {
      setFilteredData(data);
      return;
    }

    const parts = inputVal.split(",").map((part) => part.trim());
    const city = parts[0] || "";
    const state = parts[1] || "";

    const newData = data.filter((enterprise) => {
      const address = enterprise.address.toLowerCase();
      const cityMatch = city ? address.includes(city.toLowerCase()) : true;
      const stateMatch = state ? address.includes(state.toLowerCase()) : true;

      return cityMatch && stateMatch;
    });

    setFilteredData(newData);
  };

  useEffect(() => {
    if (mapRef.current) {
      // @ts-expect-error *function setZoom must be exist*
      mapRef.current.setZoom(zoom);
    }
  }, [zoom, setZoom]);

  return (
    <>
      <div className="relative">
        <div
          id="zoom-control"
          className="absolute flex flex-col items-center justify-center gap-y-2 z-[1000] bottom-0 left-0 translate-x-4 -translate-y-6 bg-[#343434] py-2 px-1 rounded-xl "
        >
          <button
            onClick={() => setZoom(zoom + 1)}
            className="text-white text-2xl cursor-pointer"
          >
            +
          </button>
          <Stack sx={{ height: 100 }} spacing={1} direction="row">
            <Slider
              aria-label="zoom-control"
              orientation="vertical"
              defaultValue={zoom}
              onChange={(_, value) => setZoom(value as number)}
              valueLabelDisplay="auto"
              value={zoom}
              step={1}
              marks
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              sx={{
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "&.Mui-active": {
                    backgroundColor: "primary.dark",
                  },
                },
              }}
            />
          </Stack>
          <button
            onClick={() => setZoom(zoom - 1)}
            className="text-white text-2xl cursor-pointer"
          >
            -
          </button>
        </div>

        <div
          id="service-navigation"
          className="absolute z-[1000] p-6 text-sm w-full "
        >
          <div className="grid grid-cols-2">
            <Breadcrumbs
              aria-label="breadcrumb"
              className="col-span-2"
              separator="/"
            >
              <Link
                underline="hover"
                color="inherit"
                href="/dashboard"
                className="h-3"
              >
                <p className="text-xs text-[#bfc0c1]">Dashboard</p>
              </Link>
              <p className="text-xs text-[#ce7930]">Service Assurance</p>
            </Breadcrumbs>
            <h3 className="font-semibold text-xl text-white py-3">
              Service Assurance <span className="text-[#7dc161]">●</span>
            </h3>

            <div
              id="company-filter"
              className="w-full flex justify-end items-center"
            >
              {!isSearch ? (
                <>
                  <div
                    id="view-type"
                    className="bg-[#747282] h-7 p-[2px] flex flex-row rounded-sm"
                  >
                    <button className="cursor-pointer bg-[#355493] p-1 w-7 flex justify-center items-center rounded-sm">
                      <BiWorld color="white" />
                    </button>

                    <button className="cursor-pointer bg-[#355493] p-1 w-7 flex justify-center items-center rounded-sm">
                      <MdCellTower color="white" />
                    </button>

                    <button className="cursor-pointer bg-[#355493] p-1 w-7 flex justify-center items-center rounded-sm">
                      <TbHierarchy color="white" />
                    </button>
                  </div>
                  <div className="bg-[#747282] h-7 p-[2px] flex flex-row rounded-md ml-6">
                    <button
                      className="cursor-pointer p-1 w-7 flex justify-center items-center rounded-sm"
                      onClick={() => setIsSearch(true)}
                    >
                      <IoSearch color="white" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white flex rounded-md">
                  <Autocomplete
                    disablePortal
                    value={value}
                    onChange={(_, newValue) => {
                      setValue(newValue);
                    }}
                    inputValue={inputValue}
                    onInputChange={(_, newValue: string | null) =>
                      searchHandler(newValue)
                    }
                    options={locations}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Seach for a location" />
                    )}
                    size="small"
                  />
                  <button
                    className="cursor-pointer p-1 w-7 flex justify-center items-center rounded-sm"
                    onClick={() => setIsSearch(false)}
                  >
                    <IoIosClose className="text-xl" />
                  </button>
                </div>
              )}
              <div className="bg-[#747282] h-7 p-[2px] flex flex-row rounded-md ml-2">
                {!isFilter ? (
                  <button
                    className="cursor-pointer p-1 w-7 flex justify-center items-center rounded-sm"
                    onClick={() => setIsFilter(true)}
                  >
                    <FaSliders color="white" />
                  </button>
                ) : (
                  <button
                    className="cursor-pointer bg-[#355493] text-white p-1 w-7 flex justify-center items-center rounded-sm"
                    onClick={() => setIsFilter(false)}
                  >
                    <IoIosClose color="white" className="text-xl" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-screen h-screen ">
          <MapContainer
            className="h-full w-full "
            center={[33.4314, -93.2665]}
            zoom={zoom}
            zoomControl={false}
            ref={mapRef}
            scrollWheelZoom={false}
            touchZoom={false}
            doubleClickZoom={false}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="grayscale-100 invert-100 hue-rotate-180 brightness-95 contrast-[90%] "
            />

            {filteredData.map((enterprise, index) => (
              <MapMarker {...enterprise} key={`marker-${index}`} />
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default WorldMap;
