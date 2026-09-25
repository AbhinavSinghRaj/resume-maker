"use client";

import { useResumeStore } from "@/store/resumeStore";

export default function AchievementsLanguagesForm() {
  const { resume, setAchievements, setLanguages } = useResumeStore();

  return (
    <div className="card grid gap-5">
      <div>
        <h2 className="card-title">Achievements</h2>
        <textarea
          rows={3}
          placeholder="Ek line = ek achievement"
          value={resume.achievements.join("\n")}
          onChange={(e) => setAchievements(e.target.value.split("\n"))}
          className="field"
        />
      </div>

      <div>
        <h2 className="card-title">Languages</h2>
        <input
          placeholder="Comma se separate (e.g. English, Hindi)"
          value={resume.languages.join(", ")}
          onChange={(e) => setLanguages(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
          className="field"
        />
      </div>
    </div>
  );
}