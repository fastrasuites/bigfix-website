/**
 * API utility for form submissions.
 * Sends form data to the PHP backend endpoint.
 */

export interface SubmitResult {
  success: boolean;
  message: string;
  id?: string;
}

export const submitForm = async (
  source: "book_demo" | "contact" | "home_review",
  data: Record<string, string>
): Promise<SubmitResult> => {
  const response = await fetch("/submit.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ source, ...data }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    return {
      success: false,
      message: result.message || "Submission failed. Please try again.",
    };
  }

  return {
    success: true,
    message: result.message || "Submitted successfully!",
    id: result.id,
  };
};
