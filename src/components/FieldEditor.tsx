import React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Box,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { FieldConfig } from "../types/formTypes";

interface Props {
  field: FieldConfig;
  onChange: (field: FieldConfig) => void;
  onRemove: () => void;
}

const FIELD_TYPES = [
  "text",
  "number",
  "textarea",
  "select",
  "radio",
  "checkbox",
  "date",
] as const;

const FieldEditor: React.FC<Props> = ({ field, onChange, onRemove }) => {
  const handleChange = (key: keyof FieldConfig, value: any) => {
    onChange({ ...field, [key]: value });
  };

  // For select/radio, manage options as comma-separated string
  const handleOptionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const options = e.target.value.split(",").map((opt) => opt.trim());
    onChange({ ...field, options });
  };

  return (
    <Box mb={2} p={2} border="1px solid #ccc" borderRadius={2}>
      <TextField
        label="Label"
        value={field.label}
        onChange={(e) => handleChange("label", e.target.value)}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id={`type-select-label-${field.id}`}>Type</InputLabel>
        <Select
          labelId={`type-select-label-${field.id}`}
          value={field.type}
          label="Type"
          onChange={(e) => handleChange("type", e.target.value)}
        >
          {FIELD_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={field.required}
            onChange={(e) => handleChange("required", e.target.checked)}
          />
        }
        label="Required"
      />

      {(field.type === "select" || field.type === "radio") && (
        <TextField
          label="Options (comma separated)"
          value={field.options ? field.options.join(", ") : ""}
          onChange={handleOptionsChange}
          fullWidth
          margin="normal"
          helperText="Enter options separated by commas"
        />
      )}

      <Button
        variant="outlined"
        color="error"
        onClick={onRemove}
        sx={{ mt: 2 }}
      >
        Remove Field
      </Button>
    </Box>
  );
};

export default FieldEditor;
