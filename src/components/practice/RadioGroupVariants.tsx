"use client";
import React, { useState } from "react";
import RadioGroup from "../common/RadioGroup";

const RadioGroupVariants: React.FC = () => {
  const [radioValue, setRadioValue] = useState("option1");
  const [variant, setVariant] = useState<"contained" | "outlined">("contained");
  const [labelPosition, setLabelPosition] = useState<"start" | "end">("end");

  return (
    <div className="space-y-6 card  w-fit min-w-[300px] flex flex-col ">
      <h3 className="text-lg font-bold">Radio Group Variants</h3>

      <div className="  gap-4  flex flex-col border border-primary rounded-lg p-4">
        <RadioGroup
          value={variant}
          className="flex flex-row gap-2"
          onValueChange={(value) => setVariant(value as "contained" | "outlined")}
          options={[
            { value: "contained", label: "Contained" },
            { value: "outlined", label: "Outlined" },
          ]}
          label="Radio Variants"
          optionTextPosition={"end"}
          size="sm"
        />

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
      <RadioGroup
        disabled={true}
        value={radioValue}
        onValueChange={(value) => setRadioValue(value)}
        options={[
          { value: "option1", label: "Option 1" },
          { value: "option2", label: "Option 2" },
          { value: "option3", label: "Option 3" },
        ]}
        label="Radio Group (sm)"
        optionTextPosition={labelPosition}
        size="sm"
        variant={variant}
      />

      {true && (
        <RadioGroup
          value={radioValue}
          onValueChange={(value) => setRadioValue(value)}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
          label="Radio Group (md)"
          optionTextPosition={labelPosition}
          size="md"
          variant={variant}
        />
      )}
      {true && (
        <RadioGroup
          value={radioValue}
          onValueChange={(value) => setRadioValue(value)}
          options={[
            { value: "option1", label: "Option 1" },
            { value: "option2", label: "Option 2" },
            { value: "option3", label: "Option 3" },
          ]}
          label="Radio Group (lg)"
          optionTextPosition={labelPosition}
          size="lg"
          variant={variant}
        />
      )}
    </div>
  );
};

export default RadioGroupVariants;
