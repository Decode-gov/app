import { defineConfig } from "orval";

const API_SPEC = process.env.ORVAL_INPUT ?? "http://127.0.0.1:3333/json"

export default defineConfig({
  "decode-gov-api": {
    input: {
      target: API_SPEC,
    },
    output: {
      mode: "tags-split",
      target: "./src/api/generated/endpoints",
      schemas: {
        path: "./src/api/generated/model",
        type: 'zod'
      },
      client: "react-query",
      httpClient: "axios",
      formatter: 'prettier',
      clean: false,
      override: {
        mutator: {
          path: "./src/lib/api-mutator.ts",
          name: "customInstance",
        },
        query: {
          useInvalidate: true,
        },
      },
    },
  },

  "decode-gov-zod": {
    input: {
      target: API_SPEC,
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
            body: true,
          },
          coerce: {
            query: ["string", "boolean", "date"],
            param: ["string", "boolean", "date"],
            body: true,
            response: false,
            header: true
          },
        },
      },
    },
  },
})
