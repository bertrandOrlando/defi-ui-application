// ICON
import { GoOrganization } from 'react-icons/go';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { AiOutlineAlert } from 'react-icons/ai';
import { FaChartBar } from 'react-icons/fa';
import { LuClipboardList } from 'react-icons/lu';
import { HiOutlineDocumentMagnifyingGlass } from 'react-icons/hi2';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { FaRegFolderOpen } from 'react-icons/fa';
import { FaUsersGear } from 'react-icons/fa6';
import { LuNetwork } from 'react-icons/lu';
import { TbWorld } from 'react-icons/tb';
import { MdOutlineInventory2 } from 'react-icons/md';
import { BiServer } from 'react-icons/bi';
import { RiFlowChart } from 'react-icons/ri';
import { TbFileAnalytics } from 'react-icons/tb';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import { FaRegCalendarCheck } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import usersData from '../data/users.json';
import rolesData from '../data/roles.json';

/* TODO :
 * - Harus Handle User Profile
 * - Handle Row Data Section masih dummy (Enterprise, Locations, Alarms, Total gNB)
 * - Handle Total enterprise in Service Assurance
 */
interface CardProps {
    title: string;
    description?: string;
    color: string;
    icon: React.ReactNode;
    redirectLink: string;
}

const LandingPage = () => {

    const currentUser = usersData.users.find(user => user.userId === "001") 
    const currentRole = rolesData.roles.find(role => role.roleId === currentUser?.roleId)

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
                    <span>{currentUser?.name || 'User Name'}</span>
                    <p className="text-sm">{currentRole?.roleName || 'User Role'}</p>
                </div>
                {/* DUMMY ICON */}
                <img src="src\assets\user.png" className="h-10 w-10"></img>
            </div>
        </header>
    );
   };

   const Card = ({ title, description, color, icon, redirectLink}: CardProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${redirectLink}`)
    };
    
    return (
        <div className=
            "flex flex-col items-center justify-center p-6 bg-[#343536] h-48 rounded-lg shadow-lg hover:shadow-xl cursor-pointer group hover:bg-[#282828] border border-transparent hover:border-blue-500"
            onClick={handleClick}
            >
            <div style={{backgroundColor : color}}
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-black"
            >
                <span className="text-3xl text-gray-800">{icon}</span>
            </div>
            <p className="text-white text-sm text-center flex-grow">{title}</p>
            
            { description && <p className="text-[#343536]-400 text-xs text-center opacity-0 group-hover:opacity-100">
                {description}
            </p>}
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
                        <h2 className="text-3x1 font-bold">Welcome, {currentUser?.name || 'User'}</h2>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4 text-sm">
                        <p className="text-gray-400 text-sm flex items-center gap-x-1"> <FaRegCalendarCheck />Last sign in: {currentUser?.lastSignIn || 'N/A'}</p>
                        {/* row data section */}
                        <div className="flex flex-wrap md:flex-nowrap justify-end space-x-8">
                            <div className="flex items-center space-x-2">
                                <span className='flex items-center gap-x-1'> <GoOrganization /> <span className="font-semibold text-blue-400">87</span> Enterprise</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="flex items-center gap-x-1"> <HiOutlineLocationMarker/> <span className="font-semibold text-yellow-400">30</span> Locations</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="flex items-center gap-x-1"> <AiOutlineAlert/> <span className="font-semibold text-green-400">46</span> Alarms</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="flex items-center gap-x-1"> <FaChartBar /> <span className="font-semibold text-teal-400">15</span> Total gNB</span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    <Card title="Vendor Agreement & Query"  color="#3498b3" icon={< LuClipboardList />} redirectLink='vendor-agreement-query' />
                    <Card title="Vendor Management"  color="#099487" icon={< HiOutlineDocumentMagnifyingGlass />} redirectLink='vendor-management' />
                    <Card title="Vendor Communication"  color="#edb026" icon={< HiOutlineChatAlt2 />} redirectLink='vendor-communication' />
                    <Card title="Policy Configuration"  color="#e58029" icon={< FaRegFolderOpen />} redirectLink='policy-configuration' />
                    <Card title="User Management"  color="#d1664f" icon={< FaUsersGear />} redirectLink='user-management' />
                    <Card title="Network Planning"  color="#c4515c" icon={< LuNetwork />} redirectLink='network-planning' />
                    <Card title="Service Assurance" description="N Enterprises in total" color="#8a5480" icon={< TbWorld />} redirectLink='service-assurance' />
                    <Card title="Inventory" color="#8a5480" icon={< MdOutlineInventory2 />} redirectLink='inventory' />
                    <Card title="Network Configuration" color="#746fa7" icon={< BiServer />} redirectLink='network-configuration' />
                    <Card title="Service Flow Design" color="#7dc161" icon={< RiFlowChart />} redirectLink='service-flow-design' />
                    <Card title="Reporting & Analytics" color="#3498b3" icon={< TbFileAnalytics />} redirectLink='reporting-analytics' />
                    <Card title="Notifications" color="#3498b3" icon={< MdOutlineNotificationsActive />} redirectLink='notifications' />
                </div>                
            </main>

            <footer className="p-4" />
        </div>
    );
};

export default LandingPage;