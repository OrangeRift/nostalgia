// JavaScript Document

const heroTrack = document.getElementById('heroTrack');
const slides = document.querySelectorAll('.heroSlide');
const dots = document.querySelectorAll('.sliderDot');
const prevButton = document.getElementById('prevSlide');
const nextButton = document.getElementById('nextSlide');

let currentSlide = 0;
let autoSlideTimer;

if (heroTrack && slides.length > 0) {
	function showSlide(index) {
		if (index < 0) {
			currentSlide = slides.length - 1;
		} else if (index >= slides.length) {
			currentSlide = 0;
		} else {
			currentSlide = index;
		}

		heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

		slides.forEach((slide, slideIndex) => {
			if (slideIndex === currentSlide) {
				slide.classList.add('activeSlide');
			} else {
				slide.classList.remove('activeSlide');
			}
		});

		dots.forEach((dot, dotIndex) => {
			if (dotIndex === currentSlide) {
				dot.classList.add('activeDot');
			} else {
				dot.classList.remove('activeDot');
			}
		});
	}

	function nextHeroSlide() {
		showSlide(currentSlide + 1);
	}

	function restartAutoSlider() {
		clearInterval(autoSlideTimer);
		autoSlideTimer = setInterval(nextHeroSlide, 10000);
	}

	if (prevButton) {
		prevButton.addEventListener('click', () => {
			showSlide(currentSlide - 1);
			restartAutoSlider();
		});
	}

	if (nextButton) {
		nextButton.addEventListener('click', () => {
			showSlide(currentSlide + 1);
			restartAutoSlider();
		});
	}

	dots.forEach((dot, index) => {
		dot.addEventListener('click', () => {
			showSlide(index);
			restartAutoSlider();
		});
	});

	let touchStartX = 0;
	let touchEndX = 0;

	heroTrack.addEventListener('touchstart', event => {
		touchStartX = event.changedTouches[0].screenX;
	}, { passive: true });

	heroTrack.addEventListener('touchend', event => {
		touchEndX = event.changedTouches[0].screenX;
		handleHeroSwipe();
	}, { passive: true });

	function handleHeroSwipe() {
		const swipeDistance = touchEndX - touchStartX;

		if (Math.abs(swipeDistance) < 50) {
			return;
		}

		if (swipeDistance > 0) {
			showSlide(currentSlide - 1);
		} else {
			showSlide(currentSlide + 1);
		}

		restartAutoSlider();
	}

	restartAutoSlider();
}

const menuButton = document.getElementById('menuButton');
const menuCloseButton = document.getElementById('menuCloseButton');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuLinks = document.querySelectorAll('.mobileMenuLink');

function openMobileMenu() {
	if (!mobileMenu || !menuButton || !menuCloseButton) {
		return;
	}

	mobileMenu.classList.add('show');
	menuButton.style.display = 'none';
	menuCloseButton.style.display = 'flex';
}

function closeMobileMenu() {
	if (!mobileMenu || !menuButton || !menuCloseButton) {
		return;
	}

	mobileMenu.classList.remove('show');
	menuCloseButton.style.display = 'none';
	menuButton.style.display = 'flex';
}

if (menuButton && menuCloseButton && mobileMenu) {
	menuButton.addEventListener('click', event => {
		event.stopPropagation();
		openMobileMenu();
	});

	menuCloseButton.addEventListener('click', event => {
		event.stopPropagation();
		closeMobileMenu();
	});

	mobileMenu.addEventListener('click', event => {
		event.stopPropagation();
	});

	mobileMenuLinks.forEach(link => {
		link.addEventListener('click', closeMobileMenu);
	});

	document.addEventListener('click', event => {
		if (!mobileMenu.classList.contains('show')) {
			return;
		}

		if (
			!mobileMenu.contains(event.target) &&
			!menuButton.contains(event.target) &&
			!menuCloseButton.contains(event.target)
		) {
			closeMobileMenu();
		}
	});

	document.addEventListener('keydown', event => {
		if (event.key === 'Escape' && mobileMenu.classList.contains('show')) {
			closeMobileMenu();
		}
	});

	window.addEventListener('resize', () => {
		if (window.innerWidth >= 1200) {
			closeMobileMenu();
		}
	});
}

const timelinePoints = document.querySelectorAll('.timelinePoint');
const timelinePopup = document.getElementById('timelinePopup');
const timelinePopupTitle = document.getElementById('timelinePopupTitle');
const timelinePopupText = document.getElementById('timelinePopupText');
const timelinePopupClose = document.getElementById('timelinePopupClose');
const timelinePopupFigure = document.getElementById('timelinePopupFigure');
const timelinePopupImage = document.getElementById('timelinePopupImage');
const timelinePopupCaption = document.getElementById('timelinePopupCaption');

let lastTimelinePoint = null;

