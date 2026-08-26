/**
 * Desktop-only gate.
 *
 * This dashboard is a pixel-faithful rebuild of a 1728px comp. Below sm the
 * layout restacks, but it has never been given the same care, so a phone gets
 * the product frosted over with a note instead of a rough approximation of it.
 *
 * A viewport gate, not a device gate: pure CSS, no user-agent sniffing, so it
 * can never disagree with what the browser is actually able to show. The frost
 * is `backdrop-filter` rather than a blur on the page itself — blurring an
 * ancestor would make it the containing block for the sticky sidebar and every
 * fixed overlay underneath.
 *
 * The frost and the note are two sibling layers, and the frost layer is
 * deliberately childless. An element carrying a backdrop-filter is promoted to
 * its own composited layer, and WebKit in particular rasterises that layer's
 * subtree along with the effect — which softens vector and text children on a
 * high-DPR screen. Keeping the note in a sibling above the frost means nothing
 * that has to stay sharp ever sits inside a filtered element.
 */
export function MobileNotice() {
  return (
    <>
      <div
        className="fixed inset-0 z-40 hidden bg-paper/72 backdrop-blur-[18px] max-sm:block"
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
            Due to time constraints I didn’t get to the mobile layout, and I’d
            rather show you this than a rough version of the real thing.
          </p>
          <p className="t-sm mt-6 text-muted">Open it on a wider screen.</p>
        </div>
      </div>
    </>
  );
}
