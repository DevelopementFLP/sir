import { MenuItem } from "primeng/api";

export interface MenuItemModel {
    type:           string;
    parentLabel:    string;
    menuItem:       MenuItem;
}