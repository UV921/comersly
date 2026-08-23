import { PageHeader } from "@/components/workspace/page-header";
import { UploadForm } from "@/components/workspace/upload-form";

export default function UploadPage() {
  return (
    <>
      <PageHeader
        title="Upload products"
        description="Upload product data and Comersly will identify, verify and enrich each product."
      />
      <UploadForm />
    </>
  );
}
