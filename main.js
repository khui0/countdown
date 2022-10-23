const title = document.querySelector("#countdown>h1");
const subtitle = document.querySelector("#countdown>h2");

updateURL();

// Fullscreen on keypress
document.addEventListener("keydown", e => {
    if (e.key.toLowerCase() == "f" && getParams()) {
        if (!document.fullscreenElement) {
            try {
                document.documentElement.requestFullscreen();
            }
            catch {
                document.documentElement.webkitRequestFullscreen();
            }
        }
        else {
            try {
                document.exitFullscreen();
            }
            catch {
                document.webkitExitFullscreen();
            }
        }
    }
});

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", updateURL);
});

document.getElementById("icon").addEventListener("input", e => {
    // Restrict to emojis
    e.target.value = e.target.value.match(/\p{Extended_Pictographic}/u);
})

document.getElementById("copy").addEventListener("click", () => {
    navigator.clipboard.writeText(document.getElementById("output").value);
});

if (getParams()) {
    let params = getParams();
    // Set accent color
    document.documentElement.style.setProperty("--accent-color", params.accent);
    // Set title
    title.textContent = params.title;
    // Update subtitle
    setInterval(() => {
        let time = timeBetween(params.date);
        let timeStrings = [
            pluralize("days", time.days, true),
            pluralize("hours", time.hours, true),
            pluralize("minutes", time.minutes, true),
            pluralize("seconds", time.seconds, true)
        ];
        if (!time.passed) {
            subtitle.textContent = `is in ${timeStrings.join(" ")}`;
        }
        else {
            subtitle.textContent = `was ${timeStrings.join(" ")} ago`;
        }
    }, 100);
    // Set document title
    document.title = params.title;
    // Set document icon
    document.querySelector("head>link[rel=icon]").outerHTML = generateHTML(params.icon, 85);
    // Show countdown
    document.getElementById("countdown").style.display = "flex";
}
else {
    // Show countdown creator
    document.getElementById("create").style.display = "flex";
}

// Returns object containing time between two dates
function timeBetween(date) {
    let target = new Date(date).getTime();
    let milliseconds = target - Date.now();
    let seconds = Math.floor(Math.abs(milliseconds / 1000));
    let minutes = Math.floor(Math.abs(seconds / 60));
    let hours = Math.floor(Math.abs(minutes / 60));
    let days = Math.floor(Math.abs(hours / 24));
    return {
        days: days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
        passed: milliseconds < 0
    }
}

function updateURL() {
    let params = new URLSearchParams();
    params.append("title", document.getElementById("title").value);
    params.append("date", document.getElementById("date").value);
    params.append("accent", document.getElementById("accent").value);
    params.append("icon", document.getElementById("icon").value);
    document.getElementById("output").value = `${window.location.href.split("?")[0]}?${params.toString()}`;
}

function getParams() {
    let params = new URLSearchParams(window.location.search);
    let object = {
        "title": params.get("title"),
        "date": params.get("date"),
        "accent": params.get("accent"),
        "icon": params.get("icon")
    }
    // Only return if no parameters are missing
    if (!Object.values(object).some(value => !value?.trim())) {
        return object;
    }
    else {
        return;
    }
}

// From https://github.com/khui0/emoji-favicon
function generateHTML(emoji, font) {
    let y = font / 3 + 51 + 2 / 3;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="${y.toFixed(2)}" font-size="${font}" text-anchor="middle">${emoji.trim()}</text></svg>`;
    return `<link rel="icon" href="data:image/svg+xml,${svg.replaceAll(`"`, "%22")}">`;
}
