// Quick-login picker accounts for the POC (design brief §2 Tier 1 roles: VPC, VPF, President/CEO).
// The real ATOM dev server has no accounts labeled by role in the Postman collection, so these
// must be supplied via EXPO_PUBLIC_DEMO_ACCOUNTS_JSON, e.g.:
//   EXPO_PUBLIC_DEMO_ACCOUNTS_JSON=[{"role":"VPC","label":"VP Business Development","username":"...","password":"..."}]
// Until that's set, the picker renders empty and only the manual sign-in form is usable.

export interface DemoAccount {
  role: 'VPC' | 'VPF' | 'PRESIDENT';
  label: string;
  username: string;
  password: string;
}

function parseDemoAccounts(): DemoAccount[] {
  const raw = process.env.EXPO_PUBLIC_DEMO_ACCOUNTS_JSON;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const DEMO_ACCOUNTS: DemoAccount[] = parseDemoAccounts();
