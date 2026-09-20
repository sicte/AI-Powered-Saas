export interface Attachment {
  name: string;
  mime: string;
  data: string;
  kind: 'image' | 'file';
  size: number;
  preview?: string;
}

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const IMAGE_MIMES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const TEXTISH_MIMES = new Set([
  'application/pdf',
  'text/plain',
  'text/csv',
  'text/markdown',
  'application/json',
  'text/x-python',
  'text/javascript',
  'application/javascript',
]);

export function isImage(mime: string): boolean {
  return IMAGE_MIMES.has(mime);
}

export function isAcceptable(mime: string): boolean {
  return IMAGE_MIMES.has(mime) || TEXTISH_MIMES.has(mime);
}

export function readFileAsAttachment(file: File): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      reject(new Error('File must be 8 MB or smaller.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read the file.'));
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(',');
      const payload = comma >= 0 ? result.slice(comma + 1) : result;
      resolve({
        name: file.name,
        mime: file.type || '',
        data: payload,
        kind: isImage(file.type) ? 'image' : 'file',
        size: file.size,
        preview: isImage(file.type) ? result : undefined,
      });
    };
    reader.readAsDataURL(file);
  });
}