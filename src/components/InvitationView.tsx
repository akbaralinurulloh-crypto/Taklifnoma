import type { PublicInvitation } from "@/lib/types";
import { Invitation } from "./invitation/Invitation";

/** Preview ham, namuna ham, ommaviy sahifa ham aynan shu komponentni ishlatadi. `gate` — ochilish ekrani (konvert, muhr va h.k.). */
export function InvitationView({ data, gate = false }: { data: PublicInvitation; gate?: boolean }) {
  return <Invitation data={data} gate={gate} />;
}
