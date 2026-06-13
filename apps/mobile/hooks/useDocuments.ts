import { useCallback, useEffect, useState } from "react";
import { type DocumentListItem } from "../data/demo-documents";
import { isSupabaseConfigured } from "../lib/env";
import { listDocuments } from "../lib/supabase/documents";
import { useAuth } from "../context/AuthContext";

export function useDocuments(forceEmpty?: boolean) {
  const { user, loading: authLoading } = useAuth();
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (forceEmpty) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured() || !user) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const rows = await listDocuments();
      setDocuments(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load documents.");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [forceEmpty, user]);

  useEffect(() => {
    if (authLoading) return;
    void refresh();
  }, [authLoading, refresh]);

  return { documents, loading: loading || authLoading, error, refresh };
}
