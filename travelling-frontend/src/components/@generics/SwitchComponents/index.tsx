import React from "react";

interface ISwitchComponents {
  active: string;
  children: React.ReactElement[] | React.ReactElement;
}

export const SwitchComponents: React.FC<ISwitchComponents> = ({
  active,
  children,
}) => {
  // Switch all children and return the "active" one
  if (Array.isArray(children)) {
    return children.filter((child) => child.props.name === active)[0];
  } else {
    return children;
  }
};
