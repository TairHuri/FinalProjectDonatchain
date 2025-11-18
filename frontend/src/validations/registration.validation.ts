import type { Ngo, NgoMediaType } from "../models/Ngo";
import type { User } from "../models/User";

export type ValidationResult = { status: boolean, message: string }

const isValidBankAccount = (account: string) => {
    if (!account) return false;
    const clean = account.replace(/\D/g, "");
    if (clean.length < 6 || clean.length > 14) return false;
    if (/^(\d)\1+$/.test(clean)) return false;
    return true;
};

const isValidCryptoWallet = (wallet: string) => {
    if (!wallet) return false;
    return /^0x[a-fA-F0-9]{40}$/.test(wallet.trim());
};
const isValidPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
};
export const validateUser = (user: User) => {
    if (!user.name || !user.email || !user.password || !user.phone) {
        return { status: false, message: "יש למלא את כל שדות המשתמש: שם, אימייל, טלפון וסיסמה" };

    }
    if (!isValidPassword(user.password)) {
        return { status: false, message: "הסיסמה חייבת להכיל לפחות 8 תווים, כולל אות גדולה, אות קטנה, ספרה ותו מיוחד" };
    }
    return { status: true, message: '' }
}

export const validateNgo = (ngo: Ngo, ngoList:Ngo[], media: NgoMediaType) => {
    const result = {status:false, message:''}
    const requiredNgoFields: (keyof Ngo)[] = [
        "name",
        "description",
        "bankAccount",
        "wallet",
        "address",
        "phone",
        "email",
        "ngoNumber",
    ];

    for (const field of requiredNgoFields) {
        if (!ngo[field]) {
            result.message ="יש למלא את כל שדות העמותה (למעט אתר ולוגו)";
            return result;
        }
    }

    const existingNgo = ngoList.find(
        (n) =>
            n.name.trim() === ngo.name.trim() ||
            (n.ngoNumber && n.ngoNumber.trim() === ngo.ngoNumber.trim())
    );

    if (existingNgo) {
        result.message = "עמותה בשם זה או עם מספר עמותה זה כבר קיימת במערכת.";
        return result;
    }


    if (!media.certificate) {
        result.message = "יש להעלות תעודת רישום עמותה (קובץ אישור).";
        return result;
    }


    if (!isValidBankAccount(ngo.bankAccount || "")) {
        result.message = "מספר חשבון הבנק אינו תקין. יש להזין בין 6 ל-10 ספרות בלבד.";
        return result;
    }


    if (!ngo.wallet || !isValidCryptoWallet(ngo.wallet)) {
        result.message = "כתובת ארנק הקריפטו אינה תקינה. ודאי שהיא מתחילה ב-0x ומכילה 42 תווים.";
        return result;
    }
    result.status=true;
    return result;
}