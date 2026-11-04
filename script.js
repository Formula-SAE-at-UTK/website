const slides = document.querySelectorAll('.slide');
const galleryTitle = document.getElementById('gallery-title');
let currentSlide = 0;

function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });

    galleryTitle.textContent = slides[currentSlide].dataset.title;
}

document.querySelectorAll('.gallery-btn').forEach((button) => {
    button.addEventListener('click', () => {
        const direction = button.dataset.direction === 'next' ? 1 : -1;
        showSlide(currentSlide + direction);
    });
});

document.getElementById('contact-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.getElementById('contact-status');
    const formData = new FormData(form);
    const submission = Object.fromEntries(formData.entries());
    submission._subject = `Website inquiry from ${formData.get('name')}`;
    submission._replyto = formData.get('email');

    submitButton.disabled = true;
    status.textContent = 'Sending your inquiry...';

    try {
        const response = await fetch('https://formsubmit.co/ajax/winstonkr@icloud.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(submission)
        });

        const result = await response.json();
        if (!response.ok || result.success !== 'true') {
            throw new Error(result.message || 'The email service could not accept your inquiry.');
        }

        form.reset();
        status.textContent = 'Thanks! Your inquiry has been sent.';
    } catch (error) {
        status.textContent = error instanceof Error
            ? `Unable to send your inquiry: ${error.message}`
            : 'Unable to send your inquiry. Please try again later.';
    } finally {
        submitButton.disabled = false;
    }
});
