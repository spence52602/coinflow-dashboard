import { getDashboardData } from "@/data/dashboard";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { GrossVolumeCard } from "@/components/GrossVolumeCard";
import { StatRow } from "@/components/StatRow";
import { RecentPurchases } from "@/components/RecentPurchases";
import { OnboardingCard } from "@/components/rail/OnboardingCard";
import { NeedsAttention } from "@/components/rail/NeedsAttention";
import { NextPayout } from "@/components/rail/NextPayout";
import styles from "./page.module.css";

export default function Page() {
  const data = getDashboardData();

  return (
    <div className={styles.app}>
      <Sidebar
        merchant={data.merchant}
        account={data.account}
        exceptionsCount={data.exceptionsCount}
      />
      <div className={styles.main}>
        <PageHeader
          userFirstName={data.userFirstName}
          dateLine={data.dateLine}
          period={data.period}
        />
        <div className={styles.body}>
          <main className={styles.col} aria-label="Overview">
            <GrossVolumeCard volume={data.volume} activeRange={data.activeRange} />
            <StatRow stats={data.stats} />
            <RecentPurchases purchases={data.purchases} />
          </main>
          <aside className={`${styles.col} ${styles.rail}`} aria-label="Tasks and payouts">
            <OnboardingCard onboarding={data.onboarding} />
            <NeedsAttention attention={data.attention} />
            <NextPayout payout={data.payout} />
          </aside>
        </div>
      </div>
    </div>
  );
}
