import { requireAdmin } from "../../lib/requrieAdmin";
import UsersAccordion from "../components/accordion";

export default async function AdminPage() {
  await requireAdmin();

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "auto" }}>
      <h1>Admin – Users</h1>
      <UsersAccordion />
    </div>
  );
}
