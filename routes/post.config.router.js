const express = require("express")
const router = express.Router()

const postsConfigController = require("../controller/post.config.controller")

router.get("/" , postsConfigController.getAll)
router.post("/" , postsConfigController.create )

module.exports = router