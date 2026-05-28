import React from 'react';
import '../styles/components/Avatar.scss';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Avatar Component - displays initials in a colored circle
 */
const Avatar: React.FC<AvatarProps> = ({ name, size = 'md' }) => {
  // Get initials from name
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');

  // Generate consistent color based on name
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#A8E6CF',
    '#FFD3B6', '#FFAAA5', '#AA96DA', '#FCBAD3', '#A8D8EA',
  ];
  const colorIndex = name.charCodeAt(0) % colors.length;
  const backgroundColor = colors[colorIndex];

  return (
    <div className={`avatar avatar-${size}`} style={{ backgroundColor }}>
      <span className="avatar-initials">{initials}</span>
    </div>
  );
};

export default Avatar;
