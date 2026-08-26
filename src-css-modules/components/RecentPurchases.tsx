import Image from "next/image";
import type { DashboardData } from "@/data/types";
import { formatCurrency, formatInt } from "@/data/format";
import { IconChevronHeavy, IconDots } from "./icons";
import styles from "./RecentPurchases.module.css";

interface RecentPurchasesProps {
  purchases: DashboardData["purchases"];
}

export function RecentPurchases({ purchases }: RecentPurchasesProps) {
  return (
    <section className={styles.card} aria-label="Recent purchases">
      <div className={styles.head}>
        <span className={styles.label}>
          Recent purchases
          <span className={styles.labelChevron} aria-hidden="true">
            <IconChevronHeavy />
          </span>
        </span>
        <button className={styles.dots} type="button" aria-label="Table menu">
          <span className={styles.dotsIcon} aria-hidden="true">
            <IconDots />
          </span>
        </button>
      </div>

      <div className={styles.table} role="table" aria-label="Recent purchases">
        {purchases.items.map((purchase) => (
          <div key={purchase.id} className={styles.row} role="row">
            <span className={styles.avatar} role="cell" aria-hidden="true">
              <Image
                src={purchase.customer.avatar}
                alt=""
                width={63}
                height={63}
              />
              <span className={styles.avatarInitials}>
                {purchase.customer.initials}
              </span>
            </span>
            <span className={styles.name} role="cell">
              <span className={styles.nameA}>{purchase.customer.name}</span>
              <span className={styles.nameB}>{purchase.customer.email}</span>
            </span>
            <span className={styles.method} role="cell">
              {purchase.method.label}
              {purchase.method.figure ? (
                <>
                  {" "}
                  <span className={styles.fig}>{purchase.method.figure}</span>
                </>
              ) : null}
            </span>
            <span className={styles.date} role="cell">
              {purchase.occurredAt}
            </span>
            <span className={styles.status} role="cell">
              <span
                className={
                  purchase.status === "pending"
                    ? `${styles.chip} ${styles.chipHollow}`
                    : styles.chip
                }
              >
                <i />
                {purchase.status === "pending" ? "Pending" : "Settled"}
              </span>
            </span>
            <span className={`${styles.amount} t-fig-table`} role="cell">
              {formatCurrency(purchase.amount)}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.foot}>
        <a href="#">
          View all {formatInt(purchases.totalCount)} purchases
          <span className={styles.footChevron} aria-hidden="true">
            <IconChevronHeavy />
          </span>
        </a>
      </div>
    </section>
  );
}
