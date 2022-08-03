"use strict";

import express from 'express';
import getLedger from '../controllers/ledger-controller.js'

const router = express.Router();
export default router;

router.get('/ledger', getLedger);