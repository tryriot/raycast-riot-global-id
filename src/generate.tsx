import { Form, ActionPanel, Action, Clipboard, showHUD } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { TYPES_MAP, ObjectType } from "@tryriot/global-id";
import { create } from "@tryriot/global-id";
import { useState } from "react";

export default function Command() {
  const [uuid, setUUID] = useState("");
  const [type, setType] = useCachedState("last-used-object-type", "");

  const types = Array.from(TYPES_MAP, ([number, value]) => ({ number, value })).sort((a, b) =>
    a.value > b.value ? 1 : b.value > a.value ? -1 : 0
  );

  let globalIdFromUUID: string | undefined = undefined;
  let uuidError: Error | undefined = undefined;

  try {
    if (type && uuid) {
      globalIdFromUUID = create(type as ObjectType, uuid).toString();
    }
  } catch (err) {
    uuidError = new Error("Wrong UUID format");
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
            <Action title="Copy GlobalId" onAction={handleCopyGlobalId} />
          </ActionPanel>
        }
      >
        <Form.Dropdown
          id="type"
          title="Object Type"
          placeholder="Choose a Type"
          value={type}
          onChange={handleTypeChanged}
        >
          {types.map(({ number, value }) => {
            return <Form.Dropdown.Item key={number} value={value} title={`${value} (${number.toString()})`} />;
          })}
        </Form.Dropdown>

        <Form.TextField
          id="uuid"
          title="Object ID"
          placeholder="56717c31-9b5a-4678-8c77-e7a62fde350c"
          error={uuidError?.message}
          onChange={handleUUIDChanged}
        />

        <Form.Description title="Global ID" text={globalIdFromUUID || "-"} />
      </Form>
    </>
  );
}
