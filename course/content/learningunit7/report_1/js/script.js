let hasIcon = true;
let hasFlags = false;

let report = [];

function createReportScreen(obj, index) {
    let bg = create("tr", "#--report-container", "--report-screen-" + index, "--report-screen");
    bg.classList.add("--report-screen-" + obj.color);

    let titleContainer = create("td", "#--report-screen-" + index, "--report-titleContainer-" + index, "--report-titleContainer");
    let progressContainer = create("td", "#--report-screen-" + index, "--report-progressContainer-" + index, "--report-progressContainer");
    let scoreContainer = create("td", "#--report-screen-" + index, "--report-scoreContainer-" + index, "--report-scoreContainer");

    let title = create("p", "#--report-titleContainer-" + index, "--report-title-" + index, "--report-title");
    title.innerHTML = obj.title;

    title.onclick = function () {
        if (obj.title !== "Total:") {
            eventFire(links[(index + 1)], 'click')
        }
    };

    if (obj.hasScore) {
        if (obj.title !== "Total:" || hasIcon) {
            // Progress Bar
            let barBg = create("", "#--report-progressContainer-" + index, "--report-progressBar-" + index, "--report-progressBar");
            let fill = create("", "#--report-progressBar-" + index, "--report-progressFill-" + index, "--report-progressFill");

            let percentage = (obj.score * 100) / obj.maxScore;
            TweenMax.fromTo(barBg, 1, { css: { width: "0%" } }, { width: "100%" });

            TweenMax.fromTo(fill, 2, { css: { width: "0%" } }, { width: percentage + "%" });

            if (hasIcon) {
                let rocket = create("", "#--report-progressBar-" + index, "--report-progressRocket-" + index, "--report-progressRocket");
                let smoke = create("", "#--report-progressBar-" + index, "--report-progressSmoke-" + index, "--report-progressSmoke");

                if (percentage > 0) {
                    TweenMax.fromTo(rocket, 2, { css: { left: "0%" } }, { left: percentage + "%" });
                    TweenMax.fromTo(smoke, 0.5, { opacity: 0 }, { opacity: 1 });
                    let xy = ((40 / 100) * percentage) + 10;
                    rocket.style.cssText = `transform: translate(-${xy}%,-50%);`
                } else {
                    rocket.style.cssText = "transform: translate(-10%,-50%);"
                }

            }
        }

        // Number Score
        let score = create("p", "#--report-scoreContainer-" + index, "--report-score-" + index, "--report-score");
        score.innerHTML = obj.score + " / " + obj.maxScore;
    } else {
        //Tick
        create("", "#--report-scoreContainer-" + index, "--report-tick-" + index, "--report-tick");

        titleContainer.classList.add("--report-titleContainerNoScore");
        progressContainer.classList.add("--report-progressContainerNoScore");
        scoreContainer.classList.add("--report-scoreContainerNoScore");
    }

    // Flags
    if (hasFlags) {
        // left
        create("", "#--report-screen-" + index, "--report-flagLeft-" + index, "--report-flag --report-flagLeft");
        create("", "#--report-screen-" + index, "--report-flagLineLeft-" + index, "--report-flagLine --report-flagLineLeft");
        // right
        create("", "#--report-screen-" + index, "--report-flagRight-" + index, "--report-flag --report-flagRight");
        create("", "#--report-screen-" + index, "--report-flagLineRight-" + index, "--report-flagLine --report-flagLineRight");
    }
}

function eventFire(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

var links = [];

function createReport() {
    report = parent.report;
    console.log(report);
    links = parent.document.querySelectorAll('.qp-link-content');
    report.forEach(function (element, index) {
        createReportScreen(element, index);
    })
}

setTimeout(createReport(), 1000);