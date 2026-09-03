document.addEventListener("DOMContentLoaded", () => {
    App.init();
});

const App = {
    init() {
        InitRangeSlider.init();
        SimonSays.init();
        ColorBox.init();
        CheckInManager.init();
        ClockManager.init();
        GreetingManager.init();
        WeatherManager.init();
        TaskManager.init();
        SearchManager.init();
        CalendarManager.init();
        CalculatorManager.init();
    }
};

const InitRangeSlider = {
    init() {
        const slider = document.getElementById("myRange");
        const output = document.getElementById("slider-output");

        if (slider && output) {
            slider.addEventListener("input", (e) => {
                output.innerHTML = e.target.value;
            });
        }
    }
};

const SimonSays = {
    init() {
        const tiles = document.querySelectorAll(".simon-tile");
        const startBtn = document.getElementById("start-simon");
        const statusEl = document.getElementById("simon-status");

        if (!startBtn || tiles.length === 0) return;

        let sequence = [];
        let playerSequence = [];
        let level = 0;
        let isPlaying = false;

        const startGame = () => {
            sequence = [];
            playerSequence = [];
            level = 0;
            nextRound();
        };

        const nextRound = () => {
            level++;
            playerSequence = [];
            statusEl.innerText = `Level ${level}`;
            sequence.push(Math.floor(Math.random() * 9));
            playSequence();
        };

        const playSequence = () => {
            isPlaying = true;
            let i = 0;
            let interval = setInterval(() => {
                if (i >= sequence.length) {
                    clearInterval(interval);
                    isPlaying = false;
                    return;
                }
                let tile = tiles[sequence[i]];
                this.flashTile(tile);
                setTimeout(() => tile.classList.remove("active"), 300);
                i++;
            }, 600);
        };

        tiles.forEach(tile => {
            tile.addEventListener("click", () => {
                if (isPlaying) return;

                let tileIndex = parseInt(tile.dataset.index, 10);
                playerSequence.push(tileIndex);
                this.flashTile(tile);
                setTimeout(() => tile.classList.remove("active"), 300);

                let currentIndex = playerSequence.length - 1;
                if (playerSequence[currentIndex] !== sequence[currentIndex]) {
                    statusEl.innerText = `Game Over! Level ${level}`;
                    isPlaying = true;
                    return;
                }

                if (playerSequence.length === sequence.length) {
                    isPlaying = true;
                    setTimeout(nextRound, 1000);
                }
            });
        });

        startBtn.addEventListener("click", startGame);
    },

    flashTile(tile) {
        tile.classList.add("active");
    }
};

const ColorBox = {
    init() {
        const colorBtn = document.getElementById("color-box");
        if (colorBtn) {
            colorBtn.addEventListener("click", () => {
                const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                colorBtn.style.backgroundColor = randomColor;
            });
        }
    }
};

const CheckInManager = {
    timeLeft: null,

    init() {
        const checkInBtn = document.getElementById("check-in");
        if (!checkInBtn) return;

        checkInBtn.addEventListener("click", () => {
            let now = new Date();
            let targetTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));

            let maxLimit = new Date(now);
            let minLimit = new Date(now);
            const weekdayName = now.toLocaleDateString('da-DK', { weekday: 'long' }).toLowerCase();

            if (weekdayName === "fredag") {
                maxLimit.setHours(14, 30, 0, 0);
                minLimit.setHours(14, 0, 0, 0);
            } else {
                maxLimit.setHours(15, 0, 0, 0);
                minLimit.setHours(14, 30, 0, 0);
            }

            if (now < maxLimit && targetTime > maxLimit) {
                targetTime = maxLimit;
            } else if (now > minLimit && targetTime < minLimit) {
                targetTime = minLimit;
            }

            this.timeLeft = targetTime;
            console.log("Check-in klikket! Nedtælling sat til:", this.timeLeft);
        });
    },

    getTimeLeft() {
        return this.timeLeft;
    }
};

