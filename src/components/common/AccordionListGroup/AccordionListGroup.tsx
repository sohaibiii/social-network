import React, { FC, useEffect, useState } from "react";

import { AccordionListGroupProps } from "./AccordionListGroup.types";

const AccordionListGroup: FC<AccordionListGroupProps> = props => {
  const { defaultValue, children, onSelectCb = ()=>{} } = props;
  const [activeItem, setActiveItem] = useState(defaultValue);

  return (
    <>
      {React.Children.map(children, child => {
        return child ? (
          <>
            {React.isValidElement(child) ? (
              React.cloneElement(child, {
                activeItem,
                onSelect: (id: string) => {
                  if (id === activeItem) {
                    return setActiveItem("");
                  }
                  onSelectCb(id);
                  setActiveItem(id);
                }
              })
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        );
      })}
    </>
  );
};

export { AccordionListGroup };
