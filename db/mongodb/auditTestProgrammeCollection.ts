import { Filter, WithId, ObjectId } from "mongodb";
import { dbConnection } from "./connection";
import { PaginationRequest } from "@/types/database";
import { AuditTestProgramme, AuditTestProgrammeRoles, LocalAuditTestProgramme } from "@/types/projects/auditTestProgramme";
import { Role, UserWithID } from "@/types/system/user";

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
    const db = await dbConnection()
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
export async function insertOneAuditTestProgramme(data: Partial<LocalAuditTestProgramme>, operatorId: string) {
    if (!data.name) throw new Error("项目名称不能为空");
    if (!data.originFilePath) throw new Error("原始文件路径不能为空");
    if (!data.originFileName) throw new Error("原始文件名不能为空");
    if (!data.newFilePath) throw new Error("新文件路径不能为空");
    if (!data.backupPath) throw new Error("备份路径不能为空");
    if (!data.newFileName) throw new Error("文件上传失败");
    const db = await dbConnection();
    const dictsCollection = db.collection<AuditTestProgramme>('audit_test_programme');
    const date = new Date();
    await dictsCollection.insertOne({
        name: data.name,
        originFilePath: formatFilePath(data.originFilePath),
        originFileName: data.originFileName,
        newFilePath: formatFilePath(data.newFilePath),
        newFileName: data.newFileName,
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

export async function updateOneAuditTestProgramme(data: Partial<LocalAuditTestProgramme>, operatorId: string) {
    if (!data.id) throw new Error("项目ID不能为空");
    if (!data.name) throw new Error("项目名称不能为空");
    if (!data.originFilePath) throw new Error("原始文件路径不能为空");
    if (!data.originFileName) throw new Error("原始文件名不能为空");
    if (!data.newFilePath) throw new Error("新文件路径不能为空");
    if (!data.backupPath) throw new Error("备份路径不能为空");
    if (!data.newFileName) throw new Error("文件上传失败");
    const db = await dbConnection();
    const _id = new ObjectId(data.id);
    const dictsCollection = db.collection<AuditTestProgramme>('audit_test_programme');
    const existingProgramme = await dictsCollection.findOne({ _id });
    if (!existingProgramme) throw new Error("项目不存在");
    const filename = existingProgramme.newFileName === data.newFileName ? existingProgramme.newFileName : null;
    const date = new Date();
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
    return filename
}

export async function signByRoleAuditTestProgramme(data: { id: string, roleName: AuditTestProgrammeRoles }, userData: UserWithID) {
    const { id, roleName } = data;
    if (!id) throw new Error("项目ID不能为空");
    if (!roleName) throw new Error("角色名称不能为空");
    const operatorId = userData.id;
    const roles = userData.roles || [];
    const db = await dbConnection();
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
    if (!id) throw new Error("项目ID不能为空");
    const db = await dbConnection();
    const dictsCollection = db.collection<AuditTestProgramme>('audit_test_programme');
    const _id = new ObjectId(id);
    const existingProgramme = await dictsCollection.findOne({ _id });
    if (!existingProgramme) throw new Error("项目不存在");
    if (existingProgramme.isChecked) throw new Error("项目已审核，无法修改");
    if (!existingProgramme.engineerAudit || !existingProgramme.qualityAudit || !existingProgramme.productionAudit || !existingProgramme.planAudit || !existingProgramme.managerAudit) {
        throw new Error("项目未完成所有审核，无法提交");
    }
    const result = await dictsCollection.updateOne(
        { _id },
        {
            $set: {
                isChecked: true,
                updatedAt: new Date(),
                updatedBy: operatorId
            }
        }
    );
    return existingProgramme
}

export async function deleteOneAuditTestProgramme(id: string, operatorId: string) {
    if (!id) throw new Error("项目ID不能为空");
    const db = await dbConnection();
    const dictsCollection = db.collection<AuditTestProgramme>('audit_test_programme');
    const _id = new ObjectId(id);
    const existingProgramme = await dictsCollection.findOne({ _id });
    if (!existingProgramme) throw new Error("项目不存在");
    if (existingProgramme.isChecked) throw new Error("项目已审核，无法删除");
    await dictsCollection.deleteOne({ _id });
    return existingProgramme.newFileName;
}