const Nav = {
    init() {
        // navLinks = all links in navbar in desktop
        const navLinks = document.querySelectorAll('#nav [data-view]');
        navLinks.forEach(link =>
            link.addEventListener('click', () => View.switchView(link.getAttribute('data-view'))));

        // tabLinks = all links in tabmenu in tablet/desktop
        const tabLinks = document.querySelectorAll('#tab-menu [data-view]');
        tabLinks.forEach(link =>
            link.addEventListener('click', () => View.switchView(link.getAttribute('data-view'))));
        
        // formLinks = quicklinks to add-forms in 'home'
        const formLinks = document.querySelectorAll('#form-links [data-view]');
        formLinks.forEach(link =>
            link.addEventListener('click', () => {
                View.switchView(link.getAttribute('data-view'));
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