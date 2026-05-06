export type GlobalSettings = {
  language: string;
  timezone: string;
  currency: string;
  date_format: string;
};

export type BrandingSettings = {
  primary_color: string;
};

export type SecuritySettings = {
  two_factor_enabled: boolean;
  session_timeout: number;
  ip_whitelist: string;
};

export type Integration = {
  id: string;
  name: string;
  status: string;
};

export type AuditLog = {
  id: string;
  time: string;
  user: string;
  action: string;
  module: string;
  status: "success" | "alert" | "info";
};

const mockGlobalSettings: GlobalSettings = {
  language: "English (United States)",
  timezone: "(GMT+02:00) Cairo",
  currency: "EGP (ج.م) - 1,234.56",
  date_format: "DD/MM/YYYY",
};

const mockBrandingSettings: BrandingSettings = {
  primary_color: "#1B4332",
};

const mockSecuritySettings: SecuritySettings = {
  two_factor_enabled: true,
  session_timeout: 60,
  ip_whitelist: "",
};

const mockIntegrations: Integration[] = [
  { id: "1", name: "Logistics Hub API", status: "Connected • Last sync 2m ago" },
  { id: "2", name: "Payment Gateway", status: "Connected • Live" },
];

const mockAuditLogs: AuditLog[] = [
  { id: "1", time: "May 5, 2026 14:32", user: "omar.admin", action: "Updated Branding Settings", module: "Settings", status: "success" },
  { id: "2", time: "May 5, 2026 13:15", user: "system_auth", action: "Failed Login Attempt (IP: 192.168.1.1)", module: "Security", status: "alert" },
  { id: "3", time: "May 5, 2026 11:04", user: "ahmed.manager", action: "Changed User Role to Store Manager", module: "Users", status: "success" },
  { id: "4", time: "May 4, 2026 09:20", user: "sara.admin", action: "Added New Integration", module: "Integrations", status: "success" },
  { id: "5", time: "May 4, 2026 08:45", user: "system_auth", action: "Session Timeout — auto logout", module: "Security", status: "info" },
];

export const settingsService = {
  async getGlobalSettings(): Promise<GlobalSettings> {
    // TODO: replace with real API call
    // const res = await http.get('/settings/global');
    // return res.data;
    return mockGlobalSettings;
  },

  async updateGlobalSettings(data: GlobalSettings): Promise<GlobalSettings> {
    // TODO: replace with real API call
    // const res = await http.put('/settings/global', data);
    // return res.data;
    return data;
  },

  async getBrandingSettings(): Promise<BrandingSettings> {
    // TODO: replace with real API call
    // const res = await http.get('/settings/branding');
    // return res.data;
    return mockBrandingSettings;
  },

  async updateBrandingSettings(data: BrandingSettings): Promise<BrandingSettings> {
    // TODO: replace with real API call
    // const res = await http.put('/settings/branding', data);
    // return res.data;
    return data;
  },

  async getSecuritySettings(): Promise<SecuritySettings> {
    // TODO: replace with real API call
    // const res = await http.get('/settings/security');
    // return res.data;
    return mockSecuritySettings;
  },

  async updateSecuritySettings(data: SecuritySettings): Promise<SecuritySettings> {
    // TODO: replace with real API call
    // const res = await http.put('/settings/security', data);
    // return res.data;
    return data;
  },

  async getIntegrations(): Promise<Integration[]> {
    // TODO: replace with real API call
    // const res = await http.get('/settings/integrations');
    // return res.data;
    return mockIntegrations;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    // TODO: replace with real API call
    // const res = await http.get('/settings/audit-logs');
    // return res.data;
    return mockAuditLogs;
  },
};