export interface Contact {
  id: string;
  name: string;
  icon: string;
  url: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactSectionData {
  contact: Contact[];
}