const ClockManager = {
    init() {
        const startTime = new Date('2008-09-24T04:05:37');
        const clockEl = document.getElementById("clock");
        const timeSinceEl = document.getElementById("simon-age");
        const timerEl = document.getElementById("timer");

        const update = () => {
            const now = new Date();

            if (clockEl) {
                clockEl.innerText = now.toLocaleTimeString();
            }

            if (timerEl) {
                let targetTime;
                let customCheckIn = CheckInManager.getTimeLeft();

                if (customCheckIn instanceof Date) {
                    targetTime = customCheckIn;
                } else {
                    let target1 = new Date();
                    let target2 = new Date();
                    target1.setHours(14, 30, 0, 0);
                    target2.setHours(14, 0, 0, 0);

                    if (now > target1) target1.setDate(target1.getDate() + 1);
                    if (now > target2) target2.setDate(target2.getDate() + 1);

                    const weekdayName = now.toLocaleDateString('da-DK', { weekday: 'long' }).toLowerCase();
                    targetTime = (weekdayName === "fredag") ? target2 : target1;
                }

                let diffMs = Math.max(0, targetTime - now);
                let totalSecLeft = Math.floor(diffMs / 1000);
                let hoursLeft = Math.floor(totalSecLeft / 3600);
                let minLeft = Math.floor((totalSecLeft % 3600) / 60);
                let secLeft = totalSecLeft % 60;

                timerEl.innerText = `${hoursLeft}t ${minLeft}m ${secLeft}s`;
            }

            if (timeSinceEl) {
                let forskelMs = now - startTime;
                let totalSec = Math.floor(forskelMs / 1000);
                let totalMin = Math.floor(totalSec / 60);
                let totalTimer = Math.floor(totalMin / 60);
                let totalDage = Math.floor(totalTimer / 24);
                let year = Math.floor(totalDage / 365.25);

                let sec = totalSec % 60;
                let min = totalMin % 60;
                let timer = totalTimer % 24;
                let day = Math.floor(totalDage % 365.25);

                timeSinceEl.innerText = `${year} År, ${day} Dage, ${timer} Timer, ${min} Minuter, ${sec} Sekunder`;
            }
        };

        update();
        setInterval(update, 1000);
    }
};

const GreetingManager = {
    init() {
        const today = new Date();
        const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const savedNote = localStorage.getItem(todayKey);
        const greetingEl = document.getElementById("greeting");

        if (savedNote && greetingEl) {
            greetingEl.innerText = savedNote;
        }
    }
};

const WeatherManager = {
    async init() {
        const apiKey = "deabdc53f2d8deb9ea8839b3bd9d7a11";
        const city = "Copenhagen";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            document.getElementById("weather-temp").innerText = `${Math.round(data.main.temp)}°C`;
            document.getElementById("weather-desc").innerText = data.weather[0].description;
            document.getElementById("weather-wind").innerText = `${data.wind.speed} m/s`;
            document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        } catch (error) {
            console.error("Fejl ved hentning af vejrdata:", error);
        }
    }
};

