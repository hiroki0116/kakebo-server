import { AuthDto } from 'src/auth/dto/auth.dto';
import admin from 'firebase-admin';

type UserInfo = {
  email: string;
  emailVerified: boolean;
  dispalyName: string;
};

export const createUserInFirebase = async (dto: AuthDto) => {
  const userInfo = {
    email: dto.email,
    emailVerified: false,
    dispalyName: dto.name,
  };

  try {
    const firebaseUser = await admin.auth().createUser(userInfo);
    return { success: true, firebaseUser: firebaseUser.toJSON() };
  } catch (error) {
    if (error.errorInfo.code === 'auth/email-already-exists') {
      const updateRes = await _updateUserInFirebase(dto.email, { ...userInfo });
      if (!updateRes.success) {
        return { success: false, message: updateRes.message };
      }
      return { success: true, firebaseUser: updateRes.firebaseUser };
    }
    return { success: false, message: error.message };
  }
};

const _updateUserInFirebase = async (email: string, userInfo: UserInfo) => {
  try {
    const firebaseUser = await admin.auth().getUserByEmail(email);
    const updateRes = await admin
      .auth()
      .updateUser(firebaseUser.uid, { ...userInfo });

    return { success: true, firebaseUser: updateRes };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
