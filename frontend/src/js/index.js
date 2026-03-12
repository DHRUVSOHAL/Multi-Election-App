document.getElementById('create-election-btn').addEventListener('click', function() {
    window.location.href = 'createElection.html';
});
document.getElementById('login-btn').addEventListener('click', function() {
    window.location.href = 'login.html';// login as voter
});
document.getElementById('dashboard-btn').addEventListener('click', function() {
    window.location.href = 'dashboard.html';
});
document.getElementById('election-login-btn').addEventListener('click', function() {
    window.location.href = 'admin_login.html';//login as admin
});
document.getElementById('admin-login-btn').addEventListener('click', function() {
    window.location.href = 'admin.html';//login as admin
});

document.getElementById('submit-election-btn').addEventListener('click', function() {
    window.location.href = 'admin.html';
});