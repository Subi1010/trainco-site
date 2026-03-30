import React from 'react';

const C = 'var(--theme-chart-line)';
const getColor = (opacity: number) => `color-mix(in srgb, var(--theme-chart-line) ${opacity}%, transparent)`;

interface AvatarCardProps {
    question: string;
    progressStep?: number;
    progressTotal?: number;
    detail?: string;
}

export const AvatarCard: React.FC<AvatarCardProps> = ({
    question,
    progressStep = 0,
    progressTotal = 4,
    detail,
}) => {
    const clampedStep = Math.max(0, Math.min(progressStep, progressTotal));

    return (
        <div className="flex flex-col h-full justify-between gap-4 p-1">

            {/* ── Progress dots ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-center gap-1.5 shrink-0">
                {Array.from({ length: progressTotal }).map((_, i) => (
                    <span
                        key={i}
                        className="rounded-full transition-all duration-300"
                        style={{
                            width:  i < clampedStep ? 20 : 8,
                            height: 8,
                            backgroundColor: i < clampedStep ? C : getColor(20),
                        }}
                    />
                ))}
            </div>

            {/* ── Question pill ─────────────────────────────────────────────── */}
            <div
                className="flex-1 flex items-center justify-center rounded-[100px] px-5 py-4 text-center"
                style={{ backgroundColor: getColor(8), border: `1px solid ${getColor(18)}` }}
            >
                <p
                    className="font-voice text-base leading-relaxed"
                    style={{ color: getColor(90) }}
                >
                    {question}
                </p>
            </div>

            {/* ── Detail text ───────────────────────────────────────────────── */}
            {detail && (
                <p
                    className="font-voice text-base leading-relaxed text-center shrink-0"
                    style={{ color: getColor(65) }}
                >
                    {detail}
                </p>
            )}

            {/* ── Step counter ──────────────────────────────────────────────── */}
            <div
                className="font-data text-base uppercase tracking-wider text-center shrink-0"
                style={{ color: getColor(50) }}
            >
                {clampedStep} / {progressTotal}
            </div>
        </div>
    );
};

export default AvatarCard;
