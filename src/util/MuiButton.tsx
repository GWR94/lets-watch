import React from "react";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import MuiButton from "@mui/material/Button";
import { ButtonProps } from "./interfaces/MuiButton.i";

const capitalize = (string: string): string => {
  return string.substring(0, 1).toUpperCase() + string.substring(1).toLocaleLowerCase();
};

const useStyles = makeStyles<Theme>((theme) =>
  createStyles({
    outlinedSuccess: {
      borderColor: theme.palette.success.main,
      color: theme.palette.success.main,
    },
    outlinedError: {
      borderColor: theme.palette.error.main,
      color: theme.palette.error.main,
    },
    outlinedWarning: {
      borderColor: theme.palette.warning.main,
      color: theme.palette.warning.main,
    },
    outlinedInfo: {
      borderColor: theme.palette.info.main,
      color: theme.palette.info.main,
    },
    containedSuccess: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.success.dark,
      },
    },
    containedError: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
    },
    containedWarning: {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.warning.dark,
      },
    },
    containedInfo: {
      backgroundColor: theme.palette.info.main,
      color: theme.palette.info.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.info.dark,
      },
    },
  }),
);

const Button: React.FC<ButtonProps> = ({ children, color, ...props }) => {
  const classes = useStyles();
  const className = classes?.[`${props.variant}${capitalize(color)}`];
  const colorProp =
    ["default", "inherit", "primary", "secondary"].indexOf(color) > -1
      ? (color as "default" | "inherit" | "primary" | "secondary")
      : undefined;

  return (
    <MuiButton {...props} color={colorProp} className={className}>
      {children}
    </MuiButton>
  );
};

Button.displayName = "Button";

export default Button;
