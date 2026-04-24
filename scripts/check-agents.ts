import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://elpulehthjvzyqwgqezv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscHVsZWh0aGp2enlxd2dxZXp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTI5ODM1MiwiZXhwIjoyMDkwODc0MzUyfQ.LrBEpULepqhu1EaQCVsPirmR-nT3zDupvvcbpZt_YO0"
);

async function checkAgents() {
  const { data, error } = await supabase
    .from("agents")
    .select("name, status")
    .in("name", ["options-trader", "yield-aggregator", "3d-designer", "ui-ux-designer"]);

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Found agents:");
    console.log(JSON.stringify(data, null, 2));
    console.log(`\nTotal found: ${data?.length || 0}`);
  }

  // Also get total count
  const { count } = await supabase
    .from("agents")
    .select("*", { count: "exact", head: true });

  console.log(`Total agents in database: ${count}`);
}

checkAgents();
