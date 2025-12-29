import { AdsMetric, FatigueSignal } from "@/types/fatigue";

export function detectFrequencySaturation(metrics: AdsMetric[]): FatigueSignal {
  if (metrics.length < 2) {
    return {
      id: "freq-1",
      type: "frequency_saturation",
      severity: "low",
      detected: false,
      description: "Insufficient data for frequency analysis",
    };
  }

  const recent = metrics.slice(-3);
  const latest = recent[recent.length - 1];
  const previous = recent[0];

  const frequencyIncrease = latest.frequency - previous.frequency;
  const frequencyIncreaseRate = frequencyIncrease / previous.frequency;

  if (latest.frequency > 4.5 && frequencyIncreaseRate > 0.2) {
    return {
      id: "freq-1",
      type: "frequency_saturation",
      severity: "high",
      detected: true,
      description: `Frequency has increased from ${previous.frequency.toFixed(1)}x to ${latest.frequency.toFixed(1)}x (${(frequencyIncreaseRate * 100).toFixed(0)}% increase), indicating audience saturation`,
    };
  }

  if (latest.frequency > 3.5 && frequencyIncreaseRate > 0.15) {
    return {
      id: "freq-1",
      type: "frequency_saturation",
      severity: "medium",
      detected: true,
      description: `Frequency is increasing (${latest.frequency.toFixed(1)}x) and may lead to saturation`,
    };
  }

  return {
    id: "freq-1",
    type: "frequency_saturation",
    severity: "low",
    detected: false,
    description: "Frequency levels are within healthy range",
  };
}

export function detectCTRDecay(metrics: AdsMetric[]): FatigueSignal {
  if (metrics.length < 3) {
    return {
      id: "ctr-1",
      type: "ctr_decay",
      severity: "low",
      detected: false,
      description: "Insufficient data for CTR trend analysis",
    };
  }

  const recent = metrics.slice(-4);
  const ctrValues = recent.map((m) => m.ctr);
  const latest = ctrValues[ctrValues.length - 1];
  const initial = ctrValues[0];

  const ctrDecline = initial - latest;
  const ctrDeclineRate = ctrDecline / initial;

  // Check if CTR is consistently declining
  const isDeclining = ctrValues.every(
    (val, idx) => idx === 0 || val <= ctrValues[idx - 1] * 1.02
  );

  if (isDeclining && ctrDeclineRate > 0.2 && latest < 3.5) {
    return {
      id: "ctr-1",
      type: "ctr_decay",
      severity: "high",
      detected: true,
      description: `CTR has declined from ${initial.toFixed(1)}% to ${latest.toFixed(1)}% (${(ctrDeclineRate * 100).toFixed(0)}% decrease), indicating creative fatigue`,
    };
  }

  if (isDeclining && ctrDeclineRate > 0.15) {
    return {
      id: "ctr-1",
      type: "ctr_decay",
      severity: "medium",
      detected: true,
      description: `CTR is declining (${initial.toFixed(1)}% → ${latest.toFixed(1)}%), showing early signs of fatigue`,
    };
  }

  return {
    id: "ctr-1",
    type: "ctr_decay",
    severity: "low",
    detected: false,
    description: "CTR trend is stable or improving",
  };
}

export function detectROASDecline(metrics: AdsMetric[]): FatigueSignal {
  if (metrics.length < 2) {
    return {
      id: "roas-1",
      type: "roas_decline",
      severity: "low",
      detected: false,
      description: "Insufficient data for ROAS trend analysis",
    };
  }

  const recent = metrics.slice(-3);
  const latest = recent[recent.length - 1];
  const previous = recent[0];

  const roasDecline = previous.roas - latest.roas;
  const roasDeclineRate = roasDecline / previous.roas;
  const spendIncrease = latest.spend > previous.spend;

  if (spendIncrease && roasDeclineRate > 0.15 && latest.roas < 3.0) {
    return {
      id: "roas-1",
      type: "roas_decline",
      severity: "high",
      detected: true,
      description: `ROAS declined from ${previous.roas.toFixed(1)}x to ${latest.roas.toFixed(1)}x despite increased spend, indicating performance degradation`,
    };
  }

  if (spendIncrease && roasDeclineRate > 0.1) {
    return {
      id: "roas-1",
      type: "roas_decline",
      severity: "medium",
      detected: true,
      description: `ROAS is declining (${previous.roas.toFixed(1)}x → ${latest.roas.toFixed(1)}x) as spend increases`,
    };
  }

  return {
    id: "roas-1",
    type: "roas_decline",
    severity: "low",
    detected: false,
    description: "ROAS trend is stable or improving",
  };
}

export function detectSpendEfficiencyDrop(metrics: AdsMetric[]): FatigueSignal {
  if (metrics.length < 2) {
    return {
      id: "spend-1",
      type: "spend_efficiency_drop",
      severity: "low",
      detected: false,
      description: "Insufficient data for spend efficiency analysis",
    };
  }

  const recent = metrics.slice(-2);
  const latest = recent[recent.length - 1];
  const previous = recent[0];

  const spendIncrease = (latest.spend - previous.spend) / previous.spend;
  const conversionIncrease = (latest.conversions - previous.conversions) / previous.conversions;

  // If spend increased more than conversions, efficiency dropped
  if (spendIncrease > 0.2 && conversionIncrease < spendIncrease * 0.5) {
    return {
      id: "spend-1",
      type: "spend_efficiency_drop",
      severity: "high",
      detected: true,
      description: `Spend increased ${(spendIncrease * 100).toFixed(0)}% but conversions only increased ${(conversionIncrease * 100).toFixed(0)}%, indicating efficiency drop`,
    };
  }

  return {
    id: "spend-1",
    type: "spend_efficiency_drop",
    severity: "low",
    detected: false,
    description: "Spend efficiency is maintained",
  };
}

export function detectAllFatigueSignals(metrics: AdsMetric[]): FatigueSignal[] {
  return [
    detectFrequencySaturation(metrics),
    detectCTRDecay(metrics),
    detectROASDecline(metrics),
    detectSpendEfficiencyDrop(metrics),
  ];
}

