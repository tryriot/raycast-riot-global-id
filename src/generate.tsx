import { Form, ActionPanel, Action, Clipboard, showHUD, Icon, LaunchProps } from "@raycast/api";
import { useCachedState } from "@raycast/utils";
import { TYPES_MAP, ObjectType } from "@tryriot/global-id";
import { create } from "@tryriot/global-id";
import { useState, useEffect } from "react";

interface Arguments {
  objectType?: string;
  objectId?: string;
}

export default function Command({ arguments: args }: LaunchProps<{ arguments: Arguments }>) {
  const [uuid, setUUID] = useState(args.objectId || "");
  const [type, setType] = useCachedState("last-used-object-type", args.objectType || "");

  // Auto-copy when arguments provided and valid, or auto-paste UUID if no objectId argument
  useEffect(() => {
    if (args.objectType && args.objectId) {
      try {
        const globalId = create(args.objectType as ObjectType, args.objectId).toString();
        Clipboard.copy(globalId);
        showHUD("Global ID copied to clipboard");
      } catch {
        // If invalid, just show the form
      }
    } else if (!args.objectId) {
      // Auto-paste UUID from clipboard if no objectId argument provided
      Clipboard.readText().then((clipboardText) => {
        if (clipboardText && !uuid && clipboardText.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
          setUUID(clipboardText);
        }
      });
    }
  }, [args.objectType, args.objectId]);

  const types = Array.from(TYPES_MAP, ([number, value]) => ({ number, value })).sort((a, b) =>
    a.value > b.value ? 1 : b.value > a.value ? -1 : 0,
  );

  let globalIdFromUUID: string | undefined = undefined;
  let uuidError: Error | undefined = undefined;

  try {
    if (type && uuid) {
      globalIdFromUUID = create(type as ObjectType, uuid).toString();
    }
  } catch {
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
            <Action title="Copy GlobalId" icon={Icon.Clipboard} onAction={handleCopyGlobalId} />
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
          value={uuid}
          error={uuidError?.message}
          onChange={handleUUIDChanged}
        />

        <Form.Description title="Global ID" text={globalIdFromUUID || "-"} />
      </Form>
    </>
  );
}
