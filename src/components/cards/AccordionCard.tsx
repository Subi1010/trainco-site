import React, { useState } from 'react';

const getColor = (opacity: number) => `color-mix(in srgb, var(--theme-chart-line) ${opacity}%, transparent)`;

interface AccordionItem {
    label: string;
    content: string;
    badge?: string;
}

interface AccordionCardProps {
    title?: string;
    items: AccordionItem[];
    allowMultiple?: boolean;
}

export const AccordionCard: React.FC<AccordionCardProps> = ({ title, items = [], allowMultiple = false }) => {
    const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

    const toggle = (i: number) => {
        setOpenIndexes(prev => {
            const next = new Set(prev);
            if (next.has(i)) {
                next.delete(i);
            } else {
                if (!allowMultiple) next.clear();
                next.add(i);
            }
            return next;
        });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {title && (
                <h3
                    className="font-data text-base uppercase tracking-[0.12em] mb-3 shrink-0"
                    style={{ color: getColor(90) }}
                >
                    {title}
                </h3>
            )}
            <div className="flex-1 flex flex-col gap-1 min-h-0 overflow-auto">
                {items.map((item, i) => {
                    const isOpen = openIndexes.has(i);
                    return (
                        <div
                            key={i}
                            className="border rounded overflow-hidden"
                            style={{ borderColor: getColor(20) }}
                        >
                            <button
                                onClick={() => toggle(i)}
                                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left transition-colors"
                                style={{
                                    backgroundColor: isOpen ? getColor(10) : 'transparent',
                                }}
                            >
                                <span
                                    className="font-data text-base uppercase tracking-wider leading-tight"
                                    style={{ color: isOpen ? getColor(100) : getColor(80) }}
                                >
                                    {item.label}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                    {item.badge && (
                                        <span
                                            className="font-data text-xs uppercase tracking-wider px-2 py-0.5 rounded-full"
                                            style={{
                                                backgroundColor: getColor(15),
                                                color: getColor(90),
                                            }}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        style={{
                                            color: getColor(70),
                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    >
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                            </button>
                            {isOpen && (
                                <div
                                    className="px-3 pb-3 pt-1 font-voice text-base leading-relaxed"
                                    style={{
                                        color: 'var(--theme-card-data)',
                                        borderTop: `1px solid ${getColor(15)}`,
                                    }}
                                >
                                    {item.content}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AccordionCard;
