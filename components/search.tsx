"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getFile } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Thumbnail from "@/components/thumbnail";
import FormattedDateTime from "@/components/formatted-date-time";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [query, setquery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const router = useRouter();
  const [results, setresults] = useState<Models.Document[]>([]);
  const path = usePathname();
  const [open, setopen] = useState(false);
  const [debounceQuery] = useDebounce(query, 300);

  useEffect(() => {
    const fetchFiles = async () => {
      if (debounceQuery.length === 0) {
        setresults([]);
        setopen(false);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFile({
        types: [],
        searchText: debounceQuery,
      });
      setresults(files.documents);
      setopen(true);
    };

    fetchFiles();
  }, [debounceQuery]);
  useEffect(() => {
    if (!searchQuery) {
      setquery("");
    }
    console.log(searchQuery);
  }, [setquery]);

  const handleClickSearch = (item: Models.Document) => {
    setopen(false);
    setresults([]);

    router.push(
      `/${
        item.type === "video" || item.type === "audio"
          ? "media"
          : item.type + "s"
      }?query=${query}`,
    );
  };
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setquery(e.target.value)}
        />

        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((item) => (
                <li
                  key={item.$id}
                  className="flex items-center justify-between"
                  onClick={() => handleClickSearch(item)}
                >
                  <div
                    className="flex cursor-pointer items-center
                gap-4"
                  >
                    <Thumbnail
                      type={item.type}
                      extension={item.extension}
                      url={item.url}
                      className="size-9 min-w-9"
                    />
                    {item.name}
                  </div>
                  <FormattedDateTime
                    date={item.$createdAt}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No file found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
