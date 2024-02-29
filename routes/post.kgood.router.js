const express = require("express")
const router = express.Router()

const postKgoodController = require("../controller/post.kgood.controller")

router.get("/" , postKgoodController.getAll)
router.get("/:gooduid" , postKgoodController.getByUid)
router.post("/", postKgoodController.create)
router.put("/kgoodupdate/:uid", postKgoodController.update)
router.get("/detail", postKgoodController.getByGName);
router.post("/kgoodSelector", postKgoodController.registerProduct)
router.delete("/kgooddelete/:uid", postKgoodController.delete)
module.exports = router