import type { Attention, AttentionItem } from "@/data/types";
import {
  IconAttnAch,
  IconAttnDisputes,
  IconAttnInformation,
  IconCtaArrow,
} from "../icons";

interface NeedsAttentionProps {
  attention: Attention;
}

const iconFor: Record<AttentionItem["icon"], typeof IconAttnDisputes> = {
  disputes: IconAttnDisputes,
  information: IconAttnInformation,
  ach: IconAttnAch,
};

export function NeedsAttention({ attention }: NeedsAttentionProps) {
  return (
    <section
      className="border-[0.0625rem] border-rule bg-paper px-[1.55rem] pb-4 pt-[1.625rem]"
      aria-label="Needs attention"
    >
      <span className="block text-[0.8125rem] font-normal uppercase leading-[1.2] tracking-[0.04em] text-attn-label">
        Needs attention
      </span>
      <h2 className="t-title-attn mt-[1.4375rem] text-ink">{attention.title}</h2>
      <ul className="mt-[0.8125rem]">
        {attention.items.map((item) => {
          const Icon = iconFor[item.icon];
          return (
            <li key={item.id}>
              <a
                className="flex items-center gap-[0.9375rem] border-b-[0.0625rem] border-rule-soft py-1.5 text-ink no-underline"
                href="#"
              >
                <span
                  className="block h-[0.9rem] w-[0.9rem] flex-[0_0_0.9rem] text-icon-rail"
                  aria-hidden="true"
                >
                  <Icon />
                </span>
                <span className="block min-w-0 flex-1">
                  <span className="block text-sm leading-[1.19] text-ink">
                    {item.label}
                  </span>
                  <span className="mt-[0.1875rem] block text-xs leading-[1.19] text-attn-sub">
                    {item.note}
                  </span>
                </span>
                <span className="font-serif text-[1.4375rem] font-normal text-ink tabular-nums">
                  {item.count}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <a
        className="mt-[0.9375rem] flex h-[2.4375rem] items-center justify-center gap-[0.4375rem] rounded-control bg-ink text-sm font-medium leading-[normal] text-cta-on-dark no-underline"
        href="#"
      >
        Review all
        <span className="block h-[0.975rem] w-[0.975rem]" aria-hidden="true">
          <IconCtaArrow />
        </span>
      </a>
    </section>
  );
}
