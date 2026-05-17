/* eslint-disable no-alert */
(function () {
  var csrfToken = "";

  function fetchCsrf() {
    return fetch("/api/csrf", { credentials: "same-origin" })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        csrfToken = d.token || "";
      })
      .catch(function () {
        csrfToken = "";
      });
  }

  fetchCsrf();

  window.submitForm = function submitForm() {
    var n = document.getElementById("fn").value.trim();
    var p = document.getElementById("fp").value.trim();
    var e = document.getElementById("fe").value.trim();
    var d = document.getElementById("fd").value.trim();
    var hp = document.getElementById("website_hp");
    var consent = document.getElementById("consent");

    if (!n || !p) {
      alert("Пожалуйста, заполните имя и телефон");
      return;
    }
    if (consent && !consent.checked) {
      alert("Необходимо согласие на обработку персональных данных");
      return;
    }

    var btn = document.querySelector(".form-btn");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Отправка…";
    }

    fetch("/api/leads", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        name: n,
        phone: p,
        email: e || undefined,
        description: d || undefined,
        consent: true,
        website: hp ? hp.value : "",
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { ok: res.ok, data: data };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          throw new Error(result.data.error || "Ошибка отправки");
        }
        document.getElementById("formContent").style.display = "none";
        var ok = document.getElementById("formOk");
        ok.style.display = "block";
        ok.classList.add("show");
      })
      .catch(function (err) {
        alert(err.message || "Не удалось отправить заявку. Попробуйте позже или позвоните нам.");
        fetchCsrf();
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Отправить заявку";
        }
      });
  };

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (x) {
          if (x.isIntersecting) {
            x.target.style.animationPlayState = "running";
            io.unobserve(x.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(
        ".svc-card,.project-card,.bim-feat,.exp-card,.team-card,.about-feat",
      )
      .forEach(function (el) {
        el.style.opacity = "0";
        el.style.animation = "fadeInUp 0.5s ease forwards paused";
        io.observe(el);
      });
  }

  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var drawer = document.getElementById("navDrawer");
    var closeBtn = document.getElementById("navClose");
    if (!toggle || !drawer) return;
    function openNav() {
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
    }
    function closeNav() {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
    toggle.addEventListener("click", function () {
      drawer.classList.contains("open") ? closeNav() : openNav();
    });
    if (closeBtn) closeBtn.addEventListener("click", closeNav);
    drawer.addEventListener("click", function (ev) {
      if (ev.target === drawer) closeNav();
    });
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 991) closeNav();
    });
  }

  initMobileNav();
})();
