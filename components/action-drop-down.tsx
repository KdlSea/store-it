"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constant";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  deleteFile,
  renameFile,
  updateFileUsers,
} from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails, ShareInput } from "@/components/file-detail";

const ActionDropDown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setisModalOpen] = useState(false);

  const [isDropDown, setisDropDown] = useState(false);

  const [action, setaction] = useState<ActionType | null>(null);

  const [name, setName] = useState(file.name);

  const [loading, setloading] = useState(false);

  const path = usePathname();

  const [email, setemail] = useState<string[]>([]);

  const closeAllModal = () => {
    setisModalOpen(false);
    setisDropDown(false);
    setaction(null);
    setName(file.name);
    setloading(false);
  };

  const handleAction = async () => {
    if (!action) return;
    setloading(true);
    let success = false;

    const actions = {
      rename: () =>
        renameFile({
          fileId: file.$id,
          name,
          extension: file.extension,
          path: path,
        }),
      share: async () => {
        const success = await updateFileUsers({
          fileId: file.$id,
          emails: email,
          path,
        });
        if (success) setloading(false);
      },
      delete: () => {
        deleteFile({
          fileId: file.$id,
          bucketFileId: file.bucketFileId,
          path,
        });
      },
    };

    success = await actions[action.value as keyof typeof actions]();

    if (success) closeAllModal();
  };

  const handleRemoveUser = async (emails: string) => {
    const updatedEmailsArr = email.filter((e) => e !== emails);

    const success = await updateFileUsers({
      fileId: file.$id,
      emails: updatedEmailsArr,
      path,
    });

    if (success) setemail(updatedEmailsArr);
    closeAllModal();
  };

  const renderDialogContent = () => {
    if (!action) return null;
    const { value, label } = action;
    return (
      <DialogContent className="shad-dialog-button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setemail}
              onRemove={handleRemoveUser}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{" "}
              <span className="delete-file-name">{file.name}</span>
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter
            className="flex flex-col gap-3
          md:flex-row"
          >
            <Button onClick={closeAllModal} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {loading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setisModalOpen}>
      <DropdownMenu open={isDropDown} onOpenChange={setisDropDown}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            width={34}
            height={34}
            alt="dots"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel
            className="max-w-[200px]
          truncate"
          >
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((action) => (
            <DropdownMenuItem
              key={action.value}
              className="shad-dropdown-item"
              onClick={() => {
                setaction(action);
                if (
                  ["rename", "share", "delete", "details"].includes(
                    action.value,
                  )
                ) {
                  setisModalOpen(true);
                }
              }}
            >
              {action.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <Image
                    src={action.icon}
                    alt={action.label}
                    height={30}
                    width={30}
                  />
                  {action.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src={action.icon}
                    alt={action.label}
                    height={30}
                    width={30}
                  />
                  {action.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropDown;
