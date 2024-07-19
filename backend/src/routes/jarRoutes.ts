import express from 'express';
import { createJar, deleteJar, getJar, updateJar } from '../controllers/jarController.js';
import jarValidator from '../validators/jarValidator.js';

const jarRouter = express.Router();

/** GET Methods */
/**
 * @openapi
 * paths:
 *   /jar/id:
 *     get:
 *       tags:
 *         - jar
 *       summary: Get all jars available to the user
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Jar id
 *           required: false
 *           explode: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: successful operation
 *         '404':
 *           description: Invalid id value
 *         '500':
 *           description: Server is not responding
 */
jarRouter.get('/:id', getJar);

/** POST Methods */
/**
* @openapi
*   /jar:
*     post:
*       tags:
*         - jar
*       summary: Create a jar
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               required:
*                 - name
*                 - color
*               properties:
*                 name:
*                   type: string
*                 color:
*                   type: string
*       responses:
*         '200':
*           description: Created jar
*         '400':
*           description: Invalid input
*         '500':
*           description: Server is not responding
 */
jarRouter.post('/', jarValidator, createJar);

/** PUT Methods */
/**
 * @openapi
 * /jar/id:
 *     put:
 *       tags:
 *         - jar
 *       summary: Update a jar
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - color
 *               properties:
 *                 name:
 *                   type: string
 *                 color:
 *                   type: string
 *       responses:
 *         '200':
 *           description: Updated jar
 *         '400':
 *           description: ID is not valid
 *         '404':
 *           description: No jar found
 *         '500':
 *           description: Server is not responding
 */
jarRouter.put('/:id', jarValidator, updateJar);

/** DELETE Methods */
/**
 * @openapi
 *   /jar/id:
 *     delete:
 *       tags:
 *         - jar
 *       summary: Delete a jar
 *       parameters:
 *         - name: id
 *           in: query
 *           description: Jar id
 *           required: false
 *           explode: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Delete a jar
 *         '404':
 *           description: No jar found
 *         '500':
 *           description: Server is not responding
 */
jarRouter.delete('/:id', deleteJar);

export default jarRouter;
