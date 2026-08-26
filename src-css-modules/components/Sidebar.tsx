import Image from "next/image";
import type { Account, Merchant } from "@/data/types";
import {
  IconArrowUpRight,
  IconChevron,
  IconDevelopers,
  IconDocumentation,
  IconExceptions,
  IconExternal,
  IconHome,
  IconPayments,
  IconPayouts,
  IconReports,
  IconSearch,
  IconSettings,
} from "./icons";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  merchant: Merchant;
  account: Account;
  exceptionsCount: number;
}

const operateItems = [
  { label: "Home", icon: IconHome, active: true },
  { label: "Payments", icon: IconPayments },
  { label: "Payouts", icon: IconPayouts },
  { label: "Exceptions", icon: IconExceptions, hasCount: true },
];

const manageItems = [
  { label: "Reports", icon: IconReports },
  { label: "Developers", icon: IconDevelopers },
  { label: "Settings", icon: IconSettings },
];

export function Sidebar({ merchant, account, exceptionsCount }: SidebarProps) {
  return (
    <aside className={styles.side}>
      <div className={styles.brand}>
        {/* Brand lockup — committed vector from the Figma file (178:6369). */}
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size committed SVG */}
        <img
          className={styles.lockup}
          src="/img/coinflow-lockup.svg"
          alt="Coinflow"
        />
      </div>

      <button className={styles.switch} type="button">
        <span className={styles.switchAvatar} aria-hidden="true">
          <Image src={merchant.avatar} alt="" width={56} height={56} />
          <span className={styles.switchInitials}>{merchant.initials}</span>
        </span>
        <span className={styles.switchWho}>
          <span className={styles.switchLabel}>{merchant.label}</span>
          <span className={styles.switchValue}>{merchant.displayId}</span>
        </span>
        <span className={styles.switchChevron} aria-hidden="true">
          <IconChevron style={{ transform: "rotate(90deg)" }} />
        </span>
      </button>

      <button className={styles.search} type="button">
        <span className={styles.searchIcon} aria-hidden="true">
          <IconSearch />
        </span>
        <span className={styles.searchPlaceholder}>Search</span>
        <span className={styles.searchKbd}>⌘K</span>
      </button>

      <div className={styles.group}>Operate</div>
      <nav className={styles.nav} aria-label="Operate">
        {operateItems.map(({ label, icon: Icon, active, hasCount }) => (
          <a
            key={label}
            href="#"
            className={active ? `${styles.item} ${styles.itemActive}` : styles.item}
            aria-current={active ? "page" : undefined}
          >
            <span className={styles.itemIcon} aria-hidden="true">
              <Icon />
            </span>
            <span className={styles.itemLabel}>{label}</span>
            {hasCount ? <span className={styles.count}>{exceptionsCount}</span> : null}
            {!active ? (
              <span className={styles.itemChevron} aria-hidden="true">
                <IconChevron />
              </span>
            ) : null}
          </a>
        ))}
      </nav>

      <div className={styles.group}>Manage</div>
      <nav className={styles.nav} aria-label="Manage">
        {manageItems.map(({ label, icon: Icon }) => (
          <a key={label} href="#" className={styles.item}>
            <span className={styles.itemIcon} aria-hidden="true">
              <Icon />
            </span>
            <span className={styles.itemLabel}>{label}</span>
            <span className={styles.itemChevron} aria-hidden="true">
              <IconChevron />
            </span>
          </a>
        ))}
      </nav>

      <div className={styles.foot}>
        <a className={styles.docs} href="#">
          <span className={styles.itemIcon} aria-hidden="true">
            <IconDocumentation />
          </span>
          Documentation
          <span className={styles.docsExternal} aria-hidden="true">
            <IconArrowUpRight />
          </span>
        </a>
        <div className={styles.me}>
          <span className={styles.meAvatar}>
            <Image src={account.avatar} alt="" width={63} height={63} />
          </span>
          <span className={styles.meText}>
            <span className={styles.meLabel}>Account</span>
            <span className={styles.meValue}>{account.email}</span>
          </span>
          <button className={styles.meOut} type="button" aria-label="Sign out">
            <IconExternal />
          </button>
        </div>
      </div>
    </aside>
  );
}
