import { defineConfig } from "orval";

const API_SPEC = process.env.ORVAL_INPUT ?? "http://127.0.0.1:3333/json"

export default defineConfig({
  "decode-gov-api": {
    input: {
      target: API_SPEC,
      override: {
        transformer: "./orval/transform-spec.cjs",
      },
    },
    output: {
      mode: "tags-split",
      target: "./src/api/generated/endpoints",
      schemas: "./src/api/generated/model",
      client: "react-query",
      httpClient: "axios",
      formatter: 'prettier',
      clean: true,
      override: {
        mutator: {
          path: "./src/lib/api-mutator.ts",
          name: "customInstance",
        },
        query: {
          signal: true,
          useQuery: true,
          useMutation: true,
          useInvalidate: true,
          options: {
            staleTime: 10_000,
          },
        },
      },
    },
  },

  "decode-gov-zod": {
    input: {
      target: API_SPEC,
      override: {
        transformer: "./orval/transform-spec.cjs",
      },
    },
    output: {
      mode: "tags-split",
      target: "./src/api/generated/zod",
      client: "zod",
      fileExtension: ".zod.ts",
      formatter: 'prettier',
      clean: true,
      override: {
        zod: {
          strict: {
            response: false,
            query: true,
            param: true,
            header: true,
            body: false,
          },
          coerce: {
            query: ["string", "boolean", "date"],
            param: ["string", "boolean", "date"],
            body: false,
            response: false,
            header: false
          },
        },
      },
    },
  },
})
