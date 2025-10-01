import { useState, useRef } from 'react';
import type { MouseEvent, WheelEvent } from 'react';

const ServiceAssuranceTreeView = () => {
  const [focusedMode, setFocusedMode] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [initialDragPosition, setInitialDragPosition] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseDown = (e: MouseEvent<SVGSVGElement>) => {
    setDragging(true);
    setInitialDragPosition({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
    if (dragging) {
      setPanOffset({
        x: e.clientX - initialDragPosition.x,
        y: e.clientY - initialDragPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleWheel = (e: WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    if (e.deltaY < 0) {
      // Zoom in
      setZoomLevel(prev => prev * zoomFactor);
    } else {
      // Zoom out
      setZoomLevel(prev => prev / zoomFactor);
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => prev * 1.1);
  };

  const zoomOut = () => {
    setZoomLevel(prev => prev / 1.1);
  };

  const Header = () => (
    <header className="flex items-center justify-between p-4 bg-[#282828] w-full text-white">
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-700 rounded" onClick={() => window.history.back()}>
          <span className="text-xl">←</span>
        </button>
        <div className="flex flex-col text-sm">
          <span className="text-orange-500 text-xs">Dashboard / Service Assurance</span>
          <span className="text-lg font-bold">Service Assurance</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-teal-400 rounded-full"></div>
        <span className="text-lg font-semibold">5G Def-i</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex flex-col items-end text-sm">
          <span>Mir Rahim Ali</span>
          <p className="text-sm text-gray-400">Admin</p>
        </div>
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
          M
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-[#282828] text-white flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Controls */}
          <div className="p-4 bg-[#343536] flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div 
                className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${focusedMode ? 'bg-green-500' : 'bg-gray-600'}`}
                onClick={() => setFocusedMode(!focusedMode)}
              >
                <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform duration-200 ${focusedMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-white">Focused</span>
            </div>
            
            <div className="flex space-x-2 ml-auto">
              <button onClick={zoomOut} className="p-2 hover:bg-gray-600 rounded text-white">➖</button>
              <button onClick={zoomIn} className="p-2 hover:bg-gray-600 rounded text-white">➕</button>
            </div>
          </div>

          {/* Tree View Area */}
          <div className="flex-1 relative bg-[#2a2a2a] overflow-hidden">
            <svg 
              ref={svgRef}
              width="100%" 
              height="100%" 
              className={`absolute inset-0 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
                {/* Connections */}
                <path d="M 135 538 Q 200 500 280 423" stroke="#10B981" strokeWidth="2" fill="none" />
                <path d="M 135 538 Q 200 580 280 654" stroke="#10B981" strokeWidth="2" fill="none" />
                <path d="M 135 838 L 298 838" stroke="#4B5563" strokeWidth="2" fill="none" />
                <path d="M 280 423 Q 350 350 415 305" stroke="#10B981" strokeWidth="2" fill="none" />
                <path d="M 280 654 Q 350 644 415 659" stroke="#10B981" strokeWidth="2" fill="none" />
                <path d="M 415 305 Q 500 250 588 224" stroke="#F59E0B" strokeWidth="2" fill="none" />
                <path d="M 415 305 Q 500 290 588 305" stroke="#F59E0B" strokeWidth="2" fill="none" />
                <path d="M 415 305 Q 500 350 588 421" stroke="#F59E0B" strokeWidth="2" fill="none" />
                <path d="M 415 659 Q 500 647 588 659" stroke="#F59E0B" strokeWidth="2" fill="none" />
                <path d="M 588 224 L 775 224" stroke="#06B6D4" strokeWidth="2" fill="none" />
                <path d="M 588 305 L 783 305" stroke="#06B6D4" strokeWidth="2" fill="none" />
                <path d="M 588 421 Q 650 380 740 365" stroke="#06B6D4" strokeWidth="2" fill="none" />
                <path d="M 588 421 Q 650 440 740 480" stroke="#06B6D4" strokeWidth="2" fill="none" />
                <path d="M 588 659 Q 680 600 792 562" stroke="#06B6D4" strokeWidth="2" fill="none" />
                <path d="M 588 659 Q 680 630 793 623" stroke="#06B6D4" strokeWidth="2" fill="none" />
                <path d="M 588 659 Q 680 660 807 684" stroke="#06B6D4" strokeWidth="2" fill="none" />
                <path d="M 588 659 Q 680 690 777 735" stroke="#06B6D4" strokeWidth="2" fill="none" />
                <path d="M 588 659 Q 680 720 777 786" stroke="#06B6D4" strokeWidth="2" fill="none" />

                {/* Nodes */}
                <rect x="45" y="513" width="100" height="30" rx="4" fill="#3B82F6" className="cursor-pointer" />
                <text x="95" y="532" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">Enterprise A</text>

                <rect x="230" y="408" width="100" height="30" rx="4" fill="#10B981" className="cursor-pointer" />
                <text x="280" y="427" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">Sites 1</text>

                <rect x="230" y="639" width="100" height="30" rx="4" fill="#10B981" className="cursor-pointer" />
                <text x="280" y="658" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">Sites 2</text>

                <rect x="248" y="823" width="100" height="30" rx="4" fill="#10B981" className="cursor-pointer" />
                <text x="298" y="842" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">Sites 3</text>

                <rect x="85" y="823" width="100" height="30" rx="4" fill="#3B82F6" className="cursor-pointer" />
                <text x="135" y="842" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">Enterprise B</text>

                <rect x="365" y="290" width="100" height="30" rx="4" fill="#10B981" className="cursor-pointer" />
                <text x="415" y="309" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">5G Core 1</text>

                <rect x="365" y="644" width="100" height="30" rx="4" fill="#10B981" className="cursor-pointer" />
                <text x="415" y="663" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">5G Core 2</text>

                <rect x="538" y="209" width="100" height="30" rx="4" fill="#F59E0B" className="cursor-pointer" />
                <text x="588" y="228" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">RAN Alpha 1</text>

                <rect x="538" y="290" width="100" height="30" rx="4" fill="#F59E0B" className="cursor-pointer" />
                <text x="588" y="309" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">RAN Alpha 2</text>

                <rect x="538" y="406" width="100" height="30" rx="4" fill="#F59E0B" className="cursor-pointer" />
                <text x="588" y="425" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">RAN Alpha 3</text>

                <rect x="538" y="644" width="100" height="30" rx="4" fill="#F59E0B" className="cursor-pointer" />
                <text x="588" y="663" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">RAN Alpha 4</text>

                <rect x="725" y="209" width="100" height="30" rx="4" fill="#06B6D4" className="cursor-pointer" />
                <text x="775" y="228" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">gNB-Bir-1</text>

                <rect x="733" y="290" width="100" height="30" rx="4" fill="#06B6D4" className="cursor-pointer" />
                <text x="783" y="309" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">gNB-Texas-1</text>

                <rect x="690" y="350" width="100" height="30" rx="4" fill="#06B6D4" className="cursor-pointer" />
                <text x="740" y="369" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">gNB-Ohio-1</text>

                <rect x="690" y="465" width="100" height="30" rx="4" fill="#06B6D4" className="cursor-pointer" />
                <text x="740" y="484" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">gNB-Ohio-2</text>

                <rect x="742" y="547" width="100" height="30" rx="4" fill="#06B6D4" className="cursor-pointer" />
                <text x="792" y="566" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">HOBETA-AP-02</text>

                <rect x="743" y="608" width="100" height="30" rx="4" fill="#06B6D4" className="cursor-pointer" />
                <text x="793" y="627" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">HOBETA-AP-01</text>

                <rect x="757" y="669" width="100" height="30" rx="4" fill="#06B6D4" className="cursor-pointer" />
                <text x="807" y="688" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">HOBETA-AP22</text>

                <rect x="727" y="720" width="100" height="30" rx="4" fill="#06B6D4" className="cursor-pointer" />
                <text x="777" y="739" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">Demo AP1</text>

                <rect x="727" y="771" width="100" height="30" rx="4" fill="#06B6D4" className="cursor-pointer" />
                <text x="777" y="790" textAnchor="middle" className="fill-white text-xs font-medium pointer-events-none">Demo AP2</text>
              </g>
            </svg>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-xs">Enterprise</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">Sites</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-xs">Core</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-xs">RAN</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                <span className="text-xs">CPE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-[#343536] text-white flex flex-col">
          <div className="p-4 border-b border-gray-600">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-5 h-5 bg-blue-500 rounded"></div>
              <h3 className="text-lg font-semibold">Enterprise A</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-2">Sites</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Sites 1</span>
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Sites 2</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">Core</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">5G Core 1</span>
                  <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">5G Core 2</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">RAN</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">RAN Alpha 1</span>
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">RAN Alpha 2</span>
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">RAN Alpha 3</span>
                  <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">RAN Alpha 4</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">CPE</p>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded">gNB-Bir-1</span>
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded">gNB-Texas-1</span>
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded">gNB-Ohio-1</span>
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded">gNB-Ohio-2</span>
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded">HOBETA-AP-02</span>
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded">HOBETA-AP-01</span>
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded">HOBETA-AP22-AP01</span>
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded">Demo AP1</span>
                  <span className="px-2 py-1 bg-cyan-500 text-white text-xs rounded">Demo AP2</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 flex-1">
            <h4 className="text-sm font-medium mb-3">Reports</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">9 Alarms</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">5 Locations</span>
              </div>
            </div>

            <div className="mt-6 p-3 bg-gray-600 rounded">
              <div className="text-sm text-green-400 mb-2">Service Assurance</div>
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAssuranceTreeView;