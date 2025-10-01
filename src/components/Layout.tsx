
import React, { useState } from 'react';
import { Menu, X, User, LogIn } from 'lucide-react';
import Sidebar from './Sidebar';
import BetSlip from './BetSlip';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [betSlipOpen, setBetSlipOpen] = useState(false);

  return (
    <div className="min-h-screen bg-betika-dark text-white">
      {/* Top Navbar */}
      <header className="bg-betika-dark border-b border-betika-gray sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden mr-3 p-2 hover:bg-betika-darkHover rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="text-2xl font-bold text-betika-yellow">
              BETWISE
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="hidden sm:flex items-center px-4 py-2 bg-betika-green hover:bg-betika-greenHover rounded-lg transition-colors">
              <User size={18} className="mr-2" />
              Login
            </button>
            <button className="sm:hidden p-2 hover:bg-betika-darkHover rounded-lg transition-colors">
              <LogIn size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>

        {/* Bet Slip */}
        <BetSlip isOpen={betSlipOpen} onToggle={() => setBetSlipOpen(!betSlipOpen)} />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
