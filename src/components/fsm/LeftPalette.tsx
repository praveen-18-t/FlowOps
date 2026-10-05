import React, { useState } from 'react';
import { PALETTE_CATEGORIES } from '../../data/mockData';
import { NodeType } from '../../types/fsm';

interface LeftPaletteProps {
  onAddNode: (item: {
    title: string;
    desc: string;
    type: NodeType;
    icon: string;
    iconColor: string;
  }) => void;
}

export const LeftPalette: React.FC<LeftPaletteProps> = ({ onAddNode }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = PALETTE_CATEGORIES.map((cat) => {
    const items = cat.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, items };
  }).filter((cat) => cat.items.length > 0);

  return (
    <div className="col-span-12 md:col-span-3 xl:col-span-2 bg-surface-container-lowest flex flex-col h-full overflow-y-auto select-none border-r border-surface-container-high/40">
      {/* Search Input */}
      <div className="p-3 sticky top-0 bg-surface-container-lowest z-10 border-b border-surface-container-high/20">
        <div className="flex items-center gap-2 bg-surface-container px-2.5 py-1.5 rounded text-outline focus-within:text-on-surface border border-surface-container-highest/20">
          <span className="material-symbols-outlined text-sm">search</span>
          <input
            className="bg-transparent text-xs text-on-surface w-full focus:outline-none placeholder:text-outline"
            placeholder="Search blocks & gates..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-4 p-3 pt-2">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-on-surface-variant py-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-outline">
                {cat.name}
              </span>
              <span className="text-[10px] font-mono bg-surface-container px-1 rounded text-outline">
                {cat.items.length}
              </span>
            </div>

            {cat.items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', JSON.stringify(item));
                }}
                onClick={() => onAddNode(item)}
                title={`Click or drag to place "${item.title}" onto canvas`}
                className="draggable-node flex items-center justify-between p-2.5 bg-surface-container rounded cursor-grab active:cursor-grabbing hover:bg-surface-container-high hover:border-primary-container/40 transition-all border border-transparent group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`material-symbols-outlined text-sm shrink-0 ${item.iconColor}`}
                  >
                    {item.icon}
                  </span>
                  <div className="flex flex-col truncate">
                    <span className="text-xs text-on-surface font-medium truncate group-hover:text-primary-fixed">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-outline truncate">
                      {item.desc}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-outline text-xs opacity-60 group-hover:opacity-100">
                    drag_indicator
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
