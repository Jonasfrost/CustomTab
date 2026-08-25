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
            timeSinceEl.innerText = `${year} År, ${day} Dage, ${timer} Timer, ${min} Minuter, ${sec} Sekunder`;
        }

        const hours = now.getHours();

        const greetings = [
            { hour: 18, text: "Damn" },
            { hour: 15, text: "Gå hjem" },
            { hour: 14, text: "Snart fri" },
            { hour: 13, text: "nr2 drik" },
            { hour: 12, text: "back to work :(" },
            { hour: 11, text: "frokost" },
            { hour: 10, text: "googoogaga" },
            { hour: 9, text: "Første monster færdig" },
            { hour: 8, text: "God morgen" }
        ];

        const currentGreeting = greetings.find(g => hours >= g.hour);

        greetingEl.innerText = currentGreeting ? currentGreeting.text : "";

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
function initCalendar() {
    const monthYearEl = document.getElementById("month-year");
    const daysContainer = document.getElementById("days-container");
    const prevBtn = document.getElementById("prev-month");
    const nextBtn = document.getElementById("next-month");

    let currentDate = new Date();

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        monthYearEl.innerText = `${months[month]} ${year}`;

        daysContainer.innerHTML = "";

        let firstDayIndex = new Date(year, month, 1).getDay();
        firstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

        const totalDays = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();

        for (let i = firstDayIndex; i > 0; i--) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("padding-day");
            dayDiv.innerText = prevMonthDays - i + 1;
            daysContainer.appendChild(dayDiv);
        }

        const today = new Date();
        for (let i = 1; i <= totalDays; i++) {
            const dayDiv = document.createElement("div");
            dayDiv.classList.add("day");
            dayDiv.innerText = i;

            if (
                i === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {
                dayDiv.classList.add("today");
            }

            daysContainer.appendChild(dayDiv);
        }
    }

    prevBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
}

initCalendar();