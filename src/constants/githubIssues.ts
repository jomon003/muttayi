// Plan issues are reported as pre-filled GitHub issues on the public repo.
// Field ids and dropdown labels must match .github/ISSUE_TEMPLATE/plan-error.yml in that repo.

export const GITHUB_REPO_URL = 'https://github.com/jomon003/muttayi';

// Issue types for the dropdown — labels are sent as-is to the issue form dropdown
export const ISSUE_TYPES = [
  { value: 'plan_not_exist', label: "Plan doesn't exist" },
  { value: 'incorrect_price', label: 'Incorrect price' },
  { value: 'incorrect_validity', label: 'Incorrect validity' },
  { value: 'incorrect_data', label: 'Incorrect data' },
  { value: 'incorrect_voice', label: 'Incorrect voice' },
  { value: 'incorrect_sms', label: 'Incorrect SMS' },
  { value: 'incorrect_ott', label: 'Incorrect OTT benefits' },
  { value: 'other', label: 'Other issue' },
] as const;

export type IssueType = typeof ISSUE_TYPES[number]['value'];

interface PlanIssueParams {
  title: string;
  operator: string;     // dropdown label: Airtel | Jio | BSNL | Vi
  circle: string;
  issueType: string;    // dropdown label from ISSUE_TYPES
  planDetails: string;
  description: string;
}

export const buildPlanIssueUrl = (params: PlanIssueParams): string => {
  const query = new URLSearchParams({
    template: 'plan-error.yml',
    title: params.title,
    operator: params.operator,
    circle: params.circle,
    issue_type: params.issueType,
    plan_details: params.planDetails,
    description: params.description,
  });
  return `${GITHUB_REPO_URL}/issues/new?${query.toString()}`;
};
