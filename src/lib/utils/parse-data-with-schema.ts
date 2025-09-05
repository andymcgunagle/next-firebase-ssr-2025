import { z } from "zod";

/**
 * - Validates data against a Zod schema and throws detailed errors if validation fails.
 * - By default, `z.parse()` removes extra properties not defined in the schema. Use `.passthrough()` to keep them.
 * - Errors are formatted for improved readability.
 *
 * @param params - Object containing the schema and data to validate
 * @throws {ZodError | Error} - Throws detailed validation errors or the original error
 * @returns {T} - Returns the validated data if successful
 */
export function parseDataWithSchema<T>({
  schema,
  data,
}: {
  schema: z.Schema<T>;
  data: T;
}): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.issues
        .map(
          ({ code, message, path, input }) =>
            `- ${path.join(".")}: ${message} (code: ${code}, input: ${JSON.stringify(input)})`,
        )
        .join("\n\n");

      throw new Error(`Data validation failed:\n\n${formattedErrors}`);
    } else {
      throw error;
    }
  }
}
