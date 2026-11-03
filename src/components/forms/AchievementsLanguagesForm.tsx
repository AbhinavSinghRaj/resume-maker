"use client";

import { useResumeStore } from "@/store/resumeStore";
import ListInput from "./ListInput";

export default function AchievementsLanguagesForm() {
  const { resume, setAchievements, setLanguages } = useResumeStore();

  return (
    <div className="card grid gap-5">
      <div>
        <h2 className="card-title">Achievements</h2>
        <textarea
          rows={3}
          aria-label="Achievements"
          placeholder="One achievement per line"
          value={resume.achievements.join("\n")}
          onChange={(e) => setAchievements(e.target.value.split("\n"))}
          className="field"
        />
      </div>

      <div>
        <h2 className="card-title">Languages</h2>
        <ListInput
          aria-label="Languages"
          placeholder="Comma-separated (e.g. English, Hindi)"
          value={resume.languages}
          onChange={setLanguages}
        />
      </div>
    </div>
  );
}
