import axios from 'axios';
import dotenv from 'dotenv';
import {Request, Response, Router} from 'express';
import fs from 'fs';
import multer from 'multer';

import {
  hasFireDamageKeywords,
  hasGlassDamageKeywords,
  hasPanelDamageKeywords,
} from './keywordDetection';

dotenv.config();

const DESTINATION = 'tmp';
const GOOGLE_CLOUD_AUTH_TOKEN = process.env.GOOGLE_CLOUD_AUTH_TOKEN;
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;

if (!fs.existsSync(DESTINATION)) {
  fs.mkdirSync(DESTINATION);
}

const router = Router();
const upload = multer({dest: DESTINATION});

// POST /image-handling
//
// Form Data:
//     image: An image which should be uploaded to the server. Required.
//
// Returns:
//     HTTP 200: Image uploaded and analysed successfully.
//         {
//             fireDamage: True if the image appears to show fire damage.
//                 Otherwise false.
//             glassDamage: True if the image appears to show glass damage.
//                 Otherwise false.
//             panelDamage: True if the image appears to show panel damage.
//                 Otherwise false.
//             vehicleDescription: A description of the make and model of car
//                 which appears to be in the image.
//         }
//     HTTP 400: Too few or two many images were uploaded.
//     HTTP 422: The AI tool could not detect a car in the uploaded image.
router.post('/', upload.array('image'), async (req: Request, res: Response) => {
  if (!req.files || req.files.length !== 1) {
    return res.sendStatus(400);
  }

  const file = (req.files as unknown as any[])[0];
  const fileName = `${DESTINATION}/${file.filename}`;
  const filePath = `${fileName}.${file.mimetype.replace('image/', '')}`;
  fs.renameSync(`${fileName}`, filePath);

  const image = fs.readFileSync(filePath);
  const encodedImage = Buffer.from(image).toString('base64');

  const prompts = [
    'What does this picture contain?',
    'What damage does this car have?',
    'What model is this car?',
  ];
  const aiRequests = prompts.map((prompt) => axios.post(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT_ID}/locations/us-central1/publishers/google/models/imagetext:predict`,
      {
        instances: [
          {
            prompt,
            image: {
              bytesBase64Encoded: encodedImage,
            },
          },
        ],
        parameters: {
          sampleCount: 3,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${GOOGLE_CLOUD_AUTH_TOKEN}`,
        },
      },
  ));
  const aiResponses = (await axios.all(aiRequests)).map(
      (response) => response.data,
  );

  fs.rmSync(filePath);

  console.log(aiResponses[1].predictions);

  if (aiResponses[0].predictions.indexOf('car') === -1) {
    return res.sendStatus(422);
  }

  return res.status(200).send({
    fireDamage: hasFireDamageKeywords(aiResponses[1].predictions),
    glassDamage: hasGlassDamageKeywords(aiResponses[1].predictions),
    panelDamage: hasPanelDamageKeywords(aiResponses[1].predictions),
    vehicleDescription: aiResponses[2].predictions[0].toUpperCase(),
  });
});

export default router;
