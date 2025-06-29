"use client";

import GenericBizPage from "@/components/GenericBizPage";
import { PAGE_CONFIGS } from "@/constants/pageConfigs";

export default function PayablesPage() {
  return <GenericBizPage config={PAGE_CONFIGS.payables} />;
}
