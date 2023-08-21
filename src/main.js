import "./reset.css";
import "./style.css";
import "remixicon/fonts/remixicon.css";

import pluralize from "pluralize";

// Get URL parameters
const params = new URLSearchParams(window.location.search);
const edit = params.has("edit");
const data = {
    title: params.get("title") || "Untitled",
    date: params.get("date") || Date.now(),
    color: params.get("color") || params.get("accent") || "#ffffff",
    icon: params.get("icon") || "🥳",
}

updateColors();

document.getElementById("edit").href = window.location.href + "&edit";

if (params.size == 0) {
    showView("edit");
    // Set title
    document.title = "Create a countdown";
    // Set icon
    document.head.insertAdjacentHTML("beforeend", generateIconHTML("🗓️", 85));
}
else if (edit) {
    showView("edit");
    // Set title
    document.title = "Editing " + data.title;
    // Set icon
    document.head.insertAdjacentHTML("beforeend", generateIconHTML("✏️", 85));
}
else {
    showView("countdown");
    // Set title
    document.title = data.title;
    document.getElementById("title").textContent = data.title;
    // Set icon
    document.head.insertAdjacentHTML("beforeend", generateIconHTML(data.icon, 85));
    setInterval(update, 100);
}

function update() {
    const time = timeUntil(data.date);
    const array = [
        pluralize("day", time.days, true),
        pluralize("hour", time.hours, true),
        pluralize("minute", time.minutes, true),
        pluralize("second", time.seconds, true),
    ];
    const string = !time.passed ? `is in ${array.join(" ")}` : `was ${array.join(" ")} ago`;
    document.getElementById("time").textContent = string;
}

function updateColors() {
    document.documentElement.style.setProperty("--text-color", data.color);
    document.documentElement.style.setProperty("--background-color", getContrastYIQ(...hexToRgb(data.color)));
}

function timeUntil(date) {
    date = Date.parse(date) || date;
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

function getContrastYIQ(r, g, b) {
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? "black" : "white";
}

function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? "0" + hex : hex
    }).join("");
}

function hexToRgb(hex) {
    return hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
        , (m, r, g, b) => '#' + r + r + g + g + b + b)
        .substring(1).match(/.{2}/g)
        .map(x => parseInt(x, 16));
}