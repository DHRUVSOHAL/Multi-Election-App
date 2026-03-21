const createElectionBtn = document.getElementById('create-election-btn');
if (createElectionBtn) {
    createElectionBtn.addEventListener('click', () => {
        window.location.href = './src/pages/createElection.html';
    });
}

const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        window.location.href = './src/pages/login.html';
    });
}

const electionLoginBtn = document.getElementById('election-login-btn');
if (electionLoginBtn) {
    electionLoginBtn.addEventListener('click', () => {
        window.location.href = './src/pages/admin_login.html';
    });
}

const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        window.location.href = './src/pages/register.html';
    });
}

const manageElectionBtn = document.getElementById('manage-election-btn');
if (manageElectionBtn) {
    manageElectionBtn.addEventListener('click', () => {
        window.location.href = './src/pages/manageElection.html';
    });
}