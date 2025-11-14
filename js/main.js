/**
 * BYTEEX - Main JavaScript
 * Clean, efficient, and well-organized code
 */

// ============================================================================
// CONSTANTS
// ============================================================================

const CONSTANTS = {
    MOBILE_BREAKPOINT: '(max-width: 428px)',
    SWIPE_THRESHOLD: 50,
    AUTOPLAY_DELAY: 4000,
    TESTIMONIALS: {
        CARDS_PER_VIEW: 3,
        CARD_WIDTH: 338,
        GAP: 24
    }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a swipe handler for touch events
 * @param {Function} onSwipeLeft - Callback for left swipe
 * @param {Function} onSwipeRight - Callback for right swipe
 * @returns {Object} Touch event handlers
 */
function createSwipeHandler(onSwipeLeft, onSwipeRight) {
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;

    return {
        touchstart: (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
        },
        touchmove: (e) => {
            if (isDragging) {
                touchEndX = e.touches[0].clientX;
            }
        },
        touchend: () => {
            if (isDragging) {
                const swipeDistance = touchStartX - touchEndX;
                if (swipeDistance > CONSTANTS.SWIPE_THRESHOLD) {
                    onSwipeLeft();
                } else if (swipeDistance < -CONSTANTS.SWIPE_THRESHOLD) {
                    onSwipeRight();
                }
                isDragging = false;
            }
        }
    };
}

/**
 * Updates ARIA attributes for navigation dots
 * @param {NodeList} dots - Collection of dot elements
 * @param {number} activeIndex - Index of active dot
 */
function updateDotsAria(dots, activeIndex) {
    dots.forEach((dot, index) => {
        const isActive = index === activeIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
}

// ============================================================================
// PRODUCT CAROUSEL
// ============================================================================

/**
 * Initializes product carousel functionality
 */
function initProductCarousel() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('carouselMainImage');
    const prevButton = document.querySelector('.carousel__arrow--left');
    const nextButton = document.querySelector('.carousel__arrow--right');
    const carouselMain = document.querySelector('.carousel__main');
    
    if (thumbnails.length === 0) return;

    let currentIndex = 1;

    /**
     * Updates carousel display based on current index
     */
    function updateCarousel(index) {
        // Update thumbnail states
        thumbnails.forEach((thumb, i) => {
            const isActive = i === index;
            thumb.classList.toggle('is-active', isActive);
            thumb.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // Update main image
        if (mainImage && thumbnails[index]) {
            const dataImage = thumbnails[index].getAttribute('data-image');
            const thumbnailImg = thumbnails[index].querySelector('img');
            const imageSrc = dataImage || (thumbnailImg ? thumbnailImg.getAttribute('src') : null);

            if (imageSrc) {
                mainImage.src = imageSrc;
                if (carouselMain) {
                    carouselMain.style.backgroundImage = `url('${imageSrc}')`;
                }
            }
        }
    }

    /**
     * Navigates to previous slide
     */
    function goToPrevious() {
        currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
        updateCarousel(currentIndex);
    }

    /**
     * Navigates to next slide
     */
    function goToNext() {
        currentIndex = (currentIndex + 1) % thumbnails.length;
        updateCarousel(currentIndex);
    }

    // Initialize carousel
    updateCarousel(currentIndex);

    // Thumbnail click handlers
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
        });
    });

    // Navigation button handlers
    if (prevButton) {
        prevButton.addEventListener('click', goToPrevious);
    }

    if (nextButton) {
        nextButton.addEventListener('click', goToNext);
    }

    // Touch/swipe support
    if (carouselMain) {
        const swipeHandlers = createSwipeHandler(goToNext, goToPrevious);
        carouselMain.addEventListener('touchstart', swipeHandlers.touchstart, { passive: true });
        carouselMain.addEventListener('touchmove', swipeHandlers.touchmove, { passive: true });
        carouselMain.addEventListener('touchend', swipeHandlers.touchend);
    }
}

// ============================================================================
// AS SEEN IN SLIDER
// ============================================================================

/**
 * Initializes "As seen in" slider (mobile only)
 */
