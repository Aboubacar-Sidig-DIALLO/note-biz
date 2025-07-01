"use client";

import GenericHistoryPage from "@/components/GenericHistoryPage";
import { HISTORY_CONFIGS } from "@/constants/historyConfigs";

export default function CreditsHistory() {
  const config = HISTORY_CONFIGS.credits;
  return <GenericHistoryPage {...config} />;
}
