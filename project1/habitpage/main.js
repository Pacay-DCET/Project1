const weekdays = ["S", "M", "T", "W", "T", "F", "S"];
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const grid = document.getElementById('habit-grid');
const modal = document.getElementById('habit-modal');
const currentUser = localStorage.getItem('currentUser');

if (!currentUser) {
    alert('No user logged in. Please log in first.');
    window.location.href = '../p1.html';
}

let habits = loadHabits();
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function loadHabits() {
    const data = localStorage.getItem(`habits_${currentUser}`);
    return data ? JSON.parse(data) : [];
}

function saveHabits() {
    localStorage.setItem(`habits_${currentUser}`, JSON.stringify(habits));
}

function renderCalendar() {
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

    document.getElementById('month-year-header').textContent =
        `${monthNames[currentMonth]} ${currentYear}`;

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `160px repeat(${totalDays}, 28px) 50px 60px`;

    // Weekday row
    grid.innerHTML += `<div class="cell header"></div>`;
    for (let d = 1; d <= totalDays; d++) {
        const weekday = new Date(currentYear, currentMonth, d).getDay();
        grid.innerHTML += `<div class="cell header" style="font-size:0.75rem;color:#666;">${weekdays[weekday]}</div>`;
    }
    grid.innerHTML += `<div class="cell header"></div><div class="cell header"></div>`;

    // Date row
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

    if (!habit.checks || habit.checks.length !== totalDays) {
        habit.checks = Array(totalDays).fill(false);
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

// Modal handling
document.getElementById('open-modal').onclick = () => modal.style.display = 'flex';
document.getElementById('close-modal').onclick = () => modal.style.display = 'none';
window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
};

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
    modal.style.display = 'none';
};

// Logout
document.getElementById('logout-btn').onclick = function () {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '../p1.html';
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

function loadNotes() {
    const data = localStorage.getItem(`notes_${currentUser}`);
    return data ? JSON.parse(data) : [];
}

function saveNotes() {
    localStorage.setItem(`notes_${currentUser}`, JSON.stringify(notes));
}

let notes = loadNotes();

function renderNotesModal() {
    const list = document.getElementById('modal-notes-list');
    list.innerHTML = '';

    notes.forEach((note, idx) => {
        const li = document.createElement('li');
        li.className = 'note-item';

        const textContainer = document.createElement('div');
        textContainer.className = 'note-text-container';

        const noteText = document.createElement('span');
        noteText.className = 'note-text';
        noteText.textContent = note.text;

        const noteDate = document.createElement('div');
        noteDate.className = 'note-date';
        noteDate.textContent = note.date;

        textContainer.appendChild(noteText);
        textContainer.appendChild(noteDate);

        const actions = document.createElement('div');
        actions.className = 'note-actions';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit-note-btn';
        editBtn.onclick = () => editNote(idx);

        const delBtn = document.createElement('button');
        delBtn.textContent = 'X';
        delBtn.className = 'delete-note-btn';
        delBtn.onclick = () => {
            notes.splice(idx, 1);
            saveNotes();
            renderNotesModal();
            renderNotes();
        };

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        li.appendChild(textContainer);
        li.appendChild(actions);
        list.appendChild(li);
    });
}

function editNote(index) {
    const newText = prompt("Edit your note:", notes[index].text);
    if (newText !== null) {
        const trimmed = newText.trim();
        if (trimmed) {
            notes[index].text = trimmed;
            saveNotes();
            renderNotesModal();
            renderNotes();
        }
    }
}

function renderNotes() {
    const list = document.getElementById('notes-list');
    if (!list) return;
    list.innerHTML = '';
    notes.forEach(note => {
        const li = document.createElement('li');
        li.textContent = `${note.text} (${note.date})`;
        list.appendChild(li);
    });
}

function addNote() {
    const input = document.getElementById('note-input');
    const text = input.value.trim();
    if (!text) {
        alert("Note cannot be empty.");
        return;
    }

    const date = new Date().toISOString().split('T')[0];
    notes.push({ text, date });
    input.value = '';
    saveNotes();
    renderNotesModal();
    renderNotes();
}

function showNotesModal() {
    renderNotesModal();
    document.getElementById('notes-modal').style.display = 'flex';
}

document.getElementById('new-note-btn')?.addEventListener('click', showNotesModal);
document.getElementById('close-notes-modal')?.addEventListener('click', () => {
    document.getElementById('notes-modal').style.display = 'none';
});
document.getElementById('add-note-btn')?.addEventListener('click', addNote);

window.addEventListener('click', (e) => {
    const modal = document.getElementById('notes-modal');
    if (e.target === modal) modal.style.display = 'none';
});

renderNotes();

// Initial load
renderCalendar();
