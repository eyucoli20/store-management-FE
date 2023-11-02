import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
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

export const InventoryList = () => {
  
  const jsonUser = JSON.parse(localStorage.getItem('user'));
  const token = jsonUser?.access_token

  const classes = useStyles();
  const { data, isLoading } = useGet(`${baseURL}api/v1/store-inventory`, "");
  // const {data:categories, isLoading:isLoadingCategories } = useGet(`${baseURL}api/v1/categories`,"");

  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setTableData(data);
  }, [data]);



  // const categoryOptions = useMemo(() => {
  //   if (isLoadingCategories || !categories) {
  //     return [];
  //   }
  
  //   return categories.map((category) => ({
  //     value: category?.categoryId?.toString(),
  //     label: category?.categoryName,
  //   }));
  // }, [categories, isLoadingCategories]);

  const columns = useMemo(
    () => [

      {
        accessorKey: "storeInventoryId",
        header: "Id",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "store.storeName",
        header: "Store Name",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "store.storeType",
        header: "Store Type",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "item.itemName",
        header: "itemName",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "item.price",
        header: "Price",
      },
      {
        accessorKey: "item.category",
        header: "Item Category",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
      },
      {
        accessorKey: "minThreshHold",
        header: "Min ThreshHold",
      },
      {
        accessorKey: "maxThreshHold",
        header: "Max ThreshHold",
      },
    ],
    []
  );
  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    try {
      const updatedData = await makeApiRequest(
        `${baseURL}api/v1/store-inventory/${values.storeInventoryId}`,
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
              <Typography>Store Name: {row.original.store.storeName}</Typography>
              <Typography>Item Name: {row.original.item.itemName}</Typography>
              <Typography>Price: {row.original.item.price}</Typography>
              <Typography>Item Category:{row.original.item.category}</Typography>
              <Typography>Quantity:{row.original.quantity}</Typography>
              <Typography>Min Threshold:{row.original.minThreshHold}</Typography>
              <Typography>Max Threshold :{row.original.maxThreshHold}</Typography>
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

export default InventoryList;
