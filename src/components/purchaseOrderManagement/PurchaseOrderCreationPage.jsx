import React, { useEffect, useState } from "react";
import StoreSelection from "../common/StoreSelection";
import ItemSelection from "../common/ItemSelection";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import usePost from "../../services/usePost";
import { baseURL } from "../../constants";

const PurchaseOrderCreationPage = ({handleClose}) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const handleSelectedItemIdChange = (newSelectedId) => {
    setSelectedItemId(newSelectedId);
  };
  const handleSelectedStoreIdChange = (newSelectedId) => {
    setSelectedStoreId(newSelectedId);
  };

  const initialValues = {
    itemId: selectedItemId,
    storeId: selectedStoreId,
    quantity: ""
  };

  const formik = useFormik({
    initialValues,
  });

  useEffect(() => {
    formik.setValues({
      ...formik.values,
      itemId: selectedItemId,
      storeId: selectedStoreId,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItemId, selectedStoreId]);
  const { mutate,isError,error,isSuccess,isLoading } = usePost(
    `${baseURL}api/v1/purchase-orders`,
    formik.values
  );

  const handleAdd = () => {
   
    // Here you can make an API call to post the form dat

    try {
      mutate(formik.values);
      
      // Handle the response data as needed
    } catch (error) {
      
      // Handle the error
    }
  };
  return (
    <div>
      <div>
      </div>
      <div style={{ margin: "0px", padding: "0px" }}>
        <div style={{ padding: "10px" }}>
          <ItemSelection onSelectedIdChange={handleSelectedItemIdChange} />
        </div>
        <div style={{ padding: "10px" }}>
          {" "}
          <StoreSelection onSelectedIdChange={handleSelectedStoreIdChange} />
        </div>
        <div style={{ padding: "10px" }}>
          <TextField
            label="Quantity"
            name="quantity"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            fullWidth
          />
        </div>
      </div>

      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button  onClick={handleClose} sx={{ marginRight: 2 }}>
              Cancel
            </Button>
              <Button variant="contained" color="primary" onClick={handleAdd}>
               {isLoading?"Adding...":"Add"}
              </Button>
            
          </Box>
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

          
    </div>
  );
};

export default PurchaseOrderCreationPage;
