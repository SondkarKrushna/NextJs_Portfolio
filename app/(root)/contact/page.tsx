import { Metadata } from "next";

import PageContainer from "@/components/common/page-container";
import Interactive3DModelWrapper from "@/components/contact/interactive-3d-model-wrapper";
import { ContactForm } from "@/components/forms/contact-form";
import { pagesConfig } from "@/config/pages";

export const metadata: Metadata = {
  title: pagesConfig.contact.metadata.title,
  description: pagesConfig.contact.metadata.description,
};

export default function ContactPage() {
  return (
    <PageContainer
      title={pagesConfig.contact.title}
      description={pagesConfig.contact.description}
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="flex-1">
          <ContactForm />
        </div>
        <div className="flex-1 flex justify-center items-start lg:sticky lg:top-24">
          <Interactive3DModelWrapper />
        </div>
      </div>
    </PageContainer>
  );
}
