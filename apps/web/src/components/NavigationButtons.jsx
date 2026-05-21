import React from 'react';
import StickyNavigation from './StickyNavigation.jsx';

// Fallback wrapper: Replaces existing instances of NavigationButtons with the new StickyNavigation
// to ensure all tool pages instantly get the new navigation without needing manual rewrites of 80+ files.
const NavigationButtons = () => {
  return <StickyNavigation />;
};

export default NavigationButtons;