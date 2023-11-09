import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Typography, Paper, MenuItem } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import AddModal from "../common/AddModal";
import { darken } from "@mui/material";
import useGet from "../../services/useGet";
import { baseURL } from "../../constants";
import makeApiRequest from "../../services/req";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  tableContainer: {
    backgroundColor: "red",
    marginBottom: theme.spacing(2),
  },
  rowActions: {
    display: "flex",
    flexWrap: "nowrap",
    gap: "20px",
  },
  actionButton: {
    backgroundColor: "whiteSmoke",
  },
  tablePaper: {
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
  },
  rowBackground: {
    borderRadius: "8px",
    padding: "8px",
  },
  addButton: {
    backgroundColor: "primary",
    color: "white",
  },
}));

export const ItemList = () => {
  const jsonUser = JSON.parse(localStorage.getItem('user'));
  const token = jsonUser?.access_token
  
  const classes = useStyles();
  const { data, isLoading } = useGet(`${baseURL}api/v1/items`, "");
  const { data: categories, isLoading: isLoadingCategories, } = useGet(
    `${baseURL}api/v1/categories`,
    ""
  );
  console.log(categories)

  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const categoryOptions = useMemo(() => {
    if (isLoadingCategories || !categories) {
      return [];
    }

    return categories.map((category) => ({
      value: category?.categoryId?.toString(),
      label: category?.categoryName,
    }));
  }, [categories, isLoadingCategories]);

  const columns = useMemo(
    () => [

      {
        accessorKey: "itemId",
        header: "Item Id",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "itemName",
        header: "Item Name",
      },
      {
        accessorKey: "category",
        header: "Category",
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: categoryOptions?.map((option, index) => (
            <MenuItem key={index} value={option?.value}>
              {option?.label}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: "price",
        header: "Price",
      },
      {
        accessorKey: "initialQuantity",
        header: "Initial Quantity",
      },
      {
        accessorKey: "description",
        header: "Description",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  
  

  
  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    try {
      const updatedData = await makeApiRequest(
        `${baseURL}api/v1/items/${values.itemId}`,
        "PUT",
        values,
        token
      );
  
      if (updatedData) {
        // Assuming `data` is the array containing your table rows
        const newData = [...data];
        newData[row.index] = updatedData; // Replace the edited row with the updated data
        setTableData(newData);
      }
      
      exitEditingMode();
    } catch (error) {
      console.error("API request error:", error);
    }
  };
  


  return (
    <div className={classes.root}>
      <div
        style={{ display: "flex", flexDirection: "row", justifyContent: "end" }}
      >
        <Box style={{ margin: "0 25px" }}>
          <AddModal
            buttonName="Add Category "
            title="Add Category"
            inputFields={[
              { label: "Category Name", stateVariable: "categoryName" },
            ]}
            actionLabel="Add"
            
            endpoint={`${baseURL}api/v1/categories`}
          />
        </Box>

        <Box>
          <AddModal
            buttonName="Add Item"
            title="Add Item"
            inputFields={[
              { label: "Name", stateVariable: "itemName" },
              { label: "Price", stateVariable: "price" },
              { label: "Quantity", stateVariable: "initialQuantity" },
              { label: "Description", stateVariable: "description" },
              {
                type: "select",
                label: "Category",
                stateVariable: "categoryId",
                options: categoryOptions,
              },
            ]}
            actionLabel="Add"
            endpoint={`${baseURL}api/v1/items`}
          />
        </Box>
      </div>

      <Paper className={classes.tablePaper}>
        <MaterialReactTable
          columns={columns}
          state={{ isLoading: isLoading }}
          data={tableData || []}
          enableRowActions
          onEditingRowSave={handleSaveRow}
          muiTableHeadCellProps={{
            sx: {
              fontWeight: "bold",
              fontSize: "15px",
            },
          }}
          muiTablePaperProps={{
            elevation: 0,
            sx: {
              borderRadius: "0",
              border: "0.5px dashed #D5D7DF",
            },
          }}
          muiTableBodyProps={{
            sx: (theme) => ({
              "& tr:nth-of-type(odd)": {
                backgroundColor: darken(theme.palette.background.default, 0.04),
              },
            }),
          }}
          tableClassName={classes.tableContainer}
          renderDetailPanel={({ row }) => (
            <Box className={classes.rowBackground}>
              <Typography>Item Name: {row.original.itemName}</Typography>
              <Typography>Category: {row.original.category}</Typography>
              <Typography>Price: {row.original.price}</Typography>
              <Typography>Initail Quantity: {row.original.initialQuantity}</Typography>
              <Typography>Desc: {row.original.description}</Typography>
            </Box>
          )}
          renderRowActions={({ row, table }) => (
            <Box className={classes.rowActions}>

              <IconButton
                className={classes.actionButton}
                color="secondary"
                onClick={() => {
                  table.setEditingRow(row);
                }}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                className={classes.actionButton}
                color="error"
                onClick={() => {
                  const newData = tableData.filter(
                    (item, index) => index !== row.index
                  );
                  setTableData(newData);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        />
      </Paper>
    </div>
  );
};

export default ItemList;
