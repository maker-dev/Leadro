export const LeadSourceValues = [
  "website",
  "google_ads",
  "facebook_ads",
  "instagram",
  "linkedin",
  "twitter",
  "youtube",
  "referral",
  "cold_call",
  "email_campaign",
  "landing_page",
  "affiliate",
  "chatbot",
  "organic_search",
  "event",
  "other",
] as const;

const LeadSourceOptions = [
  { value: "website", label: "Website" },
  { value: "google_ads", label: "Google Ads" },
  { value: "facebook_ads", label: "Facebook Ads" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter" },
  { value: "youtube", label: "YouTube" },
  { value: "referral", label: "Referral" },
  { value: "cold_call", label: "Cold Call" },
  { value: "email_campaign", label: "Email Campaign" },
  { value: "landing_page", label: "Landing Page" },
  { value: "affiliate", label: "Affiliate" },
  { value: "chatbot", label: "Chatbot" },
  { value: "organic_search", label: "Organic Search" },
  { value: "event", label: "Event" },
  { value: "other", label: "Other" },
];

export default LeadSourceOptions;
