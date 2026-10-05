import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { error } = await supabase
    .from("products")
    .select("id")
    .limit(1);

  if (error) {
    return Response.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return Response.json({
    ok: true,
    message: "Supabase keep-alive successful",
    timestamp: new Date().toISOString(),
  });
}