const TaskManager = {
    init() {
        const input = document.getElementById("task-input");
        const addBtn = document.getElementById("add-task-btn");
        const list = document.getElementById("task-list");

        if (!input || !addBtn || !list) return;

        chrome.storage.local.get(["tasks"], (result) => {
            this.renderTasks(result.tasks || [], list);
        });

        addBtn.addEventListener("click", () => {
            const text = input.value.trim();
            if (!text) return;

            chrome.storage.local.get(["tasks"], (result) => {
                const tasks = result.tasks || [];
                tasks.push(text);
                chrome.storage.local.set({ tasks }, () => {
                    this.renderTasks(tasks, list);
                    input.value = "";
                });
            });
        });
    },

    renderTasks(tasks, listEl) {
        listEl.innerHTML = "";
        tasks.forEach((task, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<span>${task}</span> <button style="background:none; border:none; color:#ef4444; cursor:pointer;">&times;</button>`;

            listItem.querySelector("button").addEventListener("click", () => {
                tasks.splice(index, 1);
                chrome.storage.local.set({ tasks }, () => this.renderTasks(tasks, listEl));
            });

            listEl.appendChild(listItem);
        });
    }
};

const SearchManager = {
    init() {
        const searchContainer = document.querySelector('.search-container');
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('Search');

        if (searchContainer && searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => {
                searchContainer.classList.add('active');
                searchInput.focus();
            });

            document.addEventListener('click', (e) => {
                if (!searchContainer.contains(e.target)) {
                    searchContainer.classList.remove('active');
                }
            });

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchContainer.classList.remove('active');
                }
                if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                    const query = encodeURIComponent(searchInput.value);
                    window.location.href = `https://www.google.com/search?q=${query}`;
                }
            });
        }
    }
};
const CalendarManager = {
    init() {
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
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const renderCalendar = () => {
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
                if (localStorage.getItem(dateKey)) dayDiv.classList.add("has-note");
                if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) dayDiv.classList.add("today");

                dayDiv.addEventListener("click", () => {
                    selectedDateKey = dateKey;
                    modalDate.innerText = `${i} ${months[month]} ${year}`;
                    modalNoteInput.value = localStorage.getItem(dateKey) || "";
                    modal.classList.remove("hidden");
                });

                daysContainer.appendChild(dayDiv);
            }
        };

        saveNoteBtn.addEventListener("click", () => {
            const noteText = modalNoteInput.value.trim();
            const today = new Date();
            const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

            if (noteText !== "") {
                localStorage.setItem(selectedDateKey, noteText);
                if (selectedDateKey === todayKey && greetingEl) greetingEl.innerText = noteText;
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
};

const CalculatorManager = {
    init() {
        const resultInput = document.getElementById('result');
        const buttons = document.querySelectorAll('.calculator .calc-buttons button');

        if (!resultInput || buttons.length === 0) return;

        // Sikker indbygget udregner uden eval/new Function
        function safeEval(expr) {
            let tokens = expr.match(/(\d+\.\d+|\d+|\+|\-|\*|\/|\(|\))/g);
            if (!tokens) throw new Error("Ugyldigt udtryk");

            let index = 0;
            function peek() { return tokens[index]; }
            function consume() { return tokens[index++]; }

            function parseExpression() {
                let node = parseTerm();
                while (peek() === '+' || peek() === '-') {
                    let op = consume();
                    let right = parseTerm();
                    if (op === '+') node += right;
                    if (op === '-') node -= right;
                }
                return node;
            }

            function parseTerm() {
                let node = parseFactor();
                while (peek() === '*' || peek() === '/') {
                    let op = consume();
                    let right = parseFactor();
                    if (op === '*') node *= right;
                    if (op === '/') {
                        if (right === 0) throw new Error("Division med nul");
                        node /= right;
                    }
                }
                return node;
            }

            function parseFactor() {
                let token = consume();
                if (!token) throw new Error("Uventet slutning");
                if (token === '(') {
                    let node = parseExpression();
                    if (consume() !== ')') throw new Error("Mangler parentes");
                    return node;
                }
                let num = parseFloat(token);
                if (isNaN(num)) throw new Error("Ugyldigt tal");
                return num;
            }

            let result = parseExpression();
            if (index < tokens.length) throw new Error("Ugyldigt udtryk");
            return result;
        }

        buttons.forEach(button => {
            // Undgå at knappen får tilføjet event listener flere gange
            if (button.dataset.listenerAttached === "true") return;
            button.dataset.listenerAttached = "true";

            button.addEventListener('click', () => {
                const value = button.textContent.trim();

                if (value === 'c' || value === 'C') {
                    resultInput.value = '';
                } else if (value === '=') {
                    try {
                        let expression = resultInput.value
                            .replace(/×/g, '*')
                            .replace(/÷/g, '/')
                            .replace(/,/g, '.');

                        resultInput.value = safeEval(expression);
                    } catch (error) {
                        resultInput.value = 'Fejl';
                    }
                } else {
                    if (resultInput.value === 'Fejl') {
                        resultInput.value = '';
                    }
                    resultInput.value += value;
                }
            });
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CalculatorManager.init();
});
document.querySelectorAll('.expandable-header').forEach(header => {
    header.addEventListener('click', () => {
        const card = header.parentElement;
        card.classList.toggle('active');
    });
});