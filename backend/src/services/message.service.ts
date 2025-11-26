import MessageModel, { Message } from "../models/message.model";

export default {
  // Create a new message
  async create(data: Message) {
    const message = new MessageModel(data);
    const createdMessage =await message.save();
    return createdMessage;
  },
  async getMessagesByNgo(ngoId:String){
    const messages = await MessageModel.find({ngoId})
    return messages;
  }
}