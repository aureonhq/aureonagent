"use client";

import { useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ArrowRight, BriefcaseBusiness, CalendarClock, CheckCircle2, LayoutDashboard, ListFilter, Menu, Search, Sparkles, UserRound, UsersRound, X } from "lucide-react";
import { AdminEntityKind, deleteCloudEntity, isCurrentUserAdmin, loadCloudData, saveCloudApplication, saveCloudMatches, saveCloudOrder, saveCloudTalent, saveCloudTask, updateCloudMatchStatus, updateCloudOrderStatus } from "@/lib/cloudStore";
import { createMatches, generateTaskBreakdown, normalizeSkills } from "@/lib/mockAi";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { AppData, EnterpriseTask, MatchResult, PlatformOrder, TalentProfile, TaskApplication } from "@/lib/types";

type View = "home" | "auth" | "post" | "profile" | "market" | "matches" | "admin";

const seedTask: EnterpriseTask = {
  id: "task-website",
  companyName: "Northstar SaaS",
  companyContact: "founder@northstar.example",
  title: "为 B2B SaaS 产品制作官网首屏和定价页",
  description: "需要根据现有产品说明，完成官网信息架构、首屏文案、定价页布局和可交互前端页面。",
  budget: 12000,
  deadline: "2026-07-18",
  skills: ["产品", "设计", "前端", "文案"],
  status: "published",
  createdAt: "2026-06-29T09:00:00.000Z",
  ai: generateTaskBreakdown("为 B2B SaaS 产品制作官网首屏和定价页", "需要根据现有产品说明，完成官网信息架构、首屏文案、定价页布局和可交互前端页面。", 12000, ["产品", "设计", "前端", "文案"])
};

const seedTalents: TalentProfile[] = [
  { id: "talent-lin", name: "林舟", contact: "lin@example.com", skills: ["产品", "前端", "AI"], availability: "每周 20 小时", expectedIncome: 9000, experience: "做过 SaaS 官网和 AI 工具 MVP，熟悉需求拆解和 React 交付。", createdAt: "2026-06-28T12:00:00.000Z" },
  { id: "talent-chen", name: "陈若宁", contact: "chen@example.com", skills: ["设计", "文案", "运营"], availability: "每周 12 小时", expectedIncome: 7000, experience: "擅长创业项目品牌表达、落地页结构和转化文案。", createdAt: "2026-06-27T12:00:00.000Z" }
];

function hydrateSeed(): AppData {
  return { tasks: [seedTask], talents: seedTalents, matches: createMatches(seedTask, seedTalents), applications: [], orders: [] };
}

