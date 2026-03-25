export default function SmartInsights({ items }) {
  if (!items?.length) return null
  return (
    <section className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-6">
      <h3 className="text-left text-xl font-semibold text-amber-100">Smart weather insights</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-left text-sm leading-relaxed text-amber-50/90">
        {items.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </section>
  )
}
