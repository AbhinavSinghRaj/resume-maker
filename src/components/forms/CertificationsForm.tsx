"use client";

import { useResumeStore } from "@/store/resumeStore";

export default function CertificationsForm() {
  const { resume, addCertification, updateCertification, removeCertification } = useResumeStore();

  return (
    <div className="card">
      <div className="card-row">
        <h2 className="card-title">Certifications</h2>
        <button onClick={addCertification} className="btn btn-add">+ Add certification</button>
      </div>

      <div className="grid gap-3">
        {resume.certifications.map((c) => (
          <div key={c.id} className="entry grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              aria-label="Certification name"
              placeholder="Certification name"
              value={c.name}
              onChange={(e) => updateCertification(c.id, { name: e.target.value })}
              className="field"
            />
            <input
              aria-label="Issuer"
              placeholder="Issuer (optional)"
              value={c.issuer ?? ""}
              onChange={(e) => updateCertification(c.id, { issuer: e.target.value })}
              className="field"
            />
            <div className="flex gap-2">
              <input
                type="month"
                aria-label="Date"
                value={c.date ?? ""}
                onChange={(e) => updateCertification(c.id, { date: e.target.value })}
                className="field"
              />
              <button
                onClick={() => {
                  if (!c.name || window.confirm("Remove this certification?")) removeCertification(c.id);
                }}
                className="btn-danger-text"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
