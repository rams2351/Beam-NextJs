import React from "react";

const Metadata: React.FC<{ seoTitle: string; seoDescription: string }> = ({ seoTitle, seoDescription }) => {
  return (
    <>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
    </>
  );
};

export default Metadata;
