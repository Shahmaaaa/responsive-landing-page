/* ═══════════════════════════════════════════════════
   NOVA — Premium Landing Page Scripts
   ═══════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

    // ── DOM References ──
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navbar = document.getElementById("mainNav");
    const allNavLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const dashboard = document.querySelector(".dashboard");

    // ══════════════════════════════════════════════════
    // 1. MOBILE MENU
    // ══════════════════════════════════════════════════
    menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        navLinks.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });

    // Close on nav link click
    document.querySelectorAll("#navLinks a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");
        });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove("active");
            menuToggle.classList.remove("active");
        }
    });

    // ══════════════════════════════════════════════════
    // 2. NAVBAR SCROLL EFFECT
    // ══════════════════════════════════════════════════
    let lastScroll = 0;

    function handleNavScroll() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        lastScroll = scrollY;
    }

    window.addEventListener("scroll", handleNavScroll, { passive: true });
    handleNavScroll(); // Initial check

    // ══════════════════════════════════════════════════
    // 3. SCROLL ANIMATIONS (IntersectionObserver)
    // ══════════════════════════════════════════════════
    const animateElements = document.querySelectorAll(".animate");

    const observerOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => scrollObserver.observe(el));

    // ══════════════════════════════════════════════════
    // 4. ACTIVE NAV LINK HIGHLIGHTING
    // ══════════════════════════════════════════════════
    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollPos >= top && scrollPos < top + height) {
                allNavLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    updateActiveLink();

    // ══════════════════════════════════════════════════
    // 5. PARALLAX TILT ON DASHBOARD (desktop only)
    // ══════════════════════════════════════════════════
    const dashboardArea = document.getElementById("dashboardArea");

    if (dashboardArea && dashboard && window.matchMedia("(min-width: 769px)").matches) {
        dashboardArea.addEventListener("mousemove", (e) => {
            const rect = dashboardArea.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            const rotateX = y * -6;
            const rotateY = x * 6;

            dashboard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${Math.sin(Date.now() / 1000) * 6}px)`;
        });

        dashboardArea.addEventListener("mouseleave", () => {
            dashboard.style.transform = "";
        });
    }

    // ══════════════════════════════════════════════════
    // 6. COUNTER ANIMATION (Stats section)
    // ══════════════════════════════════════════════════
    const statNumbers = document.querySelectorAll(".stat-number[data-target]");
    let countersTriggered = false;

    function animateCounters() {
        if (countersTriggered) return;
        countersTriggered = true;

        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute("data-target"));
            const duration = 2000;
            const start = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                // Format with suffix
                if (target >= 10000) {
                    counter.textContent = current >= 10000 ? `${(current / 1000).toFixed(0)}K+` : current.toLocaleString();
                } else if (target === 99) {
                    counter.textContent = `${current}%`;
                } else if (target === 4) {
                    counter.textContent = `${(eased * target).toFixed(1)}★`;
                } else if (target >= 100) {
                    counter.textContent = `${current}+`;
                } else {
                    counter.textContent = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // Observe stats section
    const statsSection = document.querySelector(".stats-ticker");
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // ══════════════════════════════════════════════════
    // 7. SMOOTH SCROLL FOR ANCHOR LINKS
    // ══════════════════════════════════════════════════
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPos,
                    behavior: "smooth"
                });
            }
        });
    });

    // ══════════════════════════════════════════════════
    // 8. PROGRESS BAR ANIMATION
    // ══════════════════════════════════════════════════
    const progressFill = document.querySelector(".progress-fill");
    if (progressFill) {
        progressFill.style.width = "0%";

        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        progressFill.style.transition = "width 1.5s cubic-bezier(0.16, 1, 0.3, 1)";
                        progressFill.style.width = "78%";
                    }, 400);
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        progressObserver.observe(progressFill.closest(".dashboard") || progressFill);
    }

});