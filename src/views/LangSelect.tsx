import { useTranslation } from "react-i18next";

export default function LangSelect() {
  const { i18n } = useTranslation();

  return (
    <select defaultValue={i18n.language}
      onChange={e => i18n.changeLanguage(e.target.value as 'en' | 'es')}
      className="select">
      <option value='en'>English</option>
      <option value='es'>Español</option>
    </select>
  )
}
