// i18n.js
let i18nMap = {};
let currentLang = "Korean"; // 기본 언어 설정, English, Korean 등
const langList = ["Korean", "English"];

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
function translate(key, lang = currentLang) {
  //console.log(i18nMap[currentLang][key]);
  if (i18nMap[lang] && i18nMap[lang][key]) {
    return i18nMap[lang][key]??key;
  }
  return key;
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
  //공지사항 번역
  // 2. 데이터 가져오기 및 분할
  const rawText = noticeData[currentLang];
  const noticeArray = rawText.split('//').map(item => item.trim()); // 공백 제거 포함

  // 3. HTML 생성 및 삽입 (Tailwind 클래스 적용)
  const listHtml = noticeArray.map(text => `
    <li class="whitespace-pre-line p-1 mb-2 bg-gray-100 border-l-4 border-blue-400 shadow-sm 
               hover:bg-gray-50 list-none
               first:bg-blue-100 first:text-black first:border-blue-800">${text} </li>
  `).join('');
  
  document.getElementById("noticeText").innerHTML = listHtml;
}
  document.addEventListener("DOMContentLoaded", () => {
  loadI18n();
  
  document.getElementById("langSwitcher").addEventListener("change", e => {
    currentLang = e.target.value;
    applyTranslations();
  });
  
});

const noticeData = {
  Korean: "0.8.4\n 유럽/대륙권 언어 사용자에서 소숫점이 콤마로 표시되도록 수정했습니다 //0.8.3\n 사파리를 제외한 모바일 웹에서 확대 동작이 되지 않도록 수정했습니다 //0.8.2\n현재 세팅한 값들이 저장되어 다음번에도 표시됩니다\n체중 증감량 터치 버튼이 작동하도록 수정했습니다 //0.7.6\n하단 UX가 멀리 벌어지지 않도록 수정했습니다 //0.7.5\n프리셋 기능을 추가했습니다\n프리셋 항목으로 추가 시 카테고리 색상으로 변경됩니다",
  English: "0.8.4\n Fixed decimal points to appear as commas for European and continental language users // 0.8.3\n Disabled pinch-to-zoom on mobile web (excluding Safari) // 0.8.2\n Your current settings are now saved and will be restored next time\n Fixed the weight change touch buttons to work correctly // 0.7.6\n Adjusted bottom UX spacing to prevent excessive gaps // 0.7.5\n Added Preset feature\n Items added as presets will now change to their category color"
};
/*

 <li>= 0.8.4 =</li>
<li>유럽/대륙권 언어 사용자에서 소숫점이 콤마로 표시되도록 수정했습니다</li>
<li>= 0.8.3 =</li>
<li>사파리를 제외한 모바일 웹에서 확대 동작이 되지 않도록 수정했습니다</li>
<li>= 0.8.2 =</li>
<li>현재 세팅한 값들이 저장되어 다음번에도 표시됩니다</li>
<li>체중 증감량 터치 버튼이 작동하도록 수정했습니다</li>
<li>= 0.7.6 =</li>
<li>하단 UX가 멀리 벌어지지 않도록 수정했습니다</li>
<li>= 0.7.5 =</li>
<!--<li>Cloudflare 서비스 장애로 인해 내장 Tailwind.css로 변경</li>-->
<li>프리셋 기능을 추가했습니다</li>
<li>프리셋 항목으로 추가 시 카테고리 색상으로 변경됩니다</li>
*/