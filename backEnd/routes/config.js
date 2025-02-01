const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const router = express.Router();
router.get('/supabase', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  });
});
module.exports = router;