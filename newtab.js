document.addEventListener("DOMContentLoaded", () => {
    initClock();
    fetchWeather();
    initTodo();
});

 
function initClock() {
    const startTime = new Date('2008-09-24T00:00:00');
    const greetingEl = document.getElementById("greeting");
    const clockEl = document.getElementById("clock");
    const timeSinceEl = document.getElementById("timeSince");

    function update() {
        const now = new Date();

        if (clockEl) {
            clockEl.innerText = now.toLocaleTimeString();
        }

        const forskelMs = now - startTime;
        const sec = Math.floor(forskelMs / 1000);
        const min = Math.floor(sec / 60);
        const hour = Math.floor(min / 60);
        const day = Math.floor(hour / 24);
        const year = Math.floor(day / 365.25);

        if (timeSinceEl) {
            timeSinceEl.innerText = `${year} År,  ${day} Dage,  ${hour}, Timer  ${min}, Minuter  ${sec}, Sekunder `;
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
    const openBtn = document.getElementById("open-task-btn");
    const taskModal = document.getElementById("task-modal");
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

    openBtn.addEventListener("click", () => {
        taskModal.classList.toggle("active");
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


