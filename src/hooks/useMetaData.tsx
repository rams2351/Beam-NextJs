import _ from "lodash";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
const useMetaData = (title: string = process.env.NEXT_PUBLIC_APP_NAME, description?: string) => {
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("Descriptions Seo");

  const pathname = usePathname();

  useEffect(() => {
    const label = `${process.env.NEXT_PUBLIC_APP_NAME} | ${_.capitalize(pathname.split("/")[1])}`;

    setSeoTitle(label);

    if (description) {
      setSeoDescription(description);
    }
  }, [title, description, pathname]);

  return {
    seoDescription,
    seoTitle,
  };
};

export default useMetaData;
