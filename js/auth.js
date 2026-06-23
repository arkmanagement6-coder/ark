document.addEventListener('DOMContentLoaded', function() {
    
    // --- Multi-step Form Logic (Registration) ---
    const steps = document.querySelectorAll('.form-step');
    const stepDots = document.querySelectorAll('.step-dot');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    let currentStep = 0;

    if (steps.length > 0) {
        function updateSteps() {
            steps.forEach((step, index) => {
                step.classList.toggle('active', index === currentStep);
            });
            
            stepDots.forEach((dot, index) => {
                if (index < currentStep) {
                    dot.classList.add('completed');
                    dot.classList.remove('active');
                } else if (index === currentStep) {
                    dot.classList.add('active');
                    dot.classList.remove('completed');
                } else {
                    dot.classList.remove('active', 'completed');
                }
            });
        }

        function validateStep(stepIndex) {
            const currentStepEl = steps[stepIndex];
            const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity();
                    isValid = false;
                }
            });

            return isValid;
        }

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (validateStep(currentStep)) {
                    if (currentStep < steps.length - 1) {
                        currentStep++;
                        updateSteps();
                        window.scrollTo(0, 0);
                    }
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateSteps();
                }
            });
        });
    }

    // --- Show "Other" Category Input ---
    const categorySelect = document.getElementById('business-category');
    const otherCategoryGroup = document.getElementById('other-category-group');
    const influencerServices = document.getElementById('influencer-services');
    const standardServices = document.getElementById('standard-services');

    function toggleCategoryServices() {
        if (!categorySelect) return;
        
        const selectedValue = categorySelect.value;
        const selectedOption = categorySelect.options[categorySelect.selectedIndex];
        const optGroup = selectedOption ? selectedOption.parentNode : null;
        const isInfluencer = optGroup && optGroup.tagName === 'OPTGROUP' && optGroup.label === 'Influencer & Creator';

        // Show/Hide "Other" input
        if (otherCategoryGroup) {
            if (selectedValue === 'Other') {
                otherCategoryGroup.style.display = 'block';
                document.getElementById('other-category').setAttribute('required', 'required');
            } else {
                otherCategoryGroup.style.display = 'none';
                document.getElementById('other-category').removeAttribute('required');
            }
        }

        // Switch between Standard and Influencer Services
        if (influencerServices && standardServices) {
            if (isInfluencer) {
                influencerServices.style.display = 'block';
                standardServices.style.display = 'none';
            } else {
                influencerServices.style.display = 'none';
                standardServices.style.display = 'block';
            }
        }
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', toggleCategoryServices);
        // Initial check in case of browser back/refresh
        toggleCategoryServices();
    }

    // --- Password Visibility Toggle ---
    const togglePasswords = document.querySelectorAll('.password-toggle');
    togglePasswords.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    });

    // --- Registration Form Submit Mock ---
    const registerForm = document.getElementById('registration-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Show success message
            alert("Registration Successful!\n\nThank you for registering with ARK Management. Your account has been created. You can now login to your dashboard.");
            window.location.href = "login.html";
        });
    }

    // --- Login Form Submit Mock ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Successful login simulation
            window.location.href = "dashboard.html";
        });
    // --- Mobile Sidebar Toggle ---
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.toggle('menu-open');
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && sidebar.classList.contains('menu-open')) {
                sidebar.classList.remove('menu-open');
            }
        });
    }

});
