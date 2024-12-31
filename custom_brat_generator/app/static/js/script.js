const textInput = document.getElementById('text-input');
const bgColor = document.getElementById('bg-color');
const textColor = document.getElementById('text-color');
const preview = document.getElementById('preview');
const body = document.body;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set up pixelation effect
function setupPixelationEffect() {
    const scale = 0.25;
    canvas.width = preview.offsetWidth * scale;
    canvas.height = preview.offsetHeight * scale;
    canvas.style.width = `${preview.offsetWidth}px`;
    canvas.style.height = `${preview.offsetHeight}px`;
    ctx.scale(scale, scale);
}

// Update text
textInput.addEventListener('input', (e) => {
    const text = e.target.value || '360 brat generator';
    preview.textContent = text;
    setupPixelationEffect();
});

// Update background color
bgColor.addEventListener('input', (e) => {
    body.style.backgroundColor = e.target.value;
    preview.style.backgroundColor = e.target.value;
});

// Update text color
textColor.addEventListener('input', (e) => {
    preview.style.color = e.target.value;
    textInput.style.color = e.target.value;
    textInput.style.borderColor = e.target.value;
});

// Initialize defaults
window.addEventListener('load', () => {
    preview.textContent = textInput.value || '360 brat generator';
    body.style.backgroundColor = bgColor.value;
    preview.style.color = textColor.value;
    textInput.style.borderColor = textColor.value;
    textInput.style.color = textColor.value;
    setupPixelationEffect();
});

// Handle window resize
window.addEventListener('resize', setupPixelationEffect);