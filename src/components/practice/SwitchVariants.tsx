"use client";
import { useState } from "react";
import RadioGroup from "../common/RadioGroup";
import Switch from "../common/Switch";

const SwitchVariants = () => {
  const [switchChecked, setSwitchChecked] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const [labelPosition, setLabelPosition] = useState<"start" | "end">("start");

  const handleSwitchChange = (key: number, checked: boolean) => {
    setSwitchChecked((prev) => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="space-y-6 card  w-fit min-w-[300px] flex flex-col ">
      <h3 className="text-lg font-bold">Switch Variants</h3>

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
          <Switch
            size="sm"
            variant="contained"
            value={switchChecked[1]}
            onChange={(checked) => handleSwitchChange(1, checked)}
            label="Contained Switch (sm)"
            labelPosition={labelPosition}
          />
          <Switch
            size="md"
            variant="contained"
            value={switchChecked[2]}
            onChange={(checked) => handleSwitchChange(2, checked)}
            label="Contained Switch (md)"
            labelPosition={labelPosition}
          />
          <Switch
            size="lg"
            variant="contained"
            value={switchChecked[3]}
            onChange={(checked) => handleSwitchChange(3, checked)}
            label="Contained Switch (lg)"
            labelPosition={labelPosition}
          />
        </div>
      </div>

      {/* Outlined Variant */}
      <div>
        <h4 className="text-sm font-medium mb-5 text-primary">Outlined Variant</h4>
        <div className="space-y-4">
          <Switch
            size="sm"
            variant="outlined"
            value={switchChecked[4]}
            onChange={(checked) => handleSwitchChange(4, checked)}
            label="Outlined Switch (sm)"
            labelPosition={labelPosition}
          />
          <Switch
            size="md"
            variant="outlined"
            value={switchChecked[5]}
            onChange={(checked) => handleSwitchChange(5, checked)}
            label="Outlined Switch (md)"
            labelPosition={labelPosition}
          />
          <Switch
            size="lg"
            variant="outlined"
            value={switchChecked[6]}
            onChange={(checked) => handleSwitchChange(6, checked)}
            label="Outlined Switch (lg)"
            labelPosition={labelPosition}
          />
        </div>
      </div>
    </div>
  );
};

export default SwitchVariants;
