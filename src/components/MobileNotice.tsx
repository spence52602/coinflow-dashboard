/**
 * Desktop-only gate.
 *
 * This dashboard is a pixel-faithful rebuild of a 1728px comp — a desktop
 * design. Below sm the layout restacks, but that end was never in scope, so a
 * phone gets the product frosted over with a note rather than an approximation.
 *
 * A viewport gate, not a device gate: pure CSS, no user-agent sniffing, so it
 * can never disagree with what the browser is actually able to show.
 *
 * The blur itself lives on the content wrapper in the layout, not here. This
 * started as `backdrop-filter` on this layer, which reads better in principle —
 * but measured in WebKit it computes to blur(18px) and then paints nothing,
 * leaving the whole dashboard legible through the note. A compositor effect
 * cannot be what stands between a reviewer and an unfinished layout. This layer
 * is now just the wash that lifts the note off the blurred page, and it stays
 * childless so nothing that must render sharp sits inside a filtered element.
 */
export function MobileNotice() {
  return (
    <>
      <div
        className="fixed inset-0 z-40 hidden bg-paper/60 max-sm:block"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 hidden touch-none place-items-center overscroll-none px-8 max-sm:grid"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-notice-title"
      >
        <div className="max-w-[23rem] text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size committed SVG */}
          <img
            className="mx-auto block h-[2rem] w-auto"
            src="/img/coinflow-lockup.svg"
            alt="Coinflow"
          />
          <h1 id="mobile-notice-title" className="t-h3 mt-8">
            Best seen on desktop
          </h1>
          <p className="t-body mt-4 text-muted">
            This dashboard is a pixel-faithful rebuild of a 1728px Figma comp.
            The comp is a desktop design, so the build is one too — I’d rather
            show you the real thing at full fidelity than an approximation of
            it.
          </p>
          <p className="t-sm mt-6 text-muted">Open it on a wider screen.</p>
        </div>
      </div>
    </>
  );
}
