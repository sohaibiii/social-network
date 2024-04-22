import React from "react";

import { Controller, UseControllerReturn } from "react-hook-form";

import {
  FilterSelectorType,
  FormikFiltersSelectorItemProps
} from "./FormikFiltersSelector.types";

import { FiltersSelectorItem } from "~/components/hotels/filtersSelectorItem";

const FormikFiltersSelector = (props: FormikFiltersSelectorItemProps): JSX.Element => {
  const {
    name = "",
    defaultValue = [],
    control,
    renderItem = () => <></>,
    data = [],
    isMultiSelect = false,
    onCheckedCb = () => undefined,
    accentColor = ""
  } = props;

  const render = ({ field: { onChange, value } }: UseControllerReturn) => {
    const handleSelected = (
      checked: boolean,
      selectedItem: { name: string; id: string | number }
    ) => {
      const index = value.findIndex((item: FilterSelectorType) => {
        return item.id === selectedItem.id;
      });
      let tempList;
      if (checked) {
        tempList = isMultiSelect ? value.concat(selectedItem) : [selectedItem];
      } else {
        const newList = Array.from(value);
        newList.splice(index, 1);
        tempList = newList;
      }
      onChange(tempList);
      onCheckedCb(tempList);
    };

    return (
      <>
        {data?.map(item => {
          const checked = value
            .map((filterItem: FilterSelectorType) => filterItem.id)
            .includes(item.id);

          return (
            <FiltersSelectorItem
              title={item.name}
              checked={checked}
              onCheckedCb={isChecked => handleSelected(isChecked, item)}
              key={item.id}
              accentColor={accentColor}
            >
              {renderItem(item)}
            </FiltersSelectorItem>
          );
        })}
      </>
    );
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      render={render}
    />
  );
};

export default FormikFiltersSelector;
