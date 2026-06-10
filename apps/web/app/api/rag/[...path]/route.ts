import { createClient } from "@/services/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const BACKEND =
  process.env.RAG_API_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  (process.env.NODE_ENV === "production" ? "" : "http://localhost:8000");

async function getVerifiedAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

async function proxy(request: NextRequest, path: string[]) {
  if (!BACKEND) {
    return NextResponse.json({ detail: "RAG API is not configured." }, { status: 503 });
  }

  const isHealth = path.length === 1 && path[0] === "health";
  const accessToken = isHealth ? null : await getVerifiedAccessToken();
  if (!isHealth && !accessToken) {
    return NextResponse.json({ detail: "Sign in required." }, { status: 401 });
  }

  const targetPath = path.join("/");
  const url = `${BACKEND}/api/v1/${targetPath}${request.nextUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);
  if (BACKEND.includes("loca.lt")) {
    headers.set("Bypass-Tunnel-Reminder", "true");
  }
  const apiKey = process.env.RAG_API_KEY;
  if (apiKey) headers.set("X-API-Key", apiKey);

  const init: RequestInit = { method: request.method, headers };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const response = await fetch(url, init);
  const body = await response.arrayBuffer();

  return new NextResponse(body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxy(request, path);
}
