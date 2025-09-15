import React, { useState } from 'react';

interface CardProps {
    title: string;
    description: string;
    onClick?: () => void;
    isClickable?: boolean;
    hoverCount?: number;
}

const LandingPage = () => {
   const [hoveredCard, setHoveredCard] = useState<string | null>(null);
   const Header = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-[#282828] w-full text-white">
            
            {/* left side */}
            <div className="flex flex-col text-sm">
                <span className="text-orange-500">Home</span>
                <span className="text-lg font-bold">Dashboard</span>
            </div>
            
            {/* center */}
            <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">5G Def-i</span>
            </div>
            
            {/* right side */}
            <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end text-sm">
                    {/* DUMMY NAME */}
                    <span>Name</span>
                    {/* DUMMY ROLE */}
                    <p className="text-sm">Role</p>
                </div>
                {/* DUMMY ICON */}
                <img src="src\assets\user.png" className="h-10 w-10"></img>
            </div>
        </header>
    );
   };

   const Card = ({ title, description, onClick, isClickable = false, hoverCount }: CardProps) => {
    const handleClick = () => {
        if (isClickable && onClick) {
            onClick();
        }
    };

    const handleMouseEnter = () => {
        if (isClickable) {
            setHoveredCard(title);
        }
    };

    const handleMouseLeave = () => {
        setHoveredCard(null);
    };

    return (
        <div 
            className={`flex flex-col items-center justify-center p-6 bg-[#343536] h-48 rounded-lg shadow-lg hover:shadow-xl group hover:bg-[#282828] border border-transparent hover:border-blue-500 relative ${
                isClickable ? 'cursor-pointer' : 'cursor-default'
            }`}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* DUMMY ICON */}
            <div className="w-14 h-14 rounded-full bg-teal-400 flex items-center justify-center mb-4 text-black">
                <span className="text-3xl font-bold text-gray-800">{title.charAt(0)}</span>
            </div>
            <p className="text-white text-sm text-center flex-grow">{title}</p>
            <p className="text-[#343536]-400 text-xs text-center opacity-0 group-hover:opacity-100">
                {description}
            </p>
            
            {/* Hover count display */}
            {hoveredCard === title && hoverCount && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                    {hoverCount}
                </div>
            )}
        </div>
    );
   };

   const handleServiceAssuranceClick = () => {
       // Navigate to Service Assurance Tree View
       window.location.href = '/service-assurance-tree';
   };

   const handleUserManagementClick = () => {
       // Navigate to User Management
       window.location.href = '/user-management';
   };
    
    return (
        <div className="min-h-screen bg-[#282828] text-white">
            <Header />

            <main className="container mx-auto p-8">
                {/* Top Section */}
                <div className="mb-2">
                    {/* Welcome, User */}
                    <div>
                        {/* DUMMY NAME */}
                        <h2 className="text-3xl font-bold">Welcome, User</h2>
                    </div>
                    
                    <div className="flex items-center justify-between mb-12 text-sm">
                        {/* DUMMY DATE */}
                        <p className="text-gray-400 text-sm">Last sign in: 11/09/25</p>
                        {/* row data section */}
                        <div className="flex flex-wrap md:flex-nowrap justify-end space-x-8">
                            <div className="flex items-center space-x-2">
                                <span><span className="font-semibold text-blue-400">87</span> Enterprise</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span><span className="font-semibold text-yellow-400">30</span> Locations</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span><span className="font-semibold text-green-400">46</span> Alarms</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span><span className="font-semibold text-teal-400">15</span> total gNB</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    <Card title="Vendor Agreement & Query" description="text" />
                    <Card title="Vendor Management" description="text" />
                    <Card title="Vendor Communication" description="text" />
                    <Card title="Policy Configuration" description="text" />
                    <Card 
                        title="User Management" 
                        description="Manage user accounts and permissions" 
                        isClickable={true}
                        onClick={handleUserManagementClick}
                    />
                    <Card title="Network Planning" description="text" />
                    <Card 
                        title="Service Assurance" 
                        description="Monitor and manage network services" 
                        isClickable={true}
                        onClick={handleServiceAssuranceClick}
                        hoverCount={23} // Total count shown on hover
                    />
                    <Card title="Inventory" description="text" />
                    <Card title="Network Configuration" description="text" />
                    <Card title="Service Flow Design" description="text" />
                    <Card title="Reporting & Analytics" description="text" />
                    <Card title="Notifications" description="text" />
                </div>                
            </main>

            <footer className="p-4" />
        </div>
    );
};

export default LandingPage;