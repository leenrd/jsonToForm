import { useState } from "react";
import { Textarea } from "@/components/input";
import { Button } from "@/components/button";
import { Divider } from "@/components/divider";
import { jsonSchema, type JsonSchema } from "@/lib/input-schema";
import { useToast } from "@/lib/useToast";
import { Toaster } from "@/components/toaster";
import { isValidJSON } from "@/lib/is-valid-json";
import FormFactory from "@/components/form-factory";
import sample from "@/lib/sample.json";

function App() {
  const [schema, setSchema] = useState<JsonSchema | null>(null);
  const { toast } = useToast();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const value = (
      e.currentTarget.elements.namedItem("schema") as HTMLTextAreaElement | null
    )?.value;

    if (value === undefined) {
      const initToast = () =>
        toast({
          title: "Error",
          description: "Your form input is undefined",
          variant: "error",
        });

      initToast();
      return;
    }

    const validation = isValidJSON(value);
    if (!validation.success) {
      const initToast = () =>
        toast({
          title: "Error",
          description: "Your form input is not a valid JSON",
          variant: "error",
        });

      initToast();
      return;
    }

    const parsedSchema = jsonSchema.safeParse(validation.data);
    if (!parsedSchema.success) {
      const initToast = () =>
        toast({
          title: "Error",
          description: `Invalid schema: ${parsedSchema.error
            .flatten()
            .formErrors.join(", ")}`,
          variant: "error",
        });

      initToast();
      return;
    }

    const initToast = () =>
      toast({
        title: "Schema generated",
        variant: "info",
        description: "You can now view the form below",
      });
    initToast();
    setSchema(parsedSchema.data);
  };

  const handleCopySample = () => {
    const jsonString = JSON.stringify(sample, null, 2);
    const initToast = () =>
      toast({
        title: "Sample copied to clipboard",
        variant: "success",
        description:
          "You can now paste the sample JSON data to the input field.",
      });

    const errorToast = () =>
      toast({
        title: "Error",
        variant: "error",
        description: "Failed to copy sample to clipboard",
      });

    navigator.clipboard
      .writeText(jsonString)
      .then(() => {
        initToast();
      })
      .catch(() => {
        errorToast();
      });
  };

  return (
    <main className="grid grid-cols-4 text-white gap-11 relative">
      <section className="col-span-1 grid grid-rows-4 gap-4 border-r border-r-gray-700 w-96 h-full p-7 fixed left-0">
        <form className="row-span-3" onSubmit={onSubmit}>
          <h1 className="font-bold text-4xl mb-3">JsonToForm</h1>

          <Textarea
            placeholder="Enter json schema..."
            id="schema"
            className="h-72"
          />

          <div className="flex flex-col gap-4 mt-5">
            <Toaster />
            <Button type="submit">Generate</Button>
            <Button
              onClick={handleCopySample}
              variant="secondary"
              type="button"
            >
              Copy sample to clipboard
            </Button>
          </div>
        </form>
        <div className="row-span-1 flex items-end">
          <p className="text-sm text-gray-600">Made by Leenard Zarate | 🦖</p>
        </div>
      </section>

      {/* form display */}
      <section className="col-span-3 p-7 ml-96 w-full">
        <p className="text-lg">
          This is an exploratory project that uses the factory design pattern
          for React. It provides a set of consistent and elegant conditional
          logic to components, which are designed to instantiate different form
          component formats based on a json array of props.
        </p>
        <Divider>Form Display</Divider>

        <article>
          {schema !== null && (
            <FormFactory schema={schema} key={JSON.stringify(schema)} />
          )}
        </article>
      </section>
    </main>
  );
}

export default App;
