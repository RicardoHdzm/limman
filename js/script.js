document.addEventListener('DOMContentLoaded', () => {

	// Mobile nav toggle
	const navToggle = document.getElementById('navToggle');
	const navLinks = document.getElementById('navLinks');

	if (navToggle && navLinks) {
		navToggle.addEventListener('click', () => {
			const isOpen = navLinks.classList.toggle('open');
			navToggle.classList.toggle('open', isOpen);
			navToggle.setAttribute('aria-expanded', isOpen);
		});

		navLinks.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => {
				navLinks.classList.remove('open');
				navToggle.classList.remove('open');
				navToggle.setAttribute('aria-expanded', 'false');
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
