const textInput = document.getElementById('text-input');
const bgColor = document.getElementById('bg-color');
const textColor = document.getElementById('text-color');
const preview = document.getElementById('preview');
const body = document.body;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const instructions = document.querySelector('.instructions');
const footer = document.querySelector('.footer');
const footerLinks = document.querySelectorAll('.footer a');

// Set up pixelation effect
function setupPixelationEffect() {
    const scale = 0.25;
    canvas.width = preview.offsetWidth * scale;
    canvas.height = preview.offsetHeight * scale;
    canvas.style.width = `${preview.offsetWidth}px`;
    canvas.style.height = `${preview.offsetHeight}px`;
    ctx.scale(scale, scale);
}

// Function to check brightness
function isColorDark(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness < 128;
}

// Update text color globally
function updateTextColors(color) {
    preview.style.color = color;
    if (!isColorDark(bgColor.value)) {
        textInput.style.color = color;
        instructions.style.color = color;
        footer.style.color = color;
        footerLinks.forEach(link => link.style.color = color);
    }
    textInput.style.borderColor = color;
}


// Update text
textInput.addEventListener('input', (e) => {
    const text = e.target.value || '360 brat generator';
    preview.textContent = text;
    setupPixelationEffect();
});

// Update background color
bgColor.addEventListener('input', (e) => {
    const color = e.target.value;
    const colorInputs = document.querySelectorAll('input[type="color"]');
    body.style.backgroundColor = color;
    preview.style.backgroundColor = color;
    
    if (isColorDark(color)) {
        instructions.style.color = '#ffffff';
        textInput.style.color = '#ffffff'; 
        textInput.style.backgroundColor = '#000000';
        textInput.style.borderColor = '#ffffff';
        colorInputs.forEach(input => input.style.border = '2px solid #ffffff');
        footer.style.color = '#ffffff';
        footerLinks.forEach(link => link.style.color = '#ffffff');
    } else {
        updateTextColors(textColor.value);
        textInput.style.backgroundColor = '#ffffff';
        colorInputs.forEach(input => input.style.border = '2px solid #000000');
    }
});


// Update text color
textColor.addEventListener('input', (e) => {
    const color = e.target.value;
    updateTextColors(color);
});


// Initialize defaults
window.addEventListener('load', () => {
    preview.textContent = textInput.value || '360 brat generator';
    body.style.backgroundColor = bgColor.value;
    updateTextColors(textColor.value);
    
    if (isColorDark(bgColor.value)) {
        instructions.style.color = '#ffffff';
        textInput.style.color = textColor.value;
        footer.style.color = '#ffffff';
        footerLinks.forEach(link => link.style.color = '#ffffff');
    }
    
    setupPixelationEffect();
});

// Handle window resize
window.addEventListener('resize', setupPixelationEffect);


// For the color pickers
// Get span elements
const bgLeftSpan = document.querySelector('.bg-left');
const textRightSpan = document.querySelector('.text-right');

// Add hover events for bg-left span
bgLeftSpan.addEventListener('mouseover', () => {
    document.getElementById('bg-color').style.transform = 'translateY(-5px)';
});

bgLeftSpan.addEventListener('mouseout', () => {
    document.getElementById('bg-color').style.transform = 'translateY(0)';
});

// Add hover events for text-right span
textRightSpan.addEventListener('mouseover', () => {
    document.getElementById('text-color').style.transform = 'translateY(-5px)';
});

textRightSpan.addEventListener('mouseout', () => {
    document.getElementById('text-color').style.transform = 'translateY(0)';
});

// Add line break on Enter key press
document.getElementById('text-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        
        const cursorPos = this.selectionStart;
        const currentText = this.value;
        const lines = currentText.split('\n');
        
        // Check number of lines
        if (lines.length >= 6) {
            return;
        }
        
        // Check total length including new line character
        if (currentText.length >= 140) {
            return;
        }
        
        // Insert new line at cursor position
        const before = currentText.substring(0, cursorPos);
        const after = currentText.substring(cursorPos);
        
        this.value = before + '\n' + after;
        
        // Move cursor after the line break
        this.selectionStart = this.selectionEnd = cursorPos + 1;
        
        // Trigger input event for any listeners
        this.dispatchEvent(new Event('input'));
    }
});