interface CardProps {
    title: string;
}

const LandingPage = () => {
   const Header = () => {
    return (
        <header className="flex items-center justify-between p-6 bg-[#282828] w-full text-white">
            
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

   const Card = ({ title }: CardProps) => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-[#343536] rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            {/* DUMMY ICON */}
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mb-4 text-black">
                <span className="text-3xl font-bold text-gray-800">{title.charAt(0)}</span>
            </div>
            <h3 className="text-white text-lg font-semibold text-center">{title}</h3>
        </div>
    );
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
                        <h2 className="text-3x1 font-bold">Welcome, User</h2>
                    </div>
                    
                    <div className="flex items-center justify-between mb-12 text-sm">
                        {/* DUMMY DATE */}
                        <p className="text-gray-400 text-sm">Last sign in: 11/09/25</p>
                        {/* row data section */}
                        <div className="flex flex-wrap md:flexnowrap justify-end space-x-8">
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
                    <Card title="Vendor Agreement & Query" />
                    <Card title="Vendor Management" />
                    <Card title="Vendor Communication" />
                    <Card title="Policy Configuration" />
                    <Card title="User Management" />
                    <Card title="Network Planning" />
                    <Card title="Service Assurance" />
                    <Card title="Inventory" />
                    <Card title="Network Configuration" />
                    <Card title="Service Flow Design" />
                    <Card title="Reporting & Analytics" />
                    <Card title="Notifications" />
                </div>                
            </main>

            <footer className="p-6" />
        </div>
    );
};

export default LandingPage;