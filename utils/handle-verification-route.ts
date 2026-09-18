import { router } from "expo-router";

export const handleGetVerified = (status : string, from: string) => {
  if (status === "unsubmitted") {
    router.push("/settings/verification/verification");
  } else {
    router.push({
      pathname: "/settings/verification/[status]",
      params: { status: status, from: from},
    });
  }
};
