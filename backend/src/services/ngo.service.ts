// src/services/ngo.service.ts
import Ngo, { BaseNgo } from '../models/ngo.model';
import fetch from 'node-fetch';
import tags from '../config/tags.json'
import aiService from './ai.service';
import { ServerError } from '../middlewares/error.middleware';

const VERIFY_NGO_RES_AMUTOT = "be5b7935-3922-45d4-9638-08871b17ec95"; 
const VERIFY_NGO_RES_NIHUL_TAKIN = "cb12ac14-7429-4268-bc03-460f48157858"; 
const VERIFY_NGO_RES_LIMIT = 5;

  export type ApiErrorType = {status:false, message:string}
  export type ApiSuccessType = {[key:string]:{status:true}|{status:false, message:string}}

const getNgoGovData = async (urlRes: string, filters: {}) => {

  const baseUrl = 'https://data.gov.il/api/3/action/datastore_search' //?resource_id=be5b7935-3922-45d4-9638-08871b17ec95&limit=5&&filters={%20%22%D7%9E%D7%A1%D7%A4%D7%A8%20%D7%A2%D7%9E%D7%95%D7%AA%D7%94%22:%20580000016%20}'
  const url = `${baseUrl}?resource_id=${encodeURIComponent(urlRes)}&limit=${VERIFY_NGO_RES_LIMIT}&filters=${encodeURIComponent(JSON.stringify(filters))}`;
  try {
    const httpResponse = await fetch(url);
    const response = await httpResponse.json();
    if (!httpResponse.ok) {
      return { status: false, data: response }
    } else {
      return { status: true, data: response }
    }
  } catch (error) {
    return { status: false, data: null }
  }
}
export default {



async verifyNgoActive(ngoNumber: string)  {
  const filters = { "מספר עמותה": `${ngoNumber}` }
  const response = await getNgoGovData(VERIFY_NGO_RES_AMUTOT, filters)
  if (!response.data.result || !response.data.result.records) {
    return { status: false, message: 'שגיאה בטעינת רשם העמותות' };
  }
  if (response.data.result.records.length == 0) {    
    return { status: false, message: 'העמותה לא רשומה ברשם העמותות' };
  }
  const govNgo = response.data.result.records[0];
  const status = govNgo['סטטוס עמותה']
  if (status == 'רשומה') {
    return { status: true }
  } else {
    return { status: false, message: `העמותה בעלת סטטוס לא תקין${status}` }
  }

},

 async verifyNgoApproved(ngoNumber: string)  {
  const year = new Date().getFullYear();
  const yearsToCheck = [year, year - 1];
  const respArr = []
  for (const year of yearsToCheck) {
    const filters = {
      "מספר עמותה": ngoNumber,
      "שנת האישור": year
    }
    const response = await getNgoGovData(VERIFY_NGO_RES_NIHUL_TAKIN, filters)
    respArr.push(response)
  }

  const result: ApiErrorType|ApiSuccessType= {}
  for (const resp of respArr) {
    if (!resp.data.result || !resp.data.result.records) {
      return { status: false, message: 'שגיאה בטעינת רשם העמותות' };
    }
    if (resp.data.result.records.length == 0) {
      return { status: false, message: 'אין אישור שנתי מתועד ברשם העמותות' };
    }
    const govNgo = resp.data.result.records[0];
    const yearField = "שנת האישור";
    const yearStatus = "האם יש אישור";
    const hasYearApproval = "נחתם אישור";
    if (yearsToCheck.includes(govNgo[yearField]) && govNgo[yearStatus] == hasYearApproval) {
      result[govNgo[yearField].toString()] = {status:true}
    }else{
      result[govNgo[yearField].toString()] = {status:false, message:govNgo[yearStatus]}
    }
  }

  console.log('verifyNgoApproved', respArr,)
  return result;
},

  async create(data: BaseNgo) {
    const ngo = new Ngo(data);
    const createdNgo = await ngo.save();
    // send the new Ngo to the ai
    const isSuscess = await aiService.addNewNgo(createdNgo)
    return createdNgo;
  },

  async getById(id: string) {
    return Ngo.findById(id).populate('createdBy', 'name email');
  },

  async getByNgoNumberList(ngoNumberList: string[]) {    
    return Ngo.find({ngoNumber :{$in: ngoNumberList}},{name:1, logoUrl:1});
  },

  async list() {
    const items = await Ngo.find().sort({ createdAt: -1 });
    
    return { items, total:items.length,};
  },

  async update(id: string, updates: any) {
    const ngo = await Ngo.findById(id);
    if (!ngo) throw new Error('NGO not found');
    Object.assign(ngo, updates);
    const updatedNgo = await ngo.save();
    const result = await aiService.updateNgo(ngo);

    return updatedNgo;
  },
  getNgoTags: () => tags.ngo,
  async toggleNgoStatus(ngoId:string){
    const ngo = await Ngo.findById(ngoId);
    if (!ngo) throw new ServerError( "עמותה לא נמצאה" , 404) ;
    ngo.isActive = !ngo.isActive;
    return await ngo.save({ validateModifiedOnly: true });
    
  }
  
};
