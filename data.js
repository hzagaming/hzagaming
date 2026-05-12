(function () {
  window.PORTFOLIO_DATA = {
    site: {
      title: "HZA Portfolio",
      brand: "HZA Gaming",
      version: "0.2.1",
      person: "Charlie Zhong",
      lead: "Unity / Unreal Developer · 3D Artist · Web Developer",
      tagline:
        "Founder of Hanazar Software · Middle School Student · Open Source Developer · AI | Game Design",
      summary:
        "我是 Charlie Zhong，目前以 Unity / Unreal、3D 场景、Web 与开源创作为主，这个网站先作为我的个人介绍和作品文章档案。",
      focus:
        "我主要围绕游戏开发、3D 场景、网页与工具搭建持续创作，也会把数字生命、世界构建和流程设计放进同一个作品档案里。",
      profile: [
        "Unity / Unreal Developer",
        "3D Artist",
        "Web Developer",
        "Founder of Hanazar Software",
        "Middle School Student",
        "Open Source Developer",
        "AI | Game Design",
      ],
    },
    changelog: [
      {
        version: "0.2.2",
        date: "2025-05-12",
        title: "UI/UX/SFX/BGM 全面打磨与深度修复",
        items: [
          "修复 BGM LFO 频率调制严重错误（从 osc.frequency 改为 osc.detune）",
          "修复 BGM 绕过 master volume 的问题，音量控制现在全局生效",
          "修复 hover 音效在卡片与内部链接上的双重触发问题",
          "修复 text-gradient 在旧浏览器上的透明文字回退",
          "修复 :focus-visible 全局 border-radius 影响所有元素的问题",
          "修复 Escape 快捷键在输入框中的误触发（添加输入框保护）",
          "修复 reveal 延迟过长无上限的问题（现上限 600ms）",
          "修复滚动进度条 CSS transition 与 JS rAF 的冲突",
          "修复 page-loader 在 JS 加载失败时可能永远挂起的问题（添加 8 秒超时回退）",
          "修复分类页无参数时静默回退到第一个分类的问题（现显示空状态）",
          "修复 BGM 多标签页叠加播放问题（BroadcastChannel + localStorage 协调）",
          "修复键盘用户无法初始化音频的问题（添加 keydown 监听）",
          "修复 featured 精选卡片中不存在的项目留下空白的问题",
          "修复移动端 hero 按钮与卡片内部 chip-link 同时被设为 100% 宽度的问题",
          "修复 Firefox 滚动条样式范围过广的问题（从 * 移到 html）",
          "添加 Visibility API 支持（切标签自动暂停/恢复音频）",
          "添加 hover 音效 60ms 节流，防止鼠标快速划过时的连发音效",
          "添加 reduced-motion 实时监听（用户中途切换系统设置时即时响应）",
          "添加音频偏好 localStorage 持久化（刷新后自动恢复）",
          "添加版本公告面板（首页显示当前公告 + 可展开的历史公告）",
        ],
      },
      {
        version: "0.2.1",
        date: "2025-05-12",
        title: "UI/UX/SFX/BGM 打磨与性能修复",
        items: [
          "修复音效叠加播放 Bug（Set 去重 + 精简选择器）",
          "修复空「更多同分类文章」区块的显示问题",
          "滚动事件 requestAnimationFrame 节流",
          "音频偏好 localStorage 持久化",
          "Firefox 滚动条样式支持",
        ],
      },
      {
        version: "0.2.0",
        date: "2025-05-12",
        title: "UI/UX/SFX/BGM 全面升级",
        items: [
          "黑白首页重构、个人介绍前置",
          "整体留白拉开与渐显动画",
          "Web Audio API 交互音效系统",
          "Web Audio API 氛围背景音乐",
          "Bug 修复与无障碍优化",
        ],
      },
    ],
    featured: [
      { category: "blender", project: "lost-wasteland-city" },
      { category: "blender", project: "lcc-virtual-expo" },
      { category: "ue", project: "live3d-digital-life" },
      { category: "unity", project: "maze-identity" },
      { category: "code", project: "paper2gal-enterprise" },
    ],
    categories: [
      {
        slug: "blender",
        name: "Blender",
        kicker: "Scene Design / Atmosphere / Animation",
        accent: "#ff8a5b",
        accentSoft: "#ffd166",
        intro:
          "以场景叙事、空间氛围和视觉实验为核心，覆盖白膜、会展、地图、界面模拟与 MMD 动画。",
        overview:
          "这里是视觉世界观的核心区，重点放在环境设计、结构节奏、镜头感与空间氛围的建立。",
        groups: [
          {
            title: "场景与空间",
            intro: "环境搭建、世界观探索与空间感实验。",
            items: [
              {
                slug: "lost-wasteland-city",
                title: "迷失-废土城市白膜场景",
                status: "已完成",
                subtitle: "废土城市空间与体块关系探索。",
                summary:
                  "以白膜阶段先建立大尺度城市废墟结构，强调路径、视线和压迫感。",
                overview:
                  "这个项目更偏向世界观草图，重点不是最终材质，而是先把城市的残破体块、街区分布和玩家视线组织出来。",
                tags: ["白膜场景", "废土氛围", "城市体块"],
                highlights: [
                  "先用大块体量搭建废土城市骨架。",
                  "强调远近景关系与视线引导。",
                  "适合后续继续补材质、灯光和故事细节。",
                ],
                placeholders: ["主视觉海报", "街区视角", "高处总览"],
              },
              {
                slug: "smrt-subway",
                title: "SMRT地铁",
                status: "开发中",
                subtitle: "城市轨道交通空间的建模与氛围搭建。",
                summary:
                  "围绕地铁站台、列车与动线展开，偏向现代都市基础设施表达。",
                overview:
                  "目前处于开发阶段，重点会放在站台结构、灯光秩序与交通空间的节奏感上。",
                tags: ["交通空间", "现代场景", "开发中"],
                highlights: [
                  "聚焦地铁站台与轨道交通空间。",
                  "适合展示工业秩序与城市通勤气质。",
                  "后续可补列车细节与人流氛围。",
                ],
                placeholders: ["站台主视图", "车厢或轨道细节", "灯光氛围图"],
              },
              {
                slug: "torii-project",
                title: "Blender鸟居项目",
                status: "已完成",
                subtitle: "围绕鸟居意象进行的场景氛围实验。",
                summary:
                  "通过鸟居、路径与环境构图，尝试营造具有仪式感的空间入口。",
                overview:
                  "项目偏小而精，核心是利用鸟居与环境构图制造一个有方向感、有情绪锚点的画面。",
                tags: ["鸟居", "氛围场景", "构图实验"],
                highlights: [
                  "使用鸟居作为视觉中心。",
                  "强调路径、留白和环境节奏。",
                  "适合衔接后续 UE 场景延展。",
                ],
                placeholders: ["鸟居正面图", "环境氛围图", "构图近景"],
              },
              {
                slug: "wumeng-city",
                title: "乌蒙城",
                status: "已完成",
                subtitle: "偏世界观向的城市与建筑形态设计。",
                summary:
                  "尝试构建具有独特地形和文化气质的城市场景概念。",
                overview:
                  "这个项目更偏概念世界观与场景方向，适合后续补更多建筑模块和地区分区设定。",
                tags: ["城市设计", "世界观", "建筑形态"],
                highlights: [
                  "关注整体城市场景轮廓。",
                  "具备继续延展区域设定的空间。",
                  "适合放地图、分区图和概念草图。",
                ],
                placeholders: ["城市远景", "区域局部", "设定图占位"],
              },
              {
                slug: "lcc-virtual-expo",
                title: "LCC落川虚拟会展中心",
                status: "已完成",
                subtitle: "虚拟展厅空间与展示动线设计。",
                summary:
                  "围绕会展中心的浏览体验，组织展示区域、入口节奏与空间导览。",
                overview:
                  "项目适合展示你在空间叙事和虚拟展陈方面的思考，后续也很适合补交互导览图。",
                tags: ["虚拟会展", "展厅设计", "空间导览"],
                highlights: [
                  "强调入口、展区与动线组织。",
                  "兼具空间展示与内容承载能力。",
                  "适合继续追加品牌或展品页面。",
                ],
                placeholders: ["会展中心总览", "展区透视", "导览图占位"],
              },
              {
                slug: "hanazar-map-1-6",
                title: "Hanazar Map1-6",
                status: "已完成",
                subtitle: "一组连续地图式场景内容探索。",
                summary:
                  "将多个区域作为系列地图统一规划，形成连续的视觉与玩法想象。",
                overview:
                  "更适合作为系列工程展示，重点能放在不同地图的气质差异与整体世界观连贯性上。",
                tags: ["系列地图", "区域规划", "世界构建"],
                highlights: [
                  "Map1-6 形成系列化表达。",
                  "适合用时间线或章节方式继续扩展。",
                  "可补每张地图对应主题和亮点。",
                ],
                placeholders: ["地图总览", "代表性地图画面", "系列关系图"],
              },
              {
                slug: "complexity-maze-scene",
                title: "Complexity迷宫场景",
                status: "开发中",
                subtitle: "以迷宫结构和复杂空间感为核心的场景项目。",
                summary:
                  "关注重复、转折与困惑感，强调结构复杂度带来的探索体验。",
                overview:
                  "这个项目和 Unity 方向的 Maze 系列呼应明显，未来可以作为视觉场景与玩法原型联动展示。",
                tags: ["迷宫", "复杂结构", "开发中"],
                highlights: [
                  "空间复杂度是项目重点。",
                  "适合展示模块化结构与视线迷惑。",
                  "未来可联动 Unity 项目做前后对照。",
                ],
                placeholders: ["迷宫鸟瞰", "路径细节", "结构拆解图"],
              },
              {
                slug: "arcaea-ui-mockup",
                title: "Arcaea游戏界面模拟",
                status: "已完成",
                subtitle: "音乐游戏界面语言的视觉模拟实验。",
                summary:
                  "尝试用 Blender 或相关流程还原游戏界面质感与信息排布节奏。",
                overview:
                  "这个项目在作品集里会很适合作为“界面与视觉模拟”类型的小亮点，与纯场景类拉开层次。",
                tags: ["界面模拟", "视觉设计", "游戏UI"],
                highlights: [
                  "以界面质感和排版秩序为重点。",
                  "适合作为视觉风格实验作品。",
                  "后续可加入动效或对比图。",
                ],
                placeholders: ["界面全图", "局部细节", "动效说明位"],
              },
              {
                slug: "tianxing-scene",
                title: "天星场景",
                status: "建设中",
                subtitle: "偏幻想与星象意向的场景构筑。",
                summary:
                  "围绕星空、能量感与空间层次进行中的视觉场景工程。",
                overview:
                  "目前还在建设中，未来可以往更强的灯光表现和奇幻氛围方向继续推。",
                tags: ["幻想场景", "星象氛围", "建设中"],
                highlights: [
                  "主题集中在星象与幻想感。",
                  "适合强化灯光和粒子效果表现。",
                  "可作为未来首页主视觉候选。",
                ],
                placeholders: ["主场景概念图", "灯光氛围图", "细节区域图"],
              },
            ],
          },
          {
            title: "MMD 动画",
            intro: "单独归类的 MMD 系列内容。",
            items: [
              {
                slug: "mmd-collection",
                title: "MMD：15个项目 / 动画",
                status: "系列作品",
                subtitle: "多支 MMD 项目与动画实践的集合展示。",
                summary:
                  "作为独立分组呈现，方便之后继续逐个拆分角色、动作、镜头与风格。",
                overview:
                  "这里先用集合页承接整体规模，后面如果你愿意，也可以把 15 个项目继续拆成单独详情页。",
                tags: ["MMD", "动画", "系列集合"],
                highlights: [
                  "当前先以系列集合形式呈现。",
                  "可后续补角色、镜头与代表性作品截图。",
                  "适合做成时间线或精选集合页。",
                ],
                placeholders: ["合集封面", "代表动画截图", "角色展示位"],
              },
            ],
          },
        ],
      },
      {
        slug: "fusion360",
        name: "Fusion360",
        kicker: "Product / Structure / Industrial Form",
        accent: "#59d6be",
        accentSoft: "#b8ffda",
        intro:
          "偏向产品结构与工业设计表达，先从功能原型与框架方案展开。",
        overview:
          "这一类项目重点不是宏大场景，而是结构逻辑、功能姿态与物件本身的设计思维。",
        groups: [
          {
            title: "产品与结构设计",
            intro: "产品原型、装置概念和机械结构框架。",
            items: [
              {
                slug: "natural-energy-lamp",
                title: "自然节能灯",
                status: "概念原型",
                subtitle: "强调自然感与节能方向的产品设计尝试。",
                summary:
                  "从造型与功能平衡出发，探索更柔和、更贴近日常环境的照明产品。",
                overview:
                  "这个项目适合作为产品设计方向的代表作，后续可继续补结构爆炸图和使用场景。",
                tags: ["产品设计", "节能灯", "概念原型"],
                highlights: [
                  "关注自然感与节能主题结合。",
                  "适合补充结构、材质与场景应用。",
                  "能体现产品方向的设计思考。",
                ],
                placeholders: ["产品主渲染图", "结构分解图", "使用场景图"],
              },
              {
                slug: "companion-robot-frame",
                title: "陪伴机器人框架",
                status: "原型设计",
                subtitle: "围绕陪伴型机器人的结构骨架与功能承载设计。",
                summary:
                  "先搭出机器人框架层，关注姿态、稳定性和后续功能模块的容纳。",
                overview:
                  "这个项目很适合未来继续往角色化、产品化和智能交互设备方向深化。",
                tags: ["机器人", "结构框架", "原型设计"],
                highlights: [
                  "以框架和结构逻辑为当前重点。",
                  "便于后续接入外壳、交互模块与功能设定。",
                  "适合加入多视图和模块示意。",
                ],
                placeholders: ["机器人主视图", "结构框架图", "模块规划图"],
              },
            ],
          },
        ],
      },
      {
        slug: "ue",
        name: "UE",
        kicker: "Realtime / Worldbuilding / Digital Being",
        accent: "#6dd3ff",
        accentSoft: "#d2f6ff",
        intro:
          "在实时渲染环境中延续空间氛围与数字生命方向，偏向沉浸式场景和角色存在感。",
        overview:
          "UE 分类会更强调实时效果、沉浸感、镜头语言与未来可扩展的交互表现。",
        groups: [
          {
            title: "实时场景与数字生命",
            intro: "实时引擎中的环境氛围搭建与生命表达。",
            items: [
              {
                slug: "hidden-utopia-torii",
                title: "世外桃源鸟居场景",
                status: "制作中",
                subtitle: "在 UE 中延展鸟居主题的实时场景项目。",
                summary:
                  "延续 Blender 鸟居方向，把静态概念转成更有沉浸感的实时空间。",
                overview:
                  "这里很适合未来加入体积光、动态环境和镜头漫游展示，让作品更完整。",
                tags: ["UE场景", "鸟居", "制作中"],
                highlights: [
                  "承接 Blender 鸟居项目的空间语义。",
                  "重点会落在实时光影和氛围表达。",
                  "适合做视频漫游与镜头片段。",
                ],
                placeholders: ["实时主视图", "灯光氛围图", "路径镜头图"],
              },
              {
                slug: "live3d-digital-life",
                title: "Live3d数字生命",
                status: "制作中",
                subtitle: "偏向数字角色存在感与实时呈现的实验项目。",
                summary:
                  "围绕“数字生命”概念，尝试角色表现、空间承载与实时呈现的结合。",
                overview:
                  "这是很有个人特色的一类项目，后面补角色表现图、系统界面或交互设定会很加分。",
                tags: ["数字生命", "实时角色", "制作中"],
                highlights: [
                  "主题集中在数字生命表达。",
                  "适合补角色设定、界面与互动构想。",
                  "可作为后续网站重点作品之一。",
                ],
                placeholders: ["角色主视觉", "场景互动图", "系统界面占位"],
              },
            ],
          },
        ],
      },
      {
        slug: "unity",
        name: "Unity",
        kicker: "Gameplay / Prototype / Experimental Maze",
        accent: "#ffd166",
        accentSoft: "#fff0b5",
        intro:
          "聚焦玩法原型与迷宫系列项目，把场景逻辑转成可游玩的结构实验。",
        overview:
          "这一类更强调关卡感、机制原型与玩法测试，是视觉世界观向游戏体验延伸的部分。",
        groups: [
          {
            title: "游戏原型",
            intro: "以 Maze 系列为主的玩法与结构实验。",
            items: [
              {
                slug: "maze-identity",
                title: "Maze：Identity",
                status: "原型展示",
                subtitle: "围绕身份感、空间感与迷宫体验的 Unity 项目。",
                summary:
                  "偏原型向的迷宫游戏实验，强调探索氛围和空间认知带来的体验。",
                overview:
                  "项目很适合补机制说明、关卡截图和玩家流程图，能更完整地体现游戏设计部分。",
                tags: ["Unity", "迷宫", "游戏原型"],
                highlights: [
                  "以迷宫探索体验为主轴。",
                  "适合继续补机制设计和关卡图。",
                  "能和 Blender / Complexity 项目做呼应。",
                ],
                placeholders: ["游戏主界面", "关卡截图", "玩法说明图"],
              },
              {
                slug: "maze-complexity",
                title: "Maze：complexity",
                status: "开发中",
                subtitle: "延续 Maze 系列的复杂空间与玩法实验。",
                summary:
                  "更强调复杂结构、路径干扰与体验密度，仍处于持续开发中。",
                overview:
                  "这个项目后面可以重点补玩法循环、地图分层和挑战节奏说明，会很适合作为开发中案例。",
                tags: ["Unity", "复杂迷宫", "开发中"],
                highlights: [
                  "强化复杂结构下的探索感。",
                  "适合加入地图逻辑和玩法循环图。",
                  "与 Blender 场景开发形成双向支撑。",
                ],
                placeholders: ["迷宫整体图", "玩法界面图", "关卡逻辑图"],
              },
            ],
          },
        ],
      },
      {
        slug: "code",
        name: "Code",
        kicker: "Tools / Workflow / Playable Systems",
        accent: "#ff6b8f",
        accentSoft: "#ffc0d0",
        intro:
          "代码类项目偏向创作工具、站点、游戏实验与角色相关流程系统。",
        overview:
          "这个分类能把你的“世界搭建能力”延伸到真正可运行的产品与工作流，是作品集里非常关键的一块。",
        groups: [
          {
            title: "Paper2gal 系列",
            intro: "围绕 Paper2gal 的产品化与生态扩展。",
            items: [
              {
                slug: "paper2gal",
                title: "Paper2gal",
                status: "已上线原型",
                subtitle: "基础版 Paper2gal 项目。",
                summary:
                  "聚焦核心功能，把纸面内容或资料转成更适合可视化与使用的形态。",
                overview:
                  "适合作为系列的起点页，后续可以在详情页补功能截图、流程图和版本演进。",
                tags: ["工具开发", "Paper2gal", "产品雏形"],
                highlights: [
                  "Paper2gal 系列的基础版本。",
                  "适合补核心流程与功能亮点。",
                  "能引出企业版和连接站点。",
                ],
                placeholders: ["首页截图", "功能流程图", "界面细节图"],
              },
              {
                slug: "paper2gal-enterprise",
                title: "Paper2gal企业版",
                status: "扩展版本",
                subtitle: "面向更完整使用场景的企业化版本探索。",
                summary:
                  "相比基础版，更强调稳定性、协作逻辑或面向组织使用的功能可能性。",
                overview:
                  "这个项目未来很适合放在代码类首页重点位置，因为它天然带有“产品升级”叙事。",
                tags: ["企业版", "产品扩展", "工具系统"],
                highlights: [
                  "从单体工具往更完整产品升级。",
                  "适合补企业使用场景与结构图。",
                  "能体现系统设计和产品思考。",
                ],
                placeholders: ["企业版主界面", "模块结构图", "功能对比图"],
              },
              {
                slug: "paper2gal-connect-site",
                title: "Paper2gal连接站点",
                status: "站点延展",
                subtitle: "为 Paper2gal 生态服务的连接型站点。",
                summary:
                  "承担产品之间、用户之间或内容之间的连接功能，偏生态补全方向。",
                overview:
                  "它很适合作为站点型项目展示，后续可以放流程示意、信息架构和页面截图。",
                tags: ["连接站点", "生态延展", "Web产品"],
                highlights: [
                  "偏向站点与生态链接能力。",
                  "适合补 IA、导航与页面流程图。",
                  "可作为系列的一环展示整体布局。",
                ],
                placeholders: ["站点首页图", "信息架构图", "页面流程图"],
              },
            ],
          },
          {
            title: "游戏与站点实验",
            intro: "轻量游戏原型与网站项目。",
            items: [
              {
                slug: "3d-2048",
                title: "3D-2048",
                status: "实验项目",
                subtitle: "将 2048 玩法转向 3D 表现的代码实验。",
                summary:
                  "关注规则保留与空间表现之间的转化，适合作为创意玩法小项目。",
                overview:
                  "项目体量不一定最大，但很适合体现你在玩法转译和快速实现上的能力。",
                tags: ["游戏实验", "3D", "玩法转译"],
                highlights: [
                  "经典玩法的三维化尝试。",
                  "适合补操作界面与玩法展示。",
                  "能作为小而亮的创意项目。",
                ],
                placeholders: ["游戏画面", "交互界面", "玩法示意图"],
              },
              {
                slug: "hanazargamesweb",
                title: "Hanazargamesweb",
                status: "站点项目",
                subtitle: "围绕 Hanazar Games 的网页展示工程。",
                summary:
                  "作为品牌或作品承载站点，适合展示前端实现与信息组织能力。",
                overview:
                  "这个项目未来很适合补前端页面截图、动效说明与导航结构。",
                tags: ["网站开发", "品牌站", "前端实现"],
                highlights: [
                  "承载品牌与内容的站点工程。",
                  "适合展示前端排版和动效能力。",
                  "可与现在这个作品集网站形成呼应。",
                ],
                placeholders: ["站点首页截图", "页面布局图", "交互说明图"],
              },
            ],
          },
          {
            title: "创作工具与工作流",
            intro: "帮助角色、素材和数字生命相关创作更顺畅的工具类项目。",
            items: [
              {
                slug: "character-assets-workflow",
                title: "角色图片素材集成工作流",
                status: "工作流设计",
                subtitle: "用于整合角色图片素材的流程系统。",
                summary:
                  "偏向效率与规范化，帮助角色素材在不同阶段更顺畅地整合和使用。",
                overview:
                  "这个项目很适合画成流程图，未来只要把节点和输入输出补完整，就会非常清晰。",
                tags: ["工作流", "素材管理", "角色创作"],
                highlights: [
                  "强调素材集成与流程效率。",
                  "适合用图表展示节点与输入输出。",
                  "能体现方法论和工具思维。",
                ],
                placeholders: ["流程总图", "节点说明图", "工具界面图"],
              },
              {
                slug: "oc-character-tool",
                title: "OC角色制作工具",
                status: "制作中",
                subtitle: "服务于 OC 角色创建与管理的工具项目。",
                summary:
                  "关注角色资料生成、整理或编辑流程，目前仍在持续制作中。",
                overview:
                  "很适合做成工具产品页，未来加入角色面板、编辑流程与导出逻辑会更完整。",
                tags: ["角色工具", "OC", "制作中"],
                highlights: [
                  "聚焦 OC 角色创作流程。",
                  "适合补角色卡、编辑器与导出说明。",
                  "可和角色素材工作流形成工具组合。",
                ],
                placeholders: ["工具主界面", "角色编辑图", "功能流程图"],
              },
              {
                slug: "digisoul-chatbot",
                title: "Digisoul-2d数字聊天机器人",
                status: "概念与实现",
                subtitle: "围绕 2D 数字角色与对话体验的聊天机器人项目。",
                summary:
                  "把数字生命方向延伸到聊天与交互层，适合作为世界观和工具之间的桥梁项目。",
                overview:
                  "这是一个非常能代表你个人兴趣方向的项目，后续加上界面图、角色立绘和对话流程会很出彩。",
                tags: ["聊天机器人", "数字生命", "2D角色"],
                highlights: [
                  "结合数字角色与对话系统。",
                  "适合展示 UI、角色与交互逻辑。",
                  "可与 UE 的 Live3d 数字生命互相呼应。",
                ],
                placeholders: ["聊天界面图", "角色展示图", "对话流程图"],
              },
            ],
          },
        ],
      },
    ],
  };
})();
