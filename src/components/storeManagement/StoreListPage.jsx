import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Typography } from "@mui/material";
import AddModal from "../common/AddModal";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
// import { data as initialData } from './makeData';
import { baseURL } from "../../constants";
// import useGet from "../../services/useGet";
import makeApiRequest from '../../services/req'

export const StoreListPage = () => {
  
  const jsonUser = JSON.parse(localStorage.getItem('user'));
  const token = jsonUser?.access_token
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [refresh,setRefersh] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!data) {
        setIsLoading(true);
      } else {
        setIsRefetching(true);
      }
  
      const url = new URL(`${baseURL}api/v1/stores/search`);
      url.searchParams.set('query', JSON.stringify(columnFilters ?? []));
      url.searchParams.set('query', globalFilter ?? '');
      try {
        const response = await fetch(url.href,{
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', 
          }});
        const json = await response.json();

        setData(json || []); 
      } catch (error) {
        setIsError(true);
        console.error(error);
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);
    };
  
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnFilters, globalFilter,refresh]);
  


  const columns = useMemo(
    () => [
      {
        accessorKey: "storeId",
        header: "Id",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "storeName",
        header: "Store Name",
      },
      {
        accessorKey: "location",
        header: "Location",
      },
      {
        accessorKey: "contactInformation",
        header: "Contact",
      },
      {
        accessorKey: "storeType",
        header: "Store Type",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        
        },
      },
      {
        accessorKey: "openingDate",
        header: "Opening Date",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        
        },
      },
    ],
    []
  );

 
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState(1);

  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    try {
      const updatedData = await makeApiRequest(
        `${baseURL}api/v1/stores/${values.storeId}`,
        "PUT",
        values,
        token
      );

      if (updatedData) {
        data[row.index] = values;
        setId(row.index);
      }
      setRefersh(true)
      exitEditingMode();
    } catch (error) {
      console.error("API request error:", error);
    }
  };


  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !window.confirm(`Are you sure you want to delete ${row.getValue('storeName')}`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      data?.splice(row.index, 1);
      setData([...data])
    },
    [data],
  );
  
  return (
    <div>
      <Box mt={2} textAlign="center">
        
        <AddModal
          buttonName="Add Store"
          title="Add New Store"
          inputFields={[
            { label: "Name", stateVariable: "storeName" },
            { label: "Location", stateVariable: "location" },
            { label: "Contact", stateVariable: "contactInformation" },
            {
              label: "Opening Date",
              stateVariable: "openingDate",
              type: "date",
            },
            {
              type: "select",
              label: "Store Type",
              stateVariable: "storeType",
              options: [
                { value: "RETAIL", label: "RETAIL" },
                { value: "ONLINE", label: "ONLINE" },
                { value: "WHOLESALE", label: "WHOLESALE" },
              ],
            },
          ]}
          actionLabel="Add Store"
         
          endpoint={`${baseURL}api/v1/stores`}
        />
      </Box>
      
      <MaterialReactTable
        columns={columns}
        editingMode="modal" //default
        enableEditing={true? true : false}
        onEditingRowSave={handleSaveRow}
        enableRowActions
        data={data}
        manualFiltering={true}
        muiToolbarAlertBannerProps={
          isError
            ? {
                color: 'error',
                children: 'Error loading data',
              }
            : undefined
        }
        onColumnFiltersChange={setColumnFilters}
        onGlobalFilterChange={setGlobalFilter}
        state={{
          columnFilters,
          globalFilter,
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
          
        }}
        renderDetailPanel={({ row }) => (
          <Box
            sx={{
              display: "grid",
              margin: "auto",
              gridTemplateColumns: "1fr 1fr",
              width: "100%",
            }}
          >
            <Typography>StoreName: {row.original.storeName}</Typography>
            <Typography>Location: {row.original.location}</Typography>
            <Typography>Contact: {row.original.contactInformation}</Typography>
            <Typography>Store Type: {row.original.storeType}</Typography>
            <Typography>Opening Date: {row.original.openingDate}</Typography>
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
              onClick={() => handleDeleteRow(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      />
    </div>
  );
};

export default StoreListPage;
