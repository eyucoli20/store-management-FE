import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Typography, Paper, MenuItem } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { darken } from "@mui/material";
import useGet from "../../services/useGet";
import { baseURL } from "../../constants";
import PurchaseOrderModal from "./PurchaseOrderModal";
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

export const PurchaseOrderList = () => {
  const jsonUser = JSON.parse(localStorage.getItem('user'));
  const token = jsonUser?.access_token
  

  const classes = useStyles();
  const { data, isLoading } = useGet(`${baseURL}api/v1/purchase-orders`, "");
  const [tableData, setTableData] = useState([]);

  const reformattedData = data?.map((order) => ({
    purchaseOrderId:order.purchaseOrderId,
    storeName: order.store.storeName,
    itemName: order.item.itemName,
    quantity: order.quantity,
    supplierName: order.supplier.supplierName,
    orderStatus: order.purchaseOrderStatus,
    orderNumber: order.orderNumber,
  }));

  useEffect(() => {
    setTableData(reformattedData);
  }, [data, reformattedData]);
  const status = ['PENDING','APPROVED','DELIVERED']
  const columns = useMemo(
    () => [
      {
        accessorKey: "purchaseOrderId",
        header: "Id",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "storeName",
        header: "Store Name",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "itemName",
        header: "Item list",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "quantity",
        header: "Quantity",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "orderNumber",
        header: "Purchase order number",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "orderStatus",
        header: "Order Status",
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: status?.map((status,index) => (
            <MenuItem key={index} value={status}>
              {status}
            </MenuItem>
          )),
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );


  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    try {
      const updatedData = await makeApiRequest(
        `${baseURL}api/v1/purchase-orders/${values.purchaseOrderId}/status?status=${values.orderStatus}`,
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
      <Box mt={2} textAlign="center">
        <PurchaseOrderModal />
      </Box>
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
              <Typography>Store Name: {row.original.storeName}</Typography>
              <Typography>item List: {row.original.itemName}</Typography>
              <Typography>Quantity: {row.original.quantity}</Typography>
              <Typography>Purchase order Number:{row.original.orderNumber}</Typography>
              <Typography>Order Status:{row.original.orderStatus}</Typography>
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

export default PurchaseOrderList;
