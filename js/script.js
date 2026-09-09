document.addEventListener('DOMContentLoaded', () => {

	const navbar = document.getElementById('navbar');
	const navToggle = document.getElementById('navToggle');
	const navLinks = document.getElementById('navLinks');
	const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	/* ---------- Navbar: transparencia y sección activa ---------- */

	const isMenuOpen = () => !!navLinks && navLinks.classList.contains('open');

	const updateNavbar = () => {
		if (!navbar) return;
		navbar.classList.toggle('scrolled', window.scrollY > 10 || isMenuOpen());
	};

	// Enlaces del menú que apuntan a una sección de esta página
	const spyTargets = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'))
		.map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
		.filter(target => target.section);

	const updateSpy = () => {
		if (!spyTargets.length) return;

		const line = window.scrollY + (navbar ? navbar.offsetHeight : 0) + 24;
		let current = null;

		spyTargets.forEach(target => {
			if (target.section.offsetTop <= line) current = target;
		});

		// Al final de la página siempre marca la última sección
		const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
		if (atBottom) current = spyTargets[spyTargets.length - 1];

		spyTargets.forEach(target => target.link.classList.toggle('active', target === current));
	};

	// Un solo listener pasivo, limitado a un cálculo por frame
	let ticking = false;
	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			updateNavbar();
			updateSpy();
			ticking = false;
		});
	};

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll, { passive: true });
	updateNavbar();
	updateSpy();

	/* ---------- Menú móvil ---------- */

	const setMenu = open => {
		if (!navToggle || !navLinks) return;
		navLinks.classList.toggle('open', open);
		navToggle.classList.toggle('open', open);
		navToggle.setAttribute('aria-expanded', String(open));
		navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
		document.body.classList.toggle('nav-open', open);
		updateNavbar();
	};

	if (navToggle && navLinks) {
		navToggle.addEventListener('click', () => setMenu(!isMenuOpen()));

		// Cierra al elegir un destino
		navLinks.querySelectorAll('a').forEach(link => {
			link.addEventListener('click', () => setMenu(false));
		});

		// Cierra con Escape y devuelve el foco al botón
		document.addEventListener('keydown', event => {
			if (event.key === 'Escape' && isMenuOpen()) {
				setMenu(false);
				navToggle.focus();
			}
		});

		// Cierra al tocar fuera del menú
		document.addEventListener('click', event => {
			if (!isMenuOpen()) return;
			if (navLinks.contains(event.target) || navToggle.contains(event.target)) return;
			setMenu(false);
		});

		// Si se vuelve a escritorio con el menú abierto, restablece el estado
		window.matchMedia('(min-width: 1025px)').addEventListener('change', event => {
			if (event.matches && isMenuOpen()) setMenu(false);
		});
	}

	/* ---------- Año del footer ----------
	   El HTML trae un año escrito para que el aviso salga bien aunque
	   el JS no cargue; aquí solo se actualiza al año en curso. */

	const anio = document.getElementById('anio');
	if (anio) anio.textContent = new Date().getFullYear();

	/* ---------- Animaciones de entrada ---------- */

	const revealEls = document.querySelectorAll('.reveal');

	if (reduceMotion.matches || !('IntersectionObserver' in window)) {
		// Sin animación: todo visible de inmediato
		revealEls.forEach(el => el.classList.add('in-view'));
	} else {
		const observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15 });

		revealEls.forEach(el => observer.observe(el));
	}

	/* ---------- Video del hero ----------
	   El video solo se descarga en pantallas grandes y con animación permitida.
	   En móvil, o con "reducir movimiento", basta el poster: son ~60 KB
	   en lugar de ~2.6 MB. */

	const heroVideo = document.querySelector('.hero video');
	const wideScreen = window.matchMedia('(min-width: 768px)');

	const shouldPlayHero = () => wideScreen.matches && !reduceMotion.matches;

	const loadHeroVideo = () => {
		if (!heroVideo || heroVideo.dataset.loaded) return;

		[['video/webm', heroVideo.dataset.videoWebm],
		 ['video/mp4', heroVideo.dataset.videoMp4]].forEach(([type, src]) => {
			if (!src) return;
			const source = document.createElement('source');
			source.type = type;
			source.src = src;
			heroVideo.appendChild(source);
		});

		heroVideo.dataset.loaded = 'true';
		heroVideo.load();
	};

	const syncHeroVideo = () => {
		if (!heroVideo) return;

		if (!shouldPlayHero()) {
			heroVideo.pause();
			return;
		}

		loadHeroVideo();
		// play() puede rechazarse si el navegador bloquea la reproducción
		const played = heroVideo.play();
		if (played) played.catch(() => {});
	};

	syncHeroVideo();
	wideScreen.addEventListener('change', syncHeroVideo);
	reduceMotion.addEventListener('change', () => {
		syncHeroVideo();
		if (reduceMotion.matches) revealEls.forEach(el => el.classList.add('in-view'));
	});
});
