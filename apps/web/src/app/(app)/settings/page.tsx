import { getSession } from "@/lib/auth/session";
import { getDeveloperByWallet } from "@/lib/db/developers";
import { SettingsForm } from "@/components/Settings/SettingsForm";

export const metadata = {
  title: "Settings — PayGate",
};

export default async function SettingsPage() {
  const session = await getSession();
  const developer = await getDeveloperByWallet(session.stellarWallet);

  return (
    <SettingsForm
      stellarWallet={session.stellarWallet}
      email={developer?.email ?? null}
      name={developer?.name ?? null}
      bio={developer?.bio ?? null}
      twitter={developer?.twitter ?? null}
      github={developer?.github ?? null}
      developerId={session.developerId}
      createdAt={developer?.createdAt ?? new Date()}
    />
  );
}
