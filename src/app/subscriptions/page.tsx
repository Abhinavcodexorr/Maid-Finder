import { PageHeader } from "@/components/layout/page-header";

const plans = [
  { name: "Basic", price: "AED 49", features: ["10 profile views", "Basic filters"] },
  { name: "Pro", price: "AED 99", features: ["Unlimited views", "Priority support"] },
  { name: "Premium", price: "AED 149", features: ["Verified shortlist", "Concierge help"] },
];

export default function SubscriptionsPage() {
  return (
    <>
      <PageHeader title="Subscriptions" subtitle="Choose the right package for your hiring needs." />
      <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.name} className="card">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-2xl font-extrabold text-brand">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {plan.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button className="btn btn-primary mt-6 w-full">Choose Plan</button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
