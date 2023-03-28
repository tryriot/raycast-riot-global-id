import { Form, ActionPanel, Action, Clipboard, showHUD } from "@raycast/api";
import { parse, TYPES_MAP, ObjectType } from "@tryriot/global-id";
import { v1 } from "@tryriot/global-id/build/main/lib/v1";
import { useState } from "react";

export default function Command() {
  const [globalId, setGlobalId] = useState("");
  const [uuid, setUUID] = useState("");
  const [type, setType] = useState("");

  const types = Array.from(TYPES_MAP, ([number, value]) => ({ number, value })).sort((a, b) =>
    a.value > b.value ? 1 : b.value > a.value ? -1 : 0
  );

  const parsedGlobalId = parse(globalId);
  const objectTypeRef = parsedGlobalId.map((x) => x.type).into();
  const objectIdRef = parsedGlobalId.map((x) => x.id).into();

  let globalIdFromUUID = "";

  try {
    if (type && uuid) {
      globalIdFromUUID = v1(type as ObjectType, uuid).toString();
    }
  } catch (error) {
    globalIdFromUUID = "Not a uuid";
  }

  function handleGlobalIdChanged(newValue: string) {
    setGlobalId(newValue);
  }

  function handleUUIDChanged(newValue: string) {
    setUUID(newValue);
  }

  function handleTypeChanged(newValue: string) {
    setType(newValue);
  }

  async function handleCopyObjectId() {
    if (objectIdRef) {
      await Clipboard.copy(objectIdRef);
      await showHUD("Object ID copied to clipboard");
    }
  }

  async function handleCopyObjectType() {
    if (objectTypeRef) {
      await Clipboard.copy(objectTypeRef);
      await showHUD("Object type copied to clipboard");
    }
  }

  async function handleCopyGlobalId() {
    if (globalIdFromUUID) {
      await Clipboard.copy(globalIdFromUUID);
      await showHUD("Global ID copied to clipboard");
    }
  }

  return (
    <>
      <Form
        actions={
          <ActionPanel>
            <Action title="Copy Object ID" onAction={handleCopyObjectId} />
            <Action title="Copy Object Type" onAction={handleCopyObjectType} />
            <Action
              title="Copy GlobalId"
              onAction={handleCopyGlobalId}
              shortcut={{ modifiers: ["cmd"], key: "delete" }}
            />
          </ActionPanel>
        }
      >
        <Form.TextField
          id="globalId"
          title="Global ID"
          placeholder="Enter a Global ID"
          onChange={handleGlobalIdChanged}
        />
        <Form.Description title="Object Type" text={objectTypeRef || "-"} />
        <Form.Description title="Object ID" text={objectIdRef || "-"} />

        <Form.Separator />

        <Form.TextField id="uuid" title="Object ID" placeholder="Enter an Object ID" onChange={handleUUIDChanged} />
        <Form.Dropdown
          id="type"
          title="Object Type"
          placeholder="Choose a Type"
          onChange={handleTypeChanged}
          defaultValue="Campaign"
        >
          {types.map(({ number, value }) => {
            return <Form.Dropdown.Item key={number} value={value} title={`${value} (${number.toString()})`} />;
          })}
        </Form.Dropdown>
        <Form.Description title="Global ID" text={globalIdFromUUID || "-"} />
      </Form>
    </>
  );
}
