// Exploration 03 — the country as a 3D model (three.js). The states are
// extruded from the same outlines the atlas draws; home offices stand as
// posts, taller where companies share an address. Turn and tilt it by hand;
// it never moves on its own. The model fills the whole stage: an office
// control above it finds a post, and a selected post opens a small tile where
// it stands instead of a dialog.
import { Suspense, useContext, useEffect, useMemo, useRef, useState, type ComponentRef, type RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Edges, Html, OrbitControls } from '@react-three/drei';
import { ArrowUpRight, ChevronDown, X } from 'lucide-react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { ExampleContext } from '../examples/context';
import { Atlas, ExplorationRoot, Fallback, MotionContext, REGIONS, VIEWBOX, WHOLE_COUNTRY, lower48, offices, prefersReducedMotion, rolesCount, usePaint, type Office } from './shared';
import { hasWebGL } from './maplibre';

const DEPTH = 14;
const FOV = 30;
// The home view looks down at the country from the south-east of straight on; its distance is fitted to the canvas.
const HOME_DIRECTION = new THREE.Vector3(0, 0.72, 0.69).normalize();
const HOME_TARGET = new THREE.Vector3(0, 0, 0);
const MODEL = { width: VIEWBOX.width + 80, depth: VIEWBOX.height + 120 };
// How close the view comes when an office is chosen from the control.
const FOCUS_DISTANCE = 820;
const FOCUS_MS = 700;

const postHeight = (office: Office) => 28 + (office.members.length - 1) * 16;

/** World position of a point above an office: the atlas is laid flat (y down → z) and centred on the origin. */
const worldOf = (office: Office, up = 0) => new THREE.Vector3(office.point[0] - VIEWBOX.width / 2, up, office.point[1] - VIEWBOX.height / 2);

/** Camera distance along the home direction at which the whole model fits the current canvas. */
function fitDistance(aspect: number) {
  const half = Math.tan((FOV / 2) * (Math.PI / 180));
  // The tilted view foreshortens the model's depth to roughly 0.78 of its length.
  return Math.max((MODEL.width / 2) / (half * aspect), (MODEL.depth * 0.78) / 2 / half) * 0.8;
}

function homePosition(aspect: number) {
  return HOME_TARGET.clone().add(HOME_DIRECTION.clone().multiplyScalar(fitDistance(aspect)));
}

let stateGeometries: { id: string; geometry: THREE.ExtrudeGeometry }[] | null = null;
/** Extruded state outlines, built once per session from the atlas paths. */
function buildStates() {
  if (stateGeometries) return stateGeometries;
  const loader = new SVGLoader();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">${lower48.map((s) => `<path id="s${s.id}" d="${s.path}"/>`).join('')}</svg>`;
  const parsed = loader.parse(svg);
  stateGeometries = parsed.paths.map((path) => {
    const shapes = SVGLoader.createShapes(path);
    const geometry = new THREE.ExtrudeGeometry(shapes, { depth: DEPTH, bevelEnabled: false, curveSegments: 4 });
    return { id: String((path.userData as { node?: Element }).node?.id ?? ''), geometry };
  });
  return stateGeometries;
}

function Country({ paint }: { paint: ReturnType<typeof usePaint> }) {
  const states = useMemo(buildStates, []);
  // Extrusions carry two material groups: the caps (top face) and the side walls.
  const materials = useMemo(() => [
    new THREE.MeshStandardMaterial({ color: paint.civic, roughness: 0.85, metalness: 0 }),
    new THREE.MeshStandardMaterial({ color: paint.deep, roughness: 0.9, metalness: 0 }),
  ], [paint]);
  return (
    <group>
      {states.map((s) => (
        <mesh key={s.id} geometry={s.geometry} material={materials}>
          <Edges threshold={30} color={paint.rule} />
        </mesh>
      ))}
    </group>
  );
}

function Post({ office, hovered, selected, onHover, onSelect, paint }: { office: Office; hovered: boolean; selected: boolean; onHover: (key: string | null) => void; onSelect: (office: Office) => void; paint: ReturnType<typeof usePaint> }) {
  const height = postHeight(office);
  const [x, y] = office.point;
  return (
    // In SVG space z points down into the ground after the group rotation, so the post rises along −z.
    <group position={[x, y, 0]}>
      <mesh
        position={[0, 0, -height / 2]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(office.key); }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onSelect(office); }}
      >
        <boxGeometry args={[10, 10, height]} />
        <meshStandardMaterial color={hovered || selected ? paint.green : paint.white} roughness={0.6} />
      </mesh>
      {hovered && !selected && (
        <Html position={[0, 0, -height - 10]} center zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          <div className="dycom-x__relief-label">{office.members.map((m) => m.name).join(' · ')}<br /><small>{office.city}, {office.state}</small></div>
        </Html>
      )}
    </group>
  );
}

