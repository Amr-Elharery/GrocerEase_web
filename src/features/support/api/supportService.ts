export type Category = {
  id: string;
  title: string;
  description: string;
  articles: number;
  type: "getting_started" | "inventory" | "users" | "billing";
};

export type SystemStatus = {
  name: string;
  uptime: string;
  status: "operational" | "degraded" | "down";
};

export type DocLink = {
  id: string;
  title: string;
  subtitle: string;
  type: "api" | "sdk" | "manual";
};

export type ContactInfo = {
  name: string;
  email: string;
  phone: string;
  support_email: string;
};

const mockCategories: Category[] = [
  { id: "1", title: "Getting Started", description: "Master the basics of setting up your storefront and connecting your first vendor network.", articles: 12, type: "getting_started" },
  { id: "2", title: "Inventory Management", description: "Learn how to manage stock levels, automated reordering, and multi-warehouse sync.", articles: 24, type: "inventory" },
  { id: "3", title: "User Roles", description: "Guidelines on permissions, administrative levels, and staff account security.", articles: 8, type: "users" },
  { id: "4", title: "Billing & Plans", description: "Managing your subscription, understanding invoices, and tier upgrades.", articles: 15, type: "billing" },
];

const mockSystemStatus: SystemStatus[] = [
  { name: "Catalog Engine", uptime: "99.9%", status: "operational" },
  { name: "Core API Gateway", uptime: "99.8%", status: "operational" },
  { name: "Order Processing", uptime: "100%", status: "operational" },
];

const mockDocLinks: DocLink[] = [
  { id: "1", title: "API Reference", subtitle: "v2.4 Latest", type: "api" },
  { id: "2", title: "SDK Guides", subtitle: "Node.js, Python", type: "sdk" },
  { id: "3", title: "User Manual", subtitle: "PDF Download", type: "manual" },
];

const mockContactInfo: ContactInfo = {
  name: "ZAD Support Team",
  email: "support@zad.com",
  phone: "+20 (100) 555-0123",
  support_email: "support@zad.io",
};

export const supportService = {
  async getCategories(): Promise<Category[]> {
    // TODO: replace with real API call
    // const res = await http.get('/support/categories');
    // return res.data;
    return mockCategories;
  },

  async getSystemStatus(): Promise<SystemStatus[]> {
    // TODO: replace with real API call
    // const res = await http.get('/support/system-status');
    // return res.data;
    return mockSystemStatus;
  },

  async getDocLinks(): Promise<DocLink[]> {
    // TODO: replace with real API call
    // const res = await http.get('/support/docs');
    // return res.data;
    return mockDocLinks;
  },

  async getContactInfo(): Promise<ContactInfo> {
    // TODO: replace with real API call
    // const res = await http.get('/support/contact');
    // return res.data;
    return mockContactInfo;
  },

  async submitTicket(data: { subject: string; message: string; email: string }): Promise<void> {
    // TODO: replace with real API call
    // await http.post('/support/tickets', data);
    console.log("submit ticket", data);
  },
};