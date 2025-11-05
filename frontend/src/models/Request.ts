export type RequestStatusType = 'pending'|'inprogress'|'done';
export type RequestCategoryType = 'account'|'general'|'permissions'|'campaigns'|'support'|'suggestions'
 
export const categoryLabel:Record<RequestCategoryType,string>={
    'account':"ניהול חשבון",
    'general':"כללי",
    'permissions':'הרשאות',
    'campaigns':'קמפיינים',
    'support':'תמיכה טכנית',
    'suggestions':'הצעות ושיפורים'
}
export const statusLabel:Record<RequestStatusType, string> = {
  pending:'בהמתנה',
inprogress:'בטיפול',
  done:'נסגר',
}
export interface AdminRequestByUser
  {
  _id?: string;
  subject: string;
  body: string;
  category: RequestCategoryType;
  ngoId:string;
  userId:string;
  status:RequestStatusType;
  adminComment:string
};
export interface IAdminRequestByUser extends AdminRequestByUser{
    _id: string;
    createdAt:string;
    updatedAt:string;
    requester:{name:string, email:string};
    ngo:{name:string,ngoNumber:string }
}