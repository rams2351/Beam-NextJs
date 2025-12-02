import ButtonVariants from "@/components/practice/ButtonVariants";
import CheckboxVariants from "@/components/practice/CheckboxVariants";
import ComponentsFormControl from "@/components/practice/ComponentsFormControl";
import RadioGroupVariants from "@/components/practice/RadioGroupVariants";
import SelectVariants from "@/components/practice/SelectVariants";
import SwitchVariants from "@/components/practice/SwitchVariants";
import React from "react";

const ComponentsPage: React.FC = () => {
  return (
    <div className="">
      <ComponentsFormControl />

      <div className="p-10 m-10 grid grid-cols-3 gap-10">
        <SelectVariants />
        <ButtonVariants />
        <RadioGroupVariants />
        <SwitchVariants />
        <CheckboxVariants />
      </div>
    </div>
  );
};

export default ComponentsPage;
