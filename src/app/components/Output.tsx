import { useState } from "react";
import type * as monaco from "monaco-editor";
import { executeCode, type ExecuteCodeResponse } from "../api";
import type { Language } from "../constants/constants";

interface OutputProps {
  editorRef: React.RefObject<monaco.editor.IStandaloneCodeEditor | null>;
  language: Language;
}

const Output: React.FC<OutputProps> = ({ editorRef, language }) => {
  const [output, setOutput] = useState<ExecuteCodeResponse["run"] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const result: ExecuteCodeResponse = await executeCode({ language, sourceCode });
      setOutput(result.run);
      setIsError(!!result.run.stderr);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
      setIsError(true);
      setOutput(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 mx-4">
        <button
          onClick={runCode}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-green-500 rounded text-green-500 hover:bg-green-500 hover:text-black cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Running..." : "Run Code"}
        </button>
      </div>

      <div
        className={`h-[75vh] p-2 border rounded overflow-auto ${
          isError ? "border-red-500 text-red-400" : "border-gray-800 text-gray-400"
        }`}
      >
        {output ? (
          <>
            {output.stdout && <pre className="mb-2">Stdout: {output.stdout}</pre>}
            {output.stderr && <pre className="mb-2">Stderr: {output.stderr}</pre>}
            {output.output && <pre className="mb-2">Output: {output.output}</pre>}
          </>
        ) : (
          <p>Click &quot;Run Code&quot; to see the output here</p>
        )}
      </div>
    </div>
  );
};

export default Output;
