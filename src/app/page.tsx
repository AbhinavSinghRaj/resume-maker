"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { templates } from "@/lib/templates";
import { sampleResume } from "@/lib/sampleResume";
import { ResumeThumb } from "@/components/preview/ResumePreview";
import Icon from "@/components/Icon";
import "./landing.css";

/* ---------- motion hooks ---------- */

function useInView<T extends HTMLElement = HTMLDivElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function Reveal({ children, className = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "section" }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`lp-reveal ${inView ? "in" : ""} ${className}`}>
      {children}
    </Tag>
  );
}

function useCountUp(target: number, start: boolean, ms = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setN(Math.round(target * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, ms]);
  return n;
}

function ScoreRing({ size = 52, start = true, delay = 0 }: { size?: number; start?: boolean; delay?: number }) {
  const [go, setGo] = useState(false);
  useEffect(() => {
    if (!start) return;
    const id = setTimeout(() => setGo(true), delay);
    return () => clearTimeout(id);
  }, [start, delay]);
  const n = useCountUp(92, go);
  return (
    <div className="lp-ring" style={{ "--size": `${size}px`, "--score": n } as React.CSSProperties}>
      <b>{n}</b>
    </div>
  );
}

/* Hero window: tilts back in 3D, flattens as you scroll, follows the cursor. */
function useHeroWindow() {
  const stageRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const stage = stageRef.current;
    const win = winRef.current;
    if (!stage || !win) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      win.style.setProperty("--sx", "0");
      return;
    }
    const target = { rx: 0, ry: 0, px: 0, py: 0 };
    const cur = { rx: 0, ry: 0, px: 0, py: 0, sx: 1 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      target.ry = x * 8;
      target.rx = -y * 6;
      target.px = x * -24;
      target.py = y * -18;
    };
    const onLeave = () => Object.assign(target, { rx: 0, ry: 0, px: 0, py: 0 });

    const loop = () => {
      const r = stage.getBoundingClientRect();
      const sx = Math.max(0, Math.min(1, r.top / (window.innerHeight * 0.75)));
      const k = 0.08;
      cur.rx += (target.rx - cur.rx) * k;
      cur.ry += (target.ry - cur.ry) * k;
      cur.px += (target.px - cur.px) * k;
      cur.py += (target.py - cur.py) * k;
      cur.sx += (sx - cur.sx) * 0.12;
      win.style.setProperty("--rx", `${cur.rx.toFixed(2)}deg`);
      win.style.setProperty("--ry", `${cur.ry.toFixed(2)}deg`);
      win.style.setProperty("--sx", cur.sx.toFixed(3));
      win.style.setProperty("--px", cur.px.toFixed(1));
      win.style.setProperty("--py", cur.py.toFixed(1));
      raf = requestAnimationFrame(loop);
    };
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return { stageRef, winRef };
}

function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return ref;
}

/* Cursor spotlight for every .lp-card inside the grid. */
function spotlight(e: React.PointerEvent<HTMLDivElement>) {
  for (const card of e.currentTarget.querySelectorAll<HTMLElement>(".lp-card")) {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  }
}

const rewrites = [
  { before: "Worked on the checkout page", after: "Rebuilt checkout in React + TypeScript, cutting drop-off and page load time" },
  { before: "Helped with backend APIs", after: "Designed REST APIs in Node.js serving the mobile and web apps" },
  { before: "Did testing for the app", after: "Introduced Jest + Playwright suites and wired them into CI/CD" },
];

function TypingRewrite() {
  const [idx, setIdx] = useState(0);
  const [len, setLen] = useState(0);
  const full = rewrites[idx].after;
  useEffect(() => {
    if (len < full.length) {
      const id = setTimeout(() => setLen((l) => l + 1), 28);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setIdx((i) => (i + 1) % rewrites.length);
      setLen(0);
    }, 2600);
    return () => clearTimeout(id);
  }, [len, full]);
  return (
    <div className="lp-rewrite">
      <div className="before">{rewrites[idx].before}</div>
      <div className="after">
        {full.slice(0, len)}
        <span className="lp-caret" />
      </div>
    </div>
  );
}

