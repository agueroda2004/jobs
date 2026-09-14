export type ReviewRecommendation = "apply" | "improve_cv" | "skip";

export interface StoredCv {
  name: string;
  type: string;
  dataUrl: string;
  updatedAt: string;
}

export interface CvReviewResult {
  matchPercentage: number;
  recommendation: ReviewRecommendation;
  summary: string;
  gaps: string[];
  improvements: {
    section: string;
    currentText: string;
    suggestedText: string;
    reason: string;
  }[];
}