function openTimelinePopup(point) {
	if (!timelinePopup || !timelinePopupTitle || !timelinePopupText) {
		return;
	}

	lastTimelinePoint = point;

	timelinePopupTitle.textContent = point.dataset.title || '';
	timelinePopupText.textContent = point.dataset.text || '';

	if (timelinePopupFigure && timelinePopupImage && timelinePopupCaption) {
		const imageSrc = point.dataset.image || '';
		const imageCaption = point.dataset.imageCaption || '';

		if (imageSrc) {
			timelinePopupImage.src = imageSrc;
			timelinePopupImage.alt = imageCaption || point.dataset.title || '';
			timelinePopupCaption.textContent = imageCaption;
			timelinePopupFigure.style.display = 'block';
		} else {
			timelinePopupFigure.style.display = 'none';
		}
	}

	timelinePopup.classList.add('show');
	timelinePopup.setAttribute('aria-hidden', 'false');

	if (timelinePopupClose) {
		timelinePopupClose.focus();
	}
}

function closeTimelinePopup() {
	if (!timelinePopup) {
		return;
	}

	if (timelinePopup.contains(document.activeElement)) {
		document.activeElement.blur();
	}

	timelinePopup.classList.remove('show');
	timelinePopup.setAttribute('aria-hidden', 'true');

	if (lastTimelinePoint) {
		lastTimelinePoint.focus();
	}
}

if (timelinePoints.length > 0 && timelinePopup) {
	timelinePoints.forEach(point => {
		point.addEventListener('click', event => {
			event.stopPropagation();
			openTimelinePopup(point);
		});
	});

	if (timelinePopupClose) {
		timelinePopupClose.addEventListener('click', event => {
			event.stopPropagation();
			closeTimelinePopup();
		});
	}

	document.addEventListener('click', event => {
		if (!timelinePopup.classList.contains('show')) {
			return;
		}

		if (!timelinePopup.contains(event.target) && !event.target.classList.contains('timelinePoint')) {
			closeTimelinePopup();
		}
	});
}

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxTriggers = document.querySelectorAll('.lightboxTrigger');

let currentLightboxImage = 0;
let currentLightboxGroup = [];

function getCaptionForImage(image) {
	if (image.dataset.caption) {
		return image.dataset.caption;
	}

	const figure = image.closest('figure');

	if (figure) {
		const caption = figure.querySelector('figcaption');

		if (caption) {
			return caption.textContent;
		}
	}

	return image.alt || '';
}

function setLightboxGroup(groupName) {
	currentLightboxGroup = Array.from(lightboxTriggers).filter(image => {
		return (image.dataset.gallery || 'default') === groupName;
	});
}

function showLightboxImage(index) {
	if (!currentLightboxGroup.length) {
		return;
	}

	if (index < 0) {
		currentLightboxImage = currentLightboxGroup.length - 1;
	} else if (index >= currentLightboxGroup.length) {
		currentLightboxImage = 0;
	} else {
		currentLightboxImage = index;
	}

	const image = currentLightboxGroup[currentLightboxImage];

	lightboxImage.src = image.dataset.full || image.src;
	lightboxImage.alt = image.alt;
	lightboxCaption.textContent = getCaptionForImage(image);

	if (currentLightboxGroup.length <= 1) {
		lightboxPrev.style.display = 'none';
		lightboxNext.style.display = 'none';
	} else {
		lightboxPrev.style.display = 'flex';
		lightboxNext.style.display = 'flex';
	}
}

function openLightbox(image) {
	if (!lightbox || !lightboxImage || !lightboxCaption) {
		return;
	}

	const groupName = image.dataset.gallery || 'default';
	setLightboxGroup(groupName);

	const imageIndex = currentLightboxGroup.indexOf(image);

	showLightboxImage(imageIndex);

	lightbox.classList.add('show');
	lightbox.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = 'hidden';
}

function closeLightbox() {
	if (!lightbox || !lightboxImage || !lightboxCaption) {
		return;
	}

	if (lightbox.contains(document.activeElement)) {
		document.activeElement.blur();
	}

	lightbox.classList.remove('show');
	lightbox.setAttribute('aria-hidden', 'true');
	lightboxImage.src = '#';
	lightboxCaption.textContent = '';
	document.body.style.overflow = '';
}

if (lightbox && lightboxTriggers.length > 0) {
	lightboxTriggers.forEach(image => {
		image.addEventListener('click', () => {
			openLightbox(image);
		});
	});

	lightboxPrev.addEventListener('click', event => {
		event.stopPropagation();
		showLightboxImage(currentLightboxImage - 1);
	});

	lightboxNext.addEventListener('click', event => {
		event.stopPropagation();
		showLightboxImage(currentLightboxImage + 1);
	});

	lightboxClose.addEventListener('click', closeLightbox);

	lightbox.addEventListener('click', event => {
		if (event.target === lightbox) {
			closeLightbox();
		}
	});

	document.addEventListener('keydown', event => {
		if (timelinePopup && timelinePopup.classList.contains('show') && event.key === 'Escape') {
			closeTimelinePopup();
		}

		if (!lightbox.classList.contains('show')) {
			return;
		}

		if (event.key === 'Escape') {
			closeLightbox();
		}

		if (event.key === 'ArrowLeft') {
			showLightboxImage(currentLightboxImage - 1);
		}

		if (event.key === 'ArrowRight') {
			showLightboxImage(currentLightboxImage + 1);
		}
	});
}