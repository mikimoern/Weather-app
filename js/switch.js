const btnDarkMode = document.querySelector(".nav__switching-themes");


// Проверка на уровне системных настроек
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
  btnDarkMode.classList.add("nav__switching-themes--active");
  document.body.classList.add("light");
}


// Проверка светлой темы в localStorage 
if (localStorage.getItem("darkMode") === "light") {
  btnDarkMode.classList.add("nav__switching-themes--active");
  document.body.classList.add("light");
} else if (localStorage.getItem("darkMode") === "dark") {
  btnDarkMode.classList.remove("dark-mode-btn--active");
  document.body.classList.remove("light");
}

// Если меняться системный настройки, (автоматичемки днем - светлая, ночью - темная)
window.matchMedia("(prefers-color-scheme: light)").addEventListener('change', (event) => {

  const newColorScheme = event.matches ? "ligth" : "dark";

  if (newColorScheme === "light") {
    btnDarkMode.classList.add("nav__switching-themes--active");
    document.body.classList.add("light");
    localStorage.setItem("darkMode", "light");
  }else {
    btnDarkMode.classList.remove("nav__switching-themes--active");
    document.body.classList.remove("light");
    localStorage.setItem("darkMode", "dark");
  }
});

// Включение светлой темы по кнопке
btnDarkMode.onclick = function () {
  btnDarkMode.classList.toggle("nav__switching-themes--active");
  const isLight = document.body.classList.toggle("light");

  if (isLight) {
    localStorage.setItem('darkMode', 'light');
  } else {
    localStorage.setItem("darkMode", "dark");
  }

};