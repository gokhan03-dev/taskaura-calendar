
export const getAriaLabel = (priority: "high" | "medium" | "low") => {
  const labels = {
    high: "High priority task",
    medium: "Medium priority task",
    low: "Low priority task"
  };
  return labels[priority];
};
