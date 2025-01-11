import { Button } from "@/components/ui/button";
import Image from "next/image";
import Search from "@/components/search";
import FileUploader from "@/components/file-uploader";
import { signOutUser } from "@/lib/actions/user.action";

interface Props {
  accountId: string;
  $id: string;
}
const Header = ({ $id: userId, accountId }: Props) => {
  return (
    <header className="header">
      <Search />
      <div className="header-wrapper">
        <FileUploader ownerId={userId} accountId={accountId} />
        <form
          action={async () => {
            "use server";
            await signOutUser();
          }}
        >
          <Button type="submit" className="sign-out-button">
            <Image
              src="/assets/icons/logout.svg"
              alt="logo"
              width={24}
              height={24}
              className="w-6"
            />
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
