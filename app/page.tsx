"use client";

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  ClipboardList,
  Code2,
  Compass,
  CreditCard,
  Download,
  FileText,
  Globe2,
  LayoutDashboard,
  LucideIcon,
  Moon,
  Rocket,
  Search,
  Sparkles,
  Sun,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import { buildFounderPlan, FounderProfile, StartupIdea } from "@/lib/founder-engine";

const defaultProfile: FounderProfile = {
  city: "深圳",
  budget: 50000,
  skill: "销售",
  experience: "跨境电商",
  team: "1人",
  time: "全职"
};

const agents: { name: string; desc: string; icon: LucideIcon }[] = [
  { name: "Advisor", desc: "商业模式", icon: BriefcaseBusiness },
  { name: "Research", desc: "市场与竞争", icon: Search },
  { name: "Growth", desc: "获客打法", icon: Globe2 },
  { name: "Product", desc: "MVP 规划", icon: LayoutDashboard },
  { name: "Finance", desc: "预算现金流", icon: CreditCard },
  { name: "Fundraise", desc: "BP 与融资", icon: FileText }
];

const tabs = [
  { id: "canvas", label: "商业模式", icon: Compass },
  { id: "mvp", label: "MVP", icon: Rocket },
  { id: "site", label: "网站", icon: Code2 },
  { id: "growth", label: "获客", icon: Globe2 },
  { id: "deck", label: "BP", icon: Download },
  { id: "market", label: "服务市场", icon: Users }
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Home() {
  const [profile, setProfile] = useState<FounderProfile>(defaultProfile);
  const [selectedId, setSelectedId] = useState("cross-border-growth");
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("canvas");
  const [generated, setGenerated] = useState(true);

  const plan = useMemo(() => buildFounderPlan(profile), [profile]);
  const selectedIdea = plan.ideas.find((idea) => idea.id === selectedId) ?? plan.ideas[0];
  const canvas = plan.canvas[selectedIdea.id];

  function updateProfile(key: keyof FounderProfile, value: string) {
    setProfile((current) => ({
      ...current,
      [key]: key === "budget" ? Number(value) : value
    }));
  }

  function generatePlan() {
    setGenerated(false);
    window.setTimeout(() => setGenerated(true), 420);
  }

  return (
    <main className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-[#f6f4ef] text-[#141414] antialiased transition-colors dark:bg-[#0f0f0f] dark:text-[#f3f0e8]">
        <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f6f4ef]/88 backdrop-blur-xl dark:border-white/10 dark:bg-[#0f0f0f]/86">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 bg-[#171717] text-white shadow-sm dark:border-white/10 dark:bg-white dark:text-black">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Aureon Agent</div>
                <div className="text-xs text-black/50 dark:text-white/45">AI Startup OS</div>
              </div>
            </div>

            <div className="hidden items-center rounded-lg border border-black/10 bg-white/70 p-1 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.06] lg:flex">
              {["方向", "模式", "MVP", "网站", "获客", "市场"].map((item, index) => (
                <span
                  key={item}
                  className={`rounded-md px-3 py-1.5 ${
                    index === 0 ? "bg-[#171717] text-white dark:bg-white dark:text-black" : "text-black/55 dark:text-white/50"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                aria-label="切换深色模式"
                className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 bg-white/80 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
                onClick={() => setDark((value) => !value)}
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="hidden h-9 items-center gap-2 rounded-lg bg-[#171717] px-3 text-sm font-medium text-white shadow-sm dark:bg-white dark:text-black sm:flex">
                <Rocket className="h-4 w-4" />
                Launch MVP
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-[73px] lg:h-[calc(100vh-88px)] lg:overflow-auto">
            <section className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.055]">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase text-[#0f766e]">Founder Profile</p>
                  <h1 className="mt-1 text-2xl font-semibold leading-tight">从想法到首单</h1>
                </div>
                <span className="rounded-md border border-black/10 px-2 py-1 text-xs text-black/55 dark:border-white/10 dark:text-white/50">
                  Free
                </span>
              </div>

              <div className="grid gap-3">
                <Field label="城市" value={profile.city} onChange={(value) => updateProfile("city", value)} />
                <Field label="预算" type="number" value={String(profile.budget)} onChange={(value) => updateProfile("budget", value)} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="技能" value={profile.skill} onChange={(value) => updateProfile("skill", value)} />
                  <Field label="团队" value={profile.team} onChange={(value) => updateProfile("team", value)} />
                </div>
                <Field label="行业经验" value={profile.experience} onChange={(value) => updateProfile("experience", value)} />
                <Field label="投入时间" value={profile.time} onChange={(value) => updateProfile("time", value)} />
              </div>

              <button
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#171717] text-sm font-medium text-white shadow-sm transition hover:-translate-y-0.5 dark:bg-white dark:text-black"
                onClick={generatePlan}
              >
                <Sparkles className="h-4 w-4" />
                重新生成创业方案
              </button>
            </section>

            <section className="rounded-xl border border-black/10 bg-[#171717] p-4 text-white shadow-sm dark:border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-white/45">AI Routing</p>
                  <h2 className="mt-1 font-semibold">多 Agent 协作</h2>
                </div>
                <span className="rounded-md bg-[#0f766e] px-2 py-1 text-xs">{generated ? "Ready" : "Running"}</span>
              </div>
              <div className="mt-4 grid gap-2">
                {agents.map(({ name, desc, icon: Icon }) => (
                  <div key={name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[#7dd3c7]" />
                      <span className="text-sm">{name}</span>
                    </div>
                    <span className="text-xs text-white/45">{desc}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>

          <section className="min-w-0 space-y-4">
            <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.055]">
              <div className="grid gap-5 border-b border-black/10 p-5 dark:border-white/10 xl:grid-cols-[1fr_360px]">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#0f766e]/10 px-2.5 py-1 text-sm font-medium text-[#0f766e]">
                      <BadgeCheck className="h-4 w-4" />
                      AI Native Startup Workspace
                    </span>
                    <span className="rounded-md border border-black/10 px-2.5 py-1 text-sm text-black/50 dark:border-white/10 dark:text-white/45">
                      不是论坛，不是课程，不是资讯站
                    </span>
                  </div>
                  <h2 className="max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl">
                    输入资源约束，输出创业方案、网站、BP、获客计划和服务商资源。
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm leading-6 text-black/58 dark:text-white/52">
                    当前方案以最快获得第一笔收入为目标，优先推荐低启动成本、可人工交付、后续能产品化的项目。
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 xl:grid-cols-1">
                  <Metric label="启动预算" value={`¥${profile.budget.toLocaleString("zh-CN")}`} />
                  <Metric label="首单目标" value="30 天" />
                  <Metric label="商业模式" value="服务 + SaaS" />
                </div>
              </div>

              <div className="grid gap-3 p-4 xl:grid-cols-3">
                {plan.ideas.map((idea, index) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    index={index}
                    selected={selectedIdea.id === idea.id}
                    onClick={() => setSelectedId(idea.id)}
                  />
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.055]">
              <div className="flex flex-col gap-3 border-b border-black/10 p-3 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
                <div className="px-2">
                  <p className="text-xs uppercase text-black/40 dark:text-white/35">Selected project</p>
                  <h2 className="mt-1 text-lg font-semibold">{selectedIdea.title}</h2>
                </div>
                <div className="flex overflow-auto rounded-lg border border-black/10 bg-[#f6f4ef] p-1 dark:border-white/10 dark:bg-black/20">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      className={`flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm transition ${
                        activeTab === id
                          ? "bg-white text-black shadow-sm dark:bg-white dark:text-black"
                          : "text-black/55 hover:text-black dark:text-white/45 dark:hover:text-white"
                      }`}
                      onClick={() => setActiveTab(id)}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {activeTab === "canvas" && (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <CanvasItem title="客户是谁" value={canvas.customers} />
                    <CanvasItem title="产品是什么" value={canvas.product} />
                    <CanvasItem title="如何收费" value={canvas.pricing} />
                    <CanvasItem title="如何获客" value={canvas.channels} />
                    <CanvasItem title="如何扩张" value={canvas.expansion} />
                    <CanvasItem title="关键伙伴" value={canvas.partners} />
                    <CanvasItem title="成本结构" value={canvas.costs} />
                    <CanvasItem title="关键指标" value={canvas.metrics} />
                  </div>
                )}

                {activeTab === "mvp" && (
                  <div className="grid gap-4 lg:grid-cols-[1fr_330px]">
                    <div className="grid gap-3 md:grid-cols-3">
                      <Timeline title="第一周" items={plan.mvp.week1} />
                      <Timeline title="第一个月" items={plan.mvp.month1} />
                      <Timeline title="第三个月" items={plan.mvp.month3} />
                    </div>
                    <div className="rounded-xl border border-black/10 bg-[#f6f4ef] p-4 dark:border-white/10 dark:bg-black/20">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <Rocket className="h-4 w-4 text-[#0f766e]" />
                        第一笔收入路径
                      </div>
                      <p className="mt-3 text-sm leading-6 text-black/62 dark:text-white/55">{selectedIdea.revenuePath}</p>
                    </div>
                  </div>
                )}

                {activeTab === "site" && (
                  <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="space-y-4">
                      <FeatureList title="网站结构" items={plan.website.structure} />
                      <FeatureList title="页面模块" items={plan.website.pages} />
                      <FeatureList title="功能需求" items={plan.website.features} />
                    </div>
                    <SitePreview />
                  </div>
                )}

                {activeTab === "growth" && (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(plan.acquisition).map(([channel, items]) => (
                      <ChannelCard key={channel} channel={channel} items={items} />
                    ))}
                  </div>
                )}

                {activeTab === "deck" && (
                  <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
                    <ol className="grid gap-2 md:grid-cols-2">
                      {plan.deck.map((item, index) => (
                        <li key={item} className="flex gap-3 rounded-lg border border-black/10 p-3 dark:border-white/10">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#171717] text-xs text-white dark:bg-white dark:text-black">
                            {index + 1}
                          </span>
                          <span className="text-sm leading-5 text-black/66 dark:text-white/58">{item}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="rounded-xl border border-black/10 bg-[#171717] p-4 text-white dark:border-white/10">
                      <FileText className="h-5 w-5 text-[#7dd3c7]" />
                      <h3 className="mt-3 font-semibold">投资人版本</h3>
                      <p className="mt-2 text-sm leading-6 text-white/55">
                        Pro 用户可导出 PPT、PDF、投资人版本和服务商执行简报。
                      </p>
                      <button className="mt-4 flex h-10 items-center gap-2 rounded-lg bg-white px-3 text-sm font-medium text-black">
                        <Download className="h-4 w-4" />
                        导出 BP
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "market" && (
                  <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
                    <div className="grid grid-cols-[1fr_120px_130px] bg-[#f6f4ef] px-4 py-3 text-xs font-medium uppercase text-black/45 dark:bg-black/20 dark:text-white/35">
                      <span>服务商</span>
                      <span>预算</span>
                      <span>动作</span>
                    </div>
                    {plan.brokers.map((broker) => (
                      <div
                        key={broker.provider}
                        className="grid grid-cols-[1fr_120px_130px] items-center gap-3 border-t border-black/10 px-4 py-4 dark:border-white/10"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-[#0f766e]/10 px-2 py-1 text-xs font-medium text-[#0f766e]">{broker.category}</span>
                            <h3 className="font-semibold">{broker.provider}</h3>
                          </div>
                          <p className="mt-2 text-sm leading-5 text-black/58 dark:text-white/50">{broker.reason}</p>
                        </div>
                        <span className="text-sm text-black/58 dark:text-white/50">{broker.price}</span>
                        <button className="flex h-9 items-center justify-center gap-2 rounded-lg border border-black/10 text-sm font-medium dark:border-white/10">
                          匹配
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-4 pb-6 lg:grid-cols-3">
              <SystemCard icon={ClipboardList} title="产品架构" desc="画像、推荐、画布、MVP、网站、获客、BP、服务市场组成闭环。" />
              <SystemCard icon={Building2} title="数据库" desc="Supabase 存储用户画像、项目、生成记录、服务商、订单与佣金。" />
              <SystemCard icon={BarChart3} title="商业模式" desc="免费方向推荐，Pro 订阅解锁工作流，Marketplace 收取佣金。" />
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  type = "text",
  onChange
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-black/50 dark:text-white/45">{label}</span>
      <input
        className="h-10 w-full rounded-lg border border-black/10 bg-[#f6f4ef] px-3 text-sm outline-none transition focus:border-[#0f766e] focus:bg-white focus:ring-4 focus:ring-[#0f766e]/10 dark:border-white/10 dark:bg-black/20 dark:focus:bg-black/30"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-[#f6f4ef] p-3 dark:border-white/10 dark:bg-black/20">
      <div className="text-xs text-black/45 dark:text-white/35">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

function IdeaCard({
  idea,
  index,
  selected,
  onClick
}: {
  idea: StartupIdea;
  index: number;
  selected: boolean;
  onClick: () => void;
}) {
  const score = [94, 88, 82][index] ?? 80;

  return (
    <button
      className={`group rounded-xl border p-4 text-left transition ${
        selected
          ? "border-[#0f766e] bg-[#f4fbf8] shadow-sm dark:bg-[#0f766e]/10"
          : "border-black/10 bg-[#fbfaf7] hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/[0.035] dark:hover:bg-white/[0.065]"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#171717] text-sm font-semibold text-white dark:bg-white dark:text-black">
          {index + 1}
        </span>
        <span className="rounded-md border border-black/10 px-2 py-1 text-xs text-black/55 dark:border-white/10 dark:text-white/45">
          Fit {score}
        </span>
      </div>
      <h3 className="mt-4 min-h-12 text-base font-semibold leading-6">{idea.title}</h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/60 dark:text-white/52">{idea.fit}</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div className="h-full rounded-full bg-[#0f766e]" style={{ width: `${score}%` }} />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-black/45 dark:text-white/35">
        <span>现金流优先</span>
        {selected ? <Check className="h-4 w-4 text-[#0f766e]" /> : <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />}
      </div>
    </button>
  );
}

function CanvasItem({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-xl border border-black/10 bg-[#fbfaf7] p-4 dark:border-white/10 dark:bg-white/[0.035]">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/52">{value}</p>
    </article>
  );
}

function Timeline({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-xl border border-black/10 bg-[#fbfaf7] p-4 dark:border-white/10 dark:bg-white/[0.035]">
      <h3 className="text-sm font-semibold text-[#0f766e]">{title}</h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-5 text-black/62 dark:text-white/55">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function FeatureList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-lg border border-black/10 bg-[#fbfaf7] px-3 py-2 text-sm text-black/60 dark:border-white/10 dark:bg-white/[0.035] dark:text-white/52"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ChannelCard({ channel, items }: { channel: string; items: string[] }) {
  return (
    <article className="rounded-xl border border-black/10 bg-[#fbfaf7] p-4 dark:border-white/10 dark:bg-white/[0.035]">
      <h3 className="font-semibold">{channel}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-5 text-black/60 dark:text-white/52">
            <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function SitePreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-[#171717] p-3 shadow-sm dark:border-white/10">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d95f59]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d6a747]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#45a36d]" />
      </div>
      <div className="rounded-lg bg-[#f6f4ef] p-4 text-[#171717]">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <div className="font-semibold">Founder Workspace</div>
          <button className="rounded-md bg-[#171717] px-3 py-1.5 text-xs text-white">Generate</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[0.7fr_1.3fr]">
          <div className="space-y-2">
            {["Profile", "Ideas", "Canvas", "Revenue"].map((item) => (
              <div key={item} className="rounded-md border border-black/10 bg-white px-3 py-2 text-xs">
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-black/10 bg-white p-3">
            <div className="h-3 w-1/2 rounded bg-black/15" />
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="h-20 rounded-md bg-[#0f766e]/15" />
              <div className="h-20 rounded-md bg-[#c47b2a]/15" />
              <div className="h-20 rounded-md bg-black/10" />
            </div>
            <div className="mt-3 h-24 rounded-md border border-black/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemCard({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <article className="rounded-xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.055]">
      <Icon className="h-5 w-5 text-[#0f766e]" />
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-black/58 dark:text-white/50">{desc}</p>
    </article>
  );
}
