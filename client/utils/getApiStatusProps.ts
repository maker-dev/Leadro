const getApiKeyStatusProps = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return {
        dot: "bg-green-500",
        pill: "bg-green-500 text-white",
        label: "Active",
      };
    case "revoked":
      return {
        dot: "bg-red-500",
        pill: "bg-red-500 text-white",
        label: "Revoked",
      };
    case "expired":
    default:
      return {
        dot: "bg-gray-400",
        pill: "bg-gray-400 text-white",
        label: "Expired",
      };
  }
};

export default getApiKeyStatusProps;
