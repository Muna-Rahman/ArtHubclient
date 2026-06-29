import { NextResponse } from "next/server";

export async function proxyHandler(req) {
  const { pathname, search } = new URL(req.url);
  const subPath = pathname.replace(/^\/api\/auth/, "");
  
  const backendBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://arthub-server-ten.vercel.app";
  const targetUrl = `${backendBaseUrl}/api/auth${subPath}${search}`;

  const headers = new Headers(req.headers);
  headers.set("x-forwarded-host", process.env.NEXT_PUBLIC_APP_URL || "https://arthub-mauve.vercel.app");

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
      redirect: "manual",
    });

    // Extract headers and specifically map cookies
    const newHeaders = new Headers(response.headers);

    return new NextResponse(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (error) {
    console.error("❌ Next.js Authentication Proxy Failed:", error);
    return NextResponse.json({ success: false, message: "Proxy Connection Error" }, { status: 500 });
  }
}

export { proxyHandler as GET, proxyHandler as POST };