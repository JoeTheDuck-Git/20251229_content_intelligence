"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoYouTubeVideos } from "@/lib/youtube/demo-data/youtube-videos";
import { demoRetentionMetrics } from "@/lib/youtube/demo-data/retention-metrics";
import { NarrativeTimelineCard } from "@/components/cards/NarrativeTimelineCard";
import { RetentionChart } from "@/components/charts/RetentionChart";
import { RetentionInsightPanel } from "@/components/cards/RetentionInsightPanel";
import { mapNarrativeStructure } from "@/lib/youtube/narrative-analysis/narrative-mapper";
import { analyzeRetention } from "@/lib/youtube/retention-analysis/retention-analyzer";
import { interpretDropOffs } from "@/lib/youtube/retention-analysis/drop-off-interpreter";
import { estimateLongTailPotential } from "@/lib/youtube/long-tail-analysis/long-tail-estimator";
import { generateYouTubeInsights } from "@/lib/youtube/insight-engine/youtube-insight-generator";
import { YouTubeInsightPanel } from "@/components/cards/YouTubeInsightPanel";

export default function YouTubeOverviewPage() {
  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    demoYouTubeVideos[0]?.id || ""
  );
  
  const selectedVideo = demoYouTubeVideos.find((v) => v.id === selectedVideoId);
  const metrics = selectedVideo
    ? demoRetentionMetrics.find((m) => m.assetId === selectedVideoId)
    : null;
  
  const narrativeStructure = selectedVideo
    ? mapNarrativeStructure(selectedVideo)
    : null;
  
  const retentionAnalysis = selectedVideo && metrics
    ? analyzeRetention(metrics, narrativeStructure!)
    : null;
  
  const dropOffAnalysis = selectedVideo && metrics && narrativeStructure
    ? interpretDropOffs(metrics, narrativeStructure)
    : null;
  
  const longTailAnalysis = selectedVideo && metrics && retentionAnalysis && narrativeStructure
    ? estimateLongTailPotential(metrics, retentionAnalysis, narrativeStructure)
    : null;
  
  const insights = selectedVideo && metrics
    ? generateYouTubeInsights(selectedVideo, metrics)
    : [];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">YouTube Content Intelligence</h1>
        <p className="text-muted-foreground mt-2">
          Analyze narrative structure, retention, and long-tail performance
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Select Video</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {demoYouTubeVideos.map((video) => (
              <Button
                key={video.id}
                variant={selectedVideoId === video.id ? "default" : "outline"}
                onClick={() => setSelectedVideoId(video.id)}
              >
                {video.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {selectedVideo && metrics && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NarrativeTimelineCard 
              segments={selectedVideo.narrativeSegments}
              totalDuration={selectedVideo.duration}
            />
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Watch Time</p>
                  <p className="text-2xl font-bold">
                    {Math.round(metrics.totalWatchTime / 3600).toLocaleString()} hours
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Watch Time</p>
                  <p className="text-2xl font-bold">
                    {Math.round(metrics.averageWatchTime)}s
                  </p>
                </div>
                {retentionAnalysis && (
                  <div>
                    <p className="text-sm text-muted-foreground">Average Retention</p>
                    <p className="text-2xl font-bold">
                      {retentionAnalysis.averageRetention.toFixed(1)}%
                    </p>
                  </div>
                )}
                {narrativeStructure && (
                  <div>
                    <p className="text-sm text-muted-foreground">Pacing Score</p>
                    <p className="text-2xl font-bold">
                      {narrativeStructure.pacingScore.toFixed(1)}/10
                    </p>
                  </div>
                )}
                {longTailAnalysis && (
                  <div>
                    <p className="text-sm text-muted-foreground">Long-Tail Potential</p>
                    <Badge 
                      variant={longTailAnalysis.longTailPotential === "high" ? "default" : "outline"}
                      className={
                        longTailAnalysis.longTailPotential === "high" 
                          ? "bg-green-500 text-white" 
                          : longTailAnalysis.longTailPotential === "medium"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                      }
                    >
                      {longTailAnalysis.longTailPotential.toUpperCase()}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Retention Curve</CardTitle>
            </CardHeader>
            <CardContent>
              <RetentionChart 
                data={metrics.retentionData}
                narrativeSegments={selectedVideo.narrativeSegments}
              />
            </CardContent>
          </Card>
          
          {retentionAnalysis && (
            <RetentionInsightPanel insights={retentionAnalysis.retentionBySegment} />
          )}
          
          {longTailAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle>Long-Tail Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Estimated Long-Tail Views</p>
                    <p className="text-2xl font-bold">
                      {longTailAnalysis.estimatedLongTailViews.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Watch Time Trend</p>
                    <Badge variant="outline" className="capitalize">
                      {longTailAnalysis.watchTimeTrend}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Reasoning</p>
                    <p className="text-sm">{longTailAnalysis.reasoning}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {insights.length > 0 && (
            <YouTubeInsightPanel insights={insights} />
          )}
        </>
      )}
    </div>
  );
}

