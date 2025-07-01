"use client";

import GenericHistoryPage from "@/components/GenericHistoryPage";
import { HISTORY_CONFIGS } from "@/constants/historyConfigs";

export default function InvestmentsHistory() {
  const config = HISTORY_CONFIGS.investments;
  return <GenericHistoryPage {...config} />;
}