function initAsSeenSlider() {
    const slider = document.querySelector('.as-seen-in__slider');
    if (!slider) return;

    const track = slider.querySelector('.as-seen-in__track');
    const slides = slider.querySelectorAll('.as-seen-in__slide');
    const dots = slider.querySelectorAll('.as-seen-in__dot');
    const slideCount = slides.length;
    
    if (slideCount === 0) return;

    let currentIndex = 0;
    let autoplayId = null;
    let isEnabled = false;
    const mediaQuery = window.matchMedia(CONSTANTS.MOBILE_BREAKPOINT);

    /**
     * Updates dot indicators
     */
    function updateDots() {
        updateDotsAria(dots, currentIndex);
    }

    /**
     * Navigates to specific slide
     */
    function goToSlide(index) {
        if (!isEnabled || !track) return;
        currentIndex = (index + slideCount) % slideCount;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    }

    /**
     * Stops autoplay
     */
    function stopAutoplay() {
        if (autoplayId) {
            clearInterval(autoplayId);
            autoplayId = null;
        }
    }

    /**
     * Starts autoplay
     */
    function startAutoplay() {
        if (!isEnabled || slideCount < 2) return;
        stopAutoplay();
        autoplayId = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, CONSTANTS.AUTOPLAY_DELAY);
    }

    /**
     * Enables slider
     */
    function enableSlider() {
        if (isEnabled) return;
        isEnabled = true;
        currentIndex = 0;
        updateDots();
        goToSlide(0);
        startAutoplay();
    }

    /**
     * Disables slider
     */
    function disableSlider() {
        if (!isEnabled) return;
        isEnabled = false;
        stopAutoplay();
        currentIndex = 0;
        if (track) {
            track.style.transform = '';
        }
        updateDots();
    }

    /**
     * Restarts autoplay
     */
    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (!isEnabled) return;
            goToSlide(index);
            restartAutoplay();
        });
    });

    // Pause autoplay on interaction
    ['mouseenter', 'focusin'].forEach(eventName => {
        slider.addEventListener(eventName, () => {
            if (isEnabled) stopAutoplay();
        });
    });

    ['mouseleave', 'focusout'].forEach(eventName => {
        slider.addEventListener(eventName, () => {
            if (isEnabled) startAutoplay();
        });
    });

    slider.addEventListener('touchstart', () => {
        if (isEnabled) stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', () => {
        if (isEnabled) startAutoplay();
    });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (!isEnabled) return;
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    // Media query handler
    function handleMediaChange(event) {
        if (event.matches) {
            enableSlider();
        } else {
            disableSlider();
        }
    }

    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaChange);
}

// ============================================================================
// COMFORT MOBILE SLIDER
// ============================================================================

/**
 * Initializes comfort mobile slider
 */
