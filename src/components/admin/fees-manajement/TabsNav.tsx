import { History, Receipt } from 'lucide-react';
import React from 'react';

interface TabItem {
  id: string;
  label: string;
  description: string;
}

interface Props {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const tabs: TabItem[] = [
  { id: 'generate', label: 'Generate Iuran', description: 'Buat iuran baru untuk semua warga' },
  { id: 'history regenerate iuran', label: 'Riwayat Regenerate Iuran', description: 'Lihat dan kelola history regenerate iuran' },
];

export const TabsNav: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
      {/* Mobile */}
      <div className='block sm:hidden'>
        <div className='border-b border-gray-200'>
          <nav className='flex overflow-x-auto scrollbar-hide' aria-label='Tabs'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } flex-shrink-0 py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 min-w-fit`}
              >
                {tab.id === 'generate' ? (
                  <Receipt className='w-4 h-4' />
                ) : (
                  <History className='w-4 h-4' />
                )}
                <span className='hidden xs:inline'>{tab.label}</span>
                <span className='xs:hidden'>{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop */}
      <div className='hidden sm:block'>
        <div className='border-b border-gray-200'>
          <nav className='flex space-x-8 px-6' aria-label='Tabs'>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600 cursor-pointer'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                {tab.id === 'generate' ? (
                  <Receipt className='w-4 h-4' />
                ) : (
                  <History className='w-4 h-4' />
                )}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className='px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200'>
        <p className='text-sm text-gray-600'>
          {tabs.find(t => t.id === activeTab)?.description}
        </p>
      </div>
    </div>
  );
};

export default TabsNav;


