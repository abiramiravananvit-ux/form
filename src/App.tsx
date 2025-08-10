import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import CreateForm from "./pages/CreateForm";
import PreviewForm from "./pages/PreviewForm";
import MyForms from "./pages/MyForms";
import { loadSavedForms } from "./store/formSlice";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadSavedForms());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/create" replace />} />
      <Route path="/create" element={<CreateForm />} />
      <Route path="/preview" element={<PreviewForm />} />
      <Route path="/myforms" element={<MyForms />} />
    </Routes>
  );
};

export default App;
