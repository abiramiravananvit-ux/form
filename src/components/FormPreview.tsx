import React, { useState, useEffect } from "react";
import { FormSchema, FieldConfig } from "../types/formTypes";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Typography,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/material";

interface Props {
  form: FormSchema;
}

const evaluateFormula = (formula: string, values: Record<string, any>): any => {
  let expr = formula;
  Object.entries(values).forEach(([key, val]) => {
    const safeVal = typeof val === "string" ? `"${val}"` : val;
    expr = expr.replaceAll(key, safeVal);
  });

  try {
    // eslint-disable-next-line no-eval
    return eval(expr);
  } catch {
    return "";
  }
};

const FormPreview: React.FC<Props> = ({ form }) => {
  const [values, setValues] = useState<{ [key: string]: any }>(
    () =>
      form.fields.reduce((acc, field) => {
        acc[field.id] = field.defaultValue ?? "";
        return acc;
      }, {} as Record<string, any>)
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (field: FieldConfig, value: any) => {
    if (field.derived) return; // prevent manual change to derived

    setValues((prev) => ({ ...prev, [field.id]: value }));

    // Simple validation:
    let error = "";
    if (field.required && !value) error = "This field is required";
    else if (
      field.validations?.minLength &&
      typeof value === "string" &&
      value.length < field.validations.minLength
    )
      error = `Minimum length is ${field.validations.minLength}`;

    setErrors((prev) => ({ ...prev, [field.id]: error }));
  };

  useEffect(() => {
    // Recalculate derived fields
    form.fields.forEach((field) => {
      if (field.derived) {
        const newVal = evaluateFormula(field.derived.formula, values);
        if (values[field.id] !== newVal) {
          setValues((prev) => ({ ...prev, [field.id]: newVal }));
        }
      }
    });
  }, [values, form.fields]);

  if (!form || !form.fields.length) {
    return <Typography>No fields to display.</Typography>;
  }

  return (
    <form style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {form.fields.map((field: FieldConfig) => {
        const value = values[field.id] ?? "";
        const error = errors[field.id] || "";
        const required = field.required;
        const isDerived = !!field.derived;

        switch (field.type) {
          case "text":
          case "number":
          case "date":
            return (
              <TextField
                key={field.id}
                type={field.type}
                label={field.label}
                value={value}
                required={required}
                error={!!error}
                helperText={error}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isDerived}
                fullWidth
              />
            );

          case "textarea":
            return (
              <TextField
                key={field.id}
                label={field.label}
                multiline
                rows={4}
                value={value}
                required={required}
                error={!!error}
                helperText={error}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isDerived}
                fullWidth
              />
            );

          case "select":
            return (
              <TextField
                key={field.id}
                select
                label={field.label}
                value={value}
                required={required}
                error={!!error}
                helperText={error}
                onChange={(e) => handleChange(field, e.target.value)}
                disabled={isDerived}
                fullWidth
              >
                {(field.options || []).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            );

          case "checkbox":
            return (
              <FormControlLabel
                key={field.id}
                control={
                  <Checkbox
                    checked={!!value}
                    onChange={(e) => handleChange(field, e.target.checked)}
                    required={required}
                    disabled={isDerived}
                  />
                }
                label={field.label}
              />
            );

          case "radio":
            return (
              <FormControl
                key={field.id}
                component="fieldset"
                required={required}
                error={!!error}
                disabled={isDerived}
              >
                <FormLabel component="legend">{field.label}</FormLabel>
                <RadioGroup
                  value={value}
                  onChange={(e) => handleChange(field, e.target.value)}
                >
                  {(field.options || []).map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={option}
                      disabled={isDerived}
                    />
                  ))}
                </RadioGroup>
                {error && <FormHelperText>{error}</FormHelperText>}
              </FormControl>
            );

          default:
            return (
              <Typography key={field.id}>
                Unknown field type: {field.type}
              </Typography>
            );
        }
      })}
    </form>
  );
};

export default FormPreview;
