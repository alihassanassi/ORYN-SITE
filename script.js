/* ═══════════════════════════════════════════════════════════════════
   KAELEN Security — script.js
   Premium interactions: particles, typing terminal, counters, glow
   ═══════════════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    /* ── Scroll Progress Bar ────────────────────────────────────────── */
    var progressBar = document.getElementById("scrollProgress");
    if (progressBar) {
        window.addEventListener("scroll", function () {
            var h = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
        }, { passive: true });
    }

    /* ── Nav scroll effect ────────────────────────────────────────── */
    var nav = document.getElementById("nav");
    window.addEventListener("scroll", function () {
        nav.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });

    /* ── Mobile nav toggle ────────────────────────────────────────── */
    var toggle = document.querySelector(".mobile-toggle");
    var links  = document.querySelector(".nav-links");
    if (toggle && links) {
        toggle.addEventListener("click", function () {
            toggle.classList.toggle("active");
            links.classList.toggle("open");
        });
        links.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                toggle.classList.remove("active");
                links.classList.remove("open");
            });
        });
    }

    /* ── Particle Constellation ─────────────────────────────────────── */
    var canvas = document.getElementById("particles");
    if (canvas) {
        var ctx = canvas.getContext("2d");
        var particles = [];
        var PARTICLE_COUNT = window.innerWidth < 768 ? 30 : 60;
        var CONNECT_DIST = 140;
        var rafId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.4 + 0.1;
        }

        for (var i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0,212,255," + p.alpha + ")";
                ctx.fill();

                for (var j = i + 1; j < particles.length; j++) {
                    var p2 = particles[j];
                    var dx = p.x - p2.x;
                    var dy = p.y - p2.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = "rgba(0,212,255," + (0.06 * (1 - dist / CONNECT_DIST)) + ")";
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            rafId = requestAnimationFrame(drawParticles);
        }

        // Only run particles when hero is visible
        var heroObs = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                if (!rafId) drawParticles();
            } else {
                if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            }
        }, { threshold: 0 });
        heroObs.observe(document.getElementById("hero"));
    }

    /* ── Typing Terminal ────────────────────────────────────────────── */
    var terminalBody = document.getElementById("terminalBody");
    if (terminalBody) {
        var TERM_LINES = [
            { time: "02:14:03", type: "ok",   text: "[BASELINE] 192.168.1.0/24 — 47 hosts profiled, 0 anomalies" },
            { time: "02:14:07", type: "ok",   text: "[JA3] TLS handshake 10.0.1.22 → 142.251.x.x — fingerprint clean" },
            { time: "02:14:11", type: "warn", text: "[T1110] Brute force — 14 SSH failures from 185.x.x.x in 60s" },
            { time: "02:14:11", type: "ok",   text: "[CORRELATOR] Cross-referencing AbuseIPDB... score: 97/100" },
            { time: "02:14:12", type: "warn", text: "[T1071] C2 beacon pattern — 10.0.1.45 → 91.x.x.x, jitter 2.3%" },
            { time: "02:14:12", type: "crit", text: "[ESCALATED] 3+ event types from 10.0.1.45 — severity → CRITICAL" },
            { time: "02:14:13", type: "ok",   text: "[DLP] Outbound scan clean — 0 PII matches, 0 credential leaks" },
            { time: "02:14:15", type: "ok",   text: "[HEARTBEAT] All systems nominal — 8 detectors active" }
        ];

        var termStarted = false;

        function typeTerminal() {
            if (termStarted) return;
            termStarted = true;
            terminalBody.innerHTML = "";
            var lineIdx = 0;

            function typeLine() {
                if (lineIdx >= TERM_LINES.length) {
                    // Add blinking cursor at end
                    var cursor = document.createElement("span");
                    cursor.className = "term-cursor";
                    terminalBody.lastElementChild.appendChild(cursor);
                    return;
                }

                var data = TERM_LINES[lineIdx];
                var div = document.createElement("div");
                div.className = "term-line";

                var timeSpan = '<span class="term-time">' + data.time + '</span> ';
                var tagClass = data.type === "crit" ? "term-crit" : data.type === "warn" ? "term-warn" : "term-ok";
                var tag = data.type === "crit" ? "[CRITICAL]" : data.type === "warn" ? "[ALERT]" : "[KAELEN]";
                var prefix = timeSpan + '<span class="' + tagClass + '">' + tag + '</span> ';

                div.innerHTML = prefix;
                terminalBody.appendChild(div);

                var charIdx = 0;
                var textNode = document.createTextNode("");
                div.appendChild(textNode);

                var cursor = document.createElement("span");
                cursor.className = "term-cursor";
                div.appendChild(cursor);

                function typeChar() {
                    if (charIdx < data.text.length) {
                        textNode.textContent += data.text[charIdx];
                        charIdx++;
                        setTimeout(typeChar, 15 + Math.random() * 25);
                    } else {
                        div.removeChild(cursor);
                        lineIdx++;
                        setTimeout(typeLine, 200 + Math.random() * 300);
                    }
                }
                typeChar();
            }
            typeLine();
        }

        var termObs = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                typeTerminal();
                termObs.unobserve(terminalBody);
            }
        }, { threshold: 0.3 });
        termObs.observe(terminalBody);
    }

    /* ── Counter Animation ──────────────────────────────────────────── */
    var counters = document.querySelectorAll(".counter");
    if (counters.length) {
        var counterObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var target = parseInt(el.getAttribute("data-target"), 10);
                    var prefix = el.getAttribute("data-prefix") || "";
                    var suffix = el.getAttribute("data-suffix") || "";
                    var duration = 2000;
                    var start = performance.now();

                    function easeOutExpo(t) {
                        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                    }

                    function update(now) {
                        var elapsed = now - start;
                        var progress = Math.min(elapsed / duration, 1);
                        var value = Math.round(easeOutExpo(progress) * target);
                        el.textContent = prefix + value + suffix;
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                    counterObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (c) { counterObs.observe(c); });
    }

    /* ── Scroll Reveal ──────────────────────────────────────────────── */
    var revealTargets = [
        { sel: ".section-header", cls: "reveal" },
        { sel: ".problem-text", cls: "reveal-left" },
        { sel: ".problem-stats .pstat", cls: "reveal" },
        { sel: ".service-card", cls: "reveal" },
        { sel: ".tech-feature", cls: "reveal" },
        { sel: ".why-text", cls: "reveal-left" },
        { sel: ".why-visual", cls: "reveal-right" },
        { sel: ".terminal", cls: "reveal" },
        { sel: ".contact-card", cls: "reveal" },
        { sel: ".trust-item", cls: "reveal" },
        { sel: ".about-grid > div", cls: "reveal" },
        { sel: ".value-card", cls: "reveal" },
        { sel: ".blog-card", cls: "reveal" },
        { sel: ".founder-highlight", cls: "reveal" }
    ];

    revealTargets.forEach(function (item) {
        document.querySelectorAll(item.sel).forEach(function (el) {
            if (!el.classList.contains("reveal") && !el.classList.contains("reveal-left") && !el.classList.contains("reveal-right")) {
                el.classList.add(item.cls);
            }
        });
    });

    var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });

    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(function (el) {
        revealObs.observe(el);
    });

    /* ── Stagger Delays ─────────────────────────────────────────────── */
    var staggerSets = [
        { sel: ".services-grid .service-card", delay: 0.1 },
        { sel: ".tech-grid .tech-feature", delay: 0.08 },
        { sel: ".problem-stats .pstat", delay: 0.12 },
        { sel: ".contact-grid .contact-card", delay: 0.1 },
        { sel: ".trust-inner .trust-item", delay: 0.08 },
        { sel: ".values-grid .value-card", delay: 0.1 },
        { sel: ".blog-grid .blog-card", delay: 0.1 }
    ];
    staggerSets.forEach(function (set) {
        document.querySelectorAll(set.sel).forEach(function (el, i) {
            el.style.transitionDelay = (i * set.delay) + "s";
        });
    });

    /* ── Mouse Glow Follow ──────────────────────────────────────────── */
    document.querySelectorAll("[data-glow]").forEach(function (el) {
        el.addEventListener("mousemove", function (e) {
            var rect = el.getBoundingClientRect();
            el.style.setProperty("--mouse-x", (e.clientX - rect.left) + "px");
            el.style.setProperty("--mouse-y", (e.clientY - rect.top) + "px");
        });
    });

    /* ── Smooth scroll for anchor links ─────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
            var href = this.getAttribute("href");
            if (href === "#") return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    /* ── Active nav link on scroll ──────────────────────────────────── */
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    if (sections.length && navLinks.length) {
        window.addEventListener("scroll", function () {
            var scrollPos = window.scrollY + 200;
            sections.forEach(function (section) {
                if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                    var id = section.getAttribute("id");
                    navLinks.forEach(function (link) {
                        link.classList.remove("active-link");
                        if (link.getAttribute("href") === "#" + id) {
                            link.classList.add("active-link");
                        }
                    });
                }
            });
        }, { passive: true });
    }

})();
