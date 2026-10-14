import { Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import type { Attachment } from '../models/index.ts';
import { documentAttachment, mediaAttachment } from './attachments.ts';

/** Local native actions. Selected files are never extracted or sent to a service. */
export async function pickMedia(): Promise<Attachment | null> {
  if (Platform.OS === 'web') throw new Error('Use iOS or Android to attach a photo or video.');
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images', 'videos'],
    allowsEditing: false,
    quality: 0.8,
  });
  return mediaAttachment(result);
}

export async function pickDocument(): Promise<Attachment | null> {
  if (Platform.OS === 'web') throw new Error('Use iOS or Android to choose a quotation document.');
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'image/*'],
    copyToCacheDirectory: true,
  });
  return documentAttachment(result);
}

export async function copyText(value: string): Promise<boolean> {
  return Clipboard.setStringAsync(value);
}
