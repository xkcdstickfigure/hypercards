import { Page } from "../components/Page.tsx";
import { Card } from "../components/Card.tsx";
import ActivateForm from "../islands/ActivateForm.tsx";

export default () => {
  return (
    <Page title="Activate Hypercard">
      <Card>1024</Card>
      <ActivateForm />
    </Page>
  );
};
