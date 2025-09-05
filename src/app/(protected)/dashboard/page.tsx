import SignOutButton from "@/components/auth/sign-out-button";
import { getCurrentUserAccountDoc } from "@/lib/actions/get-current-user-account-doc.action";
import { getCurrentUser } from "@/lib/actions/get-current-user.action";
import { publicFolder } from "@/lib/constants/public-folder";
import Image from "next/image";

export default async function Page() {
  const { currentUser } = await getCurrentUser();
  console.info(currentUser);

  const { accountDoc } = await getCurrentUserAccountDoc();
  console.info(accountDoc);

  return (
    <div>
      <header className="flex items-center justify-between gap-4 p-4">
        <h1>Dashboard</h1>
        <div className="flex items-center gap-4">
          <SignOutButton />
          <Image
            alt={
              currentUser?.picture
                ? "Profile picture"
                : "Profile picture placeholder"
            }
            className="border-default size-8 shrink-0 rounded-full border bg-gray-100"
            height={32}
            src={
              currentUser?.picture || publicFolder.images.profilePicturePlaceholder
            }
            width={32}
          />
        </div>
      </header>
    </div>
  );
}
