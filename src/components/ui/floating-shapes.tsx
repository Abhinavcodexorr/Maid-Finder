/**
 * Decorative 3D shapes — a spinning wireframe cube, a tilted ring and a
 * floating orb — built from plain CSS transforms (see "3D SHAPES" in
 * globals.css). Purely visual: hidden from assistive tech, ignores the
 * pointer, and only shown from desktop width up.
 */
export function FloatingShapes({ tone = "brand" }: { tone?: "brand" | "light" }) {
  return (
    <div aria-hidden className={`shapes-${tone} pointer-events-none absolute inset-0 hidden overflow-hidden lg:block`}>
      <div className="shape-stage absolute right-[4%] top-[14%]">
        <div className="cube">
          <span /><span /><span /><span /><span /><span />
        </div>
      </div>
      <div className="shape-stage absolute bottom-[14%] left-[3%]">
        <div className="ring3d" />
      </div>
      <div className="shape-stage absolute bottom-[16%] right-[10%]">
        <div className="orb" />
      </div>
    </div>
  );
}
