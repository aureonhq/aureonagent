"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  Gauge,
  LayoutDashboard,
  ListFilter,
  Menu,
  Search,
  Sparkles,
  UserRound,
  UsersRound,
  X
} from "lucide-react";
import { loadCloudData, saveCloudMatches, saveCloudTalent, saveCloudTask, updateCloudMatchStatus } from "@/lib/cloudStore";
import { createMatches, generateTaskBreakdown, normalizeSkills } from "@/lib/mockAi";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { AppData, EnterpriseTask, MatchResult, TalentProfile } from "@/lib/types";

type View = "home" | "auth" | "post" | "profile" | "market" | "matches" | "admin";

const seedData: AppData = {
  tasks: [
    {
      id: "task-website",
      title: "为 B2B SaaS 产品制作官网首屏和定价页",
      description: "需要根据现有产品说明，完成官网信息架构、首屏文案、定价页布局和可交互前端页面。",
      budget: 12000,
      deadline: "2026-07-18",
      skills: ["产品", "设计", "前端", "文案"],
      status: "published",
      createdAt: "2026-06-29T09:00:00.000Z",
      ai: generateTaskBreakdown("为 B2B SaaS 产品制作官网首屏和定价页", "需要根据现有产品说明，完成官网信息架构、首屏文案、定价页布局和可交互前端页面。", 12000, ["产品", "设计", "前端", "文案"])
    }
  ],
  talents: [
    {
      id: "talent-lin",
      name: "林舟",
      contact: "lin@example.com",
      skills: ["产品", "前端", "AI"],
      availability: "每周 20 小时",
      expectedIncome: 9000,
      experience: "做过 4 个 SaaS 官网和 2 个 AI 工具 MVP，熟悉需求拆解和 React 交付。",
      createdAt: "2026-06-28T12:00:00.000Z"
    },
    {
      id: "talent-chen",
      name: "陈若宁",
      contact: "chen@example.com",
      skills: ["设计", "文案", "运营"],
      availability: "每周 12 小时",
      expectedIncome: 7000,
      experience: "擅长创业项目品牌表达、落地页结构和转化文案。",
      createdAt: "2026-06-27T12:00:00.000Z"
    }
  ],
  matches: []
};

