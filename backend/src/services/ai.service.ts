import fetch from 'node-fetch';
import { ServerError } from '../middlewares/error.middleware';
import { BaseNgo, INgo } from '../models/ngo.model';

// Base URL for the AI server handling NGO-related operations
const ai_server = "http://localhost:6256/api/ngo"
// Function to perform a search for NGOs using the AI server
const search = async (searchtext: string) => {
    try {
        const response = await fetch(`${ai_server}/search?q=${searchtext}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('aisearch', error);

        throw new ServerError((error as any).message, 421)
    }
}
// Function to add a new NGO to the AI server
const addNewNgo = async (ngo: INgo) => {
    try {
        const response = await fetch(`${ai_server}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: ngo.name, ngoNumber: ngo.ngoNumber, description: ngo.description, tags: ngo.tags.join(" ") })
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}
// Function to update an existing NGO on the AI server
const updateNgo = async (ngo: INgo) => {
    try {
        const response = await fetch(`${ai_server}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: ngo.name, ngoNumber: ngo.ngoNumber, description: ngo.description, tags: ngo.tags.join(" ") })
        });
        return response;
    } catch (error) {
        console.log(error);
        return false;
    }

}

export default { search, addNewNgo, updateNgo }