import { SFC, createElement } from "react";

export interface AlertProps {
    message: string;
}

export const Alert: SFC<AlertProps> = ({ message }) =>
    message
        ? createElement("div", { className: "alert alert-danger widget-switch-alert" }, message)
        : null;

Alert.displayName = "Alert";
