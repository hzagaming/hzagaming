(function () {
  var data = window.PORTFOLIO_DATA;

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

  function setTheme(category) {
    if (!category) {
      return;
    }

    document.documentElement.style.setProperty("--accent", category.accent);
    document.documentElement.style.setProperty("--accent-soft", category.accentSoft);
  }

  function createBadge(text, className) {
    return '<span class="' + className + '">' + text + "</span>";
  }

  function createProjectCard(entry) {
    var category = entry.category;
    var project = entry.project;
    return (
      '<article class="project-card panel" style="--card-accent:' +
      category.accent +
      "; --card-accent-soft:" +
      category.accentSoft +
      '">' +
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
      '">了解更多</a>' +
      "</article>"
    );
  }

  function renderHome() {
    var heroLinks = document.querySelector('[data-role="hero-category-links"]');
    var categoryGrid = document.querySelector('[data-role="category-grid"]');
    var featuredGrid = document.querySelector('[data-role="featured-grid"]');
    var siteStats = document.querySelector('[data-role="site-stats"]');
    var previewList = document.querySelector('[data-role="preview-list"]');
    var allProjects = flattenProjects();

    if (heroLinks) {
      heroLinks.innerHTML = data.categories
        .map(function (category) {
          return (
            '<a class="hero-button" href="category.html?category=' +
            category.slug +
            '" style="--button-accent:' +
            category.accent +
            '">' +
            "<strong>" +
            category.name +
            "</strong>" +
            "<span>" +
            category.kicker +
            "</span>" +
            "</a>"
          );
        })
        .join("");
    }

    if (siteStats) {
      siteStats.innerHTML =
        '<div class="stat-card panel"><strong>' +
        data.categories.length +
        '</strong><span>软件分类</span></div>' +
        '<div class="stat-card panel"><strong>' +
        allProjects.length +
        '</strong><span>当前项目</span></div>' +
        '<div class="stat-card panel"><strong>1</strong><span>作品集框架</span></div>';
    }

    if (previewList) {
      previewList.innerHTML = data.featured
        .map(function (item) {
          var found = findProject(item.category, item.project);
          if (!found) {
            return "";
          }
          return (
            "<li>" +
            '<span class="stacked-list__category">' +
            found.category.name +
            "</span>" +
            '<strong>' +
            found.project.title +
            "</strong>" +
            '<span class="stacked-list__text">' +
            found.project.status +
            "</span>" +
            "</li>"
          );
        })
        .join("");
    }

    if (categoryGrid) {
      categoryGrid.innerHTML = data.categories
        .map(function (category) {
          var projectCount = category.groups.reduce(function (total, group) {
            return total + group.items.length;
          }, 0);

          return (
            '<article class="software-card panel" style="--card-accent:' +
            category.accent +
            "; --card-accent-soft:" +
            category.accentSoft +
            '">' +
            '<p class="software-card__kicker">' +
            category.kicker +
            "</p>" +
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
            projectCount +
            " 个项目</span>" +
            "</div>" +
            '<a class="card-link" href="category.html?category=' +
            category.slug +
            '">进入作品集</a>' +
            "</article>"
          );
        })
        .join("");
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

    if (!root || !category) {
      return;
    }

    setTheme(category);
    document.title = category.name + " | HZA Portfolio";

    var totalProjects = category.groups.reduce(function (total, group) {
      return total + group.items.length;
    }, 0);

    root.innerHTML =
      '<section class="category-hero panel">' +
      '<div class="breadcrumb">' +
      '<a href="index.html">首页</a>' +
      "<span>/</span>" +
      "<span>" +
      category.name +
      "</span>" +
      "</div>" +
      '<p class="eyebrow">' +
      category.kicker +
      "</p>" +
      "<h1>" +
      category.name +
      " 作品集</h1>" +
      '<p class="category-hero__text">' +
      category.overview +
      "</p>" +
      '<div class="stat-row">' +
      '<div class="stat-card panel"><strong>' +
      totalProjects +
      '</strong><span>项目数量</span></div>' +
      '<div class="stat-card panel"><strong>' +
      category.groups.length +
      '</strong><span>内容分组</span></div>' +
      '<div class="stat-card panel"><strong>Now</strong><span>' +
      category.intro +
      "</span></div>" +
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
            '<section class="group-section">' +
            '<div class="section-heading section-heading--tight">' +
            "<div>" +
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
      root.innerHTML =
        '<section class="panel empty-state">' +
        "<h1>项目不存在</h1>" +
        "<p>当前没有找到这个项目，你可以先回到首页或分类页继续浏览。</p>" +
        '<div class="hero__actions"><a class="chip-link" href="index.html">返回首页</a></div>' +
        "</section>";
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

    setTheme(category);
    document.title = project.title + " | HZA Portfolio";

    root.innerHTML =
      '<section class="project-hero panel">' +
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
      '<p class="eyebrow">' +
      category.kicker +
      "</p>" +
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
      '<section class="project-layout">' +
      '<article class="panel project-copy">' +
      "<h2>项目简介</h2>" +
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
      '<section class="section section--compact">' +
      '<div class="section-heading section-heading--tight">' +
      "<div>" +
      "<h2>更多同分类项目</h2>" +
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

  var page = document.body.getAttribute("data-page");

  if (page === "home") {
    renderHome();
  }

  if (page === "category") {
    renderCategory();
  }

  if (page === "project") {
    renderProject();
  }
})();
