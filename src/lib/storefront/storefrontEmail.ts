type StorefrontEmailUpdateInput = {
  currentEmail: string;
  newEmail: string;
  currentPassword: string;
};

type StorefrontEmailUpdate = {
  newEmail: string;
  currentPassword: string;
};

export function prepareStorefrontEmailUpdate(
  input: StorefrontEmailUpdateInput,
): StorefrontEmailUpdate {
  const currentEmail = input.currentEmail.trim().toLowerCase();
  const newEmail = input.newEmail.trim().toLowerCase();

  if (!newEmail) {
    throw new Error("Enter your new email address.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
    throw new Error("Enter a valid email address.");
  }

  if (newEmail === currentEmail) {
    throw new Error("Enter a different email address.");
  }

  if (!input.currentPassword.trim()) {
    throw new Error("Enter your current password.");
  }

  return {
    newEmail,
    currentPassword: input.currentPassword,
  };
}