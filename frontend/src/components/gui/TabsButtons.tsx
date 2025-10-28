

import { useState } from "react";
import "../../css/TabsButtons.css"; // נשתמש בעיצוב למטה

const TabsButtons =  ({active, setActive, tabs}:{active:number, setActive:(index:number)=>void, tabs:{id:number, label:string}[]}) => {
  

  return (
    <div className="tabs-wrapper">
      {tabs.map((item) => (
        <button
          key={item.id}
          className={`tab-btn ${active === item.id ? "active" : ""}`}
          onClick={() => setActive(item.id)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export const useTabsButtons = () => {
    const [active, setActive] = useState<number>(0);
    return{active, setActive}
}

export default TabsButtons;