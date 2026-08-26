document.addEventListener("DOMContentLoaded", () => {
    initClock();
    getWeather();
    initTodo();
    checkTodayGreeting();
    initSearch();
    initCalendar();
});
function initClock() {
    const startTime = new Date('2008-09-24T00:00:00');
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
    }

    update();
    setInterval(update, 1000);
}
function checkTodayGreeting() {
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const savedNote = localStorage.getItem(todayKey);
    const greetingEl = document.getElementById("greeting");

    if (savedNote && greetingEl) {
        greetingEl.innerText = savedNote;
    }
}

async function getWeather() {
    const apiKey = "deabdc53f2d8deb9ea8839b3bd9d7a11"; 
    const city = "Copenhagen";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const temp = Math.round(data.main.temp);
        document.getElementById("weather-temp").innerText = `${temp}°C`;

        const description = data.weather[0].description;
        document.getElementById("weather-desc").innerText = description;

        const windSpeed = data.wind.speed;
        document.getElementById("weather-wind").innerText = `${windSpeed} m/s`;

        const iconCode = data.weather[0].icon;
        document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    } catch (error) {
        console.error("Fejl ved hentning af vejrdata:", error);
    }
}
function initTodo() {
    const input = document.getElementById("task-input");
    const addBtn = document.getElementById("add-task-btn");
    const list = document.getElementById("task-list");

    if (!input || !addBtn || !list) return;

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
function initSearch() {
    const searchInput = document.getElementById("Search");
    const searchBtn = document.querySelector(".container .search");

    if (!searchInput) {
        console.error("Kan ikke finde input feltet med ID 'Search'!");
        return;
    }
    function performSearch() {
        const query = searchInput.value.trim();

        if (query !== "") {
            const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.location.href = url;
        }
    }

    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            performSearch();
        }
    });

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            performSearch();
        });
    }
}
function initCalendar() {
    const monthYearEl = document.getElementById("month-year");
    const daysContainer = document.getElementById("days-container");
    const prevBtn = document.getElementById("prev-month");
    const nextBtn = document.getElementById("next-month");

    const modal = document.getElementById("day-modal");
    const modalDate = document.getElementById("modal-date");
    const modalNoteInput = document.getElementById("modal-note-input");
    const saveNoteBtn = document.getElementById("save-note-btn");
    const closeModal = document.getElementById("close-modal");
    const greetingEl = document.getElementById("greeting"); 

    if (!monthYearEl || !daysContainer) return;

    let currentDate = new Date();
    let selectedDateKey = ""; 

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

            const dateKey = `${year}-${month}-${i}`;

            if (localStorage.getItem(dateKey)) {
                dayDiv.classList.add("has-note");
            }

            if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayDiv.classList.add("today");
            }

            dayDiv.addEventListener("click", () => {
                selectedDateKey = dateKey;
                modalDate.innerText = `${i} ${months[month]} ${year}`;
                modalNoteInput.value = localStorage.getItem(dateKey) || "";
                modal.classList.remove("hidden");
            });

            daysContainer.appendChild(dayDiv);
        }
    }

    saveNoteBtn.addEventListener("click", () => {
        const noteText = modalNoteInput.value.trim();

        if (noteText !== "") {
            localStorage.setItem(selectedDateKey, noteText);

            const today = new Date();
            const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
            if (selectedDateKey === todayKey) {
                greetingEl.innerText = noteText;
            }
        } else {
            localStorage.removeItem(selectedDateKey);
        }

        modal.classList.add("hidden");
        renderCalendar(); 
    });

    closeModal.addEventListener("click", () => modal.classList.add("hidden"));
    window.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

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