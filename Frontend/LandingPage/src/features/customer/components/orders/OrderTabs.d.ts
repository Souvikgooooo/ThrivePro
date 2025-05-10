import React from 'react';

interface OrderTabsProps {
  activeTab: 'new' | 'history';
  setActiveTab: (tab: 'new' | 'history') => void;
}

declare const OrderTabs: React.FC<OrderTabsProps>;

export default OrderTabs;
