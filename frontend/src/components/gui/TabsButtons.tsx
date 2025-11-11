import { useState } from "react";
import "../../css/TabsButtons.css";

interface TabItem {
  id: number;
  label: string;
}

interface TabsButtonsProps {
  active: number;
  setActive: (index: number) => void;
  tabs: TabItem[];
}

const TabsButtons = ({ active, setActive, tabs }: TabsButtonsProps) => {
  return (
    <div className="tabs-wrapper">
      {tabs.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`tab-btn ${active === item.id ? "active" : ""}`}
          onClick={() => setActive(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

// Hook לניהול מצב יחיד של טאב פעיל
export const useTabsButtons = (defaultActive: number = 0) => {
  const [active, setActive] = useState<number>(defaultActive);
  return { active, setActive };
};

export default TabsButtons;
