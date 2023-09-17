import {Request, Response, Router} from 'express';

import servicesList from './servicesList.json';

const router = Router();

// GET /nearby-services
//
// Query Arguments:
//     lat: the latitude part of coordinates that the system should search near
//         to. Required.
//     lng: the longitude part of coordinates that the system should search
//         near to. Required.
//     num: the number of services which should be returned. Defaults to 3.
//
// Returns:
//     HTTP 200: Services found and returned successfully.
//         {
//             name: The name of the service.
//             type: The type of the service (always `taxi`, `workshop` or
//                 `recovery`).
//             location.lat: The latitude part of coordinates of the service.
//             location.lng: The longitude part of coordinates of the service.
//         }[]
//     HTTP 400: One or more required query parameters were missing.
router.get('/', (req: Request, res: Response) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const num = Number(req.query.num ?? 3);

  if (!lat || !lng) {
    return res.sendStatus(400);
  }

  // NOTE: In a production environment, the code would search for real services
  // which could help someone who has been involved in an accident. These may
  // include taxi services, car rental companies, etc. This has been omitted
  // here because we do not have a dataset with these services. Instead, we
  // choose from a pre-defined list.

  const selectedServices = servicesList.sort(
      () => 0.5 - Math.random(),
  ).slice(0, num);

  return res.status(200).send(selectedServices);
});

export default router;