function hydrateSeed(): AppData {
  return { ...seedData, matches: createMatches(seedData.tasks[0], seedData.talents) };
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<AppData>(hydrateSeed());
  const [selectedTaskId, setSelectedTaskId] = useState(seedData.tasks[0].id);
  const [session, setSession] = useState<Session | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ai-workforce-data");
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) localStorage.setItem("ai-workforce-data", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: authData }) => setSession(authData.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    loadCloudData()
      .then((cloudData) => {
        if (cloudData && (cloudData.tasks.length || cloudData.talents.length || cloudData.matches.length)) {
          setData(cloudData);
          setSelectedTaskId(cloudData.tasks[0]?.id ?? selectedTaskId);
        }
      })
      .catch((error) => setNotice(`云端数据读取失败：${error.message}`));
  }, [session]);

  const selectedTask = data.tasks.find((task) => task.id === selectedTaskId) ?? data.tasks[0];
  const selectedMatches = data.matches.filter((match) => match.taskId === selectedTask?.id);

  function navigate(next: View) {
    setView(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function publishTask(task: EnterpriseTask) {
    const matches = createMatches(task, data.talents);
    setData((current) => ({
      ...current,
      tasks: [task, ...current.tasks],
      matches: [...matches, ...current.matches.filter((match) => match.taskId !== task.id)]
    }));
    if (session) {
      try {
        await saveCloudTask(task);
        await Promise.all(data.talents.map((talent) => saveCloudTalent(talent)));
        await saveCloudMatches(matches);
        setNotice("任务已发布到云端，并生成匹配结果。");
      } catch (error) {
        setNotice(`云端保存失败：${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    setSelectedTaskId(task.id);
    navigate("matches");
  }

  async function saveTalent(talent: TalentProfile) {
    const nextTalents = [talent, ...data.talents];
    const nextMatches = data.tasks.flatMap((task) => createMatches(task, nextTalents));
    setData({ ...data, talents: nextTalents, matches: nextMatches });
    if (session) {
      try {
        await Promise.all(data.tasks.map((task) => saveCloudTask(task)));
        await saveCloudTalent(talent);
        await saveCloudMatches(nextMatches);
        setNotice("个人资料已保存到云端，并重新生成匹配。");
      } catch (error) {
        setNotice(`云端保存失败：${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
    navigate("market");
  }

  async function setMatchStatus(matchId: string, status: MatchResult["status"]) {
    setData((current) => ({
      ...current,
      matches: current.matches.map((match) => match.id === matchId ? { ...match, status } : match)
    }));
    if (session) {
      try {
        await updateCloudMatchStatus(matchId, status);
      } catch (error) {
        setNotice(`云端状态更新失败：${error instanceof Error ? error.message : "未知错误"}`);
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-[#17212b]">
      <Header view={view} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} session={session} />
      {notice && <div className="mx-auto mt-4 max-w-7xl px-5"><div className="rounded-lg border border-[#b2ddff] bg-[#eff8ff] p-3 text-sm text-[#175cd3]">{notice}</div></div>}
      {view === "home" && <Landing navigate={navigate} />}
      {view === "auth" && <AuthPage session={session} setNotice={setNotice} />}
      {view === "post" && <TaskPost onSubmit={publishTask} />}
      {view === "profile" && <TalentProfileForm onSubmit={saveTalent} />}
      {view === "market" && <TaskMarket tasks={data.tasks} selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} navigate={navigate} />}
      {view === "matches" && selectedTask && <MatchPage task={selectedTask} talents={data.talents} matches={selectedMatches} onStatusChange={setMatchStatus} setNotice={setNotice} />}
      {view === "admin" && <Admin data={data} />}
    </main>
  );
}

function Header({ view, navigate, menuOpen, setMenuOpen, session }: { view: View; navigate: (view: View) => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void; session: Session | null }) {
  const links: [View, string][] = [["post", "企业发布"], ["profile", "个人资料"], ["market", "任务大厅"], ["matches", "AI 匹配"], ["admin", "管理后台"]];
  return (
    <header className="sticky top-0 z-40 border-b border-[#dde3ea] bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <button className="flex items-center gap-3" onClick={() => navigate("home")}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#155eef] text-white"><Sparkles size={18} /></span>
          <span className="text-left"><b className="block leading-4">AI Workforce</b><small className="text-[#667085]">AI 劳动力网络 MVP</small></span>
        </button>
        <nav className="hidden items-center gap-2 md:flex">
          {links.map(([target, label]) => <button key={target} onClick={() => navigate(target)} className={`nav ${view === target ? "navActive" : ""}`}>{label}</button>)}
          <button onClick={() => navigate("auth")} className={`nav ${view === "auth" ? "navActive" : ""}`}>{session ? "账号" : "注册/登录"}</button>
        </nav>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && <div className="grid border-t bg-white p-3 md:hidden">{links.map(([target, label]) => <button key={target} className="rounded-lg p-3 text-left" onClick={() => navigate(target)}>{label}</button>)}<button className="rounded-lg p-3 text-left" onClick={() => navigate("auth")}>{session ? "账号" : "注册/登录"}</button></div>}
    </header>
  );
}

function AuthPage({ session, setNotice }: { session: Session | null; setNotice: (value: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUp() {
    if (!supabase) return setNotice("还没有配置 Supabase 环境变量，当前只能本地演示。");
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    setNotice(error ? `注册失败：${error.message}` : "注册成功。如果 Supabase 开启邮箱确认，请先去邮箱点击确认链接。");
  }

  async function signIn() {
    if (!supabase) return setNotice("还没有配置 Supabase 环境变量，当前只能本地演示。");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setNotice(error ? `登录失败：${error.message}` : "登录成功，之后发布任务和保存资料会写入云端。");
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setNotice("已退出登录。");
  }

  return (
    <PageShell eyebrow="ACCOUNT" title="用户注册与登录">
      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <div className="panel p-6">
          {session ? (
            <div>
              <p className="text-sm text-[#667085]">当前登录账号</p>
              <h2 className="mt-2 text-xl font-semibold">{session.user.email}</h2>
              <button className="secondary mt-6" onClick={signOut}>退出登录</button>
            </div>
          ) : (
            <div className="grid gap-4">
              <Field label="邮箱" type="email" value={email} onChange={setEmail} placeholder="name@example.com" />
              <Field label="密码" type="password" value={password} onChange={setPassword} placeholder="至少 6 位" />
              <div className="flex flex-wrap gap-3">
                <button className="primary" disabled={loading || !email || password.length < 6} onClick={signUp}>注册</button>
                <button className="secondary" disabled={loading || !email || password.length < 6} onClick={signIn}>登录</button>
              </div>
            </div>
          )}
        </div>
        <div className="panel p-6">
          <h2 className="text-xl font-semibold">云端注册说明</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-[#475467]">
            <p className="rounded-lg bg-[#f8fafc] p-3">配置 Supabase 后，用户可以用邮箱和密码注册。</p>
            <p className="rounded-lg bg-[#f8fafc] p-3">登录用户发布的任务、个人资料和匹配结果会保存到在线数据库。</p>
            <p className="rounded-lg bg-[#f8fafc] p-3">未配置 Supabase 时，网站仍可展示，但数据只存在当前浏览器。</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Landing({ navigate }: { navigate: (view: View) => void }) {
  return (
    <>
      <section className="border-b border-[#e4e7ec] bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <span className="eyebrow">AI WORKFORCE NETWORK</span>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">企业按结果调用 AI 劳动力，个人用技能接入网络获得收入。</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#667085]">这不是招聘平台，也不是兼职平台。AI Workforce 把企业需求拆成可执行工作单元，组合 AI 流程与真人技能，形成可调度、可报价、可验收的劳动力网络。</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button className="primary" onClick={() => navigate("post")}><BriefcaseBusiness size={18} />发布企业任务</button>
              <button className="secondary" onClick={() => navigate("profile")}><UserRound size={18} />创建个人资料</button>
            </div>
          </div>
          <div className="panel p-6">
            <div className="flex items-center justify-between border-b pb-5">
              <div><span className="eyebrow">LIVE FLOW</span><h2 className="mt-2 text-xl font-semibold">需求到结果的 AI 劳动力调度</h2></div>
              <Gauge className="text-[#155eef]" />
            </div>
            <div className="mt-5 grid gap-3">
              {["企业提交结果目标和预算", "AI 拆解工作单元与交付物", "系统匹配技能、时间和收入预期", "企业选中执行者并联系", "后台追踪任务、人才和匹配记录"].map((item, index) => (
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
        <Feature icon={<Sparkles />} title="模拟 AI 拆解" body="根据标题、描述、预算和技能生成摘要、里程碑、交付物、风险和建议报价。" />
        <Feature icon={<UsersRound />} title="劳动力匹配" body="按技能重合、预算匹配度和可工作时间计算推荐分，并输出匹配理由。" />
        <Feature icon={<LayoutDashboard />} title="后台可见" body="管理后台集中查看企业任务、个人用户、匹配记录和联系状态。" />
      </section>
    </>
  );
}

function TaskPost({ onSubmit }: { onSubmit: (task: EnterpriseTask) => void }) {
  const [form, setForm] = useState({ title: "", description: "", budget: 10000, deadline: "2026-07-20", skills: "产品, 设计, 前端" });
  const skills = normalizeSkills(form.skills);
  const ai = useMemo(() => generateTaskBreakdown(form.title, form.description, form.budget, skills), [form.title, form.description, form.budget, form.skills]);

  function submit() {
    onSubmit({
      id: crypto.randomUUID(),
      title: form.title || "未命名任务",
      description: form.description,
      budget: form.budget,
      deadline: form.deadline,
      skills,
      status: "published",
      createdAt: new Date().toISOString(),
      ai
    });
  }

  return (
    <PageShell eyebrow="ENTERPRISE" title="企业端发布任务">
      <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
        <div className="panel p-6">
          <div className="grid gap-4">
            <Field label="任务标题" value={form.title} onChange={(title) => setForm({ ...form, title })} placeholder="例如：制作产品官网和投放落地页" />
            <TextArea label="任务描述" value={form.description} onChange={(description) => setForm({ ...form, description })} placeholder="描述目标、交付物、参考资料、验收标准..." />
            <NumberField label="预算（元）" value={form.budget} onChange={(budget) => setForm({ ...form, budget })} />
            <Field label="截止时间" type="date" value={form.deadline} onChange={(deadline) => setForm({ ...form, deadline })} />
            <Field label="所需技能" value={form.skills} onChange={(skills) => setForm({ ...form, skills })} placeholder="产品, 设计, 前端, AI" />
            <button className="primary justify-center" disabled={!form.title || !form.description} onClick={submit}><Sparkles size={18} />发布并生成匹配</button>
          </div>
        </div>
        <AiBreakdown ai={ai} skills={skills} />
      </div>
    </PageShell>
  );
}

function TalentProfileForm({ onSubmit }: { onSubmit: (talent: TalentProfile) => void }) {
  const [form, setForm] = useState({ name: "", contact: "", skills: "产品, 前端, AI", availability: "每周 20 小时", expectedIncome: 8000, experience: "" });
  function submit() {
    onSubmit({
      id: crypto.randomUUID(),
      name: form.name,
      contact: form.contact,
      skills: normalizeSkills(form.skills),
      availability: form.availability,
      expectedIncome: form.expectedIncome,
      experience: form.experience,
      createdAt: new Date().toISOString()
    });
  }

  return (
    <PageShell eyebrow="TALENT" title="个人端资料页面">
      <div className="panel max-w-3xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="姓名" value={form.name} onChange={(name) => setForm({ ...form, name })} />
          <Field label="联系方式（邮箱/微信/电话）" value={form.contact} onChange={(contact) => setForm({ ...form, contact })} />
          <Field label="技能标签" value={form.skills} onChange={(skills) => setForm({ ...form, skills })} />
          <Field label="可工作时间" value={form.availability} onChange={(availability) => setForm({ ...form, availability })} />
          <NumberField label="期望收入（元/任务）" value={form.expectedIncome} onChange={(expectedIncome) => setForm({ ...form, expectedIncome })} />
          <div className="md:col-span-2"><TextArea label="过往经验" value={form.experience} onChange={(experience) => setForm({ ...form, experience })} /></div>
          <button className="primary justify-center md:col-span-2" disabled={!form.name || !form.contact} onClick={submit}><CheckCircle2 size={18} />保存资料并参与匹配</button>
        </div>
      </div>
    </PageShell>
  );
}

function TaskMarket({ tasks, selectedTaskId, setSelectedTaskId, navigate }: { tasks: EnterpriseTask[]; selectedTaskId: string; setSelectedTaskId: (id: string) => void; navigate: (view: View) => void }) {
  const [skill, setSkill] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const filtered = tasks.filter((task) => (!skill || task.skills.includes(skill)) && (!budget || task.budget >= Number(budget)) && (!deadline || task.deadline <= deadline));
  const skills = Array.from(new Set(tasks.flatMap((task) => task.skills)));

  return (
    <PageShell eyebrow="MARKET" title="任务大厅">
      <div className="mb-5 grid gap-3 rounded-xl border border-[#d0d5dd] bg-white p-4 md:grid-cols-4">
        <Select label="按技能筛选" value={skill} onChange={setSkill} options={["", ...skills]} />
        <Field label="最低预算" type="number" value={budget} onChange={setBudget} />
        <Field label="截止时间早于" type="date" value={deadline} onChange={setDeadline} />
        <div className="flex items-end"><button className="secondary w-full justify-center" onClick={() => { setSkill(""); setBudget(""); setDeadline(""); }}><ListFilter size={18} />重置筛选</button></div>
      </div>
      <div className="grid gap-4">
        {filtered.map((task) => (
          <article className={`panel p-5 ${selectedTaskId === task.id ? "ring-2 ring-[#155eef]" : ""}`} key={task.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">{task.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">{task.skills.map((item) => <Badge key={item}>{item}</Badge>)}</div>
              </div>
              <div className="min-w-52 rounded-lg bg-[#f2f4f7] p-4 text-sm">
                <b className="block text-lg">¥{task.budget.toLocaleString()}</b>
                <span className="mt-1 flex items-center gap-1 text-[#667085]"><CalendarClock size={15} />{task.deadline}</span>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="secondary" onClick={() => setSelectedTaskId(task.id)}><Search size={18} />选中任务</button>
              <button className="primary" onClick={() => { setSelectedTaskId(task.id); navigate("matches"); }}>查看 AI 匹配<ArrowRight size={18} /></button>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

function MatchPage({ task, talents, matches, onStatusChange, setNotice }: { task: EnterpriseTask; talents: TalentProfile[]; matches: MatchResult[]; onStatusChange: (matchId: string, status: MatchResult["status"]) => void; setNotice: (value: string) => void }) {
  return (
    <PageShell eyebrow="AI MATCHING" title="AI 匹配结果页面">
      <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <AiBreakdown ai={task.ai} skills={task.skills} task={task} />
        <div className="grid gap-4">
          {matches.map((match) => {
            const talent = talents.find((item) => item.id === match.talentId);
            if (!talent) return null;
            const isUnlocked = match.status === "selected" || match.status === "contacted";
            return (
              <article className="panel p-5" key={match.id}>
                <div className="flex items-start justify-between gap-4">
                  <div><h2 className="text-xl font-semibold">{talent.name}</h2><p className="mt-1 text-sm text-[#667085]">{talent.availability} · 期望 ¥{talent.expectedIncome.toLocaleString()}</p></div>
                  <div className="grid gap-2 text-right">
                    <span className="rounded-lg bg-[#ecfdf3] px-3 py-2 text-sm font-semibold text-[#027a48]">匹配 {match.score}</span>
                    <span className="text-xs text-[#667085]">{match.status === "contacted" ? "已联系" : match.status === "selected" ? "已选中" : "推荐中"}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">{talent.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="primary" onClick={() => onStatusChange(match.id, "selected")}>选中执行者</button>
                  <button className="secondary" onClick={async () => {
                    await onStatusChange(match.id, "contacted");
                    if (talent.contact) {
                      await navigator.clipboard?.writeText(talent.contact);
                      setNotice(`已复制 ${talent.name} 的联系方式：${talent.contact}`);
                    } else {
                      setNotice(`${talent.name} 暂未填写联系方式。`);
                    }
                  }}>联系 TA</button>
                </div>
                {isUnlocked && (
                  <div className="mt-4 rounded-lg border border-[#b2ddff] bg-[#eff8ff] p-4 text-sm text-[#1849a9]">
                    <b className="block">联系方式</b>
                    <span>{talent.contact || "该执行者还没有填写联系方式"}</span>
                    <p className="mt-2 text-[#475467]">建议先发送任务摘要、预算、截止时间和验收标准，确认对方是否接受排期和报价。</p>
                  </div>
                )}
                <h3 className="mt-5 font-semibold">匹配理由</h3>
                <ul className="mt-2 grid gap-2 text-sm text-[#475467]">{match.reasons.map((reason) => <li className="rounded-lg bg-[#f2f4f7] p-3" key={reason}>{reason}</li>)}</ul>
                <h3 className="mt-5 font-semibold">推荐执行步骤</h3>
                <ol className="mt-2 grid gap-2 text-sm text-[#475467]">{match.executionSteps.map((step, index) => <li className="rounded-lg border border-[#e4e7ec] p-3" key={step}>{index + 1}. {step}</li>)}</ol>
              </article>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

function Admin({ data }: { data: AppData }) {
  return (
    <PageShell eyebrow="ADMIN" title="管理后台">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="企业任务" value={data.tasks.length} />
        <Stat label="个人用户" value={data.talents.length} />
        <Stat label="匹配记录" value={data.matches.length} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <AdminList title="企业任务" items={data.tasks.map((task) => `${task.title} · ¥${task.budget.toLocaleString()} · ${task.status}`)} />
        <AdminList title="个人用户" items={data.talents.map((talent) => `${talent.name} · ${talent.contact || "未填联系方式"} · ${talent.skills.join("、")} · ¥${talent.expectedIncome.toLocaleString()}`)} />
        <AdminList title="匹配记录" items={data.matches.map((match) => `${match.taskId.slice(0, 8)} → ${match.talentId.slice(0, 10)} · ${match.score} · ${match.status}`)} />
      </div>
    </PageShell>
  );
}

function AiBreakdown({ ai, skills, task }: { ai: EnterpriseTask["ai"]; skills: string[]; task?: EnterpriseTask }) {
  return (
    <aside className="panel p-6">
      <div className="flex items-center gap-2 text-[#155eef]"><Sparkles size={18} /><b>AI 自动拆解任务</b></div>
      {task && <h2 className="mt-3 text-xl font-semibold">{task.title}</h2>}
      <p className="mt-3 text-sm leading-6 text-[#667085]">{ai.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">{skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div>
      <Block title="里程碑" items={ai.milestones} />
      <Block title="交付物" items={ai.deliverables} />
      <Block title="风险提示" items={ai.risks} />
      <div className="mt-5 rounded-xl bg-[#eff4ff] p-4">
        <span className="text-sm text-[#475467]">AI 生成建议报价</span>
        <b className="mt-1 block text-2xl text-[#155eef]">¥{ai.suggestedQuote.min.toLocaleString()} - ¥{ai.suggestedQuote.max.toLocaleString()}</b>
        <p className="mt-2 text-xs text-[#667085]">{ai.suggestedQuote.basis}</p>
      </div>
    </aside>
  );
}

function PageShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <section className="mx-auto max-w-7xl px-5 py-10"><span className="eyebrow">{eyebrow}</span><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1><div className="mt-7">{children}</div></section>;
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return <article className="panel p-6"><span className="grid h-11 w-11 place-items-center rounded-lg bg-[#eff4ff] text-[#155eef]">{icon}</span><h2 className="mt-5 text-xl font-semibold">{title}</h2><p className="mt-3 leading-7 text-[#667085]">{body}</p></article>;
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return <label><span className="label">{label}</span><input className="input" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <label><span className="label">{label}</span><input className="input" type="number" min="0" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label><span className="label">{label}</span><textarea className="input min-h-32 resize-y" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label><span className="label">{label}</span><select className="input" value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option} value={option}>{option || "全部"}</option>)}</select></label>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-md bg-[#eef2f6] px-2.5 py-1 text-xs font-medium text-[#344054]">{children}</span>;
}

function Block({ title, items }: { title: string; items: string[] }) {
  return <div className="mt-5"><h3 className="font-semibold">{title}</h3><ul className="mt-2 grid gap-2 text-sm text-[#475467]">{items.map((item) => <li className="rounded-lg bg-[#f8fafc] p-3" key={item}>{item}</li>)}</ul></div>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="panel p-5"><span className="text-sm text-[#667085]">{label}</span><b className="mt-2 block text-3xl">{value}</b></div>;
}

function AdminList({ title, items }: { title: string; items: string[] }) {
  return <section className="panel p-5"><h2 className="font-semibold">{title}</h2><div className="mt-4 grid gap-2">{items.map((item) => <p className="rounded-lg bg-[#f8fafc] p-3 text-sm text-[#475467]" key={item}>{item}</p>)}</div></section>;
}
