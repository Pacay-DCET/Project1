const modal = document.getElementById('inventoryModal');
const openBtn = document.getElementById('openModal');
const closeSpn = document.getElementById('closeModalspn');
const closeBtn = document.getElementById('closeModalbtn');
const form = document.getElementById('inventoryForm');

const createAccountModal = document.getElementById('createAccountModal');
const openCreateAccountBtn = document.getElementById('openCreateAccount');
const closeCreateSpn = document.getElementById('closeCreateAccountModal');
const closeCreateBtn = document.getElementById('closeCreateAccountbtn');
const createAccountForm = document.getElementById('createAccountForm');

const startButton = document.getElementById('b');

// Event listeners for Login modal
openBtn.addEventListener('click', openModal);
closeSpn.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);
form.addEventListener('submit', loginUser);

// Event listeners for Create Account modal
openCreateAccountBtn.addEventListener('click', openCreateAccountModal);
closeCreateSpn.addEventListener('click', closeCreateModal);
closeCreateBtn.addEventListener('click', closeCreateModal);
createAccountForm.addEventListener('submit', createAccount);

// Show login modal
function openModal() {
    modal.style.display = 'block';
}

// Hide login modal
function closeModal() {
    modal.style.display = 'none';
    form.reset();
}

// Show create account modal
function openCreateAccountModal() {
    createAccountModal.style.display = 'block';
}

// Hide create account modal
function closeCreateModal() {
    createAccountModal.style.display = 'none';
    createAccountForm.reset();
}

// Login user
function loginUser(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (localStorage.getItem(username) === password) {
        alert('Login successful!');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username); // <-- Add this line
        closeModal();
        window.location.href = 'habitpage/p2.html';
    } else if (username === 'Chris' && password === 'Chrisjohn') {
        alert('Login successful! Welcome Chris!');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username); // <-- Add this line
        closeModal();
        window.location.href = 'habitpage/p2.html';
    } else {
        alert('Invalid username or password.');
    }
}

// Create account
function createAccount(e) {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    if (localStorage.getItem(newUsername)) {
        alert('Username already exists.');
    } else {
        localStorage.setItem(newUsername, newPassword);
        alert('Account created successfully! You can now log in.');
        closeCreateModal();
    }
}

// Start page 
startButton.addEventListener('click', function () {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        window.location.href = 'habitpage/p2.html';
    } else {
        alert('Please log in first!');
        openModal();
    }
});

// Close modal by clicking outside of it
window.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
    if (e.target === createAccountModal) closeCreateModal();
});
