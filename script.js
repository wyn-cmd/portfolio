/* Portfolio interactivity: theme toggle, mobile nav, project filters,
   scroll reveal and the small terminal typing effect on the home page. */

(function () {
    "use strict";

    var root = document.documentElement;

    /* ---- Theme toggle --------------------------------------------------- */

    var themeButtons = document.querySelectorAll("[data-theme-toggle]");

    function paintThemeButton() {
        var isLight = root.getAttribute("data-theme") === "light";
        themeButtons.forEach(function (btn) {
            btn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
            var sun = btn.querySelector(".icon-sun");
            var moon = btn.querySelector(".icon-moon");
            if (sun && moon) {
                sun.style.display = isLight ? "none" : "block";
                moon.style.display = isLight ? "block" : "none";
            }
        });
    }

    themeButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
            root.setAttribute("data-theme", next);
            try {
                localStorage.setItem("portfolio-theme", next);
            } catch (err) {
                /* Storage can be blocked in private modes, the toggle still works. */
            }
            paintThemeButton();
        });
    });

    paintThemeButton();

    /* ---- Mobile navigation ---------------------------------------------- */

    var navToggle = document.querySelector("[data-nav-toggle]");
    var navLinks = document.querySelector("[data-nav-links]");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", function () {
            var open = navLinks.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
        });

        navLinks.addEventListener("click", function (event) {
            if (event.target.tagName === "A") {
                navLinks.classList.remove("is-open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /* ---- Project filters ------------------------------------------------ */

    var filters = document.querySelectorAll("[data-filter]");
    var projects = document.querySelectorAll("[data-category]");
    var empty = document.querySelector("[data-empty]");

    if (filters.length && projects.length) {
        filters.forEach(function (button) {
            button.addEventListener("click", function () {
                var wanted = button.getAttribute("data-filter");
                var shown = 0;

                filters.forEach(function (other) {
                    other.setAttribute("aria-pressed", other === button ? "true" : "false");
                });

                projects.forEach(function (card) {
                    var match = wanted === "all" || card.getAttribute("data-category") === wanted;
                    card.hidden = !match;
                    if (match) {
                        shown += 1;
                    }
                });

                if (empty) {
                    empty.style.display = shown === 0 ? "block" : "none";
                }
            });
        });
    }

    /* ---- Reveal on scroll ----------------------------------------------- */

    var reveals = document.querySelectorAll(".reveal");

    if (reveals.length) {
        if ("IntersectionObserver" in window) {
            var observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("is-visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
            );

            reveals.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            reveals.forEach(function (el) {
                el.classList.add("is-visible");
            });
        }
    }

    /* ---- Terminal typing effect (home page only) ------------------------ */

    var typed = document.querySelector("[data-typed]");

    if (typed) {
        var phrases = JSON.parse(typed.getAttribute("data-typed"));
        var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var phraseIndex = 0;

        if (prefersReduced) {
            typed.textContent = phrases[0];
        } else {
            var charIndex = 0;
            var deleting = false;

            var tick = function () {
                var phrase = phrases[phraseIndex];

                if (deleting) {
                    charIndex -= 1;
                } else {
                    charIndex += 1;
                }

                typed.textContent = phrase.slice(0, charIndex);

                var delay = deleting ? 42 : 74;

                if (!deleting && charIndex === phrase.length) {
                    delay = 1900;
                    deleting = true;
                } else if (deleting && charIndex === 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    delay = 340;
                }

                window.setTimeout(tick, delay);
            };

            tick();
        }
    }

    /* ---- Footer year ---------------------------------------------------- */

    document.querySelectorAll("[data-year]").forEach(function (el) {
        el.textContent = String(new Date().getFullYear());
    });
})();
