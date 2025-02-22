import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Removed unused isDarkMode prop
}

const Advertisement: React.FC<Props> = ({ isOpen, onClose }) => {
  return null; // Component no longer needed
};

export default Advertisement;