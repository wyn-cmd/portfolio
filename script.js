/* Theme switch, mobile navigation, project filter and footer year.
   Nothing here is needed to read the site: every page works with scripting off. */

(function () {
    "use strict";

    var root = document.documentElement;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("js");

    /* ---- Theme switch (same storage key as the live site) ---------------- */

    var themeButtons = document.querySelectorAll("[data-theme-toggle]");

    function paintThemeButton() {
        var isDark = root.getAttribute("data-theme") === "dark";
        themeButtons.forEach(function (btn) {
            btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
            btn.setAttribute("aria-pressed", isDark ? "true" : "false");
        });
    }

    themeButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
            if (!reduce) { root.classList.add("theme-anim"); window.setTimeout(function () { root.classList.remove("theme-anim"); }, 450); }
            root.setAttribute("data-theme", next);
            try {
                localStorage.setItem("portfolio-theme", next);
            } catch (err) {
                /* Storage can be blocked in private modes; the switch still works. */
            }
            paintThemeButton();
        });
    });

    paintThemeButton();

    /* ---- Mobile navigation ----------------------------------------------- */

    var navToggle = document.querySelector("[data-nav-toggle]");
    var navLinks = document.querySelector("[data-nav-links]");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            var open = navLinks.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        });

        navLinks.addEventListener("click", function (event) {
            if (event.target.tagName === "A") {
                navLinks.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
                navToggle.setAttribute("aria-label", "Open menu");
            }
        });
    }

    /* ---- Project filter and grep -------------------------------- */

    var filters = document.querySelectorAll("[data-filter]");
    var projects = document.querySelectorAll("[data-category]");
    var empty = document.querySelector("[data-empty]");
    var count = document.querySelector("[data-count]");
    var grep = document.getElementById("grep");
    var wanted = "all";

    projects.forEach(function (item) {
        item.setAttribute("data-haystack", item.textContent.toLowerCase().replace(/\s+/g, " "));
    });

    function applyProjects() {
        var q = grep ? grep.value.trim().toLowerCase() : "";
        var shown = 0;
        projects.forEach(function (item) {
            var catOk = wanted === "all" || item.getAttribute("data-category") === wanted;
            var textOk = !q || item.getAttribute("data-haystack").indexOf(q) !== -1;
            var match = catOk && textOk;
            item.hidden = !match;
            if (match) {
                shown += 1;
            } else {
                item.removeAttribute("open");
            }
        });
        if (empty) {
            empty.hidden = shown !== 0;
        }
        if (count) {
            count.textContent = "Showing " + shown + " of " + projects.length + " projects.";
        }
    }

    if (filters.length && projects.length) {
        applyProjects();

        filters.forEach(function (button) {
            button.addEventListener("click", function () {
                wanted = button.getAttribute("data-filter");
                filters.forEach(function (other) {
                    other.setAttribute("aria-pressed", other === button ? "true" : "false");
                });
                applyProjects();
            });
        });

        if (grep) {
            grep.addEventListener("input", applyProjects);
            grep.addEventListener("keydown", function (e) {
                if (e.key === "Escape") {
                    grep.value = "";
                    applyProjects();
                    grep.blur();
                }
            });
            document.addEventListener("keydown", function (e) {
                var t = e.target;
                var typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
                if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
                    e.preventDefault();
                    grep.focus();
                }
            });
        }
    }

    /* ---- Footer year ----------------------------------------------------- */

    document.querySelectorAll("[data-year]").forEach(function (el) {
        el.textContent = String(new Date().getFullYear());
    });

    /* ---- Scroll reveal and progress bar ---------------------- */

    if (!reduce && "IntersectionObserver" in window) {
        var targets = document.querySelectorAll(".head, .statement-grid, .rows > li, .log > li, .skills > div, .facts > div, .index tbody tr, .split .plate-wrap, .band .container");
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-in");
                    io.unobserve(entry.target);
                }
            });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
        targets.forEach(function (el, i) {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
                return; /* already on screen at load: leave it visible */
            }
            el.classList.add("reveal");
            el.style.transitionDelay = (i % 4) * 50 + "ms";
            io.observe(el);
        });
    }

    var bar = document.createElement("div");
    bar.className = "progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    var ticking = false;
    function paintProgress() {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ")";
        ticking = false;
    }
    window.addEventListener("scroll", function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(paintProgress);
        }
    }, { passive: true });
    paintProgress();

    /* ---- Peek bubble ---- */

    (function peek() {
        if (!window.matchMedia || !matchMedia("(hover: hover) and (pointer: fine)").matches) {
            return;
        }
        var tip = document.createElement("div");
        tip.className = "peek";
        tip.hidden = true;
        tip.setAttribute("aria-hidden", "true");
        tip.innerHTML = '<div class="peek__shot"><img alt="" width="1200" height="600" decoding="async"></div>' +
            '<div class="peek__body"><p class="peek__title"></p><p class="peek__meta"><span class="peek__area"></span><span class="peek__lang"></span></p>' +
            '<p class="peek__desc"></p><p class="peek__tags"></p></div>';
        document.body.appendChild(tip);

        var img = tip.querySelector("img");
        var title = tip.querySelector(".peek__title");
        var area = tip.querySelector(".peek__area");
        var lang = tip.querySelector(".peek__lang");
        var desc = tip.querySelector(".peek__desc");
        var tags = tip.querySelector(".peek__tags");
        var current = null;
        var timer = 0;
        var last = { x: 0, y: 0 };
        var raf = 0;

        img.addEventListener("load", function () { img.classList.add("is-loaded"); tip.classList.remove("peek--noshot"); });
        img.addEventListener("error", function () { img.classList.remove("is-loaded"); tip.classList.add("peek--noshot"); });

        function fill(host) {
            var d = host.dataset;
            title.textContent = d.name || "";
            area.textContent = d.area || "";
            desc.textContent = d.desc || "";
            tags.textContent = d.tags || "";
            tags.hidden = !d.tags;
            var id = /^[a-z]-[a-z0-9]+$/.test(d.langIcon || "") ? d.langIcon : "l-code-xml";
            var kind = id.charAt(0) === "s" ? "s" : "l";
            lang.innerHTML = '<svg class="ico ico--' + kind + '" aria-hidden="true" focusable="false"><use href="#' + id + '"/></svg>';
            lang.appendChild(document.createTextNode(d.lang || ""));
            var url = "https://opengraph.githubassets.com/1/wyn-cmd/" + encodeURIComponent(d.repo || "");
            if (img.getAttribute("src") !== url) {
                img.classList.remove("is-loaded");
                tip.classList.remove("peek--noshot");
                img.src = url;
            } else if (img.complete && img.naturalWidth) {
                img.classList.add("is-loaded");
            }
        }

        function place() {
            raf = 0;
            var w = tip.offsetWidth;
            var h = tip.offsetHeight;
            var vw = document.documentElement.clientWidth;
            var vh = window.innerHeight;
            var x = last.x + 20;
            var y = last.y + 20;
            if (x + w > vw - 8) { x = last.x - w - 20; }
            if (y + h > vh - 8) { y = last.y - h - 20; }
            x = Math.max(8, Math.min(x, vw - w - 8));
            y = Math.max(8, Math.min(y, vh - h - 8));
            tip.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";
        }

        function move(e) {
            last.x = e.clientX;
            last.y = e.clientY;
            if (!raf) { raf = window.requestAnimationFrame(place); }
        }

        function show(host, x, y) {
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                if (current !== host) { fill(host); current = host; }
                last.x = x;
                last.y = y;
                tip.hidden = false;
                place();
            }, 110);
        }

        function hide() {
            window.clearTimeout(timer);
            tip.hidden = true;
            current = null;
        }

        var SEL = "tr[data-peek], [data-peek] > summary";
        var over = null;
        document.addEventListener("pointerover", function (e) {
            var el = e.target.closest ? e.target.closest(SEL) : null;
            if (!el || el === over) { return; }
            over = el;
            show(el.closest("[data-peek]"), e.clientX, e.clientY);
        });
        document.addEventListener("pointermove", function (e) { if (over) { move(e); } });
        document.addEventListener("pointerout", function (e) {
            if (!over) { return; }
            if (e.relatedTarget && over.contains(e.relatedTarget)) { return; }
            over = null;
            hide();
        });
        document.addEventListener("focusin", function (e) {
            var el = e.target.closest ? e.target.closest(SEL) : null;
            if (!el) { return; }
            var r = el.getBoundingClientRect();
            show(el.closest("[data-peek]"), r.left + 32, r.top + r.height / 2);
        });
        document.addEventListener("focusout", hide);
        window.addEventListener("scroll", hide, { passive: true });
        window.addEventListener("blur", hide);
        document.addEventListener("keydown", function (e) { if (e.key === "Escape") { hide(); } });
    })();

    /* ---- Pinned repos feed ---- */

    (function pinnedFeed() {
        var src = document.querySelector('meta[name="pinned-src"]');
        if (!src || !window.fetch) {
            return;
        }
        var PIN = '<svg class="ico ico--l proj__pin" aria-hidden="true" focusable="false"><use href="#l-pin"/></svg><span class="sr-only">Pinned on GitHub</span>';

        function reorderProjects(list, names) {
            var items = Array.prototype.slice.call(list.querySelectorAll(".proj"));
            var byName = {};
            items.forEach(function (it) { byName[it.getAttribute("data-name")] = it; });
            items.forEach(function (it) {
                var on = names.indexOf(it.getAttribute("data-name")) !== -1;
                it.classList.toggle("proj--pinned", on);
                if (on) { it.setAttribute("data-pinned", ""); } else { it.removeAttribute("data-pinned"); }
                var nameEl = it.querySelector(".proj__name");
                var hasPin = nameEl.querySelector(".proj__pin");
                if (on && !hasPin) {
                    nameEl.insertAdjacentHTML("beforeend", PIN);
                } else if (!on && hasPin) {
                    hasPin.remove();
                    var sr = nameEl.querySelector(".sr-only");
                    if (sr) { sr.remove(); }
                }
            });
            var pinned = names.map(function (n) { return byName[n]; }).filter(Boolean);
            var rest = items.filter(function (it) { return pinned.indexOf(it) === -1; })
                .sort(function (a, b) { return Number(a.getAttribute("data-index")) - Number(b.getAttribute("data-index")); });
            pinned.concat(rest).forEach(function (it) { list.appendChild(it); });
        }

        function firstSentence(text) {
            var t = (text || "").replace(/\s+/g, " ").trim();
            var m = t.match(/^.{20,150}?[.](\s|$)/);
            return m ? m[0].trim() : (t.length > 150 ? t.slice(0, 147).replace(/\s+\S*$/, "") + "..." : t);
        }

        function rebuildHome(tbody, names, projectsUrl) {
            var current = Array.prototype.slice.call(tbody.querySelectorAll("tr[data-peek]"))
                .map(function (r) { return r.getAttribute("data-name"); });
            if (current.join("|") === names.join("|")) {
                return;
            }
            fetch(projectsUrl, { cache: "no-cache" }).then(function (r) { return r.ok ? r.text() : ""; }).then(function (text) {
                if (!text) { return; }
                var doc = new DOMParser().parseFromString(text, "text/html");
                var keep = {};
                tbody.querySelectorAll("tr[data-peek]").forEach(function (r) { keep[r.getAttribute("data-name")] = r; });
                var more = tbody.querySelector("tr.more");
                var rows = [];
                names.forEach(function (n) {
                    if (keep[n]) { rows.push(keep[n]); return; }
                    var d = null;
                    doc.querySelectorAll("details.proj").forEach(function (x) { if (x.getAttribute("data-name") === n) { d = x; } });
                    if (!d) { return; }
                    var tr = document.createElement("tr");
                    ["name", "desc", "area", "lang", "lang-icon", "repo", "tags", "index"].forEach(function (k) {
                        tr.setAttribute("data-" + k, d.getAttribute("data-" + k) || "");
                    });
                    tr.setAttribute("data-peek", "");
                    tr.setAttribute("data-pinned", "");
                    var th = document.createElement("th");
                    th.setAttribute("scope", "row");
                    var a = document.createElement("a");
                    var srcLink = d.querySelector(".proj__src a");
                    a.href = srcLink ? srcLink.href : "https://github.com/wyn-cmd/" + encodeURIComponent(n);
                    a.target = "_blank";
                    a.rel = "noopener";
                    var ic = d.querySelector(".proj__icon");
                    if (ic) { a.appendChild(document.importNode(ic, true)); }
                    var nm = document.createElement("span");
                    nm.textContent = n;
                    a.appendChild(nm);
                    th.appendChild(a);
                    var tdD = document.createElement("td");
                    tdD.textContent = firstSentence(d.getAttribute("data-desc"));
                    var tdA = document.createElement("td");
                    tdA.textContent = d.getAttribute("data-area") || "";
                    var tdL = document.createElement("td");
                    var lg = d.querySelector(".lang");
                    if (lg) { tdL.appendChild(document.importNode(lg, true)); }
                    [th, tdD, tdA, tdL].forEach(function (c) { tr.appendChild(c); });
                    rows.push(tr);
                });
                if (!rows.length) { return; }
                tbody.querySelectorAll("tr[data-peek]").forEach(function (r) { r.remove(); });
                rows.forEach(function (r) { tbody.insertBefore(r, more); });
            }).catch(function () { /* keep the built-in rows */ });
        }

        fetch(src.content, { cache: "no-cache" })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (data) {
                if (!data || !Array.isArray(data.pinned)) { return; }
                var names = data.pinned.filter(function (n) { return typeof n === "string" && n; }).slice(0, 6);
                if (!names.length) { return; }
                var list = document.getElementById("proj-list");
                if (list) { reorderProjects(list, names); }
                var proj = document.querySelector('meta[name="projects-src"]');
                var tbody = document.querySelector("table.index tbody");
                if (proj && tbody) { rebuildHome(tbody, names, proj.content); }
            })
            .catch(function () { /* keep the built-in order */ });
    })();

    /* ---- Photo decks ---- */

    (function decks() {
        var AUTO_MS = 10000;
        var FLIP_OUT = 260;
        var FLIP_DONE = 760;

        document.querySelectorAll("[data-deck]").forEach(function (deck) {
            var stage = deck.querySelector("[data-deck-stage]");
            var cards = Array.prototype.slice.call(deck.querySelectorAll(".deck__card"));
            var count = deck.querySelector("[data-deck-count]");
            var caption = deck.querySelector("[data-deck-caption]");
            var playBtn = deck.querySelector("[data-deck-play]");
            var nextBtn = deck.querySelector("[data-deck-next]");
            var n = cards.length;
            var order = cards.slice();
            var mode = "";
            var userPlaying = !reduce;
            var hovered = false;
            var focused = false;
            var inView = false;
            var busy = false;
            var timer = null;
            var details = deck.closest("details");
            var gallery = deck.hasAttribute("data-gallery");
            var minW = (parseFloat(deck.getAttribute("data-min")) || 14) * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);

            if (n < 2) { return; }
            deck.style.setProperty("--deck-ms", AUTO_MS + "ms");

            function paint() {
                order.forEach(function (c, i) {
                    c.style.setProperty("--i", i);
                    c.classList.toggle("is-far", i > 3);
                    c.setAttribute("aria-hidden", i === 0 ? "false" : "true");
                });
                if (count) { count.textContent = (cards.indexOf(order[0]) + 1) + " / " + n; }
                if (caption) {
                    var fc = order[0].querySelector("figcaption");
                    caption.textContent = fc ? fc.textContent : "";
                }
            }

            function running() {
                return mode === "deck" && userPlaying && !hovered && !focused && inView && !document.hidden && !reduce;
            }

            function schedule() {
                window.clearTimeout(timer);
                deck.classList.remove("is-running");
                if (!running()) { return; }
                void deck.offsetWidth; /* restart the progress line */
                deck.classList.add("is-running");
                timer = window.setTimeout(function () { flip(1, true); }, AUTO_MS);
            }

            function flip(dir, auto) {
                if (busy || mode !== "deck") { return; }
                busy = true;
                window.clearTimeout(timer);
                deck.classList.remove("is-running");
                if (dir > 0) {
                    var top = order[0];
                    if (reduce) {
                        order.push(order.shift());
                        paint();
                        busy = false;
                        schedule();
                        return;
                    }
                    top.classList.add("is-out");
                    order.shift();
                    order.forEach(function (c, i) {
                        c.style.setProperty("--i", i);
                        c.classList.toggle("is-far", i > 3);
                    });
                    window.setTimeout(function () {
                        order.push(top);
                        top.classList.remove("is-out");
                        paint();
                    }, FLIP_OUT);
                } else {
                    order.unshift(order.pop());
                    paint();
                }
                window.setTimeout(function () { busy = false; schedule(); }, reduce ? 0 : FLIP_DONE);
            }

            function setMode(next) {
                if (next === mode) { return; }
                mode = next;
                deck.classList.toggle("is-deck", mode === "deck");
                deck.classList.toggle("is-grid", mode === "grid");
                if (mode === "grid") {
                    cards.forEach(function (c) {
                        c.style.removeProperty("--i");
                        c.classList.remove("is-far", "is-out");
                        c.removeAttribute("aria-hidden");
                    });
                    stage.removeAttribute("tabindex");
                    stage.removeAttribute("role");
                    stage.removeAttribute("aria-roledescription");
                    window.clearTimeout(timer);
                    deck.classList.remove("is-running");
                } else {
                    stage.setAttribute("tabindex", "0");
                    stage.setAttribute("role", "group");
                    stage.setAttribute("aria-roledescription", "photo stack");
                    paint();
                    schedule();
                }
            }

            function measure() {
                if (!gallery) { setMode("deck"); return; }
                var w = deck.parentElement ? deck.parentElement.clientWidth : 0;
                if (!w) { return; } /* closed drop-down: decide when it opens */
                var gap = 16;
                setMode(n * minW + (n - 1) * gap <= w ? "grid" : "deck");
            }

            /* controls */
            stage.addEventListener("click", function () { flip(1); });
            stage.addEventListener("keydown", function (e) {
                if (mode !== "deck") { return; }
                if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); flip(1); }
                else if (e.key === "ArrowLeft") { e.preventDefault(); flip(-1); }
            });
            if (nextBtn) { nextBtn.addEventListener("click", function () { flip(1); }); }
            if (playBtn) {
                playBtn.addEventListener("click", function () {
                    userPlaying = !userPlaying;
                    playBtn.setAttribute("aria-pressed", userPlaying ? "false" : "true");
                    playBtn.textContent = userPlaying ? "Pause" : "Play";
                    if (count) { count.setAttribute("aria-live", userPlaying ? "off" : "polite"); }
                    schedule();
                });
            }
            deck.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hovered = true; schedule(); } });
            deck.addEventListener("pointerleave", function () { hovered = false; schedule(); });
            deck.addEventListener("focusin", function () {
                var vis = false;
                try { vis = !!deck.querySelector(":focus-visible"); } catch (err) { vis = true; }
                focused = vis;
                schedule();
            });
            deck.addEventListener("focusout", function () { focused = false; schedule(); });
            document.addEventListener("visibilitychange", schedule);

            if ("IntersectionObserver" in window) {
                new IntersectionObserver(function (entries) {
                    inView = entries[entries.length - 1].isIntersecting;
                    schedule();
                }, { threshold: 0.35 }).observe(deck);
            } else {
                inView = true;
            }
            if ("ResizeObserver" in window) { new ResizeObserver(measure).observe(deck.parentElement || deck); }
            else { window.addEventListener("resize", measure); }
            if (details) { details.addEventListener("toggle", function () { window.requestAnimationFrame(measure); }); }

            measure();
            if (!mode) { setMode(gallery ? "deck" : "deck"); }
        });

        /* open a Results drop-down when linked to by hash */
        if (location.hash) {
            var t = document.getElementById(location.hash.slice(1));
            var d = t && t.querySelector ? t.querySelector("details.result") : null;
            if (d) { d.open = true; }
        }
    })();
})();
