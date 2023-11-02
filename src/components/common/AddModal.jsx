import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import usePost from "../../services/usePost";

import { InputLabel } from "@mui/material";
import AddButton from "./AddButton";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  border: "2px solid whiteSmoke",
  boxShadow: 24,
  p: 4,
};

export default function AddModal({
  buttonName,
  title,
  inputFields,
  actionLabel,
  endpoint,
}) {
  const initialInputValues = inputFields.reduce((acc, field) => {
    acc[field.stateVariable] = "";
    return acc;
  }, {});

  const [inputValues, setInputValues] = useState(initialInputValues);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setInputValues(initialInputValues);
    setOpen(false);
  };
  const { mutate, error, data, isError, isSuccess, isLoading } = usePost(
    endpoint
  );

  const handleAdd = async () => {
    try {
    mutate(inputValues);
      // Handle the response data as needed
    } catch (error) {
      // Handle the error
    }
   
  };

  return (
    <div>
      <AddButton onClickAction={handleOpen} buttonName={buttonName}/>
      {/* <Button onClick={handleOpen}>{buttonName}</Button> */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          {inputFields.map((field, index) => (
            <div key={index}>
              {field.type === "date" && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {field.label}
                </Typography>
              )}

              {field.type === "select" ? ( 
                <>
                <InputLabel>{field?.label}</InputLabel>  
                <Select
                  value={inputValues[field.stateVariable]}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setInputValues((prevValues) => ({
                      ...prevValues,
                      [field.stateVariable]: newValue,
                    }));
                  }}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {field.options.map((option, optionIndex) => (
                    <MenuItem key={optionIndex} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                </>
              ) : (
                <TextField
                  label={field.type !== "date" ? field.label : ""}
                  value={inputValues[field.stateVariable]}
                  type={field.type || "text"}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setInputValues((prevValues) => ({
                      ...prevValues,
                      [field.stateVariable]: newValue,
                    }));
                  }}
                  fullWidth
                  sx={{ mt: field.type !== "date" ? 2 : 0 }}
                />
              )}
            </div>
          ))}
          <Typography variant="h6" component="h2">
            <p style={{ margin: "0px", color: "red" }}>
              {isError ? error.message : ""}
            </p>
          </Typography>
          <Typography variant="h6" component="h2">
            <p style={{ margin: "0px", color: "green" }}>
              {isSuccess ? "Successfully Added" : ""}
            </p>
          </Typography>

          <Typography variant="h6" component="h2">
            {data ? "" : ""}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClose} sx={{ marginRight: 2 }}>
              Cancel
            </Button>
            {isLoading ? (
              <Button variant="contained" color="primary" onClick={handleAdd}>
                Adding
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleAdd}>
                {actionLabel}
              </Button>
            )}
          </Box>  
        </Box>
      </Modal>
    </div>
  );
}
