const textInput = document.getElementById('text-input');
const bgColor = document.getElementById('bg-color');
const textColor = document.getElementById('text-color');
const preview = document.getElementById('preview');
const body = document.body;

// Update text
textInput.addEventListener('input', (e) => {
    const text = e.target.value || '360 brat generator';
    preview.textContent = text;
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
    textInput.style.color = textColor.value;
    textInput.style.borderColor = textColor.value;
});