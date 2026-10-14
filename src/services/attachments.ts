import type { Attachment } from '../models/index.ts';

type MediaSelection = {
  canceled: boolean;
  assets: Array<{ uri: string; fileName?: string | null; type?: string | null }> | null;
};

type DocumentSelection = {
  canceled: boolean;
  assets: Array<{ uri: string; name: string }> | null;
};

/** Convert native picker results to the minimal local demo attachment record. */
export function mediaAttachment(result: MediaSelection): Attachment | null {
  if (result.canceled) return null;
  const file = result.assets?.[0];
  if (!file?.uri) return null;
  return {
    name: file.fileName || file.uri.split('/').pop() || 'Attachment',
    uri: file.uri,
    kind: file.type === 'video' ? 'video' : 'photo',
  };
}

export function documentAttachment(result: DocumentSelection): Attachment | null {
  if (result.canceled) return null;
  const file = result.assets?.[0];
  if (!file?.uri) return null;
  return { name: file.name || 'Quotation document', uri: file.uri, kind: 'document' };
}
