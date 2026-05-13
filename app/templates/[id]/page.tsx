import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TemplateEditor } from "@/components/templates/template-editor";
import { getSeedTemplateParams, getTemplateForSlug } from "@/lib/catalog";

type TemplatePageProps = {
  params: {
    id: string;
  };
};

export const dynamicParams = true;

export function generateStaticParams() {
  return getSeedTemplateParams();
}

export async function generateMetadata({ params }: TemplatePageProps) {
  const template = await getTemplateForSlug(params.id);

  if (!template) {
    return {
      title: "Template not found | Wemplate",
    };
  }

  return {
    title: `${template.name} preview | Wemplate`,
    description: template.concept,
  };
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const template = await getTemplateForSlug(params.id);

  if (!template) {
    notFound();
  }

  return (
    <main>
      <div className="container-px mx-auto max-w-7xl pt-5">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-md border border-line bg-white/[0.055] px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-cobalt hover:bg-white/[0.09]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Wemplate
        </Link>
      </div>
      <TemplateEditor template={template} />
    </main>
  );
}
