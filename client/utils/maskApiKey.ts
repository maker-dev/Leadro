const maskApiKey = (apiKey: string, visibleLength: number) => {
  if (!apiKey) return "";
  return apiKey.length > visibleLength
    ? apiKey.slice(0, visibleLength) + "***"
    : apiKey;
};

export default maskApiKey;
