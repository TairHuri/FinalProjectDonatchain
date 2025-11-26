import mongoose, { FilterQuery } from "mongoose";
import AdminRequestModel, { AdminRequestByUser, IAdminRequestByUser } from "../models/adminRequestByUser";
import { ServerError } from "../middlewares/error.middleware";
import { UndecodedEventLog } from "ethers";

export default {
    // Create a new admin request
  async create(data: AdminRequestByUser) {
    console.log(data);

    const request = new AdminRequestModel(data);
    const createdRequest = await request.save();
    return createdRequest;
  },
    // Update an existing admin request
  async update(requestId: string, data: IAdminRequestByUser) {
    if (requestId != data._id) {
      throw new ServerError('invalid requestId', 400);
    }
    const updatedRequest = await AdminRequestModel.findByIdAndUpdate(requestId, data)
    return updatedRequest;
  },
    // Get all admin requests, optionally excluding those marked as "done"
  async getRequests(includeDone = true) {
    const predicate: FilterQuery<IAdminRequestByUser>= {}
    if (!includeDone) {
      
      predicate.status = { $ne: "done" };
    }
  const requests = await AdminRequestModel.aggregate([
      {
        $match: predicate
      },
      {
        $addFields: {
          userIdAsObject: {
            $cond: [
              { $and: [{ $ne: ["$userId", null] }, { $ne: ["$userId", ""] }] },
              { $toObjectId: "$userId" },
              null
            ]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          let: { uid: "$userIdAsObject" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$uid"] } } },
            { $project: { _id: 1, name: 1, email: 1 } }
          ],
          as: "uDoc"
        }
      },
      { $unwind: { path: "$uDoc", preserveNullAndEmptyArrays: false } },
      {
        $lookup: {
          from: "ngos",
          let: { nid: "$ngoId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$nid"] } } },
            { $project: { _id: 1, name: 1, ngoNumber: 1 } }
          ],
          as: "nDoc"
        }
      },
      { $unwind: { path: "$nDoc", preserveNullAndEmptyArrays: false } },
      {
        $project: {
          requester: { name: "$uDoc.name", email: "$uDoc.email" },
          ngo: { name: "$nDoc.name", ngoNumber: "$nDoc.ngoNumber" },

          // keep whatever request fields you need:
          _id: 1,
          subject: 1,
          body: 1,
          category: 1,
          ngoId: 1,
          userId: 1,
          status: 1,
          adminComment: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }

    ])
    console.log('requests', requests);
    
    return requests;
  },
  async getRequestsByNgo(ngoId: string, includeDone = false) {

    const predicate: FilterQuery<IAdminRequestByUser> = { 'ngoId': ngoId }
    if (!includeDone) {
      predicate['status'] = { $ne: 'done' }
    }
    const requests = await AdminRequestModel.find(predicate);
    return requests;
  }

}