import type { SiteContent } from './types'

export const siteContent: SiteContent = {
  name: 'Milo',
  initials: 'ML',
  avatar: '/portrait.png',
  role: {
    zh: '软件开发工程师',
    en: 'Software Development Engineer',
  },
  headline: {
    zh: '把复杂想法做成可靠、能用的产品。',
    en: 'I turn complex ideas into reliable, usable products.',
  },
  intro: {
    zh: '连接模型、系统与真实用户。',
    en: 'I connect models, systems, and real users.',
  },
  github: 'https://github.com/Minglu-Li',
  resumes: {},
  projects: [
    {
      id: 'deckdom',
      compact: true,
      title: { zh: 'DeckDOM', en: 'DeckDOM' },
      summary: { zh: 'DeckDOM 项目', en: 'DeckDOM project' },
      problem: { zh: '项目介绍待补充', en: 'Project details coming soon' },
      contribution: { zh: '项目介绍待补充', en: 'Project details coming soon' },
      result: { zh: '项目介绍待补充', en: 'Project details coming soon' },
      technologies: [],
      repository: 'https://github.com/Minglu-Li/DeckDOM',
      image: '/projects/deckdom.png',
    },
  ],
  posts: [],
  interests: [],
  experiences: [
    {
      id: 'bosch-digital-manufacturing',
      company: { zh: '博世', en: 'Bosch' },
      role: {
        zh: '数字制造与智能化战略实习生',
        en: 'Digital Manufacturing & Intelligent Strategy Intern',
      },
      period: { zh: '2026.06 – 2026.09', en: 'Jun 2026 – Sep 2026' },
      summary: {
        zh: '试制订单全生命周期管理系统｜独立全栈开发',
        en: 'Prototype Order Lifecycle Management System | Sole Full-stack Developer',
      },
      technologies: [
        'Java 8',
        'Spring Boot 2.7',
        'Spring Security',
        'MyBatis-Plus',
        'MySQL',
        'Redis',
        'Apache POI',
        'Vue 3',
        'TypeScript',
        'Pinia',
        'Vite',
        'OAuth 2.0/OIDC',
        'SMTP',
        'Nginx',
        'Linux',
        'systemd',
        'Python',
      ],
      achievements: [
        {
          zh: '面向样品车间纸质及 Excel 单据分散、跟单员难以快速检索订单的问题，独立完成需求调研、业务建模、UI 设计、前后端开发、功能验证及生产部署，从零交付 TO 管理系统，支持四类产品的本车间生产和跨产线委托流程。',
          en: 'Addressed fragmented paper and Excel records and slow order lookup in the prototype workshop by independently completing requirements discovery, domain modeling, UI design, full-stack development, functional validation, and production deployment. Delivered the TO management system from scratch, supporting in-workshop production and cross-line commissioning for four product categories.',
        },
        {
          zh: '使用 Apache POI 实现 Excel 预览、在线编辑、格式校验、确认建单及直接批量导入；构建 TO 列表、组合搜索筛选、分页、详情、修改历史及 Excel 导出功能，并提供报表统计、图片导出和管理员仪表盘。',
          en: 'Used Apache POI to implement Excel preview, inline editing, format validation, order confirmation, and direct bulk import; built TO lists, compound search and filters, pagination, details, change history, and Excel export, together with reporting, image export, and an administrator dashboard.',
        },
        {
          zh: '构建 TO 全生命周期管理流程，支持二维码生成、下载、扫码及手工查询，通过扫码推进生产状态、维护实际关闭日期并记录状态审计；支持数量、基础信息和工艺流程变更，以及变更前后截图留档。',
          en: 'Built the complete TO lifecycle workflow with QR code generation, download, scanning, and manual lookup; enabled scan-driven production status transitions, actual close-date maintenance, and status auditing, as well as quantity, base-information, and process changes with before-and-after screenshot records.',
        },
        {
          zh: '设计并实现 TO 变更审批闭环，普通用户提交修改后持久化变更字段、前后值、申请原因及工艺截图，生成状态记录并通过 SMTP 通知审批人；审批通过后回写 TO 数据并生成字段级审计日志，用户可查询个人申请进度、审批意见和历史记录。',
          en: 'Designed and implemented a closed-loop TO change approval workflow that persisted changed fields, before-and-after values, request reasons, and process screenshots, generated status records, and notified approvers through SMTP. Approved changes were written back to TO data with field-level audit logs, while users could review request progress, approval comments, and history.',
        },
        {
          zh: '基于 Spring Scheduling 和数据库唯一约束实现计划完成日期的分阶段邮件提醒与幂等控制；实现审批角标、员工角色管理、批量状态操作及管理员删除等后台管理能力。',
          en: 'Implemented staged email reminders for planned completion dates with Spring Scheduling and database unique constraints for idempotency; added approval badges, employee role management, bulk status operations, administrator deletion, and other back-office capabilities.',
        },
        {
          zh: '采用 Spring Security OAuth 2.0 Authorization Code 进行服务端认证，通过 Microsoft JWKS 完成 ID Token 签名、关键声明及密钥轮换校验；使用 Redis Session 和服务端 RBAC 构建统一认证授权体系。',
          en: 'Implemented server-side authentication with the Spring Security OAuth 2.0 Authorization Code flow; validated ID Token signatures, critical claims, and key rotation through Microsoft JWKS; combined Redis Session and server-side RBAC into a unified authentication and authorization system.',
        },
        {
          zh: '设计 BFF 式前端权限架构，以后端返回结果和 Pinia 作为用户状态唯一来源，通过异步路由守卫、角色化菜单和按钮控制同步权限展示。',
          en: 'Designed a BFF-style frontend authorization architecture using backend responses and Pinia as the single source of truth for user state, with asynchronous route guards, role-based menus, and button-level controls keeping the interface aligned with permissions.',
        },
        {
          zh: '使用 Vite/npm 构建 Vue SPA 并由 Nginx 托管，通过 Maven 构建后端 JAR、systemd 管理 Linux 服务，并协同工厂运维完成 HTTPS 证书申请与更新；系统覆盖 42 名用户，上线约两个月累计管理 300+ 条 TO 单且无重大业务故障。',
          en: 'Built the Vue SPA with Vite/npm and served it through Nginx; packaged the backend JAR with Maven, managed the Linux service with systemd, and coordinated HTTPS certificate issuance and renewal with plant operations. The system served 42 users and managed 300+ TOs in roughly two months in production with no major business incidents.',
        },
        {
          zh: '深入梳理样品车间多层物料管理业务，将 BOM 展开、库存分层、缺口传递及采购/自制判定规则编码为企业 AI Skill，通过 LLM 编排与 Python 确定性计算解耦及 Windows Credential Manager 凭据隔离，降低上下文数据泄漏风险，保障结果稳定与数据安全；将约 500 项物料的处理时间从平均 30 分钟缩短至平均 5 分钟内，服务约 10 名工程师。',
          en: 'Built an Agent system for the parameter team by modeling multi-level material management in the prototype workshop and encoding BOM explosion, inventory layering, shortage propagation, and buy-or-make rules as enterprise AI Skills. Decoupled LLM orchestration from deterministic Python computation and isolated credentials with Windows Credential Manager, reducing processing time for about 500 material items from an average of 30 minutes to under 5 minutes while serving about 10 engineers.',
        },
      ],
      logo: '/logos/companies/Bosch-logo.svg',
    },
    {
      id: 'digiwin-ai-application-development',
      company: { zh: '鼎捷数智', en: 'Digiwin' },
      role: {
        zh: 'AI 应用开发实习生',
        en: 'AI Application Development Intern',
      },
      period: { zh: '2025.09 – 2026.05', en: 'Sep 2025 – May 2026' },
      summary: {
        zh: '参与企业人才能力评估、任务拆解与人员推荐后端服务开发，将非结构化的任务信息与人才信息转化为可评估、可召回、可排序、可追踪的画像标签。负责 Agent 工作流设计、评估推荐接口、检索召回、异步写入与可观测能力建设。',
        en: 'Contributed to backend services for enterprise talent competency assessment, task decomposition, and personnel recommendation, transforming unstructured task and talent information into profile tags that could be evaluated, retrieved, ranked, and traced. Designed Agent workflows and built assessment and recommendation APIs, retrieval pipelines, asynchronous persistence, and observability capabilities.',
      },
      technologies: [
        'Python',
        'FastAPI',
        'LangChain',
        'LangGraph',
        'MySQL',
        'Chroma',
      ],
      achievements: [
        {
          zh: '负责能力评估、任务拆解和人员推荐三个核心业务接口开发，基于 FastAPI 统一请求参数、任务状态和响应 Schema，支持前端在多轮交互中补充任务信息并获取匹配理由与推荐结果。',
          en: 'Developed three core APIs for competency assessment, task decomposition, and personnel recommendation. Standardized request parameters, task states, and response schemas with FastAPI, enabling the frontend to supplement task information across multi-turn interactions and retrieve matching rationales and recommendations.',
        },
        {
          zh: '针对能力评估与任务拆解链路中的人才信息和任务信息画像标签匹配，引入 BM25 与向量检索结合的粗召回，使用 LLM 进行精细检索，并以规则校验约束 LLM 理由输出，将标签识别 F1-score 从 73% 提升至 92%。',
          en: 'Combined BM25 and vector search for coarse recall in profile-tag matching across competency assessment and task decomposition, then used an LLM for fine-grained retrieval with rule-based validation constraining its rationale output, improving the tag-identification F1 score from 73% to 92%.',
        },
        {
          zh: '针对人员推荐中向量检索排序“相关但不精确”的问题，在召回结果上引入 Re-Rank 精排，为任务发布人提供更匹配的人才推荐，使 Top-3 接受率达到 90%。',
          en: 'Added a Re-Rank stage on top of vector-retrieved candidates to address results that were relevant but insufficiently precise, providing task owners with better-matched talent recommendations and raising the Top-3 acceptance rate to 90%.',
        },
        {
          zh: '针对能力评估耗时较长的问题，将人才优势、个人情况总结、工作偏好和用户画像分析等独立节点并发执行，减少串行处理造成的接口阻塞，使单次平均评估耗时从 30 秒降低至 15 秒。',
          en: 'Parallelized independent nodes for talent strengths, personal summaries, work preferences, and user-profile analysis to reduce serial request blocking, cutting average evaluation latency from 30 seconds to 15 seconds.',
        },
        {
          zh: '设计日志追踪机制，基于 LangChain Callback 统计各节点耗时与 Token 消耗，支持快速定位工作流瓶颈与异常。',
          en: 'Designed a logging and tracing mechanism using LangChain callbacks to measure per-node latency and token consumption, enabling rapid diagnosis of workflow bottlenecks and failures.',
        },
        {
          zh: '将评估结果与推荐结果的入库操作移出请求主链路，使用线程池异步处理持久化任务，减少接口响应阻塞。',
          en: 'Removed assessment and recommendation persistence from the main request path and processed database writes asynchronously with a thread pool, reducing API response blocking.',
        },
      ],
      logo: '/logos/companies/digiwin.svg',
    },
  ],
  capabilities: [
    {
      id: 'agent-systems',
      title: { zh: 'Agent 系统', en: 'Agent Systems' },
      description: {
        zh: '构建由模型、工具和流程协作的智能系统。',
        en: 'Building intelligent systems where models, tools, and workflows work together.',
      },
      items: [
        { zh: 'AI Agent', en: 'AI Agent' },
        { zh: 'LLM', en: 'LLM' },
        { zh: 'NLP', en: 'NLP' },
        { zh: '强化学习', en: 'Reinforcement Learning' },
      ],
    },
    {
      id: 'full-stack-delivery',
      title: { zh: '全栈交付', en: 'Full-stack Delivery' },
      description: {
        zh: '从服务端到界面和部署，完成可维护的产品交付。',
        en: 'Delivering maintainable products from backend services to interfaces and deployment.',
      },
      items: [
        { zh: 'Java', en: 'Java' },
        { zh: 'Spring', en: 'Spring' },
        { zh: 'TypeScript', en: 'TypeScript' },
        { zh: 'Python', en: 'Python' },
        { zh: '数据库', en: 'Databases' },
        { zh: '云部署', en: 'Cloud Deployment' },
      ],
    },
    {
      id: 'applied-ai-domain',
      title: { zh: '应用 AI 与领域', en: 'Applied AI & Domain' },
      description: {
        zh: '把 AI 方法应用到复杂的行业问题中。',
        en: 'Applying AI methods to complex domain problems.',
      },
      items: [
        { zh: '图神经网络', en: 'Graph Neural Networks' },
        { zh: '电力系统', en: 'Power Systems' },
        { zh: '人工智能应用', en: 'AI Applications' },
      ],
    },
  ],
  buildSteps: [
    {
      id: 'idea',
      label: 'IDEA',
      description: {
        zh: '理解真实问题和使用场景。',
        en: 'Understand the real problem and its context.',
      },
    },
    {
      id: 'agent',
      label: 'AGENT',
      description: {
        zh: '设计连接模型、工具和人的智能流程。',
        en: 'Design intelligent flows that connect models, tools, and people.',
      },
    },
    {
      id: 'build',
      label: 'BUILD',
      description: {
        zh: '把想法实现为可验证的系统。',
        en: 'Build ideas into verifiable systems.',
      },
    },
    {
      id: 'ship',
      label: 'SHIP',
      description: {
        zh: '交付可靠、真正能用的产品。',
        en: 'Ship reliable products that people can use.',
      },
    },
  ],
  contactPrompt: {
    zh: '想一起把复杂问题做成可用产品？',
    en: 'Want to turn a complex problem into a usable product together?',
  },
  ui: {
    nav: {
      home: { zh: '首页', en: 'Home' },
      about: { zh: '关于', en: 'About' },
      projects: { zh: '项目', en: 'Projects' },
      experience: { zh: '实习经历', en: 'Internships' },
      notes: { zh: '笔记', en: 'Notes' },
      interests: { zh: '兴趣', en: 'Life' },
      capabilities: { zh: '能力', en: 'Capabilities' },
      contact: { zh: '联系', en: 'Contact' },
    },
    sections: {
      projects: { zh: '代表项目', en: 'Selected Work' },
      experience: { zh: '实习经历', en: 'Internships' },
      notes: { zh: '笔记', en: 'Notes' },
      interests: { zh: '兴趣切片', en: 'Life Notes' },
      capabilities: { zh: '能力地图', en: 'How I Build' },
      contact: { zh: '联系', en: 'Contact' },
    },
    labels: {
      problem: { zh: '问题', en: 'Problem' },
      contribution: { zh: '贡献', en: 'Contribution' },
      result: { zh: '结果', en: 'Result' },
      repository: { zh: '仓库', en: 'Repository' },
      demo: { zh: '演示', en: 'Demo' },
      logo: { zh: '标志', en: 'logo' },
      technologies: { zh: '技术栈', en: 'Tech stack' },
    },
    actions: {
      viewProjects: { zh: '查看项目', en: 'View projects' },
      visitGitHub: { zh: '访问 GitHub', en: 'Visit GitHub' },
      viewResume: { zh: '查看简历', en: 'View resume' },
      emailMe: { zh: '给我发邮件', en: 'Email me' },
    },
    menu: { zh: '菜单', en: 'Menu' },
    language: { zh: '语言', en: 'Language' },
    skipToContent: { zh: '跳到主要内容', en: 'Skip to main content' },
  },
  seo: {
    title: { zh: 'Milo', en: 'Milo' },
    description: {
      zh: 'Milo 是一名专注 AI Agent 应用的全栈开发者，擅长把复杂想法做成可靠、能用的产品。',
      en: 'Milo is a full-stack developer focused on AI Agent applications and reliable, usable products.',
    },
    canonical: 'https://minglu-li.github.io/',
    ogImage: '/og-image.png',
  },
}
