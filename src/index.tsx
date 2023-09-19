import { Form, ActionPanel, Action, Clipboard, showHUD } from "@raycast/api";
import { GlobalIdInterface, parse } from "@tryriot/global-id";
import { useState } from "react";

export default function Command() {
  const [globalId, setGlobalId] = useState("");

  let parsedGlobalId: GlobalIdInterface | undefined;
  let objectType: string | undefined;
  let objectId: string | undefined;

  try {
    const result = parse(globalId);
    parsedGlobalId = result.into();
    objectType = parsedGlobalId?.type;
    objectId = parsedGlobalId?.value;
  } catch (err) {
    // Do nothing
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
          placeholder="Enter a Global ID"
          onChange={handleGlobalIdChanged}
        />
        <Form.Description title="Object Type" text={objectType || "-"} />
        <Form.Description title="Object ID" text={objectId || "-"} />
      </Form>
    </>
  );
}
