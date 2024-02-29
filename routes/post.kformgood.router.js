const express = require("express");
const router = express.Router();

const postKformgoodController = require("../controller/post.kformgood.controller");

router.get("/", postKformgoodController.getAll);
router.get("/:goodfcode", postKformgoodController.getByFcode);
router.post("/:goodfcode", postKformgoodController.create);
router.put("/:goodupdate/:uid", postKformgoodController.update);
// DELETE 메소드 경로 수정: 'gooddelete' -> '/gooddelete/:uid'
router.delete("/gooddelete/:uid", postKformgoodController.delete);

module.exports = router;
