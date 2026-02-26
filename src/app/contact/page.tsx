import { PageHeader } from "@/components/layout/page-header";

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact Us" subtitle="We are here to help families and maids." />
      <section className="mx-auto mt-8 max-w-3xl px-4 sm:px-6">
        <div className="card">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="field" placeholder="Full Name" />
            <input className="field" placeholder="Email Address" />
            <input className="field md:col-span-2" placeholder="Subject" />
            <textarea className="field min-h-32 md:col-span-2" placeholder="Your message..." />
          </div>
          <button className="btn btn-primary mt-4">Send Message</button>
        </div>
      </section>
    </>
  );
}
