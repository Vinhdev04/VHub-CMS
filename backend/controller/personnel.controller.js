import { successResponse } from '../helpers/apiResponse.js';
import {
  getPersonnelList,
  createPersonnelItem,
  updatePersonnelItem,
  deletePersonnelItem,
} from '../helpers/personnel.service.js';

export async function getPersonnelController(req, res, next) {
  try {
    const list = await getPersonnelList();
    return res.json(successResponse(list, 'Lấy danh sách nhân sự thành công'));
  } catch (error) {
    return next(error);
  }
}

export async function createPersonnelItemController(req, res, next) {
  try {
    const person = await createPersonnelItem(req.body);
    return res.status(201).json(successResponse(person, 'Tạo nhân sự thành công'));
  } catch (error) {
    return next(error);
  }
}

export async function updatePersonnelItemController(req, res, next) {
  try {
    const person = await updatePersonnelItem(req.params.id, req.body);
    return res.json(successResponse(person, 'Cập nhật nhân sự thành công'));
  } catch (error) {
    return next(error);
  }
}

export async function deletePersonnelItemController(req, res, next) {
  try {
    const result = await deletePersonnelItem(req.params.id);
    return res.json(successResponse(result, 'Xóa nhân sự thành công'));
  } catch (error) {
    return next(error);
  }
}
