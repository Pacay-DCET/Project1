const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const grid = document.getElementById('habit-grid');
const habitModal = document.getElementById('habit-modal');
const currentUser = localStorage.getItem('currentUser');

if (!currentUser) {
    alert('No user logged in. Please log in first.');
    window.location.href = '../index.html';
}

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let habits = [];

function getHabitKey(year, month) {
    return `habits_${currentUser}_${year}_${month}`;
}

function loadHabits() {
    const data = localStorage.getItem(getHabitKey(currentYear, currentMonth));
    return data ? JSON.parse(data) : [];
}

function saveHabits() {
    localStorage.setItem(getHabitKey(currentYear, currentMonth), JSON.stringify(habits));
}

function renderCalendar() {
    habits = loadHabits();

    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

    document.getElementById('month-year-header').textContent = `${monthNames[currentMonth]} ${currentYear}`;

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `160px repeat(${totalDays}, 28px) 50px 60px`;

    grid.innerHTML += `<div class="cell header"></div>`;
    for (let d = 1; d <= totalDays; d++) {
        const weekday = new Date(currentYear, currentMonth, d).getDay();
        grid.innerHTML += `<div class="cell header" style="font-size:0.75rem;color:#666;">${weekdays[weekday]}</div>`;
    }
    grid.innerHTML += `<div class="cell header"></div><div class="cell header"></div>`;

    grid.innerHTML += `<div class="cell header">Habits</div>`;
    for (let d = 1; d <= totalDays; d++) {
        const highlight = isCurrentMonth && d === today.getDate() ? ' highlight-today' : '';
        grid.innerHTML += `<div class="cell header${highlight}">${d}</div>`;
    }
    grid.innerHTML += `<div class="cell header">Goal</div><div class="cell header">Achieved</div>`;

    habits.forEach(habit => renderHabit(habit, totalDays, isCurrentMonth ? today.getDate() : null));
}

function renderHabit(habit, totalDays, currentDate) {
    const nameCell = document.createElement('div');
    nameCell.className = 'cell habit-name';
    nameCell.textContent = habit.name;
    grid.appendChild(nameCell);

    if (!habit.checks) {
        habit.checks = Array(totalDays).fill(false);
    } else if (habit.checks.length < totalDays) {
        habit.checks = habit.checks.concat(Array(totalDays - habit.checks.length).fill(false));
    }

    habit.achieved = habit.checks.filter(Boolean).length;
    const achievedCell = document.createElement('div');

    for (let d = 0; d < totalDays; d++) {
        const cell = document.createElement('div');
        cell.className = 'cell minimal-check';
        cell.style.cursor = 'pointer';
        cell.style.background = habit.checks[d] ? '#a7e9af' : '#fff';
        cell.textContent = habit.checks[d] ? '✔' : '';

        cell.onclick = () => {
            if (d + 1 !== currentDate) {
                alert("You can only check today's habit!");
                return;
            }

            habit.checks[d] = !habit.checks[d];
            habit.achieved = habit.checks.filter(Boolean).length;

            cell.style.background = habit.checks[d] ? '#a7e9af' : '#fff';
            cell.textContent = habit.checks[d] ? '✔' : '';
            achievedCell.textContent = habit.achieved;

            const progress = habit.achieved / habit.goal;
            achievedCell.style.background = progress >= 1 ? '#4caf50' : '#fff176';
            achievedCell.style.color = progress >= 1 ? 'white' : '#000';

            saveHabits();
        };

        grid.appendChild(cell);
    }

    const goalCell = document.createElement('div');
    goalCell.className = 'cell';
    goalCell.textContent = habit.goal;
    grid.appendChild(goalCell);

    achievedCell.className = 'cell';
    achievedCell.textContent = habit.achieved;
    const progress = habit.achieved / habit.goal;
    achievedCell.style.background = progress >= 1 ? '#4caf50' : '#fff176';
    achievedCell.style.color = progress >= 1 ? 'white' : '#000';

    grid.appendChild(achievedCell);
}

