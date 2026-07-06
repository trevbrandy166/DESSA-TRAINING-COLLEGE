function toggleMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  menu.classList.toggle("hidden");
}

window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("shadow-md");
  } else {
    navbar.classList.remove("shadow-md");
  }
});

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll("section").forEach((section) => {
  observer.observe(section);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

function selectProgram(code, name) {
  document.getElementById("apply").scrollIntoView({ behavior: "smooth" });
  const select = document.getElementById("program-select");
  if (select) {
    select.value = code;
    select.classList.add("ring-2", "ring-yellow-500");
    setTimeout(
      () => select.classList.remove("ring-2", "ring-yellow-500"),
      1000,
    );
  }
}
