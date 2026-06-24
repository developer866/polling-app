const express = require('express');
const router = express.Router();
const {createPoll, test, getSinglePoll, submitVote} = require('../controller/pollController');


/**
 * @swagger
 * /api/polls:
 *   post:
 *     summary: Create a new poll
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Poll created successfully
 *
 * /api/polls/{id}:
 *   get:
 *     summary: Get a single poll
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Poll found
 *       404:
 *         description: Poll not found
 *
 * /api/polls/{id}/vote:
 *   post:
 *     summary: Submit a vote
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               optionIndex:
 *                 type: number
 *     responses:
 *       200:
 *         description: Vote submitted successfully
 */

router.get('/test', test);
router.post('/polls', createPoll);
router.get('/polls/:id', getSinglePoll);
router.post('/polls/:id/vote', submitVote);

module.exports = router;