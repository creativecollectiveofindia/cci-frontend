export class Submission {
  id: number;
  title: string;
  challenge: number;
  challenge_category: number;
  status: string;
  sort: string;
  owner: string;
  created_on: string;
  modified_on: string;
  modified_by: string;
  description: string;
  introduction: string;
  file: number;
  language: Array<string>;
  target_audience: Array<string>;
  geography: Array<string>;
  region: Array<string>;
  income_bracket: string;
  gender: string;
  age_group: string;
  educational_background: string;
  sector: string;
  special_condition: string;
  category: number;
  media_type: Array<string>;
  gender_other: string;
  sector_other: string;
  target_audience_other: string;
  special_condition_other: string;
  language_other: string;
  withdraw_reasons: string;
  creative_testing: string;
}
