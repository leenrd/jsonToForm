import { FC, useState } from "react";
import { type JsonSchema } from "@/lib/input-schema";
import { Toaster } from "./toaster";
import { useToast } from "@/lib/useToast";
import { Input } from "./forms/input";
import { Label } from "./forms/label";
import { RequiredStar } from "./forms/required-star";
import { Select } from "./forms/select";
import { Button } from "./button";

interface FormFactoryProps {
  schema: JsonSchema;
}

const FormFactory: FC<FormFactoryProps> = ({ schema }) => {
  const [formData, setFormData] = useState(
    schema.reduce((acc, field) => {
      if (field.defaultValue !== undefined) {
        acc[field.id] = field.defaultValue;
      }
      return acc;
    }, {} as Record<string, string | number | boolean>)
  );

  const { toast } = useToast();

  const handleChange = (id: string, type: string) => {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let value: string | number | boolean;

      switch (type) {
        case "number":
          value = (event.target as HTMLInputElement).valueAsNumber;
          break;
        case "boolean":
          value = (event.target as HTMLInputElement).checked;
          break;
        default:
          value = event.target.value;
      }

      setFormData({
        ...formData,
        [id]: value,
      });
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const initToast = () =>
      toast({
        title: "Form submitted",
        description: JSON.stringify(formData, null, 2),
        variant: "success",
      });

    initToast();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 py-24">
        <Toaster />
        {schema.map((field) => {
          switch (field.type) {
            case "string":
            case "number":
              return (
                <Input.Group key={field.id}>
                  <Label required={field.required} htmlFor={field.id}>
                    {field.label}
                    {field.required && <RequiredStar />}
                  </Label>

                  <Input
                    id={field.id}
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    defaultValue={field.defaultValue}
                    onChange={handleChange(field.id, field.type)}
                  />
                </Input.Group>
              );
            case "boolean":
              return (
                <Input.Group key={field.id}>
                  <Label required={field.required} htmlFor={field.id}>
                    {field.label}
                    {field.required && <RequiredStar />}
                  </Label>

                  <Input
                    id={field.id}
                    type="checkbox"
                    defaultChecked={field.defaultValue}
                    onChange={handleChange(field.id, field.type)}
                  />
                </Input.Group>
              );
            case "select":
              return (
                <Input.Group key={field.id}>
                  <Label required={field.required} htmlFor={field.id}>
                    {field.label}
                    {field.required && <RequiredStar />}
                  </Label>

                  <Select
                    id={field.id}
                    required={field.required}
                    defaultValue={
                      field.defaultValue ?? field.options.at(0)?.value
                    }
                    onChange={handleChange(field.id, field.type)}
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Input.Group>
              );
            default:
              return null;
          }
        })}
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
};

export default FormFactory;
