const Nav = {
    init() {
        const navLinks = document.querySelectorAll('#nav [data-view]');
        navLinks.forEach(link =>
            link.addEventListener('click', () => View.switchView(link.getAttribute('data-view'))));

        const tabLinks = document.querySelectorAll('#tab-menu [data-view]');
        tabLinks.forEach(link =>
            link.addEventListener('click', () => View.switchView(link.getAttribute('data-view'))));

        const formLinks = document.querySelectorAll('#form-links [data-view]');
        formLinks.forEach(link =>
            link.addEventListener('click', () => {
                View.switchView(link.getAttribute('data-view'))
                const location = document.getElementById(link.getAttribute('data-location'));

                setTimeout(() => {
                    location.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                });
            }));
    }
}