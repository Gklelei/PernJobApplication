// components/DepartmentSelector.tsx
"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS } from "@/constants";

export default function DepartmentSelector() {
  const [selected, setSelected] = useState("");

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select a Department</h2>
      <RadioGroup
        value={selected}
        onValueChange={setSelected}
        className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2 border rounded-xl"
      >
        {DEPARTMENTS.map((dept) => (
          <div key={dept.value} className="flex items-center space-x-2">
            <RadioGroupItem value={dept.value} id={dept.value} />
            <Label htmlFor={dept.value}>{dept.name}</Label>
          </div>
        ))}
      </RadioGroup>
      {selected && (
        <div className="text-sm text-gray-500">
          You selected: <strong>{selected}</strong>
        </div>
      )}
    </div>
  );
}
