import React, { useState, useEffect } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import InventoryIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
const menus = [
  {
    index: 0,
    link: "/dashboard/store",
    title: "Store",
    icon: <StoreIcon />,
    roles: ["ADMIN", "STORE_MANAGER"],
  },
  {
    index: 1,
    link: "/dashboard/item",
    title: "Item",
    icon: <CategoryIcon />,
    roles: ["ADMIN","STORE_MANAGER"],
  },
  {
    index: 2,
    link: "/dashboard/inventory",
    title: "Inventory",
    icon: <InventoryIcon />,
    roles: ["ADMIN","STORE_MANAGER", "STORE_STAFF"],
  },
  {
    index: 3,
    link: "/dashboard/purchase",
    title: "Purchase",
    icon: <LocalShippingIcon />,
    roles: ["ADMIN", "STORE_MANAGER"],
  },
  {
    index: 4,
    link: "/dashboard/user",
    title: "User",
    icon: <PeopleIcon />,
    roles: ["ADMIN"],
  },
  {
    index: 5,
    link: "/dashboard/suppliers",
    title: "Suppliers",
    icon: <StorefrontIcon/>,
    roles: ["ADMIN"],
  },
];

function ListItems() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredMenus, setFilteredMenus] = useState([]);
  const [role, setRole] = useState(localStorage.getItem("role"))
  const navigate = useNavigate();

  useEffect(() => {
    if (role) {
      setRole(role)
      setFilteredMenus(
        menus.filter((menu) => menu.roles.includes(role))
      );
    }
  }, [role]);

  const handleClick = async (event, index) => {

    event.preventDefault();
    setSelectedIndex(index);
  };

  return filteredMenus.map((menu, key) => (
    <ListItemButton
      key={key}
      sx={{
        "&.Mui-selected": {
          color: "#488550",
          backgroundColor: "#FFF",
          borderRadius: "21.5px",
        },
      }}
      selected={selectedIndex === menu.index}
      onClick={(event) => {
        const index = menu.index;
        navigate(menu.link);
        handleClick(event, index);
      }}
    >
      <ListItemIcon sx={{ color: selectedIndex === menu.index && "#488550" }}>
        {menu.icon}
      </ListItemIcon>
      <ListItemText primary={menu.title} />
    </ListItemButton>
  ));
}

export default ListItems;
