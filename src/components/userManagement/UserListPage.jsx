import React, { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, MenuItem, Typography } from "@mui/material";
import AddModal from "../common/AddModal";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
// import { data as initialData } from './makeData';
import { baseURL } from "../../constants";
import useGet from "../../services/useGet";
import makeApiRequest from "../../services/req";


export const UserListPage = () => {
  const jsonUser = JSON.parse(localStorage.getItem('user'));
  const token = jsonUser?.access_token
 

  const {data:data1,isLoading} = useGet(`${baseURL}api/v1/users`,'');
  const {data:roles,isLoading:isLoadingRoles} = useGet(`${baseURL}api/v1/roles`,);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(data1);
  }, [data1]);

  const rolesOptions = useMemo(() => {
    if (isLoadingRoles || !roles) {
      return [];
    }
  
    return roles.map((role) => ({
      value: role?.roleId?.toString(),
      label: role?.roleName,
    }));
  }, [roles, isLoadingRoles]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const status = ['ACTIVE','SUSPENDED','BANNED']
  const columns = useMemo(
    //column definitions...
    () => [

      {
        accessorKey: "id",
        header: "Id",
        editable: "never",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "fullName",
        header: "Full Name",
        editable: "never",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "username",
        header: "username",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "email",
        header: "Email",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,

        },
      },
      {
        accessorKey: "role",
        header: "Role",
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: rolesOptions?.map((role) => (
            <MenuItem key={role?.value} value={role?.value}>
              {role?.label}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: "userStatus",
        header: "User Status",
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: status?.map((status,index) => (
            <MenuItem key={index} value={status}>
              {status}
            </MenuItem>
          )),
        },

      },
      {
        accessorKey: "registeredBy",
        header: "Registered By",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        
        },
      },
      {
        accessorKey: "lastLogin",
        header: "Last Login",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        muiTableBodyCellEditTextFieldProps: {
          disabled: true,
        
        },
      },
    ],
    [rolesOptions, status]
  );

  



  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    console.log(values)
    const formatedData = {
      "status": `${values.userStatus}`,
      "roleId":`${values.role}`
  }
    try {
      const updatedData = await makeApiRequest(
        `${baseURL}api/v1/users/${values.id}`,
        "PUT",
        formatedData,
        token
      );
  
      if (updatedData) {
        // Assuming `data` is the array containing your table rows
        const newData = [...data1];
        newData[row.index] = updatedData; // Replace the edited row with the updated data
        setTableData(newData);
      }
      
      exitEditingMode();
    } catch (error) {
      console.error("API request error:", error);
    }
  };
  

  return (
    <div>
      <Box mt={2} textAlign="center">
        <AddModal
          buttonName="Add User"
          title="Create User"
          inputFields={[
            { label: "Full Name", stateVariable: "fullName" },
            { label: "Email", stateVariable: "email", type:'email' },
            { label: "User Name", stateVariable: "username" },
            {
              label: "Password",
              stateVariable: "password",
              type:'password'
            },
            {    type: "select",
                label: "Role",
                stateVariable: "roleId",
                options:rolesOptions
              },
          ]}
          actionLabel="Add"
         
          endpoint={`${baseURL}api/v1/users`}
        />
      </Box>
      <MaterialReactTable
        state={{ isLoading: isLoading }}
        columns={columns}
        data={tableData || []}
        enableRowActions
        onEditingRowSave={handleSaveRow}
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
                data1?.splice(row.index, 1); //assuming simple data table
                setTableData([...data1]);
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

export default UserListPage;
