// imageUpload.js
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadImageToStorage = async (file, folderId, folderName) => {
  try {
    let storagePath = `images/${folderId}/${folderName}/`;
    const storageRef = ref(storage, storagePath + file.name);
    const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);
    console.log("Image uploaded successfully:", uploadTaskSnapshot);
    return uploadTaskSnapshot;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
