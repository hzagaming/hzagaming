(function () {
  var data = window.PORTFOLIO_DATA;
  var site = data && data.site ? data.site : {};

  if (!data) {
    return;
  }

  function flattenProjects() {
    var entries = [];

    data.categories.forEach(function (category) {
      category.groups.forEach(function (group) {
        group.items.forEach(function (item) {
          entries.push({
            category: category,
            group: group,
            project: item,
          });
        });
      });
    });

    return entries;
  }

  function countProjects(category) {
    return category.groups.reduce(function (total, group) {
      return total + group.items.length;
    }, 0);
  }

  function findCategory(slug) {
    return data.categories.find(function (category) {
      return category.slug === slug;
    });
  }

  function findProject(categorySlug, projectSlug) {
    var category = findCategory(categorySlug);

    if (!category) {
      return null;
    }

    for (var i = 0; i < category.groups.length; i += 1) {
      var group = category.groups[i];

      for (var j = 0; j < group.items.length; j += 1) {
        var item = group.items[j];

        if (item.slug === projectSlug) {
          return {
            category: category,
            group: group,
            project: item,
          };
        }
      }
    }

    return null;
  }

  function queryValue(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  function setDocumentTitle(title) {
    document.title = title + " | HZA Portfolio v" + (site.version || "0.1.0");
  }

  function setTheme() {
    document.documentElement.style.setProperty("--accent", "#ffffff");
    document.documentElement.style.setProperty("--accent-soft", "#b8b8b8");
  }

  function setVersionBadges() {
    var badges = document.querySelectorAll('[data-role="version-badge"]');

    badges.forEach(function (badge) {
      badge.textContent = "v" + (site.version || "0.1.0");
    });
  }

  function createBadge(text, className) {
    return '<span class="' + className + '">' + text + "</span>";
  }

  function createMetricCard(value, label) {
    return (
      '<div class="metric-card panel" data-reveal>' +
      "<strong>" +
      value +
      "</strong>" +
      "<span>" +
      label +
      "</span>" +
      "</div>"
    );
  }

  function renderEmptyState(root, title, text, linkLabel, linkHref) {
    root.innerHTML =
      '<section class="panel empty-state" data-reveal>' +
      "<h1>" +
      title +
      "</h1>" +
      "<p>" +
      text +
      "</p>" +
      '<div class="hero__actions"><a class="chip-link" href="' +
      linkHref +
      '">' +
      linkLabel +
      "</a></div>" +
      "</section>";
  }

  function configureProjectBackLink(category) {
    var backLink = document.querySelector('[data-role="context-back-link"]');

    if (!backLink) {
      return;
    }

    if (category) {
      backLink.href = "category.html?category=" + category.slug;
      backLink.textContent = "返回 " + category.name;
      return;
    }

    backLink.href = "index.html";
    backLink.textContent = "返回首页";
  }

  function createProjectCard(entry) {
    var category = entry.category;
    var project = entry.project;

    return (
      '<article class="project-card panel" data-reveal>' +
      '<div class="project-card__meta">' +
      createBadge(category.name, "soft-badge") +
      createBadge(project.status, "status-badge") +
      "</div>" +
      "<h3>" +
      project.title +
      "</h3>" +
      '<p class="project-card__subtitle">' +
      project.subtitle +
      "</p>" +
      "<p>" +
      project.summary +
      "</p>" +
      '<div class="tag-list">' +
      project.tags
        .slice(0, 3)
        .map(function (tag) {
          return createBadge(tag, "tag");
        })
        .join("") +
      "</div>" +
      '<a class="text-link" href="project.html?category=' +
      category.slug +
      "&project=" +
      project.slug +
      '">阅读全文</a>' +
      "</article>"
    );
  }

  function createCategoryCard(category) {
    return (
      '<article class="software-card panel" data-reveal>' +
      '<div class="software-card__header">' +
      '<p class="software-card__kicker">SOFTWARE CATEGORY</p>' +
      createBadge(countProjects(category) + " 篇文章", "tag") +
      "</div>" +
      "<h3>" +
      category.name +
      "</h3>" +
      "<p>" +
      category.intro +
      "</p>" +
      '<div class="software-card__stats">' +
      "<span>" +
      category.groups.length +
      " 个分组</span>" +
      "<span>" +
      countProjects(category) +
      " 篇文章</span>" +
      "</div>" +
      '<a class="card-link" href="category.html?category=' +
      category.slug +
      '">进入分类</a>' +
      "</article>"
    );
  }

  function renderHome() {
    var allProjects = flattenProjects();
    var homeTitle = document.querySelector('[data-role="home-title"]');
    var homeLead = document.querySelector('[data-role="home-lead"]');
    var homeTagline = document.querySelector('[data-role="home-tagline"]');
    var homeSummary = document.querySelector('[data-role="home-summary"]');
    var profileList = document.querySelector('[data-role="profile-list"]');
    var profileFocus = document.querySelector('[data-role="profile-focus"]');
    var archiveMetrics = document.querySelector('[data-role="archive-metrics"]');
    var categoryGrid = document.querySelector('[data-role="category-grid"]');
    var featuredGrid = document.querySelector('[data-role="featured-grid"]');

    setDocumentTitle(site.title || "HZA Portfolio");

    if (homeTitle) {
      homeTitle.innerHTML =
        site.person + ' / <span class="text-gradient">' + site.brand + "</span>";
    }

    if (homeLead) {
      homeLead.textContent = site.lead || "";
    }

    if (homeTagline) {
      homeTagline.textContent = site.tagline || "";
    }

    if (homeSummary) {
      homeSummary.textContent = site.summary || "";
    }

    if (profileList) {
      profileList.innerHTML = (site.profile || [])
        .map(function (item) {
          return "<li>" + item + "</li>";
        })
        .join("");
    }

    if (profileFocus) {
      profileFocus.textContent = site.focus || "";
    }

    if (archiveMetrics) {
      archiveMetrics.innerHTML =
        createMetricCard(data.categories.length, "软件分类") +
        createMetricCard(allProjects.length, "作品文章") +
        createMetricCard("v" + site.version, "当前版本");
    }

    if (categoryGrid) {
      categoryGrid.innerHTML = data.categories.map(createCategoryCard).join("");
    }

    if (featuredGrid) {
      featuredGrid.innerHTML = data.featured
        .map(function (item) {
          var found = findProject(item.category, item.project);
          return found ? createProjectCard(found) : "";
        })
        .join("");
    }
  }

  function renderCategory() {
    var categorySlug = queryValue("category") || data.categories[0].slug;
    var category = findCategory(categorySlug);
    var root = document.querySelector('[data-role="category-root"]');

    if (!root) {
      return;
    }

    if (!category) {
      setDocumentTitle("分类不存在");
      renderEmptyState(
        root,
        "分类不存在",
        "当前没有找到这个分类。你可以先回到首页，再从分类入口重新进入。",
        "返回首页",
        "index.html"
      );
      return;
    }

    setTheme();
    setDocumentTitle(category.name);

    root.innerHTML =
      '<section class="category-hero panel" data-reveal>' +
      '<div class="breadcrumb">' +
      '<a href="index.html">首页</a>' +
      "<span>/</span>" +
      "<span>" +
      category.name +
      "</span>" +
      "</div>" +
      '<div class="category-hero__layout">' +
      "<div>" +
      '<p class="eyebrow">CATEGORY ARCHIVE</p>' +
      "<h1>" +
      category.name +
      "</h1>" +
      '<p class="category-hero__text">' +
      category.overview +
      "</p>" +
      "</div>" +
      '<div class="metric-row metric-row--compact">' +
      createMetricCard(countProjects(category), "文章数量") +
      createMetricCard(category.groups.length, "内容分组") +
      createMetricCard("原顺序", "按原分类顺序整理") +
      "</div>" +
      "</div>" +
      '<div class="inline-nav">' +
      data.categories
        .map(function (item) {
          var activeClass = item.slug === category.slug ? " chip-link--active" : "";

          return (
            '<a class="chip-link' +
            activeClass +
            '" href="category.html?category=' +
            item.slug +
            '">' +
            item.name +
            "</a>"
          );
        })
        .join("") +
      "</div>" +
      "</section>" +
      category.groups
        .map(function (group) {
          return (
            '<section class="group-section" data-reveal>' +
            '<div class="section-heading section-heading--tight">' +
            "<div>" +
            '<p class="eyebrow">ARTICLE GROUP</p>' +
            "<h2>" +
            group.title +
            "</h2>" +
            "</div>" +
            '<p class="section-heading__text">' +
            group.intro +
            "</p>" +
            "</div>" +
            '<div class="project-grid">' +
            group.items
              .map(function (project) {
                return createProjectCard({
                  category: category,
                  group: group,
                  project: project,
                });
              })
              .join("") +
            "</div>" +
            "</section>"
          );
        })
        .join("");
  }

  function renderProject() {
    var categorySlug = queryValue("category");
    var projectSlug = queryValue("project");
    var found = findProject(categorySlug, projectSlug);
    var root = document.querySelector('[data-role="project-root"]');

    if (!root) {
      return;
    }

    if (!found) {
      setDocumentTitle("文章不存在");
      renderEmptyState(
        root,
        "文章不存在",
        "当前没有找到这篇文章，你可以先回到首页或分类页继续浏览。",
        "返回首页",
        "index.html"
      );
      configureProjectBackLink(null);
      return;
    }

    var category = found.category;
    var project = found.project;
    var siblings = [];

    category.groups.forEach(function (group) {
      group.items.forEach(function (item) {
        if (item.slug !== project.slug) {
          siblings.push(item);
        }
      });
    });

    siblings = siblings.slice(0, 3);

    setTheme();
    setDocumentTitle(project.title);
    configureProjectBackLink(category);

    root.innerHTML =
      '<section class="project-hero panel" data-reveal>' +
      '<div class="breadcrumb">' +
      '<a href="index.html">首页</a>' +
      "<span>/</span>" +
      '<a href="category.html?category=' +
      category.slug +
      '">' +
      category.name +
      "</a>" +
      "<span>/</span>" +
      "<span>" +
      project.title +
      "</span>" +
      "</div>" +
      '<div class="project-hero__header">' +
      "<div>" +
      '<p class="eyebrow">ARTICLE DETAIL</p>' +
      "<h1>" +
      project.title +
      "</h1>" +
      '<p class="project-hero__subtitle">' +
      project.subtitle +
      "</p>" +
      '<p class="project-hero__text">' +
      project.overview +
      "</p>" +
      "</div>" +
      '<div class="project-hero__meta panel">' +
      '<div class="meta-line"><span>分类</span><strong>' +
      category.name +
      "</strong></div>" +
      '<div class="meta-line"><span>状态</span><strong>' +
      project.status +
      "</strong></div>" +
      '<div class="meta-line"><span>标签</span><strong>' +
      project.tags.join(" / ") +
      "</strong></div>" +
      "</div>" +
      "</div>" +
      '<div class="tag-list">' +
      project.tags
        .map(function (tag) {
          return createBadge(tag, "tag");
        })
        .join("") +
      "</div>" +
      "</section>" +
      '<section class="project-layout" data-reveal>' +
      '<article class="panel project-copy">' +
      "<h2>文章简介</h2>" +
      "<p>" +
      project.summary +
      "</p>" +
      "<h3>当前亮点</h3>" +
      '<ul class="detail-list">' +
      project.highlights
        .map(function (line) {
          return "<li>" + line + "</li>";
        })
        .join("") +
      "</ul>" +
      "</article>" +
      '<aside class="panel placeholder-panel">' +
      "<h2>图片占位</h2>" +
      '<div class="media-placeholder media-placeholder--hero">' +
      "<span>主展示图占位</span>" +
      "</div>" +
      '<div class="media-placeholder-grid">' +
      project.placeholders
        .map(function (label) {
          return (
            '<div class="media-placeholder">' +
            "<span>" +
            label +
            "</span>" +
            "</div>"
          );
        })
        .join("") +
      "</div>" +
      "</aside>" +
      "</section>" +
      '<section class="section section--airy section--compact" data-reveal>' +
      '<div class="section-heading section-heading--tight">' +
      "<div>" +
      '<p class="eyebrow">MORE ARTICLES</p>' +
      "<h2>更多同分类文章</h2>" +
      "</div>" +
      '<a class="chip-link" href="category.html?category=' +
      category.slug +
      '">返回 ' +
      category.name +
      " 分类</a>" +
      "</div>" +
      '<div class="project-grid">' +
      siblings
        .map(function (item) {
          return createProjectCard({
            category: category,
            project: item,
          });
        })
        .join("") +
      "</div>" +
      "</section>";
  }

  function activateRevealAnimations() {
    var elements = Array.prototype.slice.call(
      document.querySelectorAll("[data-reveal]")
    );

    elements.forEach(function (element, index) {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", index * 70 + "ms");
    });

    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -48px 0px",
      }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  var page = document.body.getAttribute("data-page");

  setTheme();
  setVersionBadges();

  if (page === "home") {
    renderHome();
  }

  if (page === "category") {
    renderCategory();
  }

  if (page === "project") {
    renderProject();
  }

  activateRevealAnimations();
})();
