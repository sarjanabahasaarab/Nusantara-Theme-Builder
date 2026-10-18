/**
 * Nusantara Theme Builder — File Explorer View (Phase 2)
 * Eksplorasi struktur berkas dan folder internal proyek aktif.
 * Dilengkapi kemampuan pembuatan file/folder, penggantian nama, penghapusan,
 * dan pratinjau isi berkas dengan perlindungan path traversal.
 */

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/useProjectStore';
import { ProjectFileNode } from '../../types/project';
import { fileExplorerService } from '../../services/file-explorer-service';
import {
  Folder,
  FolderOpen,
  FileCode,
  FileText,
  FileJson,
  File,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  FolderPlus,
  Save,
  Check,
  X,
  AlertCircle,
  ShieldAlert,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export const FileExplorerView: React.FC = () => {
  const {
    currentProject,
    selectedFileNodeId,
    selectFileNode,
    expandedFolders,
    toggleFolder,
    createWorkspaceFile,
    createWorkspaceFolder,
    renameWorkspaceNode,
    deleteWorkspaceNode,
    saveActiveFileContent,
    addToast
  } = useProjectStore();

  const [activeFolderForNew, setActiveFolderForNew] = useState<string>('');
  const [newFileType, setNewFileType] = useState<'file' | 'folder' | null>(null);
  const [newFileName, setNewFileName] = useState('');

  const [nodeToRename, setNodeToRename] = useState<ProjectFileNode | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');

  const [fileContentDraft, setFileContentDraft] = useState<string>('');
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);

  if (!currentProject) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-400 text-xs">
        <Folder className="w-12 h-12 text-neutral-600 mb-3" />
        <p className="font-semibold text-neutral-200">Tidak ada proyek yang aktif</p>
        <p className="text-neutral-500 mt-1">Buka atau buat proyek terlebih dahulu untuk melihat File Explorer.</p>
      </div>
    );
  }

  const fileTree = fileExplorerService.getProjectFileTree(currentProject);
  const selectedNode = selectedFileNodeId
    ? fileExplorerService.findNode(fileTree, selectedFileNodeId)
    : null;

  // When a file node is clicked, initialize editing content
  const handleSelectNode = (node: ProjectFileNode) => {
    selectFileNode(node.id);
    if (node.type === 'file') {
      setCurrentEditingId(node.id);
      setFileContentDraft(node.content || '');
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    if (newFileType === 'file') {
      const ok = createWorkspaceFile(activeFolderForNew, newFileName.trim(), '');
      if (ok) {
        setNewFileType(null);
        setNewFileName('');
      }
    } else if (newFileType === 'folder') {
      const ok = createWorkspaceFolder(activeFolderForNew, newFileName.trim());
      if (ok) {
        setNewFileType(null);
        setNewFileName('');
      }
    }
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeToRename || !renameInputValue.trim()) return;

    const ok = renameWorkspaceNode(nodeToRename.id, renameInputValue.trim());
    if (ok) {
      setNodeToRename(null);
      setRenameInputValue('');
    }
  };

  const handleSaveFileContent = () => {
    if (!selectedNode || selectedNode.type !== 'file') return;
    saveActiveFileContent(selectedNode.id, fileContentDraft);
    addToast('success', `Perubahan pada berkas "${selectedNode.name}" disimpan.`);
  };

  // Helper render recursive node
  const renderNode = (node: ProjectFileNode, depth: number = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders.includes(node.path);
    const isSelected = selectedFileNodeId === node.id;

    let Icon = File;
    if (isFolder) {
      Icon = isExpanded ? FolderOpen : Folder;
    } else {
      if (node.extension === 'json' || node.extension === 'ntbproject') Icon = FileJson;
      else if (node.extension === 'css' || node.extension === 'js' || node.extension === 'html') Icon = FileCode;
      else Icon = FileText;
    }

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => {
            if (isFolder) {
              toggleFolder(node.path);
            }
            handleSelectNode(node);
          }}
          style={{ paddingLeft: `${depth * 14 + 10}px` }}
          className={`flex items-center justify-between py-1.5 pr-2 rounded-md text-xs cursor-pointer group transition-colors ${
            isSelected
              ? 'bg-amber-500/15 text-amber-300 font-medium'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {isFolder && (
              <span className="text-neutral-500">
                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </span>
            )}
            <Icon
              className={`w-4 h-4 shrink-0 ${
                isFolder ? 'text-amber-400' : isSelected ? 'text-amber-300' : 'text-neutral-500'
              }`}
            />
            <span className="truncate">{node.name}</span>
            {node.isSystemFolder && (
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-neutral-800 text-neutral-400">
                Sistem
              </span>
            )}
          </div>

          {/* Action buttons on hover */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            {isFolder && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFolderForNew(node.path);
                    setNewFileType('file');
                    setNewFileName('');
                  }}
                  className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                  title="Buat File di Folder Ini"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFolderForNew(node.path);
                    setNewFileType('folder');
                    setNewFileName('');
                  }}
                  className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                  title="Buat Sub-folder"
                >
                  <FolderPlus className="w-3 h-3" />
                </button>
              </>
            )}

            {!node.isSystemFolder && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNodeToRename(node);
                    setRenameInputValue(node.name);
                  }}
                  className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                  title="Ganti Nama"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorkspaceNode(node.id);
                  }}
                  className="p-1 text-neutral-400 hover:text-rose-400 rounded hover:bg-rose-500/10"
                  title="Hapus"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Render children if folder is open */}
        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.length === 0 ? (
              <div
                style={{ paddingLeft: `${(depth + 1) * 14 + 18}px` }}
                className="py-1 text-[11px] text-neutral-600 italic"
              >
                (Kosong)
              </div>
            ) : (
              node.children.map((child) => renderNode(child, depth + 1))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex h-[calc(100vh-3rem)] overflow-hidden bg-neutral-950">
      {/* Left panel: File Tree */}
      <aside className="w-80 border-r border-neutral-800 bg-neutral-900/40 flex flex-col shrink-0">
        <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
              File Explorer Proyek
            </h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveFolderForNew('');
                setNewFileType('file');
                setNewFileName('');
              }}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
              title="Buat File Baru di Root"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setActiveFolderForNew('');
                setNewFileType('folder');
                setNewFileName('');
              }}
              className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
              title="Buat Folder Baru di Root"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project root badge */}
        <div className="px-3 py-2 bg-neutral-950 border-b border-neutral-800/80 flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-300 font-semibold truncate">{currentProject.name}/</span>
          <span className="text-[10px] text-amber-400 uppercase">{currentProject.targetPlatform}</span>
        </div>

        {/* Inline file/folder creation input */}
        {newFileType && (
          <form onSubmit={handleCreateSubmit} className="p-2.5 bg-neutral-950 border-b border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>{newFileType === 'file' ? 'Buat Berkas Baru' : 'Buat Folder Baru'}</span>
              <span className="text-[10px] text-neutral-500 font-mono">
                {activeFolderForNew ? `${activeFolderForNew}/` : 'Root'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder={newFileType === 'file' ? 'contoh.css, script.js...' : 'nama-folder'}
                className="flex-1 px-2.5 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-neutral-100 focus:outline-none focus:border-amber-500"
                autoFocus
              />
              <button
                type="submit"
                className="p-1.5 rounded bg-amber-400 text-neutral-950 hover:bg-amber-300"
                title="Simpan"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setNewFileType(null)}
                className="p-1.5 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                title="Batal"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </form>
        )}

        {/* Inline Rename input */}
        {nodeToRename && (
          <form onSubmit={handleRenameSubmit} className="p-2.5 bg-neutral-950 border-b border-neutral-800 space-y-2">
            <span className="text-[11px] text-neutral-400 block">Ubah Nama: {nodeToRename.name}</span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={renameInputValue}
                onChange={(e) => setRenameInputValue(e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs bg-neutral-900 border border-neutral-700 rounded text-neutral-100 focus:outline-none focus:border-amber-500"
                autoFocus
              />
              <button
                type="submit"
                className="p-1.5 rounded bg-amber-400 text-neutral-950 hover:bg-amber-300"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setNodeToRename(null)}
                className="p-1.5 rounded bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </form>
        )}

        {/* Tree Container */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {fileTree.map((node) => renderNode(node, 0))}
        </div>

        {/* Security badge footer */}
        <div className="p-2.5 border-t border-neutral-800 bg-neutral-950/80 text-[10px] text-neutral-500 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Isolasi workspace: Path traversal terblokir</span>
        </div>
      </aside>

      {/* Right panel: File Viewer & Editor */}
      <main className="flex-1 flex flex-col overflow-hidden bg-neutral-950">
        {selectedNode && selectedNode.type === 'file' ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* File info bar */}
            <div className="h-10 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-xs font-mono">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="text-white font-semibold">{selectedNode.path}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">{selectedNode.sizeBytes || fileContentDraft.length} B</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveFileContent}
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Berkas</span>
                </button>
              </div>
            </div>

            {/* Content Textarea */}
            <div className="flex-1 p-4 overflow-hidden flex flex-col">
              <textarea
                value={fileContentDraft}
                onChange={(e) => setFileContentDraft(e.target.value)}
                className="w-full flex-1 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg font-mono text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-700 resize-none leading-relaxed"
                placeholder="Isi berkas teks..."
                spellCheck={false}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-neutral-500 text-xs">
            <FileCode className="w-10 h-10 text-neutral-700 mb-2" />
            <p>Pilih berkas dari pohon direktori sebelah kiri untuk melihat atau mengedit isinya.</p>
          </div>
        )}
      </main>
    </div>
  );
};
