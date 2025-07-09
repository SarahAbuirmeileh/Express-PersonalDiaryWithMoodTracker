const isValidPassword = (password: string) => {
    const validation = [];
    if (password?.length < 10) {
        validation.push("The password should be at least 10 characters");
    }

    if (!/[A-Z]/.test(password)) {
        validation.push("The password should contains at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
        validation.push("The password should contains at least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
        validation.push("The password should contains at least one digit (number)");
    }

    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
        validation.push("The password should contains at least one special character");
    }
    return validation;
};

export { isValidPassword };