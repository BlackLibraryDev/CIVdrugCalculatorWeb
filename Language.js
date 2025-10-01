// i18n.js
let i18nMap = {};
let currentLang = "Korean"; // 기본 언어 설정

async function loadI18n() {
  const res = await fetch("Language.json");
  const data = await res.json();

  const keys = data.languages.find(l => l.language === "Tag").value;

  data.languages.forEach(lang => {
  const langKey = lang.language.trim();  // <-- 여기서 개행 제거
  if (langKey === "Tag") return;

  i18nMap[langKey] = {};
  lang.value.forEach((val, idx) => {
    const key = keys[idx];
    i18nMap[langKey][key] = val.trim();
  });
});

  applyTranslations();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (i18nMap[currentLang] && i18nMap[currentLang][key]) {
      el.textContent = i18nMap[currentLang][key];
    }
  });
   // ✅ placeholder 번역
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (i18nMap[currentLang] && i18nMap[currentLang][key]) {
      el.setAttribute("placeholder", i18nMap[currentLang][key]);
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  loadI18n();
  
  document.getElementById("langSwitcher").addEventListener("change", e => {
    currentLang = e.target.value;
    applyTranslations();
  });
  
});