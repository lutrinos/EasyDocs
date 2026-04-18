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
      <div className="tabs tabs-border" role="tablist">
        {labels.map((label: string, index: number) => (
            <div
              key={index}
                role="tab"
                //tabIndex={-1}
                className={label === currentTab ? 'tab tab-active' : 'tab'}
                aria-selected={label === currentTab}
                onClick={() => setCurrentTab(label)}
              >
                {label}
              </div>
          ))}
        </div>
        <div className="border-base-300 bg-base-100 p-10">
        { children }
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
