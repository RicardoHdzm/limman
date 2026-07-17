document.addEventListener('DOMContentLoaded', () => {

	const navbar = document.getElementById('navbar');
	const navToggle = document.getElementById('navToggle');
	const navLinks = document.getElementById('navLinks');

	// Navbar transparency until first scroll (or while the mobile menu is open)
	const updateNavbar = () => {
		if (!navbar) return;
		const menuOpen = navLinks ? navLinks.classList.contains('open') : false;
		navbar.classList.toggle('scrolled', window.scrollY > 10 || menuOpen);
	};
	updateNavbar();
	window.addEventListener('scroll', updateNavbar);

	// Mobile nav toggle
	if (navToggle && navLinks) {
		navToggle.addEventListener('click', () => {
			const isOpen = navLinks.classList.toggle('open');
			navToggle.classList.toggle('open', isOpen);
			navToggle.setAttribute('aria-expanded', isOpen);
			updateNavbar();
		});

		navLinks.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				navLinks.classList.remove('open');
				navToggle.classList.remove('open');
				navToggle.setAttribute('aria-expanded', 'false');
				updateNavbar();
			});
		});
	}

	// Scroll reveal animations
	const revealEls = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window) {
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15 });

		revealEls.forEach(el => observer.observe(el));
	} else {
		revealEls.forEach(el => el.classList.add('in-view'));
	}
});
