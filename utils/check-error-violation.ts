export function isUsernameConflict(error: any) {
  return (
    error?.code === "23505" &&
    error?.message?.includes("username")
  );
}
