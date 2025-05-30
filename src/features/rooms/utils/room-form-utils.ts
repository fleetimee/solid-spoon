/**
 * Parse facilities from string to array if present
 * Handles both JSON array and comma-separated values
 */
export const parseFacilities = (
  facilitiesStr: string | null | undefined
): string[] => {
  if (!facilitiesStr) return [];

  try {
    if (facilitiesStr.startsWith("[")) {
      return JSON.parse(facilitiesStr);
    }
    return facilitiesStr
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
  } catch {
    return facilitiesStr ? [facilitiesStr] : [];
  }
};

/**
 * Prepare form data for submission
 */
export const prepareFormDataForSubmission = (values: {
  name: string;
  location: string;
  capacity: number;
  description?: string;
  facilities?: string[];
}): FormData => {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("location", values.location);
  formData.append("capacity", String(values.capacity));

  if (values.description) {
    formData.append("description", values.description);
  }

  if (values.facilities && values.facilities.length > 0) {
    formData.append("facilities", JSON.stringify(values.facilities));
  } else {
    formData.append("facilities", "");
  }

  return formData;
};
