const express = require("express")
const router = express.Router()

const postsKformController = require("../controller/post.kform.controller")

router.get("/" , postsKformController.getAll)
router.get("/:kformfcode", postsKformController.getByFcode)
router.delete("/:kformfcode/", postsKformController.delete);
router.put("/", postsKformController.create)
router.put("/kformupdate/:f_code", postsKformController.update)

module.exports = router