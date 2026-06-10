import express from "express";

import {
    getAllUsers,
    getUserById,
    getEnterpriseUsers,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/user.controller";

const router = express.Router();

router.get("/", getAllUsers);

router.get("/enterprise/list", getEnterpriseUsers);

router.get("/:id", getUserById);

router.post("/", createUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;