document.addEventListener("DOMContentLoaded", () => {
    initClock();
    fetchWeather();
    initTodo();
});

function initClock() {
    const startTime = new Date('2008-09-24T00:00:00');
    const greetingEl = document.getElementById("greeting");
    const clockEl = document.getElementById("clock");
    const timeSinceEl = document.getElementById("simon-age");

    function update() {
        const now = new Date();

        if (clockEl) {
            clockEl.innerText = now.toLocaleTimeString();
        }

        const forskelMs = now - startTime;

        let totalSec = Math.floor(forskelMs / 1000);
        let totalMin = Math.floor(totalSec / 60);
        let totalTimer = Math.floor(totalMin / 60);
        let totalDage = Math.floor(totalTimer / 24);
        let year = Math.floor(totalDage / 365.25);

        let sec = totalSec % 60;
        let min = totalMin % 60;
        let timer = totalTimer % 24;
        let day = totalDage % 365; 

        if (timeSinceEl) {
            timeSinceEl.innerText = `${year} År, ${day} Dage, ${timer} Timer, ${min} Minutter, ${sec} Sekunder`;
        }

        const hours = now.getHours();
        if (hours <= 11) greetingEl.innerText = "Frokost";
        else if (hours <= 12) greetingEl.innerText = "googoogaga";
        else if (hours <= 13) greetingEl.innerText = "nr2 drik";
        else if (hours <= 14) greetingEl.innerText = "Snart fri";
        else if (hours <= 15) greetingEl.innerText = "Gå hjem hvorfor er du her stadigvæk";
        else if (hours <= 18) greetingEl.innerText = "Damn";
        else greetingEl.innerText = "idk";
    }

    update();
    setInterval(update, 1000);
}

initClock();

async function fetchWeather() {
    const weatherEl = document.getElementById("weather-info")
    try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=55.6761&longitude=12.5683&current_weather=true");
        const data = await res.json();
        const temp = data.current_weather.temperature;
        weatherEl.innerHTML = `Copenhagen<br><strong>${temp}°C</strong>`;
    } catch (err) {
        weatherEl.innerText = "Could not load weather.";
    }
}

function initTodo() {
    const input = document.getElementById("task-input");
    const addBtn = document.getElementById("add-task-btn");
    const list = document.getElementById("task-list");

    chrome.storage.local.get(["tasks"], (result) => {
        const tasks = result.tasks || [];
        renderTasks(tasks);
    });

    addBtn.addEventListener("click", () => {
        const text = input.value.trim();
        if (!text) return;

        chrome.storage.local.get(["tasks"], (result) => {
            const tasks = result.tasks || [];
            tasks.push(text);
            chrome.storage.local.set({ tasks }, () => {
                renderTasks(tasks);
                input.value = "";
            });
        });
    });

    function renderTasks(tasks) {
        list.innerHTML = "";
        tasks.forEach((task, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<span>${task}</span> <button style="background:none; border:none; color:#ef4444; cursor:pointer;">&times;</button>`;

            listItem.querySelector("button").addEventListener("click", () => {
                tasks.splice(index, 1);
                chrome.storage.local.set({ tasks }, () => renderTasks(tasks));
            });

            list.appendChild(listItem);
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM er loaded - søge-script starter!");

    const searchInput = document.getElementById("Search");
    const searchBtn = document.querySelector(".container .search");

    if (!searchInput) {
        console.error("Kan ikke finde input-feltet med ID 'Search'!");
        return;
    }

    function performSearch() {
        const query = searchInput.value.trim();
        console.log("Forsøger at søge efter:", query);

        if (query !== "") {
            const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.location.href = url;
        } else {
            console.log("Feltet er tomt, søger ikke.");
        }
    }

    searchInput.addEventListener("keydown", (event) => {
        console.label = "Tast trykket: " + event.key;
        if (event.key === "Enter") {
            event.preventDefault();
            performSearch();
        }
    });

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            console.log("Klikket på søge-knap (div)");
            performSearch();
        });
    }
});