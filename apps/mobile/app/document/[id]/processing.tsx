import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GradientBackground } from "../../../components/GradientBackground";
import { useTheme } from "../../../theme/ThemeContext";
import { FadeIn, FloatingIcon, SuccessPulse } from "../../../components/motion";
import { hapticSuccess } from "../../../lib/haptics";
import { isApiConfigured } from "../../../lib/env";
import {
  downloadDocumentFile,
  ingestDocumentForRag,
  ingestUrlForRag,
} from "../../../lib/api/ingest";
import { supabase } from "../../../lib/supabase/client";

export default function ProcessingScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const started = useRef(false);
  const [docTitle, setDocTitle] = useState(title ?? "Your document");
  const [error, setError] = useState<string | null>(null);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (started.current || !id) return;
    started.current = true;

    const run = async () => {
      try {
        const { data: doc, error: docError } = await supabase
          .from("documents")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (docError || !doc) {
          setError("Document not found.");
          return;
        }

        setDocTitle(doc.title);

        if (!isApiConfigured()) {
          setComplete(true);
          void hapticSuccess();
          setTimeout(() => router.replace({ pathname: "/chat/[id]", params: { id } }), 800);
          return;
        }

        if (doc.mime_type === "application/x-documind-url") {
          await ingestUrlForRag(id, doc.file_name, doc.title);
        } else {
          const file = await downloadDocumentFile(
            doc.storage_path,
            doc.file_name,
            doc.mime_type,
          );
          await ingestDocumentForRag(id, file);
        }
        setComplete(true);
        void hapticSuccess();
        setTimeout(() => router.replace({ pathname: "/chat/[id]", params: { id } }), 800);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Indexing failed.");
      }
    };

    void run();
  }, [id, router]);

  if (error) {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.center}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Indexing failed</Text>
            <Text style={[styles.sub, { color: colors.error }]}>{error}</Text>
          </View>
        </SafeAreaView>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          {complete ? (
            <SuccessPulse visible />
          ) : (
            <FloatingIcon>
              <LinearGradient
                colors={[colors.brandGradientFrom, colors.brandGradientTo]}
                style={styles.heroIcon}
              >
                <MaterialCommunityIcons name="star-four-points" size={40} color="#fff" />
              </LinearGradient>
            </FloatingIcon>
          )}

          <FadeIn delay={40}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {complete ? "Document ready!" : "AI is reading your document…"}
            </Text>
          </FadeIn>
          <FadeIn delay={70}>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>{docTitle}</Text>
          </FadeIn>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: 32 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroIcon: {
    width: 88,
    height: 88,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  sub: { marginTop: 8, fontSize: 15, textAlign: "center" },
});
