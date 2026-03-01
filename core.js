const inputBox = document.getElementById("inputBox");
const addBoxBtn = document.getElementById("addBoxBtn");
const addPresetBtn = document.getElementById("addPresetBtn");
const totalEl = document.getElementById("total");
const bwtBox = document.getElementById("bodyWeight");

// 버튼 클릭 시 박스 추가
addBoxBtn.addEventListener("click", addBox);
// 프리셋 버튼
addPresetBtn.addEventListener("click", ()=>{
  currentBox = addBox();
  openModal();
});

// 박스 ID 관리
let boxCount = 0;

// 박스 추가 함수
function addBox() {
  //boxCount++;

  const box = document.createElement("div");
  box.className = ""

  // 박스 내부 내용
box.innerHTML = `
  <div class="bg-white p-3 rounded shadow w-full max-w-full text-sm innerbox">
    <!-- 1행 -->
    <div class="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center"> <!--grid-cols-[1fr_auto_auto_auto] -->
      <!-- 약물이름 -->
      <input type="text" placeholder="약물이름" data-i18n-placeholder="txt_drugname" 
        class="border p-1 rounded drugName flex-1 min-w-0 text-sm " />

      <div class="flex items-center gap-1">
        <!-- 약물용량 -->
        <input type="number" placeholder="약물량" min="0" step="0.1" data-i18n-placeholder="txt_dose" 
          class="border p-1 rounded drugDose w-12 text-right text-sm" />

        <!-- 약물단위 -->
        <select class="border p-1 rounded drugUnit w-14 text-sm">  
          <option value="mcg">mcg</option>
          <option value="mg" selected>mg</option>
          <option value="unit">unit</option>
        </select>
      </div>

      <!-- 구분선 -->
      <div class="text-center">/</div>

      <!-- 용액 용량 -->
      <div class="flex items-center">
        <input type="number" placeholder="용액량" min="0" step="0.1" data-i18n-placeholder="txt_total_fluid" 
          class="border p-1 rounded w-12 solutionVolume text-right text-sm" />
        <span class="ml-1">cc</span>
      </div>
    </div>

    <!-- 2행 -->
    <div class="grid grid-cols-[1fr_auto] gap-2 items-center mt-2"> <!--grid-cols-[1fr_auto]-->
      <div class="flex items-center gap-1">
        <!-- 주입속도 -->
        <input type="number" placeholder="주입속도" min="0" step="0.01" data-i18n-placeholder="txt_inj_speed" 
          class="border p-1 rounded infusionRate w-16 text-right text-sm" />

        <!-- 주입속도 단위 -->
        <select class="border p-1 rounded rateGram w-14 text-right text-sm">
          <option value="mcg">mcg</option>
          <option value="mg">mg</option>
          <option value="unit">unit</option>
        </select>

        <select class="border p-1 rounded rateUnit w-20 text-sm">
          <option value="/kg/min">/kg/min</option>
          <option value="/kg/hr">/kg/hr</option>
          <option value="/min">/min</option>
          <option value="/hr">/hr</option>
        </select>
      </div>

      <!-- 결과값 -->
      <div class="flex items-center justify-end font-bold text-blue-600 text-md">
        = <span class="ml-2 result text-lg">0 cc/hr</span>
      </div>
    </div>

    
  </div>
  <!-- 버튼 -->
  <div class="flex justify-between mt-1">
    <!-- 왼쪽 버튼들 -->
    <div class="flex gap-1">
      <button class="border p-1 rounded bg-white BtnDown text-sm">➖</button>
      <input type="number"  value="0.01" min="0.01" class="border p-1 rounded bg-white infusionValue w-12 text-center text-sm" />
      <button class="border p-1 rounded bg-white BtnUp text-sm">➕</button>
      <button class="border mx-2 p-1 px-2 rounded bg-white BtnPreset text-sm">📖<span data-i18n="txt_presets">프리셋</span></button> <!--✅-->
    </div>

    <!-- 오른쪽 버튼 -->
    <div>
      <!-- 삭제버튼 -->
      <button class="border p-1 px-2 rounded bg-white BtnDelete text-sm">❌<span data-i18n="bt_delete_rule">삭제</span></button>
    </div>
  </div>
`;


  inputBox.appendChild(box);

  //삭제버튼
  box.querySelector(".BtnDelete").addEventListener("click", () => {
    box.remove();
    saveData();
  });
  //증가버튼
  box.querySelector(".BtnUp").addEventListener("click", () => {
    let delta = parseFloat(box.querySelector(".infusionValue").value) || 0.001;
    const doseInput = box.querySelector(".infusionRate");
    doseInput.value = Number( ((parseFloat(doseInput.value) || 0) + delta).toFixed(3) );
    updateDrugBox(box, false);
  });
  //감소버튼
  box.querySelector(".BtnDown").addEventListener("click", () => {
    let delta = parseFloat(box.querySelector(".infusionValue").value) || 0.001;
    const doseInput = box.querySelector(".infusionRate");
    doseInput.value =Number( ( Math.max((parseFloat(doseInput.value) || 0) - delta, 0)).toFixed(3) ) ;
    updateDrugBox(box, false);
  });
  //프리셋 버튼
  box.querySelector(".BtnPreset").addEventListener("click", () => {
    currentBox = box; //e.target.closest(".bg-white"); // 현재 박스 저장
    openModal();
  });
  //값 보정
  box.querySelector(".infusionValue").addEventListener("change", () => {
    let delta = parseFloat(box.querySelector(".infusionValue").value) || 0.001;
    if(delta<0.001) {
      box.querySelector(".infusionValue").value = 0.001;
    } 
  });

  // 이벤트 등록 (값이 바뀔 때 총합 업데이트)
    box.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => updateDrugBox(box));
    box.addEventListener("change", () => updateDrugBox(box));
  });

  //번역
  applyTranslations();
  return box;
}
/* 브라우저 언어 설정*/
const userLang = navigator.language || navigator.userLanguage || "en"; 
console.log("브라우저 언어:", userLang);
document.getElementById("langSwitcher").value = userLang.includes("ko") ? "Korean" : "English"; 
currentLang = document.getElementById("langSwitcher").value;
applyTranslations();

