/**
 * Nusantara Theme Builder — Code Editor View (Phase 1)
 * Integrasi Monaco Editor dengan penyorotan sintaks profesional, tab berkas,
 * dan pemisahan arsitektural yang jelas antara dokumen proyek internal,
 * template sampel, serta draft XML/theme.json masa depan.
 */

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useProjectStore } from '../../stores/useProjectStore';
import {
  FileCode,
  Code2,
  FileJson,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle2,
  Copy,
  Search,
  ExternalLink
} from 'lucide-react';

export const CodeEditorView: React.FC = () => {
  const {
    codeDocuments,
    activeCodeDocId,
    setActiveCodeDocId,
    updateActiveCodeContent,
    currentProject,
    addToast
  } = useProjectStore();

  const [copied, setCopied] = useState(false);

  const activeDoc = codeDocuments.find((d) => d.id === activeCodeDocId) || codeDocuments[0];

  const handleCopyCode = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.content);
    setCopied(true);
    addToast('info', `Kode dari "${activeDoc.name}" disalin ke clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3rem)] overflow-hidden bg-neutral-950">
      {/* Top File Switcher Tabs */}
      <div className="h-10 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {codeDocuments.map((doc) => {
            const isActive = doc.id === activeCodeDocId;
            let Icon = FileCode;
            if (doc.language === 'json') Icon = FileJson;
            if (doc.language === 'html' || doc.language === 'xml') Icon = Code2;

            return (
              <button
                key={doc.id}
                onClick={() => setActiveCodeDocId(doc.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-t-md text-xs font-mono transition-all border-t-2 ${
                  isActive
                    ? 'bg-neutral-950 text-neutral-100 border-amber-400 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200 border-transparent hover:bg-neutral-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                <span>{doc.name}</span>
                <span className="text-[10px] text-neutral-500 uppercase">({doc.language})</span>
              </button>
            );
          })}
        </div>

        {/* Copy action */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-medium transition-colors"
            title="Salin isi kode aktif"
          >
            <Copy className="w-3 h-3" />
            <span>{copied ? 'Tersalin!' : 'Salin'}</span>
          </button>
        </div>
      </div>

      {/* Architecture Disclaimer Banner per Specification G */}
      <div className="bg-amber-950/20 border-b border-amber-900/30 px-4 py-2 flex items-center justify-between text-[11px] text-amber-200/90 shrink-0">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Pemberitahuan Arsitektur Phase 1:</strong> File JSON proyek adalah model data internal, bukan berkas ekspor tema jadi. Editor kode di Phase 1 menyediakan visualisasi dan modifikasi dokumen contoh secara aman.
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-400/80 hidden md:inline">
          Monaco Editor v0.52+
        </span>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 relative overflow-hidden">
        {activeDoc ? (
          <Editor
            height="100%"
            language={activeDoc.language}
            value={activeDoc.content}
            theme="vs-dark"
            onChange={(val) => {
              if (val !== undefined) {
                updateActiveCodeContent(val);
              }
            }}
            options={{
              fontSize: 13,
              fontFamily: "'JetBrains Mono', Consolas, 'Courier New', monospace",
              minimap: { enabled: true },
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
              readOnly: activeDoc.isReadOnly || false,
              renderLineHighlight: 'all',
              padding: { top: 12, bottom: 12 }
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500 text-xs">
            Pilih dokumen untuk diedit.
          </div>
        )}
      </div>

      {/* Editor Status Bar */}
      <div className="h-6 bg-neutral-900 border-t border-neutral-800 px-4 flex items-center justify-between text-[10px] text-neutral-400 font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span>Berkas: {activeDoc?.name}</span>
          <span>•</span>
          <span>Bahasa: {activeDoc?.language.toUpperCase()}</span>
          <span>•</span>
          <span>{activeDoc?.isReadOnly ? 'Hanya Baca (Read-Only)' : 'Dapat Diedit (Read-Write)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>UTF-8</span>
          <span>•</span>
          <span>Nusantara Editor Engine</span>
        </div>
      </div>
    </div>
  );
};
