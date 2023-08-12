const KEY = "theme";
const theme = localStorage.getItem(KEY);
const preferDark = window.matchMedia("(prefers-color-scheme: dark)");
const themeToggler = document.querySelector("#theme-toggler");

const changeThemeIcon = (dark) => (dark ? "🌙" : "🔆");

if (themeToggler) {
  if ((!theme?.match && preferDark.matches) || theme === "dark") {
    localStorage.setItem(KEY, "dark");
    themeToggler.innerText = changeThemeIcon(true);
    document.body.setAttribute("data-theme", "dark");
  } else {
    localStorage.setItem(KEY, "light");
    themeToggler.innerText = changeThemeIcon(false);
    document.body.setAttribute("data-theme", "light");
  }

  themeToggler?.addEventListener("click", () => {
    if (localStorage.getItem(KEY) === "dark") {
      localStorage.setItem(KEY, "light");
      themeToggler.innerText = changeThemeIcon(false);
      document.body.setAttribute("data-theme", "light");
    } else {
      localStorage.setItem(KEY, "dark");
      themeToggler.innerText = changeThemeIcon(true);
      document.body.setAttribute("data-theme", "dark");
    }
  });
}

const navLinkEl = document.querySelectorAll("header li > a");
navLinkEl.forEach((linkEl) => {
  if (linkEl.href === location.href) {
    linkEl.style.fontWeight = "bold";
  }
});
