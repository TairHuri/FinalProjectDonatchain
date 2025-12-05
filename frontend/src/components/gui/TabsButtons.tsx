import { useState } from "react";
import "../../css/gui/TabsButtons.css";

/**
 * Represents a single tab option.
 */
interface TabItem {
  id: number;
  label: string;
}

/**
 * Component props for TabsButtons.
 * @property active - The currently selected tab ID.
 * @property setActive - Function that updates the active tab.
 * @property tabs - Array of available tab items.
 */
interface TabsButtonsProps {
  active: number;
  setActive: (index: number) => void;
  tabs: TabItem[];
}

/**
 * Renders a horizontal tab switcher with clickable buttons.
 * Highlights the active tab and triggers a callback on click.
 */
const TabsButtons = ({ active, setActive, tabs }: TabsButtonsProps) => {
  return (
    <div className="tabs-wrapper">
      {tabs.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`tab-btn ${active === item.id ? "active" : ""}`}
          onClick={() => setActive(item.id)} // update the active tab on button click
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

/**
 * Custom hook for managing a single active tab state.
 * @param defaultActive - Initial active tab ID (default is 0).
 * @returns active tab value and a setter function.
 */
export const useTabsButtons = (defaultActive: number = 0) => {
  const [active, setActive] = useState<number>(defaultActive);
  return { active, setActive };
};

export default TabsButtons;
