import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/auth/admin";
import { logout } from "@/lib/auth/actions";
import { getContent, isWritable } from "@/lib/content/store";
import { Editor } from "./_components/Editor";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const email = await getSessionEmail();
  if (!email) redirect("/dashboard/login");

  const content = await getContent();
  const writable = isWritable();
  const storageNotice =
    "Changes here won't be saved: this deployment has no writable storage configured yet. Add a Vercel Blob store and set BLOB_READ_WRITE_TOKEN (see README), then redeploy.";

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <h1 className="text-h2 text-fg">Dashboard</h1>
          <p className="text-small text-fg-muted mt-1">Signed in as {email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm text-fg hover:border-caramel hover:text-caramel"
          >
            Log out
          </button>
        </form>
      </header>

      <Editor initialContent={content} writable={writable} storageNotice={storageNotice} />
    </div>
  );
}
