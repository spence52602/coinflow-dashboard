import type { Period } from "@/data/types";
import { IconBell, IconCalendar, IconChevron, IconExport } from "./icons";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  userFirstName: string;
  dateLine: string;
  period: Period;
}

const tabs = ["Overview", "Payments", "Payouts", "Customers"];

export function PageHeader({ userFirstName, dateLine, period }: PageHeaderProps) {
  return (
    <header className={styles.head}>
      <div className={styles.row}>
        <div>
          <h1 className="t-h3">Good morning, {userFirstName}</h1>
          <div className={styles.sub}>{dateLine}</div>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnField}`} type="button">
            <span className={styles.btnIcon} aria-hidden="true">
              <IconCalendar />
            </span>
            {period.label}
            <span className={styles.btnChevron} aria-hidden="true">
              <IconChevron style={{ transform: "rotate(90deg)" }} />
            </span>
          </button>
          <button className={styles.btn} type="button">
            <span className={styles.btnIcon} aria-hidden="true">
              <IconExport />
            </span>
            Export
          </button>
          <button className={styles.iconBtn} type="button" aria-label="Notifications">
            <span className={styles.bellIcon} aria-hidden="true">
              <IconBell />
            </span>
          </button>
        </div>
      </div>
      <nav className={styles.tabs} aria-label="Sections">
        <div className={styles.tabSet}>
          {tabs.map((tab, i) => (
            <a
              key={tab}
              href="#"
              className={i === 0 ? `${styles.tab} ${styles.tabActive}` : styles.tab}
              aria-current={i === 0 ? "page" : undefined}
            >
              {tab}
            </a>
          ))}
        </div>
        <button className={styles.tzBtn} type="button">
          Local time
          <span className={styles.tzChevron} aria-hidden="true">
            <IconChevron style={{ transform: "rotate(90deg)" }} />
          </span>
        </button>
      </nav>
    </header>
  );
}
