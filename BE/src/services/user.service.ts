import { prisma } from "../config/prisma";

const getAllUsersService = async () => {
    return await prisma.user.findMany();
};

const getUserByIdService = async (id: number) => {
    return await prisma.user.findUnique({
        where: {
            user_id: id
        }
    });
};

// Lấy tất cả enterprise users
const getEnterpriseUsersService = async () => {
    return await prisma.user.findMany({
        where: {
            role: "enterprise"
        },
        select: {
            user_id: true,
            full_name: true,
            email: true,
            phone: true,
            role: true,
            status: true,
            created_at: true,
            updated_at: true
        },
        orderBy: {
            created_at: "desc"
        }
    });
};

const createUserService = async (data: any) => {
    return await prisma.user.create({
        data
    });
};

const updateUserService = async (
    id: number,
    data: any
) => {
    return await prisma.user.update({
        where: {
            user_id: id
        },
        data
    });
};

const deleteUserService = async (id: number) => {
    return await prisma.user.delete({
        where: {
            user_id: id
        }
    });
};
export { getAllUsersService, getUserByIdService, getEnterpriseUsersService, createUserService, updateUserService, deleteUserService }