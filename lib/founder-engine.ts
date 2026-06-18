export type FounderProfile = {
  city: string;
  budget: number;
  skill: string;
  experience: string;
  team: string;
  time: string;
};

export type StartupIdea = {
  id: string;
  title: string;
  fit: string;
  market: string;
  competition: string;
  capital: string;
  risks: string[];
  revenuePath: string;
};

export type Canvas = {
  customers: string;
  product: string;
  pricing: string;
  channels: string;
  expansion: string;
  partners: string;
  costs: string;
  metrics: string;
};

export type Plan = {
  ideas: StartupIdea[];
  canvas: Record<string, Canvas>;
  mvp: {
    week1: string[];
    month1: string[];
    month3: string[];
  };
  website: {
    structure: string[];
    pages: string[];
    features: string[];
    stack: string[];
  };
  acquisition: Record<string, string[]>;
  deck: string[];
  brokers: {
    category: string;
    provider: string;
    reason: string;
    price: string;
  }[];
};

const currency = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0
});

export function buildFounderPlan(profile: FounderProfile): Plan {
  const city = profile.city || "深圳";
  const skill = profile.skill || "销售";
  const experience = profile.experience || "跨境电商";
  const budget = profile.budget || 50000;
  const budgetLabel = currency.format(budget);

  const ideas: StartupIdea[] = [
    {
      id: "cross-border-growth",
      title: `${experience}增长代运营工作室`,
      fit: `你已有${experience}经验和${skill}能力，适合从服务型现金流切入，先卖结果再产品化。`,
      market: `${city}周边中小卖家对获客、内容、投放和独立站转化有持续需求，客单价可从 8,000 元/月起步。`,
      competition: "代运营竞争激烈，但垂直到细分品类和首单增长承诺后，可避开综合服务商。",
      capital: `建议启动资金 ${currency.format(Math.min(budget, 38000))}，主要用于工具、内容生产、样板客户让利和外包设计。`,
      risks: ["交付边界失控", "客户复购不稳定", "过早招聘导致现金流压力"],
      revenuePath: "先锁定 3 个样板客户，用 14 天审计 + 30 天增长套餐获得首笔收入。"
    },
    {
      id: "ai-export-agent",
      title: "AI 外贸线索开发助手",
      fit: `${skill}能力可以转化为客户开发 SOP，AI 负责线索筛选、邮件生成和跟进节奏。`,
      market: "外贸公司愿意为有效询盘付费，轻量 SaaS + 人工托管服务更容易早期成交。",
      competition: "CRM 和邮件工具很多，但面向中文外贸团队的一体化线索开发仍有切入空间。",
      capital: `MVP 可控制在 ${currency.format(Math.min(budget, 45000))} 内，优先做半自动化服务而非完整 SaaS。`,
      risks: ["数据质量不稳定", "邮件送达率", "海外合规要求"],
      revenuePath: "以 2,999 元线索包或 6,999 元/月托管包测试付款意愿。"
    },
    {
      id: "local-supplier-brand",
      title: `${city}产业带品牌出海陪跑`,
      fit: `${city}具备供应链和创业密度，结合${experience}经验可服务工厂从 OEM 到 DTC。`,
      market: "产业带工厂有品牌化和海外渠道需求，但缺少低成本验证路径。",
      competition: "咨询公司价格高，纯建站公司不管增长；你可以用低门槛陪跑套餐切入。",
      capital: `首期投入 ${currency.format(Math.min(budget, 30000))}，重点建设案例页、提案模板和服务商网络。`,
      risks: ["工厂决策周期长", "品牌建设见效慢", "交付依赖供应链配合"],
      revenuePath: "用 9,800 元品牌出海诊断包成交第一批客户。"
    }
  ];

  const canvas: Record<string, Canvas> = Object.fromEntries(
    ideas.map((idea) => [
      idea.id,
      {
        customers: `${city}及周边有增长焦虑、预算有限、希望 30-90 天看到收入结果的小企业主。`,
        product: `${idea.title}，交付包括诊断、MVP、获客实验、数据复盘和服务商匹配。`,
        pricing: "免费诊断获取线索，核心套餐 2,999-19,800 元，后续按月订阅或成交佣金。",
        channels: "微信私域、短视频案例、小红书干货、B站长内容、SEO 行业页、Google 搜索广告。",
        expansion: "从人工服务开始，沉淀 SOP、模板和数据，再产品化为 AI 工作台与服务市场。",
        partners: "会计、律师、商标代理、独立站开发、UI 设计、SEO、短视频代运营。",
        costs: "AI API、设计与开发外包、内容制作、销售工具、线索数据、基础法务与财务。",
        metrics: "首单周期、咨询转化率、MVP 上线时间、获客成本、月复购率、现金流覆盖月数。"
      }
    ])
  );

  return {
    ideas,
    canvas,
    mvp: {
      week1: [
        "确定一个垂直客户群，访谈 10 个潜在客户",
        "发布 1 个问题诊断表和 1 个服务说明页",
        "准备 3 套报价：诊断包、增长包、托管包",
        "手动交付第一个样板项目，记录全流程 SOP"
      ],
      month1: [
        "完成 30 个销售触达和 10 个深度沟通",
        "拿到 1-3 个付费客户或意向金",
        "上线 Landing Page、案例库、线索收集表",
        "建立服务商白名单，明确佣金和交付标准"
      ],
      month3: [
        "将高频交付模块做成 AI 工作流",
        "形成 2 个可公开案例和 1 个行业报告",
        "推出 Pro 订阅和服务商市场",
        "把获客渠道从创始人销售扩展到内容与搜索"
      ]
    },
    website: {
      structure: ["首页输入创业画像", "AI 方案工作台", "商业模式画布", "MVP 路线图", "服务商市场", "计划书导出"],
      pages: ["Dashboard", "Idea Fit", "Business Canvas", "MVP Plan", "Acquisition", "Marketplace", "Deck Builder"],
      features: ["画像表单", "AI 方向推荐", "项目选择", "方案版本管理", "服务商匹配", "PPT/PDF 导出", "订阅付费"],
      stack: ["Next.js", "React", "TypeScript", "TailwindCSS", "Supabase", "Clerk", "Stripe", "OpenAI API"]
    },
    acquisition: {
      小红书: ["发布创业诊断案例", "用预算/城市/技能做标题", "引导私信领取方案"],
      抖音: ["拍 30 秒创业方向拆解", "展示 AI 生成路线图", "直播做免费诊断"],
      微信: ["建立创始人顾问号", "社群内每周拆 3 个项目", "成交低价诊断包"],
      B站: ["发布长视频复盘", "讲清楚市场、成本和现金流", "沉淀信任"],
      SEO: ["建设行业创业方案页", "覆盖城市 + 行业 + 预算关键词", "用工具页获取自然流量"],
      Google: ["投放英文出海服务关键词", "用行业落地页接流量", "对高意向线索做再营销"]
    },
    deck: [
      "封面：Aureon Agent 生成的创业方案",
      "问题：用户不知道如何从想法走到收入",
      "解决方案：AI Startup OS",
      "目标客户与市场",
      "商业模式与收费",
      "MVP 路线图",
      "获客渠道与增长实验",
      "财务预算与现金流",
      "服务商市场与佣金模型",
      "下一步：30 天首单计划"
    ],
    brokers: [
      {
        category: "网站开发",
        provider: "LaunchStack Studio",
        reason: "适合快速交付 Next.js Landing Page 和轻量 Dashboard。",
        price: "8,000-25,000 元"
      },
      {
        category: "商标代理",
        provider: "BrandGuard IP",
        reason: "可处理国内商标检索、注册和基础出海品牌保护。",
        price: "900-3,500 元"
      },
      {
        category: "会计",
        provider: "LeanBooks",
        reason: "适合早期公司记账、税务和现金流报表。",
        price: "600-2,000 元/月"
      },
      {
        category: "营销推广",
        provider: "SignalGrowth",
        reason: "擅长小红书、抖音和 B2B 搜索获客组合实验。",
        price: "6,000-18,000 元/月"
      }
    ]
  };
}
