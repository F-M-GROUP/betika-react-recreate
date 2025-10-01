
import React from 'react';
import { 
  Trophy, 
  Radio, 
  Crown, 
  Dice1, 
  Gamepad2, 
  Gift,
  Home,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Trophy, label: 'Sports', count: 1247 },
  { icon: Radio, label: 'Live', count: 89 },
  { icon: Crown, label: 'Jackpot', highlight: true },
  { icon: Dice1, label: 'Casino' },
  { icon: Gamepad2, label: 'Virtuals' },
  { icon: Gift, label: 'Promotions', badge: 'NEW' },
  { icon: Calendar, label: 'Results' }
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-betika-dark border-r border-betika-gray
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-betika-gray">
            <h2 className="text-lg font-semibold text-betika-yellow">BETWISE</h2>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors
                  ${item.active 
                    ? 'bg-betika-yellow text-betika-dark font-medium' 
                    : 'hover:bg-betika-darkHover text-white'
                  }
                  ${item.highlight ? 'border border-betika-yellow/30' : ''}
                `}
                onClick={onClose}
              >
                <div className="flex items-center">
                  <item.icon 
                    size={20} 
                    className={`mr-3 ${item.active ? 'text-betika-dark' : ''}`} 
                  />
                  <span>{item.label}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {item.count && (
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${item.active 
                        ? 'bg-betika-dark text-betika-yellow' 
                        : 'bg-betika-gray text-white'
                      }
                    `}>
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="text-xs px-2 py-1 bg-betika-green text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-betika-gray">
            <div className="bg-betika-gray rounded-lg p-3 text-center">
              <div className="text-betika-yellow font-bold text-lg">₦50,000</div>
              <div className="text-sm text-gray-300">Jackpot Prize</div>
              <button className="w-full mt-2 py-2 bg-betika-green hover:bg-betika-greenHover rounded-lg text-sm font-medium transition-colors">
                Play Now
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
