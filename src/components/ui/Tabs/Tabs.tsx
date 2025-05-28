import React, { Suspense, useState, type ReactNode } from 'react';


interface Tab {
  id: string;
  label: string;
  icon: ReactNode; // آیکن برای هر تب
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* سربرگ‌های تب */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 text-primary'
                : 'text-gray-600 hover:text-primary'
            }`}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
          >
            {tab.icon}
            <span className="mr-2">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* محتوای تب */}
      <div className="p-4 pt-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${activeTab === tab.id ? 'block' : 'hidden'}`}
            id={`panel-${tab.id}`}
            role="tabpanel"
          >
            {activeTab === tab.id ? (
              <Suspense fallback={<div className="text-center">در حال بارگذاری...</div>}>
                {tab.content}
              </Suspense>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;