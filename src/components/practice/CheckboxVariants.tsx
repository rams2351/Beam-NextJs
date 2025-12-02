"use client";
import Checkbox from "@/components/common/Checkbox";
import { useState } from "react";
import RadioGroup from "../common/RadioGroup";

const CheckboxVariants = () => {
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [labelPosition, setLabelPosition] = useState<"start" | "end">("end");

  const handleCheckboxChange = (checked: boolean) => {
    setCheckboxChecked(checked);
  };

  return (
    <div className="space-y-6 card  w-fit min-w-[300px] flex flex-col ">
      <h3 className="text-lg font-bold">Checkbox Variants</h3>

      <div className="  gap-4  flex flex-col border border-primary rounded-lg p-4">
        <RadioGroup
          value={labelPosition}
          className="flex flex-row gap-2"
          onValueChange={(value) => setLabelPosition(value as "start" | "end")}
          options={[
            { value: "start", label: "Start" },
            { value: "end", label: "End" },
          ]}
          label="Radio Label Position"
          optionTextPosition={"end"}
          size="sm"
        />
      </div>

      {/* Contained Variant */}
      <div>
        <h4 className="text-sm font-medium mb-5 text-primary">Contained Variant</h4>
        <div className="space-y-4">
          <Checkbox
            size="sm"
            labelPosition={labelPosition}
            variant="contained"
            value={checkboxChecked}
            onChange={handleCheckboxChange}
            label="Contained Checkbox (sm)"
          />
          <Checkbox
            size="md"
            labelPosition={labelPosition}
            variant="contained"
            value={checkboxChecked}
            onChange={handleCheckboxChange}
            label="Contained Checkbox (md)"
          />
          <Checkbox
            size="lg"
            labelPosition={labelPosition}
            variant="contained"
            value={checkboxChecked}
            onChange={handleCheckboxChange}
            label="Contained Checkbox (lg)"
          />
        </div>
      </div>

      {/* Outlined Variant */}
      <div>
        <h4 className="text-sm font-medium mb-5 text-primary">Outlined Variant</h4>
        <div className="space-y-4">
          <Checkbox
            size="sm"
            labelPosition={labelPosition}
            variant="outlined"
            value={checkboxChecked}
            onChange={handleCheckboxChange}
            label="Outlined Checkbox (sm)"
          />
          <Checkbox
            size="md"
            labelPosition={labelPosition}
            variant="outlined"
            value={checkboxChecked}
            onChange={handleCheckboxChange}
            label="Outlined Checkbox (md)"
          />
          <Checkbox
            size="lg"
            labelPosition={labelPosition}
            variant="outlined"
            value={checkboxChecked}
            onChange={handleCheckboxChange}
            label="Outlined Checkbox (lg)"
          />
        </div>
      </div>
    </div>
  );
};

export default CheckboxVariants;
