import { Measurement } from "@/types";
import { demoMeasurements } from "@/lib/demo-data/measurements";

export function getMeasurementByAssetId(assetId: string): Measurement | undefined {
  // Future: Replace with real measurement API
  return demoMeasurements.find((m) => m.assetId === assetId);
}

