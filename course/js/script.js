// Solução Exportação de cursos Mói 11/20 by: pietroggsilva@gmail.com
// Config
var debug = true;
var timing = false;

// Code
var txt_infos;
var isLms = true;
var report_data = "";
var currentScreen = 0;
var p_done = [];
var sw_c = 0;
var tela4 = false;
const notFix = ["Practice 1", "Practice 2", "Practice 3"];

function init() {
    // Wait
    var waitForLoad = setInterval(function () {
        txt_infos = document.querySelectorAll('.qp-info-text');
        if (txt_infos.length) {
            log('Page Is Ready');
            try {
                script_scorm.init();
            } catch (error) {
                log("Page is not in Scorm Platform");
                isLms = false;
            }
            clearInterval(waitForLoad);
            insertLogo();
            // createReport();
            initListners();
            initUnderControl();
            readXml("dictionary\\words.xml");
            dictionary();
        } else {
            return;
        }
    }, 500)

}

function initListners() {

    // Unload Prevent
    window.onbeforeunload = function () {
        script_scorm.end();
    };

    // Get Scorm
    script_scorm.getSuspend();

    // Update report
    var reportListner = setInterval(function () {
        if (report_data != window.player.getLessonJSONReport()) {
            createReport();
        }
    }, 1000);

    // Pontuação
    var waitForComplet = setInterval(function () {
        try {
            if (window.player.getScore() == window.player.getScoreMax()) {
                log("Page is Done");
                script_scorm.complet();
                clearInterval(waitForComplet);
                if (!timing) {
                    script_scorm.end();
                }
            }
        } catch (error) {
            console.log("EL ERROR: " + error);
        }
    }, 1000);

    // Opens
    setTimeout(function () {
        data_scorm["opens"] += 1;
    }, 1000);

    // Time
    var countTimePass = setInterval(function () {
        data_scorm["seconds"] += 15;
        var sessionTime = formatScormTime(Math.round(data_scorm["seconds"]));
        script_scorm.setSupend(sessionTime);
    }, 15000);
}

var susp = null;

var data_scorm = {
    opens: 0,
    seconds: 0,
}

var script_scorm = {
    init: function () {
        if (!isLms) {
            return;
        }
        log("Script_Scorm: init");
        window.parent.API.LMSInitialize('');
        window.parent.API.LMSSetValue('cmi.core.score.min', '0');
        window.parent.API.LMSSetValue('cmi.core.score.max', '100');
        window.parent.API.LMSCommit('');
    },

    complet: function () {
        if (!isLms) {
            return;
        }
        log("Script_Scorm: complet");
        window.parent.API.LMSSetValue('cmi.core.lesson_status', 'completed');
        window.parent.API.LMSSetValue('cmi.core.score.raw', '100');
        window.parent.API.LMSCommit('');
    },

    getSuspend: function () {
        if (!isLms) {
            return;
        }
        log("Script_Scorm: getSuspend");
        try {
            susp = window.parent.API.LMSGetValue('cmi.suspend_data');
            log("Get Suspend_Data: " + [susp]);
            if (susp != "" && susp != null) {
                susp = susp.split(";");
                data_scorm["opens"] += parseInt(susp[0]);
                data_scorm["seconds"] += parseInt(susp[1]);
            } else {
                susp = null;
                log('No susp Avaible');
            }
        } catch (err) {

        }
    },

    setSupend: function (timeArg) {
        if (!isLms) {
            return;
        }
        log("Script_Scorm: setSupend");
        if (timing) {
            window.parent.API.LMSSetValue("cmi.core.session_time", timeArg);
        }
        var pivSusp = data_scorm["opens"] + ";" + data_scorm["seconds"];
        pivSusp = pivSusp.toString();
        window.parent.API.LMSSetValue("cmi.suspend_data", pivSusp);
        window.parent.API.LMSCommit('');
    },

    end: function () {
        if (!isLms) {
            return;
        }
        log("Script_Scorm: end");
        try {
            window.parent.API.LMSCommit('');
            window.parent.API.LMSFinish('');
            clearInterval(countTimePass);
            isLms = false;
        } catch (err) {
            log("Scorm já encerrado");
            isLms = false;
        }
    }
}

