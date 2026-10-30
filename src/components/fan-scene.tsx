"use client";

import { useEffect, useRef, useState } from "react";

const BLADES = 9;
// Timeline in seconds since navigation: the name comes first (CSS), then the fan's outline catches
// a faint light, then a lamp behind its centre comes on like headlights in the dark.
const OUTLINE_START = 1.0;
const OUTLINE_END = 2.3;
const LAMP_START = 2.3;
const LAMP_END = 4.4;
const SPIN = 5.5; // rad/s at full speed

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

/**
 * A black metal 120 mm case fan, seen straight on. The canvas is transparent: the RGB "lamp" behind it
 * is an HTML layer, so its matte light shows through the gaps between the blades and around the frame.
 */
/**
 * True when the browser can draw WebGL on a real GPU. A software renderer (SwiftShader, llvmpipe,
 * which is also what page-speed tests run on) draws each frame on the CPU and blocks the page.
 */
function hasHardwareWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      c.getContext("webgl", { failIfMajorPerformanceCaveat: true })) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch {
    return false;
  }
}

/** Resolves once the page has loaded and the browser has a quiet moment (or after a short cap). */
function afterLoadIdle(cap: number) {
  return new Promise<void>((resolve) => {
    const idle = () =>
      "requestIdleCallback" in window ? window.requestIdleCallback(() => resolve(), { timeout: cap }) : setTimeout(resolve, 1);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

export function FanScene({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const lamp = useRef<HTMLDivElement>(null);
  // "3d" on devices with a GPU; "poster" (a still of the same lit fan) without one or with reduced motion
  const [mode, setMode] = useState<"pending" | "3d" | "poster">("pending");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- decided once, from the device
    setMode(!reducedMotion && hasHardwareWebGL() ? "3d" : "poster");
  }, []);

  useEffect(() => {
    if (mode !== "3d") return;
    const el = host.current;
    const glow = lamp.current;
    if (!el || !glow) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      // three.js is fetched and started after the page has loaded, so it never competes with it
      await afterLoadIdle(800);
      if (disposed) return;
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      // Phones and weak CPUs: fewer pixels and 30 frames a second. The fan is soft-lit and slow, so
      // neither is visible, but each halves the work on the main thread and the GPU.
      const light = window.matchMedia("(pointer: coarse)").matches || (navigator.hardwareConcurrency || 8) <= 4;
      const minFrame = light ? 1000 / 30 - 2 : 0;

      const renderer = new THREE.WebGLRenderer({ antialias: !light, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, light ? 1.5 : 2));
      renderer.setClearColor(0x000000, 0);
      // checking each shader for errors makes the page wait for the GPU to finish compiling it
      // (about 0.75 s on an integrated GPU); the shaders are fixed, so skip it outside development
      renderer.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);
      Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      // a 128 px environment is plenty for soft reflections on black metal, at a quarter of the cost
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.03, 0.1, 100, { size: 128 }).texture;
      scene.environment = envTex;

      // A narrow lens keeps the face flat, as in a product shot.
      const camera = new THREE.PerspectiveCamera(18, 1, 10, 6000);

      // ---------- materials: black anodised metal ----------
      const metal = (roughness: number) =>
        new THREE.MeshStandardMaterial({ color: 0x0c0d0e, metalness: 0.92, roughness, envMapIntensity: 0 });
      const frameMat = metal(0.34);
      const bladeMat = metal(0.26);
      const hubMat = metal(0.2);
      const strutMat = metal(0.45);
      const mats = [frameMat, bladeMat, hubMat, strutMat];

      const fan = new THREE.Group();

      // ---------- frame: rounded square plate with the bore and four screw holes ----------
      const S = 60, R = 8;
      const frameShape = new THREE.Shape();
      frameShape.moveTo(-S + R, -S);
      frameShape.lineTo(S - R, -S);
      frameShape.quadraticCurveTo(S, -S, S, -S + R);
      frameShape.lineTo(S, S - R);
      frameShape.quadraticCurveTo(S, S, S - R, S);
      frameShape.lineTo(-S + R, S);
      frameShape.quadraticCurveTo(-S, S, -S, S - R);
      frameShape.lineTo(-S, -S + R);
      frameShape.quadraticCurveTo(-S, -S, -S + R, -S);
      const bore = new THREE.Path();
      bore.absarc(0, 0, 57, 0, Math.PI * 2, true);
      frameShape.holes.push(bore);
      for (const [x, y] of [[52.5, 52.5], [-52.5, 52.5], [52.5, -52.5], [-52.5, -52.5]]) {
        const h = new THREE.Path();
        h.absarc(x, y, 2.4, 0, Math.PI * 2, true);
        frameShape.holes.push(h);
      }
      const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
        depth: 22,
        bevelEnabled: true,
        bevelThickness: 1.4,
        bevelSize: 1.4,
        bevelSegments: 6,
        curveSegments: 128,
      });
      frameGeo.translate(0, 0, -11);
      fan.add(new THREE.Mesh(frameGeo, frameMat));

      // a thin lit lip inside the bore that picks up the lamp's colour
      const lipMat = new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false });
      const lip = new THREE.Mesh(new THREE.TorusGeometry(57.2, 0.45, 12, 256), lipMat);
      lip.position.z = 11.6;
      fan.add(lip);

      // ---------- struts and motor at the back ----------
      for (let i = 0; i < 4; i++) {
        const strut = new THREE.Mesh(new THREE.BoxGeometry(40, 3.2, 3), strutMat);
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        strut.position.set(Math.cos(a) * 37, Math.sin(a) * 37, -9);
        strut.rotation.z = a;
        fan.add(strut);
      }
      const motor = new THREE.Mesh(new THREE.CylinderGeometry(19, 19, 5, 72), strutMat);
      motor.rotation.x = Math.PI / 2;
      motor.position.z = -9;
      fan.add(motor);

      // ---------- rotor ----------
      const rotor = new THREE.Group();
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(17, 17.6, 16, 96), hubMat);
      hub.rotation.x = Math.PI / 2;
      rotor.add(hub);
      // domed cap with a machined chamfer: the brightest highlight on the fan
      const CAP_R = 46, CAP_A = 0.36; // a shallow dome, not a ball
      const cap = new THREE.Mesh(new THREE.SphereGeometry(CAP_R, 96, 12, 0, Math.PI * 2, 0, CAP_A), metal(0.16));
      cap.rotation.x = Math.PI / 2;
      cap.position.z = 8 - CAP_R * Math.cos(CAP_A);
      rotor.add(cap);
      mats.push(cap.material as InstanceType<typeof THREE.MeshStandardMaterial>);

      // Each blade is a smooth curved sheet on a dense (radius × chord) grid: swept back towards the
      // tip, pitched and cambered, so the metal catches long continuous highlights. The gaps between
      // blades let the lamp show through.
      const rIn = 16.5, rOut = 55.6;
      const lead = (t: number) => -0.04 - t * 0.5;
      const chord = (t: number) => 0.36 + t * 0.2;
      const NR = 40, NC = 24;
      const pos: number[] = [];
      const idx: number[] = [];
      for (let i = 0; i <= NR; i++) {
        const t = i / NR;
        const r = rIn + (rOut - rIn) * t;
        for (let j = 0; j <= NC; j++) {
          const u = j / NC; // 0 = leading edge, 1 = trailing edge
          const a = lead(t) - chord(t) * u;
          const d = (0.5 - u) * chord(t); // angle from the chord's middle
          const z = d * (20 - t * 6) - d * d * 6;
          pos.push(Math.cos(a) * r, Math.sin(a) * r, z);
        }
      }
      for (let i = 0; i < NR; i++) {
        for (let j = 0; j < NC; j++) {
          const a = i * (NC + 1) + j, b = a + 1, c2 = a + NC + 1, d2 = c2 + 1;
          idx.push(a, c2, b, b, c2, d2);
        }
      }
      const bladeGeo = new THREE.BufferGeometry();
      bladeGeo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      bladeGeo.setIndex(idx);
      bladeGeo.computeVertexNormals();
      bladeMat.side = THREE.DoubleSide;
      for (let i = 0; i < BLADES; i++) {
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.rotation.z = (i / BLADES) * Math.PI * 2;
        rotor.add(blade);
      }
      fan.add(rotor);
      scene.add(fan);

      // ---------- light ----------
      // key light from the upper left draws the streaks on the metal; the lamp light sits behind the hub
      const key = new THREE.DirectionalLight(0xffffff, 0);
      key.position.set(-160, 220, 260);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xbfe9ff, 0);
      fill.position.set(220, -120, 160);
      scene.add(fill);
      const back = new THREE.PointLight(0xffffff, 0, 260, 2);
      back.position.set(0, 0, -30);
      scene.add(back);

      // ---------- sizing: the fan fills the stage height (the stage is 1.05 × the fan) ----------
      // setSize reallocates the drawing buffer on the GPU, so it runs only when the size really changes
      let sized = "";
      const resize = () => {
        const w = el.clientWidth, h = el.clientHeight;
        if (!w || !h || `${w}x${h}` === sized) return;
        sized = `${w}x${h}`;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        const fanPx = h / 1.05;
        const visibleH = (122 * h) / fanPx;
        camera.position.set(0, 0, visibleH / (2 * Math.tan((camera.fov * Math.PI) / 360)));
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // ---------- loop ----------
      let visible = true;
      let ready = false;
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) start();
      });
      io.observe(el);

      // If three.js arrives late, the whole sequence shifts so no step is skipped.
      const shift = Math.max(0, performance.now() / 1000 + 0.1 - OUTLINE_START);
      const c = new THREE.Color();
      let angle = 0;
      let last = performance.now();
      let raf = 0;

      let lastGlow = "";
      const frame = (now: number) => {
        raf = 0;
        if (minFrame && now - last < minFrame) {
          if (visible && !disposed && document.visibilityState === "visible") raf = requestAnimationFrame(frame);
          return;
        }
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const t = now / 1000 - shift;
        const o = smooth((t - OUTLINE_START) / (OUTLINE_END - OUTLINE_START));
        const l = smooth((t - LAMP_START) / (LAMP_END - LAMP_START));
        const spin = SPIN * smooth((t - LAMP_START) / 2.6);
        const hue = (t * 0.05) % 1;

        angle -= spin * dt;
        rotor.rotation.z = angle;

        const env = 0.1 * o + 0.85 * l;
        mats.forEach((m) => (m.envMapIntensity = env));
        key.intensity = 0.35 * o + 1.9 * l;
        fill.intensity = 0.1 * o + 0.5 * l;
        back.color.copy(c.setHSL(hue, 0.9, 0.6));
        back.intensity = 1400 * l;
        lipMat.color.copy(c.setHSL((hue + 0.5) % 1, 1, 0.5)).multiplyScalar(0.15 * o + 0.85 * l);

        // the lamp behind: a faint backlight during the outline, then it comes up to full;
        // written only while it changes, so the steady state costs no style work
        const g = `${(0.1 * o + 0.9 * l).toFixed(3)}|${(0.72 + 0.28 * l).toFixed(3)}`;
        if (g !== lastGlow) {
          lastGlow = g;
          const [op, sc] = g.split("|");
          glow.style.opacity = op;
          glow.style.setProperty("--lamp", sc);
        }

        renderer.render(scene, camera);
        if (visible && !disposed && document.visibilityState === "visible") {
          raf = requestAnimationFrame(frame);
        }
      };
      const start = () => {
        if (ready && !raf && !disposed) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      };
      const onVis = () => document.visibilityState === "visible" && start();
      document.addEventListener("visibilitychange", onVis);
      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        scene.traverse((obj) => {
          const m = obj as InstanceType<typeof THREE.Mesh>;
          if (m.isMesh) {
            m.geometry.dispose();
            (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
          }
        });
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };

      // compile the shaders off the main thread where the browser allows it, so the first frame
      // does not stall the page
      await renderer.compileAsync(scene, camera).catch(() => {});
      ready = true;
      if (!disposed) start();
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [mode]);

  if (mode === "poster") {
    return (
      <div className={className} aria-hidden="true">
        {/* the same lit fan rendered once, glow included; it comes in on the same timeline */}
        {/* eslint-disable-next-line @next/next/no-img-element -- a fixed-size still, already optimised */}
        <img src="/images/fan-poster.webp" alt="" width={960} height={960} decoding="async" className="fan-poster" />
      </div>
    );
  }

  return (
    <div className={className} aria-hidden="true">
      <div ref={lamp} className="fan-lamp">
        <div className="fan-lamp-rgb" />
        <div className="fan-lamp-core" />
      </div>
      <div ref={host} className="absolute inset-0" />
    </div>
  );
}
