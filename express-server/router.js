const express = require('express');
const router = express.Router();router.get('/', (req, res) => {
 res.send("EXPRESS API! YAYYYYYYYYY!");
});

module.exports = router;