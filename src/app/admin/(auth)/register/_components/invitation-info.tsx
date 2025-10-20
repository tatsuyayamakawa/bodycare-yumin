import {
  getRoleBadgeColor,
  getRoleIcon,
  getRoleLabel,
  getRoleTextColor,
} from "../_lib/utils";

interface InvitationInfoProps {
  email: string;
  role?: string;
}

export default function InvitationInfo({ email, role }: InvitationInfoProps) {
  const RoleIcon = getRoleIcon(role);
  const textColor = getRoleTextColor(role);

  return (
    <section
      className={`mt-8 rounded-xl border p-6 ${getRoleBadgeColor(role)}`}
      aria-labelledby="invitation-info-heading"
    >
      <h2 id="invitation-info-heading" className="sr-only">
        招待情報
      </h2>
      <div className="mb-3 flex items-center justify-center">
        <RoleIcon className={`mr-2 h-5 w-5 ${textColor}`} />
        <p className={`text-sm font-medium ${textColor}`}>
          {getRoleLabel(role)}として招待されています
        </p>
      </div>
      <p className={`text-center text-sm ${textColor}`}>{email}</p>
    </section>
  );
}
