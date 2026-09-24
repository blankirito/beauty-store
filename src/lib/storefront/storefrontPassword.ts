type StorefrontPasswordUpdateInput = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type StorefrontPasswordUpdate = {
    currentPassword: string;
    newPassword: string;
};

export function prepareStorefrontPasswordUpdate(
    input: StorefrontPasswordUpdateInput,
): StorefrontPasswordUpdate {
    if (!input.currentPassword.trim()) {
        throw new Error("Enter your current password.");
    }
    const hasMinimumLength = input.newPassword.length >= 8;
    const hasNumber = /\d/.test(input.newPassword);
    const hasSymbol = /[!@#$%^&*]/.test(input.newPassword);

    if (!hasMinimumLength || !hasNumber || !hasSymbol) {
        throw new Error("Your new password does not meet all requirements.");
    }

    if (input.newPassword !== input.confirmPassword) {
        throw new Error("Your new passwords do not match.");
    }

    return {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
    };
}