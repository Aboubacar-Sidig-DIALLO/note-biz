import { useState, useCallback } from "react";

// Types pour les réponses API
interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
  message?: string;
}

// Types pour les paramètres
interface CrudParams {
  model: "changes" | "credits" | "investments" | "guinee-credits";
}

interface CreateParams<T> extends CrudParams {
  data: Omit<T, "id" | "createdAt" | "updatedAt">;
}

interface UpdateParams<T> extends CrudParams {
  id: string;
  data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>;
}

interface DeleteParams extends CrudParams {
  id: string;
  moveToHistory?: boolean;
}

interface HistoryParams extends CrudParams {
  originalId?: string;
}

// Hook personnalisé pour les opérations CRUD
export function useCrud<T extends { id: string }>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction générique pour les appels API
  const apiCall = useCallback(
    async <R>(
      url: string,
      options: RequestInit = {}
    ): Promise<ApiResponse<R>> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Erreur lors de la requête");
        }

        return { data: result, success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur inconnue";
        setError(errorMessage);
        return { error: errorMessage, success: false };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Créer un nouvel enregistrement
  const create = useCallback(
    async (params: CreateParams<T>): Promise<ApiResponse<T>> => {
      return apiCall<T>(`/api/crud/${params.model}`, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
    },
    [apiCall]
  );

  // Récupérer tous les enregistrements
  const findAll = useCallback(
    async (params: CrudParams): Promise<ApiResponse<T[]>> => {
      return apiCall<T[]>(`/api/crud/${params.model}`);
    },
    [apiCall]
  );

  // Récupérer un enregistrement par ID
  const findById = useCallback(
    async (params: CrudParams & { id: string }): Promise<ApiResponse<T>> => {
      return apiCall<T>(`/api/crud/${params.model}?id=${params.id}`);
    },
    [apiCall]
  );

  // Mettre à jour un enregistrement
  const update = useCallback(
    async (params: UpdateParams<T>): Promise<ApiResponse<T>> => {
      return apiCall<T>(`/api/crud/${params.model}?id=${params.id}`, {
        method: "PUT",
        body: JSON.stringify(params.data),
      });
    },
    [apiCall]
  );

  // Supprimer un enregistrement
  const deleteRecord = useCallback(
    async (
      params: DeleteParams
    ): Promise<ApiResponse<{ success: boolean; message: string }>> => {
      const url = params.moveToHistory
        ? `/api/crud/${params.model}?id=${params.id}&moveToHistory=true`
        : `/api/crud/${params.model}?id=${params.id}`;

      return apiCall<{ success: boolean; message: string }>(url, {
        method: "DELETE",
      });
    },
    [apiCall]
  );

  // Récupérer l'historique
  const getHistory = useCallback(
    async (params: HistoryParams): Promise<ApiResponse<unknown[]>> => {
      const url = `/api/crud/${params.model}/history`;
      return apiCall<unknown[]>(url);
    },
    [apiCall]
  );

  return {
    loading,
    error,
    create,
    findAll,
    findById,
    update,
    delete: deleteRecord,
    getHistory,
  };
}
