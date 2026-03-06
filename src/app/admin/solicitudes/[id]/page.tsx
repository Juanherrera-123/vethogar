import { redirect } from "next/navigation";

export default function AdminSolicitudLegacyRedirectPage({
  params,
}: {
  params: { id: string };
}) {
  const encodedId = encodeURIComponent(params.id);
  redirect(`/admin/solicitudes?review=${encodedId}`);
}
