import { Form, ActionPanel, Action, Clipboard, showHUD } from "@raycast/api";
import { parse } from "@tryriot/global-id";
import { useState } from "react";

export default function Command() {
  const [globalId, setGlobalId] = useState("");

  let globalIdError: Error | undefined = undefined;
  let objectType: string | undefined = undefined;
  let objectId: string | undefined = undefined;

  if (globalId) {
    try {
      const result = parse(globalId);
      const { type, id } = result.unwrap();
      objectType = type;
      objectId = id;
    } catch (err) {
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
            <Action title="Copy Object ID" onAction={handleCopyObjectId} />
            <Action title="Copy Object Type" onAction={handleCopyObjectType} />
          </ActionPanel>
        }
      >
        <Form.TextField
          id="globalId"
          title="Global ID"
          placeholder="QI3FFpMnX5DDpvMj4qc4goZ"
          error={globalIdError?.message}
          onChange={handleGlobalIdChanged}
        />
        <Form.Description title="Object Type" text={objectType || "-"} />
        <Form.Description title="Object ID" text={objectId || "-"} />
      </Form>
    </>
  );
}
