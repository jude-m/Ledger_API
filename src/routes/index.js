"use strict";

import express from 'express';
import {getLedger, postLedger} from '../controllers/ledger-controller.js'

const router = express.Router();
export default router;

router.get('/ledger', getLedger);
router.post('/ledger', postLedger);