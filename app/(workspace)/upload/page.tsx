import { PageHeader } from "@/components/workspace/page-header";
import { UploadForm } from "@/components/workspace/upload-form";

export default function UploadPage() {
  return (
    <>
      <PageHeader
        title="Upload"
        description="One CSV or XLSX. Each row becomes a product, then moves through interpret, classify, enrich, and export."
      />
      <UploadForm />
    </>
  );
}
