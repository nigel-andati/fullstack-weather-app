/**
 * Assessment disclosure: applicant name + PM Accelerator context (required for submission).
 * Set VITE_APPLICANT_NAME in frontend/.env (see repo .env.example).
 */
const LINKEDIN_PM_ACCELERATOR = 'https://www.linkedin.com/company/pmaccelerator'
const WEBSITE = 'https://www.pmaccelerator.io'

export default function SubmissionAbout() {
  const applicantName =
    import.meta.env.VITE_APPLICANT_NAME?.trim() || 'Applicant — set VITE_APPLICANT_NAME in frontend/.env'

  return (
    <aside
      className="mt-12 rounded-2xl border border-slate-600/80 bg-slate-900/70 p-6 text-left shadow-lg"
      aria-labelledby="submission-about-heading"
    >
      <h2 id="submission-about-heading" className="text-lg font-semibold text-white">
        Submission — {applicantName}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">
        This weather application was built for a technical assessment. It uses React (Vite), Tailwind CSS,
        Node.js, Express, OpenWeatherMap, optional YouTube integration, CRUD + export, and responsive
        layout with smart weather insights.
      </p>
      <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-sky-300/90">
        About Product Manager Accelerator (PM Accelerator)
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        <strong className="font-medium text-slate-200">Product Manager Accelerator</strong> offers career
        development programs for people moving into product management—covering networking, building
        products for a portfolio, interview preparation, and coaching toward PM roles across the industry.
        For the official company story and updates, see their{' '}
        <a
          href={LINKEDIN_PM_ACCELERATOR}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 underline decoration-sky-500/50 underline-offset-2 hover:text-sky-300"
        >
          LinkedIn page (Product Manager Accelerator)
        </a>
        {' '}and{' '}
        <a
          href={WEBSITE}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 underline decoration-sky-500/50 underline-offset-2 hover:text-sky-300"
        >
          pmaccelerator.io
        </a>
        .
      </p>
    </aside>
  )
}
