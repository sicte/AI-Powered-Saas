import { useRef } from 'react';
import { Paperclip } from 'lucide-react';
import { readFileAsAttachment, type Attachment } from '@/lib/attachments';

interface AttachmentButtonProps {
  onAttach: (attachment: Attachment) => void;
  onError?: (message: string) => void;
  disabled?: boolean;
}

export default function AttachmentButton({ onAttach, onError, disabled }: AttachmentButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        accept="image/png,image/jpeg,image/webp,image/gif,.pdf,.txt,.csv,.md,.json,.py,.js,.ts,.html,.xml"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            readFileAsAttachment(file)
              .then(onAttach)
              .catch((err: Error) => {
                if (onError) onError(err.message);
                else alert(err.message);
              });
          }
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        title="Attach an image or file"
        aria-label="Attach an image or file"
      >
        <Paperclip className="h-4 w-4" />
      </button>
    </>
  );
}