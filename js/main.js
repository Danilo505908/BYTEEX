// Product carousel functionality
document.addEventListener('DOMContentLoaded', function() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('carouselMainImage');
    const prevButton = document.querySelector('.carousel__arrow--left');
    const nextButton = document.querySelector('.carousel__arrow--right');
    let currentIndex = 1;

    function updateCarousel(index) {
        thumbnails.forEach((thumb, i) => {
            thumb.classList.toggle('is-active', i === index);
        });
        if (mainImage && thumbnails[index]) {
            const imageSrc = thumbnails[index].getAttribute('data-image');
            if (imageSrc) {
                mainImage.src = imageSrc;
            }
        }
    }

    // Initialize carousel with second thumbnail active
    if (thumbnails.length > 0) {
        updateCarousel(currentIndex);
    }

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
        });
    });

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + thumbnails.length) % thumbnails.length;
            updateCarousel(currentIndex);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % thumbnails.length;
            updateCarousel(currentIndex);
        });
    }

    // Testimonials carousel functionality
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    const testimonialsCards = document.querySelectorAll('.testimonial-card');
    const testimonialsPrevButton = document.querySelector('.testimonials-arrow--left');
    const testimonialsNextButton = document.querySelector('.testimonials-arrow--right');
    
    if (testimonialsCarousel && testimonialsCards.length > 0) {
        let testimonialsIndex = 0;
        const cardsPerView = 3;
        const cardWidth = 338;
        const gap = 24;
        const cardWidthWithGap = cardWidth + gap;

        function updateTestimonialsCarousel() {
            const translateX = -testimonialsIndex * cardWidthWithGap;
            testimonialsCarousel.style.transform = `translateX(${translateX}px)`;
            
            // Update arrow visibility
            if (testimonialsPrevButton) {
                testimonialsPrevButton.style.opacity = testimonialsIndex === 0 ? '0.3' : '1';
                testimonialsPrevButton.disabled = testimonialsIndex === 0;
            }
            
            if (testimonialsNextButton) {
                const maxIndex = Math.max(0, testimonialsCards.length - cardsPerView);
                testimonialsNextButton.style.opacity = testimonialsIndex >= maxIndex ? '0.3' : '1';
                testimonialsNextButton.disabled = testimonialsIndex >= maxIndex;
            }
        }

        if (testimonialsNextButton) {
            testimonialsNextButton.addEventListener('click', () => {
                const maxIndex = Math.max(0, testimonialsCards.length - cardsPerView);
                if (testimonialsIndex < maxIndex) {
                    testimonialsIndex++;
                    updateTestimonialsCarousel();
                }
            });
        }

        if (testimonialsPrevButton) {
            testimonialsPrevButton.addEventListener('click', () => {
                if (testimonialsIndex > 0) {
                    testimonialsIndex--;
                    updateTestimonialsCarousel();
                }
            });
        }

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        let isDragging = false;

        testimonialsCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
        });

        testimonialsCarousel.addEventListener('touchmove', (e) => {
            if (isDragging) {
                touchEndX = e.touches[0].clientX;
            }
        });

        testimonialsCarousel.addEventListener('touchend', () => {
            if (isDragging) {
                const swipeDistance = touchStartX - touchEndX;
                const minSwipeDistance = 50;

                if (swipeDistance > minSwipeDistance) {
                    // Swipe left - next
                    const maxIndex = Math.max(0, testimonialsCards.length - cardsPerView);
                    if (testimonialsIndex < maxIndex) {
                        testimonialsIndex++;
                        updateTestimonialsCarousel();
                    }
                } else if (swipeDistance < -minSwipeDistance) {
                    // Swipe right - previous
                    if (testimonialsIndex > 0) {
                        testimonialsIndex--;
                        updateTestimonialsCarousel();
                    }
                }
                isDragging = false;
            }
        });

        // Mouse drag support
        let mouseDown = false;
        let startX = 0;
        let scrollLeft = 0;

        testimonialsCarousel.addEventListener('mousedown', (e) => {
            mouseDown = true;
            startX = e.pageX - testimonialsCarousel.offsetLeft;
            scrollLeft = testimonialsIndex * cardWidthWithGap;
        });

        testimonialsCarousel.addEventListener('mouseleave', () => {
            mouseDown = false;
        });

        testimonialsCarousel.addEventListener('mouseup', () => {
            mouseDown = false;
        });

        testimonialsCarousel.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            const newIndex = Math.round((scrollLeft - walk) / cardWidthWithGap);
            const maxIndex = Math.max(0, testimonialsCards.length - cardsPerView);
            
            if (newIndex >= 0 && newIndex <= maxIndex && newIndex !== testimonialsIndex) {
                testimonialsIndex = newIndex;
                updateTestimonialsCarousel();
            }
        });

        // Initialize testimonials carousel
        updateTestimonialsCarousel();
    }
});