/**
 * 숫자를 현지화된 문자열로 변환하는 함수
 * @param {number} value - 변환할 숫자
 * @param {string} locale - 국가 코드 (기본값: 브라우저 설정)
 */
function formatLocaleNumber(value, locale = userLang) {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

//모달 프리셋 버튼
function openModal() {
  document.getElementById("drugModal").classList.remove("hidden");
  loadDrugs();
}
document.getElementById("drugModal").addEventListener("click", (e) => {
  if (e.target.id === "drugModal") {
    closeModal();
  }
});
function closeModal() {
  document.getElementById("drugModal").classList.add("hidden");
  document.getElementById("drugSearch").value = "";
}

// 체중 상자
let Interval = null;
let intervalN =0;
function parseBwt(value){
  
  bwtBox.value = Number( ((parseFloat(bwtBox.value) || 0) + value).toFixed(1) );
  updateAllBoxes(false);
}
function deltaBwt(delta = 0){
  clearInterval(Interval);
  intervalN =0;
  parseBwt(delta);
  //console.log("BtnBwtUp");
  Interval = setInterval(() => {
    intervalN++;
    //console.log(parseFloat(bwtBox.value)%1);
    if(Math.abs(delta)<1 && (intervalN>9 && parseFloat(bwtBox.value)%1==0)){
      delta *=10;
    }
    parseBwt(delta);
  }, 120);
}
document.getElementById("BtnBwtUp").addEventListener("touchstart", () => {
  deltaBwt(0.1);
});
document.getElementById("BtnBwtDown").addEventListener("touchstart", () => {
  deltaBwt(-0.1);
});
document.getElementById("BtnBwtUp").addEventListener("mousedown", () => {
  deltaBwt(0.1);
});
document.getElementById("BtnBwtDown").addEventListener("mousedown", () => {
  deltaBwt(-0.1);
});
document.addEventListener("mouseup", () => {
  clearInterval(Interval);
  intervalN =0;
});
document.addEventListener("touchend", () => {
  clearInterval(Interval);
  intervalN =0;
});

bwtBox.addEventListener("input", () => updateAllBoxes());
function updateAllBoxes(save=true) {
  document.querySelectorAll("#inputBox > div").forEach(box => {
    updateDrugBox(box, save);
  });
}

function updateDrugBox(box, save=true) {
  const drugDose = parseFloat(box.querySelector(".drugDose").value) || 0;
  const vol = parseFloat(box.querySelector(".solutionVolume").value) || 0;
  const drugUnit = box.querySelector(".drugUnit").value;

  const rate = parseFloat(box.querySelector(".infusionRate").value) || 0;
  const rateGram = box.querySelector(".rateGram").value;
  const rateUnit = box.querySelector(".rateUnit").value;


  //console.log(`drugDose: ${drugDose} ${drugUnit}, vol: ${vol}, rate: ${rate} ${rateGram}${rateUnit}`);
    

  let bodyWeight = parseFloat(bwtBox.value) || 0;
  let _min = 0;
  let _dose = 0;
  let _doseUnit = 1;

  if(drugUnit == "mcg") {
    _doseUnit = 1000;
  }
  if(drugUnit == "mg") {
    _doseUnit = 1;
  }
  if(drugUnit == "unit") {
    _doseUnit = 1;
  }

  //약물 단위
  if(rateGram == "mcg") {
    _dose = 1000;
  }else{
    _dose = 1;
  }
  //시간 단위
  switch(rateUnit) {
    case "/kg/min":
      _min = 60;
      break;  
    case "/kg/hr":
      _min = 1;
      break;  
    case "/min":
      _min = 60;
      bodyWeight = 1;
      break; 
    case "/hr":
      _min = 1;
      bodyWeight = 1;
      break;  
  }
  if((drugUnit=="unit" && rateGram =="unit") || ( drugUnit !="unit" && rateGram !="unit")) {
    
  }else{
    //alert("약물단위와 주입속도 단위를 동일하게 설정해주세요.");
    box.querySelector(".result").textContent = "단위오류";
    return;
  }

  // 💡 여기서 계산식 정의 (예시: 결과 = (숫자 * rate) / vol)
  //const result = vol > 0 ? ((num * rate) / vol).toFixed(2) : 0;
  const result = (rate * vol * bodyWeight * _min) / (drugDose * _dose) *_doseUnit ;

  box.querySelector(".result").textContent = formatLocaleNumber(result) + " cc/hr";
  //console.log(new Intl.NumberFormat('fr-DZ').format(result));
  if(save){
    saveData();
  }
}

// 약물 프리셋 로드
let drugData = [];  // JSON 전체 저장
let currentBox = null;  // 선택된 box 저장

async function loadDrugs() {
  const res = await fetch("PresetListDatas.json");  // JSON 불러오기
  const json = await res.json();
  drugData = json.list; // 내부 list 배열 저장

  renderDrugList(drugData);
  //openModal();
}

function renderDrugList(drugs) {
  const list = document.getElementById("drugList");
  list.innerHTML = "";

  drugs.forEach((drug, idx) => {
    const li = document.createElement("li");

  let txt_category = "txt_" + drug.category; // i18n key 생성
  let txt_name = drug.Tag;
  //console.log(drug);

  li.innerHTML = `
    <button class="w-full text-left border p-2 rounded"
      onclick="applyDrug(${idx})">
      <b><span data-i18n="${txt_name}"> ${translate(drug.Tag)??drug.drugName}</span></b>
      (${drug.drugDose}${drug.drugGram} / ${drug.fluidTotalcc}cc) 
      <span class="text-gray-500 text-sm">
        [<span data-i18n="${txt_category}">${translate(`txt_${drug.category}`)??drug.category}</span>]
      </span>
    </button>`;
    li.querySelector("button").classList.add(categoryColors[drug.category]||"bg-white");
    list.appendChild(li);
  });
}
const categoryColors ={
  Inotrope: "bg-yellow-100",
  Sedation: "bg-blue-100",
  NeuromuscularBlocker: "bg-purple-100",
  Cardiovascular: "bg-red-100",
  Anticoagulation: "bg-green-100"
}

function filterDrugs() {
  const keyword = document.getElementById("drugSearch").value.toLowerCase();
  const filtered = drugData.filter(drug =>
    translate(drug.Tag,"Korean").toLowerCase().includes(keyword) ||
    translate(drug.Tag,"English").toLowerCase().includes(keyword) ||
    translate(`txt_${drug.category}`,"Korean").toLowerCase().includes(keyword)||
    translate(`txt_${drug.category}`,"English").toLowerCase().includes(keyword)
  );
  renderDrugList(filtered);
}
function applyDrug(index) {
  const drug = drugData[index];
  if (currentBox) {
    currentBox.querySelector(".drugName").value = translate(drug.Tag)??drug.drugName;
    currentBox.querySelector(".drugDose").value = drug.drugDose;
    currentBox.querySelector(".drugUnit").value = drug.drugGram;
    currentBox.querySelector(".solutionVolume").value = drug.fluidTotalcc;
    currentBox.querySelector(".infusionRate").value = drug.drugSpeed;
    currentBox.querySelector(".infusionValue").value = drug.drugSpeed;
    currentBox.querySelector(".innerbox").classList.remove("bg-white", "bg-yellow-100", "bg-blue-100", "bg-purple-100", "bg-red-100", "bg-green-100");
    currentBox.querySelector(".innerbox").classList.add(categoryColors[drug.category]||"bg-white");

    const rate = drug.drugSpeedtxt.split("/");
    currentBox.querySelector(".rateGram").value = rate[0];
    let string ="";
    for(let i=1; i<rate.length; i++) {
      string += "/"+rate[i];
    }
    currentBox.querySelector(".rateUnit").value = string;

    updateDrugBox(currentBox);
  }
  closeModal();
  saveData();
}
///// localStrorage

function saveData() {
  const groups = document.querySelectorAll('.innerbox');
  const allData = [];

  groups.forEach((currentBox) => {
    const groupData = {};
    groupData['drugName'] = currentBox.querySelector(".drugName").value;
    groupData['drugDose'] =currentBox.querySelector(".drugDose").value;
    groupData['drugUnit'] =currentBox.querySelector(".drugUnit").value;
    groupData['solutionVolume'] =currentBox.querySelector(".solutionVolume").value;
    groupData['infusionRate'] =currentBox.querySelector(".infusionRate").value ;
    groupData['rateGram'] =currentBox.querySelector(".rateGram").value ;
    groupData['rateUnit'] =currentBox.querySelector(".rateUnit").value ;

    const bgColor = [...currentBox.classList].find(cls => cls.startsWith('bg-'));
    groupData['category'] = bgColor;
    groupData['infusionValue'] = currentBox.parentElement.querySelector('.infusionValue').value;

    allData.push(groupData);
    //console.log(groupData);
  });

  localStorage.setItem('multiDivData', JSON.stringify(allData));

  console.log('저장되었습니다!');
}
function loadData() {
  const savedData = localStorage.getItem('multiDivData');
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    console.log('로드된 데이터:', parsedData);
    parsedData.forEach((data) => {
      const box = addBox();
      box.querySelector(".drugName").value = data['drugName'];
      box.querySelector(".drugDose").value = data['drugDose'];
      box.querySelector(".drugUnit").value = data['drugUnit'];
      box.querySelector(".solutionVolume").value = data['solutionVolume'];
      box.querySelector(".infusionRate").value = data['infusionRate'];
      box.querySelector(".rateGram").value = data['rateGram'];
      box.querySelector(".rateUnit").value = data['rateUnit'];
      box.querySelector(".infusionValue").value = data['infusionValue'];
      box.querySelector(".innerbox").classList.remove("bg-white", "bg-yellow-100", "bg-blue-100", "bg-purple-100", "bg-red-100", "bg-green-100");
      box.querySelector(".innerbox").classList.add(data['category']||"bg-white");
      updateDrugBox(box);
    });
  }
}
loadData();
/////

const noticeModal = document.getElementById("noticeModal");
document.getElementById("noticeBtn").addEventListener("click", openNoticeModal);
noticeModal.addEventListener("click", (e) => {
  if (e.target.id === "noticeModal") {
    closeNoticeModal();
  } 
});
function openNoticeModal() {
  noticeModal.classList.remove("hidden");
}
function closeNoticeModal() {
  noticeModal.classList.add("hidden");
}
openNoticeModal(); // 공지사항 모달 자동 열기