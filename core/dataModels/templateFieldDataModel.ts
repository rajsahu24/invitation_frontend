// Template Section from API
export interface TemplateSection {
  invitation_id: string;
  section_id: string;
  section_type: string;
  schema: {
    label: string;
    fields: TemplateField[];
  };
  display_order: number;
  is_active: boolean;
  is_repeated: boolean;
}

// Root Invitation Interface
export interface Invitation {
  id: string;
  user_id: string;
  invitation_type: "wedding" | string;
  invitation_title: string;
  invitation_message: string | null;
  invitation_tag_line: string | null;
  metadata: WeddingMetadata;
  quick_action: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  invitation_template_id: string;
  public_id: string;
  template: InvitationTemplate;
}

// Metadata
export interface WeddingMetadata {
  bride_name: string;
  groom_name: string;
  wedding_date: string; // YYYY-MM-DD
  wedding_location: string;
}

// Template
export interface InvitationTemplate {
  template_type: "Wedding" | string;
  template_name: string;
  template_key: string | null;
  template_sections: TemplateSections;
}

// Template Sections - now supports dynamic keys
export interface TemplateSections {
  [key: string]: TemplateField[];
}

// Generic Field Definition (reused everywhere)
export interface TemplateField {
  key: string;
  type:
  | "text"
  | "date"
  | "datetime-local"
  | string;
  label?: string;        // optional because one item has `lebel`
  lebel?: string;        // typo-safe support
  order: number;
  value?: string;
  required: boolean;
  placeholder?: string;
}


export interface Template {
  id: string;
  template_type: string;
  template_name: string;
  template_image: string;
  is_active?: boolean;
}