function initComfortSlider() {
    const slider = document.querySelector('.comfort-mobile-slider');
    if (!slider) return;

    const track = slider.querySelector('.comfort-mobile-track');
    const cards = slider.querySelectorAll('.comfort-mobile-card');
    const prevButton = slider.querySelector('.comfort-mobile-nav--prev');
    const nextButton = slider.querySelector('.comfort-mobile-nav--next');
    const slideCount = cards.length;
    
    if (slideCount === 0) return;

    const mediaQuery = window.matchMedia(CONSTANTS.MOBILE_BREAKPOINT);
    let currentIndex = 0;
    let isEnabled = false;

    /**
     * Updates slider position
     */
    function updateSlider() {
        if (!isEnabled || !track) return;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    /**
     * Changes slide by direction
     */
    function changeSlide(direction) {
        if (!isEnabled) return;
        currentIndex = (currentIndex + direction + slideCount) % slideCount;
        updateSlider();
    }

    /**
     * Enables slider
     */
    function enableSlider() {
        if (isEnabled) return;
        isEnabled = true;
        currentIndex = 0;
        updateSlider();
    }

    /**
     * Disables slider
     */
    function disableSlider() {
        if (!isEnabled) return;
        isEnabled = false;
        currentIndex = 0;
        if (track) {
            track.style.transform = '';
        }
    }

    // Navigation handlers
    if (prevButton) {
        prevButton.addEventListener('click', () => changeSlide(-1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => changeSlide(1));
    }

    // Media query handler
    function handleMediaChange(event) {
        if (event.matches) {
            enableSlider();
        } else {
            disableSlider();
        }
    }

    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaChange);
}

// ============================================================================
// TESTIMONIALS CAROUSEL
// ============================================================================

/**
 * Initializes testimonials carousel
 */
function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonials-carousel');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.testimonials-arrow--left');
    const nextButton = document.querySelector('.testimonials-arrow--right');
    const dots = document.querySelectorAll('.fans-testimonials-dot');

    if (!carousel || cards.length === 0) return;

    const { CARDS_PER_VIEW, CARD_WIDTH, GAP } = CONSTANTS.TESTIMONIALS;
    const cardWidthWithGap = CARD_WIDTH + GAP;
    let currentIndex = 0;

    /**
     * Updates carousel display and controls
     */
    function updateCarousel() {
        const translateX = -currentIndex * cardWidthWithGap;
        carousel.style.transform = `translateX(${translateX}px)`;

        // Update navigation buttons
        const maxIndex = Math.max(0, cards.length - CARDS_PER_VIEW);
        
        if (prevButton) {
            prevButton.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevButton.disabled = currentIndex === 0;
        }

        if (nextButton) {
            nextButton.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
            nextButton.disabled = currentIndex >= maxIndex;
        }

        // Update dots
        if (dots.length > 0) {
            const dotIndex = Math.floor(currentIndex / CARDS_PER_VIEW);
            const activeDotIndex = Math.min(dotIndex, dots.length - 1);
            updateDotsAria(dots, activeDotIndex);
        }
    }

    /**
     * Navigates to next slide
     */
    function goToNext() {
        const maxIndex = Math.max(0, cards.length - CARDS_PER_VIEW);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    }

    /**
     * Navigates to previous slide
     */
    function goToPrevious() {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    }

    // Navigation button handlers
    if (nextButton) {
        nextButton.addEventListener('click', goToNext);
    }

    if (prevButton) {
        prevButton.addEventListener('click', goToPrevious);
    }

    // Touch/swipe support
    const swipeHandlers = createSwipeHandler(goToNext, goToPrevious);
    carousel.addEventListener('touchstart', swipeHandlers.touchstart);
    carousel.addEventListener('touchmove', swipeHandlers.touchmove);
    carousel.addEventListener('touchend', swipeHandlers.touchend);

    // Mouse drag support
    let mouseDown = false;
    let startX = 0;
    let scrollLeft = 0;

    carousel.addEventListener('mousedown', (e) => {
        mouseDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = currentIndex * cardWidthWithGap;
    });

    carousel.addEventListener('mouseleave', () => {
        mouseDown = false;
    });

    carousel.addEventListener('mouseup', () => {
        mouseDown = false;
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!mouseDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        const newIndex = Math.round((scrollLeft - walk) / cardWidthWithGap);
        const maxIndex = Math.max(0, cards.length - CARDS_PER_VIEW);

        if (newIndex >= 0 && newIndex <= maxIndex && newIndex !== currentIndex) {
            currentIndex = newIndex;
            updateCarousel();
        }
    });

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const targetIndex = index * CARDS_PER_VIEW;
            const maxIndex = Math.max(0, cards.length - CARDS_PER_VIEW);
            currentIndex = Math.min(targetIndex, maxIndex);
            updateCarousel();
        });
    });

    // Initialize carousel
    updateCarousel();
}

// ============================================================================
// FAQ ACCORDION
// ============================================================================

/**
 * Initializes FAQ accordion functionality
 */
function initFAQAccordion() {
    const questions = document.querySelectorAll('.faq-question');
    if (questions.length === 0) return;

    /**
     * Closes all FAQ items
     */
    function closeAllItems() {
        document.querySelectorAll('.faq-item').forEach((item) => {
            item.classList.remove('faq-item--active');
            const icon = item.querySelector('.faq-icon');
            const answer = item.querySelector('.faq-answer');
            const button = item.querySelector('.faq-question');

            if (icon) {
                icon.classList.remove('faq-icon--minus');
                icon.classList.add('faq-icon--plus');
                icon.textContent = '+';
            }
            if (answer) {
                answer.style.maxHeight = '0';
                answer.style.padding = '0';
            }
            if (button) {
                button.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /**
     * Opens a FAQ item
     */
    function openItem(item, icon, answer, button) {
        item.classList.add('faq-item--active');
        if (icon) {
            icon.classList.remove('faq-icon--plus');
            icon.classList.add('faq-icon--minus');
            icon.textContent = '−';
        }
        if (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.padding = '0 0 20px 0';
        }
        button.setAttribute('aria-expanded', 'true');
    }

    // Question click handlers
    questions.forEach((question) => {
        question.addEventListener('click', () => {
            const item = question.closest('.faq-item');
            const isActive = item.classList.contains('faq-item--active');
            const icon = question.querySelector('.faq-icon');
            const answer = item.querySelector('.faq-answer');

            closeAllItems();

            if (!isActive) {
                openItem(item, icon, answer, question);
            }
        });
    });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initializes all components when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initProductCarousel();
    initAsSeenSlider();
    initComfortSlider();
    initTestimonialsCarousel();
    initFAQAccordion();
});
