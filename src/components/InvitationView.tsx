import type { PublicInvitation } from "@/lib/types";
import type { Design } from "@/lib/schema";
import Classic from "./templates/Classic";
import Romantic from "./templates/Romantic";
import National from "./templates/National";
import Minimalist from "./templates/Minimalist";
import Modern from "./templates/Modern";
import Luxury from "./templates/Luxury";
import Registon from "./templates/Registon";
import Bahor from "./templates/Bahor";
import Tun from "./templates/Tun";
import Chipta from "./templates/Chipta";

const TEMPLATES: Record<Design, (p: { data: PublicInvitation }) => React.ReactElement> = {
  classic: Classic,
  romantic: Romantic,
  national: National,
  minimalist: Minimalist,
  modern: Modern,
  luxury: Luxury,
  registon: Registon,
  bahor: Bahor,
  tun: Tun,
  chipta: Chipta,
};

/** Preview ham, ommaviy sahifa ham aynan shu komponentni ishlatadi. */
export function InvitationView({ data }: { data: PublicInvitation }) {
  const Template = TEMPLATES[data.design];
  return <Template data={data} />;
}
