/* ============================================
   MarchOn — Form Validation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleSubmit);

    // Real-time validation on blur
    form.querySelectorAll('.form__input, .form__select, .form__textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            const group = input.closest('.form__group');
            if (group && group.classList.contains('form__group--error')) {
                validateField(input);
            }
        });
    });
});

function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;

    // Validate all required fields
    form.querySelectorAll('[required]').forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    // Validate privacy policy checkbox
    const privacyCheck = form.querySelector('#privacy-policy');
    if (privacyCheck && !privacyCheck.checked) {
        const group = privacyCheck.closest('.form__group');
        if (group) {
            group.classList.add('form__group--error');
            const error = group.querySelector('.form__error');
            if (error) error.textContent = 'プライバシーポリシーに同意してください';
        }
        isValid = false;
    }

    if (isValid) {
        // In production, this would submit to a server
        // For now, redirect to thanks page
        window.location.href = 'thanks.html';
    } else {
        // Scroll to first error
        const firstError = form.querySelector('.form__group--error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function validateField(input) {
    const group = input.closest('.form__group');
    if (!group) return true;

    const error = group.querySelector('.form__error');
    let isValid = true;
    let message = '';

    // Required check
    if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        message = 'この項目は必須です';
    }

    // Email validation
    if (isValid && input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            isValid = false;
            message = '正しいメールアドレスを入力してください';
        }
    }

    // Phone validation
    if (isValid && input.type === 'tel' && input.value) {
        const phoneRegex = /^[\d\-\+\(\)\s]+$/;
        if (!phoneRegex.test(input.value)) {
            isValid = false;
            message = '正しい電話番号を入力してください';
        }
    }

    // Select validation
    if (isValid && input.tagName === 'SELECT' && input.hasAttribute('required') && !input.value) {
        isValid = false;
        message = '選択してください';
    }

    // Update UI
    if (isValid) {
        group.classList.remove('form__group--error');
        if (error) error.textContent = '';
    } else {
        group.classList.add('form__group--error');
        if (error) error.textContent = message;
    }

    return isValid;
}
