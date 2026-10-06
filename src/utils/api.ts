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
  data: Record<string, string>,
  timeout: number = 10000
): Promise<SubmitResult> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch("/submit.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source, ...data }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = await response.json().catch(() => ({
      success: false,
      message: "Invalid server response",
    }));

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
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        message: "Request timed out. Please try again.",
      };
    }
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};
