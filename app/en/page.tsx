import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, LayoutDashboard, Network, Search, Sparkles, UserRound, UsersRound } from "lucide-react";

const tasks = [
  { company: "Aureon Labs", title: "Design a launch page for an AI tool", budget: "$2,500", skills: ["Product", "Design", "Frontend"] },
  { company: "Bright Retail", title: "Build a sales analytics dashboard", budget: "$2,100", skills: ["Data", "Backend", "BI"] },
  { company: "Atlas Ops", title: "Create an internal AI automation workflow", budget: "$3,200", skills: ["AI", "Ops", "Backend"] }
];

const talents = [
  { name: "Maya Chen", fit: "94", role: "Product designer + frontend builder", skills: ["Design", "Copy", "React"] },
  { name: "Alex Rivera", fit: "91", role: "Data analyst + automation specialist", skills: ["Data", "AI", "Dashboards"] }
];

export default function EnglishPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#17212b]">
      <header className="sticky top-0 z-40 border-b border-[#dde3ea] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link className="flex items-center gap-3" href="/en">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#155eef] text-white"><Sparkles size={18} /></span>
            <span className="text-left"><b className="block leading-4">AI Workforce</b><small className="text-[#667085]">Global MVP</small></span>
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            <a className="nav" href="#enterprise">Enterprise</a>
            <a className="nav" href="#talent">Talent</a>
            <a className="nav" href="#marketplace">Marketplace</a>
            <a className="nav" href="#matching">AI Matching</a>
            <Link className="nav" href="/">中文</Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#e4e7ec] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="eyebrow">AI WORKFORCE NETWORK</span>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              A network where companies buy outcomes and people turn skills into income.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#667085]">
              AI Workforce turns business goals into executable work units, matches them with qualified talent nodes, and coordinates delivery in one operating layer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="primary" href="#enterprise"><BriefcaseBusiness size={18} />Post a task</a>
              <a className="secondary" href="#talent"><UserRound size={18} />Create a profile</a>
            </div>
          </div>
          <div className="panel p-6">
            <span className="eyebrow">WORKFORCE OS</span>
            <h2 className="mt-2 text-xl font-semibold">How the AI workforce network works</h2>
            <div className="mt-5 grid gap-3">
              {["Define the target outcome", "AI understands and decomposes the work", "Match with delivery-ready talent nodes", "Coordinate milestone-based execution", "Build reusable trust and capability records"].map((item, index) => (
                <div className="flex items-center gap-3 rounded-lg bg-[#f2f4f7] p-4" key={item}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white text-sm font-semibold text-[#155eef]">{index + 1}</span>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 md:grid-cols-3">
        <Feature icon={<Sparkles />} title="AI task decomposition" body="Turn vague goals into milestones, deliverables, risks, and suggested scopes." />
        <Feature icon={<UsersRound />} title="Two-sided matching" body="Enterprises can invite talent, and individual users can apply for suitable tasks." />
        <Feature icon={<Network />} title="Workforce graph" body="Every task, skill, match, and delivery record strengthens the network over time." />
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-2" id="enterprise">
        <Panel eyebrow="ENTERPRISE" title="Post an outcome-based task">
          <div className="grid gap-3">
            <MockField label="Task title" value="Build an AI onboarding workflow" />
            <MockField label="Budget" value="$3,000" />
            <MockField label="Required skills" value="AI automation, Product, Backend" />
            <div className="rounded-lg bg-[#eff4ff] p-4">
              <b className="text-[#155eef]">AI suggestion</b>
              <p className="mt-2 text-sm leading-6 text-[#475467]">Split into discovery, workflow design, prototype implementation, handoff documentation, and acceptance review.</p>
            </div>
          </div>
        </Panel>
        <Panel eyebrow="TALENT" title="Create a skill-based income profile">
          <div className="grid gap-3" id="talent">
            <MockField label="Name" value="Jordan Lee" />
            <MockField label="Skills" value="AI workflows, frontend, analytics" />
            <MockField label="Availability" value="20 hours per week" />
            <MockField label="Target income" value="$1,800 per project" />
          </div>
        </Panel>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10" id="marketplace">
        <Panel eyebrow="MARKETPLACE" title="Task marketplace">
          <div className="mb-5 grid gap-3 md:grid-cols-3">
            <MockField label="Skill filter" value="AI" />
            <MockField label="Minimum budget" value="$1,000" />
            <MockField label="Deadline" value="Next 30 days" />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {tasks.map((task) => (
              <article className="rounded-lg border border-[#e4e7ec] bg-[#f8fafc] p-4" key={task.title}>
                <p className="text-sm font-semibold text-[#155eef]">{task.company}</p>
                <h3 className="mt-2 font-semibold">{task.title}</h3>
                <p className="mt-3 text-sm text-[#667085]">{task.budget}</p>
                <div className="mt-4 flex flex-wrap gap-2">{task.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.8fr_1.2fr]" id="matching">
        <Panel eyebrow="AI MATCHING" title="Recommended execution plan">
          <div className="grid gap-3 text-sm text-[#475467]">
            {["Confirm scope and acceptance criteria", "Assign the strongest talent node", "Review milestone output", "Close delivery and update capability record"].map((item) => (
              <div className="flex items-center gap-3 rounded-lg bg-[#f2f4f7] p-3" key={item}><CheckCircle2 className="text-[#155eef]" size={18} />{item}</div>
            ))}
          </div>
        </Panel>
        <Panel eyebrow="MATCH RESULTS" title="Best-fit talent">
          <div className="grid gap-4">
            {talents.map((talent) => (
              <article className="rounded-lg border border-[#e4e7ec] bg-[#f8fafc] p-4" key={talent.name}>
                <div className="flex items-start justify-between gap-4">
                  <div><h3 className="font-semibold">{talent.name}</h3><p className="mt-1 text-sm text-[#667085]">{talent.role}</p></div>
                  <span className="rounded-lg bg-[#ecfdf3] px-3 py-2 text-sm font-semibold text-[#027a48]">Fit {talent.fit}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">{talent.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 md:grid-cols-4">
        <Stat label="Enterprise tasks" value="128" />
        <Stat label="Talent profiles" value="842" />
        <Stat label="AI matches" value="2.4k" />
        <Stat label="Delivery records" value="617" />
      </section>

      <footer className="border-t border-[#e4e7ec] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#667085]">AI Workforce Network MVP</p>
          <Link className="secondary" href="/">Open Chinese MVP <ArrowRight size={18} /></Link>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return <article className="panel p-6"><span className="grid h-11 w-11 place-items-center rounded-lg bg-[#eff4ff] text-[#155eef]">{icon}</span><h2 className="mt-5 text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-[#667085]">{body}</p></article>;
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="panel p-6"><span className="eyebrow">{eyebrow}</span><h2 className="mt-2 text-2xl font-semibold">{title}</h2><div className="mt-5">{children}</div></section>;
}

function MockField({ label, value }: { label: string; value: string }) {
  return <label><span className="label">{label}</span><div className="input bg-[#f8fafc]">{value}</div></label>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-[#eef2f6] px-2.5 py-1 text-xs font-medium text-[#344054]">{children}</span>;
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="panel p-5"><span className="text-sm text-[#667085]">{label}</span><b className="mt-2 block text-3xl">{value}</b></div>;
}
