"use client";

import { ContentAsset } from "@/types";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { CreativeFeatureBadge } from "@/components/badges/CreativeFeatureBadge";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ContentAssetTableProps {
  assets: ContentAsset[];
}

export function ContentAssetTable({ assets }: ContentAssetTableProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="h-12 px-4 text-left align-middle font-medium">Platform</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Duration</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Creative Tags</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Views</th>
            <th className="h-12 px-4 text-left align-middle font-medium">CTR</th>
            <th className="h-12 px-4 text-left align-middle font-medium">ROAS</th>
            <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="border-b transition-colors hover:bg-muted/50">
              <td className="p-4 align-middle">
                <Badge variant="outline">{asset.platform}</Badge>
              </td>
              <td className="p-4 align-middle">{asset.duration}s</td>
              <td className="p-4 align-middle">
                <CreativeFeatureBadge features={asset.creativeFeatures} />
              </td>
              <td className="p-4 align-middle">{formatNumber(asset.views || 0)}</td>
              <td className="p-4 align-middle">{formatPercentage(asset.ctr || 0)}</td>
              <td className="p-4 align-middle">{asset.roas?.toFixed(2)}x</td>
              <td className="p-4 align-middle">
                <Link href={`/dashboard/content-ads-performance?assetId=${asset.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

