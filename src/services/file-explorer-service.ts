/**
 * Nusantara Theme Builder — File Explorer Service (Phase 2)
 * Pengelolaan struktur berkas dan folder workspace internal proyek.
 * Mencegah path traversal dan melindungi berkas sistem.
 */

import { Project, ProjectFileNode } from '../types/project';
import { validateRelativeWorkspacePath } from '../domain/project/project-validator';
import { createDefaultProjectFiles } from '../domain/project/project-factory';

export class FileExplorerService {
  /**
   * Menghasilkan atau melengkapi struktur berkas proyek aktif
   */
  getProjectFileTree(project: Project): ProjectFileNode[] {
    if (!project.customFiles || project.customFiles.length === 0) {
      return createDefaultProjectFiles(project.name, project.targetPlatform);
    }
    return project.customFiles;
  }

  /**
   * Membuat file teks baru di dalam folder tertentu
   */
  createFile(
    nodes: ProjectFileNode[],
    parentFolderPath: string,
    fileName: string,
    content: string = ''
  ): { updatedNodes: ProjectFileNode[]; error?: string } {
    const trimmed = fileName.trim();
    if (!trimmed) {
      return { updatedNodes: nodes, error: 'Nama file tidak boleh kosong.' };
    }

    const pathCheck = validateRelativeWorkspacePath(
      parentFolderPath ? `${parentFolderPath}/${trimmed}` : trimmed
    );
    if (!pathCheck.isValid) {
      return { updatedNodes: nodes, error: pathCheck.error };
    }

    const fullPath = parentFolderPath ? `${parentFolderPath}/${trimmed}` : trimmed;
    const ext = trimmed.split('.').pop()?.toLowerCase();
    const now = new Date().toISOString();

    const newFileNode: ProjectFileNode = {
      id: 'f-' + Math.random().toString(36).substring(2, 9),
      name: trimmed,
      path: fullPath,
      type: 'file',
      extension: ext,
      sizeBytes: content.length,
      updatedAt: now,
      content
    };

    if (!parentFolderPath) {
      // Add to root
      if (nodes.some((n) => n.name.toLowerCase() === trimmed.toLowerCase())) {
        return { updatedNodes: nodes, error: `File "${trimmed}" sudah ada di folder ini.` };
      }
      return { updatedNodes: [...nodes, newFileNode] };
    }

    const addRecursive = (items: ProjectFileNode[]): ProjectFileNode[] => {
      return items.map((item) => {
        if (item.type === 'folder' && item.path === parentFolderPath) {
          const children = item.children || [];
          if (children.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
            throw new Error(`File "${trimmed}" sudah ada di dalam folder "${item.name}".`);
          }
          return {
            ...item,
            updatedAt: now,
            children: [...children, newFileNode]
          };
        }
        if (item.children) {
          return { ...item, children: addRecursive(item.children) };
        }
        return item;
      });
    };

    try {
      return { updatedNodes: addRecursive(nodes) };
    } catch (err) {
      return { updatedNodes: nodes, error: (err as Error).message };
    }
  }

