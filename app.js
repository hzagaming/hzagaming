(function () {
  "use strict";

  var data = window.PORTFOLIO_DATA;
  var site = data && data.site ? data.site : {};

  if (!data) {
    console.error("PORTFOLIO_DATA not loaded");
    document.body.innerHTML =
      '<div style="display:grid;place-items:center;height:100vh;color:#f5f5f0;background:#030303;font-family:sans-serif;padding:24px;text-align:center;"><p>数据加载失败，请刷新页面重试。</p></div>';
    return;
  }

  // ========== 音频引擎 ==========
  var AudioEngine = {
    ctx: null,
    sfxEnabled: true,
    bgmEnabled: false,
    bgmNodes: null,
    masterGain: null,
    _lastHover: 0,
    _lastClick: 0,
    _bgmChannel: null,

    init: function () {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      try {
        this.ctx = new AC();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.35;
        this.masterGain.connect(this.ctx.destination);
        this._initChannel();
        this._loadPrefs();
        return true;
      } catch (e) {
        return false;
      }
    },

    _initChannel: function () {
      if (typeof BroadcastChannel !== "undefined") {
        this._bgmChannel = new BroadcastChannel("hza_bgm");
        this._bgmChannel.onmessage = function (e) {
          if (e.data && e.data.action === "claim" && this.bgmEnabled) {
            this.stopBGM();
            this._syncBGMBtn(false);
          }
        }.bind(this);
      } else {
        window.addEventListener(
          "storage",
          function (e) {
            if (e.key === "hza_bgm_claim" && this.bgmEnabled) {
              this.stopBGM();
              this._syncBGMBtn(false);
            }
          }.bind(this)
        );
      }
    },

    _claimBGM: function () {
      if (this._bgmChannel) {
        this._bgmChannel.postMessage({ action: "claim" });
      }
      try {
        localStorage.setItem("hza_bgm_claim", String(Date.now()));
      } catch (e) {}
    },

    _syncBGMBtn: function (enabled) {
      var bgmBtn = document.querySelector('[data-role="audio-bgm-toggle"]');
      if (bgmBtn) {
        bgmBtn.setAttribute("aria-pressed", String(enabled));
        bgmBtn.textContent = enabled ? "BGM：开" : "BGM：关";
      }
    },

    ensureContext: function () {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    },

    _playTone: function (freq, type, duration, vol) {
      if (!this.sfxEnabled || !this.ctx) return;
      this.ensureContext();
      var t = this.ctx.currentTime;
      var osc = this.ctx.createOscillator();
      var gain = this.ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol || 0.04, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (duration || 0.05));
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + (duration || 0.05) + 0.01);
    },

    playHover: function () {
      var now = performance.now();
      if (now - this._lastHover < 60) return;
      this._lastHover = now;
      this._playTone(880, "sine", 0.035, 0.022);
    },

    playClick: function () {
      var now = performance.now();
      if (now - this._lastClick < 30) return;
      this._lastClick = now;
      this._playTone(523.25, "triangle", 0.07, 0.045);
    },

    playReveal: function () {
      this._playTone(659.25, "sine", 0.1, 0.02);
    },

    playError: function () {
      this._playTone(150, "sawtooth", 0.15, 0.035);
    },

    toggleSFX: function (enabled) {
      this.sfxEnabled = enabled;
      this._savePrefs();
    },

    startBGM: function () {
      if (!this.ctx || this.bgmNodes) return;
      this.ensureContext();
      this._claimBGM();

      var freqs = [110, 164.81, 196, 246.94];
      var types = ["sine", "sine", "triangle", "sine"];
      var master = this.ctx.createGain();
      master.gain.value = 0.012;
      master.connect(this.masterGain);

      var oscillators = [];
      freqs.forEach(
        function (f, i) {
          var osc = this.ctx.createOscillator();
          var gain = this.ctx.createGain();
          var pan = this.ctx.createStereoPanner
            ? this.ctx.createStereoPanner()
            : null;

          osc.type = types[i];
          osc.frequency.value = f;

          var lfo = this.ctx.createOscillator();
          var lfoGain = this.ctx.createGain();
          lfo.type = "sine";
          lfo.frequency.value = 0.08 + Math.random() * 0.25;
          lfoGain.gain.value = 50;
          lfo.connect(lfoGain);
          lfoGain.connect(osc.detune);
          lfo.start();

          gain.gain.value = 0.22;
          osc.connect(gain);
          if (pan) {
            pan.pan.value = (Math.random() - 0.5) * 0.5;
            gain.connect(pan);
            pan.connect(master);
          } else {
            gain.connect(master);
          }
          osc.start();

          oscillators.push({
            osc: osc,
            gain: gain,
            lfo: lfo,
            lfoGain: lfoGain,
            pan: pan,
          });
        }.bind(this)
      );

      this.bgmNodes = { master: master, oscillators: oscillators };
      this.bgmEnabled = true;
    },

    stopBGM: function () {
      if (!this.bgmNodes) return;
      var t = this.ctx ? this.ctx.currentTime : 0;
      var ramp = 2;
      this.bgmNodes.master.gain.cancelScheduledValues(t);
      this.bgmNodes.master.gain.setValueAtTime(
        this.bgmNodes.master.gain.value,
        t
      );
      this.bgmNodes.master.gain.linearRampToValueAtTime(0.0001, t + ramp);

      setTimeout(
        function () {
          if (!this.bgmNodes) return;
          this.bgmNodes.oscillators.forEach(function (o) {
            try {
              o.osc.stop();
              o.lfo.stop();
            } catch (e) {}
          });
          this.bgmNodes = null;
        }.bind(this),
        ramp * 1000 + 100
      );

      this.bgmEnabled = false;
    },

    toggleBGM: function () {
      if (this.bgmEnabled) {
        this.stopBGM();
      } else {
        this.startBGM();
      }
      this._savePrefs();
      return this.bgmEnabled;
    },

    setMasterVolume: function (v) {
      if (this.masterGain) {
        this.masterGain.gain.value = Math.max(0, Math.min(1, v));
      }
    },

    _loadPrefs: function () {
      try {
        var raw = localStorage.getItem("hza_audio_prefs");
        if (raw) {
          var prefs = JSON.parse(raw);
          this.sfxEnabled = prefs.sfx !== false;
          this.bgmEnabled = prefs.bgm === true;
        }
      } catch (e) {}
    },

    _savePrefs: function () {
      try {
        localStorage.setItem(
          "hza_audio_prefs",
          JSON.stringify({ sfx: this.sfxEnabled, bgm: this.bgmEnabled })
        );
      } catch (e) {}
    },
  };

  // ========== 工具函数 ==========
  function flattenProjects() {
    var entries = [];
    if (!data.categories) return entries;
    data.categories.forEach(function (category) {
      if (!category.groups) return;
      category.groups.forEach(function (group) {
        if (!group.items) return;
        group.items.forEach(function (item) {
          entries.push({ category: category, group: group, project: item });
        });
      });
    });
    return entries;
  }

  function countProjects(category) {
    if (!category || !category.groups) return 0;
    return category.groups.reduce(function (total, group) {
      return total + (group.items ? group.items.length : 0);
    }, 0);
  }

  function findCategory(slug) {
    if (!data.categories) return null;
    return data.categories.find(function (category) {
      return category.slug === slug;
    });
  }

  function findProject(categorySlug, projectSlug) {
    var category = findCategory(categorySlug);
    if (!category || !category.groups) return null;
    for (var i = 0; i < category.groups.length; i += 1) {
      var group = category.groups[i];
      if (!group.items) continue;
      for (var j = 0; j < group.items.length; j += 1) {
        var item = group.items[j];
        if (item.slug === projectSlug) {
          return { category: category, group: group, project: item };
        }
      }
    }
    return null;
  }

  function queryValue(key) {
    return new URLSearchParams(window.location.search).get(key);
  }

  function setDocumentTitle(title) {
    document.title =
      title + " | HZA Portfolio v" + (site.version || "0.1.0");
  }

  function setTheme(category) {
    var accent = "#ffffff";
    var accentSoft = "#b8b8b8";
    if (category && category.accent) {
      accent = category.accent;
    }
    if (category && category.accentSoft) {
      accentSoft = category.accentSoft;
    }
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent-soft", accentSoft);
  }

  function setVersionBadges() {
    var badges = document.querySelectorAll('[data-role="version-badge"]');
    badges.forEach(function (badge) {
      badge.textContent = "v" + (site.version || "0.1.0");
    });
  }

  function setFooterVersions() {
    var footers = document.querySelectorAll('[data-role="footer-version"]');
    footers.forEach(function (el) {
      el.textContent = "HZA Portfolio v" + (site.version || "0.1.0");
    });
  }

  function escapeHtml(text) {
    if (text == null) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function createBadge(text, className) {
    return '<span class="' + className + '">' + escapeHtml(text) + "</span>";
  }

  function createMetricCard(value, label) {
    return (
      '<div class="metric-card panel" data-reveal>' +
      "<strong>" +
      escapeHtml(String(value)) +
      "</strong>" +
      "<span>" +
      escapeHtml(label) +
      "</span>" +
      "</div>"
    );
  }

  function renderEmptyState(root, title, text, linkLabel, linkHref) {
    root.innerHTML =
      '<section class="panel empty-state" data-reveal>' +
      "<h1>" +
      escapeHtml(title) +
      "</h1>" +
      "<p>" +
      escapeHtml(text) +
      "</p>" +
      '<div class="hero__actions"><a class="chip-link" href="' +
      escapeHtml(linkHref) +
      '">' +
      escapeHtml(linkLabel) +
      "</a></div>" +
      "</section>";
  }

  function configureProjectBackLink(category) {
    var backLink = document.querySelector(
      '[data-role="context-back-link"]'
    );
    if (!backLink) return;
    if (category) {
      backLink.href =
        "category.html?category=" + encodeURIComponent(category.slug);
      backLink.textContent = "返回 " + category.name;
      return;
    }
    backLink.href = "index.html";
    backLink.textContent = "返回首页";
  }

  function createProjectCard(entry) {
    var category = entry.category;
    var project = entry.project;
    var tags = (project.tags || []).slice(0, 3);
    return (
      '<article class="project-card panel" data-reveal>' +
      '<div class="project-card__meta">' +
      createBadge(category.name, "soft-badge") +
      createBadge(project.status, "status-badge") +
      "</div>" +
      "<h3>" +
      escapeHtml(project.title) +
      "</h3>" +
      '<p class="project-card__subtitle">' +
      escapeHtml(project.subtitle) +
      "</p>" +
      "<p>" +
      escapeHtml(project.summary) +
      "</p>" +
      '<div class="tag-list">' +
      tags
        .map(function (tag) {
          return createBadge(tag, "tag");
        })
        .join("") +
      "</div>" +
      '<a class="text-link" href="project.html?category=' +
      encodeURIComponent(category.slug) +
      "&project=" +
      encodeURIComponent(project.slug) +
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
      escapeHtml(category.name) +
      "</h3>" +
      "<p>" +
      escapeHtml(category.intro) +
      "</p>" +
      '<div class="software-card__stats">' +
      "<span>" +
      (category.groups ? category.groups.length : 0) +
      " 个分组</span>" +
      "<span>" +
      countProjects(category) +
      " 篇文章</span>" +
      "</div>" +
      '<a class="card-link" href="category.html?category=' +
      encodeURIComponent(category.slug) +
      '">进入分类</a>' +
      "</article>"
    );
  }

  // ========== 页面渲染 ==========
  function renderHome() {
    var allProjects = flattenProjects();
    var homeTitle = document.querySelector('[data-role="home-title"]');
    var homeLead = document.querySelector('[data-role="home-lead"]');
    var homeTagline = document.querySelector('[data-role="home-tagline"]');
    var homeSummary = document.querySelector('[data-role="home-summary"]');
    var profileList = document.querySelector('[data-role="profile-list"]');
    var profileFocus = document.querySelector('[data-role="profile-focus"]');
    var archiveMetrics = document.querySelector(
      '[data-role="archive-metrics"]'
    );
    var categoryGrid = document.querySelector(
      '[data-role="category-grid"]'
    );
    var featuredGrid = document.querySelector(
      '[data-role="featured-grid"]'
    );

    setDocumentTitle(site.title || "HZA Portfolio");

    if (homeTitle) {
      homeTitle.innerHTML =
        escapeHtml(site.person || "") +
        ' / <span class="text-gradient">' +
        escapeHtml(site.brand || "") +
        "</span>";
    }
    if (homeLead) homeLead.textContent = site.lead || "";
    if (homeTagline) homeTagline.textContent = site.tagline || "";
    if (homeSummary) homeSummary.textContent = site.summary || "";

    if (profileList) {
      profileList.innerHTML = (site.profile || [])
        .map(function (item) {
          return "<li>" + escapeHtml(item) + "</li>";
        })
        .join("");
    }

    if (profileFocus) profileFocus.textContent = site.focus || "";

    if (archiveMetrics) {
      archiveMetrics.innerHTML =
        createMetricCard(
          data.categories ? data.categories.length : 0,
          "软件分类"
        ) +
        createMetricCard(allProjects.length, "作品文章") +
        createMetricCard("v" + (site.version || "0.1.0"), "当前版本");
    }

    if (categoryGrid) {
      categoryGrid.innerHTML = (data.categories || [])
        .map(createCategoryCard)
        .join("");
    }

    if (featuredGrid) {
      var featuredCards = [];
      (data.featured || []).forEach(function (item) {
        var found = findProject(item.category, item.project);
        if (found) featuredCards.push(createProjectCard(found));
      });
      featuredGrid.innerHTML = featuredCards.join("");
    }

    renderChangelog();
  }

  function renderCategory() {
    var categorySlug = queryValue("category");
    var category = null;

    if (categorySlug) {
      category = findCategory(categorySlug);
    }

    var root = document.querySelector('[data-role="category-root"]');
    if (!root) return;

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

    setTheme(category);
    setDocumentTitle(category.name);

    root.innerHTML =
      '<section class="category-hero panel" data-reveal>' +
      '<nav class="breadcrumb" aria-label="面包屑">' +
      '<a href="index.html">首页</a>' +
      "<span>/</span>" +
      "<span>" +
      escapeHtml(category.name) +
      "</span>" +
      "</nav>" +
      '<div class="category-hero__layout">' +
      "<div>" +
      '<p class="eyebrow">CATEGORY ARCHIVE</p>' +
      "<h1>" +
      escapeHtml(category.name) +
      "</h1>" +
      '<p class="category-hero__text">' +
      escapeHtml(category.overview) +
      "</p>" +
      "</div>" +
      '<div class="metric-row metric-row--compact">' +
      createMetricCard(countProjects(category), "文章数量") +
      createMetricCard(
        category.groups ? category.groups.length : 0,
        "内容分组"
      ) +
      createMetricCard("原顺序", "按原分类顺序整理") +
      "</div>" +
      "</div>" +
      '<div class="inline-nav">' +
      (data.categories || [])
        .map(function (item) {
          var activeClass =
            item.slug === category.slug ? " chip-link--active" : "";
          return (
            '<a class="chip-link' +
            activeClass +
            '" href="category.html?category=' +
            encodeURIComponent(item.slug) +
            '">' +
            escapeHtml(item.name) +
            "</a>"
          );
        })
        .join("") +
      "</div>" +
      "</section>" +
      (category.groups || [])
        .map(function (group) {
          return (
            '<section class="group-section" data-reveal>' +
            '<div class="section-heading section-heading--tight">' +
            "<div>" +
            '<p class="eyebrow">ARTICLE GROUP</p>' +
            "<h2>" +
            escapeHtml(group.title) +
            "</h2>" +
            "</div>" +
            '<p class="section-heading__text">' +
            escapeHtml(group.intro) +
            "</p>" +
            "</div>" +
            '<div class="project-grid">' +
            (group.items || [])
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

    if (!root) return;

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

    if (category.groups) {
      category.groups.forEach(function (group) {
        if (!group.items) return;
        group.items.forEach(function (item) {
          if (item.slug !== project.slug) {
            siblings.push(item);
          }
        });
      });
    }

    siblings = siblings.slice(0, 3);

    setTheme(category);
    setDocumentTitle(project.title);
    configureProjectBackLink(category);

    var placeholders = (project.placeholders || [])
      .map(function (label) {
        return (
          '<div class="media-placeholder">' +
          "<span>" +
          escapeHtml(label) +
          "</span>" +
          "</div>"
        );
      })
      .join("");

    var moreSection = siblings.length
      ? '<section class="section section--airy section--compact" data-reveal>' +
        '<div class="section-heading section-heading--tight">' +
        "<div>" +
        '<p class="eyebrow">MORE ARTICLES</p>' +
        "<h2>更多同分类文章</h2>" +
        "</div>" +
        '<a class="chip-link" href="category.html?category=' +
        encodeURIComponent(category.slug) +
        '">返回 ' +
        escapeHtml(category.name) +
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
        "</section>"
      : "";

    root.innerHTML =
      '<section class="project-hero panel" data-reveal>' +
      '<nav class="breadcrumb" aria-label="面包屑">' +
      '<a href="index.html">首页</a>' +
      "<span>/</span>" +
      '<a href="category.html?category=' +
      encodeURIComponent(category.slug) +
      '">' +
      escapeHtml(category.name) +
      "</a>" +
      "<span>/</span>" +
      "<span>" +
      escapeHtml(project.title) +
      "</span>" +
      "</nav>" +
      '<div class="project-hero__header">' +
      "<div>" +
      '<p class="eyebrow">ARTICLE DETAIL</p>' +
      "<h1>" +
      escapeHtml(project.title) +
      "</h1>" +
      '<p class="project-hero__subtitle">' +
      escapeHtml(project.subtitle) +
      "</p>" +
      '<p class="project-hero__text">' +
      escapeHtml(project.overview) +
      "</p>" +
      "</div>" +
      '<div class="project-hero__meta panel">' +
      '<div class="meta-line"><span>分类</span><strong>' +
      escapeHtml(category.name) +
      "</strong></div>" +
      '<div class="meta-line"><span>状态</span><strong>' +
      escapeHtml(project.status) +
      "</strong></div>" +
      '<div class="meta-line"><span>标签</span><strong>' +
      (project.tags || []).map(escapeHtml).join(" / ") +
      "</strong></div>" +
      "</div>" +
      "</div>" +
      '<div class="tag-list">' +
      (project.tags || [])
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
      escapeHtml(project.summary) +
      "</p>" +
      "<h3>当前亮点</h3>" +
      '<ul class="detail-list">' +
      (project.highlights || [])
        .map(function (line) {
          return "<li>" + escapeHtml(line) + "</li>";
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
      placeholders +
      "</div>" +
      "</aside>" +
      "</section>" +
      moreSection;
  }

  function renderChangelog() {
    var root = document.querySelector('[data-role="changelog-root"]');
    if (!root) return;
    var log = data.changelog || [];
    if (!log.length) {
      root.innerHTML = "<p>暂无更新记录。</p>";
      return;
    }

    var current = log[0];
    var history = log.slice(1);

    var currentHtml =
      '<div class="changelog-current panel" data-reveal>' +
      '<div class="changelog-header">' +
      '<div><h3>' + escapeHtml(current.title) + "</h3>" +
      '<span class="changelog-version">' + escapeHtml(current.version) + "</span></div>" +
      '<span class="changelog-date">' + escapeHtml(current.date) + "</span>" +
      "</div>" +
      '<ul class="detail-list">' +
      current.items.map(function (item) {
        return "<li>" + escapeHtml(item) + "</li>";
      }).join("") +
      "</ul>" +
      "</div>";

    var historyHtml = "";
    if (history.length) {
      historyHtml =
        '<div class="changelog-history" data-reveal>' +
        '<button class="changelog-toggle" data-role="changelog-toggle" aria-expanded="false">' +
        "查看历史公告（" + history.length + " 个版本）" +
        "</button>" +
        '<div class="changelog-history-list" data-role="changelog-history-list">' +
        history.map(function (entry) {
          return (
            '<div class="changelog-entry panel">' +
            '<div class="changelog-header">' +
            '<div><h4>' + escapeHtml(entry.title) + "</h4>" +
            '<span class="changelog-version">' + escapeHtml(entry.version) + "</span></div>" +
            '<span class="changelog-date">' + escapeHtml(entry.date) + "</span>" +
            "</div>" +
            '<ul class="detail-list">' +
            entry.items.map(function (item) {
              return "<li>" + escapeHtml(item) + "</li>";
            }).join("") +
            "</ul>" +
            "</div>"
          );
        }).join("") +
        "</div>" +
        "</div>";
    }

    root.innerHTML = currentHtml + historyHtml;

    var toggle = root.querySelector('[data-role="changelog-toggle"]');
    var list = root.querySelector('[data-role="changelog-history-list"]');
    if (toggle && list) {
      toggle.addEventListener("click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!expanded));
        list.classList.toggle("is-expanded", !expanded);
        toggle.textContent = expanded
          ? "查看历史公告（" + history.length + " 个版本）"
          : "收起历史公告";
      });
    }
  }

  // ========== 动画系统 ==========
  var reducedMotion = false;

  function activateRevealAnimations() {
    var elements = Array.prototype.slice.call(
      document.querySelectorAll("[data-reveal]")
    );
    elements.forEach(function (element, index) {
      element.classList.add("reveal");
      if (!reducedMotion) {
        element.style.setProperty(
          "--reveal-delay",
          Math.min(index * 70, 600) + "ms"
        );
      } else {
        element.classList.add("is-visible");
      }
    });

    if (reducedMotion || !("IntersectionObserver" in window)) {
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
      { threshold: 0.14, rootMargin: "0px 0px -48px 0px" }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  // ========== 交互增强 ==========
  function initKeyboardShortcuts() {
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (e.target.closest("input, textarea, select")) return;
        var page = document.body.getAttribute("data-page");
        if (page === "project") {
          var categorySlug = queryValue("category");
          if (categorySlug) {
            window.location.href =
              "category.html?category=" + encodeURIComponent(categorySlug);
          } else {
            window.location.href = "index.html";
          }
        } else if (page === "category") {
          window.location.href = "index.html";
        }
      }
    });
  }

  function initScrollProgress() {
    var bar = document.querySelector('[data-role="scroll-progress"]');
    if (!bar) return;
    var ticking = false;
    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      bar.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + "%" : "0%";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  function initBackToTop() {
    var btn = document.querySelector('[data-role="back-to-top"]');
    if (!btn) return;
    var ticking = false;
    function toggle() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      btn.classList.toggle("is-visible", scrollTop > 500);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(toggle);
        ticking = true;
      }
    }, { passive: true });
    btn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
  }

  function initSectionHighlight() {
    var navLinks = document.querySelectorAll('.topbar__nav a[href^="#"]');
    if (!navLinks.length) return;
    var sections = [];
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) sections.push({ link: link, section: section });
    });
    if (!sections.length) return;

    var ticking = false;
    function update() {
      var scrollPos = window.scrollY + 120;
      sections.forEach(function (item) {
        var top = item.section.offsetTop;
        var bottom = top + item.section.offsetHeight;
        item.link.classList.toggle(
          "is-active",
          scrollPos >= top && scrollPos < bottom
        );
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  function initSfxBindings() {
    var lastHover = 0;
    document.querySelectorAll("a, button, .software-card, .project-card").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        var now = performance.now();
        if (now - lastHover < 60) return;
        lastHover = now;
        AudioEngine.playHover();
      });
    });

    var lastClick = 0;
    document.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("click", function () {
        var now = performance.now();
        if (now - lastClick < 30) return;
        lastClick = now;
        AudioEngine.playClick();
      });
    });
  }

  function initAudioControls() {
    var panel = document.querySelector('[data-role="audio-panel"]');
    var sfxBtn = document.querySelector('[data-role="audio-sfx-toggle"]');
    var bgmBtn = document.querySelector('[data-role="audio-bgm-toggle"]');
    if (!panel) return;

    function initAudio() {
      if (!AudioEngine.ctx) {
        AudioEngine.init();
      } else {
        AudioEngine.ensureContext();
      }
      if (AudioEngine.bgmEnabled && !AudioEngine.bgmNodes) {
        AudioEngine.startBGM();
      }
      document.removeEventListener("click", initAudio, true);
      document.removeEventListener("keydown", initAudioKey, true);
    }

    function initAudioKey(e) {
      if (e.key === "Enter" || e.key === " ") {
        initAudio();
      }
    }

    document.addEventListener("click", initAudio, true);
    document.addEventListener("keydown", initAudioKey, true);

    if (sfxBtn) {
      sfxBtn.setAttribute("aria-pressed", String(AudioEngine.sfxEnabled));
      sfxBtn.textContent = AudioEngine.sfxEnabled ? "音效：开" : "音效：关";
      sfxBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        AudioEngine.toggleSFX(!AudioEngine.sfxEnabled);
        sfxBtn.setAttribute("aria-pressed", String(AudioEngine.sfxEnabled));
        sfxBtn.textContent = AudioEngine.sfxEnabled ? "音效：开" : "音效：关";
        if (AudioEngine.sfxEnabled) AudioEngine.playClick();
      });
    }

    if (bgmBtn) {
      bgmBtn.setAttribute("aria-pressed", String(AudioEngine.bgmEnabled));
      bgmBtn.textContent = AudioEngine.bgmEnabled ? "BGM：开" : "BGM：关";
      bgmBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var enabled = AudioEngine.toggleBGM();
        bgmBtn.setAttribute("aria-pressed", String(enabled));
        bgmBtn.textContent = enabled ? "BGM：开" : "BGM：关";
      });
    }
  }

  function initLoadingState() {
    var loader = document.querySelector('[data-role="page-loader"]');
    if (!loader) return;
    if (window.__hideLoaderTimeout) clearTimeout(window.__hideLoaderTimeout);
    window.addEventListener("load", function () {
      loader.classList.add("is-hidden");
      setTimeout(function () {
        loader.style.display = "none";
      }, 500);
    });
  }

  function initReducedMotion() {
    var mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = mql.matches;
    if (mql.addEventListener) {
      mql.addEventListener("change", function (e) {
        reducedMotion = e.matches;
      });
    }
  }

  function initVisibilityAudio() {
    document.addEventListener("visibilitychange", function () {
      if (!AudioEngine.ctx) return;
      if (document.hidden) {
        if (AudioEngine.ctx.state === "running") {
          AudioEngine.ctx.suspend();
        }
      } else {
        if (AudioEngine.ctx.state === "suspended") {
          AudioEngine.ctx.resume();
        }
      }
    });
  }

  // ========== 初始化 ==========
  var page = document.body.getAttribute("data-page");

  setVersionBadges();
  setFooterVersions();
  initReducedMotion();
  initLoadingState();
  initKeyboardShortcuts();
  initScrollProgress();
  initBackToTop();
  initAudioControls();
  initVisibilityAudio();

  if (page === "home") {
    renderHome();
    setTheme();
  } else if (page === "category") {
    renderCategory();
  } else if (page === "project") {
    renderProject();
  }

  activateRevealAnimations();

  initSfxBindings();
})();