function Words({ text, start = 0, className = "" }: { text: string; start?: number; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, i, arr) => (
        <span key={i} className={`w ${className}`} style={{ "--i": start + i, "--j": i, "--n": arr.length } as React.CSSProperties}>
          {w}&nbsp;
        </span>
      ))}
    </>
  );
}

const marqueeItems = [
  "ATS-safe layouts", "Rule-based scoring", "JD keyword match", "AI bullet rewrites",
  "One-click cover letters", "PDF & DOCX import", "20 templates", "Text-selectable PDF",
];

const beforeAfter = [
  ["Worked on the checkout page.", "Rebuilt checkout in React and TypeScript, cutting page load time by 40% and drop-off by 12%"],
  ["Responsible for testing.", "Introduced Jest and Playwright suites wired into CI, reducing production bugs by 30%"],
  ["Helped junior developers.", "Mentored 4 junior engineers through code reviews and weekly pairing sessions"],
];

/* Drag the handle to compare a weak resume with the rewritten one. */
function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const sheet = (after: boolean) => (
    <div className={`lp-ba-sheet ${after ? "after" : "before"}`}>
      <div className="name">Priya Nair</div>
      <div className="role">{after ? "Senior Frontend Engineer · React, TypeScript, CI/CD" : "Software Engineer"}</div>
      <div className="sec">Experience</div>
      <ul>{beforeAfter.map(([b, a]) => <li key={b}>{after ? a : b}</li>)}</ul>
      <span className={`lp-ba-tag ${after ? "after" : ""}`}>{after ? "After · ATS 92" : "Before · ATS 41"}</span>
    </div>
  );
  return (
    <div className="lp-ba">
      {sheet(true)}
      <div className="lp-ba-top" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{sheet(false)}</div>
      <div className="lp-ba-handle" style={{ left: `${pos}%` }}><span>⟷</span></div>
      <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} aria-label="Compare before and after" />
    </div>
  );
}

const faqs = [
  { q: "Will this guarantee my resume passes every ATS?", a: "No tool can promise that — different ATS software parses differently. This fixes what consistently causes parsing failures: tables, columns, missing headings, unselectable text." },
  { q: "Does the AI make up my experience?", a: "No. It only rewrites and reorders what you've actually written. If a detail isn't there, it's left out — never invented." },
  { q: "Can I import my existing resume?", a: "Yes — upload a PDF or DOCX in the builder and it's parsed into editable sections you can tweak." },
  { q: "Is it free?", a: "The builder is free to try, no credit card or account required." },
];

/* ---------- page ---------- */

