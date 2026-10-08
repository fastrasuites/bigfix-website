/**
 * API utility for form submissions.
 * Sends form data to the PHP backend endpoint (public/submit.php).
 */

export type FormSource = "book_demo" | "contact" | "home_review";

export interface SubmitResult {
  success: boolean;
  message: string;
  /** Field-level validation messages returned by the server (HTTP 400). */
  errors?: string[];
  id?: number;
}

interface ServerResponse {
  success?: boolean;
  message?: string;
  errors?: string[];
  id?: number;
}

/** Empty in production (same origin). In dev: VITE_API_URL=http://bigfix.test */
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || "";

export const submitForm = async (
  source: FormSource,
  data: Record<string, string>,
  timeout: number = 15000,
): Promise<SubmitResult> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE}/submit.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, ...data }),
      signal: controller.signal,
    });

    const result: ServerResponse = await response.json().catch(() => ({
      success: false,
      message: "Invalid server response",
    }));

    if (!response.ok || !result.success) {
      const errors = Array.isArray(result.errors) ? result.errors : undefined;
      return {
        success: false,
        message:
          errors && errors.length > 0
            ? errors.join(". ")
            : result.message || "Submission failed. Please try again.",
        errors,
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
  } finally {
    clearTimeout(timeoutId);
  }
};
