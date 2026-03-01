import { ScanLine } from "lucide-react";

export default function RootLoading() {
    return (
        <div className="fixed inset-0 bg-[#040406] flex flex-col items-center justify-center z-[9999]">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
                <ScanLine className="w-16 h-16 text-primary animate-pulse relative z-10" />
            </div>
            <div className="mt-8 flex flex-col items-center gap-2">
                <div className="text-xl font-black tracking-[0.3em] text-white uppercase animate-pulse">
                    Initializing <span className="text-primary">Matrix</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        </div>
    );
}
