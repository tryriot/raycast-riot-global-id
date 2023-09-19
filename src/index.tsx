import { Form, ActionPanel, Action, Clipboard, showHUD } from "@raycast/api";
import { parse } from "@tryriot/global-id";
import { useState } from "react";

export default function Command() {
  const [globalIdError, setGlobalIdError] = useState<Error>();

  const [objectType, setObjectType] = useState<string>();
  const [objectId, setObjectId] = useState<string>();

  function handleGlobalIdChanged(newValue: string) {
    if (newValue.length === 0) {
      setGlobalIdError(undefined);
      return;
    }

    try {
      const result = parse(newValue);
      if (result.isOk()) {
        const unwrapped = result.unwrap();
        setObjectType(unwrapped.type);
        setObjectId(unwrapped.id);
        setGlobalIdError(undefined);
      } else {
        setObjectType(undefined);
        setObjectId(undefined);
        setGlobalIdError(new Error("Wrong Global ID format"));
      }
    } catch (err) {
      setObjectType(undefined);
      setObjectId(undefined);
      setGlobalIdError(new Error("Wrong Global ID format"));
    }
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
