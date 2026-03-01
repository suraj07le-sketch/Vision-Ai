"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History, Download, Filter, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function HistoryPage() {
    const [history, setHistory] = useState<{
        id: string;
        created_at: string;
        file_type: string;
        objects_detected: { label: string }[];
        accuracy: number;
    }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        async function fetchHistory() {
            setLoading(true);
            const { data, error } = await supabase
                .from('detections')
                .select('*')
                .order('created_at', { ascending: false });

            if (!error && data) {
                setHistory(data);
            }
            setLoading(false);
        }

        fetchHistory();
    }, []);

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-4xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary uppercase">
                        Archive Log
                    </h1>
                    <p className="text-gray-500 text-sm font-mono mt-1 uppercase tracking-widest">Historical neural detection records</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="glass border-white/10 text-xs font-mono">
                        <Download className="w-3 h-3 mr-2" /> EXPORT CSV
                    </Button>
                </div>
            </motion.div>

            <Card className="glass-card border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 ml-4">
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-white">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03] text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
                                <th className="px-6 py-4 font-black">Timestamp</th>
                                <th className="px-6 py-4 font-black">Type</th>
                                <th className="px-6 py-4 font-black">Detected Objects</th>
                                <th className="px-6 py-4 font-black text-center">Accuracy</th>
                                <th className="px-6 py-4 font-black text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 h-16">
                                            <div className="h-4 bg-white/5 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <History className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-20" />
                                        <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">No records found in database</p>
                                    </td>
                                </tr>
                            ) : (
                                history.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white uppercase">{new Date(item.created_at).toLocaleDateString()}</span>
                                                <span className="text-[10px] text-gray-500 font-mono uppercase">{new Date(item.created_at).toLocaleTimeString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${item.file_type === 'image' ? 'border-primary/30 text-primary bg-primary/5' : 'border-secondary/30 text-secondary bg-secondary/5'} uppercase tracking-tighter`}>
                                                {item.file_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-sm">
                                                {Array.isArray(item.objects_detected) ? (
                                                    <>
                                                        {item.objects_detected.slice(0, 3).map((obj: { label: string }, idx: number) => (
                                                            <span key={idx} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 font-mono lowercase italic leading-none">
                                                                {obj.label}
                                                            </span>
                                                        ))}
                                                        {item.objects_detected.length > 3 && (
                                                            <span className="text-[10px] text-gray-600 font-mono">+{item.objects_detected.length - 3}</span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-[10px] text-gray-500 font-mono italic">No data available</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-mono font-bold text-white">{(item.accuracy * 100).toFixed(1)}%</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all">
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-white/[0.01]">
                    <span>Showing {history.length} results</span>
                    <div className="flex gap-4">
                        <button className="hover:text-primary transition-colors disabled:opacity-30" disabled>PREV</button>
                        <button className="hover:text-primary transition-colors disabled:opacity-30" disabled>NEXT</button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
