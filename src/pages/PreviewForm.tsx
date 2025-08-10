import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import FormPreview from "../components/FormPreview";
import { Typography } from "@mui/material";

const PreviewForm: React.FC = () => {
  const currentForm = useSelector((state: RootState) => state.form.currentForm);

  if (!currentForm || !currentForm.fields.length) {
    return <Typography>No form selected.</Typography>;
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        {currentForm.name || "Untitled Form"}
      </Typography>
      <FormPreview form={currentForm} />
    </div>
  );
};

export default PreviewForm;
