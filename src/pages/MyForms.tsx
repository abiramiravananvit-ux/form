import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setCurrentForm } from "../store/formSlice";
import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
} from "@mui/material";

const MyForms: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forms = useSelector((state: RootState) => state.form.forms);

  if (!forms.length) {
    return <Typography>No saved forms found.</Typography>;
  }

  const handleClick = (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (form) {
      dispatch(setCurrentForm(form));
      navigate("/preview");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        My Saved Forms
      </Typography>
      <List>
        {forms.map(({ id, name, createdAt }) => (
          <ListItem key={id} disablePadding>
            <ListItemButton onClick={() => handleClick(id)}>
              <ListItemText
                primary={name}
                secondary={new Date(createdAt).toLocaleString()}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default MyForms;
