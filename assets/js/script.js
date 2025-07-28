const textInput = document.getElementById('text-input');
const preview = document.getElementById('preview');
const body = document.body;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const instructions = document.querySelector('.instructions');
const footer = document.querySelector('.footer');
const footerLinks = document.querySelectorAll('.footer a');

// Initialize Pickr color pickers
const bgColorPicker = Pickr.create({
    el: '#bg-color-picker',
    theme: 'classic',
    default: '#8ACE00',
    swatches: [
        '#8ACE00', '#029cd7', '#ffffff', '#918885', '#c89fda', '#d20000',
        '#f2abca', '#6f0353',
    ],
    components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
            hex: true,
            input: true,
            save: true
        }
    }
});

const textColorPicker = Pickr.create({
    el: '#text-color-picker',
    theme: 'classic',
    default: '#000000',
    swatches: [
        '#000000', '#f10404', '#bfbfbf', '#000100', '#020000', '#fb0303',
        '#ffffff', '#fefcfb',
    ],
    components: {
        preview: true,
        opacity: false,
        hue: true,
        interaction: {
            hex: true,
            input: true,
            save: true
        }
    }
});

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
    textInput.style.color = color;
    textInput.style.borderColor = color;
}

// Update alignment button styling for dark/light themes
function updateAlignmentButtonsTheme(isDark) {
    const alignButtons = document.querySelectorAll('.align-btn');
    alignButtons.forEach(btn => {
        if (!btn.classList.contains('active')) {
            if (isDark) {
                btn.style.borderColor = '#ffffff';
                btn.style.background = '#000000';
                btn.style.color = '#ffffff';
            } else {
                btn.style.borderColor = '#000000';
                btn.style.background = '#ffffff';
                btn.style.color = '#000000';
            }
        }
    });
}

// Handle background color changes
bgColorPicker.on('change', (color) => {
    const hexColor = color.toHEXA().toString();
    body.style.backgroundColor = hexColor;
    preview.style.backgroundColor = hexColor;
    
    if (isColorDark(hexColor)) {
        body.classList.add('dark-bg');
        instructions.style.color = '#ffffff';
        textInput.style.backgroundColor = '#000000';
        textInput.style.borderColor = '#ffffff';
        footer.style.color = '#ffffff';
        footerLinks.forEach(link => link.style.color = '#ffffff');
        updateAlignmentButtonsTheme(true);
    } else {
        body.classList.remove('dark-bg');
        textInput.style.backgroundColor = '#ffffff';
        textInput.style.borderColor = '#000000';
        instructions.style.color = '#000000';
        footer.style.color = '#000000';
        footerLinks.forEach(link => link.style.color = '#000000');
        updateAlignmentButtonsTheme(false);
        updateTextColors(textColorPicker.getColor().toHEXA().toString());
    }
});

// Handle text color changes
textColorPicker.on('change', (color) => {
    const hexColor = color.toHEXA().toString();
    updateTextColors(hexColor);
});

// Add alignment functionality
const alignButtons = document.querySelectorAll('.align-btn');
let currentAlignment = 'center';

// Handle alignment button clicks
alignButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        alignButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get alignment value
        currentAlignment = btn.dataset.align;
        
        // Apply alignment to preview
        preview.style.textAlign = currentAlignment;
    });
});

// Update text
textInput.addEventListener('input', (e) => {
    const text = e.target.value || '360 brat generator';
    preview.textContent = text;
    adjustTextSize();
    setupPixelationEffect();
});

// Add line break on Enter key press
textInput.addEventListener('keydown', function(e) {
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

// Adjust text size based on input length
function adjustTextSize() {
    const previewText = document.querySelector('.preview-text');
    const container = document.querySelector('.preview-container');
    const text = previewText.textContent;
    
    // Get number of lines
    const lines = text.split('\n');
    const maxLines = Math.max(lines.length, 1);
    
    // Get container dimensions
    const containerWidth = container.offsetWidth;
    
    // Base font size calculation based on container size
    let baseFontSize;
    if (containerWidth >= 600) { // Desktop
        baseFontSize = 100;
    } else if (containerWidth >= 500) { // Tablet
        baseFontSize = 80;
    } else if (containerWidth >= 350) { // Large Phone
        baseFontSize = 70;
    } else { // Small Phone
        baseFontSize = 65;
    }
    
    // Adjust for number of lines
    let fontSize = Math.min(baseFontSize, container.offsetHeight / (maxLines * 1.2));
    
    // Adjust based on text length per line
    const longestLine = Math.max(...lines.map(line => line.length));
    if (longestLine > 15) {
        fontSize = Math.min(fontSize, Math.max(30, baseFontSize - (longestLine * 1.2)));
    }
    
    // Apply font size
    previewText.style.fontSize = `${fontSize}px`;
    
    // Fine-tune if still overflowing
    while (
        (previewText.scrollHeight > container.offsetHeight ||
         previewText.scrollWidth > container.offsetWidth) &&
        fontSize > 20
    ) {
        fontSize -= 2;
        previewText.style.fontSize = `${fontSize}px`;
    }
}

// Initialize defaults
window.addEventListener('load', () => {
    preview.textContent = textInput.value || '360 brat generator';
    body.style.backgroundColor = '#8ACE00';
    preview.style.backgroundColor = '#8ACE00';
    updateTextColors('#000000');
    preview.style.textAlign = currentAlignment;
    adjustTextSize();
    
    if (isColorDark('#8ACE00')) {
        body.classList.add('dark-bg');
        instructions.style.color = '#ffffff';
        textInput.style.color = '#000000';
        footer.style.color = '#ffffff';
        footerLinks.forEach(link => link.style.color = '#ffffff');
        updateAlignmentButtonsTheme(true);
    } else {
        updateAlignmentButtonsTheme(false);
    }
    
    setupPixelationEffect();
});

// Handle window resize
window.addEventListener('resize', () => {
    adjustTextSize();
    setupPixelationEffect();
});

// Add event listener to adjust text size on input
textInput.addEventListener('input', adjustTextSize);