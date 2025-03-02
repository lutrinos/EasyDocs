import { createContext } from "preact";
import { useContext, useState } from "preact/hooks";

export const TabContext = createContext(0);

export function Tabs({ labels, children }: any) {
  const [
    currentTab,
    setCurrentTab
  ] = useState(labels[0]);

  return (
    <TabContext.Provider value={currentTab}>
      <ul role="tablist">
        {labels.map((label: string) => (
          <li key={label}>
            <button
              role="tab"
              aria-selected={label === currentTab}
              onClick={() => setCurrentTab(label)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
      {children}
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