export default function LandingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  const progressRef = useScrollProgress();
  const { stageRef, winRef } = useHeroWindow();
  const [bentoRef, bentoIn] = useInView(0.15);

  async function handleSignup() {
    setStatus("loading");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("ok");
      setMsg("Thanks! We'll email you when new features and templates land.");
      setEmail("");
      setName("");
    } catch (e) {
      setStatus("err");
      setMsg(e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <div className="lp">
      <div ref={progressRef} className="lp-progress" />
      <SiteNav variant="dark" />

      {/* ---------- Hero ---------- */}
      <header className="lp-hero">
        <div className="lp-aurora"><span className="a1" /><span className="a2" /><span className="a3" /></div>
        <div className="lp-grid" />

        <div className="lp-shell">
          <div className="lp-fade" style={{ "--d": "0s" } as React.CSSProperties}>
            <span className="lp-badge"><span className="tag">NEW</span> AI cover letters &amp; bullet rewrites</span>
          </div>

          <h1 className="lp-title">
            <Words text="Your resume," />
            <Words text="rewritten for" start={2} className="dim" />
            <br />
            <Words text="every job you want." start={4} className="grad" />
          </h1>

          <p className="lp-sub lp-fade" style={{ "--d": "0.7s" } as React.CSSProperties}>
            Paste a job description. Get an ATS-optimized resume built from your real experience — scored, keyword-matched and ready to send in minutes.
          </p>

          <div className="lp-ctas lp-fade" style={{ "--d": "0.85s" } as React.CSSProperties}>
            <Link href="/builder" className="lp-btn lp-btn-primary">Start building — free <span className="arrow">→</span></Link>
            <Link href="/templates" className="lp-btn lp-btn-ghost">Explore templates</Link>
          </div>
          <div className="lp-ticks lp-fade" style={{ "--d": "1s" } as React.CSSProperties}>
            <span>No credit card</span><span>No signup to try</span><span>ATS-safe PDF export</span>
          </div>

          {/* product window */}
          <div ref={stageRef} className="lp-stage lp-fade" style={{ "--d": "0.9s" } as React.CSSProperties}>
            <div ref={winRef} className="lp-window">
              <div className="lp-window-bar">
                <i /><i /><i />
                <span className="url">resumebuilder.app/builder</span>
              </div>
              <div className="lp-window-body">
                <div className="lp-editor">
                  <div className="lp-panel">
                    <div className="lp-panel-label">Job description</div>
                    <div className="lp-input" />
                    <div className="lp-input" style={{ width: "70%" }} />
                  </div>
                  <div className="lp-panel">
                    <div className="lp-panel-label">
                      Experience bullet <span className="lp-ai-tag">✦ AI REWRITE</span>
                    </div>
                    <TypingRewrite />
                  </div>
                  <div className="lp-panel">
                    <div className="lp-panel-label">Keyword match</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span className="lp-chip ok">✓ React</span>
                      <span className="lp-chip ok">✓ TypeScript</span>
                      <span className="lp-chip ok">✓ CI/CD</span>
                      <span className="lp-chip miss">+ AWS</span>
                    </div>
                  </div>
                </div>

                <div className="lp-sheet">
                  <div className="name">Priya Nair</div>
                  <div className="role">Senior Frontend Engineer · Bengaluru</div>
                  <div className="sec">Experience</div>
                  {[100, 92, 96, 70].map((w, i) => (
                    <div key={i} className={`ln ${i === 1 ? "hl" : ""}`} style={{ width: `${w}%`, "--i": i } as React.CSSProperties} />
                  ))}
                  <div className="sec">Projects</div>
                  {[100, 84].map((w, i) => (
                    <div key={i} className="ln" style={{ width: `${w}%`, "--i": i + 4 } as React.CSSProperties} />
                  ))}
                  <div className="sec">Education</div>
                  <div className="ln" style={{ width: "62%", "--i": 6 } as React.CSSProperties} />
                  <div className="sec">Skills</div>
                  <span className="sk">React</span><span className="sk">TypeScript</span><span className="sk">Next.js</span><span className="sk">GraphQL</span><span className="sk">Jest</span>
                </div>
              </div>

              <div className="lp-float f1">
                <ScoreRing delay={1400} />
                <div><small>ATS score</small>Ready to apply</div>
              </div>
              <div className="lp-float f2">
                <span className="lp-check">✓</span>
                <div><small>Exported</small>Priya_Nair_Resume.pdf</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Marquee ---------- */}
      <div className="lp-marquee">
        <div className="lp-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>

      {/* ---------- Features ---------- */}
      <section id="features" className="lp-section">
        <div className="lp-shell">
          <Reveal>
            <div className="lp-eyebrow">Features</div>
            <h2 className="lp-h2" style={{ "--i": 1 } as React.CSSProperties}>Everything a resume needs.<br /><span className="dim">Nothing an ATS rejects.</span></h2>
            <p className="lp-lead" style={{ "--i": 2 } as React.CSSProperties}>Contact fields, headings, quantified bullets, date order — checked before you download, not after a rejection email.</p>
          </Reveal>

          <div ref={bentoRef} onPointerMove={spotlight} className={`lp-bento lp-reveal ${bentoIn ? "in" : ""}`}>
            <div className="lp-card s4" style={{ "--i": 0 } as React.CSSProperties}>
              <div className="lp-scan" />
              <div className="lp-icon"><Icon name="target" size={20} /></div>
              <h3>JD-aware keyword match</h3>
              <p>Paste any job posting and instantly see which keywords your resume covers — and exactly which ones are missing.</p>
              <div className="lp-kw">
                {[["React", 1], ["TypeScript", 1], ["REST APIs", 1], ["Kubernetes", 0], ["Agile", 1], ["AWS Lambda", 0], ["GraphQL", 1]].map(([k, ok], i) => (
                  <span key={k as string} className={`lp-chip ${ok ? "ok" : "miss"}`} style={{ "--i": i } as React.CSSProperties}>
                    {ok ? "✓" : "+"} {k}
                  </span>
                ))}
              </div>
            </div>
            <div className="lp-card" style={{ "--i": 1 } as React.CSSProperties}>
              <div className="lp-icon"><Icon name="chart" size={20} /></div>
              <h3>A score you can trust</h3>
              <p>Deterministic rule engine — no AI guesswork in the number.</p>
              <div style={{ marginTop: "1.4rem" }}><ScoreRing size={84} start={bentoIn} delay={300} /></div>
            </div>
            <div className="lp-card s3" style={{ "--i": 2 } as React.CSSProperties}>
              <div className="lp-icon"><Icon name="sparkle" size={20} /></div>
              <h3>AI that doesn&apos;t lie</h3>
              <p>Rewrites and reorders what you actually wrote. Never invents numbers, titles or experience.</p>
              <div className="lp-panel" style={{ marginTop: "1.3rem" }}><TypingRewrite /></div>
            </div>
            <div className="lp-card s3" style={{ "--i": 3 } as React.CSSProperties}>
              <div className="lp-icon"><Icon name="file" size={20} /></div>
              <h3>Upload &amp; go</h3>
              <p>Drop your old PDF or DOCX — it&apos;s parsed into clean, editable sections.</p>
              <div className="lp-upload">
                <div className="file">PDF</div>
                <div style={{ flex: 1 }}>
                  resume_final_v3.pdf
                  <div className="lp-bar"><i /></div>
                </div>
              </div>
            </div>
            <div className="lp-card s3" style={{ "--i": 4 } as React.CSSProperties}>
              <div className="lp-icon"><Icon name="palette" size={20} /></div>
              <h3>{templates.length} templates</h3>
              <p>Different colors and layouts, the same ATS-safe structure underneath.</p>
              <div className="lp-swatches">
                {templates.map((t, i) => (
                  <i key={t.id} style={{ background: t.accent, "--i": i } as React.CSSProperties} />
                ))}
              </div>
            </div>
            <div className="lp-card s3" style={{ "--i": 5 } as React.CSSProperties}>
              <div className="lp-icon"><Icon name="mail" size={20} /></div>
              <h3>Cover letters in one click</h3>
              <p>A tailored cover letter from your resume and the job description — editable before you send.</p>
              <div className="lp-letter">
                <div className="ln" style={{ width: "40%" }} />
                <div className="ln" />
                <div className="ln" style={{ width: "92%" }} />
                <div className="ln" style={{ width: "96%" }} />
                <div className="ln" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Templates showcase ---------- */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-shell">
          <Reveal>
            <div className="lp-eyebrow">Templates</div>
            <h2 className="lp-h2" style={{ "--i": 1 } as React.CSSProperties}>Real templates. <span className="dim">Real resumes.</span></h2>
            <p className="lp-lead" style={{ "--i": 2 } as React.CSSProperties}>Every design below is the actual output, filled with a sample resume. Pick one, switch any time.</p>
          </Reveal>
        </div>
        <div className="lp-tpl-row">
          <div className="lp-tpl-track">
            {[...templates, ...templates].map((t, i) => (
              <Link key={i} href="/templates" className="lp-tpl" tabIndex={i < templates.length ? 0 : -1}>
                <ResumeThumb resume={sampleResume} cfg={t} height={300} />
                <span>{t.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Before / after ---------- */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-shell lp-ba-wrap">
          <Reveal>
            <div className="lp-eyebrow">Before &amp; after</div>
            <h2 className="lp-h2" style={{ "--i": 1 } as React.CSSProperties}>Same experience. <span className="dim">Better words.</span></h2>
            <p className="lp-lead" style={{ "--i": 2 } as React.CSSProperties}>Drag the slider. The AI turns vague duties into specific, keyword-rich achievements, using only facts you gave it.</p>
            <Link href="/builder" className="lp-btn lp-btn-primary" style={{ "--i": 3 } as React.CSSProperties}>Rewrite mine <span className="arrow">→</span></Link>
          </Reveal>
          <BeforeAfter />
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-shell">
          <Reveal>
            <div className="lp-eyebrow">How it works</div>
            <h2 className="lp-h2" style={{ "--i": 1 } as React.CSSProperties}>Three steps. <span className="dim">Five minutes.</span></h2>
            <p className="lp-lead" style={{ "--i": 2 } as React.CSSProperties}>Write once, tailor forever. Every new job description reshapes the same set of real facts.</p>
          </Reveal>
          <Reveal className="lp-steps">
            <div className="lp-steps-line"><i /></div>
            {[
              ["Write your master profile", "Every company, project and skill you've touched — in your own words. Or just upload your old resume."],
              ["Paste the job description", "We read it for required skills and the exact keywords ATS software is scanning for."],
              ["Score, polish, download", "Fix what the checks flag, pick a template, and export a clean, text-selectable PDF."],
            ].map(([h, p], i) => (
              <div key={h} className="lp-step" style={{ "--i": i + 1 } as React.CSSProperties}>
                <div className="num">0{i + 1}</div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section id="faq" className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-shell" style={{ maxWidth: 860 }}>
          <Reveal>
            <div className="lp-eyebrow">FAQ</div>
            <h2 className="lp-h2" style={{ "--i": 1, marginBottom: "2.5rem" } as React.CSSProperties}>Questions, answered.</h2>
            <div className="lp-faq" style={{ "--i": 2 } as React.CSSProperties}>
              {faqs.map((f, i) => (
                <details key={f.q} open={i === 0}>
                  <summary>{f.q}</summary>
                  <div className="ans"><p>{f.a}</p></div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section style={{ padding: "0 0 5rem" }}>
        <div className="lp-shell">
          <Reveal>
            <div className="lp-cta">
              <h2 className="lp-h2">Stop reformatting.<br /><span className="dim">Start getting callbacks.</span></h2>
              <p>Free to try — your first tailored resume takes about five minutes.</p>
              <Link href="/builder" className="lp-btn lp-btn-lime">Build my resume <span className="arrow">→</span></Link>

              <div className="lp-signup">
                <input type="text" placeholder="Your name" aria-label="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="you@email.com" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={handleSignup} disabled={status === "loading"} className="lp-btn lp-btn-ghost">
                  {status === "loading" ? "Saving…" : "Get updates"}
                </button>
              </div>
              {msg && <div className={`lp-msg ${status === "ok" ? "ok" : status === "err" ? "err" : ""}`}>{msg}</div>}
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-shell lp-footer-grid">
          <div>
            <span className="brand" style={{ fontSize: "0.95rem" }}>
              <span className="brand-mark" style={{ width: 24, height: 24, fontSize: "0.75rem" }}>R</span>ResumeBuilder
            </span>
            <p>Built for job seekers who&apos;d rather apply than reformat.</p>
          </div>
          <div>
            <h4>Product</h4>
            <Link href="/builder">Resume builder</Link>
            <Link href="/templates">Templates</Link>
            <a href="#features">Features</a>
          </div>
          <div>
            <h4>Help</h4>
            <a href="#faq">FAQ</a>
            <span><Icon name="lock" size={13} /> Saved in your browser, no account needed</span>
          </div>
        </div>
        <div className="lp-shell lp-footer-bottom">© {new Date().getFullYear()} ResumeBuilder</div>
      </footer>
    </div>
  );
}
