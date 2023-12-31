import axios from 'axios';
import dotenv from 'dotenv';
import {Request, Response, Router} from 'express';
import fs from 'fs';
import {isAffirmative} from './isAffirmative';

dotenv.config();

const CONTEXT_PATH = 'data/contexts';
const GOOGLE_CLOUD_AUTH_TOKEN = process.env.GOOGLE_CLOUD_AUTH_TOKEN;
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;

const router = Router();

// POST /policy-parsing
//
// Returns:
//     HTTP 200: Policy analysed successfully.
//         {
//             fireDamage: True if the policy appears to cover fire damage.
//                 Otherwise false.
//             glassDamage: True if the policy appears to cover glass damage.
//                 Otherwise false.
//             panelDamage: True if the policy appears to cover panel damage.
//                 Otherwise false.
//         }
router.post('/', async (req: Request, res: Response) => {
  let contextId = Number(req.query.context);
  if (isNaN(contextId) || [1, 2, 3].indexOf(contextId) === -1) {
    contextId = Math.floor(Math.random() * 3 + 1);
  }

  const baseContext = fs.readFileSync(
      `${CONTEXT_PATH}/base.txt`,
  ).toString('utf-8');
  const additionalContext = fs.readFileSync(
      `${CONTEXT_PATH}/${contextId}.txt`,
  ).toString('utf-8');
  const context = `${baseContext}\n\n${additionalContext}`;

  const questions = [
    'Does this policy cover fire damage?',
    'Does this policy cover glass damage?',
    'Does this policy cover bodywork damage?',
  ];

  try {

    const aiRequests = questions.map((question) => axios.post(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT_ID}/locations/us-central1/publishers/google/models/chat-bison-32k:predict`,
        {
          instances: [
            {
              context,
              messages: [
                {
                  author: 'USER',
                  content: question,
                },
              ],
            },
          ],
          parameters: {
            temperature: 0.2,
            tokenLimits: 2188,
            topK: 40,
            topP: 0.8,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${GOOGLE_CLOUD_AUTH_TOKEN}`,
          },
        },
    ));
    const aiResponses = await axios.all(aiRequests);

    return res.status(200).send({
      fireDamage: isAffirmative(
          aiResponses[0].data.predictions[0].candidates[0].content,
      ),
      glassDamage: isAffirmative(
          aiResponses[1].data.predictions[0].candidates[0].content,
      ),
      panelDamage: isAffirmative(
          aiResponses[2].data.predictions[0].candidates[0].content,
      ),
    });
  } catch (e) {
    console.error('Failed to Contact Google API. Has the token expired?');
    return res.sendStatus(502);
  }
});

export default router;
