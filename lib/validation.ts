// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
    return password.length >= 8;
};

// Name validation
export const isValidName = (name: string): boolean => {
    return name.trim().length >= 2;
};

// Form validation errors
export interface ValidationErrors {
    [key: string]: string | undefined;
    password?: string;
    confirmPassword?: string;
    firstName?: string;
    lastName?: string;
}

export const validateSignIn = (email: string, password: string): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!email.trim()) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
        errors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
        errors.password = 'Password must be at least 8 characters';
    }

    return errors;
};

export const validateSignUp = (
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string
): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!email.trim()) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
        errors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
        errors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }

    if (!firstName.trim()) {
        errors.firstName = 'First name is required';
    } else if (!isValidName(firstName)) {
        errors.firstName = 'First name must be at least 2 characters';
    }

    if (!lastName.trim()) {
        errors.lastName = 'Last name is required';
    } else if (!isValidName(lastName)) {
        errors.lastName = 'Last name must be at least 2 characters';
    }

    return errors;
};
