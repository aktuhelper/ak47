import { Card, CardContent } from "@/components/ui/card";

export default function ProfileStats({ profile, loading }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                            {loading ? '...' : (profile.queriesAsked || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Queries</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-chart-2">
                            {loading ? '...' : (profile.answersGiven || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Best Answers</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-chart-3">
                            {loading ? '...' : (profile.helpfulCount || 0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Helpful</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-chart-4">
                            {loading ? '...' : (profile.totalViews || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}