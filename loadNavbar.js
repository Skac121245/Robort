document.addEventListener('DOMContentLoaded', function() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            
            // Highlight current page in navbar
            const currentPage = window.location.pathname.split('/').pop();
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === './' + currentPage) {
                    link.classList.add('active');
                }
            });
            
            // Initialize dark mode toggle
            const darkModeToggle = document.getElementById('darkModeToggle');
            if (localStorage.getItem('darkMode') === 'enabled') {
                document.body.classList.add('bg-dark');
                document.body.classList.add('dark-mode');
                darkModeToggle.checked = true;
            }
        });
});