function buildDemoData(): AppData {
  const createdAt = new Date().toISOString();
  const tasks: EnterpriseTask[] = [
    {
      id: "demo-task-brand",
      companyName: "Aureon Labs",
      companyContact: "ops@aureonlabs.example",
      title: "为 AI 工具设计品牌视觉和落地页",
      description: "完成品牌基础视觉、首屏结构、落地页文案和可交互页面原型，用于产品发布前测试。",
      budget: 18000,
      deadline: "2026-07-28",
      skills: ["产品", "设计", "前端", "文案"],
      status: "published",
      createdAt,
      ai: generateTaskBreakdown("为 AI 工具设计品牌视觉和落地页", "完成品牌基础视觉、首屏结构、落地页文案和可交互页面原型，用于产品发布前测试。", 18000, ["产品", "设计", "前端", "文案"])
    },
    {
      id: "demo-task-data",
      companyName: "Bright Retail",
      companyContact: "pm@brightretail.example",
      title: "搭建销售数据分析仪表盘",
      description: "整理销售数据，定义核心指标，制作可视化仪表盘并输出经营洞察。",
      budget: 15000,
      deadline: "2026-07-24",
      skills: ["数据分析", "后端", "产品"],
      status: "published",
      createdAt,
      ai: generateTaskBreakdown("搭建销售数据分析仪表盘", "整理销售数据，定义核心指标，制作可视化仪表盘并输出经营洞察。", 15000, ["数据分析", "后端", "产品"])
    },
    {
      id: "demo-task-content",
      companyName: "Northstar Education",
      companyContact: "growth@northstar.example",
      title: "制作 30 天短视频内容计划",
      description: "围绕在线课程设计短视频选题、脚本框架、发布节奏和复盘指标。",
      budget: 8000,
      deadline: "2026-07-20",
      skills: ["运营", "文案", "AI"],
      status: "published",
      createdAt,
      ai: generateTaskBreakdown("制作 30 天短视频内容计划", "围绕在线课程设计短视频选题、脚本框架、发布节奏和复盘指标。", 8000, ["运营", "文案", "AI"])
    },
    {
      id: "demo-task-automation",
      companyName: "Atlas Ops",
      companyContact: "founder@atlasops.example",
      title: "搭建内部 AI 自动化工作流",
      description: "把客服 FAQ、线索分拣和周报整理做成自动化流程，并交付使用说明。",
      budget: 22000,
      deadline: "2026-08-03",
      skills: ["AI", "后端", "产品"],
      status: "published",
      createdAt,
      ai: generateTaskBreakdown("搭建内部 AI 自动化工作流", "把客服 FAQ、线索分拣和周报整理做成自动化流程，并交付使用说明。", 22000, ["AI", "后端", "产品"])
    },
    {
      id: "demo-task-finance",
      companyName: "Harbor Studio",
      companyContact: "finance@harborstudio.example",
      title: "整理外包项目财务台账",
      description: "规范应收应付、项目成本和月度利润表，形成可持续维护的财务模板。",
      budget: 6000,
      deadline: "2026-07-18",
      skills: ["财务", "数据分析", "运营"],
      status: "published",
      createdAt,
      ai: generateTaskBreakdown("整理外包项目财务台账", "规范应收应付、项目成本和月度利润表，形成可持续维护的财务模板。", 6000, ["财务", "数据分析", "运营"])
    }
  ];

  const talents: TalentProfile[] = [
    { id: "demo-talent-product", name: "周启明", contact: "zhou@example.com", skills: ["产品", "AI", "前端"], availability: "每周 20 小时", expectedIncome: 12000, experience: "做过 AI SaaS MVP、需求拆解和前端交付。", createdAt },
    { id: "demo-talent-design", name: "苏曼", contact: "suman@example.com", skills: ["设计", "文案", "产品"], availability: "每周 15 小时", expectedIncome: 10000, experience: "擅长品牌视觉、落地页和转化文案。", createdAt },
    { id: "demo-talent-data", name: "王可", contact: "wangke@example.com", skills: ["数据分析", "后端", "AI"], availability: "每周 18 小时", expectedIncome: 13000, experience: "做过销售数据看板、BI 报告和数据清洗。", createdAt },
    { id: "demo-talent-ops", name: "李安然", contact: "li@example.com", skills: ["运营", "文案", "AI"], availability: "每周 12 小时", expectedIncome: 7000, experience: "负责过教育产品内容矩阵、短视频脚本和增长复盘。", createdAt },
    { id: "demo-talent-auto", name: "赵一帆", contact: "zhao@example.com", skills: ["AI", "后端", "产品"], availability: "每周 25 小时", expectedIncome: 16000, experience: "搭建过客服机器人、内部自动化流程和权限接口。", createdAt },
    { id: "demo-talent-finance", name: "黄佳", contact: "huangjia@example.com", skills: ["财务", "数据分析", "运营"], availability: "每周 10 小时", expectedIncome: 5000, experience: "有外包项目财务、应收应付和利润表经验。", createdAt }
  ];

  const matches = tasks.flatMap((task) => createMatches(task, talents));
  const applications: TaskApplication[] = [
    { id: "demo-task-content-demo-talent-ops-application", taskId: "demo-task-content", talentId: "demo-talent-ops", status: "order_created", createdAt },
    { id: "demo-task-finance-demo-talent-finance-application", taskId: "demo-task-finance", talentId: "demo-talent-finance", status: "order_created", createdAt }
  ];
  const orders: PlatformOrder[] = [
    { id: "demo-task-content-demo-talent-ops-talent_application", taskId: "demo-task-content", talentId: "demo-talent-ops", source: "talent_application", amount: 8000, commissionRate: 10, commissionAmount: 800, talentPayout: 7200, status: "pending_payment", createdAt },
    { id: "demo-task-automation-demo-talent-auto-enterprise_invite", taskId: "demo-task-automation", talentId: "demo-talent-auto", source: "enterprise_invite", amount: 22000, commissionRate: 10, commissionAmount: 2200, talentPayout: 19800, status: "escrowed", createdAt }
  ];

  return { tasks, talents, matches, applications, orders };
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [data, setData] = useState<AppData>(hydrateSeed());
  const [selectedTaskId, setSelectedTaskId] = useState(seedTask.id);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ai-workforce-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      setData({ ...hydrateSeed(), ...parsed, applications: parsed.applications ?? [], orders: parsed.orders ?? [] });
    }
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
    if (!session) {
      setIsAdmin(false);
      return;
    }
    loadCloudData()
      .then((cloudData) => {
        if (cloudData && (cloudData.tasks.length || cloudData.talents.length || cloudData.matches.length || cloudData.applications.length || cloudData.orders.length)) {
          setData(cloudData);
          setSelectedTaskId(cloudData.tasks[0]?.id ?? selectedTaskId);
        }
      })
      .catch((error) => setNotice(`云端数据读取失败：${error.message}`));
    isCurrentUserAdmin()
      .then(setIsAdmin)
      .catch((error) => setNotice(`管理员权限检查失败：${error.message}`));
  }, [session]);

  useEffect(() => {
    if (!session || !isAdmin || data.tasks.some((task) => task.id === "demo-task-brand")) return;
    void seedDemoData();
  }, [session, isAdmin]);

  const selectedTask = data.tasks.find((task) => task.id === selectedTaskId) ?? data.tasks[0];
  const selectedMatches = data.matches.filter((match) => match.taskId === selectedTask?.id);

  function navigate(next: View) {
    setView(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function publishTask(task: EnterpriseTask) {
    const matches = createMatches(task, data.talents);
    setData((current) => ({ ...current, tasks: [task, ...current.tasks], matches: [...matches, ...current.matches.filter((match) => match.taskId !== task.id)] }));
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
    setData((current) => ({ ...current, matches: current.matches.map((match) => match.id === matchId ? { ...match, status } : match) }));
    if (session) await updateCloudMatchStatus(matchId, status).catch((error) => setNotice(`云端状态更新失败：${error.message}`));
  }

  function buildOrder(taskId: string, talentId: string, source: PlatformOrder["source"]): PlatformOrder {
    const task = data.tasks.find((item) => item.id === taskId);
    const amount = task?.budget ?? 0;
    const commissionRate = 10;
    const commissionAmount = Math.round(amount * commissionRate / 100);
    return { id: `${taskId}-${talentId}-${source}`, taskId, talentId, source, amount, commissionRate, commissionAmount, talentPayout: Math.max(0, amount - commissionAmount), status: "pending_payment", createdAt: new Date().toISOString() };
  }

  async function createOrder(order: PlatformOrder) {
    setData((current) => ({ ...current, orders: [order, ...current.orders.filter((item) => item.id !== order.id)] }));
    if (session) await saveCloudOrder(order).catch((error) => setNotice(`订单保存失败：${error.message}`));
  }

  async function setOrderStatus(orderId: string, status: PlatformOrder["status"]) {
    setData((current) => ({ ...current, orders: current.orders.map((order) => order.id === orderId ? { ...order, status } : order) }));
    if (session) await updateCloudOrderStatus(orderId, status).catch((error) => setNotice(`订单状态更新失败：${error.message}`));
  }

  async function applyToTask(application: TaskApplication) {
    setData((current) => ({ ...current, applications: [application, ...current.applications.filter((item) => !(item.taskId === application.taskId && item.talentId === application.talentId))] }));
    if (session) await saveCloudApplication(application).catch((error) => setNotice(`申请保存失败：${error.message}`));
  }

  async function adminDelete(kind: AdminEntityKind, id: string) {
    if (!isAdmin) return setNotice("当前账号没有管理员权限。");
    if (session) {
      try {
        await deleteCloudEntity(kind, id);
      } catch (error) {
        setNotice(`删除失败：${error instanceof Error ? error.message : "未知错误"}`);
        return;
      }
    }
    setData((current) => ({
      ...current,
      tasks: kind === "task" ? current.tasks.filter((item) => item.id !== id) : current.tasks,
      talents: kind === "talent" ? current.talents.filter((item) => item.id !== id) : current.talents,
      matches: kind === "match" ? current.matches.filter((item) => item.id !== id) : current.matches.filter((item) => kind === "task" ? item.taskId !== id : kind === "talent" ? item.talentId !== id : true),
      applications: kind === "application" ? current.applications.filter((item) => item.id !== id) : current.applications.filter((item) => kind === "task" ? item.taskId !== id : kind === "talent" ? item.talentId !== id : true),
      orders: kind === "order" ? current.orders.filter((item) => item.id !== id) : current.orders.filter((item) => kind === "task" ? item.taskId !== id : kind === "talent" ? item.talentId !== id : true)
    }));
    setNotice("已删除。");
  }

  async function seedDemoData() {
    if (!isAdmin) return setNotice("当前账号没有管理员权限。");
    const demo = buildDemoData();
    const merged: AppData = {
      tasks: [...demo.tasks, ...data.tasks.filter((item) => !demo.tasks.some((demoItem) => demoItem.id === item.id))],
      talents: [...demo.talents, ...data.talents.filter((item) => !demo.talents.some((demoItem) => demoItem.id === item.id))],
      matches: [...demo.matches, ...data.matches.filter((item) => !demo.matches.some((demoItem) => demoItem.id === item.id))],
      applications: [...demo.applications, ...data.applications.filter((item) => !demo.applications.some((demoItem) => demoItem.id === item.id))],
      orders: [...demo.orders, ...data.orders.filter((item) => !demo.orders.some((demoItem) => demoItem.id === item.id))]
    };
    setData(merged);
    setSelectedTaskId(demo.tasks[0]?.id ?? selectedTaskId);
    if (session) {
      try {
        await Promise.all(demo.tasks.map((task) => saveCloudTask(task)));
        await Promise.all(demo.talents.map((talent) => saveCloudTalent(talent)));
        await saveCloudMatches(demo.matches);
        await Promise.all(demo.applications.map((application) => saveCloudApplication(application)));
        await Promise.all(demo.orders.map((order) => saveCloudOrder(order)));
        setNotice("已生成演示企业任务、个人用户、匹配记录和平台订单。");
      } catch (error) {
        setNotice(`演示数据保存失败：${error instanceof Error ? error.message : "未知错误"}`);
      }
    } else {
      setNotice("已在本地生成演示数据。登录后可同步到云端。");
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
      {view === "market" && <TaskMarket tasks={data.tasks} talents={data.talents} applications={data.applications} orders={data.orders} selectedTaskId={selectedTaskId} setSelectedTaskId={setSelectedTaskId} navigate={navigate} onApply={applyToTask} createOrder={createOrder} buildOrder={buildOrder} setNotice={setNotice} />}
      {view === "matches" && selectedTask && <MatchPage task={selectedTask} talents={data.talents} matches={selectedMatches} orders={data.orders} onStatusChange={setMatchStatus} createOrder={createOrder} buildOrder={buildOrder} setOrderStatus={setOrderStatus} setNotice={setNotice} />}
      {view === "admin" && <Admin data={data} isAdmin={isAdmin} onDelete={adminDelete} />}
    </main>
  );
}

function Header({ view, navigate, menuOpen, setMenuOpen, session }: { view: View; navigate: (view: View) => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void; session: Session | null }) {
  const links: [View, string][] = [["post", "企业发布"], ["profile", "个人资料"], ["market", "任务大厅"], ["matches", "AI 匹配"], ["admin", "管理后台"]];
  return <header className="sticky top-0 z-40 border-b border-[#dde3ea] bg-white/90 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5"><button className="flex items-center gap-3" onClick={() => navigate("home")}><span className="grid h-9 w-9 place-items-center rounded-lg bg-[#155eef] text-white"><Sparkles size={18} /></span><span className="text-left"><b className="block leading-4">AI Workforce</b><small className="text-[#667085]">AI 劳动力网络 MVP</small></span></button><nav className="hidden items-center gap-2 md:flex">{links.map(([target, label]) => <button key={target} onClick={() => navigate(target)} className={`nav ${view === target ? "navActive" : ""}`}>{label}</button>)}<button onClick={() => navigate("auth")} className={`nav ${view === "auth" ? "navActive" : ""}`}>{session ? "账号" : "注册/登录"}</button><a href="/aureonagent/en" className="nav">English</a></nav><button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div>{menuOpen && <div className="grid border-t bg-white p-3 md:hidden">{links.map(([target, label]) => <button key={target} className="rounded-lg p-3 text-left" onClick={() => navigate(target)}>{label}</button>)}<button className="rounded-lg p-3 text-left" onClick={() => navigate("auth")}>{session ? "账号" : "注册/登录"}</button><a className="rounded-lg p-3 text-left" href="/aureonagent/en">English</a></div>}</header>;
}

function AuthPage({ session, setNotice }: { session: Session | null; setNotice: (value: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  async function signUp() { if (!supabase) return setNotice("还没有配置 Supabase 环境变量。"); setLoading(true); const { error } = await supabase.auth.signUp({ email, password }); setLoading(false); setNotice(error ? `注册失败：${error.message}` : "注册成功。若开启邮箱确认，请先确认邮箱。"); }
  async function signIn() { if (!supabase) return setNotice("还没有配置 Supabase 环境变量。"); setLoading(true); const { error } = await supabase.auth.signInWithPassword({ email, password }); setLoading(false); setNotice(error ? `登录失败：${error.message}` : "登录成功。"); }
  async function signOut() { if (!supabase) return; await supabase.auth.signOut(); setNotice("已退出登录。"); }
  return <PageShell eyebrow="ACCOUNT" title="用户注册与登录"><div className="panel max-w-2xl p-6">{session ? <div><p className="text-sm text-[#667085]">当前登录账号</p><h2 className="mt-2 text-xl font-semibold">{session.user.email}</h2><button className="secondary mt-6" onClick={signOut}>退出登录</button></div> : <div className="grid gap-4"><Field label="邮箱" type="email" value={email} onChange={setEmail} /><Field label="密码" type="password" value={password} onChange={setPassword} /><div className="flex gap-3"><button className="primary" disabled={loading || !email || password.length < 6} onClick={signUp}>注册</button><button className="secondary" disabled={loading || !email || password.length < 6} onClick={signIn}>登录</button></div></div>}</div></PageShell>;
}

function Landing({ navigate }: { navigate: (view: View) => void }) {
  const steps = ["企业提出结果目标", "AI 理解并拆解任务", "匹配可交付人才节点", "协作推进阶段交付", "沉淀能力与信誉记录"];
  return <><section className="border-b border-[#e4e7ec] bg-white"><div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1.05fr_.95fr]"><div><span className="eyebrow">AI WORKFORCE NETWORK</span><h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">企业按结果调用 AI 劳动力，个人用技能接入网络获得收入。</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[#667085]">平台把企业目标转化为可执行工作单元，让 AI、个人技能和交付流程在同一个网络里协作。</p><div className="mt-8 flex flex-wrap gap-3"><button className="primary" onClick={() => navigate("post")}><BriefcaseBusiness size={18} />发布企业任务</button><button className="secondary" onClick={() => navigate("profile")}><UserRound size={18} />创建个人资料</button></div></div><div className="panel p-6"><span className="eyebrow">WORKFORCE OS</span><h2 className="mt-2 text-xl font-semibold">AI 劳动力网络如何运转</h2><div className="mt-5 grid gap-3">{steps.map((item, index) => <div className="flex items-center gap-3 rounded-lg bg-[#f2f4f7] p-4" key={item}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-white text-sm font-semibold text-[#155eef]">{index + 1}</span><span className="font-medium">{item}</span></div>)}</div></div></div></section><section className="mx-auto grid max-w-7xl gap-5 px-5 py-14 md:grid-cols-3"><Feature icon={<Sparkles />} title="AI 拆解" body="自动生成里程碑、交付物和建议报价。" /><Feature icon={<UsersRound />} title="双向匹配" body="企业可邀请个人，个人也可申请企业任务。" /><Feature icon={<LayoutDashboard />} title="后台管理" body="管理员可删除任务、个人资料、申请和订单。" /></section></>;
}

function TaskPost({ onSubmit }: { onSubmit: (task: EnterpriseTask) => void }) {
  const [form, setForm] = useState({ companyName: "", companyContact: "", title: "", description: "", budget: 10000, deadline: "2026-07-20", skills: "产品, 设计, 前端" });
  const skills = normalizeSkills(form.skills);
  const ai = useMemo(() => generateTaskBreakdown(form.title, form.description, form.budget, skills), [form.title, form.description, form.budget, form.skills]);
  function submit() { onSubmit({ id: crypto.randomUUID(), companyName: form.companyName || "未命名企业", companyContact: form.companyContact, title: form.title || "未命名任务", description: form.description, budget: form.budget, deadline: form.deadline, skills, status: "published", createdAt: new Date().toISOString(), ai }); }
  return <PageShell eyebrow="ENTERPRISE" title="企业端发布任务"><div className="grid gap-6 lg:grid-cols-[1fr_.9fr]"><div className="panel p-6"><div className="grid gap-4"><Field label="企业名称" value={form.companyName} onChange={(companyName) => setForm({ ...form, companyName })} /><Field label="企业联系方式（付款后开放）" value={form.companyContact} onChange={(companyContact) => setForm({ ...form, companyContact })} /><Field label="任务标题" value={form.title} onChange={(title) => setForm({ ...form, title })} /><TextArea label="任务描述" value={form.description} onChange={(description) => setForm({ ...form, description })} /><NumberField label="预算（元）" value={form.budget} onChange={(budget) => setForm({ ...form, budget })} /><Field label="截止时间" type="date" value={form.deadline} onChange={(deadline) => setForm({ ...form, deadline })} /><Field label="所需技能" value={form.skills} onChange={(skills) => setForm({ ...form, skills })} /><button className="primary justify-center" disabled={!form.title || !form.description || !form.companyContact} onClick={submit}><Sparkles size={18} />发布并生成匹配</button></div></div><AiBreakdown ai={ai} skills={skills} /></div></PageShell>;
}

function TalentProfileForm({ onSubmit }: { onSubmit: (talent: TalentProfile) => void }) {
  const [form, setForm] = useState({ name: "", contact: "", skills: "产品, 前端, AI", availability: "每周 20 小时", expectedIncome: 8000, experience: "" });
  function submit() { onSubmit({ id: crypto.randomUUID(), name: form.name, contact: form.contact, skills: normalizeSkills(form.skills), availability: form.availability, expectedIncome: form.expectedIncome, experience: form.experience, createdAt: new Date().toISOString() }); }
  return <PageShell eyebrow="TALENT" title="个人端资料页面"><div className="panel max-w-3xl p-6"><div className="grid gap-4 md:grid-cols-2"><Field label="姓名" value={form.name} onChange={(name) => setForm({ ...form, name })} /><Field label="联系方式（付款后开放）" value={form.contact} onChange={(contact) => setForm({ ...form, contact })} /><Field label="技能标签" value={form.skills} onChange={(skills) => setForm({ ...form, skills })} /><Field label="可工作时间" value={form.availability} onChange={(availability) => setForm({ ...form, availability })} /><NumberField label="期望收入（元/任务）" value={form.expectedIncome} onChange={(expectedIncome) => setForm({ ...form, expectedIncome })} /><div className="md:col-span-2"><TextArea label="过往经验" value={form.experience} onChange={(experience) => setForm({ ...form, experience })} /></div><button className="primary justify-center md:col-span-2" disabled={!form.name || !form.contact} onClick={submit}><CheckCircle2 size={18} />保存资料</button></div></div></PageShell>;
}

function TaskMarket({ tasks, talents, applications, orders, selectedTaskId, setSelectedTaskId, navigate, onApply, createOrder, buildOrder, setNotice }: { tasks: EnterpriseTask[]; talents: TalentProfile[]; applications: TaskApplication[]; orders: PlatformOrder[]; selectedTaskId: string; setSelectedTaskId: (id: string) => void; navigate: (view: View) => void; onApply: (application: TaskApplication) => void; createOrder: (order: PlatformOrder) => void; buildOrder: (taskId: string, talentId: string, source: PlatformOrder["source"]) => PlatformOrder; setNotice: (value: string) => void }) {
  const [skill, setSkill] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [talentId, setTalentId] = useState(talents[0]?.id ?? "");
  const skills = Array.from(new Set(tasks.flatMap((task) => task.skills)));
  const filtered = tasks.filter((task) => (!skill || task.skills.includes(skill)) && (!budget || task.budget >= Number(budget)) && (!deadline || task.deadline <= deadline));
  useEffect(() => { if (!talentId && talents[0]?.id) setTalentId(talents[0].id); }, [talentId, talents]);
  const selectedTalent = talents.find((talent) => talent.id === talentId);
  return <PageShell eyebrow="MARKET" title="任务大厅">{talents.length === 0 ? <div className="panel mb-5 p-6"><h2 className="text-xl font-semibold">先创建个人资料</h2><button className="primary mt-5" onClick={() => navigate("profile")}><UserRound size={18} />去创建个人资料</button></div> : <div className="mb-5 grid gap-3 rounded-xl border border-[#d0d5dd] bg-white p-4 md:grid-cols-5"><label><span className="label">以哪个个人资料申请</span><select className="input" value={talentId} onChange={(event) => setTalentId(event.target.value)}>{talents.map((talent) => <option key={talent.id} value={talent.id}>{talent.name} · {talent.contact}</option>)}</select></label><Select label="按技能筛选" value={skill} onChange={setSkill} options={["", ...skills]} /><Field label="最低预算" type="number" value={budget} onChange={setBudget} /><Field label="截止时间早于" type="date" value={deadline} onChange={setDeadline} /><div className="flex items-end"><button className="secondary w-full justify-center" onClick={() => { setSkill(""); setBudget(""); setDeadline(""); }}><ListFilter size={18} />重置</button></div></div>}<div className="grid gap-4">{filtered.map((task) => { const hasApplied = Boolean(selectedTalent && applications.some((item) => item.taskId === task.id && item.talentId === selectedTalent.id)); const order = selectedTalent ? orders.find((item) => item.taskId === task.id && item.talentId === selectedTalent.id && item.source === "talent_application") : undefined; return <article className={`panel p-5 ${selectedTaskId === task.id ? "ring-2 ring-[#155eef]" : ""}`} key={task.id}><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><h2 className="text-xl font-semibold">{task.title}</h2><p className="mt-1 text-sm font-medium text-[#155eef]">{task.companyName}</p><p className="mt-2 max-w-3xl text-sm leading-6 text-[#667085]">{task.description}</p><div className="mt-4 flex flex-wrap gap-2">{task.skills.map((item) => <Badge key={item}>{item}</Badge>)}</div></div><div className="min-w-52 rounded-lg bg-[#f2f4f7] p-4 text-sm"><b className="block text-lg">¥{task.budget.toLocaleString()}</b><span className="mt-1 flex items-center gap-1 text-[#667085]"><CalendarClock size={15} />{task.deadline}</span></div></div><div className="mt-5 flex flex-wrap gap-3"><button className="secondary" onClick={() => setSelectedTaskId(task.id)}><Search size={18} />选中任务</button><button className="primary" onClick={() => { setSelectedTaskId(task.id); navigate("matches"); }}>查看 AI 匹配<ArrowRight size={18} /></button><button className="secondary" disabled={!selectedTalent} onClick={async () => { if (!selectedTalent) return; await onApply({ id: `${task.id}-${selectedTalent.id}-application`, taskId: task.id, talentId: selectedTalent.id, status: "order_created", createdAt: new Date().toISOString() }); await createOrder(buildOrder(task.id, selectedTalent.id, "talent_application")); setNotice("已生成平台订单。企业托管付款后再开放联系方式。"); }}>{hasApplied ? "查看平台订单" : "申请合作 / 生成订单"}</button></div>{order && <OrderBox order={order} />}</article>; })}</div></PageShell>;
}

function MatchPage({ task, talents, matches, orders, onStatusChange, createOrder, buildOrder, setOrderStatus, setNotice }: { task: EnterpriseTask; talents: TalentProfile[]; matches: MatchResult[]; orders: PlatformOrder[]; onStatusChange: (matchId: string, status: MatchResult["status"]) => void; createOrder: (order: PlatformOrder) => void; buildOrder: (taskId: string, talentId: string, source: PlatformOrder["source"]) => PlatformOrder; setOrderStatus: (orderId: string, status: PlatformOrder["status"]) => void; setNotice: (value: string) => void }) {
  return <PageShell eyebrow="AI MATCHING" title="AI 匹配结果页面"><div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]"><AiBreakdown ai={task.ai} skills={task.skills} task={task} /><div className="grid gap-4">{matches.map((match) => { const talent = talents.find((item) => item.id === match.talentId); if (!talent) return null; const order = orders.find((item) => item.taskId === task.id && item.talentId === talent.id && item.source === "enterprise_invite"); return <article className="panel p-5" key={match.id}><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold">{talent.name}</h2><p className="mt-1 text-sm text-[#667085]">{talent.availability} · 期望 ¥{talent.expectedIncome.toLocaleString()}</p></div><span className="rounded-lg bg-[#ecfdf3] px-3 py-2 text-sm font-semibold text-[#027a48]">匹配 {match.score}</span></div><div className="mt-4 flex flex-wrap gap-2">{talent.skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div><div className="mt-5 flex flex-wrap gap-3"><button className="primary" onClick={async () => { await onStatusChange(match.id, "selected"); await createOrder(buildOrder(task.id, talent.id, "enterprise_invite")); setNotice("已生成平台订单。请先托管付款。"); }}>选中并生成订单</button>{order && order.status === "pending_payment" && <button className="secondary" onClick={() => setOrderStatus(order.id, "escrowed")}>模拟托管付款</button>}{order && order.status === "escrowed" && <button className="secondary" onClick={() => setOrderStatus(order.id, "completed")}>模拟确认完成</button>}</div>{order && <OrderBox order={order} />}{order?.status === "completed" && <div className="mt-4 rounded-lg border border-[#abefc6] bg-[#ecfdf3] p-4 text-sm text-[#027a48]"><b className="block">订单已完成，联系方式已开放</b>{talent.contact}</div>}<h3 className="mt-5 font-semibold">匹配理由</h3><ul className="mt-2 grid gap-2 text-sm text-[#475467]">{match.reasons.map((reason) => <li className="rounded-lg bg-[#f2f4f7] p-3" key={reason}>{reason}</li>)}</ul></article>; })}</div></div></PageShell>;
}

function OrderBox({ order }: { order: PlatformOrder }) {
  return <div className="mt-4 rounded-lg border border-[#b2ddff] bg-[#eff8ff] p-4 text-sm text-[#1849a9]"><b className="block">平台订单</b><p>状态：{order.status}</p><p>任务金额：¥{order.amount.toLocaleString()} · 平台佣金 {order.commissionRate}%：¥{order.commissionAmount.toLocaleString()} · 执行者预计收入：¥{order.talentPayout.toLocaleString()}</p><p className="mt-2 text-[#475467]">付款前不开放联系方式，避免绕过平台成交。</p></div>;
}

function Admin({ data, isAdmin, onDelete }: { data: AppData; isAdmin: boolean; onDelete: (kind: AdminEntityKind, id: string) => void }) {
  return <PageShell eyebrow="ADMIN" title="管理后台"><div className={`mb-5 rounded-lg border p-4 text-sm ${isAdmin ? "border-[#abefc6] bg-[#ecfdf3] text-[#027a48]" : "border-[#fedf89] bg-[#fffaeb] text-[#b54708]"}`}>{isAdmin ? "当前账号拥有管理员删除权限。" : "当前账号没有管理员删除权限。你仍可查看数据，但不能删除。"}</div><div className="grid gap-4 md:grid-cols-5"><Stat label="企业任务" value={data.tasks.length} /><Stat label="个人用户" value={data.talents.length} /><Stat label="匹配记录" value={data.matches.length} /><Stat label="个人申请" value={data.applications.length} /><Stat label="平台订单" value={data.orders.length} /></div><div className="mt-6 grid gap-6 lg:grid-cols-5"><AdminManageList title="企业任务" items={data.tasks.map((task) => ({ id: task.id, text: `${task.companyName} · ${task.title} · ¥${task.budget.toLocaleString()}`, kind: "task" as const }))} isAdmin={isAdmin} onDelete={onDelete} /><AdminManageList title="个人用户" items={data.talents.map((talent) => ({ id: talent.id, text: `${talent.name} · ${talent.contact} · ${talent.skills.join("、")}`, kind: "talent" as const }))} isAdmin={isAdmin} onDelete={onDelete} /><AdminManageList title="匹配记录" items={data.matches.map((match) => ({ id: match.id, text: `${match.taskId.slice(0, 8)} → ${match.talentId.slice(0, 10)} · ${match.score}`, kind: "match" as const }))} isAdmin={isAdmin} onDelete={onDelete} /><AdminManageList title="个人申请" items={data.applications.map((application) => ({ id: application.id, text: `${application.taskId.slice(0, 8)} → ${application.talentId.slice(0, 10)} · ${application.status}`, kind: "application" as const }))} isAdmin={isAdmin} onDelete={onDelete} /><AdminManageList title="平台订单" items={data.orders.map((order) => ({ id: order.id, text: `${order.source} · ¥${order.amount.toLocaleString()} · 佣金 ¥${order.commissionAmount.toLocaleString()} · ${order.status}`, kind: "order" as const }))} isAdmin={isAdmin} onDelete={onDelete} /></div></PageShell>;
}

function AiBreakdown({ ai, skills, task }: { ai: EnterpriseTask["ai"]; skills: string[]; task?: EnterpriseTask }) {
  return <aside className="panel p-6"><div className="flex items-center gap-2 text-[#155eef]"><Sparkles size={18} /><b>AI 自动拆解任务</b></div>{task && <h2 className="mt-3 text-xl font-semibold">{task.title}</h2>}<p className="mt-3 text-sm leading-6 text-[#667085]">{ai.summary}</p><div className="mt-4 flex flex-wrap gap-2">{skills.map((skill) => <Badge key={skill}>{skill}</Badge>)}</div><Block title="里程碑" items={ai.milestones} /><Block title="交付物" items={ai.deliverables} /><Block title="风险提示" items={ai.risks} /><div className="mt-5 rounded-xl bg-[#eff4ff] p-4"><span className="text-sm text-[#475467]">AI 生成建议报价</span><b className="mt-1 block text-2xl text-[#155eef]">¥{ai.suggestedQuote.min.toLocaleString()} - ¥{ai.suggestedQuote.max.toLocaleString()}</b><p className="mt-2 text-xs text-[#667085]">{ai.suggestedQuote.basis}</p></div></aside>;
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

function AdminManageList({ title, items, isAdmin, onDelete }: { title: string; items: Array<{ id: string; text: string; kind: AdminEntityKind }>; isAdmin: boolean; onDelete: (kind: AdminEntityKind, id: string) => void }) {
  return <section className="panel p-5"><h2 className="font-semibold">{title}</h2><div className="mt-4 grid gap-2">{items.length === 0 && <p className="rounded-lg bg-[#f8fafc] p-3 text-sm text-[#667085]">暂无数据</p>}{items.map((item) => <div className="rounded-lg bg-[#f8fafc] p-3 text-sm text-[#475467]" key={item.id}><p>{item.text}</p>{isAdmin && <button className="mt-3 rounded-md border border-[#fecdca] bg-white px-3 py-1.5 text-xs font-semibold text-[#b42318]" onClick={() => onDelete(item.kind, item.id)}>删除</button>}</div>)}</div></section>;
}
