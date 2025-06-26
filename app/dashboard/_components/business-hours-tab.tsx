import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessHours } from "@/utils/types";

interface BusinessHoursTabProps {
  initialBusinessHours: BusinessHours;
  onSave: (newBusinessHours: BusinessHours) => void;
}

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const BusinessHoursTab: React.FC<BusinessHoursTabProps> = ({
  initialBusinessHours,
  onSave,
}) => {
  const [businessHours, setBusinessHours] =
    useState<BusinessHours>(initialBusinessHours);

  useEffect(() => {
    setBusinessHours(initialBusinessHours);
  }, [initialBusinessHours]);

  const handleDayToggle = (day: keyof BusinessHours) => {
    setBusinessHours((prev: BusinessHours) => ({
      ...prev,
      [day]: { ...prev[day], isOpen: !prev[day].isOpen },
    }));
  };

  const handleTimeChange = (
    day: keyof BusinessHours,
    field: "start" | "end",
    value: string
  ) => {
    setBusinessHours((prev: BusinessHours) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="flex items-center justify-between p-2 border rounded-md"
          >
            <span className="capitalize">{day}</span>
            <div className="flex items-center space-x-4">
              <Switch
                checked={businessHours[day as keyof BusinessHours].isOpen}
                onCheckedChange={() =>
                  handleDayToggle(day as keyof BusinessHours)
                }
              />
              {businessHours[day as keyof BusinessHours].isOpen && (
                <>
                  <Input
                    type="time"
                    value={businessHours[day as keyof BusinessHours].start}
                    onChange={(e) =>
                      handleTimeChange(
                        day as keyof BusinessHours,
                        "start",
                        e.target.value
                      )
                    }
                    className="w-32"
                  />
                  <Input
                    type="time"
                    value={businessHours[day as keyof BusinessHours].end}
                    onChange={(e) =>
                      handleTimeChange(
                        day as keyof BusinessHours,
                        "end",
                        e.target.value
                      )
                    }
                    className="w-32"
                  />
                </>
              )}
            </div>
          </div>
        ))}
        <Button onClick={() => onSave(businessHours)}>Save Changes</Button>
      </CardContent>
    </Card>
  );
};

export default BusinessHoursTab;
