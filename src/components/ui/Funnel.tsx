"use client";

import styles from "./Funnel.module.css";

const levels = [
  {
    title: "Top of funnel:",
    items: ["local events", "restaurants", "news"],
  },
  {
    title: "Middle:",
    items: ["listings", "market stats", "YouTube"],
  },
  {
    title: "Bottom:",
    items: ["reviews", "home value", "listings"],
  },
];

type Props = { dark?: boolean };

export default function Funnel({ dark = false }: Props) {
  const rootCls = [styles.wrapper, dark ? styles.wrapperDark : ""].join(" ");
  const labelCls = (extra?: string) =>
    [styles.label, dark ? styles.labelDark : "", extra || ""].filter(Boolean).join(" ");

  const arrowStroke = dark ? "#e9deff" : "#221a36";

  return (
    <section className={rootCls}>
      <div className={styles.content}>
        <div className={labelCls(styles.labelTop)}>
          <h3>{levels[0].title}</h3>
          <ul>
            {levels[0].items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={labelCls(styles.labelMiddle)}>
          <h3>{levels[1].title}</h3>
          <ul>
            {levels[1].items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={labelCls(styles.labelBottom)}>
          <h3>{levels[2].title}</h3>
          <ul>
            {levels[2].items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ARROWS */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1040 620"
          preserveAspectRatio="none"
          className={styles.arrows}
          fill="none"
        >
          <defs>
            <marker id="a-top" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill={arrowStroke} />
            </marker>
            <marker id="a-mid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill={arrowStroke} />
            </marker>
            <marker id="a-bot" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" fill={arrowStroke} />
            </marker>
          </defs>
          <path d="M 260 90 C 294 104, 322 116, 348 125" stroke={arrowStroke} strokeWidth="2.6" strokeLinecap="round" markerEnd="url(#a-top)" opacity="0.9" />
          <path d="M 780 318 C 728 316, 670 314, 616 310" stroke={arrowStroke} strokeWidth="2.6" strokeLinecap="round" markerEnd="url(#a-mid)" opacity="0.9" />
          <path d="M 260 548 C 336 532, 410 514, 486 494" stroke={arrowStroke} strokeWidth="2.6" strokeLinecap="round" markerEnd="url(#a-bot)" opacity="0.9" />
        </svg>

        {/* 3-LEVEL FUNNEL — pure clip-path CSS trapezoids with visible gaps */}
        <div className={styles.funnel}>
          <div className={styles.tierTop} />
          <div className={styles.tierMid} />
          <div className={styles.tierBot} />
        </div>
      </div>
    </section>
  );
}
