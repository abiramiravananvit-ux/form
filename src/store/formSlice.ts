import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { FormSchema, FieldConfig } from "../types/formTypes";

type FieldType = "text" | "number" | "textarea" | "select" | "radio" | "checkbox" | "date";

interface FormState {
  forms: FormSchema[];
  currentForm: FormSchema | null;
}

const initialState: FormState = {
  forms: [],
  currentForm: {
    id: uuidv4(),
    name: "",
    fields: [],
    createdAt: new Date().toISOString(),
  },
};

const createNewField = (type: FieldType): FieldConfig => {
  const baseField: FieldConfig = {
    id: uuidv4(),
    label: "New Field",
    type,
    required: false,
    defaultValue: type === "checkbox" ? false : "",
    validations: {},
  };

  switch (type) {
    case "select":
    case "radio":
      return { ...baseField, options: ["Option 1", "Option 2"] };
    case "number":
      return { ...baseField, defaultValue: "" }; // Use string for input compatibility
    case "textarea":
      return { ...baseField };
    case "date":
      return { ...baseField, defaultValue: new Date().toISOString().slice(0, 10) };
    default:
      return baseField;
  }
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<{ type: FieldType }>) => {
      if (state.currentForm) {
        const newField = createNewField(action.payload.type);
        state.currentForm.fields.push(newField);
      }
    },
    updateField: (state, action: PayloadAction<{ index: number; field: FieldConfig }>) => {
      if (state.currentForm) {
        const { index, field } = action.payload;
        state.currentForm.fields[index] = field;
      }
    },
    saveForm: (state, action: PayloadAction<string>) => {
      if (state.currentForm) {
        state.currentForm.name = action.payload;
        state.currentForm.createdAt = new Date().toISOString();

        const idx = state.forms.findIndex(f => f.id === state.currentForm?.id);
        if (idx >= 0) {
          state.forms[idx] = { ...state.currentForm };
        } else {
          state.forms.push({ ...state.currentForm });
        }

        localStorage.setItem("forms", JSON.stringify(state.forms));

        state.currentForm = {
          id: uuidv4(),
          name: "",
          fields: [],
          createdAt: new Date().toISOString(),
        };
      }
    },
    loadSavedForms: (state) => {
      const saved = localStorage.getItem("forms");
      if (saved) {
        state.forms = JSON.parse(saved);
      }
    },
    setCurrentForm: (state, action: PayloadAction<FormSchema>) => {
      state.currentForm = action.payload;
    },
  },
});

export const { addField, updateField, saveForm, loadSavedForms, setCurrentForm } = formSlice.actions;
export default formSlice.reducer;