function log(text) {
    if (debug) {
        console.log('%c' + '>>>' + text + '<<<', 'color:#0080ff;font-weight: bold;');
    }
}

function insertLogo() {
    // CSS
    var logo_style = document.createElement('style');
    logo_style.type = 'text/css';
    logo_style.innerHTML = ".emp_copyright-button{cursor: default;} .emp_copyright-button *{cursor: default;} .quest_mag{margin-left: 68px; margin-top: 12px;} .quest_mag2{margin-left: 68px; margin-top: 2px;}";
    document.getElementsByTagName('head')[0].appendChild(logo_style);
}

var report = {};
const ignoreScreens = ['Content', 'Report', 'Credits'];

function createReport() {
    report_data = window.player.getLessonJSONReport();
    let obj = JSON.parse(report_data);
    let t_s = 0;
    let t_m = 0;
    Object.keys(obj.items).forEach((element, index) => {
        let x = obj.items[element];
        if (!ignoreScreens.includes(x.title)) {
            let co = "orange";
            let sc = 0;
            let ms = 0;
            let has = true;

            notFix.includes(x.title) ? sc = parseInt(x.result.done) : sc = parseInt(x.result.done + x.result.errors);
            ms = parseInt(x.result.todo);
            x.result.todo != 0 ? has = true : has = false;
            switch (x.title.substring(0, 4)) {
                case 'Lead':
                    co = 'orange';
                    break;
                case 'Main':
                    co = 'pink';
                    break;
                case 'Prac':
                    co = 'purple';
                    break;
                case 'Engl':
                    co = 'blue';
                    break;
            }

            report[x.title] = {
                "color": co,
                "score": sc,
                "maxScore": ms,
                "hasScore": has,
            }
            t_s += sc;
            t_m += ms;
        }
    });
    report["Total"] = {
        "color": "gray",
        "score": t_s,
        "maxScore": t_m,
        "hasScore": true
    }
    // console.log(report);
}

function initUnderControl() {
    try {
        var target = document.querySelector('.qp-page-in-page').childNodes[0];
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                let x = parseFloat(target.style.left) / 100;
                currentScreen = x == 0 ? 0 : (x * -1);
                console.log(`CS => ${currentScreen}`);
                prepareScreen();
            });
        });
        var config = { attributes: true };
        observer.observe(target, config);
    } catch (error) {
        console.log(`Cannot init observer, trying againt in 5 seconds \n Err ${error}`);
        setTimeout(initUnderControl, 5000);
    }
}

// Checar mobile avançado
var isMobile = false;

function mobileAndTabletCheck() {
    let check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    isMobile = check;
    return check;
};

function prepareScreen() {
    switch (currentScreen) {
        case 4:
            if (!tela4) {
                iniciarScriptButtons();
                tela4 = true;
            }
            break;
    }
}

function iniciarScriptButtons() {
    setTimeout(function () {
        let buttonsClickContainers = document.querySelectorAll(".qp-exlistbox-base-container-inner");

        buttonsClickContainers.forEach(function (element, index) {
            element.setAttribute("id", "base-button-" + index);

            // PARA DETECTAR O CLICK NO MOBILE
            if (mobileAndTabletCheck()) {
                element.addEventListener("touchend", function () {
                    comboboxCorrection(this);
                });
            }
            else {
                element.addEventListener("click", function () {
                    comboboxCorrection(this);
                });
            }
        });
    }, 300);
}

function comboboxCorrection(currentButton) {
    setTimeout(function () {
        let boxSelected = document.querySelector(".qp-exlistbox-popup-container");
        let buttonSelected = document.querySelector("#" + currentButton.id).parentElement.parentElement.parentElement;
        let currentHeightBoxSelected = parseInt(boxSelected.style.top.split("px")[0]);

        let distance = buttonSelected.getBoundingClientRect().top - boxSelected.getBoundingClientRect().top;
        boxSelected.style.top = (distance + currentHeightBoxSelected) + "px";
    }, 1);
}

/* DRAG COMUM */
function returnTopDif() {
    var doc = document.documentElement;
    return parseInt((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0));
}

// Dicionario