  /**
   * Membuat folder baru di dalam direktori
   */
  createFolder(
    nodes: ProjectFileNode[],
    parentFolderPath: string,
    folderName: string
  ): { updatedNodes: ProjectFileNode[]; error?: string } {
    const trimmed = folderName.trim();
    if (!trimmed) {
      return { updatedNodes: nodes, error: 'Nama folder tidak boleh kosong.' };
    }

    const pathCheck = validateRelativeWorkspacePath(
      parentFolderPath ? `${parentFolderPath}/${trimmed}` : trimmed
    );
    if (!pathCheck.isValid) {
      return { updatedNodes: nodes, error: pathCheck.error };
    }

    const fullPath = parentFolderPath ? `${parentFolderPath}/${trimmed}` : trimmed;
    const now = new Date().toISOString();

    const newFolderNode: ProjectFileNode = {
      id: 'f-folder-' + Math.random().toString(36).substring(2, 9),
      name: trimmed,
      path: fullPath,
      type: 'folder',
      updatedAt: now,
      children: []
    };

    if (!parentFolderPath) {
      if (nodes.some((n) => n.name.toLowerCase() === trimmed.toLowerCase())) {
        return { updatedNodes: nodes, error: `Folder "${trimmed}" sudah ada.` };
      }
      return { updatedNodes: [...nodes, newFolderNode] };
    }

    const addRecursive = (items: ProjectFileNode[]): ProjectFileNode[] => {
      return items.map((item) => {
        if (item.type === 'folder' && item.path === parentFolderPath) {
          const children = item.children || [];
          if (children.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
            throw new Error(`Folder "${trimmed}" sudah ada di dalam "${item.name}".`);
          }
          return {
            ...item,
            updatedAt: now,
            children: [...children, newFolderNode]
          };
        }
        if (item.children) {
          return { ...item, children: addRecursive(item.children) };
        }
        return item;
      });
    };

    try {
      return { updatedNodes: addRecursive(nodes) };
    } catch (err) {
      return { updatedNodes: nodes, error: (err as Error).message };
    }
  }

  /**
   * Mengganti nama berkas atau folder
   */
  renameNode(
    nodes: ProjectFileNode[],
    nodeId: string,
    newName: string
  ): { updatedNodes: ProjectFileNode[]; error?: string } {
    const trimmed = newName.trim();
    if (!trimmed) {
      return { updatedNodes: nodes, error: 'Nama baru tidak boleh kosong.' };
    }

    const renameRecursive = (items: ProjectFileNode[]): ProjectFileNode[] => {
      return items.map((item) => {
        if (item.id === nodeId) {
          if (item.isSystemFolder) {
            throw new Error(`Folder sistem "${item.name}" tidak dapat diganti namanya.`);
          }
          const parent = item.path.includes('/')
            ? item.path.substring(0, item.path.lastIndexOf('/'))
            : '';
          const newPath = parent ? `${parent}/${trimmed}` : trimmed;
          const ext = item.type === 'file' ? trimmed.split('.').pop()?.toLowerCase() : undefined;

          return {
            ...item,
            name: trimmed,
            path: newPath,
            extension: ext,
            updatedAt: new Date().toISOString()
          };
        }
        if (item.children) {
          return { ...item, children: renameRecursive(item.children) };
        }
        return item;
      });
    };

    try {
      return { updatedNodes: renameRecursive(nodes) };
    } catch (err) {
      return { updatedNodes: nodes, error: (err as Error).message };
    }
  }

  /**
   * Menghapus berkas atau folder
   */
  deleteNode(
    nodes: ProjectFileNode[],
    nodeId: string
  ): { updatedNodes: ProjectFileNode[]; error?: string } {
    const deleteRecursive = (items: ProjectFileNode[]): ProjectFileNode[] => {
      return items
        .filter((item) => {
          if (item.id === nodeId) {
            if (item.isSystemFolder) {
              throw new Error(`Folder sistem "${item.name}" dilindungi dan tidak dapat dihapus.`);
            }
            return false;
          }
          return true;
        })
        .map((item) => {
          if (item.children) {
            return { ...item, children: deleteRecursive(item.children) };
          }
          return item;
        });
    };

    try {
      return { updatedNodes: deleteRecursive(nodes) };
    } catch (err) {
      return { updatedNodes: nodes, error: (err as Error).message };
    }
  }

  /**
   * Mencari file berdasarkan id
   */
  findNode(nodes: ProjectFileNode[], nodeId: string): ProjectFileNode | null {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      if (node.children) {
        const found = this.findNode(node.children, nodeId);
        if (found) return found;
      }
    }
    return null;
  }
}

export const fileExplorerService = new FileExplorerService();
