import {
  deleteDoc,
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
  query,
  addDoc,
  serverTimestamp,
  DocumentData,
  QueryConstraint,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import {
  IErrorResponse,
  ISuccessResponse,
} from "@/core/types/api/response.interface";
import { db } from "@/core/config/firebase.config";
import { IGetRequest } from "@/core/types/api/request.interface";

export class FirestoreService {
  static async createOrUpdateDocument<
    T extends DocumentData & { id?: string; createdAt?: any; updatedAt?: any }
  >(
    collectionName: string,
    data: T
  ): Promise<ISuccessResponse<T> | IErrorResponse> {
    // Check if document exists by checking if it has an id
    const isUpdate = "id" in data && data.id;

    try {
      const docRef = isUpdate
        ? doc(db, collectionName, data.id!)
        : await addDoc(collection(db, collectionName), data);

      if (isUpdate) {
        await updateDoc(docRef, data);
      }

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return {
          success: false,
          errorCode: "DOCUMENT_NOT_FOUND",
          message: "Document not found after creation/update",
        };
      }

      return {
        success: true,
        message: isUpdate
          ? "Document updated successfully"
          : "Document created successfully",
        data: { ...docSnap.data(), id: docSnap.id } as T,
      };
    } catch (err) {
      console.error("Error creating/updating document: ", err);
      return {
        success: false,
        errorCode: isUpdate ? "UPDATE_ERROR" : "CREATE_ERROR",
        message: isUpdate
          ? "Failed to update document"
          : "Failed to create document",
      };
    }
  }

  // Read single document
  static async readDocument<T extends DocumentData>(
    collectionName: string,
    id: string
  ): Promise<ISuccessResponse<T> | IErrorResponse> {
    if (!id) {
      return {
        success: false,
        errorCode: "INVALID_ID",
        message: "Document ID is required",
      };
    }

    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          errorCode: "DOCUMENT_NOT_FOUND",
          message: "Document not found",
        };
      }

      return {
        success: true,
        message: "Document retrieved successfully",
        data: docSnap.data() as T,
      };
    } catch (err) {
      console.error("Error reading document: ", err);
      return {
        success: false,
        errorCode: "READ_ERROR",
        message: "Failed to read document",
      };
    }
  }

  // Read multiple documents
  static async readDocuments<T extends DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = [],
    options: IGetRequest
  ): Promise<ISuccessResponse<T[]> | IErrorResponse> {
    try {
      const queryConstraints = [...constraints];

      // Add sorting if specified
      if (options.sortBy) {
        queryConstraints.push(
          orderBy(options.sortBy, options.sortOrder || "asc")
        );
      }
      // Add limit if specified
      if (options.limit) {
        queryConstraints.push(limit(options.limit));
      }

      // Add pagination if last document is provided
      if (options.lastDoc) {
        queryConstraints.push(startAfter(options.lastDoc));
      }

      const q = query(collection(db, collectionName), ...queryConstraints);
      const querySnapshot = await getDocs(q);

      const documents = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as unknown as T[];

      return {
        success: true,
        message: "Documents retrieved successfully",
        data: documents,
      };
    } catch (err) {
      console.error("Error reading documents: ", err);
      return {
        success: false,
        errorCode: "READ_ERROR",
        message: "Failed to read documents",
      };
    }
  }

  // Update
  static async updateDocument<T extends DocumentData>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<ISuccessResponse<T> | IErrorResponse> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });

      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return {
          success: false,
          errorCode: "DOCUMENT_NOT_FOUND",
          message: "Document not found after update",
        };
      }

      return {
        success: true,
        message: "Document updated successfully",
        data: { ...docSnap.data(), id: docSnap.id } as unknown as T,
      };
    } catch (err) {
      console.error("Error updating document: ", err);
      return {
        success: false,
        errorCode: "UPDATE_ERROR",
        message: "Failed to update document",
      };
    }
  }

  // Delete
  static async deleteDocument(
    collectionName: string,
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);

      return {
        success: true,
        message: "Document deleted successfully",
        data: null,
      };
    } catch (err) {
      console.error("Error deleting document: ", err);
      return {
        success: false,
        errorCode: "DELETE_ERROR",
        message: "Failed to delete document",
      };
    }
  }
}
