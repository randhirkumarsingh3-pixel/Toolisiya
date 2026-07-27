import React from 'react';
import StickyNavigation from './StickyNavigation.jsx';

// Fallback wrapper: Replaces existing instances of GoBackButton with the new StickyNavigation
const GoBackButton = () => {
  return <StickyNavigation />;
};

export default GoBackButton;