function Cursor({ active }: { active: boolean }) {
  const { gl } = useThree();
  useEffect(() => { gl.domElement.style.cursor = active ? 'pointer' : 'grab'; }, [active, gl]);
  return null;
}

/** Places the camera at the home view for the canvas's aspect ratio, once, and whenever the visitor asks to reset. */
function HomeView({ resetKey }: { resetKey: number }) {
  const { camera, size, invalidate } = useThree();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current && resetKey === 0) return;
    fitted.current = true;
    camera.position.copy(homePosition(size.width / size.height));
    camera.lookAt(HOME_TARGET);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate, resetKey]);
  return null;
}

type Controls = ComponentRef<typeof OrbitControls>;
type Focus = { office: Office; n: number };

/** Eases the view to an office chosen from the control (brand ease-out; a jump with Motion off or reduced motion). */
function FocusOffice({ focus, controls, motionOff }: { focus: Focus | null; controls: RefObject<Controls | null>; motionOff: boolean }) {
  const { camera, invalidate } = useThree();
  const flight = useRef<{ fromPos: THREE.Vector3; fromTarget: THREE.Vector3; toPos: THREE.Vector3; toTarget: THREE.Vector3; start: number } | null>(null);
  useEffect(() => {
    const c = controls.current;
    if (!focus || !c) return;
    const toTarget = worldOf(focus.office);
    const offset = camera.position.clone().sub(c.target);
    const toPos = toTarget.clone().add(offset.normalize().multiplyScalar(Math.min(offset.length(), FOCUS_DISTANCE)));
    if (motionOff || prefersReducedMotion()) {
      flight.current = null;
      c.target.copy(toTarget);
      camera.position.copy(toPos);
      c.update();
      invalidate();
      return;
    }
    flight.current = { fromPos: camera.position.clone(), fromTarget: c.target.clone(), toPos, toTarget, start: performance.now() };
    invalidate();
  }, [focus]); // a new request starts a flight; the Motion setting is read at that moment
  useFrame(() => {
    const f = flight.current;
    const c = controls.current;
    if (!f || !c) return;
    const t = Math.min(1, (performance.now() - f.start) / FOCUS_MS);
    const k = 1 - Math.pow(1 - t, 3);
    camera.position.lerpVectors(f.fromPos, f.toPos, k);
    c.target.lerpVectors(f.fromTarget, f.toTarget, k);
    c.update();
    if (t >= 1) flight.current = null; else invalidate();
  }, -2);
  return null;
}

/**
 * Keeps the floating tile beside its post: projects the top of the post to
 * the canvas each frame and moves the tile there, clamped inside the canvas
 * and above the help line. The tile itself lives in the ordinary DOM tree so
 * it keeps the brand scope and the example's context.
 */
function TileAnchor({ office, tile }: { office: Office; tile: RefObject<HTMLDivElement | null> }) {
  const { camera, size, invalidate } = useThree();
  const anchor = useRef<THREE.Group>(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => { invalidate(); }, [office, invalidate]);
  useFrame(() => {
    const el = tile.current;
    const a = anchor.current;
    if (!el || !a) return;
    a.getWorldPosition(v).project(camera);
    const px = ((v.x + 1) / 2) * size.width;
    const py = ((1 - v.y) / 2) * size.height;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const margin = 8;
    const helpLine = size.width > 767 ? 56 : 0;
    let x = px + 16;
    if (x + w > size.width - margin) x = px - 16 - w;
    x = Math.min(Math.max(margin, x), Math.max(margin, size.width - w - margin));
    const y = Math.min(Math.max(margin, py - 12 - h), Math.max(margin, size.height - h - helpLine - margin));
    el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    el.style.visibility = 'visible';
  });
  return <group ref={anchor} position={[office.point[0], office.point[1], -postHeight(office) - 4]} />;
}

