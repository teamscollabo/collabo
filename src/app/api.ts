import axios from "axios";
import { LANGUAGE_VERSIONS } from "./constants/constants";

// Define what the API expects as input
interface ExecuteCodeParams {
  language: keyof typeof LANGUAGE_VERSIONS;
  sourceCode: string;
}

// Define the structure of the response (based on Piston API docs)
export interface ExecuteCodeResponse {
  run: {
    stdout: string;
    stderr: string;
    output: string;
    code: number;
    signal: string | null;
  };
  language: string;
  version: string;
}

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const executeCode = async ({
  language,
  sourceCode,
}: ExecuteCodeParams): Promise<ExecuteCodeResponse> => {
  const response = await API.post<ExecuteCodeResponse>("/execute", {
    language,
    version: LANGUAGE_VERSIONS[language],
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};
