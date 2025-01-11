import Sort from "@/components/sort";
import { getFile } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Card from "@/components/card";
import { getFileTypesParams } from "@/lib/utils";

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = (await params)?.type as string | "";
  const searchText = (await searchParams)?.query as string | "";
  const sort = (await searchParams)?.sort as string | "";
  const types = getFileTypesParams(type);
  const data = await getFile({ types, searchText, sort });
  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total : <span className="h5"> 0 MB</span>
          </p>
          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort By:</p>
            <Sort />
          </div>
        </div>
      </section>

      {/*render file*/}

      {data.total > 0 ? (
        <section className="file-list">
          {data.documents.map((file: Models.Document) => (
            <Card file={file} key={file.$id} />
          ))}
        </section>
      ) : (
        <p className="empty-list"> No File !</p>
      )}
    </div>
  );
};

export default Page;
