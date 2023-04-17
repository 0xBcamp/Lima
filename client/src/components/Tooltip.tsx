import React, { useState } from 'react';
import styles from '../styles/Tooltip.module.css';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div
      className={`${styles.container} ${styles[position]}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {visible && <div className={`${styles.text} ${styles[position]}`}>{text}</div>}
      {children}
    </div>
  );
};

export default Tooltip;
