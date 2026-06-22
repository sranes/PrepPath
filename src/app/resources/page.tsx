"use client";

import Link from "next/link";

// Curated, officially-free study resources. We deliberately link out to the
// government/official sources rather than rebuilding them — they're free,
// trustworthy, and maintained. Keeps PrepPath itself free to run.

interface Resource {
  name: string;
  url: string;
  desc: string;
}

interface Group {
  title: string;
  icon: string;
  items: Resource[];
}

const GROUPS: Group[] = [
  {
    title: "Textbooks & concepts",
    icon: "📚",
    items: [
      {
        name: "NCERT e-Pathshala",
        url: "https://epathshala.nic.in/",
        desc: "Free official NCERT textbooks (Class 1–12) — the syllabus backbone.",
      },
      {
        name: "NCERT (official site)",
        url: "https://ncert.nic.in/textbook.php",
        desc: "Download any NCERT textbook chapter as PDF.",
      },
      {
        name: "DIKSHA",
        url: "https://diksha.gov.in/",
        desc: "Govt platform: lessons, practice and explainer videos, many languages.",
      },
    ],
  },
  {
    title: "Video lectures",
    icon: "🎥",
    items: [
      {
        name: "SWAYAM",
        url: "https://swayam.gov.in/",
        desc: "Free MOOCs from IIT professors and university faculty.",
      },
      {
        name: "NPTEL",
        url: "https://nptel.ac.in/",
        desc: "Engineering & science lectures from the IITs/IISc.",
      },
    ],
  },
  {
    title: "Mock tests & previous papers",
    icon: "📝",
    items: [
      {
        name: "NTA Abhyas",
        url: "https://www.nta.ac.in/Quiz",
        desc: "Official NTA practice: JEE/NEET mocks in the real exam interface.",
      },
      {
        name: "NTA — NEET",
        url: "https://neet.nta.nic.in/",
        desc: "Official NEET portal: information bulletins and question papers.",
      },
      {
        name: "NTA — JEE Main",
        url: "https://jeemain.nta.nic.in/",
        desc: "Official JEE Main portal: papers, answer keys, notifications.",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-brand">
          ← Home
        </Link>
        <h1 className="mt-1 text-2xl font-bold">🔗 Free Resources</h1>
        <p className="text-sm text-muted">
          Hand-picked <strong>official, free</strong> study resources. These open on the
          source site in a new tab.
        </p>
      </div>

      {GROUPS.map((g) => (
        <section key={g.title} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {g.icon} {g.title}
          </h2>
          <div className="space-y-2">
            {g.items.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-brand"
              >
                <div>
                  <div className="font-semibold">{r.name}</div>
                  <div className="mt-0.5 text-sm text-muted">{r.desc}</div>
                </div>
                <span className="shrink-0 text-muted">↗</span>
              </a>
            ))}
          </div>
        </section>
      ))}

      <p className="text-xs text-muted">
        PrepPath is not affiliated with NCERT, NTA, or the Ministry of Education. Links are
        provided for convenience to genuinely free public resources.
      </p>
    </div>
  );
}
