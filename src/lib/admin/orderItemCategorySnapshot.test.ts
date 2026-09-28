import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("order item category snapshot migration", () => {
  it("stores the product category on every new order item", () => {
    const migration = readFileSync(
      resolve(
        process.cwd(),
        "supabase/migrations/024_order_item_category_snapshot.sql",
      ),
      "utf8",
    );

    expect(migration).toContain(
      "add column if not exists product_category text",
    );
    expect(migration).toContain(
      "create or replace function public.assign_order_item_category()",
    );
    expect(migration).toContain("before insert on public.order_items");
    expect(migration).toContain("select category");
  });
});