// Habit Modal handling
document.getElementById('open-modal').onclick = () => habitModal.style.display = 'flex';
document.getElementById('close-modal').onclick = () => habitModal.style.display = 'none';
window.addEventListener('click', (e) => {
    if (e.target === habitModal) habitModal.style.display = 'none';
});

// Add habit
document.getElementById('add-habit').onclick = () => {
    const name = document.getElementById('habit-name').value.trim();
    const goal = parseInt(document.getElementById('habit-goal').value);
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    if (!name || isNaN(goal)) {
        alert("Please enter a valid habit name and goal.");
        return;
    }

    const alreadyExists = habits.some(habit => habit.name.toLowerCase() === name.toLowerCase());
    if (alreadyExists) {
        alert("This habit has already been added!");
        return;
    }

    const newHabit = { name, goal, achieved: 0, checks: Array(totalDays).fill(false) };
    habits.push(newHabit);
    saveHabits();
    renderCalendar();

    document.getElementById('habit-name').value = '';
    document.getElementById('habit-goal').value = '';
    habitModal.style.display = 'none';
};

// Logout
document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '../index.html';
};

// Month navigation
document.getElementById('prev-month').onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
};

document.getElementById('next-month').onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
};

// Notes 
const btnShowModal = document.getElementById('btnShowModal');
const noteModal = document.getElementById('noteModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnSaveNote = document.getElementById('btnSaveNote');
const userNoteInput = document.getElementById('userNoteInput');
const noteList = document.getElementById('noteList');

let editingNoteIndex = null;

// Show modal
btnShowModal.onclick = () => {
    noteModal.style.display = 'flex';
    userNoteInput.value = '';
    editingNoteIndex = null;
    userNoteInput.focus();
};

// Close modal
btnCloseModal.onclick = () => {
    noteModal.style.display = 'none';
};

// Close modal on outside click
window.onclick = (e) => {
    if (e.target === noteModal) {
        noteModal.style.display = 'none';
    }
};

// Format date nicely
function formatNoteDate(dateStr) {
    return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Load all notes from local storage
function loadUserNotes() {
    noteList.innerHTML = '';
    const storedNotes = JSON.parse(localStorage.getItem('userNotes') || '[]');

    storedNotes.forEach((noteObj, index) => {
        const noteItem = document.createElement('div');
        noteItem.className = 'note-entry';

        const textDiv = document.createElement('div');
        textDiv.className = 'note-text';
        textDiv.innerHTML = `
                    <div>${noteObj.text}</div>
                    <div class="note-date">${formatNoteDate(noteObj.date)}</div>
                `;

        const controlDiv = document.createElement('div');
        controlDiv.className = 'note-controls';

        const btnEdit = document.createElement('button');
        btnEdit.textContent = 'Edit';
        btnEdit.onclick = () => editUserNote(index);

        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Delete';
        btnDelete.onclick = () => deleteUserNote(index);

        controlDiv.appendChild(btnEdit);
        controlDiv.appendChild(btnDelete);

        noteItem.appendChild(textDiv);
        noteItem.appendChild(controlDiv);

        noteList.appendChild(noteItem);
    });
}

// Save to local storage
function saveUserNotes(notesArray) {
    localStorage.setItem('userNotes', JSON.stringify(notesArray));
}

// Edit existing note
function editUserNote(index) {
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    userNoteInput.value = notes[index].text;
    editingNoteIndex = index;
    noteModal.style.display = 'flex';
}

// Delete note
function deleteUserNote(index) {
    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');
    notes.splice(index, 1);
    saveUserNotes(notes);
    loadUserNotes();
}

// Save note 
btnSaveNote.onclick = () => {
    const inputText = userNoteInput.value.trim();
    if (!inputText) {
        alert('Please enter a note.');
        return;
    }

    const notes = JSON.parse(localStorage.getItem('userNotes') || '[]');

    if (editingNoteIndex !== null) {
        notes[editingNoteIndex].text = inputText;
    } else {
        notes.push({ text: inputText, date: new Date().toISOString() });
    }

    saveUserNotes(notes);
    loadUserNotes();
    noteModal.style.display = 'none';
};

loadUserNotes();
renderCalendar();
