import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="h-10 w-64 bg-white/5 rounded-lg animate-pulse" />
                    <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="h-8 w-32 bg-white/5 rounded-full animate-pulse" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="glass-card border-white/5 bg-black/40">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                            <div className="h-4 w-4 bg-white/5 rounded-full animate-pulse" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
                            <div className="h-3 w-40 bg-white/5 rounded animate-pulse" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid gap-6 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <Card className="glass-card border-white/5 bg-black/40 h-[450px]">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="h-5 w-40 bg-white/5 rounded animate-pulse" />
                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-white/10 animate-pulse" />
                                <div className="h-2 w-2 rounded-full bg-white/10 animate-pulse" />
                            </div>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center h-full">
                            <div className="h-[300px] w-full bg-white/[0.02] rounded-xl animate-pulse" />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    <Card className="glass-card border-white/5 bg-black/40 h-[450px]">
                        <CardHeader>
                            <div className="h-5 w-32 bg-white/5 rounded animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full bg-black/80 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-white/5 animate-pulse" />
                                <div className="space-y-2 flex flex-col items-center">
                                    <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
                                    <div className="h-2 w-24 bg-white/5 rounded animate-pulse" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
