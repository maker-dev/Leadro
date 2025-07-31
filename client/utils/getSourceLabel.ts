import LeadSourceOptions from "@/data/leadSourceOptions";

const getSourceLabel = (sourceValue?: string) => {
  if (!sourceValue) return undefined;
  const sourceOption = LeadSourceOptions.find(
    (option) => option.value === sourceValue
  );
  return sourceOption?.label || sourceValue;
};

export default getSourceLabel;
