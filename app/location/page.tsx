import StaticPageLayout from "@/components/StaticPageLayout";

const zones = [
  { area: "Nairobi Metro", eta: "Same day - 24 hrs", fee: "From KES 500" },
  { area: "Central Region", eta: "1 - 2 business days", fee: "From KES 900" },
  { area: "Rift Valley", eta: "1 - 3 business days", fee: "From KES 1,100" },
  { area: "Coast Region", eta: "2 - 4 business days", fee: "From KES 1,500" },
  { area: "Western & Nyanza", eta: "2 - 4 business days", fee: "From KES 1,400" },
  { area: "North Eastern", eta: "3 - 5 business days", fee: "From KES 1,800" },
];

export default function LocationPage() {
  return (
    <StaticPageLayout
      title="Location & Delivery Areas"
      subtitle="We deliver wholesale orders across Kenya with region-based timelines and shipping rates."
    >
      <div className="overflow-hidden rounded-2xl border border-gray-200">
        <div className="grid grid-cols-3 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
          <p>Region</p>
          <p>Estimated Delivery</p>
          <p>Starting Fee</p>
        </div>

        {zones.map((zone) => (
          <div key={zone.area} className="grid grid-cols-3 border-t border-gray-200 px-4 py-3 text-sm text-gray-700">
            <p className="font-medium text-gray-900">{zone.area}</p>
            <p>{zone.eta}</p>
            <p>{zone.fee}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-600">
        For urgent or large-volume deliveries, contact our logistics desk for custom routing and dedicated dispatch.
      </p>
    </StaticPageLayout>
  );
}
