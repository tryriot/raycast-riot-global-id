import { Form, ActionPanel, Action, Clipboard, showHUD } from "@raycast/api";
import { TYPES_MAP, ObjectType } from "@tryriot/global-id";
import { create } from "@tryriot/global-id";
import { useState } from "react";

export default function Command() {
  const [uuid, setUUID] = useState("");
  const [type, setType] = useState("");

  const types = Array.from(TYPES_MAP, ([number, value]) => ({ number, value })).sort((a, b) =>
    a.value > b.value ? 1 : b.value > a.value ? -1 : 0
  );

  let globalIdFromUUID = "";

  try {
    if (type && uuid) {
      globalIdFromUUID = create(type as ObjectType, uuid).toString();
    }
  } catch (error) {
    globalIdFromUUID = "Not an uuid";
  }

  function handleUUIDChanged(newValue: string) {
    setUUID(newValue);
  }

  function handleTypeChanged(newValue: string) {
    setType(newValue);
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
            <Action
              title="Copy GlobalId"
              onAction={handleCopyGlobalId}
              shortcut={{ modifiers: ["cmd"], key: "delete" }}
            />
          </ActionPanel>
        }
      >
        <Form.Dropdown
          id="type"
          title="Object Type"
          placeholder="Choose a Type"
          onChange={handleTypeChanged}
        >
          {types.map(({ number, value }) => {
            return <Form.Dropdown.Item key={number} value={value} title={`${value} (${number.toString()})`} />;
          })}
        </Form.Dropdown>

        <Form.TextField id="uuid" title="Object ID" placeholder="Enter an Object ID" onChange={handleUUIDChanged} />

        <Form.Description title="Global ID" text={globalIdFromUUID || "-"} />
      </Form>
    </>
  );
}
