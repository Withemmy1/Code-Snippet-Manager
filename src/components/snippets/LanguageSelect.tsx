import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'sql',
  'html',
  'css',
  'json',
  'yaml',
  'markdown',
  'shell',
] as const

interface LanguageSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onValueChange,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 