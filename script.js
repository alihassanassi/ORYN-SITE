/* ═══════════════════════════════════════════════════════════════════
   ORYN Security — script.js
   Animations, scroll effects, mobile nav
   ═══════════════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    /* ── Nav scroll effect ────────────────────────────────────────── */
    const nav = document.getElementById("nav");
    window.addEventListener("scroll", function () {
        nav.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });

    /* ── Mobile nav toggle ────────────────────────────────────────── */
    const toggle = document.querySelector(".mobile-toggle");
    const links  = document.querySelector(".nav-links");

    if (toggle && links) {
        toggle.addEventListener("click", function () {
            toggle.classList.toggle("active");
            links.classList.toggle("open");
        });
        // close on link click
        links.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                toggle.classList.remove("active");
                links.classList.remove("open");
            });
        });
    }

    /* ── Scroll reveal ────────────────────────────────────────────── */
    var revealTargets = [
        ".problem-text", ".problem-stats .pstat",
        ".service-card", ".tech-feature",
        ".why-text", ".terminal",
        ".contact-card", ".section-header"
    ];

    // Tag elements
    revealTargets.forEach(function (sel) {
        document.querySelectorAll(sel).forEach(function (el) {
            el.classList.add("reveal");
        });
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal").forEach(function (el) {
        observer.observe(el);
    });

    /* ── Stagger service cards & tech features ────────────────────── */
    document.querySelectorAll(".services-grid .service-card").forEach(function (card, i) {
        card.style.transitionDelay = (i * 0.1) + "s";
    });
    document.querySelectorAll(".tech-grid .tech-feature").forEach(function (feat, i) {
        feat.style.transitionDelay = (i * 0.08) + "s";
    });
    document.querySelectorAll(".problem-stats .pstat").forEach(function (p, i) {
        p.style.transitionDelay = (i * 0.12) + "s";
    });
    document.querySelectorAll(".contact-grid .contact-card").forEach(function (c, i) {
        c.style.transitionDelay = (i * 0.1) + "s";
    });

    /* ── Smooth scroll for anchor links ───────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
            var target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* ── Terminal typing replay on scroll ─────────────────────────── */
    var terminal = document.querySelector(".terminal-body");
    if (terminal) {
        var termObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    // Reset and replay animations
                    var lines = terminal.querySelectorAll(".term-line");
                    lines.forEach(function (line) {
                        line.style.animation = "none";
                        line.offsetHeight; // reflow
                        line.style.animation = "";
                    });
                    termObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        termObserver.observe(terminal);
    }

})();
