export type RelatedPersonRelationship = "spouse" | "parent";
export type RelatedPersonReviewStatus = "passed" | "pending";

export interface RelatedPerson {
  id: string;
  name: string;
  relationship: RelatedPersonRelationship;
  applicantId: string;
  reviewStatus: RelatedPersonReviewStatus;
  submittedAt: string;
}

export const relatedPersons: RelatedPerson[] = [
  {
    id: "related-001",
    name: "李明",
    relationship: "spouse",
    applicantId: "APP-20261110-001",
    reviewStatus: "passed",
    submittedAt: "2026-11-10 14:49:35"
  },
  {
    id: "related-002",
    name: "王芳",
    relationship: "parent",
    applicantId: "APP-20261110-002",
    reviewStatus: "pending",
    submittedAt: "2026-11-10 15:02:18"
  }
];
