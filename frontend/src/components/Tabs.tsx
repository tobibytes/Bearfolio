import { ReactNode, useState } from 'react';

interface TabItem {
  key: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultKey?: string;
}

export const Tabs = ({ items, defaultKey }: TabsProps) => {
  const [active, setActive] = useState(defaultKey || items[0]?.key);

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {items.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`button-focus rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              active === tab.key
                ? 'border-brand bg-brand.soft text-brand.dark'
                : 'border-border bg-white text-ink hover:border-brand'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{items.find((t) => t.key === active)?.content}</div>
    </div>
  );
};
