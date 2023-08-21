import "./reset.css";
import "./style.css";

import pluralize from "pluralize";

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const view = params.has("view");
const data = {
    title: params.get("title") || "Untitled",
    date: params.get("date") || Date.now(),
    color: params.get("color") || "white",
    icon: params.get("icon") || "🥳",
}

if (view) {
    showView("countdown");
    // Set title
    document.title = data.title;
    document.getElementById("title").textContent = data.title;
    // Set icon
    document.head.insertAdjacentHTML("beforeend", generateIconHTML(data.icon, 85));
    setInterval(update, 100);
}
else {
    showView("edit");

}

function update() {
    const time = timeUntil(data.date);
    document.getElementById("days").textContent = pluralize("day", time.days, true);
    document.getElementById("hours").textContent = pluralize("hour", time.hours, true);
    document.getElementById("minutes").textContent = pluralize("minute", time.minutes, true);
    document.getElementById("seconds").textContent = pluralize("second", time.seconds, true);
}

function timeUntil(date) {
    const milliseconds = date - Date.now();
    const seconds = Math.floor(Math.abs(milliseconds / 1000));
    const minutes = Math.floor(Math.abs(seconds / 60));
    const hours = Math.floor(Math.abs(minutes / 60));
    const days = Math.floor(Math.abs(hours / 24));
    return {
        days: days,
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60,
        passed: milliseconds < 0
    }
}

function generateIconHTML(icon, size) {
    let y = size / 3 + 51 + 2 / 3;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="${y.toFixed(2)}" font-size="${size}" text-anchor="middle">${icon.trim()}</text></svg>`;
    return `<link rel="icon" href="data:image/svg+xml,${svg.replaceAll(`"`, "%22")}">`;
}

function showView(name) {
    document.querySelectorAll("[data-view]").forEach(view => {
        view.style.display = "none";
    });
    document.querySelector(`[data-view=${name}]`).style.removeProperty("display");
}