import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import InventoryList from "./InventoryList";
import AddItemsToStorePage from "./AddItemsToStorePage";
import AddButton from "../common/AddButton";
import useGet from "../../services/useGet";
import { baseURL } from "../../constants";
import EditModal from "../common/EditModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  bgcolor: "background.paper",
  border: "2px solid whiteSmoke",
  boxShadow: 24,
  p: 4,
};

export default function InventoryModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const { data} = useGet(`${baseURL}api/v1/store-inventory`, "");
  const options = data?.map(inventory => ({ value: inventory.storeInventoryId, label: inventory.item.itemName })) || [];
 
  return (
    <>
    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'end'}}>
      <Box style={{margin: "0 25px"}}>
    <EditModal
          buttonName="SELL ITEM"
          title="Sell Item"
          inputFields={[
            {
              type: "select",
              label: "Select Item From Store",
              stateVariable: "storeInventoryId",
             
              options: options
            },
            { label: "Quantity", stateVariable: "quantity" },
          ]}
            actionLabel="SELL ITEM"
           
            isInvetory={true}
        />
      </Box>
      <Box>
      <AddButton onClickAction={handleOpen} buttonName={'Add Inventory'}/>
      </Box>
    </div>
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography style={{textAlign:'center'}} variant="h6" component="h2">
            Add Inventory
          </Typography>
          <AddItemsToStorePage handleClose={handleClose} />
        </Box>
      </Modal>
      <InventoryList/>
    </div>
    </>
    
  );
}
