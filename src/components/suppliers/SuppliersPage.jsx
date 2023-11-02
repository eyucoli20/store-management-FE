import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Typography } from "@mui/material";
import AddModal from "../common/AddModal";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
// import { data as initialData } from './makeData';
import { baseURL } from "../../constants";
// import useGet from "../../services/useGet";
import makeApiRequest from "../../services/req";
import useGet from "../../services/useGet";
import EditModal from "../common/EditModal";

export const SuppliersPage = () => {
  // const [data, setData] = useState([]);
  // const [isError, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isRefetching, setIsRefetching] = useState(false);
  // const [columnFilters, setColumnFilters] = useState([]);
  // const [globalFilter, setGlobalFilter] = useState('');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!data) {
  //       setIsLoading(true);
  //     } else {
  //       setIsRefetching(true);
  //     }

  //     const url = new URL(`${baseURL}api/v1/suppliers/search`);
  //     url.searchParams.set('query', JSON.stringify(columnFilters ?? []));
  //     url.searchParams.set('query', globalFilter ?? '');
  //     try {
  //       const response = await fetch(url.href);
  //       const json = await response.json();

  //       setData(json || []);
  //     } catch (error) {
  //       setIsError(true);
  //       console.error(error);
  //       return;
  //     }
  //     setIsError(false);
  //     setIsLoading(false);
  //     setIsRefetching(false);
  //   };

  //   fetchData();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [columnFilters, globalFilter]);
  const {data:categories, isLoading:isLoadingCategories } = useGet(`${baseURL}api/v1/categories`,"");
  const {data:suppliers, isLoading:isLoadingSuppliers } = useGet(`${baseURL}api/v1/suppliers`,"");

  const categoryOptions = useMemo(() => {
    if (isLoadingCategories || !categories) {
      return [];
    }
  
    return categories.map((category) => ({
      value: category?.categoryId?.toString(),
      label: category?.categoryName,
    }));
  }, [categories, isLoadingCategories]);

  const suppliersOptions = useMemo(() => {
    if (isLoadingSuppliers || !suppliers) {
      return [];
    }
  
    return suppliers.map((suppliers) => ({
      value: suppliers?.supplierId?.toString(),
      label: suppliers?.supplierName,
    }));
  }, [suppliers, isLoadingSuppliers]);


  const { data, isLoading } = useGet(`${baseURL}api/v1/suppliers`, "");
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "supplierId",
        header: "Id",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        },
      },
      {
        accessorKey: "supplierName",
        header: "Supplier Name",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        },
      },
      {
        accessorKey: "supplierAddress",
        header: "Supplier Address",
      },
    ],
    []
  );


  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState(1);

  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    try {
      const updatedData = await makeApiRequest(
        `${baseURL}api/v1/suppliers/${values.id}`,
        "PUT",
        values
      );

      if (updatedData) {
        data[row.index] = values;
        setId(row.index);
      }

      exitEditingMode();
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "end" }}>
      <Box style={{ margin: "0 25px" }}>
        <AddModal
          buttonName="Add Suppliers"
          title="Add New Suppliers "
          inputFields={[
            { label: "Supplier Name", stateVariable: "supplierName" },
            { label: "Supplier Address", stateVariable: "supplierAddress" },
          ]}
          actionLabel="Add Supplier"
          
          endpoint={`${baseURL}api/v1/suppliers`}
        />

        
      </Box>

      <Box>
      <EditModal
          buttonName="Assign category"
          title="Assign New Category "
          inputFields={[
            {
              type: "select",
              label: "suppliers",
              stateVariable: "supplierId",
              options: suppliersOptions
            }, 
            {
              type: "select",
              label: "Category",
              stateVariable: "categoryId",
              options: categoryOptions
            },
          ]}
          actionLabel="Assign category"
          
          endpoint={`${baseURL}api/v1/suppliers/assign-to-category`} //PUT
        />
      </Box>
      </div>
     

      <MaterialReactTable
        columns={columns}
        state={{ isLoading: isLoading }}
        editingMode="modal" //default
        enableEditing={true ? true : false}
        onEditingRowSave={handleSaveRow}
        enableRowActions
        data={tableData || []}
        manualFiltering={true}
        renderDetailPanel={({ row }) => (
          <Box
            sx={{
              display: "grid",
              margin: "auto",
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
            }}
          >
            <Typography>Address: {row.original.address}</Typography>
            <Typography>City: {row.original.city}</Typography>
            <Typography>State: {row.original.state}</Typography>
            <Typography>Country: {row.original.country}</Typography>
          </Box>
        )}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
            <IconButton
              color="secondary"
              onClick={() => {
                table.setEditingRow(row);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                tableData?.splice(row.index, 1);
                setTableData([...data]);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      />
    </div>
  );
};

export default SuppliersPage;
