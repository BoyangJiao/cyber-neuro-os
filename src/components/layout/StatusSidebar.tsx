export const StatusSidebar = () => {
    return (
        <div className="col-span-1 lg:col-span-2 hidden lg:flex flex-col h-full p-4 opacity-30 border-l border-border-subtle">
            {/* Placeholder Visuals */}
            <div className="h-full w-full border border-dashed border-border-default rounded flex items-center justify-center">
                <span className="text-text-muted font-mono text-xs tracking-[0.3em] uppercase rotate-90">Awaiting Module</span>
            </div>
        </div>
    );
};
