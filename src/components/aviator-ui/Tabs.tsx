interface TabsProps {
  activeTab: 'all' | 'previous' | 'top';
  onTabChange: (tab: 'all' | 'previous' | 'top') => void;
}

export const Tabs = ({ activeTab, onTabChange }: TabsProps) => {
  const tabs = [
    { id: 'all' as const, label: 'Active Players' },
    { id: 'previous' as const, label: 'My Bets' },
    { id: 'top' as const, label: 'Top Wins' },
  ];

  return (
    <div className="flex border-b border-gray-800 bg-[#0F0F0F] px-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 text-sm font-bold transition-colors relative ${
            activeTab === tab.id
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF3366] to-[#00FF80]" />
          )}
        </button>
      ))}
    </div>
  );
};
