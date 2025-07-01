"use client";

import BizDataTable from "@/components/bizDataTable";
import Loader from "@/components/loader";
import LoadingErreur from "@/components/loadingErreur";
import { useHistory } from "@/hooks/use-history";

interface GenericHistoryPageProps {
  model: string;
  title: string;
}

export default function GenericHistoryPage({
  model,
  title,
}: GenericHistoryPageProps) {
  const { data, loading, error } = useHistory({ model });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <LoadingErreur error={error} />;
  }

  return <BizDataTable title={title} data={data} />;
}
