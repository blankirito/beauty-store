import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (
    !cronSecret ||
    request.headers.get("authorization") !== `Bearer ${cronSecret}`
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: jobs, error: jobsError } = await supabase
    .from("payment_qr_cleanup_jobs")
    .select("id, storage_path, attempts")
    .order("created_at", { ascending: true })
    .limit(100);

  if (jobsError) {
    return Response.json(
      { error: "Could not load payment QR cleanup jobs." },
      { status: 500 },
    );
  }

  let removedCount = 0;
  let failedCount = 0;

  for (const job of jobs ?? []) {
    const { error: removeError } = await supabase.storage
      .from("payment-qr-codes")
      .remove([job.storage_path]);

    if (removeError) {
      failedCount += 1;

      await supabase
        .from("payment_qr_cleanup_jobs")
        .update({
          attempts: job.attempts + 1,
          last_error: removeError.message,
        })
        .eq("id", job.id);

      continue;
    }

    removedCount += 1;

    await supabase
      .from("payment_qr_cleanup_jobs")
      .delete()
      .eq("id", job.id);
  }

  return Response.json({
    processed: (jobs ?? []).length,
    removed: removedCount,
    failed: failedCount,
  });
}