var block_dual = false;
var first_time = true;
var txt_audio_01;
var txt_audio_02;
var txt_audio_03;
var txt_audio_04;
var container_words;
var last_click = null;
var bt_play;
var audio;
// DICIONÁRIO
let bts_letras = [];
function dictionary() {
    let body = document.querySelector("body");
    body.id = "body";

    let bt_dictionary = document.querySelector('.qp-dictionary-button');
    bt_dictionary.onclick = function () {
        if (!block_dual) {
            block_dual = true;
            let dictionary_container = create('', "#body", "dictionary_filter", "pop");

            create('', "#dictionary_filter", "dictionary_container", "pop");

            // Column 01
            create('', "#dictionary_container", "column01", "columns");
            create('', "#column01", "search_container");

            let search = create('input', '#search_container', 'search');
            search.type = "text";
            search.oninput = () => {
                if (search.value.length >= 2) {
                    fillPanel(search.value, true);
                }
            }
            // search.addEventListener("change", (e)=>{console.log(e.target.value)});

            let bt_search = create('', '#search_container', 'bt_search');
            bt_search.onclick = () => {
                fillPanel(search.value, true);
            }

            // ROWS
            create('', "#column01", "container_rows");
            create('', "#container_rows", "row01", "rows");

            // BOTÕES ROW 02
            create('', "#container_rows", "row02", "rows");

            let row_1 = ["a", "c", "e", "g", "i", "k", "m", "o", "q", "s", "u", "w", "y", "b", "d", "f", "h", "j", "l", "n", "p", "r", "t", "v", "x", "z"];

            for (let i = 0; i < row_1.length; i++) {
                var num = i;
                i < 10 ? num = ("0" + i) : num = i;
                var row = i < 13 ? row = "#row01" : row = "#row02";
                let btn = create('', row, "bt_letra_" + i, "bts_letras");
                let txt_bt_letra = create('p', "#bt_letra_" + i, "txt_bt_letra_" + i, "bts_txts");
                txt_bt_letra.innerHTML = row_1[i];
                let bclick = () => {
                    fillPanel(row_1[i]);
                }
                btn.onclick = () => {
                    bclick();
                }
            }

            // TXT CONTAINER
            container_words = create('', '#column01', 'container_words');

            fillPanel("a");

            // Column 02
            create('', "#dictionary_container", "column02", "columns");

            // CONTAINER ÁUDIO
            create('', '#column02', 'audio_container');

            txt_audio_01 = create('p', '#audio_container', 'txt_audio_01', 'audios_txts');
            txt_audio_01.innerHTML = "<i>quantifier</i>";

            // ÁUDIO BOX
            create('', '#audio_container', 'box_audio');

            audio = new Audio(`dictionary\\media\\a_couple_of.mp3`);

            bt_play = create('', '#box_audio', 'bt_audio', 'bt_audios');
            bt_play.onclick = () => {
                audio.currentTime = 0;
                audio.play();
                bt_play.className = "bt_audios played";
            };

            cleanClassAudio();

            txt_audio_02 = create('p', '#box_audio', 'txt_audio_02', 'audios_txts');
            txt_audio_02.innerHTML = "a couple of";

            // TXTS CONTAINER ÁUDIO
            txt_audio_03 = create('p', '#audio_container', 'txt_audio_03', 'audios_txts');
            txt_audio_03.innerHTML = "a few";

            txt_audio_04 = create('p', '#audio_container', 'txt_audio_04', 'audios_txts');
            txt_audio_04.innerHTML = "&#8220I've brought a couple of sandwiches for us.&#8221";

            // BOTÃO DE FECHAR
            let bt_close = create('', "#column01", "bt_close");

            bt_close.onclick = function () {
                let pop = document.querySelectorAll(".pop");
                for (let i = 0; i < pop.length; i++) {
                    pop[i].parentNode.removeChild(pop[i]);
                }
            };
        }
        setTimeout(() => { block_dual = false }, 500);
    };
}

var word_array = []
var fillRange = 10;
var fillCount = 0;

