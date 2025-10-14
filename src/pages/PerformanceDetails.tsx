import { useState, useMemo } from 'react';
import Header from "../component/header";
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsTooltip,  } from '@mui/x-charts/ChartsTooltip';
import throughputData from "../data/ThroughputData.json";
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import DynamicBreadcrumb from "../component/DynamicBreadCrumbs";


//custom tool tip for chart
const CustomTooltipContent = ({ axisData, dataset }: any) => {

    if (!axisData?.x || axisData.x.index === undefined || !dataset) {
        return null;
    }

    const dataIndex = axisData.x.index;
    const data = dataset[dataIndex];
    if (!data) return null;
    
    const date = new Date(data.fullDate);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: 'numeric', hour12: true,
    });

    return (
        <div className="bg-[#282828] p-3 rounded-md border border-[#555] shadow-lg text-white">
            <p className="text-sm text-gray-300 mb-2">{`${formattedDate} ${formattedTime}`}</p>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13L7 7L13 13L23 3" stroke="#34D399" strokeWidth="2" /></svg>
                    <div>
                        <p className="font-bold text-lg">{data.Uplink.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Uplink</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 13L7 7L13 13L23 3" stroke="#60A5FA" strokeWidth="2" /></svg>
                    <div>
                        <p className="font-bold text-lg">{data.Downlink.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">Downlink</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

//throughput chart component
const ThroughputChart = ({ chartData }: any) => {
  return (
    <div className="bg-[#3c3c3c] p-6 rounded-lg mt-4">
      <h3 className="text-lg font-semibold text-white mb-4">Throughput</h3>

      {chartData && chartData.length > 0 ? (
        <div style={{ width: '100%', height: 400 }}>
          <LineChart
            dataset={chartData}
            xAxis={[
              {
                scaleType: 'point',
                dataKey: 'name',
                tickLabelStyle: { fill: '#a0a0a0', fontSize: 12 },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fill: '#a0a0a0', fontSize: 12 },
              },
            ]}
            series={[
              {
                dataKey: 'Uplink',
                color: '#34d399',
                showMark: false,
                curve: 'monotoneX',
              },
              {
                dataKey: 'Downlink',
                color: '#60a5fa',
                showMark: false,
                curve: 'monotoneX',
              },
            ]}
            grid={{ horizontal: true }}
     
            sx={{
              [`.${axisClasses.line}`]: { stroke: '#a0a0a0' },
              [`.${axisClasses.tick}`]: { stroke: '#a0a0a0' },
              [`.${axisClasses.tickLabel}`]: { fill: '#a0a0a0', fontSize: 12 },
              [`.${chartsGridClasses.line}`]: {
                stroke: '#555',
                strokeDasharray: '3 3',
              },
            }}
            slots={{ tooltip: ChartsTooltip }}
            slotProps={{
                tooltip: {
                    trigger: 'axis',
                    sx: {
                    '& .MuiChartsTooltip-root': {
                        backgroundColor: 'transparent',
                        padding: 0,
                        border: 'none',
                    },
                    '& .MuiChartsTooltip-axisLine': {
                        stroke: '#999',
                        strokeWidth: 1,
                        strokeDasharray: '3 3',
                    },
                    },
                },
            }}
            margin={{ top: 5, right: 30, left: 30, bottom: 25 }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-96 text-gray-400">
          <p>No data available for the selected range.</p>
        </div>
      )}
    </div>
  );
};


//table view component
const TableView = ({ data }: any) => {
    const formatTableDate = (isoString: any) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true
        }).replace(',', '');
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-[#3c3c3c] rounded-lg overflow-hidden">
                <h3 className="text-lg font-semibold text-white p-4">Subscribe Uplink</h3>
                <div className="overflow-auto max-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-green-500 sticky top-0">
                            <tr>
                                <th className="p-3">CORE NAME</th>
                                <th className="p-3">TIME</th>
                                <th className="p-3">VALUE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item: any, index: any) => (
                                <tr key={index} className="border-b border-[#555]">
                                    <td className="p-3">10452837266384931</td>
                                    <td className="p-3 whitespace-nowrap">{formatTableDate(item.fullDate)}</td>
                                    <td className="p-3">{item.Uplink.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-[#3c3c3c] rounded-lg overflow-hidden">
                <h3 className="text-lg font-semibold text-white p-4">Subscribe Downlink</h3>
                <div className="overflow-auto max-h-[400px]">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-teal-600 sticky top-0">
                            <tr>
                                <th className="p-3">CORE NAME</th>
                                <th className="p-3">TIME</th>
                                <th className="p-3">VALUE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item: any, index: any) => (
                                <tr key={index} className="border-b border-[#555]">
                                    <td className="p-3">10452837266384931</td>
                                    <td className="p-3 whitespace-nowrap">{formatTableDate(item.fullDate)}</td>
                                    <td className="p-3">{item.Downlink.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

//date range modal component for throughput chart and table view
const DateRangeModal = ({ isOpen, onClose, onApply, initialStartDate, initialEndDate }: any) => {
    if (!isOpen) return null;
    const [start, setStart] = useState(initialStartDate.toISOString().split('T')[0]);
    const [end, setEnd] = useState(initialEndDate.toISOString().split('T')[0]);
    const handleApply = () => onApply(new Date(start), new Date(end));
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#3c3c3c] p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h4 className="text-lg font-semibold text-white mb-4">Select Custom Date Range</h4>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                        <input type="date" id="startDate" value={start} onChange={(e) => setStart(e.target.value)} className="w-full bg-[#282828] text-white border border-[#555] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                        <input type="date" id="endDate" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full bg-[#282828] text-white border border-[#555] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-300 bg-[#5a5a5a] hover:bg-[#6a6a6a] rounded-md transition-colors duration-200">Cancel</button>
                    <button onClick={handleApply} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200">Apply</button>
                </div>
            </div>
        </div>
    );
};

//main component
const PerformanceDetails = () => {
    const timeRanges = ['D', 'W', 'M', '3M', '6M', 'Y'];
    const [activeRange, setActiveRange] = useState('Y');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('chart');
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    });
    const [endDate, setEndDate] = useState(new Date());

    const handleCustomDateApply = (newStart: any, newEnd: any) => {
        setStartDate(newStart);
        setEndDate(newEnd);
        setActiveRange('custom');
        setIsModalOpen(false);
    };

    const chartData = useMemo(() => {
        const now = new Date('2025-10-09T01:48:00');
        let rangeStartDate = new Date(now);

        if (activeRange !== 'custom') {
            switch (activeRange) {
                case 'D': rangeStartDate.setDate(now.getDate() - 1); break;
                case 'W': rangeStartDate.setDate(now.getDate() - 7); break;
                case 'M': rangeStartDate.setMonth(now.getMonth() - 1); break;
                case '3M': rangeStartDate.setMonth(now.getMonth() - 3); break;
                case '6M': rangeStartDate.setMonth(now.getMonth() - 6); break;
                case 'Y': rangeStartDate.setFullYear(now.getFullYear() - 1); break;
                default: rangeStartDate.setFullYear(now.getFullYear() - 1); break;
            }
        } else {
            rangeStartDate = startDate;
        }
        
        const rangeEndDate = activeRange === 'custom' ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : now;

        const filteredData = throughputData.throughputData.filter(item => {
            const itemDate = new Date(`${item.date}T${item.time}:00`);
            return itemDate >= rangeStartDate && itemDate <= rangeEndDate;
        });

        return filteredData.map(item => {
            const itemDate = new Date(`${item.date}T${item.time}:00`);
            let name = '';
            if (activeRange === 'D') {
                name = itemDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            } else if (activeRange === 'Y' || activeRange === '6M') {
                name = itemDate.toLocaleString('default', { month: 'short' }) + `'` + itemDate.getFullYear().toString().slice(-2);
            } else {
                name = itemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
            return {
                name,
                Uplink: item.uplink,
                Downlink: item.downlink,
                fullDate: itemDate.toISOString()
            };
        });
    }, [activeRange, startDate, endDate]);

    return (
        <div className="min-h-screen bg-[#282828] text-white font-sans">
            <Header />
            <main className="p-6">
                <div className="text-sm text-gray-400 mb-2">
                    <DynamicBreadcrumb />
                    <span className="text-white font-semibold">Performance Details</span>
                </div>
                <h1 className="text-3xl font-bold mb-6">Performance Details</h1>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center bg-[#3c3c3c] rounded-md">
                            {timeRanges.map((range) => (
                                <button key={range} onClick={() => setActiveRange(range)} className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 ${activeRange === range ? 'bg-[#5a5a5a] text-white' : 'text-gray-300 hover:bg-[#4a4a4a]'}`}>
                                    {range}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors duration-200 ${activeRange === 'custom' ? 'bg-[#5a5a5a] text-white' : 'bg-[#3c3c3c] hover:bg-[#4a4a4a]'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                            </svg>
                            <span>Custom Date</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                                <span>Uplink</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-teal-600 rounded-sm"></span>
                                <span>Downlink</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setViewMode('chart')} className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'chart' ? 'bg-[#5a5a5a]' : 'bg-[#3c3c3c] hover:bg-[#4a4a4a]'}`} title="Chart View">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
                            </button>
                            <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-colors duration-200 ${viewMode === 'table' ? 'bg-[#5a5a5a]' : 'bg-[#3c3c3c] hover:bg-[#4a4a4a]'}`} title="Table View">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" /></svg>
                            </button>
                            <button className="p-2 rounded-md bg-[#3c3c3c] hover:bg-[#4a4a4a] transition-colors duration-200"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {viewMode === 'chart' ? (
                    <ThroughputChart chartData={chartData} />
                ) : (
                    <TableView data={chartData} />
                )}
            </main>
            <DateRangeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApply={handleCustomDateApply}
                initialStartDate={startDate}
                initialEndDate={endDate}
            />
        </div>
    );
};

export default PerformanceDetails;