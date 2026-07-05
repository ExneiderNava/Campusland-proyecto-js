
document.addEventListener('DOMContentLoaded', () => {
    fetch('../components/menu_sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;
        });
});