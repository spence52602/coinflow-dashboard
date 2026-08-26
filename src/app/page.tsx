/**
 * Merchant home — the app's only route.
 *
 * Reads the dashboard payload once on the server and composes the three
 * columns: sidebar, main scroll area, and the right-hand rail. Children
 * receive already-shaped slices via props, so this stays the single place
 * that knows where the data came from.
 */
import { getDashboardData } from "@/data/dashboard";
import { Sidebar } from "@/components/Sidebar";
import { PageHeader } from "@/components/PageHeader";
import { GrossVolumeCard } from "@/components/GrossVolumeCard";
import { StatRow } from "@/components/StatRow";
import { RecentPurchases } from "@/components/RecentPurchases";
import { OnboardingCard } from "@/components/rail/OnboardingCard";
import { NeedsAttention } from "@/components/rail/NeedsAttention";
import { NextPayout } from "@/components/rail/NextPayout";

export default function Page() {
  const data = getDashboardData();

  return (
    <div className="relative mx-auto flex min-h-screen max-w-[108rem] bg-paper max-lg:max-w-none max-lg:flex-col">
      <Sidebar
        merchant={data.merchant}
        account={data.account}
        exceptionsCount={data.exceptionsCount}
        purchases={data.purchases}
        volume={data.volume}
        period={data.period}
        attention={data.attention}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          userFirstName={data.userFirstName}
          dateLine={data.dateLine}
          period={data.period}
          volume={data.volume}
          attention={data.attention}
        />
        <div className="grid min-h-0 flex-1 grid-cols-[58.5rem_25rem] gap-8 px-10 pb-[1.875rem] pt-[1.375rem] max-lg:grid-cols-1 max-lg:px-5 max-lg:pb-6 max-lg:pt-4">
          <main
            className="flex min-w-0 flex-col gap-5"
            aria-label="Overview"
          >
            <GrossVolumeCard volume={data.volume} initialRange={data.activeRange} />
            <StatRow stats={data.stats} />
            <RecentPurchases purchases={data.purchases} />
          </main>
          <aside
            className="flex min-w-0 flex-col gap-5"
            aria-label="Tasks and payouts"
          >
            <OnboardingCard onboarding={data.onboarding} />
            <NeedsAttention attention={data.attention} />
            <NextPayout payout={data.payout} />
          </aside>
        </div>
      </div>
    </div>
  );
}
