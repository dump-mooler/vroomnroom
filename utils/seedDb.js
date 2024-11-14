const fs = require('fs');
const axios = require('axios');

const API_URL = 'http://vroomnroom.kisu-makeup.com';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6WyJhZG1pbiIsIm1hbmFnZXIiXSwiaWF0IjoxNzMxMjY1Mzc2LCJleHAiOjE3MzEzNTE3NzZ9.gEacMFlaadJhz18MEVYgfDz6aTlYIRhOU4WkypTxTPM'

async function seedAdverts() {
    try {
        const rawData = fs.readFileSync('./adverts.json');
        const adverts = JSON.parse(rawData);
        console.log(adverts.length);

        for (const advert of adverts) {
            try {
                const response = await axios.post(`${API_URL}/advert`, advert, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                console.log(`Successfully posted advert: ${response.id || response._id}`);
            } catch (error) {
                console.error(`Failed to post advert: ${advert.id || advert._id}`, error.message);
            }
        }

        console.log('Seeding completed');
    } catch (error) {
        console.error('Error during seeding:', error.message);
    }
}

seedAdverts();
