import { ButtonProps as MuiButtonProps } from "@mui/material/Button";

export type ColorTypes =
  | "primary"
  | "secondary"
  | "error"
  | "success"
  | "warning"
  | "default"
  | "inherit"
  | "info";

export type ButtonProps = { color: ColorTypes } & Omit<MuiButtonProps, "color">;
