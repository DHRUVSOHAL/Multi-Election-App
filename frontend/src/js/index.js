const createElectionBtn = document.getElementById('create-election-btn');
if (createElectionBtn) {
    createElectionBtn.addEventListener('click', () => {
        window.location.href = 'createElection.html';
    });
}

const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });
}

const electionLoginBtn = document.getElementById('election-login-btn');
if (electionLoginBtn) {
    electionLoginBtn.addEventListener('click', () => {
        window.location.href = 'admin_login.html';
    });
}

const registerBtn = document.getElementById('register-btn');
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        window.location.href = 'register.html';
    });
}