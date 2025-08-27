import { LANGUAGE_VERSIONS, type Language } from "../constants/constants";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "text-blue-400";

interface LanguageSelectorProps {
  language: Language;
  onSelect: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, onSelect }) => {
  return (
    <div className="mb-4 ml-2">
      <label className="block mb-2 text-lg">
        Language:
        <select
          value={language}
          onChange={(e) => onSelect(e.target.value as Language)}
          className="ml-2 px-2 py-1 rounded bg-gray-900 text-gray-200"
        >
          {languages.map(([lang, version]) => (
            <option key={lang} value={lang}>
              {lang} ({version})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default LanguageSelector;
