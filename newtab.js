document.addEventListener("DOMContentLoaded", () => {
    initClock();
    fetchWeather();
    initTodo();
});

function initClock() {
    const clockEl = document.getElementById("clock");
    const greetingEl = document.getElementById("greeting")

    function update() {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString();

        const hours = now.getHours();
        if (hours < 12) greetingEl.innerText = "Morning";
        else if (hours < 18) greetingEl.innerText = "Afternoon";
        else greetingEl.innertext = "Evening";
    }

    update();
    setInterval(update, 1000);
}

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
    const input = document.getElementById("task-input")
    const btn = document.getElementById("add-task-btn")
    const list = document.getElementById("task-list")

    chrome.storage.local.get(["tasks"], (result) => {
        const tasks = result.task || [];
        renderTasks(tasks);
    });
    btn.addEventListener("click", () => {
        const text = input.value.trim();
        if (!text) return;

        chrome.storage.local.get(["tasks"], (result) => {
            const tasks = result.tasks || [];
            tasks.push(text);
            chrome.storage.local.set({ tasks }, () => {
                renderTasks(tasks);
                input.value = ";"
            });
        });
    });

    function renderTasks(tasks) {
        list.innerHTML = "";
        tasks.forEach((task, index) => {
            const li= document.createElement("li");
            li.innerHTML = `<span>${task}</span> <button style="background:none; border:none; color:ef4444; cursor:pointer;">&times;</button>`;

            li.querySelector("button").addEventListener("click", () => {
                tasks.splice(index, 1);
                chrome.storage.local.set({ task }, () => renderTasks(tasks));
            });
            list.appendChild(li);
        })
    }
}