function fillPanel(letra, search = false) {
    // Limpar
    if (container_words.childElementCount > 0) {
        while (container_words.lastElementChild) {
            first_time = false;
            container_words.removeChild(container_words.lastElementChild)
        }
    }

    //Reset
    last_click = null;
    var index = 0;
    var first_word = [];
    word_array = []
    fillRange = 10;
    fillCount = 0;

    //Criar palavra
    let create_word = (key, first = false) => {
        let btn;
        if (first) {
            btn = create('', "#container_words", "txt_container_" + index, "div_words first_word");
        } else {
            btn = create('', "#container_words", "txt_container_" + index, "div_words");
        }
        let txt_container = create('p', "#txt_container_" + index, "txt_" + index, "containers_txts");
        let remove_class = container_words.childNodes[0];
        txt_container.innerHTML = key;

        for (let i = 0; i < letra.length; i++) {
            first_word.push(key);
        }

        let nclick = () => {
            if (last_click != null) {
                last_click.style.cssText = "";
            }
            last_click = btn;
            let word = words[key];
            remove_class.className = "div_words";
            btn.style.cssText = "z-index: 1 !important; color: #fff !important; border-color: #E6388F !important; background: url(./img/btn_dictionary_list_selected.png) right center / 32px 32px no-repeat rgb(230, 56, 143); !important;"
            txt_audio_01.innerHTML = word["type"];
            txt_audio_02.innerHTML = key;
            txt_audio_03.innerHTML = word["desc"];
            txt_audio_04.innerHTML = `&#8220${word["examp"]}&#8221`;

            audio = new Audio(`dictionary\\media\\${word['sound']}`);

            bt_play.onclick = () => {
                audio.currentTime = 0;
                audio.play();
                bt_play.className = "bt_audios played";
            };

            cleanClassAudio();
        }
        btn.onclick = () => { nclick() };
        index++;

        //busca sempre o primeiro elemento
        if (first_time == false) {
            Object.entries(letra).forEach(([key, value]) => {
                let first_information = words[first_word[0]];

                txt_audio_01.innerHTML = first_information["type"];
                txt_audio_02.innerText = first_word[0];
                txt_audio_03.innerHTML = first_information["desc"];
                txt_audio_04.innerHTML = `&#8220${first_information["examp"]}&#8221`;

                audio = new Audio(`dictionary\\media\\${first_information['sound']}`);
                cleanClassAudio();
            });
        }
    }

    let create_see = () => {
        btn = create('', "#container_words", "txt_container_" + index, "div_words");
        let txt_container = create('p', "#txt_container_" + index, "txt_" + index, "containers_txts");
        let remove_class = container_words.childNodes[0];
        txt_container.innerHTML = "Show more";
        btn.onclick = () => { fill_amount(10, true) };
    }

    //busca
    if (!search) {
        Object.entries(words).forEach(([key, value]) => {
            if (key.substr(0, 1).toLowerCase() == letra) {
                // create_word(key);
                word_array.push(key)
            }
        });
    } else {
        Object.entries(words).forEach(([key, value]) => {
            if (key.search(letra) != -1) {
                // create_word(key);
                word_array.push(key)
            }
        });
    }

    // Fills
    let fill_amount = (amount, check = false) => {
        if (check) {
            let cw = document.querySelector('#container_words');
            cw.removeChild(cw.lastChild)
        }

        for (let i = fillCount; i < fillRange; i++) {
            if (i < word_array.length) {
                if (i == 0) {
                    create_word(word_array[i], true);
                } else {
                    create_word(word_array[i]);
                }
            }
        }
        fillCount += amount;
        fillRange += amount;
        if (fillCount < word_array.length) {
            create_see();
        }
    }

    fill_amount(10);
}

function cleanClassAudio() {
    audio.onended = function () {
        bt_play.className = "bt_audios";
    };
}

var words = {};
function readXml(xmlFile) {
    var xmlDoc;
    if (typeof window.DOMParser != "undefined") {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", xmlFile, false);
        if (xmlhttp.overrideMimeType) {
            xmlhttp.overrideMimeType('text/xml');
        }
        xmlhttp.send();
        xmlDoc = xmlhttp.responseXML;
    }
    else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.load(xmlFile);
    }
    var tagObj = xmlDoc.getElementsByTagName("word").length;

    let word_xml = xmlDoc.getElementsByTagName("word");
    for (let i = 0; i < word_xml.length; i++) {
        words[word_xml[i].attributes.entry.value] = {
            "desc": word_xml[i].attributes.entryDescription.value,
            "examp": word_xml[i].attributes.entryExample.value,
            "sound": word_xml[i].attributes.entrySound.value,
            "type": word_xml[i].attributes.type.value,
        }
    }
}

init();