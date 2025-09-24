// JavaScript source code
//document.write('<script src="PresetDrugList.js"></script>');


const BWTinput = document.querySelector('#bwtinput');

const drugNameTxt = document.getElementsByClassName("drugnametxt");
const drugDose = document.getElementsByClassName('drugdose');
const fluidCC = document.getElementsByClassName('fluidcc');
const doseBt = document.getElementsByClassName('dosebt');

const drugSpeed = document.getElementsByClassName('drugspeed');
const drugSpeedTxt = document.getElementsByClassName('drugspeedtxt');
const drugResult = document.getElementsByClassName('drugresult');
const valueTxxt = document.getElementsByClassName('valueTxt');

const drugItemID = document.getElementById("drugitemid");
const addBt = document.getElementById("addbt");
const position = document.getElementById("position");

//프리셋 데이터
const presetBt = document.getElementById("presetbt");
const iconX = document.getElementById("iconX");
const presetPanel = document.getElementById("presetPanel");
const presetItemID = document.getElementById("presetItemID");
const presetPosition = document.getElementById("presetPosition");
const presetPage = document.getElementById("presetpage");
const prevBt = document.getElementById("prevBt");
const nextBt = document.getElementById("nextBt");


//메인메뉴 데이터
const mainMenuBt = document.getElementById("civIcon");
const menuPanel = document.getElementById("menuPanel");
const menuX = document.getElementById("menuiconX");

//메인메뉴 모달
mainMenuBt.addEventListener("mousedown", function (e) {
    //메뉴 토글
    menuPanel.style.display = "inline";
})
menuX.addEventListener("mousedown", fmodalClose);

//프리셋 모달
iconX.addEventListener("mousedown", fmodalClose);
presetBt.addEventListener("mousedown", function (e) {
    //프리셋 모달 켜기
    presetPanel.style.display = "inline";
    fpresetSet();
})
//모달 끄기 공통
function fmodalClose(e) {
    //프리셋 모달 끄기
    e.currentTarget.parentNode.style.display = "none";
}
addBt.addEventListener('click', function (e) {
    //추가 버튼
   addItem(null);
})
window.addEventListener('input', function (e) {
    update();
});
window.addEventListener('keydown', function (e) {

    
    if (e.key == "Escape") {
        //console.log(e.key);
        if (presetPanel.style.display != "none") {
            presetPanel.style.display = "none";
        }
        else if (menuPanel.style.display != "none") {
            menuPanel.style.display = "none";
        } else {
            menuPanel.style.display = "inline";
        }
    }
})
//아이템 추가
function addItem( object ){
     const item = drugItemID.content.cloneNode(true);
     const drugnameTxt = item.querySelector(".drugnametxt");
     const drugdoseTxt = item.querySelector(".drugdose");
    const fluidccTxt = item.querySelector(".fluidcc");
    const dosebt = item.querySelector(".dosebt");
    
     const drugspeedTxt = item.querySelector(".drugspeed");
     const drugspeedTxtbox = item.querySelector(".drugspeedtxt");

    //스피드버튼
    const upBt = item.querySelector(".speedBt.up");
    const downBt = item.querySelector(".speedBt.down");
    //변환값 저장
    const valueTxt = item.querySelector(".valueTxt");

     if(object !=null){
         drugnameTxt.value = object.drugName;
         drugdoseTxt.value = object.drugDose;
         dosebt.value = 1;
         if (object.drugGram == "mg") {
             dosebt.value = 1;
         }
         if (object.drugGram == "mcg") {
             //drugdoseTxt.value = object.drugDose;// * 0.001;
             dosebt.value = 1000;
         }
         if (object.drugGram == "unit") {
             dosebt.value = -1;
         }
         fluidccTxt.value = object.fluidTotalcc;
         drugspeedTxt.value = object.drugSpeed;
         drugspeedTxtbox.value = object.drugSpeedtxt;
         
    }
    let vel = 0.01;
    if (drugspeedTxt.value >= 0.01) {
        vel = 0.01;
    }
    if (drugspeedTxt.value >= 0.1) {
        vel = 0.1;
    }
    if (drugspeedTxt.value >= 1) {
        vel = 1;
    }
    valueTxt.value = vel;
    drugspeedTxt.addEventListener('input', function () {
        let vel = 0.01;
        if (drugspeedTxt.value >= 0.01) {
            vel = 0.01;
        }
        if (drugspeedTxt.value >= 0.1) {
            vel = 0.1;
        }
        if (drugspeedTxt.value >= 1) {
            vel = 1;
        }
        valueTxt.value = vel;
        //console.log(vel);
    })

    upBt.addEventListener('mousedown', function (e) {
 
        if (drugspeedTxt.value != null) {
            let result = (Math.round((Number(drugspeedTxt.value) + Number(valueTxt.value)) * 100) / 100).toFixed(2);
            drugspeedTxt.value = Number(result);
            update();
        }
    })
    downBt.addEventListener('mousedown', function (e) {

        if (drugspeedTxt.value != null) {
            let result = (Math.round((Number(drugspeedTxt.value) - Number(valueTxt.value)) * 100) / 100).toFixed(2)
            drugspeedTxt.value = Number(result);
            
            if (drugspeedTxt.value <= 0) {
                drugspeedTxt.value = 0;
            }
            update();
        }
    })
    /*drugnameTxt.addEventListener("touchstart", function (e) {
        e.currentTarget.value = "";
    })
    drugnameTxt.addEventListener("mousedown", function (e) {
        e.currentTarget.value = "";
    })*/
    // drugnameTxt.addEventListener("change", drugsearch);
    item.querySelector(".xbt").addEventListener("mousedown", function (e) {
        /*부모에서 색인해서 해당 객체 삭제*/
        for (i = 0; i < position.childNodes.length; i++) {
            if (position.childNodes[i] == e.currentTarget.parentNode.parentNode) {
                position.removeChild(position.childNodes[i]);
                break;
            }
        }
    })

    position.appendChild(item);
    update();
}
/**
 * @param {InputEvent} e 
 */


