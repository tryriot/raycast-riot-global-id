import { Form, ActionPanel, Action, Clipboard, showHUD, Icon, LaunchProps } from "@raycast/api";
import { parse } from "@tryriot/global-id";
import { useState, useEffect } from "react";

interface Arguments {
  globalId?: string;
}

export default function Command({ arguments: args }: LaunchProps<{ arguments: Arguments }>) {
  const [globalId, setGlobalId] = useState(args.globalId || "");

  // Auto-copy when arguments provided and valid
  useEffect(() => {
    if (args.globalId) {
      try {
        const result = parse(args.globalId);
        const { id } = result.unwrap();
        Clipboard.copy(id);
        showHUD("Object ID copied to clipboard");
      } catch {
        // If invalid, just show the form
      }
    }
  }, [args.globalId]);

  let globalIdError: Error | undefined = undefined;
  let objectType: string | undefined = undefined;
  let objectId: string | undefined = undefined;

  if (globalId) {
    try {
      const result = parse(globalId);
      const { type, id } = result.unwrap();
      objectType = type;
      objectId = id;
    } catch {
      objectType = undefined;
      objectId = undefined;
      globalIdError = new Error("Wrong Global ID format");
    }
  }

  function handleGlobalIdChanged(newValue: string) {
    setGlobalId(newValue);
  }

  async function handleCopyObjectId() {
    if (objectId) {
      await Clipboard.copy(objectId);
      await showHUD("Object ID copied to clipboard");
    }
  }

  async function handleCopyObjectType() {
    if (objectType) {
      await Clipboard.copy(objectType);
      await showHUD("Object type copied to clipboard");
    }
  }

  return (
    <>
      <Form
        actions={
          <ActionPanel>
            {objectId ? (
              <Action title="Copy Object ID" icon={Icon.Clipboard} onAction={handleCopyObjectId} />
            ) : null}
            {objectType ? (
              <Action title="Copy Object Type" icon={Icon.Clipboard} onAction={handleCopyObjectType} />
            ) : null}
          </ActionPanel>
        }
      >
        <Form.TextField
          id="globalId"
          title="Global ID"
          placeholder="QI3FFpMnX5DDpvMj4qc4goZ"
          value={globalId}
          error={globalIdError?.message}
          onChange={handleGlobalIdChanged}
        />
        <Form.Description title="Object Type" text={objectType || "-"} />
        <Form.Description title="Object ID" text={objectId || "-"} />
      </Form>
    </>
  );
}
