import "leaflet/dist/leaflet.css";
import "./WorldMap.css";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Autocomplete,
  Breadcrumbs,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Link,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { BiWorld } from "react-icons/bi";
import { MdCellTower } from "react-icons/md";
import { TbHierarchy } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import { FaSliders } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";
import MapMarker from "./MapMarker";
import { viewTypes, type ViewType } from "../../pages/ServiceAssurance";
import Header from "../header";

export type WorldMapProps = {
  id: number;
  address: string;
  lat: number;
  long: number;
  enterprise: string;
  status: string;
  core: string;
  ran: string[];
  cpe: string[];
};

const MIN_ZOOM = 3;
const MAX_ZOOM = 9;

export const WorldMap = ({
  data,
  view,
  setView,
}: {
  data: WorldMapProps[];
  view: ViewType;
  setView: (view: ViewType) => void;
}) => {
  // Map
  const [zoom, setZoom] = useState<number>(5);
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
    const input = inputVal || "";
    setInputValue(input);
    setValue(input);

    let newData = data;

    if (input) {
      const parts = input.split(",").map((part) => part.trim());
      const city = parts[0] || "";
      const state = parts[1] || "";

      newData = newData.filter((enterprise) => {
        const address = enterprise.address.toLowerCase();
        const cityMatch = city ? address.includes(city.toLowerCase()) : true;
        const stateMatch = state ? address.includes(state.toLowerCase()) : true;
        return cityMatch && stateMatch;
      });
    }

    setFilteredData(newData); // Apply only search filter
  };

  // Filter
  const [status, setStatus] = useState({
    Healthy: false,
    Major: false,
    Critical: false,
  });

  const [filters, setFilters] = useState({
    enterprise: "All Enterprise",
    core: "All Core",
    ran: "All RAN",
    cpe: "All CPE",
  });

  const handleStatusChange = (name: string) => {
    setStatus((prev) => ({
      ...prev,
      [name]: !prev[name as keyof typeof status],
    }));
  };

  const resetFilters = () => {
    setStatus({ Healthy: false, Major: false, Critical: false });
    setFilters({
      enterprise: "All Enterprise",
      core: "All Core",
      ran: "All RAN",
      cpe: "All CPE",
    });
    setInputValue("");
    setValue(null);
  };

  // @ts-expect-error I don't know what's the type of this event
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name) {
      setFilters((prev) => ({ ...prev, [name]: value as string }));
    }
  };

  const applyFilters = () => {
    let newData = data;

    // Handle search (city, state)
    if (inputValue) {
      const parts = inputValue.split(",").map((part) => part.trim());
      const city = parts[0] || "";
      const state = parts[1] || "";

      newData = newData.filter((enterprise) => {
        const address = enterprise.address.toLowerCase();
        const cityMatch = city ? address.includes(city.toLowerCase()) : true;
        const stateMatch = state ? address.includes(state.toLowerCase()) : true;
        return cityMatch && stateMatch;
      });
    }

    // Handle status filter
    const activeStatus = Object.keys(status).filter(
      (key) => status[key as keyof typeof status]
    );
    if (activeStatus.length > 0) {
      newData = newData.filter((enterprise) =>
        activeStatus.includes(enterprise.status)
      );
    }

    // Handle dropdown filters
    if (filters.enterprise !== "All Enterprise") {
      newData = newData.filter((e) => e.enterprise === filters.enterprise);
    }
    if (filters.core !== "All Core") {
      newData = newData.filter((e) => e.core === filters.core);
    }
    if (filters.ran !== "All RAN") {
      newData = newData.filter((e) => e.ran.includes(filters.ran));
    }
    if (filters.cpe !== "All CPE") {
      newData = newData.filter((e) => e.cpe.includes(filters.cpe));
    }

    setFilteredData(newData);
  };

  const enterpriseOptions = useMemo(
    () => [
      "All Enterprise",
      ...Array.from(new Set(data.map((d) => d.enterprise))),
    ],
    [data]
  );

  const coreOptions = useMemo(
    () => ["All Core", ...Array.from(new Set(data.map((d) => d.core)))],
    [data]
  );

  const ranOptions = useMemo(
    () => ["All RAN", ...Array.from(new Set(data.flatMap((d) => d.ran)))],
    [data]
  );

  const cpeOptions = useMemo(
    () => ["All CPE", ...Array.from(new Set(data.flatMap((d) => d.cpe)))],
    [data]
  );

  useEffect(() => {
    if (mapRef.current) {
      // @ts-expect-error *function setZoom must be exist*
      mapRef.current.setZoom(zoom);
    }
  }, [zoom, setZoom]);

  // Marker
  const updateAddress = (id: number, newAddress: string) => {
    setFilteredData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, address: newAddress } : item
      )
    );
  };

  return (
    <>
      <div className="relative">
        <Header className="absolute z-[1000]" />
        <div
          id="zoom-control"
          className="absolute flex flex-col items-center justify-center gap-y-2 z-[1000] bottom-0 left-0 translate-x-4 -translate-y-6 bg-[#343434] py-2 px-1 rounded-xl "
        >
          {/* <button
            onClick={() => setZoom((prev) => prev + 1)}
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
          </button> */}
          <button
            onClick={() => setZoom((prev) => prev + 1)}
            className="text-white text-xl mb-2 hover:bg-[#4a4a4a] rounded w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            +
          </button>
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
          />
          <button
            onClick={() => setZoom((prev) => prev - 1)}
            className="text-white text-xl mt-2 hover:bg-[#4a4a4a] rounded w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
          >
            −
          </button>
        </div>

        <div
          id="service-navigation"
          className="absolute z-[1000] p-6 text-sm w-full top-12 pointer-events-none"
        >
          <div className="grid grid-cols-2 ">
            <Breadcrumbs
              aria-label="breadcrumb"
              className="col-span-2 pointer-events-auto"
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
                    className="bg-[#747282] h-7 p-[2px] flex flex-row rounded-sm pointer-events-auto"
                  >
                    <button
                      className={`${
                        view === viewTypes.Map
                          ? `bg-[#355493]`
                          : `cursor-pointer`
                      } p-1 w-7 flex justify-center items-center rounded-sm`}
                      onClick={() => setView(viewTypes.Map)}
                    >
                      <BiWorld color="white" />
                    </button>

                    <button
                      className={`${
                        view === viewTypes.Satelite
                          ? `bg-[#355493]`
                          : `cursor-pointer`
                      } p-1 w-7 flex justify-center items-center rounded-sm`}
                      onClick={() => setView(viewTypes.Satelite)}
                    >
                      <MdCellTower color="white" />
                    </button>

                    <button
                      className={`${
                        view === viewTypes.Tree
                          ? `bg-[#355493]`
                          : `cursor-pointer`
                      } p-1 w-7 flex justify-center items-center rounded-sm`}
                      onClick={() => setView(viewTypes.Tree)}
                    >
                      <TbHierarchy color="white" />
                    </button>
                  </div>
                  <div className="bg-[#747282] h-7 p-[2px] flex flex-row rounded-md ml-6 pointer-events-auto">
                    <button
                      className="cursor-pointer p-1 w-7 flex justify-center items-center rounded-sm"
                      onClick={() => setIsSearch(true)}
                    >
                      <IoSearch color="white" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white flex rounded-md pointer-events-auto">
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
              <div className="bg-[#747282] h-7 p-[2px] flex flex-row rounded-md ml-2 pointer-events-auto">
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
          {isFilter && (
            <div className="absolute w-80 p-6 bg-[#2d2d2d] text-white rounded-md shadow-lg z-50 -bottom-[575px] right-4 transition pointer-events-auto">
              <h3 className="font-medium text-xl">Filter</h3>
              <div className="w-full h-[1px] bg-slate-500 my-2"></div>

              <p className="text-sm">Status</p>
              <FormGroup className="flex flex-col">
                {Object.keys(status).map((key) => (
                  <FormControlLabel
                    key={key}
                    label={key}
                    control={
                      <Checkbox
                        checked={status[key as keyof typeof status]}
                        onChange={() => handleStatusChange(key)}
                        name={key}
                        sx={{
                          color: "#fff",
                          padding: "0px 8px",
                          "&.Mui-checked": { color: "#3b82f6" },
                          "&.Mui-unchecked": { color: "#fff" },
                        }}
                        size="small"
                        className="bg-white"
                      />
                    }
                  />
                ))}
              </FormGroup>

              <div>
                <p className="my-2">Enterprise</p>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.enterprise}
                    onChange={handleSelectChange}
                    name="enterprise"
                    sx={{
                      color: "#bababa",
                      backgroundColor: "#1f1f1f",
                      fontSize: "12px",
                    }}
                    size="small"
                  >
                    {enterpriseOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="w-full h-[1px] bg-[#494a4b] my-4"></div>

                <p className="my-2">Core</p>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.core}
                    onChange={handleSelectChange}
                    name="core"
                    sx={{
                      color: "#bababa",
                      backgroundColor: "#1f1f1f",
                      fontSize: "12px",
                    }}
                    size="small"
                  >
                    {coreOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="w-full h-[1px] bg-[#494a4b] my-4"></div>

                <p className="my-2">RAN</p>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.ran}
                    onChange={handleSelectChange}
                    name="ran"
                    sx={{
                      color: "#bababa",
                      backgroundColor: "#1f1f1f",
                      fontSize: "12px",
                    }}
                    size="small"
                  >
                    {ranOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="w-full h-[1px] bg-[#494a4b] my-4"></div>

                <p className="my-2">CPE</p>
                <FormControl fullWidth size="small">
                  <Select
                    value={filters.cpe}
                    onChange={handleSelectChange}
                    name="cpe"
                    sx={{
                      color: "#bababa",
                      backgroundColor: "#1f1f1f",
                      fontSize: "12px",
                    }}
                    size="small"
                  >
                    {cpeOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center mt-6">
                <Button
                  onClick={() => {
                    resetFilters();
                    setFilteredData(data);
                  }}
                  size="small"
                  sx={{ color: "#fff", textTransform: "none" }}
                >
                  <span className="underline">Reset Filter</span>
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#355493",
                  }}
                  onClick={applyFilters}
                >
                  Filter
                </Button>
              </div>
            </div>
          )}
        </div>

        <div
          id="status-information"
          className="absolute z-[1000] px-4 py-2 text-sm bottom-6 left-1/2 -translate-x-28 bg-[#282828]/75 text-white rounded-md"
        >
          <div className="flex gap-x-3">
            <div className="flex items-center justify-center gap-1">
              <div
                className={`h-2 w-2 bg-[#7dc161] rounded-full text-center`}
              ></div>{" "}
              Healthy
            </div>
            <div className="flex items-center justify-center gap-1">
              <div
                className={`h-2 w-2 bg-[#ffcd2e] rounded-full text-center`}
              ></div>{" "}
              Major
            </div>
            <div className="flex items-center justify-center gap-1">
              <div
                className={`h-2 w-2 bg-[#d1664f] rounded-full text-center`}
              ></div>{" "}
              Critical
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
            worldCopyJump={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="grayscale-100 invert-100 hue-rotate-180 brightness-95 contrast-[90%] "
            />

            {filteredData.map((enterprise) => (
              <MapMarker
                key={`marker-${enterprise.id}`}
                enterprise={enterprise}
                onUpdateAddress={updateAddress}
                type={view}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </>
  );
};

export default WorldMap;
