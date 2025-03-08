import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";

export const TabContext = createContext(0);

export function Tabs({ labels, children }: any) {
  const [
    currentTab,
    setCurrentTab
  ] = useState(0);

  return (
    <TabContext.Provider value={currentTab}>
      <div className="tab-group">
        <ul className="tab" role="tablist">
          {labels.map((label: string, index: number) => (
            <li
              key={index}
              role="presentation"
              className={index === currentTab ? 'active' : ''}>
              <a
                role="tab"
                tabIndex={-1}
                aria-selected={index === currentTab}
                onClick={() => setCurrentTab(index)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        {children}
      </div>
    </TabContext.Provider>
  );
};

export function Tab({ label, children }: any) {
  const currentTab = useContext(TabContext);

  if (label !== currentTab) {
    return null;
  }

  return children;
}
