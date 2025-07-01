import { useState, useEffect, useCallback } from "react";

export interface HistoryEntity {
  id: string;
  name: string;
  value: number;
  createdAt: string;
}

export interface TransformedHistoryData {
  id: string;
  clientName: string;
  amount: number;
  date: string;
}

interface UseHistoryProps {
  model: string;
}

export function useHistory({ model }: UseHistoryProps) {
  const [data, setData] = useState<TransformedHistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/crud/${model}/history`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'historique");
      }
      const historyData: HistoryEntity[] = await response.json();

      // Transformer les données pour correspondre au format attendu par BizDataTable
      const transformedData: TransformedHistoryData[] = historyData.map(
        (item) => ({
          id: item.id,
          clientName: item.name,
          amount: item.value,
          date: item.createdAt,
        })
      );

      setData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }, [model]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    data,
    loading,
    error,
    refresh: fetchHistory,
  };
}
