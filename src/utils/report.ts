import type { ProblemReport } from '../models/index.ts';

/** A garage quote can be authorized only after the customer records a usable concern. */
export function hasCompleteProblemReport(report: ProblemReport): boolean {
  return Boolean(report.description.trim() && report.occurs.trim() && report.followUp.trim());
}
