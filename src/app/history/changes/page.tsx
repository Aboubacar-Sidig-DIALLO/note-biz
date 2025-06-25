"use client";

import { useState, useEffect } from "react";
import BizDataTable from "@/components/bizDataTable";
import Loader from "@/components/loader";
import LoadingErreur from "@/components/loadingErreur";

interface ChangeHistory {
  id: string;
  name: string;
  value: number;
  createdAt: string;
}

interface DataProps {
  id: string;
  clientName: string;
  amount: number;
  date: string;
}

const Changes = () => {
  const [data, setData] = useState<DataProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/crud/changes/history");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'historique");
        }
        const historyData: ChangeHistory[] = await response.json();

        // Transformer les données pour correspondre au format attendu par BizDataTable
        const transformedData: DataProps[] = historyData.map((item) => ({
          id: item.id,
          clientName: item.name,
          amount: item.value,
          date: new Date(item.createdAt).toLocaleDateString("fr-FR"),
        }));

        setData(transformedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <LoadingErreur error={error} />;
  }

  return <BizDataTable title='Historique des Monnaies' data={data} />;
};

export default Changes;
