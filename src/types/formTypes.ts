export interface FieldConfig {
  id: string;
  type: "text" | "number" | "textarea" | "select" | "radio" | "checkbox" | "date";
  label: string;
  required: boolean;
  defaultValue?: string | boolean;
  validations?: {
    minLength?: number;
    maxLength?: number;
    email?: boolean;
    passwordRule?: boolean;
  };
  derived?: {
    parents: string[];
    formula: string;
  };
  options?: string[];  // Add this to support select/radio options
}

export interface FormSchema {
  id: string;
  name: string;
  createdAt: string;
  fields: FieldConfig[];
}