const update = function () {
    //console.log(BWTinput.value);
    
    //
    for (let i = 0; i < drugResult.length; i++) {
        let _drugnametxt = drugNameTxt[i].value;
        let _doseBt = doseBt[i].value;
        //console.log(_doseBt);
        
        let _bwt = Number(BWTinput.value);

        let _min = 0;
        let _dose = 0;

        let _drugdose = Number(drugDose[i].value);
        let _fluidcc = Number(fluidCC[i].value);

        let _drugspeed = drugSpeed[i].value;
        let _drugspeedtxt = drugSpeedTxt[i].value;
        let _result = 0;

        if (_doseBt > 0) {
            //mcg, mg일 경우
            _min = 0;
            switch (_drugspeedtxt) {

                case "mcg/kg/min":
                    _min = 60;
                    _dose = 1000;
                    break;
                case "mcg/kg/hr":
                    _min = 1;
                    _dose = 1000;
                    break;
                case "mcg/min":
                    _min = 60;
                    _dose = 1000;
                    _bwt = 1;
                    break;
                case "mcg/hr":
                    _min = 1;
                    _dose = 1000;
                    _bwt = 1;
                    break;
                //mg
                case "mg/kg/min":
                    _min = 60;
                    _dose = 1;
                    break;
                case "mg/kg/hr":
                    _min = 1;
                    _dose = 1;
                    break;
                case "mg/min":
                    _min = 60;
                    _dose = 1;
                    _bwt = 1;
                    break;
                case "mg/hr":
                    _min = 1;
                    _dose = 1;
                    _bwt = 1;
                    break;

            }
            _result = (_drugspeed * _fluidcc * _bwt * _min) / (_drugdose * _dose) * _doseBt;
        } else if (_doseBt < 0) {
            _min = 0;
            switch (_drugspeedtxt) {
                //unit
                 case "unit/kg/min":
                    _min = 60;
                    _dose = 1;
                    break;
                case "unit/kg/hr":
                    _min = 1;
                    _dose = 1;
                    break;
                case "unit/min":
                    _min = 60;
                    _dose = 1;
                    _bwt = 1;
                    break;
                case "unit/hr":
                    _min = 1;
                    _dose = 1;
                    _bwt = 1;
                    break;
      
            }
            _result = (_drugspeed * _fluidcc * _bwt * _min) / (_drugdose * _dose) * -_doseBt;
        }

        
        drugResult[i].innerText = ` = ${_result.toFixed(1)}cc/hr `;
       
        
    }
}
function fcalculate(value = 0) {

}

function fsearchPresetList(_tag) {
    for (let i = 0; i < presetList.length; i++) {
        if (presetList[i].Tag == _tag) {

            return presetList[i];
        }
    }
    return null;
}
let n = 0;
let m = 0;
prevBt.addEventListener("mousedown", function (e) {
    if (n > 0) {
        n -= 1;
        fpresetSet();
    }
})
nextBt.addEventListener("mousedown", function (e) {
    if (n < m) {
        n += 1;
        fpresetSet();
    }
})


function fpresetSet() {
    //height 46.4 + 10px // 
    fpresetclear();
    let count = Math.floor((window.innerHeight - 46 - 28 - 25-30) / 68.4);//- 120
    m = Math.floor(presetList.length / count) ;
  //  console.log(count);
    presetPage.value = `${n+1}/${m+1} `
    for (let i = n*count; i < presetList.length; i++) {

        
        if (i < (n+1) * count) {
            let data = presetList[i];
            const item = presetItemID.content.cloneNode(true);
            item.querySelector(".presetItemAddBt").addEventListener("mousedown", function (e) {
           
               //console.log(data);
                addItem(data);
                presetPanel.style.display = "none";
            })

            item.querySelector("#presetName").value = `${data.drugName} `  ;
            item.querySelector("#presetDose").value = `${data.drugDose}mg/${data.fluidTotalcc}cc`;
            item.querySelector("#drugSpeed").value = `${data.drugSpeed}~${data.maxSpeed} ${data.drugSpeedtxt}`;
            presetPosition.appendChild(item);
        }
        
    }
}
function fpresetclear(){
    for (i = 0; i < presetPosition.childNodes.length; i++) {
        presetPosition.removeChild(presetPosition.childNodes[i]);
        i--;
        if (presetPosition.childNodes.length <= 0) {
            break;
        }  
    }
}