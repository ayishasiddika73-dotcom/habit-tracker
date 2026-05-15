const habitBody = document.getElementById("habitBody");
const monthSelector = document.getElementById("monthSelector");
const nameInput = document.getElementById("nameInput");
const notesInput = document.getElementById("notesInput");

let currentMonth = "January";

const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

const quotes = [
    "Small consistency creates big success.",
    "Discipline beats motivation.",
    "One day or day one. You decide.",
    "Consistency is your superpower.",
    "Tiny habits create massive change."
];

document.getElementById("dailyQuote").innerText =
    quotes[Math.floor(Math.random() * quotes.length)];

let trackerData = JSON.parse(localStorage.getItem("trackerData"));

if (!trackerData) trackerData = {};

months.forEach(m => {

    if (!trackerData[m]) {

        trackerData[m] = {

            name: "",
            notes: "",

            habits: Array.from({ length: 10 }, () => ({
                name: "",
                days: Array(31).fill(false)
            }))
        };
    }
});

function saveData() {
    localStorage.setItem("trackerData", JSON.stringify(trackerData));
}

/* MONTHS */

function initMonths() {

    months.forEach(m => {

        let option = document.createElement("option");

        option.value = m;
        option.innerText = m;

        monthSelector.appendChild(option);
    });

    monthSelector.value = currentMonth;

    monthSelector.addEventListener("change", () => {

        currentMonth = monthSelector.value;

        loadData();
        renderTable();
        updateDashboard();
    });
}

/* LOAD */

function loadData() {

    nameInput.value = trackerData[currentMonth].name;

    notesInput.value = trackerData[currentMonth].notes;
}

/* SAVE */

nameInput.addEventListener("input", () => {

    trackerData[currentMonth].name = nameInput.value;

    saveData();
});

notesInput.addEventListener("input", () => {

    trackerData[currentMonth].notes = notesInput.value;

    saveData();
});

/* CHECK */

function toggleCheck(i, j) {

    trackerData[currentMonth].habits[i].days[j] =
        !trackerData[currentMonth].habits[i].days[j];

    saveData();

    renderTable();

    updateDashboard();
}

/* HABIT NAME */

function updateHabit(i, value) {

    trackerData[currentMonth].habits[i].name = value;

    saveData();
}

/* STREAK */

function calculateStreak(days) {

    let streak = 0;
    let max = 0;

    for (let d of days) {

        if (d) {
            streak++;
            max = Math.max(max, streak);
        } else {
            streak = 0;
        }
    }

    return max;
}

/* TABLE */

function renderTable() {

    let html = "";

    let habits = trackerData[currentMonth].habits;

    for (let i = 0; i < habits.length; i++) {

        html += `
        <tr>

            <td>
                <input
                    value="${habits[i].name}"
                    placeholder="Habit ${i + 1}"
                    onchange="updateHabit(${i}, this.value)">
            </td>
        `;

        for (let j = 0; j < 31; j++) {

            html += `
            <td>

                <div
                    class="checkbox ${habits[i].days[j] ? 'checked' : ''}"
                    onclick="toggleCheck(${i}, ${j})">
                </div>

            </td>
            `;
        }

        html += `</tr>`;
    }

    habitBody.innerHTML = html;
}

/* DASHBOARD */

function updateDashboard() {

    let habits = trackerData[currentMonth].habits;

    let total = 0;
    let done = 0;
    let best = 0;

    for (let h of habits) {

        best = Math.max(best, calculateStreak(h.days));

        for (let d of h.days) {

            total++;

            if (d) done++;
        }
    }

    let percent = total
        ? Math.round((done / total) * 100)
        : 0;

    document.getElementById("percentDone").innerText =
        percent + "%";

    document.getElementById("bestStreak").innerText =
        best + "🔥";

    document.getElementById("totalDone").innerText =
        done;
}

/* DARK MODE */

function toggleTheme() {

    document.body.classList.toggle("dark");
}

/* INIT */

initMonths();

loadData();

renderTable();

updateDashboard();