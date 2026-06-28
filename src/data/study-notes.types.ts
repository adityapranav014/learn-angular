export interface CodeFile {
  fileName: string;
  language: 'typescript' | 'xml' | 'css';
  code: string;
}

export interface Section {
  heading: string;
  content?: string;
  codeFiles?: CodeFile[];
  mermaidDefinitions?: string[];
}

export interface VersionedContent {
  version: string;
  label: string;
  sections: Section[];
}

export interface StudyNote {
  id: string;
  title: string;
  icon: string;
  category: string;
  versions: VersionedContent[];
}
