
export const getFriendlyError = (message: string) => {
  if (message.includes("generic")) return "Something went wrong.";
  if (message.includes("already registered")) return "An account with this email already exists";
  if (message.includes("Password should be")) return "Password is too weak — use at least 6 characters";
  if (message.includes("Unable to validate email")) return "Please enter a valid email address";
  if (message.includes("Network")) return "Network error. check your connection and try again";
  if (message.includes("fetch failed")) return "Network error. check your connection and try again";
  if (message.includes("For security purposes")) return "Too many attempts — please wait a moment and try again";
  return message;
};

