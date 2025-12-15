import { DEFAULT_FILE_SIZE } from '@/constants';
import { FileSizeUnitSchema, type TFileSize } from '@/schemas/form-entites/form-fields';

export const areFilesSame = (a: File, b: File) =>
  a.name === b.name && a.size === b.size && a.type === b.type && a.lastModified === b.lastModified;

export const fileExtensionToUpperCase = (fileExt: string) => {
  if (!fileExt) return '';
  return (fileExt.startsWith('.') ? fileExt.substring(1) : fileExt.toUpperCase()).toUpperCase();
};

export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const convertFileSizeToBytes = (value = DEFAULT_FILE_SIZE.value, unit = DEFAULT_FILE_SIZE.unit) => {
  switch (unit) {
    case FileSizeUnitSchema.enum.B:
      return value;
    case FileSizeUnitSchema.enum.KB:
      return value * 1024;
    case FileSizeUnitSchema.enum.MB:
      return value * 1024 * 1024;
    case FileSizeUnitSchema.enum.GB:
      return value * 1024 * 1024 * 1024;
    default:
      return value;
  }
};

export const isFilesizeWithinLimit = (file: File, maxSize: TFileSize) => {
  const maxSizeInBytes = convertFileSizeToBytes(maxSize.value, maxSize.unit);
  return file.size <= maxSizeInBytes;
};

export const isAllowedFileType = (file: File, allowedFileTypes: string[]) => {
  if (!allowedFileTypes.length) return true;
  return allowedFileTypes.some(ext => file.name.toLowerCase().endsWith(ext.toLowerCase()));
};
