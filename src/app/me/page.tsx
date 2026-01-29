import RequireAuth from "@/app/components/RequireAuth";
import MeClient from "./MeClient";

export default function MePage() {
  return (
    <RequireAuth>
      <MeClient />
    </RequireAuth>
  );
}
