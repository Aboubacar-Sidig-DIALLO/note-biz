"use client";

import GenericHistoryPage from "@/components/GenericHistoryPage";
import { HISTORY_CONFIGS } from "@/constants/historyConfigs";

export default function Changes() {
  const config = HISTORY_CONFIGS.changes;
  return <GenericHistoryPage {...config} />;
}
