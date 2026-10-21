import type { Lang } from "@/lib/i18n";
import type { PublicInvitation } from "@/lib/types";
import { Invitation } from "./invitation/Invitation";

/** Preview ham, namuna ham, ommaviy sahifa ham aynan shu komponentni ishlatadi. `gate` — ochilish ekrani (konvert, muhr va h.k.). */
export function InvitationView(props: { data: PublicInvitation; gate?: boolean; lang?: Lang; slug?: string; guest?: string; langHref?: string }) {
  return <Invitation {...props} />;
}