function OfficeTile({ office, onClose, tileRef }: { office: Office; onClose: () => void; tileRef: RefObject<HTMLDivElement | null> }) {
  const { openRoles } = useContext(ExampleContext);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div ref={tileRef} className="dycom-x__relief-tile" role="dialog" aria-label={`${office.city}, ${office.state}`} style={{ visibility: 'hidden' }}>
      <div className="dycom-x__relief-tile-head">
        <strong>{office.city}, {office.state}</strong>
        <button ref={closeButton} type="button" onClick={onClose} aria-label="Close"><X size={18} aria-hidden="true" /></button>
      </div>
      <ul>
        {office.members.map((c) => (
          <li key={c.id}>
            <strong>{c.name}</strong>
            <small>{rolesCount(c)}</small>
            <div className="dycom-x__relief-tile-actions">
              <a href={c.website} target="_blank" rel="noopener noreferrer">Website<ArrowUpRight size={14} aria-label="opens in a new tab" /></a>
              <button type="button" onClick={() => openRoles({ companyId: c.id })}>View open roles</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const byCity = (a: Office, b: Office) => a.city.localeCompare(b.city);

export default function ReliefModel() {
  const paint = usePaint();
  const motionOff = useContext(MotionContext);
  const [webgl] = useState(hasWebGL);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<Office | null>(null);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const controls = useRef<Controls>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const selectId = 'dycom-x-relief-office';

  const choose = (key: string) => {
    const office = offices.find((o) => o.key === key);
    if (!office) { setSelected(null); return; }
    setSelected(office);
    setFocus((f) => ({ office, n: (f?.n ?? 0) + 1 }));
  };
  const close = () => setSelected(null);

  if (!webgl) {
    return (
      <ExplorationRoot id="relief-model" state="fallback">
        <div className="dycom-x__pad">
          <Fallback title="The relief model needs WebGL">
            <p>This browser has no 3D graphics available, so here is the still atlas in its place. On a visitor’s device the model renders with three.js and behaves as described below.</p>
            <Atlas viewBox={WHOLE_COUNTRY} style={{ maxWidth: 720, marginTop: 24 }}>
              {offices.map((o) => <rect key={o.key} x={o.point[0] - 6} y={o.point[1] - 6} width="12" height="12" fill="var(--c5-civic)" />)}
            </Atlas>
          </Fallback>
        </div>
      </ExplorationRoot>
    );
  }

  return (
    <ExplorationRoot id="relief-model" state={ready ? 'ready' : 'loading'}>
      <div className="dycom-x__relief">
        <div className="dycom-x__relief-bar">
          <label className="dycom-c5__select-label dycom-x__relief-find" htmlFor={selectId}>
            Find an office
            <select id={selectId} value={selected?.key ?? ''} onChange={(e) => choose(e.target.value)}>
              <option value="">Choose a home office…</option>
              {REGIONS.map((r) => (
                <optgroup key={r.id} label={r.name}>
                  {[...r.offices].sort(byCity).map((o) => <option key={o.key} value={o.key}>{o.city}, {o.state}{o.members.length > 1 ? ` · ${o.members.length} companies` : ''}</option>)}
                </optgroup>
              ))}
            </select>
            <ChevronDown className="dycom-c5__chevron" aria-hidden="true" />
          </label>
          <p className="dycom-x__relief-count"><strong>{offices.length} home offices</strong><span>taller posts share an address</span></p>
        </div>
        <div className="dycom-x__relief-scene">
          <div className="dycom-x__relief-canvas">
            <Canvas
              // Render only when something changes (a drag, a hover): the model is still between interactions, and software GL stays responsive.
              frameloop="demand"
              camera={{ position: [0, 900, 900], fov: FOV, near: 1, far: 8000 }}
              dpr={1}
              gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
              onCreated={({ gl, scene }) => { gl.setClearColor(paint.paper); scene.background = new THREE.Color(paint.paper); setReady(true); }}
              onPointerMissed={() => { setHover(null); setSelected(null); }}
            >
              <hemisphereLight args={[paint.white, paint.soft, 1.1]} />
              <directionalLight position={[-400, 700, 500]} intensity={1.4} />
              <Suspense fallback={null}>
                {/* The atlas is drawn with y down; rotating it 90° about X lays it flat with south toward the viewer. */}
                <group rotation={[Math.PI / 2, 0, 0]}>
                  <group position={[-VIEWBOX.width / 2, -VIEWBOX.height / 2, 0]}>
                    <Country paint={paint} />
                    {offices.map((o) => <Post key={o.key} office={o} hovered={hover === o.key} selected={selected?.key === o.key} onHover={setHover} onSelect={setSelected} paint={paint} />)}
                    {selected && <TileAnchor office={selected} tile={tileRef} />}
                  </group>
                </group>
              </Suspense>
              <OrbitControls ref={controls} target={HOME_TARGET} enablePan={false} enableDamping dampingFactor={0.12} minDistance={320} maxDistance={3200} minPolarAngle={0.25} maxPolarAngle={1.35} />
              <HomeView resetKey={resetKey} />
              <FocusOffice focus={focus} controls={controls} motionOff={motionOff} />
              <Cursor active={hover !== null} />
            </Canvas>
            {selected && <OfficeTile key={selected.key} office={selected} onClose={close} tileRef={tileRef} />}
          </div>
          <div className="dycom-x__relief-help">
            <p><strong>Drag</strong> to turn · <strong>Ctrl + scroll</strong> or pinch to zoom · tilt by dragging up and down</p>
            <button type="button" onClick={() => { controls.current?.target.copy(HOME_TARGET); setResetKey((k) => k + 1); }}>Reset view</button>
          </div>
        </div>
      </div>
    </ExplorationRoot>
  );
}
