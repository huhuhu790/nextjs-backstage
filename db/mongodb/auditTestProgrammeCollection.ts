import { Filter, WithId, ObjectId } from "mongodb";
import { dbConnection, sessionTask } from "./connection";
import { PaginationRequest } from "@/types/database";
import { AuditTestProgramme, AuditTestProgrammeRoles, LocalAuditTestProgramme } from "@/types/projects/auditTestProgramme";
import { Role, UserWithID } from "@/types/system/user";
import { sendEmails } from "@/utils/sendingMail";
import { deleteFile, moveFileFromOriginToBackupPath, moveFileFromTmpToTargetPath } from "@/utils/fileOperations";

function toLocal({ _id, ...rest }: WithId<AuditTestProgramme>) {
    return {
        id: _id.toString(),
        ...rest
    };
}

function toLocalList(dbDicts: WithId<AuditTestProgramme>[]) {
    return dbDicts.map(toLocal);
}

export async function getListbyPageAuditTestProgramme(options?: PaginationRequest) {
    const db = dbConnection()
    const dictsCollection = db.collection<AuditTestProgramme>('audit_test_programme');
    const query: Filter<AuditTestProgramme> = {};
    if (options?.keyword) {
        query.$or = [
            { name: { $regex: options.keyword, $options: 'i' } },
            { description: { $regex: options.keyword, $options: 'i' } }
        ];
    }
    const currentPage = options?.currentPage
    const pageSize = options?.pageSize
    const total = await dictsCollection.countDocuments(query);
    const dicts = currentPage && pageSize ? await dictsCollection.find(query)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .toArray() : await dictsCollection.find(query).toArray();
    return {
        data: toLocalList(dicts),
        total,
        currentPage,
        pageSize
    };
}
function formatFilePath(filePath: string) {
    return filePath.replace(/\\/g, '/').replace(/\.\./g, '');
}
export async function insertOneAuditTestProgramme(data: LocalAuditTestProgramme, operatorId: string) {
    const db = dbConnection();
    const dictsCollection = db.collection<AuditTestProgramme>('audit_test_programme');
    const date = new Date();
    await dictsCollection.insertOne({
        name: data.name,
        originFilePath: formatFilePath(data.originFilePath),
        originFileName: data.originFileName,
        newFilePath: formatFilePath(data.newFilePath),
        newFileName: decodeURIComponent(data.newFileName),
        backupPath: formatFilePath(data.backupPath),
        engineerAudit: false,
        qualityAudit: false,
        productionAudit: false,
        planAudit: false,
        managerAudit: false,
        isChecked: false,
        createdAt: date,
        createdBy: operatorId,
        updatedAt: date,
        updatedBy: operatorId,
        isDeleted: false,
        isActive: true,
        deletedAt: null,
        deletedBy: null
    });
}

export async function updateOneAuditTestProgramme(data: LocalAuditTestProgramme, operatorId: string) {
    const db = dbConnection();
    const _id = new ObjectId(data.id);
    const dictsCollection = db.collection<AuditTestProgramme>('audit_test_programme');
    const existingProgramme = await dictsCollection.findOne({ _id });
    if (!existingProgramme) throw new Error("项目不存在");
    const filename = existingProgramme.newFileName === data.newFileName ? existingProgramme.newFileName : null;
    const date = new Date();
    return await sessionTask(async () => {
        await dictsCollection.updateOne(
            { _id },
            {
                $set: {
                    name: data.name,
                    originFilePath: formatFilePath(data.originFilePath),
                    originFileName: data.originFileName,
                    newFilePath: formatFilePath(data.newFilePath),
                    newFileName: data.newFileName,
                    backupPath: formatFilePath(data.backupPath),
                    updatedAt: date,
                    updatedBy: operatorId
                }
            }
        );
        filename && await deleteFile(filename);
    });
}

export async function signByRoleAuditTestProgramme({ id, roleName }: { id: string, roleName: AuditTestProgrammeRoles }, userData: UserWithID) {
    const operatorId = userData.id;
    const roles = userData.roles || [];
    const db = dbConnection();
    const dictsCollection = db.collection<AuditTestProgramme>('audit_test_programme');
    const _id = new ObjectId(id);
    const existingProgramme = await dictsCollection.findOne({ _id });
    if (!existingProgramme) throw new Error("项目不存在");
    if (existingProgramme.isChecked) throw new Error("项目已审核，无法修改");
    const roleCollection = db.collection<Role>('roles');
    const role = await roleCollection.findOne({ name: roleName });
    if (!role) throw new Error("角色不存在");
    if (!roles.includes(role._id.toString())) throw new Error("角色不匹配");
    const item: Partial<AuditTestProgramme> = {
        updatedAt: new Date(),
        updatedBy: operatorId
    }
    switch (roleName) {
        case '工程':
            item.engineerAudit = true;
            break;
        case '品质':
            item.qualityAudit = true;
            break;
        case '生产':
            item.productionAudit = true;
            break;
        case '计划':
            item.planAudit = true;
            break;
        case '总经理':
            item.managerAudit = true;
            break;
    }
    await dictsCollection.updateOne(
        { _id },
        {
            $set: item
        }
    );
}

export async function checkAuditTestProgramme(id: string, operatorId: string) {
    const db = dbConnection();
    const dictsCollection = db.collection<AuditTestProgramme>('audit_test_programme');
    const _id = new ObjectId(id);
    const existingProgramme = await dictsCollection.findOne({ _id });
    if (!existingProgramme) throw new Error("项目不存在");
    if (existingProgramme.isChecked) throw new Error("项目已审核，无法修改");
    if (!existingProgramme.engineerAudit || !existingProgramme.qualityAudit || !existingProgramme.productionAudit || !existingProgramme.planAudit || !existingProgramme.managerAudit) {
        throw new Error("项目未完成所有审核，无法提交");
    }
    return await sessionTask(async () => {
        await dictsCollection.updateOne(
            { _id },
            {
                $set: {
                    isChecked: true,
                    updatedAt: new Date(),
                    updatedBy: operatorId
                }
            }
        );
        await moveFileFromOriginToBackupPath(existingProgramme.originFilePath, existingProgramme.backupPath, existingProgramme.originFileName);
        const originalFileName = await moveFileFromTmpToTargetPath(existingProgramme.newFilePath, existingProgramme.newFileName);
        await sendEmails("测试程序文件更新", `更新程序名：${originalFileName}`)
        return existingProgramme
    })
}

export async function deleteOneAuditTestProgramme(id: string, operatorId: string) {
    const db = dbConnection();
    const dictsCollection = db.collection<AuditTestProgramme>('audit_test_programme');
    const _id = new ObjectId(id);
    const existingProgramme = await dictsCollection.findOne({ _id });
    if (!existingProgramme) throw new Error("项目不存在");
    if (existingProgramme.isChecked) throw new Error("项目已审核，无法删除");
    return await sessionTask(async () => {
        await dictsCollection.deleteOne({ _id });
        await deleteFile(existingProgramme.newFileName);
    })
}