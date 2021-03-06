// Solução Exportação de cursos Mói 11/20 by: pietroggsilva@gmail.com
// Config
var debug = true;
var timing = false;

// Code
var txt_infos;
var isLms = true;
var report_data = "";
const notFix = [2, 4];

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
            createReport();
            initListners();
            initUndergroundControls();
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
            if (report[(report.length - 1)]["maxScore"] == report[(report.length - 1)]["score"]) {
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

var currentScreen = 1;

function initUndergroundControls() {
    setInterval(() => {
        let fpage = parseInt(document.querySelector('.info_page_counter').querySelector('span').innerHTML.slice(0, 1))
        if (currentScreen != fpage) {
            currentScreen = fpage;
            console.log(`CS > ${currentScreen}`);
            prepareScreen(currentScreen);
        }
    }, 100);
}

// Screen Functions

function prepareScreen(page) {
    switch (page) {
    }
}

function insertLogo() {
    // CSS
    var logo_style = document.createElement('style');
    logo_style.type = 'text/css';
    logo_style.innerHTML = "#stand_logo img{border: none;cursor: default;background: transparent;position: absolute;left: 390px;top: -75px;width: 120px;}";
    document.getElementsByTagName('head')[0].appendChild(logo_style);
}

var report = [];
const ignoreScreens = ['Content', 'Report', 'Credits', 'Lesson report', '', 'CREDITS'];

function createReport() {
    report = [];
    report_data = window.player.getLessonJSONReport();
    let obj = JSON.parse(report_data);
    let t_s = 0;
    let t_m = 0;
    Object.keys(obj.items).forEach((element, index) => {
        let x = obj.items[element];
        if (!ignoreScreens.includes(x.title)) {
            let co = "icon_report_02";
            let sc = 0;
            let ms = 0;
            let has = true;

            notFix.includes(parseInt(index)) ? sc = parseInt(x.result.done) : sc = parseInt(x.result.done);
            ms = parseInt(x.result.todo);
            x.result.todo != 0 ? has = true : has = false;
            switch (x.title.substring(0, 4)) {
                case 'Pres':
                    co = 'icon_report_01';
                    break;
                case 'Prac':
                    co = 'icon_report_02';
                    break;
                case 'Engl':
                    co = 'icon_report_03';
                    break;
            }
            report.push({
                "title": x.title,
                "color": co,
                "score": sc,
                "maxScore": ms,
                "hasScore": has,
            });


            t_s += sc;
            t_m += ms;
        }
    });
    report.push({
        "title": "Total",
        "color": "icon_report_04",
        "score": t_s,
        "maxScore": t_m,
        "hasScore": true,
    });
}

// Dicionario

var block_dual = false;
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

    let rect = body.getBoundingClientRect();

    let bt_dictionary = document.querySelector('.qp-dictionary-button');
    bt_dictionary.onclick = function () {
        if (!block_dual) {
            block_dual = true;
            let dictionary_container = create('', "#body", "dictionary_filter", "pop");
            dictionary_container.style.cssText = 'height:' + rect.height + 'px';

            create('', "#dictionary_filter", "dictionary_container", "pop");

            // Column 01
            create('', "#dictionary_container", "column01", "columns");
            create('', "#column01", "row01", "rows");
            // BOTÕES ROW 02
            create('', "#column01", "row02", "rows");

            let row_1 = ["a", "c", "e", "g", "i", "k", "m", "o", "q", "s", "u", "w", "z", "b", "d", "f", "h", "j", "l", "n", "p", "r", "t", "v", "y"];

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

            let search = create('input', '#column02', 'search');
            search.type = "text";
            search.oninput = () => {
                if (search.value.length >= 2) {
                    fillPanel(search.value, true);
                }
            }
            // search.addEventListener("change", (e)=>{console.log(e.target.value)});

            let bt_search = create('', '#column02', 'bt_search');
            bt_search.innerHTML = "<span>go</span>";
            bt_search.onclick = () => {
                fillPanel(search.value, true);
            }

            // CONTAINER ÁUDIO
            create('', '#column02', 'audio_container');

            txt_audio_01 = create('p', '#audio_container', 'txt_audio_01', 'audios_txts');
            txt_audio_01.innerHTML = "<i>preposition</i>";

            // ÁUDIO BOX
            create('', '#audio_container', 'box_audio');

            audio = new Audio(`dictionary\\media\\above.mp3`);

            bt_play = create('', '#box_audio', 'bt_audio', 'bt_audios');
            bt_play.onclick = () => {
                audio.currentTime = 0;
                audio.play();
                bt_play.className = "bt_audios played";
            };

            audio.onended = function () {
                bt_play.className = "bt_audios";
            };

            txt_audio_02 = create('p', '#box_audio', 'txt_audio_02', 'audios_txts');
            txt_audio_02.innerHTML = "above";

            // TXTS CONTAINER ÁUDIO
            txt_audio_03 = create('p', '#audio_container', 'txt_audio_03', 'audios_txts');
            txt_audio_03.innerHTML = "in a higher position than something else";

            txt_audio_04 = create('p', '#audio_container', 'txt_audio_04', 'audios_txts');
            txt_audio_04.innerHTML = "&#8220Put the picture above the fireplace.&#8221";

            // BOTÃO DE FECHAR
            let bt_close = create('', "#column02", "bt_close");
            bt_close.innerHTML = "<span>x</span>";

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

function fillPanel(letra, search = false) {
    // Limpar
    if (container_words.childElementCount > 0) {
        while (container_words.lastElementChild) {
            container_words.removeChild(container_words.lastElementChild)
        }
    }
    //Reset
    last_click = null;
    var index = 0;
    //Criar palavra
    let create_word = (key) => {
        let btn = create('', "#container_words", "txt_container_" + index, "div_words");
        let txt_container = create('p', "#txt_container_" + index, "txt_" + index, "containers_txts");
        txt_container.innerHTML = key;
        let nclick = () => {
            if (last_click != null) {
                last_click.style.cssText = "";
            }
            last_click = btn;
            let word = words[key];
            btn.style.cssText = "background: no-repeat rgb(255, 204, 0) !important;"
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

            audio.onended = function () {
                bt_play.className = "bt_audios";
            };
        }
        btn.onclick = () => { nclick() };
        index++;
    }
    //busca
    if (!search) {
        Object.entries(words).forEach(([key, value]) => {
            if (key.substr(0, 1).toLowerCase() == letra) {
                create_word(key);
            }
        });
    } else {
        Object.entries(words).forEach(([key, value]) => {
            if (key.search(letra) != -1) {
                create_word(key);
            }
        });
    }
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