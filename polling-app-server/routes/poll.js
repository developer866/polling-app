const express = require('express');
const router = express.Router();
const {createPoll, test, getSinglePoll, submitVote,getPublicPolls,closePoll} = require('../controller/pollController');


/**
 * @swagger
 * /api/polls/public:
 *   get:
 *     summary: Get all public polls
 *     responses:
 *       200:
 *         description: List of public polls
 *
 * /api/polls/{id}/close:
 *   patch:
 *     summary: Close a poll — end voting
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Poll closed successfully
 *       400:
 *         description: Poll is already closed
 *       404:
 *         description: Poll not found
 *
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
 *               isPublic:
 *                 type: boolean
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
router.post('/polls', createPoll);
router.get('/polls/public', getPublicPolls);
router.get('/polls/:id', getSinglePoll);
router.post('/polls/:id/vote', submitVote);
router.patch('/polls/:id/close', closePoll);

module.exports = router;