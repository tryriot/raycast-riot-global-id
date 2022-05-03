import { Form, ActionPanel, Action, showToast, Clipboard, Toast, showHUD } from "@raycast/api";
import { ObjectType, parse } from "@tryriot/global-id";
import { useRef, useState } from "react";

type Values = {
  globalId: string;
  objectType: string;
  objectId: string;
};

export default function Command() {
  const [globalId, setGlobalId] = useState('');

  const parsedGlobalId = parse(globalId);
  const isGlobalIdValid = parsedGlobalId.isOk();
  const objectTypeRef = parsedGlobalId.map((x) => x.type).into();
  const objectIdRef = parsedGlobalId.map((x) => x.id).into();

  function handleGlobalIdChanged(newValue: string) {
    setGlobalId(newValue)
  }

  async function handleCopyObjectId() {
    if (objectIdRef) {
      await Clipboard.copy(objectIdRef);
      await showHUD('Object ID copied to clipboard');
    }
  }

  async function handleCopyObjectType() {
    if (objectTypeRef) {
      await Clipboard.copy(objectTypeRef);
      await showHUD('Object type copied to clipboard');
    }
  }

  // function handleSubmit(values: Values) {
  //   console.log(values);
  //   showToast({ title: "Submitted form", message: "See logs for submitted values" });
  // }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action
            title="Copy Object ID"
            onAction={handleCopyObjectId}
          />
          <Action
            title="Copy Object Type"
            onAction={handleCopyObjectType}
          />
        </ActionPanel>
      }
    >
      <Form.Description text="Enter a Riot Global ID to introspect its content." />
      <Form.TextField id="globalId" title="Global ID" placeholder="Enter a Global ID from the Riot platform" onChange={handleGlobalIdChanged} />
      <Form.Separator />
      <Form.Description title="Object Type" text={objectTypeRef || '-'} />
      <Form.Description title="Object ID" text={objectIdRef || '-'} />
    </Form>
  );
}
