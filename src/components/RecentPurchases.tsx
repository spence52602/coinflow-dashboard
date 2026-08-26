/**
 * The Recent purchases card.
 *
 * Rows are flex compositions rather than table markup: each one stacks an
 * avatar, a name/email pair, method, timestamp, and amount at widths taken
 * from the comp, which table layout would not preserve.
 */
import Image from "next/image";
import type { DashboardData } from "@/data/types";
import { formatCurrency, formatInt } from "@/data/format";
import { IconChevronHeavy } from "./icons";
import { PurchasesMenu } from "./PurchasesMenu";
import { cn } from "@/lib/utils";

interface RecentPurchasesProps {
  purchases: DashboardData["purchases"];
}

export function RecentPurchases({ purchases }: RecentPurchasesProps) {
  return (
    <section
      className="border-[0.0625rem] border-rule bg-paper px-6 py-5"
      aria-label="Recent purchases"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium uppercase leading-[1.5] tracking-[0.04em] text-muted">
          Recent purchases
          <span
            className="block h-[0.6875rem] w-[0.6875rem] text-subtle"
            aria-hidden="true"
          >
            <IconChevronHeavy />
          </span>
        </span>
        <PurchasesMenu purchases={purchases} />
      </div>

      <div className="mt-4" role="table" aria-label="Recent purchases">
        {purchases.items.map((purchase, i) => (
          <div
            key={purchase.id}
            className={cn(
              "flex items-center gap-[0.875rem] border-b-[0.0625rem] border-rule-soft py-2",
              i === purchases.items.length - 1 && "border-b-0",
            )}
            role="row"
          >
            <span
              className="relative block h-[1.96875rem] w-[1.96875rem] flex-[0_0_1.96875rem] overflow-hidden rounded-[0.09375rem] border-[0.03rem] border-avatar-border bg-avatar-bg"
              role="cell"
              aria-hidden="true"
            >
              <Image
                src={purchase.customer.avatar}
                alt=""
                width={63}
                height={63}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center text-[0.75625rem] font-normal tracking-[0.02em] text-inverse">
                {purchase.customer.initials}
              </span>
            </span>
            <span className="block min-w-0 flex-1" role="cell">
              <span className="block truncate text-sm leading-[1.4] text-ink">
                {purchase.customer.name}
              </span>
              <span className="block text-xs leading-[1.4] text-muted">
                {purchase.customer.email}
              </span>
            </span>
            <span
              className="w-[8.25rem] flex-[0_0_8.25rem] whitespace-nowrap text-[0.8125rem] text-muted max-md:hidden"
              role="cell"
            >
              {purchase.method.label}
              {purchase.method.figure ? (
                <>
                  {" "}
                  <span className="font-serif tabular-nums">
                    {purchase.method.figure}
                  </span>
                </>
              ) : null}
            </span>
            <span
              className="w-[6.875rem] flex-[0_0_6.875rem] font-serif text-[0.8125rem] tracking-normal text-muted tabular-nums max-md:hidden"
              role="cell"
            >
              {purchase.occurredAt}
            </span>
            <span className="flex w-[5.75rem] flex-[0_0_5.75rem] items-center" role="cell">
              <span className="inline-flex items-center gap-[0.3125rem] rounded-control border-[0.0625rem] border-rule px-[0.4375rem] py-1 text-[0.6875rem] font-medium leading-none tracking-[0.01em] text-muted">
                <i
                  className={cn(
                    "block h-1 w-1 rounded-control",
                    purchase.status === "pending"
                      ? "border-[0.0625rem] border-subtle bg-transparent"
                      : "bg-ink",
                  )}
                />
                {purchase.status === "pending" ? "Pending" : "Settled"}
              </span>
            </span>
            <span
              className="t-fig-table w-[6.5rem] flex-[0_0_6.5rem] text-right text-ink"
              role="cell"
            >
              {formatCurrency(purchase.amount)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[0.625rem] flex items-center justify-center border-t-[0.0625rem] border-rule pt-[0.625rem]">
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-ink no-underline"
        >
          View all {formatInt(purchases.totalCount)} purchases
          <span className="block h-3 w-3" aria-hidden="true">
            <IconChevronHeavy />
          </span>
        </a>
      </div>
    </section>
  );
}
