import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, TextField, Typography, Box } from "@mui/material";
import FieldEditor from "../components/FieldEditor";
import { FieldConfig, FormSchema } from "../types/formTypes";

const CreateForm: React.FC = () => {
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState<FieldConfig[]>([]);

  // Load saved forms from localStorage (optional)
  useEffect(() => {
    const savedForms = localStorage.getItem("forms");
    if (savedForms) {
      const forms: FormSchema[] = JSON.parse(savedForms);
      if (forms.length) {
        setFormName(forms[0].name);
        setFields(forms[0].fields);
      }
    }
  }, []);

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: uuidv4(),
        label: "New Field",
        type: "text",
        required: false,
        options: [],
      },
    ]);
  };

  const updateField = (updatedField: FieldConfig, index: number) => {
    setFields((prev) => {
      const copy = [...prev];
      copy[index] = updatedField;
      return copy;
    });
  };

  const removeField = (index: number) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const saveForm = () => {
    if (!formName.trim()) {
      alert("Please enter form name");
      return;
    }
    const newForm: FormSchema = {
      id: uuidv4(),
      name: formName,
      fields,
      createdAt: new Date().toISOString(),
    };

    const savedForms = localStorage.getItem("forms");
    let forms: FormSchema[] = savedForms ? JSON.parse(savedForms) : [];

    // Update or add form
    const idx = forms.findIndex((f) => f.id === newForm.id);
    if (idx >= 0) {
      forms[idx] = newForm;
    } else {
      forms.push(newForm);
    }

    localStorage.setItem("forms", JSON.stringify(forms));
    alert("Form saved!");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Create Form
      </Typography>

      <TextField
        label="Form Name"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
        fullWidth
        margin="normal"
      />

      {fields.map((field, idx) => (
        <FieldEditor
          key={field.id}
          field={field}
          onChange={(f) => updateField(f, idx)}
          onRemove={() => removeField(idx)}
        />
      ))}

      <Button variant="contained" onClick={addField} sx={{ mt: 2 }}>
        Add Field
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={saveForm}
        sx={{ mt: 2, ml: 2 }}
        disabled={!formName.trim() || fields.length === 0}
      >
        Save Form
      </Button>
    </Box>
  );
};

export default CreateForm;
